/**
 * Servicio de persistencia usando IndexedDB
 * Almacena recursos, archivos y transcripciones localmente
 */

const DB_NAME = 'UniversalAuditDB';
const DB_VERSION = 2; // Incrementado para nuevos stores
const STORE_RESOURCES = 'resources';
const STORE_FILES = 'files';
const STORE_HIGHLIGHTS = 'highlights';
const STORE_CLINICAL_NOTES = 'clinicalNotes';

interface StoredResource {
  id: number;
  name: string;
  type: string;
  description: string;
  createdAt: string;
  url?: string;
  transcription?: string;
  transcriptionStatus?: 'processing' | 'completed' | 'error';
  fileId?: number; // Referencia al archivo en STORE_FILES
}

interface StoredFile {
  id: number;
  name: string;
  type: string;
  size: number;
  data: ArrayBuffer;
}

// Tipos de color para subrayado
export type HighlightColor = 'yellow' | 'green' | 'red' | 'purple' | 'orange';

interface StoredHighlight {
  id: string; // ID único del highlight
  resourceId: number; // Recurso al que pertenece
  text: string; // Texto subrayado
  color: HighlightColor; // Color del subrayado
  startOffset: number; // Posición inicial en el texto
  endOffset: number; // Posición final en el texto
  createdAt: string;
  noteId?: string; // ID de la nota clínica asociada (opcional)
}

interface StoredClinicalNote {
  id: string; // ID único de la nota
  highlightId: string; // ID del highlight asociado
  resourceId: number; // Recurso relacionado
  title: string; // Título de la nota
  description: string; // Descripción de la nota
  createdAt: string;
  updatedAt?: string;
}

let db: IDBDatabase | null = null;

/**
 * Inicializa la base de datos IndexedDB
 */
export async function initDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      // Store para recursos (metadatos)
      if (!database.objectStoreNames.contains(STORE_RESOURCES)) {
        const resourceStore = database.createObjectStore(STORE_RESOURCES, { keyPath: 'id' });
        resourceStore.createIndex('createdAt', 'createdAt', { unique: false });
        resourceStore.createIndex('type', 'type', { unique: false });
      }
      
      // Store para archivos binarios
      if (!database.objectStoreNames.contains(STORE_FILES)) {
        const fileStore = database.createObjectStore(STORE_FILES, { keyPath: 'id' });
        fileStore.createIndex('name', 'name', { unique: false });
      }
      
      // Store para highlights (subrayados)
      if (!database.objectStoreNames.contains(STORE_HIGHLIGHTS)) {
        const highlightStore = database.createObjectStore(STORE_HIGHLIGHTS, { keyPath: 'id' });
        highlightStore.createIndex('resourceId', 'resourceId', { unique: false });
        highlightStore.createIndex('color', 'color', { unique: false });
        highlightStore.createIndex('noteId', 'noteId', { unique: false });
      }
      
      // Store para notas clínicas
      if (!database.objectStoreNames.contains(STORE_CLINICAL_NOTES)) {
        const noteStore = database.createObjectStore(STORE_CLINICAL_NOTES, { keyPath: 'id' });
        noteStore.createIndex('highlightId', 'highlightId', { unique: true });
        noteStore.createIndex('resourceId', 'resourceId', { unique: false });
        noteStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
}

/**
 * Guarda un archivo binario
 */
export async function saveFile(id: number, file: File): Promise<void> {
  const database = db || await initDatabase();
  
  const arrayBuffer = await file.arrayBuffer();
  const storedFile: StoredFile = {
    id,
    name: file.name,
    type: file.type,
    size: file.size,
    data: arrayBuffer
  };

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_FILES], 'readwrite');
    const store = transaction.objectStore(STORE_FILES);
    const request = store.put(storedFile);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Recupera un archivo binario
 */
