<template>
  <Teleport to="body">
    <Transition name="app-modal">
      <div v-if="isOpen" class="app-modal-root">
        <div class="app-modal-backdrop" aria-hidden="true" @click="close" />
        <div class="app-modal-scrim app-modal-scrim--sheet" @click.self="close">
          <div
            :class="[
              'app-modal-panel app-modal-panel--sheet relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300',
              expanded
                ? 'h-[96vh] w-[96vw] max-h-none max-w-none'
                : 'max-h-[85vh] w-[min(720px,92vw)]',
            ]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="note-analysis-modal-title"
            @click.stop
            @keydown.escape="onEscape"
          >
            <header
              class="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4"
            >
              <div class="min-w-0">
                <p
                  class="text-xs font-semibold uppercase tracking-wide text-emerald-100"
                >
                  Análisis IA de notas
                </p>
                <h2
                  id="note-analysis-modal-title"
                  class="truncate text-lg font-bold text-white"
                >
                  {{ eventTitle }}
                </h2>
                <p class="mt-1 text-xs text-emerald-100">
                  {{ eventType === "task" ? "Tarea" : "Investigación" }}
                </p>
              </div>
              <div class="flex shrink-0 flex-wrap items-center justify-end gap-1">
                <button
                  v-if="!generating && logs.length > 0"
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-sm font-medium text-white hover:bg-white/25 disabled:opacity-50"
                  :disabled="generating"
                  @click="generateAnalysis(false)"
                >
                  Regenerar
                </button>
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25"
                  @click="createNoteOpen = true"
                >
                  <svg
                    class="h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span class="hidden sm:inline">Nueva nota</span>
                </button>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25"
                  :title="expanded ? 'Reducir' : 'Expandir'"
                  :aria-expanded="expanded"
                  @click="expanded = !expanded"
                >
                  <span class="hidden sm:inline">
                    {{ expanded ? "Reducir" : "Expandir" }}
                  </span>
                </button>
                <button
                  type="button"
                  class="flex h-9 w-9 items-center justify-center rounded-xl text-white hover:bg-white/20"
                  aria-label="Cerrar"
                  @click="close"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            <div class="min-h-0 flex-1 overflow-y-auto p-6">
              <div
                v-if="loading || generating"
                class="flex flex-col items-center justify-center py-16"
              >
                <div
                  class="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"
                />
                <p class="mt-4 text-sm text-slate-500">
                  {{ generating ? "Generando análisis con IA…" : "Cargando análisis…" }}
                </p>
              </div>

              <div v-else-if="error" class="py-8 text-center">
                <p class="text-sm text-red-600">{{ error }}</p>
                <button
                  type="button"
                  class="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
                  @click="generateAnalysis(false)"
                >
                  Reintentar generación
                </button>
              </div>

              <div
                v-else-if="logs.length === 0"
                class="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center"
              >
                <p class="text-sm font-medium text-slate-700">
                  Sin análisis de notas guardado
                </p>
                <p class="mt-2 text-sm leading-6 text-slate-500">
                  Genera un informe IA a partir de las notas vinculadas a esta
                  {{ eventType === "task" ? "tarea" : "investigación" }}.
                </p>
                <button
                  type="button"
                  class="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  @click="generateAnalysis(false)"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Generar análisis de notas
                </button>
              </div>

              <div v-else class="space-y-6">
                <div v-if="logs.length > 1" class="flex flex-wrap gap-2">
                  <button
                    v-for="(log, index) in logs"
                    :key="log.id"
                    type="button"
                    :class="[
                      'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                      selectedLogId === log.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                    ]"
                    @click="selectedLogId = log.id"
                  >
                    Análisis {{ logs.length - index }}
                  </button>
                </div>

                <div
                  v-if="selectedLog"
                  class="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm"
                >
                  <div
                    class="mb-4 flex flex-wrap items-center gap-3 text-xs text-slate-500"
                  >
                    <span
                      class="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700"
                    >
                      {{ selectedLog.noteCount }}
                      {{ selectedLog.noteCount === 1 ? "nota" : "notas" }}
                    </span>
                    <time :datetime="selectedLog.analyzedAt">
                      {{ formatDate(selectedLog.analyzedAt) }}
                    </time>
                    <span v-if="selectedLog.model" class="text-slate-400">
                      {{ selectedLog.model }}
                    </span>
                  </div>
                  <article class="note-analysis-prose" v-html="renderedAnalysis" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <CreateCalendarAnalysisNoteModal
      :is-open="createNoteOpen"
      :calendar-ai-analysis-id="calendarAiAnalysisId"
      :event-title="eventTitle"
      @close="createNoteOpen = false"
      @created="onNoteCreated"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import MarkdownIt from "markdown-it";
