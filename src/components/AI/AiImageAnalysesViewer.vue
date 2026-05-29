<template>
  <section
    class="mx-auto w-full max-w-8xl space-y-5 rounded-2xl bg-slate-50 p-4 sm:p-6"
  >
    <header class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 class="text-xl font-bold text-slate-900">
        Repositorio de análisis de imágenes IA
      </h1>
      <p class="mt-1 text-sm text-slate-500">
        Selecciona una carpeta de paciente para visualizar su análisis y la
        imagen asociada.
      </p>
    </header>

    <div class="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        @click="showPatientsSection = !showPatientsSection"
      >
        {{
          showPatientsSection
            ? "Ocultar sección PACIENTE"
            : "Mostrar sección PACIENTE"
        }}
      </button>
      <button
        type="button"
        class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        @click="showImageViewer = !showImageViewer"
      >
        {{
          showImageViewer
            ? "Ocultar sección VISOR"
            : "Mostrar sección VISOR"
        }}
      </button>
    </div>

    <div
      class="grid gap-5"
      :class="
        showPatientsSection ? 'lg:grid-cols-[320px_1fr]' : 'lg:grid-cols-1'
      "
    >
      <aside
        v-if="showPatientsSection"
        class="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
      >
        <!-- Z1: izquierda título / derecha estado -->
        <div class="mb-2 flex items-start justify-between gap-2">
          <div>
            <h2 class="text-[16px] font-medium leading-[1.5] text-slate-800">
              Pacientes con análisis
            </h2>
            <p class="text-[16px] font-medium leading-[1.5] text-slate-500">
              Carpetas detectadas: {{ patientFolderCount }}
            </p>
          </div>
          <span
            class="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[16px] font-medium leading-[1.5] text-emerald-700"
          >
            PATIENT
          </span>
        </div>

        <!-- Z2: guía visual diagonal -->
        <div class="mb-3 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
          <p class="text-[16px] font-medium leading-[1.5] text-slate-600">
            Selecciona una carpeta para abrir el análisis y la imagen asociada en el panel derecho.
          </p>
          <div class="mt-2 flex items-center justify-between gap-2">
            <p class="truncate text-[16px] font-medium leading-[1.5] text-slate-500">
              Actual: {{ selectedPatientLabel }}
            </p>
            <button
              type="button"
              :disabled="loading"
              class="rounded-md border border-slate-200 bg-white px-2 py-1 text-[16px] font-medium leading-[1.5] text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              @click="load"
            >
              {{ loading ? "Cargando..." : "Actualizar" }}
            </button>
          </div>
        </div>

        <!-- Z3: cierre inferior con lista -->
        <div
          v-if="loading"
          class="rounded-lg bg-slate-50 px-3 py-6 text-center text-[16px] font-medium leading-[1.5] text-slate-500"
        >
          Cargando carpetas...
        </div>
        <div
          v-else-if="folders.length === 0"
          class="rounded-lg bg-slate-50 px-3 py-6 text-center text-[16px] font-medium leading-[1.5] text-slate-500"
        >
          No hay análisis de imágenes guardados.
        </div>
        <ul v-else class="space-y-2">
          <li v-for="folder in folders" :key="folder.key">
            <button
              type="button"
              class="w-full rounded-xl border px-3 py-2 text-left transition-all"
              :class="
                selectedFolderKey === folder.key
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50'
              "
              @click="selectFolder(folder.key)"
            >
              <div class="flex items-center gap-2">
                <span class="text-lg">📁</span>
                <div class="min-w-0">
                  <p class="truncate text-[16px] font-medium leading-[1.5] text-slate-800">
                    {{ folder.patientName }}
                  </p>
                  <p class="truncate text-[16px] font-medium leading-[1.5] text-slate-500">
                    {{ folder.patientDocumentNumber || "Sin documento" }}
                  </p>
                </div>
              </div>
            </button>
          </li>
        </ul>
      </aside>

      <article
        class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div
          v-if="error"
          class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {{ error }}
        </div>

        <div
          v-else-if="!selectedEntry"
          class="rounded-lg bg-slate-50 px-3 py-8 text-center text-sm text-slate-500"
        >
          Selecciona una carpeta de paciente para ver el análisis.
        </div>

        <div v-else class="space-y-4">
          <header
            class="flex items-center justify-between gap-3 border-b border-slate-100 pb-3"
          >
            <div>
              <p class="text-xs uppercase tracking-wide text-slate-500">
                Paciente
              </p>
              <h3 class="text-base font-semibold text-slate-900">
                {{ selectedEntry.patientName }}
              </h3>
            </div>
            <span
              class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
            >
              {{ selectedEntry.patientDocumentNumber || "Sin documento" }}
            </span>
          </header>

          <div class="grid gap-4" :class="analysisViewerGridClass">
            <section class="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <h4 class="mb-2 text-sm font-semibold text-slate-700">
                Análisis generado
              </h4>
              <div
                class="ai-markdown max-h-[68vh] overflow-y-auto rounded-lg bg-white p-3 text-sm text-slate-700"
                v-html="renderedAnalysis"
              ></div>
            </section>

            <section class="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div class="mb-2 flex items-center justify-between gap-2">
                <h4 class="text-sm font-semibold text-slate-700">Visor de imagen</h4>
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    class="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                    @click="zoomOut"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    class="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                    @click="zoomIn"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    class="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                    @click="resetImageTransform"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div v-if="showImageViewer" class="mb-2 flex items-center gap-1">
                <button
                  type="button"
                  class="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  title="Mover arriba"
                  @click="nudgeImage(0, -20)"
                >
                  ↑
                </button>
                <button
                  type="button"
                  class="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  title="Mover abajo"
                  @click="nudgeImage(0, 20)"
                >
                  ↓
                </button>
                <button
                  type="button"
                  class="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  title="Mover izquierda"
                  @click="nudgeImage(-20, 0)"
                >
                  ←
                </button>
                <button
                  type="button"
                  class="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  title="Mover derecha"
                  @click="nudgeImage(20, 0)"
                >
                  →
                </button>
              </div>
              <div
                v-if="showImageViewer"
                class="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-lg bg-white p-3"
              >
                <img
                  v-if="selectedImageUrl"
                  :src="selectedImageUrl"
                  :alt="currentImageAlt"
                  class="max-h-[62vh] w-auto max-w-full rounded-lg border border-slate-200 object-contain select-none"
                  :style="imageTransformStyle"
                  @mousedown="startDrag"
                  @mouseup="stopDrag"
                  @mouseleave="stopDrag"
                  @mousemove="onDrag"
                  @dragstart.prevent
                />
                <p v-else class="text-sm text-slate-500">
                  No se pudo cargar la imagen.
                </p>
              </div>
              <div
                v-else
                class="flex min-h-[180px] items-center justify-center rounded-lg bg-white p-3 text-sm text-slate-500"
              >
                Visor oculto. Pulsa "Mostrar" para verlo de nuevo.
              </div>
            </section>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import MarkdownIt from "markdown-it";