export async function getFile(id: number): Promise<File | null> {
  const database = db || await initDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_FILES], 'readonly');
    const store = transaction.objectStore(STORE_FILES);
    const request = store.get(id);

    request.onsuccess = () => {
      const storedFile: StoredFile | undefined = request.result;
      if (!storedFile) {
        resolve(null);
        return;
      }

      const blob = new Blob([storedFile.data], { type: storedFile.type });
      const file = new File([blob], storedFile.name, { type: storedFile.type });
      resolve(file);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Elimina un archivo
 */
export async function deleteFile(id: number): Promise<void> {
  const database = db || await initDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_FILES], 'readwrite');
    const store = transaction.objectStore(STORE_FILES);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Guarda un recurso con sus metadatos
 */
export async function saveResource(resource: StoredResource): Promise<void> {
  const database = db || await initDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_RESOURCES], 'readwrite');
    const store = transaction.objectStore(STORE_RESOURCES);
    const request = store.put(resource);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Obtiene todos los recursos
 */
export async function getAllResources(): Promise<StoredResource[]> {
  const database = db || await initDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_RESOURCES], 'readonly');
    const store = transaction.objectStore(STORE_RESOURCES);
    const request = store.getAll();

    request.onsuccess = () => {
      const resources: StoredResource[] = request.result;
      // Ordenar por fecha de creación (más reciente primero)
      resources.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      resolve(resources);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Elimina un recurso
 */
export async function deleteResource(id: number): Promise<void> {
  const database = db || await initDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_RESOURCES], 'readwrite');
    const store = transaction.objectStore(STORE_RESOURCES);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Limpia toda la base de datos
 */
export async function clearDatabase(): Promise<void> {
  const database = db || await initDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_RESOURCES, STORE_FILES], 'readwrite');
    
    const resourceStore = transaction.objectStore(STORE_RESOURCES);
    const fileStore = transaction.objectStore(STORE_FILES);
    
    const clearResources = resourceStore.clear();
    const clearFiles = fileStore.clear();

    let completed = 0;
    const checkComplete = () => {
      completed++;
      if (completed === 2) resolve();
    };

    clearResources.onsuccess = checkComplete;
    clearFiles.onsuccess = checkComplete;
    
    clearResources.onerror = () => reject(clearResources.error);
    clearFiles.onerror = () => reject(clearFiles.error);
  });
}

/**
 * Exporta todos los datos para backup
 */
export async function exportData(): Promise<{ resources: StoredResource[]; files: StoredFile[] }> {
  const database = db || await initDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_RESOURCES, STORE_FILES], 'readonly');
    const resourceStore = transaction.objectStore(STORE_RESOURCES);
    const fileStore = transaction.objectStore(STORE_FILES);

    const resourcesRequest = resourceStore.getAll();
    const filesRequest = fileStore.getAll();

    let completed = 0;
    let resources: StoredResource[] = [];
    let files: StoredFile[] = [];

    const checkComplete = () => {
      completed++;
      if (completed === 2) {
        resolve({ resources, files });
      }
    };

    resourcesRequest.onsuccess = () => {
      resources = resourcesRequest.result;
      checkComplete();
    };

    filesRequest.onsuccess = () => {
      files = filesRequest.result;
      checkComplete();
    };

    resourcesRequest.onerror = () => reject(resourcesRequest.error);
    filesRequest.onerror = () => reject(filesRequest.error);
  });
}

// ==================== FUNCIONES PARA HIGHLIGHTS ====================

/**
 * Guarda un highlight (subrayado)
 */
export async function saveHighlight(highlight: StoredHighlight): Promise<void> {
  const database = db || await initDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_HIGHLIGHTS], 'readwrite');
    const store = transaction.objectStore(STORE_HIGHLIGHTS);
    const request = store.put(highlight);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Obtiene todos los highlights de un recurso
 */
export async function getHighlightsByResource(resourceId: number): Promise<StoredHighlight[]> {
  const database = db || await initDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_HIGHLIGHTS], 'readonly');
    const store = transaction.objectStore(STORE_HIGHLIGHTS);
    const index = store.index('resourceId');
    const request = index.getAll(resourceId);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Obtiene un highlight por su ID
 */
