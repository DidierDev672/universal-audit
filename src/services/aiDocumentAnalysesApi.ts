import axios from "axios";
import { useAuthStore } from "@/core/login/presentation/store/authStore";

export const AI_DOCUMENT_ANALYSES_API =
  "http://localhost:3000/api/v1/ai-document-analyses/";

export const AI_DOCUMENT_REDACTIONS_API =
  "http://localhost:3000/api/v1/ai-document-redactions/";

export const GEMINI_MODEL_NAME = "gemini-3-flash-preview";

export interface AiDocumentAnalysisListItem {
  id: string;
  document_upload_id: string;
  content: string;
  model: string | null;
  status: string | null;
  original_filename: string | null;
  created_at: string | null;
  updated_at: string | null;
}

function authHeaders(): Record<string, string> {
  const store = useAuthStore();
  const token = store.authToken ?? localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function normalizeItem(raw: unknown): AiDocumentAnalysisListItem | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const id = String(r.id ?? "");
  const document_upload_id = String(
    r.document_upload_id ?? r.documentUploadId ?? "",
  );
  const content = String(
    r.content ?? r.response_text ?? r.responseText ?? "",
  );

  if (!id) return null;

  return {
    id,
    document_upload_id,
    content,
    model: r.model != null ? String(r.model) : (r.model_name != null ? String(r.model_name) : null),
    status: r.status != null ? String(r.status) : null,
    original_filename:
      r.original_filename != null
        ? String(r.original_filename)
        : r.originalFilename != null
          ? String(r.originalFilename)
          : null,
    created_at:
      r.created_at != null
        ? String(r.created_at)
        : r.createdAt != null
          ? String(r.createdAt)
          : null,
    updated_at:
      r.updated_at != null
        ? String(r.updated_at)
        : r.updatedAt != null
          ? String(r.updatedAt)
          : null,
  };
}

function extractListPayload(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    for (const key of ["data", "body", "analyses", "items", "results"]) {
      if (Array.isArray(o[key])) return o[key] as unknown[];
    }
  }
  return [];
}

export function readAiAnalysesApiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const d = err.response?.data;
    if (d && typeof d === "object") {
      const body = d as {
        message?: string;
        error?: string;
        code?: string;
        details?: { field?: string };
      };
      if (body.code === "UNAUTHORIZED" || err.response?.status === 401) {
        return body.message ?? "Inicia sesión de nuevo.";
      }
      if (body.code === "VALIDATION_ERROR" && body.details?.field) {
        return `${body.message ?? "Validación"} (${body.details.field})`;
      }
      if (body.message) return String(body.message);
      if (body.error) return String(body.error);
    }
    return err.message;
  }
  return err instanceof Error ? err.message : "Error al cargar análisis";
}

/** GET /api/v1/ai-document-analyses/ */
export async function listAiDocumentAnalyses(): Promise<AiDocumentAnalysisListItem[]> {
  const token = useAuthStore().authToken ?? localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("Debes iniciar sesión para ver los análisis.");
  }

  const { data } = await axios.get<unknown>(AI_DOCUMENT_ANALYSES_API, {
    headers: authHeaders(),
  });

  return extractListPayload(data)
    .map(normalizeItem)
    .filter((x): x is AiDocumentAnalysisListItem => x !== null)
    .sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
      return tb - ta;
    });
}

export interface AiDocumentRedactionSavePayload {
  document_upload_id: string;
  analysis_id: string;
  content: string;
  model: string;
  notes_count: number;
  redaction_id?: string | null;
  original_filename?: string;
}

export interface AiDocumentRedactionSaveResponse {
  id?: string;
  document_upload_id?: string;
  analysis_id?: string;
  status?: string;
}

/** POST /api/v1/ai-document-redactions/ — guardar redacción con IA */
export async function saveAiDocumentRedaction(
  payload: AiDocumentRedactionSavePayload,
): Promise<AiDocumentRedactionSaveResponse> {
  const token = useAuthStore().authToken ?? localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("Debes iniciar sesión para guardar la redacción.");
  }

  const { data } = await axios.post<AiDocumentRedactionSaveResponse>(
    AI_DOCUMENT_REDACTIONS_API,
    payload,
    { headers: authHeaders() },
  );

  return data ?? {};
}
