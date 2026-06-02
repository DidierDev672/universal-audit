<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import MarkdownIt from "markdown-it";
import type { Edge, Node } from "@vue-flow/core";
import { VueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { MiniMap } from "@vue-flow/minimap";
import { Controls } from "@vue-flow/controls";
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import NotePackageFlowNode, {
  type NotePackageFlowNodeData,
} from "@/components/notes/NotePackageFlowNode.vue";
import {
  createNotePackageAnalysisLog,
  deleteNotePackageItem,
  getNotePackageAnalysisLogs,
  getNotePackageById,
  updateNotePackageItem,
} from "@/shared/api/notePackageApi";
import { runNotePackageAnalysis } from "@/shared/service/notePackageAnalysisAi";
import {
  NOTE_COLOR_THEMES,
  themeById,
} from "@/shared/constants/noteColorThemes";
import type {
  NotePackageAnalysisLogRecord,
  NotePackageItemRecord,
  NotePackageRecord,
} from "@/shared/types/notePackage";

const route = useRoute();
const router = useRouter();
const packageId = computed(() => String(route.params.id ?? ""));

const loading = ref(true);
const analyzing = ref(false);
const savingAnalysis = ref(false);
const errorMessage = ref<string | null>(null);
const pkg = ref<NotePackageRecord | null>(null);
const notes = ref<NotePackageItemRecord[]>([]);
const logs = ref<NotePackageAnalysisLogRecord[]>([]);
const draftAnalysis = ref<string | null>(null);
const showAnalysisModal = ref(false);
const savedAnalysisVisible = ref(true);
const noteDetailOpen = ref(false);
const selectedNoteDetail = ref<NotePackageFlowNodeData | null>(null);

const deleteNoteDialogOpen = ref(false);
const notePendingDelete = ref<NotePackageItemRecord | null>(null);
const deletingNote = ref(false);

const editNoteDialogOpen = ref(false);
const editingNoteId = ref<string | null>(null);
const editSubject = ref("");
const editContent = ref("");
const editThemeId = ref(NOTE_COLOR_THEMES[0]!.id);
const editNoteError = ref<string | null>(null);
const savingNoteEdit = ref(false);

const editTheme = computed(() => themeById(editThemeId.value));

const flowNodes = ref<Node[]>([]);
const flowEdges = ref<Edge[]>([]);

const md = new MarkdownIt({ html: false, linkify: true, breaks: true });
const renderedDraftAnalysis = computed(() =>
  draftAnalysis.value ? md.render(draftAnalysis.value) : "",
);
const latestSavedAnalysis = computed(() => logs.value[0] ?? null);
const renderedSavedAnalysis = computed(() =>
  latestSavedAnalysis.value
    ? md.render(latestSavedAnalysis.value.analysis)
    : "",
);

function rebuildFlowGraph(): void {
  const sorted = [...notes.value].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  flowNodes.value = sorted.map((note, index) => ({
    id: note.id,
    type: "package-note",
    position: {
      x: 60 + (index % 2) * 300,
      y: 40 + Math.floor(index / 2) * 180,
    },
    data: {
      subject: note.subject,
      content: note.content,
      colorName: note.colorName,
      createdAt: note.createdAt,
      color: note.color,
    } satisfies NotePackageFlowNodeData,
  }));

  flowEdges.value = sorted.slice(0, -1).map((note, index) => ({
    id: `edge-${note.id}-${sorted[index + 1]!.id}`,
    source: note.id,
    target: sorted[index + 1]!.id,
    type: "smoothstep",
    animated: true,
    style: { stroke: "#7C3AED", strokeWidth: 2.5 },
  }));
}

async function loadDetail() {
  loading.value = true;
  errorMessage.value = null;
  try {
    const detail = await getNotePackageById(packageId.value);
    pkg.value = detail.package;
    notes.value = detail.notes ?? [];
    logs.value = await getNotePackageAnalysisLogs(packageId.value);
    rebuildFlowGraph();
  } catch (e) {
    errorMessage.value =
      e instanceof Error ? e.message : "No se pudo cargar el paquete.";
  } finally {
    loading.value = false;
  }
}

async function analyzeWithAi() {
  if (!pkg.value) return;
  analyzing.value = true;
  errorMessage.value = null;
  try {
    const result = await runNotePackageAnalysis({
      notePackageId: packageId.value,
      packageTitle: pkg.value.title,
    });
    draftAnalysis.value = result.analysisMarkdown;
    showAnalysisModal.value = true;
  } catch (e) {
    errorMessage.value =
      e instanceof Error ? e.message : "Error al generar el análisis con IA.";
  } finally {
    analyzing.value = false;
  }
}

async function saveAnalysis() {
  if (!draftAnalysis.value || !pkg.value) return;
  savingAnalysis.value = true;
  errorMessage.value = null;
  try {
    const saved = await createNotePackageAnalysisLog({
      note_package_id: packageId.value,
      analysis: draftAnalysis.value,
      note_count: notes.value.length,
      model: "gemini-3-flash-preview",
      analyzed_at: new Date().toISOString(),
    });
    logs.value = [saved, ...logs.value];
    showAnalysisModal.value = false;
    savedAnalysisVisible.value = true;
  } catch (e) {
    errorMessage.value =
      e instanceof Error ? e.message : "No se pudo guardar el análisis.";
  } finally {
    savingAnalysis.value = false;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function openNoteDetail(data: NotePackageFlowNodeData): void {
  selectedNoteDetail.value = data;
  noteDetailOpen.value = true;
}

function closeNoteDetail(): void {
  noteDetailOpen.value = false;
  selectedNoteDetail.value = null;
}

function toggleSavedAnalysis(): void {
  savedAnalysisVisible.value = !savedAnalysisVisible.value;
}

function findNote(noteId: string): NotePackageItemRecord | undefined {
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
  if (!notePendingDelete.value || !pkg.value) return;
  deletingNote.value = true;
  errorMessage.value = null;
  const noteId = notePendingDelete.value.id;
  try {
    await deleteNotePackageItem(packageId.value, noteId);
    notes.value = notes.value.filter((n) => n.id !== noteId);
    pkg.value = { ...pkg.value, noteCount: notes.value.length };
    if (selectedNoteDetail.value?.subject === notePendingDelete.value.subject) {
      closeNoteDetail();
    }
    cancelRemoveNote();
  } catch (e) {
    errorMessage.value =
      e instanceof Error ? e.message : "No se pudo eliminar la nota.";
  } finally {
    deletingNote.value = false;
  }
}

function openEditNote(noteId: string): void {
  const note = findNote(noteId);
  if (!note) return;

  editingNoteId.value = noteId;
  editSubject.value = note.subject;
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
  errorMessage.value = null;
  const theme = editTheme.value;
  try {
    const updated = await updateNotePackageItem(
      packageId.value,
      editingNoteId.value,
      {
        subject: editSubject.value.trim(),
        content: editContent.value.trim(),
        color: theme.background,
        color_name: theme.name,
      },
    );
    const index = notes.value.findIndex((n) => n.id === editingNoteId.value);
    if (index !== -1) {
      notes.value[index] = updated;
    }
    cancelEditNote();
  } catch (e) {
    editNoteError.value =
      e instanceof Error ? e.message : "No se pudo guardar la nota.";
  } finally {
    savingNoteEdit.value = false;
  }
}

function editNoteFromDeleteDialog(): void {
  if (!notePendingDelete.value) return;
  openEditNote(notePendingDelete.value.id);
}

watch(notes, rebuildFlowGraph, { deep: true });

onMounted(loadDetail);
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8 bg-white/100 rounded-2xl">
    <button
      type="button"
      class="back-to-packages group mb-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition-all duration-300 ease-out hover:bg-linear-to-r hover:from-white hover:via-sky-50/90 hover:to-emerald-50/80 hover:text-blue-900 hover:shadow-sm hover:ring-1 hover:ring-blue-100/80 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2"
      @click="router.push({ name: 'note-packages' })"
    >
      <svg
        class="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-x-0.5 group-hover:text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span
        class="rounded-md px-1 transition-colors duration-300 group-hover:bg-white/60"
      >
        Volver a paquetes
      </span>
    </button>

    <div v-if="loading" class="flex justify-center py-16">
      <div
        class="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"
      />
    </div>

    <template v-else-if="pkg">
      <header
        class="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <p
          class="text-xs font-semibold uppercase tracking-wide text-emerald-600"
        >
          Sección
        </p>
        <h1 class="mt-1 text-2xl font-semibold text-slate-900">
          {{ pkg.title }}
        </h1>
        <p
          v-if="pkg.description"
          class="mt-2 text-base font-medium leading-relaxed text-slate-600"
        >
          {{ pkg.description }}
        </p>
        <p class="mt-2 text-sm font-medium text-slate-400">
          {{ notes.length }} {{ notes.length === 1 ? "nota" : "notas" }} ·
          {{ formatDate(pkg.createdAt) }}
        </p>
        <button
          type="button"
          class="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          :disabled="analyzing || notes.length === 0"
          @click="analyzeWithAi"
        >
          {{ analyzing ? "Analizando…" : "Analizar notas con IA" }}
        </button>
      </header>

      <div
        v-if="errorMessage"
        class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ errorMessage }}
      </div>

      <section
        v-if="latestSavedAnalysis"
        class="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6"
        aria-labelledby="saved-analysis-heading"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <h2
              id="saved-analysis-heading"
              class="text-base font-medium leading-relaxed text-emerald-900"
            >
              Último análisis guardado
            </h2>
            <p class="mt-1 text-xs text-emerald-700">
              {{ formatDate(latestSavedAnalysis.analyzedAt) }} ·
              {{ latestSavedAnalysis.noteCount }} notas
            </p>
          </div>
          <button
            type="button"
            class="analysis-toggle group inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition-all duration-300 ease-out hover:bg-linear-to-r hover:from-white hover:via-sky-50/90 hover:to-emerald-50/80 hover:text-blue-900 hover:shadow-sm hover:ring-1 hover:ring-blue-100/80 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2"
            :aria-expanded="savedAnalysisVisible"
            aria-controls="saved-analysis-content"
            @click="toggleSavedAnalysis"
          >
            <svg
              class="h-4 w-4 shrink-0 text-emerald-600 transition-transform duration-300 ease-out"
              :class="savedAnalysisVisible ? 'rotate-180' : 'rotate-0'"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
            {{ savedAnalysisVisible ? "Ocultar análisis" : "Mostrar análisis" }}
          </button>
        </div>

        <Transition name="saved-analysis-reveal">
          <div
            v-show="savedAnalysisVisible"
            id="saved-analysis-content"
            class="note-analysis-prose mt-4 text-base font-medium leading-relaxed text-slate-800"
            v-html="renderedSavedAnalysis"
          />
        </Transition>
      </section>

      <section>
        <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 class="text-base font-medium leading-relaxed text-slate-900">
              Notas del paquete
            </h2>
            <p class="mt-1 text-sm text-slate-500">
              Las líneas conectan las notas en orden cronológico.
            </p>
          </div>
        </div>

        <div
          v-if="notes.length === 0"
          class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center text-sm text-slate-500"
        >
          Esta sección no tiene notas todavía.
        </div>

        <div
          v-else
          class="h-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 shadow-inner"
        >
          <VueFlow
            v-model:nodes="flowNodes"
            v-model:edges="flowEdges"
            :default-zoom="0.9"
            :min-zoom="0.25"
            :max-zoom="1.75"
            :nodes-draggable="true"
            :nodes-connectable="false"
            :elements-selectable="true"
            fit-view-on-init
            class="pkg-notes-flow"
          >
            <Background pattern-color="#CBD5E1" :gap="20" />
            <MiniMap />
            <Controls />
            <template #node-package-note="nodeProps">
              <NotePackageFlowNode
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
    </template>

    <Teleport to="body">
      <div
        v-if="showAnalysisModal"
        class="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4"
        @click.self="showAnalysisModal = false"
      >
        <div
          class="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          <header
            class="border-b border-slate-200 bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4"
          >
            <h2 class="text-lg font-bold text-white">Análisis IA — borrador</h2>
            <p class="text-xs text-emerald-100">
              Revisa y guarda el análisis en este paquete
            </p>
          </header>
          <div class="flex-1 overflow-y-auto p-6">
            <div
              class="note-analysis-prose text-base font-medium leading-relaxed text-slate-800"
              v-html="renderedDraftAnalysis"
            />
          </div>
          <footer
            class="flex flex-wrap justify-end gap-2 border-t border-slate-200 px-6 py-4"
          >
            <button
              type="button"
              class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              @click="showAnalysisModal = false"
            >
              Cerrar
            </button>
            <button
              type="button"
              class="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              :disabled="savingAnalysis"
              @click="saveAnalysis"
            >
              {{ savingAnalysis ? "Guardando…" : "Guardar análisis" }}
            </button>
          </footer>
        </div>
      </div>

      <div
        v-if="noteDetailOpen && selectedNoteDetail"
        class="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4"
        @click.self="closeNoteDetail"
      >
        <div
          class="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pkg-note-detail-title"
        >
          <header
            class="border-b px-6 py-4"
            :style="{ backgroundColor: selectedNoteDetail.color ?? '#FAD4C0' }"
          >
            <p
              class="text-xs font-semibold uppercase tracking-wide text-slate-700/80"
            >
              Nota completa
            </p>
            <h2
              id="pkg-note-detail-title"
              class="mt-1 text-lg font-bold text-slate-900"
            >
              {{ selectedNoteDetail.subject }}
            </h2>
          </header>
          <div class="max-h-[50vh] overflow-y-auto p-6">
            <p
              class="whitespace-pre-wrap text-sm leading-relaxed text-slate-700"
            >
              {{ selectedNoteDetail.content }}
            </p>
          </div>
          <footer
            class="flex items-center justify-between border-t border-slate-200 px-6 py-4"
          >
            <span class="text-xs font-medium text-slate-500">
              {{ selectedNoteDetail.colorName }} ·
              {{ formatDate(selectedNoteDetail.createdAt) }}
            </span>
            <button
              type="button"
              class="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
              @click="closeNoteDetail"
            >
              Cerrar
            </button>
          </footer>
        </div>
      </div>

      <div
        v-if="deleteNoteDialogOpen && notePendingDelete"
        class="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4"
        role="presentation"
        @click.self="cancelRemoveNote"
      >
        <div
          class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/80"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-pkg-note-dialog-title"
          aria-describedby="delete-pkg-note-dialog-desc"
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
                  id="delete-pkg-note-dialog-title"
                  class="text-base font-semibold text-slate-900"
                >
                  ¿Eliminar esta nota?
                </h2>
                <p class="mt-1 text-sm font-medium text-slate-600">
                  «{{ notePendingDelete.subject }}»
                </p>
              </div>
            </div>
          </header>

          <div class="px-6 py-5">
            <p
              id="delete-pkg-note-dialog-desc"
              class="text-sm leading-relaxed text-slate-700"
            >
              Cada nota aporta contexto al
              <strong class="font-semibold text-slate-900"
                >análisis clínico e investigación</strong
              >. Si la elimina, esa información dejará de considerarse y el
              resultado posterior puede perder relevancia o completitud.
            </p>
            <p class="mt-3 text-sm leading-relaxed text-slate-700">
              Si el contenido no es exacto, le recomendamos
              <strong class="font-semibold text-emerald-800"
                >editar la nota</strong
              >
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
        class="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4"
        role="presentation"
        @click.self="cancelEditNote"
      >
        <div
          class="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/80"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-pkg-note-dialog-title"
          @keydown.escape="cancelEditNote"
        >
          <header
            class="border-b border-violet-100 bg-linear-to-r from-violet-50 via-white to-sky-50 px-6 py-4"
          >
            <h2
              id="edit-pkg-note-dialog-title"
              class="text-base font-semibold text-slate-900"
            >
              Editar nota del paquete
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
  </div>
</template>

<style scoped>
.back-to-packages:hover {
  box-shadow:
    0 1px 2px rgba(37, 99, 235, 0.06),
    0 4px 16px rgba(13, 148, 136, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.analysis-toggle:hover {
  box-shadow:
    0 1px 2px rgba(37, 99, 235, 0.06),
    0 4px 16px rgba(13, 148, 136, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.saved-analysis-reveal-enter-active,
.saved-analysis-reveal-leave-active {
  overflow: hidden;
  transition:
    opacity 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    max-height 0.38s cubic-bezier(0.22, 1, 0.36, 1),
    margin-top 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}

.saved-analysis-reveal-enter-from,
.saved-analysis-reveal-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
}

.saved-analysis-reveal-enter-to,
.saved-analysis-reveal-leave-from {
  opacity: 1;
  max-height: 4000px;
  margin-top: 1rem;
}

.pkg-notes-flow {
  background: #f8fafc;
  height: 100%;
  width: 100%;
}

.pkg-notes-flow :deep(.vue-flow__node) {
  cursor: grab;
}

.pkg-notes-flow :deep(.vue-flow__node:active) {
  cursor: grabbing;
}

.pkg-notes-flow :deep(.vue-flow__edge-path) {
  stroke-linecap: round;
}

:deep(.note-analysis-prose h3) {
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
:deep(.note-analysis-prose ul) {
  list-style: disc;
  padding-left: 1.25rem;
}
</style>
