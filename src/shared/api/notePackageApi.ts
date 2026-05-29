import axios from "axios";
import { useAuthStore } from "@/core/login/presentation/store/authStore";
import type {
  CreateNotePackageAnalysisLogPayload,
  CreateNotePackagePayload,
  NotePackageAnalysisLogRecord,
  NotePackageDetail,
  NotePackageRecord,
} from "../types/notePackage";

const API_BASE = "http://localhost:3000/api/v1";
const BASE = `${API_BASE}/note-packages`;

function authHeaders(): Record<string, string> {
  const store = useAuthStore();
  const token = store.authToken ?? localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function getNotePackages(): Promise<NotePackageRecord[]> {
  const { data } = await axios.get<NotePackageRecord[]>(BASE, {
    headers: authHeaders(),
  });
  return Array.isArray(data) ? data : [];
}

export async function getNotePackageById(id: string): Promise<NotePackageDetail> {
  const { data } = await axios.get<NotePackageDetail>(`${BASE}/${encodeURIComponent(id)}`, {
    headers: authHeaders(),
  });
  return data;
}

export async function createNotePackage(
  payload: CreateNotePackagePayload,
): Promise<NotePackageDetail> {
  const { data } = await axios.post<NotePackageDetail>(BASE, payload, {
    headers: authHeaders(),
  });
  return data;
}

export async function getNotePackageAnalysisLogs(
  notePackageId: string,
): Promise<NotePackageAnalysisLogRecord[]> {
  const { data } = await axios.get<NotePackageAnalysisLogRecord[]>(
    `${BASE}/analysis-logs`,
    {
      headers: authHeaders(),
      params: { note_package_id: notePackageId },
    },
  );
  return Array.isArray(data) ? data : [];
}

export async function createNotePackageAnalysisLog(
  payload: CreateNotePackageAnalysisLogPayload,
): Promise<NotePackageAnalysisLogRecord> {
  const { data } = await axios.post<NotePackageAnalysisLogRecord>(
    `${BASE}/analysis-logs`,
    payload,
    { headers: authHeaders() },
  );
  return data;
}