export async function getHighlightById(id: string): Promise<StoredHighlight | null> {
  const database = db || await initDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_HIGHLIGHTS], 'readonly');
    const store = transaction.objectStore(STORE_HIGHLIGHTS);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Elimina un highlight
 */
export async function deleteHighlight(id: string): Promise<void> {
  const database = db || await initDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_HIGHLIGHTS], 'readwrite');
    const store = transaction.objectStore(STORE_HIGHLIGHTS);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Elimina todos los highlights de un recurso
 */
export async function deleteHighlightsByResource(resourceId: number): Promise<void> {
  const database = db || await initDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_HIGHLIGHTS], 'readwrite');
    const store = transaction.objectStore(STORE_HIGHLIGHTS);
    const index = store.index('resourceId');
    const request = index.openCursor(IDBKeyRange.only(resourceId));

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      } else {
        resolve();
      }
    };
    request.onerror = () => reject(request.error);
  });
}

// ==================== FUNCIONES PARA NOTAS CLÍNICAS ====================

/**
 * Guarda una nota clínica
 */
export async function saveClinicalNote(note: StoredClinicalNote): Promise<void> {
  const database = db || await initDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_CLINICAL_NOTES], 'readwrite');
    const store = transaction.objectStore(STORE_CLINICAL_NOTES);
    const request = store.put(note);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Obtiene todas las notas clínicas
 */
export async function getAllClinicalNotes(): Promise<StoredClinicalNote[]> {
  const database = db || await initDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_CLINICAL_NOTES], 'readonly');
    const store = transaction.objectStore(STORE_CLINICAL_NOTES);
    const request = store.getAll();

    request.onsuccess = () => {
      const notes: StoredClinicalNote[] = request.result;
      // Ordenar por fecha de creación (más reciente primero)
      notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      resolve(notes);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Obtiene una nota clínica por su ID
 */
export async function getClinicalNoteById(id: string): Promise<StoredClinicalNote | null> {
  const database = db || await initDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_CLINICAL_NOTES], 'readonly');
    const store = transaction.objectStore(STORE_CLINICAL_NOTES);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Obtiene una nota clínica por el ID del highlight asociado
 */
export async function getClinicalNoteByHighlightId(highlightId: string): Promise<StoredClinicalNote | null> {
  const database = db || await initDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_CLINICAL_NOTES], 'readonly');
    const store = transaction.objectStore(STORE_CLINICAL_NOTES);
    const index = store.index('highlightId');
    const request = index.get(highlightId);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Obtiene todas las notas clínicas de un recurso
 */
export async function getClinicalNotesByResource(resourceId: number): Promise<StoredClinicalNote[]> {
  const database = db || await initDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_CLINICAL_NOTES], 'readonly');
    const store = transaction.objectStore(STORE_CLINICAL_NOTES);
    const index = store.index('resourceId');
    const request = index.getAll(resourceId);

    request.onsuccess = () => {
      const notes: StoredClinicalNote[] = request.result;
      notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      resolve(notes);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Elimina una nota clínica
 */
export async function deleteClinicalNote(id: string): Promise<void> {
  const database = db || await initDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_CLINICAL_NOTES], 'readwrite');
    const store = transaction.objectStore(STORE_CLINICAL_NOTES);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Elimina todas las notas clínicas de un recurso
 */
export async function deleteClinicalNotesByResource(resourceId: number): Promise<void> {
  const database = db || await initDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_CLINICAL_NOTES], 'readwrite');
    const store = transaction.objectStore(STORE_CLINICAL_NOTES);
    const index = store.index('resourceId');
    const request = index.openCursor(IDBKeyRange.only(resourceId));

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      } else {
        resolve();
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export type { StoredResource, StoredFile, StoredHighlight, StoredClinicalNote };
