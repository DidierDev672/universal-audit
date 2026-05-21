export interface AiAnalysisNoteColor {
  name: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

export interface AiAnalysisNote {
  id: string;
  analysisId: string;
  content: string;
  context: string;
  colorName: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  createdAt: string;
  updatedAt: string;
}
