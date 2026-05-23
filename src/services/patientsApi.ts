import axios from "axios";
import { useAuthStore } from "@/core/login/presentation/store/authStore";

export const PATIENTS_API = "http://localhost:3000/api/v1/patients";

export interface PatientSummary {
  id: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
}

function authHeaders(contentType?: string): Record<string, string> {
  const store = useAuthStore();
  const token = store.authToken ?? localStorage.getItem("auth_token");
  const headers: Record<string, string> = {};
  if (contentType) headers["Content-Type"] = contentType;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function mapPatient(raw: Record<string, unknown>): PatientSummary {
  return {
    id: String(raw.id ?? ""),
    fullName: String(raw.fullName ?? raw.full_name ?? ""),
    documentType: String(raw.documentType ?? raw.document_type ?? ""),
    documentNumber: String(raw.documentNumber ?? raw.document_number ?? ""),
    birthDate: String(raw.birthDate ?? raw.birth_date ?? "").slice(0, 10),
  };
}

/** GET /api/v1/patients/search?name= */
export async function searchPatientsByName(
  name: string,
): Promise<PatientSummary[]> {
  const q = name.trim();
  if (q.length < 2) return [];

  const { data } = await axios.get<unknown>(`${PATIENTS_API}/search`, {
    params: { name: q },
    headers: authHeaders(),
  });

  const list = Array.isArray(data) ? data : [];
  return list
    .filter((row): row is Record<string, unknown> => !!row && typeof row === "object")
    .map(mapPatient)
    .filter((p) => p.id && p.fullName);
}

/** GET /api/v1/patients */
export async function listPatients(): Promise<PatientSummary[]> {
  const { data } = await axios.get<unknown>(PATIENTS_API, {
    headers: authHeaders(),
  });
  const list = Array.isArray(data) ? data : [];
  return list
    .filter((row): row is Record<string, unknown> => !!row && typeof row === "object")
    .map(mapPatient)
    .filter((p) => p.id && p.fullName);
}
