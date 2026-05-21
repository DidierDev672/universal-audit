/** Respuesta común al guardar markdown en Supabase */
export interface N8nMarkdownStoredResult {
  filename: string;
  contentLength: number;
  documentId: string;
  webhookLogId: string;
  task?: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

export interface N8nApiSuccess<T> {
  success: true;
  data: T;
}

/** POST webhook-test/gemini-task */
export interface N8nGeminiTaskRequest {
  message: string;
}

export interface N8nGeminiTaskResponse {
  message: string;
}

/** POST /send — texto saliente */
export interface N8nSendTextRequest {
  text: string;
  metadata?: Record<string, unknown>;
}

export interface N8nSendTextResult {
  text: string;
  metadata?: Record<string, unknown>;
  exchangeId: string;
  webhookLogId: string;
}

/** POST /receive — payload Gemini */
export interface N8nGeminiReceiveRequest {
  task: string;
  gemini_response: {
    content: {
      parts: Array<{ text?: string; thoughtSignature?: string }>;
      role?: string;
    };
    finishReason?: string;
    index?: number;
  };
  timestamp?: string;
  filename?: string;
  metadata?: Record<string, unknown>;
}

/** POST /markdown/upload — subida directa */
export interface N8nMarkdownUploadRequest {
  filename: string;
  content: string;
  metadata?: Record<string, unknown>;
}

/** Fila de Supabase para listados en UI */
export interface N8nMarkdownDocumentRow {
  id: string;
  webhook_log_id: string | null;
  filename: string;
  content: string;
  content_length: number;
  source_type: "gemini" | "direct_upload" | "legacy_text";
  task: string | null;
  source_timestamp: string | null;
  gemini_finish_reason: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}