import {
  listAiDocumentAnalyses,
  type AiDocumentAnalysisListItem,
} from "@/services/aiDocumentAnalysesApi";
import {
  listAiDocumentUploadsViaApi,
  type AiDocumentUploadApiRow,
} from "@/services/aiDocumentUploadsApi";
import { getDocumentDownloadUrl } from "@/services/aiDocumentsService";

interface FolderEntry {
  key: string;
  patientName: string;
  patientDocumentNumber: string | null;
  upload: AiDocumentUploadApiRow;
  analysis: AiDocumentAnalysisListItem;
}

interface PatientFolder {
  key: string;
  patientName: string;
  patientDocumentNumber: string | null;
  entries: FolderEntry[];
}

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
});

const loading = ref(false);
const error = ref("");
const folders = ref<PatientFolder[]>([]);
const selectedFolderKey = ref<string | null>(null);
const selectedImageUrl = ref("");
const showPatientsSection = ref(true);
const imageScale = ref(1);
const imageOffsetX = ref(0);
const imageOffsetY = ref(0);
const draggingImage = ref(false);
const dragStartX = ref(0);
const dragStartY = ref(0);
const dragOriginX = ref(0);
const dragOriginY = ref(0);
const showImageViewer = ref(true);

const selectedFolder = computed(
  () => folders.value.find((f) => f.key === selectedFolderKey.value) ?? null,
);

const selectedEntry = computed(() => selectedFolder.value?.entries[0] ?? null);
const patientFolderCount = computed(() => folders.value.length);
const selectedPatientLabel = computed(
  () => selectedFolder.value?.patientName ?? "Ninguno",
);

const renderedAnalysis = computed(() => {
  const text = selectedEntry.value?.analysis.content?.trim() ?? "";
  return text ? md.render(text) : "<p>Este análisis no tiene contenido.</p>";
});

const currentImageAlt = computed(
  () => selectedEntry.value?.upload.original_filename ?? "Imagen analizada",
);

const analysisViewerGridClass = computed(() => {
  if (!showImageViewer.value) return "lg:grid-cols-1";
  if (!showPatientsSection.value) return "lg:grid-cols-[minmax(320px,0.8fr)_minmax(520px,1.8fr)]";
  return "lg:grid-cols-2";
});

