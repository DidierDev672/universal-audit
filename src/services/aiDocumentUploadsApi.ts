import axios from "axios";
import { useAuthStore } from "@/core/login/presentation/store/authStore";
import type { AiDocumentFileType } from "@/services/aiDocumentsService";

export const AI_DOCUMENT_UPLOADS_API =
  "http://localhost:3000/api/v1/ai-document-uploads/";

export interface PatientDocumentContext {
  patientId?: string | null;
  patientName: string;
  patientDocumentType?: string | null;
  patientDocumentNumber?: string | null;
  patientBirthDate?: string | null;
}

export interface AiDocumentUploadApiRow {
  id: string;
  storage_bucket: string;
  storage_object_path: string;
  original_filename: string;
  mime_type: string;
  file_size_bytes: number | null;
  file_type: AiDocumentFileType;
  client_user_id: string | null;
  patient_id: string | null;
  patient_name: string;
  patient_document_type: string | null;
  patient_document_number: string | null;
  patient_birth_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface UploadAiImageBatchInput {
  files: File[];
  patientName: string;
  patientId?: string | null;
  clientUserId?: string | null;
}

function authHeaders(): Record<string, string> {
  const store = useAuthStore();
  const token = store.authToken ?? localStorage.getItem("auth_token");
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function normalizeUpload(raw: unknown): AiDocumentUploadApiRow | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const wrapped = r.data && typeof r.data === "object" ? (r.data as Record<string, unknown>) : r;
  const id = String(wrapped.id ?? "");
  if (!id) return null;

  return {
    id,
    storage_bucket: String(wrapped.storage_bucket ?? "ai-documents"),
    storage_object_path: String(wrapped.storage_object_path ?? ""),
    original_filename: String(wrapped.original_filename ?? ""),
    mime_type: String(wrapped.mime_type ?? ""),
    file_size_bytes:
      wrapped.file_size_bytes != null ? Number(wrapped.file_size_bytes) : null,
    file_type: (wrapped.file_type as AiDocumentFileType) ?? "pdf",
    client_user_id:
      wrapped.client_user_id != null ? String(wrapped.client_user_id) : null,
    patient_id: wrapped.patient_id != null ? String(wrapped.patient_id) : null,
    patient_name: String(wrapped.patient_name ?? ""),
    patient_document_type:
      wrapped.patient_document_type != null
        ? String(wrapped.patient_document_type)
        : null,
    patient_document_number:
      wrapped.patient_document_number != null
        ? String(wrapped.patient_document_number)
        : null,
    patient_birth_date:
      wrapped.patient_birth_date != null
        ? String(wrapped.patient_birth_date)
        : null,
    status: String(wrapped.status ?? "uploaded"),
    created_at: String(wrapped.created_at ?? ""),
    updated_at: String(wrapped.updated_at ?? ""),
  };
}

export function readUploadApiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const d = err.response?.data;
    if (d && typeof d === "object") {
      const body = d as { message?: string; error?: string };
      if (body.message) return String(body.message);
      if (body.error) return String(body.error);
    }
    if (err.response?.status === 401) {
      return "Debes iniciar sesión para subir documentos.";
    }
    return err.message;
  }
  return err instanceof Error ? err.message : "Error al subir documento";
}

/** POST /api/v1/ai-document-uploads/ (multipart) */
export async function uploadAiDocumentViaApi(
  file: File,
  patient: PatientDocumentContext,
  clientUserId?: string | null,
): Promise<AiDocumentUploadApiRow> {
  const token = useAuthStore().authToken ?? localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("Debes iniciar sesión para almacenar documentos.");
  }

  const form = new FormData();
  form.append("file", file);
  if (patient.patientId) form.append("patient_id", patient.patientId);
  form.append("patient_name", patient.patientName.trim());
  if (patient.patientDocumentType) {
    form.append("patient_document_type", patient.patientDocumentType);
  }
  if (patient.patientDocumentNumber) {
    form.append("patient_document_number", patient.patientDocumentNumber);
  }
  if (patient.patientBirthDate) {
    form.append("patient_birth_date", patient.patientBirthDate);
  }
  if (clientUserId) form.append("client_user_id", clientUserId);

  const { data } = await axios.post<unknown>(AI_DOCUMENT_UPLOADS_API, form, {
    headers: authHeaders(),
  });

  const payload =
    data && typeof data === "object" && "data" in (data as object)
      ? (data as Record<string, unknown>).data
      : data;

  const row = normalizeUpload(payload);
  if (!row) {
    throw new Error("Respuesta inválida del servidor al subir documento");
  }
  return row;
}

/** POST múltiples imágenes en lote */
export async function uploadAiImagesViaApi(
  input: UploadAiImageBatchInput,
): Promise<AiDocumentUploadApiRow[]> {
  if (input.files.length === 0) return [];
  const patientName = input.patientName.trim();
  if (!patientName) {
    throw new Error("El nombre del paciente es requerido para almacenar imágenes.");
  }

  const uploads: AiDocumentUploadApiRow[] = [];
  for (const file of input.files) {
    if (!file.type.startsWith("image/")) {
      throw new Error(`Archivo no válido para imagen: ${file.name}`);
    }
    const row = await uploadAiDocumentViaApi(
      file,
      {
        patientId: input.patientId ?? null,
        patientName,
      },
      input.clientUserId ?? null,
    );
    uploads.push(row);
  }
  return uploads;
}

/** POST /api/v1/ai-document-uploads/:id/queue-analysis */
export async function queueAiAnalysisViaApi(
  documentUploadId: string,
): Promise<{ id: string; document_upload_id: string; status: string }> {
  const token = useAuthStore().authToken ?? localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("Debes iniciar sesión para encolar análisis.");
  }

  const { data } = await axios.post<unknown>(
    `${AI_DOCUMENT_UPLOADS_API}${encodeURIComponent(documentUploadId)}/queue-analysis`,
    {},
    { headers: { ...authHeaders(), "Content-Type": "application/json" } },
  );

  const body =
    data && typeof data === "object"
      ? ((data as Record<string, unknown>).data ?? data)
      : null;

  if (!body || typeof body !== "object") {
    throw new Error("Respuesta inválida al encolar análisis");
  }

  const b = body as Record<string, unknown>;
  return {
    id: String(b.id ?? ""),
    document_upload_id: String(b.document_upload_id ?? documentUploadId),
    status: String(b.status ?? "pending"),
  };
}

/** GET /api/v1/ai-document-uploads/ */
export async function listAiDocumentUploadsViaApi(): Promise<AiDocumentUploadApiRow[]> {
  const { data } = await axios.get<unknown>(AI_DOCUMENT_UPLOADS_API, {
    headers: authHeaders(),
  });

  const payload =
    data && typeof data === "object" && Array.isArray((data as Record<string, unknown>).data)
      ? (data as Record<string, unknown>).data
      : data;

  if (!Array.isArray(payload)) return [];

  return payload
    .map(normalizeUpload)
    .filter((row): row is AiDocumentUploadApiRow => row !== null);
}
