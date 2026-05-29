export interface NotePackageItemRecord {
  id: string;
  notePackageId: string;
  subject: string;
  content: string;
  color: string;
  colorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotePackageRecord {
  id: string;
  title: string;
  description: string | null;
  noteCount: number;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotePackageDetail {
  package: NotePackageRecord;
  notes: NotePackageItemRecord[];
}

export interface NotePackageDraftItem {
  localId: string;
  subject: string;
  content: string;
  color: string;
  colorName: string;
}

export interface CreateNotePackagePayload {
  title: string;
  description?: string | null;
  notes: Array<{
    subject: string;
    content: string;
    color: string;
    color_name: string;
  }>;
}

export interface NotePackageAnalysisLogRecord {
  id: string;
  notePackageId: string;
  analysis: string;
  noteCount: number;
  model: string | null;
  analyzedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotePackageAnalysisLogPayload {
  note_package_id: string;
  analysis: string;
  note_count: number;
  model?: string | null;
  analyzed_at?: string;
}
