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
  getNotePackageAnalysisLogs,
  getNotePackageById,
} from "@/shared/api/notePackageApi";
import { runNotePackageAnalysis } from "@/shared/service/notePackageAnalysisAi";
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
const noteDetailOpen = ref(false);
const selectedNoteDetail = ref<NotePackageFlowNodeData | null>(null);

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

watch(notes, rebuildFlowGraph, { deep: true });

onMounted(loadDetail);
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-8 bg-white/100 rounded-2xl">
    <button
      type="button"
      class="mb-4 text-sm font-semibold text-violet-600 hover:underline"
      @click="router.push({ name: 'note-packages' })"
    >
      ← Volver a paquetes
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
      >
        <h2 class="text-base font-medium leading-relaxed text-emerald-900">
          Último análisis guardado
        </h2>
        <p class="mt-1 text-xs text-emerald-700">
          {{ formatDate(latestSavedAnalysis.analyzedAt) }} ·
          {{ latestSavedAnalysis.noteCount }} notas
        </p>
        <div
          class="note-analysis-prose mt-4 text-base font-medium leading-relaxed text-slate-800"
          v-html="renderedSavedAnalysis"
        />
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
            <template #node-package-note="{ data }">
              <NotePackageFlowNode :data="data" @view="openNoteDetail(data)" />
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
    </Teleport>
  </div>
</template>

<style scoped>
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
