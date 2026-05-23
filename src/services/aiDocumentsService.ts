import { supabase } from "@/services/supabase";
import {
  uploadAiDocumentViaApi,
  queueAiAnalysisViaApi,
  type PatientDocumentContext,
} from "@/services/aiDocumentUploadsApi";

export type AiDocumentFileType = "pdf" | "word";

export interface AiDocumentPatientInfo {
  patientId?: string | null;
  patientName: string;
  patientDocumentType?: string | null;
  patientDocumentNumber?: string | null;
  patientBirthDate?: string | null;
}

export interface AiDocumentUploadRow {
  id: string;
  storage_bucket: string;
  storage_object_path: string;
  original_filename: string;
  mime_type: string;
  file_size_bytes: number | null;
  file_type: AiDocumentFileType;
  user_id: string | null;
  client_user_id: string | null;
  patient_id?: string | null;
  patient_name?: string | null;
  patient_document_type?: string | null;
  patient_document_number?: string | null;
  patient_birth_date?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AiDocumentAnalysisRow {
  id: string;
  document_upload_id: string;
  response_text: string | null;
  raw_response: Record<string, unknown>;
  model_name: string | null;
  status: string;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

/** Documento con análisis asociados (consulta anidada Supabase) */
export interface AiDocumentUploadWithAnalysis extends AiDocumentUploadRow {
  ai_document_analysis: AiDocumentAnalysisRow[];
}

const BUCKET = "ai-documents";

function sanitizeFilename(name: string): string {
  return name.replace(/[^\w.-]+/g, "_");
}

export function inferDocumentFileType(file: File): AiDocumentFileType | null {
  const lower = file.name.toLowerCase();
  const t = file.type;
  if (t === "application/pdf" || lower.endsWith(".pdf")) return "pdf";
  if (
    t === "application/msword" ||
    t ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lower.endsWith(".doc") ||
    lower.endsWith(".docx")
  ) {
    return "word";
  }
  return null;
}

function mapApiRowToUploadRow(
  row: import("@/services/aiDocumentUploadsApi").AiDocumentUploadApiRow,
): AiDocumentUploadRow {
  return {
    id: row.id,
    storage_bucket: row.storage_bucket,
    storage_object_path: row.storage_object_path,
    original_filename: row.original_filename,
    mime_type: row.mime_type,
    file_size_bytes: row.file_size_bytes,
    file_type: row.file_type,
    user_id: null,
    client_user_id: row.client_user_id,
    patient_id: row.patient_id,
    patient_name: row.patient_name,
    patient_document_type: row.patient_document_type,
    patient_document_number: row.patient_document_number,
    patient_birth_date: row.patient_birth_date,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/** Sube vía API REST (recomendado) con datos del paciente */
export async function storeAiDocument(
  file: File,
  clientUserId: string | null,
  patient: AiDocumentPatientInfo,
): Promise<AiDocumentUploadRow> {
  const context: PatientDocumentContext = {
    patientId: patient.patientId ?? null,
    patientName: patient.patientName.trim(),
    patientDocumentType: patient.patientDocumentType ?? null,
    patientDocumentNumber: patient.patientDocumentNumber ?? null,
    patientBirthDate: patient.patientBirthDate ?? null,
  };

  try {
    const apiRow = await uploadAiDocumentViaApi(file, context, clientUserId);
    return mapApiRowToUploadRow(apiRow);
  } catch (apiError) {
    console.warn("[ai-documents] API upload falló, intento Supabase directo:", apiError);
    return storeAiDocumentDirect(file, clientUserId, patient);
  }
}

/** Respaldo: Storage + Supabase directo */
async function storeAiDocumentDirect(
  file: File,
  clientUserId: string | null,
  patient: AiDocumentPatientInfo,
): Promise<AiDocumentUploadRow> {
  const fileType = inferDocumentFileType(file);
  if (!fileType) {
    throw new Error("Solo se permiten archivos PDF o Word (.doc, .docx)");
  }

  const docId = crypto.randomUUID();
  const safeName = sanitizeFilename(file.name);
  const path = `${docId}/${safeName}`;

  const mime =
    file.type ||
    (fileType === "pdf"
      ? "application/pdf"
      : "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: mime,
    });

  if (uploadError) {
    console.error("[ai-documents] Storage:", uploadError);
    throw new Error(uploadError.message);
  }

  const { data, error } = await supabase
    .from("ai_document_uploads")
    .insert({
      storage_bucket: BUCKET,
      storage_object_path: path,
      original_filename: file.name,
      mime_type: mime,
      file_size_bytes: file.size,
      file_type: fileType,
      client_user_id: clientUserId,
      patient_id: patient.patientId ?? null,
      patient_name: patient.patientName.trim(),
      patient_document_type: patient.patientDocumentType ?? null,
      patient_document_number: patient.patientDocumentNumber ?? null,
      patient_birth_date: patient.patientBirthDate ?? null,
      status: "uploaded",
    })
    .select()
    .single();

  if (error) {
    console.error("[ai-documents] DB:", error);
    await supabase.storage.from(BUCKET).remove([path]);
    throw new Error(error.message);
  }

  return data as AiDocumentUploadRow;
}

/** Crea registros de análisis pendientes (conectar luego Edge Function / n8n / IA) */
export async function queueAiAnalysisForDocuments(
  documentUploadIds: string[],
): Promise<AiDocumentAnalysisRow[]> {
  if (documentUploadIds.length === 0) {
    throw new Error("No hay documentos para analizar");
  }

  const viaApi: AiDocumentAnalysisRow[] = [];
  let useDirect = false;

  for (const id of documentUploadIds) {
    try {
      const queued = await queueAiAnalysisViaApi(id);
      viaApi.push({
        id: queued.id,
        document_upload_id: queued.document_upload_id,
        response_text: null,
        raw_response: {},
        model_name: null,
        status: queued.status,
        error_message: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } catch {
      useDirect = true;
      break;
    }
  }

  if (!useDirect && viaApi.length === documentUploadIds.length) {
    return viaApi;
  }

  const rows = documentUploadIds.map((document_upload_id) => ({
    document_upload_id,
    status: "pending" as const,
    raw_response: {},
  }));

  const { data, error } = await supabase
    .from("ai_document_analysis")
    .insert(rows)
    .select();

  if (error) {
    console.error("[ai-documents] analysis queue:", error);
    throw new Error(error.message);
  }

  return data as AiDocumentAnalysisRow[];
}

/** Lista todos los documentos almacenados, más recientes primero */
export async function listAiDocuments(): Promise<AiDocumentUploadWithAnalysis[]> {
  const { data, error } = await supabase
    .from("ai_document_uploads")
    .select("*, ai_document_analysis(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[ai-documents] list:", error);
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    ...row,
    ai_document_analysis: row.ai_document_analysis ?? [],
  })) as AiDocumentUploadWithAnalysis[];
}

/** URL firmada temporal para descargar / abrir el archivo en Storage */
export async function getDocumentDownloadUrl(
  doc: Pick<AiDocumentUploadRow, "storage_bucket" | "storage_object_path">,
  expiresInSeconds = 3600,
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(doc.storage_bucket)
    .createSignedUrl(doc.storage_object_path, expiresInSeconds);

  if (error || !data?.signedUrl) {
    console.error("[ai-documents] signed url:", error);
    throw new Error(error?.message ?? "No se pudo generar el enlace de descarga");
  }

  return data.signedUrl;
}

/** Descarga el archivo desde Storage como objeto File */
export async function downloadDocumentFile(
  doc: Pick<
    AiDocumentUploadRow,
    "storage_bucket" | "storage_object_path" | "original_filename" | "mime_type"
  >,
): Promise<File> {
  const { data, error } = await supabase.storage
    .from(doc.storage_bucket)
    .download(doc.storage_object_path);

  if (error || !data) {
    console.error("[ai-documents] download:", error);
    throw new Error(error?.message ?? "No se pudo descargar el documento");
  }

  return new File([data], doc.original_filename, { type: doc.mime_type });
}

const GEMINI_MODEL_NAME = "gemini-3-flash-preview";

/** Guarda la respuesta de IA y marca el documento como analizado */
export async function saveCompletedAiAnalysis(
  documentUploadId: string,
  responseText: string,
  modelName = GEMINI_MODEL_NAME,
): Promise<AiDocumentAnalysisRow> {
  const { data, error } = await supabase
    .from("ai_document_analysis")
    .insert({
      document_upload_id: documentUploadId,
      response_text: responseText,
      raw_response: {
        source: "useGetGenerativeModelGP",
        savedAt: new Date().toISOString(),
      },
      model_name: modelName,
      status: "completed",
    })
    .select()
    .single();

  if (error) {
    console.error("[ai-documents] save analysis:", error);
    throw new Error(error.message);
  }

  await markDocumentAsAnalyzed(documentUploadId);

  return data as AiDocumentAnalysisRow;
}

/** Actualiza un análisis ya guardado (p. ej. re-guardar desde el modal) */
export async function updateAiAnalysis(
  analysisId: string,
  documentUploadId: string,
  responseText: string,
  modelName = GEMINI_MODEL_NAME,
): Promise<AiDocumentAnalysisRow> {
  const { data, error } = await supabase
    .from("ai_document_analysis")
    .update({
      response_text: responseText,
      model_name: modelName,
      status: "completed",
      error_message: null,
      raw_response: {
        source: "useGetGenerativeModelGP",
        savedAt: new Date().toISOString(),
        updated: true,
      },
    })
    .eq("id", analysisId)
    .select()
    .single();

  if (error) {
    console.error("[ai-documents] update analysis:", error);
    throw new Error(error.message);
  }

  await markDocumentAsAnalyzed(documentUploadId);

  return data as AiDocumentAnalysisRow;
}

/**
 * Persiste el análisis del modal: inserta o actualiza según analysisId.
 * Usado por el botón «Guardar» en AiDocumentList.vue.
 */
export async function persistAiAnalysisFromModal(
  documentUploadId: string,
  responseText: string,
  existingAnalysisId?: string | null,
): Promise<AiDocumentAnalysisRow> {
  const text = responseText.trim();
  if (!text) {
    throw new Error("No hay contenido de análisis para guardar");
  }

  if (existingAnalysisId) {
    return updateAiAnalysis(existingAnalysisId, documentUploadId, text);
  }

  return saveCompletedAiAnalysis(documentUploadId, text);
}

async function markDocumentAsAnalyzed(documentUploadId: string): Promise<void> {
  const { error: statusError } = await supabase
    .from("ai_document_uploads")
    .update({ status: "analyzed" })
    .eq("id", documentUploadId);

  if (statusError) {
    console.error("[ai-documents] update status:", statusError);
  }
}

/** Registra un análisis fallido */
export async function saveFailedAiAnalysis(
  documentUploadId: string,
  errorMessage: string,
): Promise<void> {
  await supabase.from("ai_document_analysis").insert({
    document_upload_id: documentUploadId,
    status: "failed",
    error_message: errorMessage,
    raw_response: {},
  });

  await supabase
    .from("ai_document_uploads")
    .update({ status: "error" })
    .eq("id", documentUploadId);
}

export { BUCKET as AI_DOCUMENTS_BUCKET, GEMINI_MODEL_NAME };
