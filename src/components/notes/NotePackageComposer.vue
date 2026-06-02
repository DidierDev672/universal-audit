<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
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
  NOTE_COLOR_THEMES,
  themeByBackground,
  themeById,
} from "@/shared/constants/noteColorThemes";
import { createNotePackage } from "@/shared/api/notePackageApi";
import type { NotePackageDraftItem } from "@/shared/types/notePackage";

const router = useRouter();

const packageTitle = ref("");
const packageDescription = ref("");
const draftNotes = ref<NotePackageDraftItem[]>([]);

const subject = ref("");
const content = ref("");
const selectedThemeId = ref(NOTE_COLOR_THEMES[0]!.id);

const saving = ref(false);
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const flowNodes = ref<Node[]>([]);
const flowEdges = ref<Edge[]>([]);

const deleteNoteDialogOpen = ref(false);
const notePendingDelete = ref<NotePackageDraftItem | null>(null);

const editNoteDialogOpen = ref(false);
const editingNoteId = ref<string | null>(null);
const editSubject = ref("");
const editContent = ref("");
const editThemeId = ref(NOTE_COLOR_THEMES[0]!.id);
const editNoteError = ref<string | null>(null);

const editTheme = computed(() => themeById(editThemeId.value));

const selectedTheme = computed(() => themeById(selectedThemeId.value));
const canSavePackage = computed(
  () => packageTitle.value.trim().length > 0 && draftNotes.value.length > 0,
);

const newNoteSectionStyle = computed(() => ({
  backgroundColor: selectedTheme.value.background,
  borderColor: `${selectedTheme.value.contentText}33`,
}));

const newNoteHeadingStyle = computed(() => ({
  color: selectedTheme.value.contentText,
}));

const newNoteLabelStyle = computed(() => ({
  color: selectedTheme.value.createdText,
}));

const newNoteFieldStyle = computed(() => ({
  color: selectedTheme.value.contentText,
  borderColor: `${selectedTheme.value.contentText}40`,
  backgroundColor: "rgba(255, 255, 255, 0.72)",
}));

const newNoteAddButtonStyle = computed(() => ({
  backgroundColor: selectedTheme.value.createdText,
  color: "#FFFFFF",
}));

