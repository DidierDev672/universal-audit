<template>
  <Teleport to="body">
    <Transition name="app-modal">
      <div v-if="isOpen" class="app-modal-root" style="z-index: 95">
        <div class="app-modal-backdrop" aria-hidden="true" @click="close" />
        <div class="app-modal-scrim app-modal-scrim--sheet" @click.self="close">
          <div
            :class="[
              'app-modal-panel app-modal-panel--sheet relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300',
              expanded
                ? 'h-[96vh] w-[96vw] max-h-none max-w-none'
                : 'max-h-[88vh] w-[min(720px,94vw)]',
            ]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-note-analysis-modal-title"
            @click.stop
            @keydown.escape="close"
          >
            <header
              class="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4"
            >
              <div class="min-w-0">
                <p
                  class="text-xs font-semibold uppercase tracking-wide text-emerald-100"
                >
                  Análisis IA · notas guardadas
                </p>
                <h2
                  id="ai-note-analysis-modal-title"
                  class="truncate text-lg font-bold text-white"
                >
                  {{ documentTitle }}
                </h2>
                <p class="mt-1 text-xs text-emerald-100">
                  Informe generado por inteligencia artificial
                </p>
              </div>
              <div class="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25"
                  :title="expanded ? 'Reducir' : 'Expandir'"
                  :aria-expanded="expanded"
                  @click="expanded = !expanded"
                >
                  {{ expanded ? "Reducir" : "Expandir" }}
                </button>
                <button
                  type="button"
                  class="flex h-9 w-9 items-center justify-center rounded-xl text-white hover:bg-white/20"
                  aria-label="Cerrar"
                  @click="close"
                >
                  <svg
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </header>

            <div
              class="ai-modal-analysis-view-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-6"
            >
              <div
                v-if="loading"
                class="flex flex-col items-center justify-center py-16"
              >
                <div
                  class="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"
                />
                <p class="mt-4 text-sm text-slate-500">
                  Cargando análisis guardados…
                </p>
              </div>

              <div v-else-if="error" class="py-8 text-center">
                <p class="text-sm text-red-600">{{ error }}</p>
                <button
                  type="button"
                  class="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                  @click="fetchSavedAnalyses"
                >
                  Reintentar
                </button>
              </div>

              <div
                v-else-if="!displayedContent"
                class="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center"
              >
                <p class="text-sm font-medium text-slate-700">
                  No hay análisis guardados para este documento.
                </p>
                <p class="mt-2 text-sm leading-6 text-slate-500">
                  Genera un análisis desde las notas y pulsa «Guardar análisis».
                </p>
              </div>

              <div v-else class="space-y-5">
                <div
                  v-if="savedAnalyses.length > 0 || previewMarkdown?.trim()"
                  class="flex flex-wrap gap-2"
                >
                  <button
                    v-if="previewMarkdown?.trim()"
                    type="button"
                    :class="[
                      'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                      selectedId === '__preview__'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-900 hover:bg-amber-100',
                    ]"
                    @click="selectedId = '__preview__'"
                  >
                    Generado ahora
                  </button>
                  <button
                    v-for="(item, index) in savedAnalyses"
                    :key="item.id"
                    type="button"
                    :class="[
                      'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                      selectedId === item.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                    ]"
                    @click="selectedId = item.id"
                  >
                    Guardado {{ savedAnalyses.length - index }}
                  </button>
                </div>

                <div
                  v-if="showingPreview"
                  class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900"
                >
                  Vista previa del análisis generado (aún no guardado en el
                  historial).
                </div>

                <div
                  class="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm"
                >
                  <dl
                    v-if="selectedMeta"
                    class="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500"
                  >
                    <div v-if="selectedMeta.model">
                      <dt class="inline font-medium text-slate-600">Modelo:</dt>
                      <dd class="inline ml-1">{{ selectedMeta.model }}</dd>
                    </div>
                    <div v-if="selectedMeta.notes_count != null">
                      <dt class="inline font-medium text-slate-600">Notas:</dt>
                      <dd class="inline ml-1">
                        {{ selectedMeta.notes_count }}
                      </dd>
                    </div>
                    <div v-if="selectedMeta.created_at">
                      <dt class="inline font-medium text-slate-600">
                        Guardado:
                      </dt>
                      <dd class="inline ml-1">
                        <time :datetime="selectedMeta.created_at">
                          {{ formatDate(selectedMeta.created_at) }}
                        </time>
                      </dd>
                    </div>
                  </dl>

                  <article
                    class="ai-clinical-typography ai-analysis-markdown note-analysis-prose max-w-none"
                    v-html="renderedContent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import MarkdownIt from "markdown-it";
