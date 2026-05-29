export interface AiDocumentAnalysisNoteRecord {
  id: string;
  ai_document_analysis_id: string;
  content: string;
  color: string;
  color_name: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateAiDocumentAnalysisNotePayload {
  ai_document_analysis_id: string;
  content: string;
  color: string;
  color_name: string;
  created_at?: string;
}