function rebuildFlowGraph(): void {
  const items = draftNotes.value;

  flowNodes.value = items.map((note, index) => ({
    id: note.localId,
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

  flowEdges.value = items.slice(0, -1).map((note, index) => {
    const next = items[index + 1]!;
    const edgeColor =
      themeByBackground(note.color)?.contentText ?? "#64748B";

    return {
      id: `edge-${note.localId}-${next.localId}`,
      source: note.localId,
      target: next.localId,
      type: "smoothstep",
      animated: true,
      style: { stroke: edgeColor, strokeWidth: 2.5 },
    };
  });
}

function addDraftNote() {
  errorMessage.value = null;
  if (!subject.value.trim() || !content.value.trim()) {
    errorMessage.value =
      "Completa asunto y contenido antes de agregar la nota.";
    return;
  }
  const theme = selectedTheme.value;
  draftNotes.value.push({
    localId: crypto.randomUUID(),
    subject: subject.value.trim(),
    content: content.value.trim(),
    color: theme.background,
    colorName: theme.name,
    createdAt: new Date().toISOString(),
  });
  subject.value = "";
  content.value = "";
}

function findDraftNote(localId: string): NotePackageDraftItem | undefined {
  return draftNotes.value.find((n) => n.localId === localId);
}

function requestRemoveDraftNote(localId: string) {
  const note = findDraftNote(localId);
  if (!note) return;
  notePendingDelete.value = note;
  deleteNoteDialogOpen.value = true;
}

function cancelRemoveDraftNote() {
  deleteNoteDialogOpen.value = false;
  notePendingDelete.value = null;
}

function confirmRemoveDraftNote() {
  if (!notePendingDelete.value) return;
  draftNotes.value = draftNotes.value.filter(
    (n) => n.localId !== notePendingDelete.value!.localId,
  );
  cancelRemoveDraftNote();
}

function openEditDraftNote(localId: string) {
  const note = findDraftNote(localId);
  if (!note) return;

  editingNoteId.value = localId;
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

function cancelEditDraftNote() {
  editNoteDialogOpen.value = false;
  editingNoteId.value = null;
  editSubject.value = "";
  editContent.value = "";
  editNoteError.value = null;
}

function saveEditDraftNote() {
  editNoteError.value = null;
  if (!editSubject.value.trim() || !editContent.value.trim()) {
    editNoteError.value = "Completa asunto y contenido para guardar los cambios.";
    return;
  }
  if (!editingNoteId.value) return;

  const theme = editTheme.value;
  const index = draftNotes.value.findIndex(
    (n) => n.localId === editingNoteId.value,
  );
  if (index === -1) return;

  const existing = draftNotes.value[index]!;
  draftNotes.value[index] = {
    ...existing,
    subject: editSubject.value.trim(),
    content: editContent.value.trim(),
    color: theme.background,
    colorName: theme.name,
  };
  cancelEditDraftNote();
}

function editNoteFromDeleteDialog() {
  if (!notePendingDelete.value) return;
  openEditDraftNote(notePendingDelete.value.localId);
}

async function savePackageGlobally() {
  if (!canSavePackage.value) return;
  saving.value = true;
  errorMessage.value = null;
  successMessage.value = null;
  try {
    const result = await createNotePackage({
      title: packageTitle.value.trim(),
      description: packageDescription.value.trim() || null,
      notes: draftNotes.value.map((n) => ({
        subject: n.subject,
        content: n.content,
        color: n.color,
        color_name: n.colorName,
      })),
    });
    successMessage.value = "Paquete guardado correctamente.";
    const id = result.package?.id;
    if (id) {
      setTimeout(
        () => router.push({ name: "note-package-detail", params: { id } }),
        600,
      );
    }
  } catch (e) {
    errorMessage.value =
      e instanceof Error
        ? e.message
        : "No se pudo guardar el paquete de notas.";
  } finally {
    saving.value = false;
  }
}

watch(draftNotes, rebuildFlowGraph, { deep: true, immediate: true });
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8 bg-white/100 rounded-2xl">
    <!-- Z-1 -->
    <header class="mb-8">
      <p class="text-xs font-semibold uppercase tracking-wide text-violet-600">
        Notas
      </p>
      <h1 class="mt-1 text-2xl font-semibold text-slate-900">
        Crear paquete de notas
      </h1>
      <p class="mt-2 text-base font-medium leading-relaxed text-slate-600">
        Agrega notas individuales y guárdalas juntas como una sección o paquete.
      </p>
    </header>

    <div
      v-if="errorMessage"
      class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ errorMessage }}
    </div>
    <div
      v-if="successMessage"
      class="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
    >
      {{ successMessage }}
    </div>

    <section
      class="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 class="text-base font-medium leading-relaxed text-slate-900">
        Datos del paquete
      </h2>
      <label class="mt-4 block">
        <span class="mb-1 block text-base font-medium text-slate-700"
          >Título de la sección</span
        >
        <input
          v-model="packageTitle"
          type="text"
          maxlength="120"
          placeholder="Ej. Seguimiento semanal — paciente A"
          class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base font-medium focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </label>
      <label class="mt-4 block">
        <span class="mb-1 block text-base font-medium text-slate-700"
          >Descripción (opcional)</span
        >
        <textarea
          v-model="packageDescription"
          rows="2"
          placeholder="Contexto del paquete…"
          class="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-base font-medium focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </label>
    </section>

    <!-- Z-2: nueva nota -->
    <section
      class="mb-8 rounded-2xl border p-6 transition-colors duration-300 ease-out"
      :style="newNoteSectionStyle"
    >
      <h2
        class="text-base font-semibold leading-relaxed"
        :style="newNoteHeadingStyle"
      >
        Nueva nota individual
      </h2>
      <p
        class="mt-1 text-sm font-medium leading-relaxed opacity-80"
        :style="newNoteLabelStyle"
      >
        El fondo y el texto se adaptan al color seleccionado.
      </p>
      <label class="mt-4 block">
        <span
          class="mb-1 block text-base font-semibold"
          :style="newNoteLabelStyle"
          >Asunto</span
        >
        <input
          v-model="subject"
          type="text"
          maxlength="120"
          placeholder="Asunto de la nota…"
          class="composer-note-field w-full rounded-xl border px-3 py-2.5 text-base font-medium transition-colors duration-200 focus:outline-none"
          :style="newNoteFieldStyle"
        />
      </label>
      <label class="mt-4 block">
        <span
          class="mb-1 block text-base font-semibold"
          :style="newNoteLabelStyle"
          >Contenido</span
        >
        <textarea
          v-model="content"
          rows="4"
          placeholder="Contenido clínico o de investigación…"
          class="composer-note-field w-full resize-y rounded-xl border px-3 py-2.5 text-base font-medium leading-relaxed transition-colors duration-200 focus:outline-none"
          :style="newNoteFieldStyle"
        />
      </label>
      <div class="mt-4">
        <span
          class="mb-2 block text-xs font-bold uppercase tracking-wider"
          :style="newNoteLabelStyle"
        >
          Color de la nota
        </span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="theme in NOTE_COLOR_THEMES"
            :key="theme.id"
            type="button"
            class="rounded-xl border-2 px-3 py-1.5 text-xs font-semibold transition-all duration-200"
            :class="
              selectedThemeId === theme.id
                ? 'scale-[1.02] shadow-sm'
                : 'opacity-90 hover:opacity-100'
            "
            :style="{
              backgroundColor: theme.background,
              color: theme.contentText,
              borderColor: theme.contentText,
              boxShadow:
                selectedThemeId === theme.id
                  ? `0 0 0 2px rgba(255,255,255,0.85), 0 0 0 4px ${theme.contentText}`
                  : undefined,
            }"
            @click="selectedThemeId = theme.id"
          >
            {{ theme.name }}
          </button>
        </div>
      </div>
      <button
        type="button"
        class="mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
        :style="newNoteAddButtonStyle"
        @click="addDraftNote"
      >
        Agregar nota al paquete
      </button>
    </section>

    <!-- Z-3: borrador + guardar -->
    <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-medium leading-relaxed text-slate-900">
            Notas en este paquete ({{ draftNotes.length }})
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            Las líneas conectan cada nota en el orden en que fue agregada.
          </p>
        </div>
        <button
          type="button"
          class="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          :disabled="!canSavePackage || saving"
          @click="savePackageGlobally"
        >
          {{ saving ? "Guardando…" : "Guardar paquete globalmente" }}
        </button>
      </div>

      <p
        v-if="draftNotes.length === 0"
        class="mt-4 text-base font-medium leading-relaxed text-slate-500"
      >
        Aún no hay notas. Agrega al menos una antes de guardar.
      </p>

      <div
        v-else
        class="mt-4 h-[480px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 shadow-inner"
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
          class="composer-notes-flow"
        >
          <Background pattern-color="#CBD5E1" :gap="20" />
          <MiniMap />
          <Controls />
          <template #node-package-note="nodeProps">
            <NotePackageFlowNode
              :data="nodeProps.data"
              removable
              @edit="openEditDraftNote(nodeProps.id)"
              @remove="requestRemoveDraftNote(nodeProps.id)"
            />
          </template>
        </VueFlow>
      </div>
    </section>

    <Teleport to="body">
      <!-- Diálogo: preferir editar antes de eliminar -->
      <div
        v-if="deleteNoteDialogOpen && notePendingDelete"
        class="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4"
        role="presentation"
        @click.self="cancelRemoveDraftNote"
      >
        <div
          class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/80"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-note-dialog-title"
          aria-describedby="delete-note-dialog-desc"
          @keydown.escape="cancelRemoveDraftNote"
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
                  id="delete-note-dialog-title"
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
              id="delete-note-dialog-desc"
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
              @click="cancelRemoveDraftNote"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-emerald-700"
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
              class="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-rose-700 ring-1 ring-rose-200/80 transition-all duration-200 hover:bg-rose-50"
              @click="confirmRemoveDraftNote"
            >
              Eliminar de todos modos
            </button>
          </footer>
        </div>
      </div>

      <!-- Modal: editar nota -->
      <div
        v-if="editNoteDialogOpen"
        class="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4"
        role="presentation"
        @click.self="cancelEditDraftNote"
      >
        <div
          class="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/80"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-note-dialog-title"
          @keydown.escape="cancelEditDraftNote"
        >
          <header
            class="border-b border-violet-100 bg-linear-to-r from-violet-50 via-white to-sky-50 px-6 py-4"
          >
            <h2
              id="edit-note-dialog-title"
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
              @click="cancelEditDraftNote"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
              @click="saveEditDraftNote"
            >
              Guardar cambios
            </button>
          </footer>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.composer-notes-flow {
  background: #f8fafc;
  height: 100%;
  width: 100%;
}

.composer-notes-flow :deep(.vue-flow__node) {
  cursor: grab;
}

.composer-notes-flow :deep(.vue-flow__node:active) {
  cursor: grabbing;
}

.composer-notes-flow :deep(.vue-flow__edge-path) {
  stroke-linecap: round;
}

.composer-note-field::placeholder {
  opacity: 0.45;
}

.composer-note-field:focus {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.65);
}
</style>