import {
  listAiDocumentRedactionsByAnalysis,
  readAiAnalysesApiError,
} from "@/services/aiDocumentAnalysesApi";
import type { AiDocumentRedactionListItem } from "@/services/aiDocumentAnalysesApi";
import { renderClinicalMarkdown } from "./clinicalMarkdownCards";

const props = defineProps<{
  isOpen: boolean;
  documentTitle: string;
  analysisId: string;
  documentUploadId: string;
  /** Análisis recién generado por IA (opcional, para previsualizar antes de guardar). */
  previewMarkdown?: string | null;
  previewNotesCount?: number;
}>();

const emit = defineEmits<{ close: [] }>();

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
});

const expanded = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);
const savedAnalyses = ref<AiDocumentRedactionListItem[]>([]);
const selectedId = ref<string | null>(null);

const showingPreview = computed(
  () =>
    !!props.previewMarkdown?.trim() && selectedId.value === "__preview__",
);

const selectedSaved = computed(
  () =>
    savedAnalyses.value.find((item) => item.id === selectedId.value) ?? null,
);

const selectedMeta = computed(() => {
  if (showingPreview.value) {
    return {
      model: null as string | null,
      notes_count: props.previewNotesCount ?? null,
      created_at: null as string | null,
    };
  }
  return selectedSaved.value;
});

const displayedContent = computed(() => {
  if (showingPreview.value) return props.previewMarkdown?.trim() ?? "";
  return selectedSaved.value?.content?.trim() ?? "";
});

const renderedContent = computed(() => {
  const raw = displayedContent.value;
  if (!raw) return "";
  return renderClinicalMarkdown(md, raw, "");
});

async function fetchSavedAnalyses(): Promise<void> {
  if (!props.analysisId || !props.documentUploadId) {
    error.value = "Documento no válido.";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const items = await listAiDocumentRedactionsByAnalysis(
      props.analysisId,
      props.documentUploadId,
    );
    savedAnalyses.value = items;
    pickInitialSelection();
  } catch (err) {
    console.error("[AiDocumentNoteAnalysisViewModal]", err);
    error.value = readAiAnalysesApiError(err);
    savedAnalyses.value = [];
    selectedId.value = null;
  } finally {
    loading.value = false;
  }
}

function pickInitialSelection(): void {
  if (props.previewMarkdown?.trim()) {
    selectedId.value = "__preview__";
    return;
  }
  if (savedAnalyses.value.length > 0) {
    selectedId.value = savedAnalyses.value[0]?.id ?? null;
    return;
  }
  selectedId.value = null;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function close(): void {
  emit("close");
}

watch(
  () => props.isOpen,
  (open) => {
    if (!open) return;
    expanded.value = false;
    void fetchSavedAnalyses();
  },
);

watch(
  () => props.previewMarkdown,
  () => {
    if (!props.isOpen) return;
    if (savedAnalyses.value.length === 0 && props.previewMarkdown?.trim()) {
      selectedId.value = "__preview__";
    }
  },
);
</script>

<style scoped>
.ai-modal-analysis-view-scroll {
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 #f1f5f9;
}

.ai-modal-analysis-view-scroll::-webkit-scrollbar {
  width: 8px;
}

.ai-modal-analysis-view-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.ai-modal-analysis-view-scroll::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
}

.note-analysis-prose :deep(h3) {
  margin-top: 1.25em;
}
</style>
