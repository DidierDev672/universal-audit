import axios from "axios";
import { useAuthStore } from "@/core/login/presentation/store/authStore";
import type {
  AiDocumentAnalysisNoteRecord,
  CreateAiDocumentAnalysisNotePayload,
} from "../types/aiDocumentAnalysisNote";

const API_BASE = "http://localhost:3000/api/v1";
const NOTES_BASE = `${API_BASE}/ai-document-analysis-notes`;

function authHeaders(): Record<string, string> {
  const store = useAuthStore();
  const token = store.authToken ?? localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function getAiDocumentAnalysisNotes(
  aiDocumentAnalysisId: string,
): Promise<AiDocumentAnalysisNoteRecord[]> {
  const { data } = await axios.get<AiDocumentAnalysisNoteRecord[]>(NOTES_BASE, {
    headers: authHeaders(),
    params: { ai_document_analysis_id: aiDocumentAnalysisId },
  });
  return Array.isArray(data) ? data : [];
}

export async function createAiDocumentAnalysisNote(
  payload: CreateAiDocumentAnalysisNotePayload,
): Promise<AiDocumentAnalysisNoteRecord> {
  const { data } = await axios.post<AiDocumentAnalysisNoteRecord>(
    NOTES_BASE,
    payload,
    { headers: authHeaders() },
  );
  return data;
}
