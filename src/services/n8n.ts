import axios from "axios";
import type {
  N8nApiSuccess,
  N8nGeminiReceiveRequest,
  N8nGeminiTaskRequest,
  N8nGeminiTaskResponse,
  N8nMarkdownStoredResult,
  N8nMarkdownUploadRequest,
  N8nSendTextRequest,
  N8nSendTextResult,
} from "@/types/n8n";

const N8N_BASE = import.meta.env.VITE_N8N_BASE_URL ?? "/n8n/webhook";

const GEMINI_TASK_URL =
  import.meta.env.VITE_N8N_GEMINI_TASK_URL ??
  "/n8n-webhook-test/gemini-task";

const client = axios.create({
  baseURL: N8N_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

export interface N8nResponse<T = unknown> {
  ok: boolean;
  data: T | null;
  error: string | null;
}

function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const body = err.response?.data;
    if (body && typeof body === "object" && "message" in body) {
      return String((body as { message: unknown }).message);
    }
    return err.message;
  }
  return err instanceof Error ? err.message : "Error desconocido";
}

async function post<T>(
  path: string,
  payload: unknown,
): Promise<N8nResponse<T>> {
  try {
    const { data } = await client.post<T>(path, payload);
    return { ok: true, data, error: null };
  } catch (err: unknown) {
    const msg = errorMessage(err);
    console.error(`[n8n] Error en ${path}:`, msg);
    return { ok: false, data: null, error: msg };
  }
}

async function postUrl<T>(
  url: string,
  payload: unknown,
): Promise<N8nResponse<T>> {
  try {
    const { data } = await axios.post<T>(url, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 15_000,
    });
    return { ok: true, data, error: null };
  } catch (err: unknown) {
    const msg = errorMessage(err);
    console.error(`[n8n] Error en ${url}:`, msg);
    return { ok: false, data: null, error: msg };
  }
}

async function postApi<T>(
  path: string,
  payload: unknown,
): Promise<N8nResponse<T>> {
  const res = await post<N8nApiSuccess<T>>(path, payload);
  if (!res.ok || !res.data) return { ok: false, data: null, error: res.error };

  if (res.data.success !== true) {
    return { ok: false, data: null, error: "Respuesta inválida del webhook" };
  }

  return { ok: true, data: res.data.data, error: null };
}

async function dispararWorkflow<T>(
  path: string,
  payload: Record<string, unknown>,
): Promise<N8nResponse<T>> {
  return post<T>(path, payload);
}

export const n8nService = {
  /** POST webhook-test/gemini-task */
  geminiTask: (body: N8nGeminiTaskRequest) =>
    postUrl<N8nGeminiTaskResponse>(GEMINI_TASK_URL, body),

  /** POST /send — texto saliente */
  sendText: (body: N8nSendTextRequest) =>
    postApi<N8nSendTextResult>("send", body),

  /** POST /receive — payload Gemini */
  receiveGemini: (body: N8nGeminiReceiveRequest) =>
    postApi<N8nMarkdownStoredResult>("receive", body),

  /** POST /markdown/upload — subida directa */
  uploadMarkdown: (body: N8nMarkdownUploadRequest) =>
    postApi<N8nMarkdownStoredResult>("markdown/upload", body),

  formularioContacto: (datos: {
    nombre: string;
    email: string;
    mensaje: string;
  }) => dispararWorkflow<void>("formulario-contacto", datos),

  notificar: (tipo: string, contenido: Record<string, unknown>) =>
    dispararWorkflow<void>("notificar", { tipo, contenido }),

  procesarArchivo: (url: string, tipo: string) =>
    dispararWorkflow<void>("procesar-archivo", { url, tipo }),

  ejecutar: <T>(workflow: string, datos: Record<string, unknown>) =>
    dispararWorkflow<T>(workflow, datos),
};