const imageTransformStyle = computed(() => ({
  transform: `translate(${imageOffsetX.value}px, ${imageOffsetY.value}px) scale(${imageScale.value})`,
  transformOrigin: "center center",
  cursor: draggingImage.value ? "grabbing" : "grab",
  transition: draggingImage.value ? "none" : "transform 120ms ease",
}));

function buildFolders(
  uploads: AiDocumentUploadApiRow[],
  analyses: AiDocumentAnalysisListItem[],
): PatientFolder[] {
  const analysesByUpload = new Map<string, AiDocumentAnalysisListItem[]>();
  for (const analysis of analyses) {
    const bucket = analysesByUpload.get(analysis.document_upload_id) ?? [];
    bucket.push(analysis);
    analysesByUpload.set(analysis.document_upload_id, bucket);
  }

  const folderMap = new Map<string, PatientFolder>();

  for (const upload of uploads) {
    if (upload.file_type !== "image") continue;
    const matches = analysesByUpload.get(upload.id) ?? [];
    if (matches.length === 0) continue;

    const latest = [...matches].sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
      return tb - ta;
    })[0];
    if (!latest) continue;

    const patientName =
      upload.patient_name || latest.patient_name || "Paciente sin nombre";
    const patientDocumentNumber =
      upload.patient_document_number || latest.patient_document_number || null;
    const folderKey = `${upload.patient_id ?? "manual"}::${patientName.toLowerCase()}`;
    const entry: FolderEntry = {
      key: `${upload.id}-${latest.id}`,
      patientName,
      patientDocumentNumber,
      upload,
      analysis: latest,
    };

    const existing = folderMap.get(folderKey);
    if (!existing) {
      folderMap.set(folderKey, {
        key: folderKey,
        patientName,
        patientDocumentNumber,
        entries: [entry],
      });
    } else {
      existing.entries.push(entry);
    }
  }

  return [...folderMap.values()].sort((a, b) =>
    a.patientName.localeCompare(b.patientName, "es", { sensitivity: "base" }),
  );
}

async function resolveImagePreview(entry: FolderEntry | null) {
  selectedImageUrl.value = "";
  if (!entry) return;
  try {
    selectedImageUrl.value = await getDocumentDownloadUrl(entry.upload, 1800);
    resetImageTransform();
  } catch (e) {
    console.error("[AiImageAnalysesViewer] image preview", e);
  }
}

function zoomIn() {
  imageScale.value = Math.min(4, Number((imageScale.value + 0.2).toFixed(2)));
}

function zoomOut() {
  imageScale.value = Math.max(0.4, Number((imageScale.value - 0.2).toFixed(2)));
}

function resetImageTransform() {
  imageScale.value = 1;
  imageOffsetX.value = 0;
  imageOffsetY.value = 0;
}

function startDrag(event: MouseEvent) {
  if (!selectedImageUrl.value) return;
  draggingImage.value = true;
  dragStartX.value = event.clientX;
  dragStartY.value = event.clientY;
  dragOriginX.value = imageOffsetX.value;
  dragOriginY.value = imageOffsetY.value;
}

function onDrag(event: MouseEvent) {
  if (!draggingImage.value) return;
  const dx = event.clientX - dragStartX.value;
  const dy = event.clientY - dragStartY.value;
  imageOffsetX.value = dragOriginX.value + dx;
  imageOffsetY.value = dragOriginY.value + dy;
}

function stopDrag() {
  draggingImage.value = false;
}

function nudgeImage(dx: number, dy: number) {
  imageOffsetX.value += dx;
  imageOffsetY.value += dy;
}

function selectFolder(folderKey: string) {
  selectedFolderKey.value = folderKey;
  const folder = folders.value.find((f) => f.key === folderKey) ?? null;
  void resolveImagePreview(folder?.entries[0] ?? null);
}

async function load() {
  loading.value = true;
  error.value = "";
  try {
    const [uploads, analyses] = await Promise.all([
      listAiDocumentUploadsViaApi(),
      listAiDocumentAnalyses(),
    ]);
    folders.value = buildFolders(uploads, analyses);
    const firstFolder = folders.value[0];
    if (firstFolder) {
      selectFolder(firstFolder.key);
    } else {
      selectedFolderKey.value = null;
      selectedImageUrl.value = "";
    }
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "No se pudo cargar el repositorio.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void load();
});
</script>

<style scoped>
.ai-markdown :deep(h1),
.ai-markdown :deep(h2),
.ai-markdown :deep(h3) {
  color: #0f172a;
  margin: 0.7em 0 0.35em;
}

.ai-markdown :deep(p),
.ai-markdown :deep(ul),
.ai-markdown :deep(ol) {
  margin: 0.35em 0;
}

.ai-markdown :deep(ul),
.ai-markdown :deep(ol) {
  padding-left: 1.1rem;
}
</style>
