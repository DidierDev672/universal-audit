<template>
  <Teleport to="body">
    <!-- Barra colapsada (patrón Z: retorno visual inferior) -->
    <Transition name="cal-notes-collapse">
      <button
        v-if="isOpen && collapsed"
        type="button"
        class="fixed bottom-6 right-6 z-[80] inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-xl hover:bg-violet-700"
        @click="collapsed = false"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 15l7-7 7 7"
          />
        </svg>
        Notas: {{ eventTitle }}
      </button>
    </Transition>

    <Transition name="app-modal">
      <div v-if="isOpen && !collapsed" class="app-modal-root">
        <div class="app-modal-backdrop" aria-hidden="true" @click="close" />
        <div class="app-modal-scrim app-modal-scrim--sheet" @click.self="close">
          <div
            class="app-modal-panel app-modal-panel--sheet relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            style="width: 92vw; height: 88vh"
            role="dialog"
            aria-modal="true"
            @click.stop
          >
            <!-- Z-1: título (arriba-izquierda) -->
            <header
              class="flex items-start justify-between gap-4 border-b border-slate-200 bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4"
            >
              <div class="min-w-0">
                <p
                  class="text-xs font-semibold uppercase tracking-wide text-violet-100"
                >
                  {{ eventType === "task" ? "Tarea" : "Investigación" }}
                </p>
                <h2 class="truncate text-lg font-bold text-white">
                  {{ eventTitle }}
                </h2>
                <p class="mt-1 text-xs text-violet-100">
                  Notas vinculadas al documento
                </p>
              </div>
              <!-- Z-2: acciones (arriba-derecha) -->
              <div class="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/15 px-3 py-2 text-xs font-semibold text-white hover:bg-white/25"
                  @click="createNoteOpen = true"
                >
                  <svg
                    class="h-4 w-4"
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
                  Nueva nota
                </button>
                <button
                  type="button"
                  class="rounded-xl border border-white/30 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
                  title="Colapsar modal"
                  @click="collapsed = true"
                >
                  Colapsar
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

            <div class="flex flex-1 flex-col overflow-hidden lg:flex-row">
              <!-- Z-3: grafo central -->
              <section
                class="flex min-h-0 flex-1 flex-col border-b border-slate-100 p-4 lg:border-b-0 lg:border-r"
              >
                <div
                  v-if="loading"
                  class="flex flex-1 items-center justify-center"
                >
                  <div
                    class="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"
                  />
                </div>
                <div
                  v-else-if="error"
                  class="flex flex-1 flex-col items-center justify-center gap-3 text-center"
                >
                  <p class="text-sm text-red-600">{{ error }}</p>
                  <button
                    type="button"
                    class="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white"
                    @click="fetchNotes"
                  >
                    Reintentar
                  </button>
                </div>
                <div
                  v-else-if="notes.length === 0"
                  class="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center"
                >
                  <p class="text-sm text-slate-500">
                    Este documento no tiene notas registradas.
                  </p>
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
                    @click="createNoteOpen = true"
                  >
                    Crear primera nota
                  </button>
                </div>
                <div
                  v-else
                  class="min-h-[320px] flex-1 overflow-hidden rounded-xl border border-slate-200"
                >
                  <VueFlow
                    v-model:nodes="flowNodes"
                    v-model:edges="flowEdges"
                    :default-zoom="0.95"
                    :min-zoom="0.3"
                    :max-zoom="2"
                    :nodes-draggable="true"
                    :nodes-connectable="false"
                    fit-view-on-init
                    class="cal-notes-flow"
                  >
                    <Background pattern-color="#E2E8F0" :gap="18" />
                    <MiniMap />
                    <Controls />
                    <template #node-cal-note="nodeProps">
                      <CalendarAnalysisNoteFlowNode
                        :data="nodeProps.data"
                        removable
                        @view="openNoteDetail(nodeProps.data)"
                        @edit="openEditNote(nodeProps.id)"
                        @remove="requestRemoveNote(nodeProps.id)"
                      />
                    </template>
                  </VueFlow>
                </div>
              </section>

              <!-- Z-4 / Z-5: acciones (abajo-izq) + IA markdown (abajo-dcha) -->
              <aside class="flex w-full flex-col lg:w-[42%] xl:w-[38%]">
                <div class="border-b border-slate-100 p-4">
                  <div class="flex flex-wrap gap-2">
                    <button
                      type="button"
                      class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                      :disabled="analyzing || notes.length === 0"
                      @click="analyzeNotes"
                    >
                      <svg
                        v-if="!analyzing"
                        class="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                      <svg
                        v-else
                        class="h-4 w-4 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      {{ analyzing ? "Analizando…" : "Analizar notas con IA" }}
                    </button>
                    <button
                      type="button"
                      class="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                      :disabled="saving || !aiAnalysis"
                      @click="saveAnalysis"
                    >
                      {{ saving ? "Guardando…" : "Guardar análisis" }}
                    </button>
                  </div>
                  <p v-if="aiError" class="mt-2 text-xs text-red-600">
                    {{ aiError }}
                  </p>
                  <p v-if="saveError" class="mt-2 text-xs text-red-600">
                    {{ saveError }}
                  </p>
                  <p
                    v-if="saveSuccess"
                    class="mt-2 text-xs font-medium text-emerald-600"
                  >
                    Análisis guardado correctamente.
                  </p>
                </div>

                <div class="flex-1 overflow-y-auto p-4">
                  <h3 class="mb-3 text-sm font-semibold text-slate-800">
                    Resultado IA
                  </h3>
                  <div
                    v-if="!aiAnalysis && !loadingSavedAnalysis"
                    class="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
                  >
                    Ejecuta el análisis para ver el informe en markdown.
                  </div>
                  <div
                    v-else-if="loadingSavedAnalysis"
                    class="flex items-center justify-center py-10"
                  >
                    <div
                      class="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"
                    />
                  </div>
                  <article
                    v-else
                    class="ai-prose rounded-xl border border-indigo-100 bg-white p-4 shadow-sm"
                    v-html="renderedAnalysis"
                  />
                </div>
              </aside>
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

    <CalendarAnalysisNoteDetailModal
      :is-open="noteDetailOpen"
      :note="selectedNoteDetail"
      @close="closeNoteDetail"
    />

    <div
      v-if="deleteNoteDialogOpen && notePendingDelete"
      class="fixed inset-0 z-[95] flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      @click.self="cancelRemoveNote"
    >
      <div
        class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/80"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-cal-note-dialog-title"
        aria-describedby="delete-cal-note-dialog-desc"
        @keydown.escape="cancelRemoveNote"
      >
        <header
          class="border-b border-sky-200/80 bg-linear-to-r from-sky-50 via-white to-emerald-50 px-6 py-4"
        >
          <div class="flex items-start gap-3">
            <span
              class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700 ring-1 ring-sky-200/80"
              aria-hidden="true"
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <div class="min-w-0">
              <h2
                id="delete-cal-note-dialog-title"
                class="text-base font-semibold text-slate-900"
              >
                ¿Eliminar esta nota?
              </h2>
              <p class="mt-1 text-sm font-medium text-slate-600">
                «{{ notePendingDelete.colorName }}»
              </p>
            </div>
          </div>
        </header>

        <div class="px-6 py-5">
          <p
            id="delete-cal-note-dialog-desc"
            class="text-sm leading-relaxed text-slate-700"
          >
            Cada nota aporta contexto al
            <strong class="font-semibold text-slate-900"
              >análisis clínico e investigación</strong
            >
            de este documento. Si la elimina, esa información dejará de
            considerarse y el análisis posterior puede perder relevancia o
            completitud.
          </p>
          <p class="mt-3 text-sm leading-relaxed text-slate-700">
            Si el contenido no es exacto, le recomendamos
            <strong class="font-semibold text-emerald-800">editar la nota</strong>
            en lugar de borrarla: así conserva el hilo investigativo y mejora
            la calidad del análisis con IA.
          </p>
        </div>

        <footer
          class="flex flex-col gap-2 border-t border-slate-200 bg-slate-50/80 px-6 py-4 sm:flex-row sm:flex-wrap sm:justify-end"
        >
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200/80 transition-all duration-200 hover:bg-white"
            :disabled="deletingNote"
            @click="cancelRemoveNote"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-emerald-700"
            :disabled="deletingNote"
            @click="editNoteFromDeleteDialog"
          >
            <svg
              class="h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Editar nota
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-rose-700 ring-1 ring-rose-200/80 transition-all duration-200 hover:bg-rose-50 disabled:opacity-50"
            :disabled="deletingNote"
            @click="confirmRemoveNote"
          >
            {{ deletingNote ? "Eliminando…" : "Eliminar de todos modos" }}
          </button>
        </footer>
      </div>
    </div>

    <div
      v-if="editNoteDialogOpen"
      class="fixed inset-0 z-[95] flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      @click.self="cancelEditNote"
    >
      <div
        class="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/80"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-cal-note-dialog-title"
        @keydown.escape="cancelEditNote"
      >
        <header
          class="border-b border-violet-100 bg-linear-to-r from-violet-50 via-white to-sky-50 px-6 py-4"
        >
          <h2
            id="edit-cal-note-dialog-title"
            class="text-base font-semibold text-slate-900"
          >
            Editar nota del documento
          </h2>
          <p class="mt-1 text-sm text-slate-600">
            Ajuste el contenido para mantener la coherencia del análisis.
          </p>
        </header>

        <div class="flex-1 overflow-y-auto px-6 py-5">
          <label class="block">
            <span class="mb-1 block text-sm font-semibold text-slate-700"
              >Asunto</span
            >
            <input
              v-model="editSubject"
              type="text"
              maxlength="120"
              class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </label>
          <label class="mt-4 block">
            <span class="mb-1 block text-sm font-semibold text-slate-700"
              >Contenido</span
            >
            <textarea
              v-model="editContent"
              rows="5"
              class="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium leading-relaxed focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
              :style="{
                color: editTheme.contentText,
                backgroundColor: `${editTheme.background}59`,
              }"
            />
          </label>
          <div class="mt-4">
            <span
              class="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              Color
            </span>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="theme in NOTE_COLOR_THEMES"
                :key="theme.id"
                type="button"
                class="rounded-xl border-2 px-3 py-1.5 text-xs font-semibold transition-all"
                :style="{
                  backgroundColor: theme.background,
                  color: theme.contentText,
                  borderColor: theme.contentText,
                  boxShadow:
                    editThemeId === theme.id
                      ? `0 0 0 2px rgba(255,255,255,0.85), 0 0 0 4px ${theme.contentText}`
                      : undefined,
                }"
                @click="editThemeId = theme.id"
              >
                {{ theme.name }}
              </button>
            </div>
          </div>
          <p
            v-if="editNoteError"
            class="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {{ editNoteError }}
          </p>
        </div>

        <footer
          class="flex flex-wrap justify-end gap-2 border-t border-slate-200 bg-slate-50/80 px-6 py-4"
        >
          <button
            type="button"
            class="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200/80 hover:bg-white"
            :disabled="savingNoteEdit"
            @click="cancelEditNote"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
            :disabled="savingNoteEdit"
            @click="saveEditNote"
          >
            {{ savingNoteEdit ? "Guardando…" : "Guardar cambios" }}
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import MarkdownIt from "markdown-it";
import type { Edge, Node } from "@vue-flow/core";
import { VueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { MiniMap } from "@vue-flow/minimap";
import { Controls } from "@vue-flow/controls";
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import CalendarAnalysisNoteDetailModal, {
  type CalendarNoteDetailData,
} from "./CalendarAnalysisNoteDetailModal.vue";
import CalendarAnalysisNoteFlowNode from "./CalendarAnalysisNoteFlowNode.vue";
import CreateCalendarAnalysisNoteModal from "./CreateCalendarAnalysisNoteModal.vue";
import {
  createCalendarAnalysisNoteAnalysisLog,
  deleteCalendarAnalysisNote,
  getCalendarAnalysisNoteAnalysisLogs,
  getCalendarAnalysisNotesByAnalysisId,
  updateCalendarAnalysisNote,
} from "../../shared/api/calendarAnalysisNoteApi";
import type { CalendarAnalysisNoteRecord } from "../../shared/types/calendarAnalysisNote";
import type { CalendarEventType } from "../../shared/types/calendarAiAnalysis";
import {
  NOTE_COLOR_THEMES,
  themeById,
} from "../../shared/constants/noteColorThemes";
import { useGetGenerativeModelGP } from "../../shared/service/useGetGenerativeModelGP";

const props = defineProps<{
  isOpen: boolean;
  calendarAiAnalysisId: string;
  eventTitle: string;
  eventType: CalendarEventType;
}>();

const emit = defineEmits<{ close: [] }>();

const md = new MarkdownIt({ html: false, linkify: true, breaks: true });

const collapsed = ref(false);
const createNoteOpen = ref(false);
const noteDetailOpen = ref(false);
const selectedNoteDetail = ref<CalendarNoteDetailData | null>(null);
const notes = ref<CalendarAnalysisNoteRecord[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const analyzing = ref(false);
const aiAnalysis = ref("");
const aiError = ref<string | null>(null);
const saving = ref(false);
const saveError = ref<string | null>(null);
const saveSuccess = ref(false);
const loadingSavedAnalysis = ref(false);
const flowNodes = ref<Node[]>([]);
const flowEdges = ref<Edge[]>([]);

const deleteNoteDialogOpen = ref(false);
const notePendingDelete = ref<CalendarAnalysisNoteRecord | null>(null);
const deletingNote = ref(false);

const editNoteDialogOpen = ref(false);
const editingNoteId = ref<string | null>(null);
const editSubject = ref("");
const editContent = ref("");
const editThemeId = ref(NOTE_COLOR_THEMES[0]!.id);
const editNoteError = ref<string | null>(null);
const savingNoteEdit = ref(false);

const editTheme = computed(() => themeById(editThemeId.value));

function rebuildFlowGraph(): void {
  const sorted = [...notes.value].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  flowNodes.value = sorted.map((note, index) => ({
    id: note.id,
    type: "cal-note",
    position: {
      x: 40 + (index % 3) * 260,
      y: 40 + Math.floor(index / 3) * 150,
    },
    data: {
      title: note.colorName?.trim() || `Nota ${index + 1}`,
      content: note.content,
      createdAt: note.createdAt,
      color: note.color,
    },
  }));

  flowEdges.value = sorted.slice(0, -1).map((note, index) => ({
    id: `edge-${note.id}`,
    source: note.id,
    target: sorted[index + 1]!.id,
    type: "smoothstep",
    animated: true,
    style: { stroke: "#7C3AED", strokeWidth: 2 },
  }));
}

const renderedAnalysis = computed(() =>
  aiAnalysis.value ? md.render(aiAnalysis.value) : "",
);

async function fetchNotes(): Promise<void> {
  if (!props.calendarAiAnalysisId) {
    error.value = "Documento no válido";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const data = await getCalendarAnalysisNotesByAnalysisId(
      props.calendarAiAnalysisId,
    );
    notes.value = [...data].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    rebuildFlowGraph();
  } catch (err) {
    console.error("[CalendarAnalysisNotesModal]", err);
    error.value = "No se pudieron cargar las notas.";
    notes.value = [];
  } finally {
    loading.value = false;
  }
}

async function fetchLatestSavedAnalysis(): Promise<void> {
  if (!props.calendarAiAnalysisId) return;

  loadingSavedAnalysis.value = true;
  try {
    const logs = await getCalendarAnalysisNoteAnalysisLogs(
      props.calendarAiAnalysisId,
    );
    if (logs.length > 0) {
      aiAnalysis.value = logs[0]!.analysis;
    }
  } catch {
    // sin análisis previo
  } finally {
    loadingSavedAnalysis.value = false;
  }
}

async function analyzeNotes(): Promise<void> {
  if (notes.value.length === 0) return;

  analyzing.value = true;
  aiError.value = null;

  try {
    const notesContent = notes.value
      .map(
        (note, index) =>
          `${note.colorName || `Nota ${index + 1}`} (${new Date(note.createdAt).toLocaleDateString("es-ES")}): ${note.content}`,
      )
      .join("\n\n");

    const docLabel =
      props.eventType === "task"
        ? "tarea de calendario"
        : "investigación de calendario";

    const prompt = `Analiza las siguientes notas vinculadas a una ${docLabel} titulada «${props.eventTitle}».
Responde en markdown con estas secciones (usa ### para cada título):

### RESUMEN
Resumen conciso (máximo 4 oraciones).

### ANÁLISIS
Análisis de contenido y matices (máximo 6 oraciones).

### TEMAS CLAVE
Lista de 3 a 5 temas clave.

### CONEXIONES
Patrones o relaciones entre las notas.

### RECOMENDACIONES
Recomendaciones accionables para el equipo clínico/investigador.

Notas:
${notesContent}`;

    aiAnalysis.value = (await useGetGenerativeModelGP(prompt)) as string;
  } catch (err) {
    console.error("[CalendarAnalysisNotesModal] AI", err);
    aiError.value = "No se pudo completar el análisis con IA.";
  } finally {
    analyzing.value = false;
  }
}

async function saveAnalysis(): Promise<void> {
  if (!aiAnalysis.value || !props.calendarAiAnalysisId) return;

  saving.value = true;
  saveError.value = null;
  saveSuccess.value = false;

  try {
    await createCalendarAnalysisNoteAnalysisLog({
      calendar_ai_analysis_id: props.calendarAiAnalysisId,
      analysis: aiAnalysis.value,
      note_count: notes.value.length,
      model: "gemini-3-flash-preview",
      analyzed_at: new Date().toISOString(),
    });
    saveSuccess.value = true;
    setTimeout(() => {
      saveSuccess.value = false;
    }, 3000);
  } catch (err) {
    console.error("[CalendarAnalysisNotesModal] save", err);
    saveError.value = "Error al guardar el análisis.";
  } finally {
    saving.value = false;
  }
}

function close(): void {
  collapsed.value = false;
  createNoteOpen.value = false;
  closeNoteDetail();
  emit("close");
}

function openNoteDetail(data: CalendarNoteDetailData): void {
  selectedNoteDetail.value = {
    title: data.title,
    content: data.content,
    createdAt: data.createdAt,
    color: data.color,
  };
  noteDetailOpen.value = true;
}

function closeNoteDetail(): void {
  noteDetailOpen.value = false;
  selectedNoteDetail.value = null;
}

function findNote(noteId: string): CalendarAnalysisNoteRecord | undefined {
  return notes.value.find((n) => n.id === noteId);
}

function requestRemoveNote(noteId: string): void {
  const note = findNote(noteId);
  if (!note) return;
  notePendingDelete.value = note;
  deleteNoteDialogOpen.value = true;
}

function cancelRemoveNote(): void {
  deleteNoteDialogOpen.value = false;
  notePendingDelete.value = null;
}

async function confirmRemoveNote(): Promise<void> {
  if (!notePendingDelete.value) return;
  deletingNote.value = true;
  const noteId = notePendingDelete.value.id;
  try {
    await deleteCalendarAnalysisNote(noteId);
    notes.value = notes.value.filter((n) => n.id !== noteId);
    if (
      selectedNoteDetail.value?.title === notePendingDelete.value.colorName
    ) {
      closeNoteDetail();
    }
    cancelRemoveNote();
  } catch (err) {
    console.error("[CalendarAnalysisNotesModal] delete", err);
    error.value = "No se pudo eliminar la nota.";
  } finally {
    deletingNote.value = false;
  }
}

function openEditNote(noteId: string): void {
  const note = findNote(noteId);
  if (!note) return;

  editingNoteId.value = noteId;
  editSubject.value = note.colorName;
  editContent.value = note.content;
  editThemeId.value =
    NOTE_COLOR_THEMES.find((t) => t.background === note.color)?.id ??
    NOTE_COLOR_THEMES.find((t) => t.name === note.colorName)?.id ??
    NOTE_COLOR_THEMES[0]!.id;
  editNoteError.value = null;
  editNoteDialogOpen.value = true;
  deleteNoteDialogOpen.value = false;
  notePendingDelete.value = null;
}

function cancelEditNote(): void {
  editNoteDialogOpen.value = false;
  editingNoteId.value = null;
  editSubject.value = "";
  editContent.value = "";
  editNoteError.value = null;
}

async function saveEditNote(): Promise<void> {
  editNoteError.value = null;
  if (!editSubject.value.trim() || !editContent.value.trim()) {
    editNoteError.value = "Completa asunto y contenido para guardar los cambios.";
    return;
  }
  if (!editingNoteId.value) return;

  savingNoteEdit.value = true;
  const theme = editTheme.value;
  try {
    const updated = await updateCalendarAnalysisNote(editingNoteId.value, {
      content: editContent.value.trim(),
      color: theme.background,
      color_name: editSubject.value.trim(),
    });
    const index = notes.value.findIndex((n) => n.id === editingNoteId.value);
    if (index !== -1) {
      notes.value[index] = updated;
    }
    cancelEditNote();
  } catch (err) {
    editNoteError.value =
      err instanceof Error ? err.message : "No se pudo guardar la nota.";
  } finally {
    savingNoteEdit.value = false;
  }
}

function editNoteFromDeleteDialog(): void {
  if (!notePendingDelete.value) return;
  openEditNote(notePendingDelete.value.id);
}

async function onNoteCreated(): Promise<void> {
  await fetchNotes();
}

watch(notes, rebuildFlowGraph, { deep: true });

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      collapsed.value = false;
      void fetchNotes();
      void fetchLatestSavedAnalysis();
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.cal-notes-flow {
  background: #fafafa;
  height: 100%;
}

.cal-notes-collapse-enter-active,
.cal-notes-collapse-leave-active {
  transition: all 0.25s ease;
}
.cal-notes-collapse-enter-from,
.cal-notes-collapse-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.ai-prose :deep(h3) {
  font-size: 1rem;
  font-weight: 700;
  color: #312e81;
  margin: 1rem 0 0.5rem;
}
.ai-prose :deep(p),
.ai-prose :deep(li) {
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.65;
}
.ai-prose :deep(ul) {
  padding-left: 1.25rem;
  margin: 0.5rem 0;
}
</style>