import CreateCalendarAnalysisNoteModal from "./CreateCalendarAnalysisNoteModal.vue";
import { getCalendarAnalysisNoteAnalysisLogs } from "../../shared/api/calendarAnalysisNoteApi";
import { runCalendarNoteAnalysis } from "../../shared/service/calendarNoteAnalysisAi";
import type { CalendarAnalysisNoteAnalysisLogRecord } from "../../shared/types/calendarAnalysisNote";
import type { CalendarEventType } from "../../shared/types/calendarAiAnalysis";

const props = defineProps<{
  isOpen: boolean;
  calendarAiAnalysisId: string;
  eventTitle: string;
  eventType: CalendarEventType;
  /** Al abrir, genera y guarda el análisis automáticamente si no hay uno previo. */
  autoGenerate?: boolean;
  /** Fuerza generación al abrir aunque ya exista un análisis guardado. */
  forceGenerate?: boolean;
}>();

const emit = defineEmits<{ close: []; generated: [] }>();

const md = new MarkdownIt({ html: false, linkify: true, breaks: true });

const expanded = ref(false);
const createNoteOpen = ref(false);
const logs = ref<CalendarAnalysisNoteAnalysisLogRecord[]>([]);
const selectedLogId = ref<string | null>(null);
const loading = ref(false);
const generating = ref(false);
const error = ref<string | null>(null);

const selectedLog = computed(
  () =>
    logs.value.find((log) => log.id === selectedLogId.value) ??
    logs.value[0] ??
    null,
);

const renderedAnalysis = computed(() =>
  selectedLog.value ? md.render(selectedLog.value.analysis) : "",
);

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

async function fetchLogs(): Promise<void> {
  if (!props.calendarAiAnalysisId) {
    error.value = "Documento no válido";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const data = await getCalendarAnalysisNoteAnalysisLogs(
      props.calendarAiAnalysisId,
    );
    logs.value = [...data].sort(
      (a, b) =>
        new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime(),
    );
    selectedLogId.value = logs.value[0]?.id ?? null;
  } catch (err) {
    console.error("[CalendarNoteAnalysisViewModal]", err);
    error.value = "No se pudo cargar el análisis guardado.";
    logs.value = [];
    selectedLogId.value = null;
  } finally {
    loading.value = false;
  }
}

async function generateAnalysis(skipIfExists: boolean): Promise<void> {
  if (!props.calendarAiAnalysisId) return;

  if (skipIfExists && logs.value.length > 0) return;

  generating.value = true;
  error.value = null;

  try {
    await runCalendarNoteAnalysis({
      calendarAiAnalysisId: props.calendarAiAnalysisId,
      eventTitle: props.eventTitle,
      eventType: props.eventType,
    });
    await fetchLogs();
    emit("generated");
  } catch (err) {
    console.error("[CalendarNoteAnalysisViewModal] generate", err);
    error.value =
      err instanceof Error ? err.message : "No se pudo generar el análisis de notas.";
  } finally {
    generating.value = false;
  }
}

async function onOpen(): Promise<void> {
  expanded.value = false;
  await fetchLogs();

  if (props.forceGenerate) {
    await generateAnalysis(false);
    return;
  }

  if (props.autoGenerate && logs.value.length === 0) {
    await generateAnalysis(false);
  }
}

function close(): void {
  expanded.value = false;
  createNoteOpen.value = false;
  emit("close");
}

function onNoteCreated(): void {
  void fetchLogs();
}

function onEscape(): void {
  if (expanded.value) {
    expanded.value = false;
    return;
  }
  close();
}

watch(
  () => props.isOpen,
  (open) => {
    if (open) void onOpen();
  },
  { immediate: true },
);
</script>

<style scoped>
.note-analysis-prose :deep(h3) {
  font-size: 1rem;
  font-weight: 700;
  color: #065f46;
  margin: 1.25rem 0 0.5rem;
}
.note-analysis-prose :deep(h3:first-child) {
  margin-top: 0;
}
.note-analysis-prose :deep(p),
.note-analysis-prose :deep(li) {
  font-size: 0.9375rem;
  color: #475569;
  line-height: 1.7;
}
.note-analysis-prose :deep(ul),
.note-analysis-prose :deep(ol) {
  padding-left: 1.25rem;
  margin: 0.5rem 0;
}
.note-analysis-prose :deep(strong) {
  font-weight: 600;
  color: #1e293b;
}
</style>
