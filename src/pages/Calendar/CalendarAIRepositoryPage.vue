<template>
  <div
    class="calendar-ai-repository relative z-10 min-h-[calc(100dvh-8rem)] max-w-7xl mx-auto"
  >
    <!-- Z-1: Header — title top-left, actions top-right -->
    <header
      class="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between bg-white backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg w-full p-4"
    >
      <div class="space-y-2 min-w-0">
        <div class="flex items-center gap-3">
          <!-- Mini biblioteca de iconos (investigación + tarea, estilo Apple) -->
          <div
            class="flex items-center gap-1 shrink-0 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-1"
            aria-hidden="true"
          >
            <div
              class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600"
              title="Investigación"
            >
              <CalendarEventTypeIcon type="research" size="md" />
            </div>
            <div
              class="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600"
              title="Tarea"
            >
              <CalendarEventTypeIcon type="task" size="md" />
            </div>
          </div>
          <div>
            <h1
              class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
            >
              Repositorio IA: Investigaciones y Tareas
            </h1>
            <p class="text-sm text-slate-500 leading-6 mt-1 max-w-2xl">
              Historial de análisis generados por IA desde el calendario. Busca,
              filtra y abre el detalle de cada informe guardado.
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2 shrink-0 lg:pt-1">
        <RouterLink
          to="/calendar"
          class="inline-flex items-center gap-2 py-2.5 px-4 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all"
        >
          <svg
            class="w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Ir al calendario
        </RouterLink>
        <button
          type="button"
          :disabled="loading"
          class="inline-flex items-center gap-2 py-2.5 px-4 text-sm font-medium text-white bg-violet-600 rounded-xl hover:bg-violet-700 disabled:opacity-50 shadow-sm transition-all"
          @click="loadAnalyses"
        >
          <svg
            class="w-4 h-4"
            :class="{ 'animate-spin': loading }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {{ loading ? "Cargando…" : "Actualizar" }}
        </button>
      </div>
    </header>

    <!-- Z-2: Search bar — diagonal focal point -->
    <section
      class="mb-8 mx-auto w-full bg-white backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-4"
    >
      <label class="block">
        <span class="sr-only">Buscar análisis por palabras clave</span>
        <div class="relative">
          <svg
            class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            v-model="searchQuery"
            type="search"
            autocomplete="off"
            placeholder="Buscar por título, investigación, palabras clave o fecha…"
            class="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-10 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
          <button
            v-if="searchQuery.trim()"
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Limpiar búsqueda"
            @click="searchQuery = ''"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
      </label>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="option in typeFilterOptions"
            :key="option.value"
            type="button"
            :class="[
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
              typeFilter === option.value
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-200 hover:text-violet-700',
            ]"
            @click="typeFilter = option.value"
          >
            <CalendarEventTypeIcon
              v-if="option.value !== 'all'"
              :type="option.value"
              size="xs"
              :class="
                typeFilter === option.value
                  ? 'text-white'
                  : option.value === 'research'
                    ? 'text-blue-600'
                    : 'text-purple-600'
              "
            />
            {{ option.label }}
          </button>
        </div>
        <div class="flex items-center gap-2">
          <label
            class="text-xs font-medium text-slate-500 uppercase tracking-wide"
          >
            Fecha
          </label>
          <input
            v-model="dateFilter"
            type="date"
            class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
          <button
            v-if="dateFilter"
            type="button"
            class="text-xs font-medium text-slate-500 hover:text-slate-700"
            @click="dateFilter = ''"
          >
            Limpiar
          </button>
        </div>
      </div>
    </section>

    <!-- Z-3: Tarjetas — escaneo visual sin tabla -->
    <section>
      <div
        v-if="loading && analyses.length === 0"
        class="py-20 text-center rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div
          class="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"
        />
        <p class="text-sm text-slate-500">Cargando repositorio…</p>
      </div>

      <div
        v-else-if="error"
        class="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <div
        v-else-if="filteredAnalyses.length === 0"
        class="py-20 text-center px-6 rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <p class="text-base font-medium text-slate-700">
          No se encontraron análisis
        </p>
        <p class="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-6">
          {{
            analyses.length === 0
              ? "Aún no hay informes guardados. Genera un análisis desde el calendario y guárdalo para verlo aquí."
              : "Prueba con otros filtros o términos de búsqueda."
          }}
        </p>
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5"
      >
        <article
          v-for="record in filteredAnalyses"
          :key="record.id"
          class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-violet-200 hover:shadow-md hover:-translate-y-0.5"
        >
          <div class="flex items-start justify-between gap-3 mb-4">
            <div
              :class="[
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
                record.eventType === 'task'
                  ? 'bg-purple-500/10 text-purple-600'
                  : 'bg-blue-500/10 text-blue-600',
              ]"
            >
              <CalendarEventTypeIcon :type="record.eventType" size="md" />
            </div>
            <time
              class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11.5px] font-medium text-slate-500 tabular-nums bg-white/90 border border-slate-300/40 backdrop-blur-sm"
              :datetime="record.generatedAt || record.eventDate"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
              {{ formatRecordDate(record) }}
            </time>
          </div>

          <span
            :class="[
              'inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide mb-3',
              record.eventType === 'task'
                ? 'bg-purple-50 text-purple-700'
                : 'bg-blue-50 text-blue-700',
            ]"
          >
            {{ record.eventType === "task" ? "Tarea" : "Investigación" }}
          </span>

          <h3
            class="text-base font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-violet-800 transition-colors"
          >
            {{ record.eventTitle }}
          </h3>

          <p
            v-if="record.researchName"
            class="mt-2 text-sm text-slate-500 line-clamp-1"
          >
            {{ record.researchName }}
          </p>

          <p
            v-if="recordExcerpt(record)"
            class="mt-3 text-sm leading-6 text-slate-600 line-clamp-3 flex-1"
          >
            {{ recordExcerpt(record) }}
          </p>

          <div class="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              class="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!hasDocumentAnalysis(record)"
              @click="openDetail(record)"
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              Ver análisis IA
            </button>

            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <RepositoryRecordActionsMenu
                :label="documentAnalysisMenuLabel(record)"
                menu-button-class="bg-slate-50 text-violet-800 border-slate-200 hover:bg-violet-50 hover:border-violet-200"
                :items="documentAnalysisMenuItems(record)"
                @select="(item) => onDocumentMenuSelect(record, item.id)"
              />
              <RepositoryRecordActionsMenu
                :label="noteAnalysisMenuLabel(record)"
                menu-button-class="bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200"
                :items="noteAnalysisMenuItems(record)"
                @select="(item) => onNoteMenuSelect(record, item.id)"
              />
            </div>

            <button
              type="button"
              class="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-700 border border-slate-200 transition-colors hover:bg-slate-50"
              @click="openNotesModal(record)"
            >
              <svg
                class="h-4 w-4 shrink-0 text-violet-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Ver y gestionar notas
            </button>
          </div>
        </article>
      </div>
    </section>

    <p
      v-if="!loading && filteredAnalyses.length > 0"
      class="mt-4 text-center text-xs text-slate-500"
    >
      Mostrando {{ filteredAnalyses.length }} de {{ analyses.length }} análisis
    </p>

    <CalendarAIResearchPanel
      :is-open="detailOpen"
      read-only
      :loading="false"
      :content="selectedRecord?.content ?? ''"
      :event-title="selectedRecord?.eventTitle ?? ''"
      :event-type="selectedRecord?.eventType ?? 'task'"
      :display-date="selectedDisplayDate"
      :research-name="selectedRecord?.researchName ?? null"
      :generated-at="selectedGeneratedAt"
      :context-summary="selectedContextSummary"
      :calendar-ai-analysis-id="selectedRecord?.id ?? ''"
      @close="closeDetail"
      @note-created="onNoteCreatedFromDetail"
    />

    <CalendarAnalysisNotesModal
      :is-open="notesModalOpen"
      :calendar-ai-analysis-id="notesRecord?.id ?? ''"
      :event-title="notesRecord?.eventTitle ?? ''"
      :event-type="notesRecord?.eventType ?? 'task'"
      @close="closeNotesModal"
    />

    <CalendarNoteAnalysisViewModal
      :is-open="noteAnalysisModalOpen"
      :calendar-ai-analysis-id="noteAnalysisRecord?.id ?? ''"
      :event-title="noteAnalysisRecord?.eventTitle ?? ''"
      :event-type="noteAnalysisRecord?.eventType ?? 'task'"
      :auto-generate="noteAnalysisAutoGenerate"
      :force-generate="noteAnalysisForceGenerate"
      @close="closeNoteAnalysisModal"
      @generated="onNoteAnalysisGenerated"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import CalendarAIResearchPanel from "../../components/calendar/CalendarAIResearchPanel.vue";
import CalendarAnalysisNotesModal from "../../components/calendar/CalendarAnalysisNotesModal.vue";
import CalendarNoteAnalysisViewModal from "../../components/calendar/CalendarNoteAnalysisViewModal.vue";
import CalendarEventTypeIcon from "../../components/calendar/CalendarEventTypeIcon.vue";
import RepositoryRecordActionsMenu, {
  type RepositoryMenuItem,
} from "../../components/calendar/RepositoryRecordActionsMenu.vue";
import { getCalendarAiAnalyses } from "../../shared/api/calendarAiAnalysisApi";
import { getCalendarAnalysisNoteAnalysisLogs } from "../../shared/api/calendarAnalysisNoteApi";
import type {
  CalendarAiAnalysisRecord,
  CalendarEventType,
} from "../../shared/types/calendarAiAnalysis";

type TypeFilter = "all" | CalendarEventType;

const typeFilterOptions: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "research", label: "Investigación" },
  { value: "task", label: "Tarea" },
];

const analyses = ref<CalendarAiAnalysisRecord[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref("");
const typeFilter = ref<TypeFilter>("all");
const dateFilter = ref("");

const detailOpen = ref(false);
const selectedRecord = ref<CalendarAiAnalysisRecord | null>(null);
const notesModalOpen = ref(false);
const notesRecord = ref<CalendarAiAnalysisRecord | null>(null);
const noteAnalysisModalOpen = ref(false);
const noteAnalysisRecord = ref<CalendarAiAnalysisRecord | null>(null);
const noteAnalysisAutoGenerate = ref(false);
const noteAnalysisForceGenerate = ref(false);
/** IDs de documentos con al menos un análisis de notas guardado. */
const noteAnalysisIds = ref<Set<string>>(new Set());

const filteredAnalyses = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  const date = dateFilter.value;

  return analyses.value
    .filter((record) => {
      if (typeFilter.value !== "all" && record.eventType !== typeFilter.value) {
        return false;
      }

      if (date) {
        const recordDate = record.eventDate?.slice(0, 10);
        const generatedDate = record.generatedAt?.slice(0, 10);
        if (recordDate !== date && generatedDate !== date) {
          return false;
        }
      }

      if (!query) return true;

      const haystack = [
        record.eventTitle,
        record.researchName ?? "",
        record.content,
        record.eventType === "task" ? "tarea" : "investigación",
        formatRecordDate(record),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    })
    .sort(
      (a, b) =>
        new Date(b.generatedAt || b.createdAt).getTime() -
        new Date(a.generatedAt || a.createdAt).getTime(),
    );
});

const selectedDisplayDate = computed(() => {
  const record = selectedRecord.value;
  if (!record) return "";
  return formatDateRange(
    record.eventDate,
    record.eventEndDate ?? record.eventDate,
  );
});

const selectedGeneratedAt = computed(() => {
  const raw = selectedRecord.value?.generatedAt;
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
});

const selectedContextSummary = computed(() => {
  const record = selectedRecord.value;
  if (!record) return "";
  const tipo =
    record.eventType === "task" ? "tarea especial" : "bloque de investigación";
  const inv = record.researchName
    ? ` vinculada a la investigación «${record.researchName}».`
    : " sin investigación asociada en el calendario.";
  return `Evento de tipo ${tipo} programado para el calendario${inv}`;
});

function formatDateRange(startDate: string, endDate: string): string {
  const fmt = (value: string) => {
    const d = new Date(`${value.slice(0, 10)}T12:00:00`);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  const start = fmt(startDate);
  const end = fmt(endDate);
  return start === end ? start : `${start} – ${end}`;
}

function recordExcerpt(record: CalendarAiAnalysisRecord): string {
  const raw = record.content?.trim();
  if (!raw) return "";
  const plain = raw
    .replace(/^#+\s+/gm, "")
    .replace(/[*_`>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!plain) return "";
  return plain.length > 160 ? `${plain.slice(0, 157)}…` : plain;
}

function formatRecordDate(record: CalendarAiAnalysisRecord): string {
  if (record.generatedAt) {
    const d = new Date(record.generatedAt);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  }
  return formatDateRange(
    record.eventDate,
    record.eventEndDate ?? record.eventDate,
  );
}

function openDetail(record: CalendarAiAnalysisRecord): void {
  selectedRecord.value = record;
  detailOpen.value = true;
}

function closeDetail(): void {
  detailOpen.value = false;
  selectedRecord.value = null;
}

function onNoteCreatedFromDetail(): void {
  // La nota queda vinculada al documento; el usuario puede abrir «Ver y gestionar notas».
}

function openNotesModal(record: CalendarAiAnalysisRecord): void {
  notesRecord.value = record;
  notesModalOpen.value = true;
}

function closeNotesModal(): void {
  notesModalOpen.value = false;
  notesRecord.value = null;
}

function hasDocumentAnalysis(record: CalendarAiAnalysisRecord): boolean {
  return Boolean(record.content?.trim());
}

function hasNoteAnalysis(record: CalendarAiAnalysisRecord): boolean {
  return noteAnalysisIds.value.has(record.id);
}

function documentAnalysisMenuLabel(record: CalendarAiAnalysisRecord): string {
  return hasDocumentAnalysis(record) ? "Informe IA" : "Sin informe";
}

function noteAnalysisMenuLabel(record: CalendarAiAnalysisRecord): string {
  return hasNoteAnalysis(record) ? "Análisis de notas" : "Generar análisis notas";
}

function documentAnalysisMenuItems(
  record: CalendarAiAnalysisRecord,
): RepositoryMenuItem[] {
  const tipo = record.eventType === "task" ? "tarea" : "investigación";
  return [
    {
      id: "view-document",
      label: "Ver análisis IA del informe",
      hint: `Informe generado para la ${tipo}`,
      disabled: !hasDocumentAnalysis(record),
    },
    {
      id: "view-detail",
      label: "Ver detalle completo",
      hint: "Panel con contexto y contenido",
      disabled: !hasDocumentAnalysis(record),
    },
  ];
}

function noteAnalysisMenuItems(record: CalendarAiAnalysisRecord): RepositoryMenuItem[] {
  const tipo = record.eventType === "task" ? "tarea" : "investigación";
  const items: RepositoryMenuItem[] = [];

  if (hasNoteAnalysis(record)) {
    items.push({
      id: "view-notes-analysis",
      label: "Ver análisis de notas guardado",
      hint: "Informe IA sobre las notas vinculadas",
    });
    items.push({
      id: "regenerate-notes-analysis",
      label: "Regenerar análisis de notas",
      hint: `Nuevo informe IA para la ${tipo}`,
    });
  } else {
    items.push({
      id: "generate-notes-analysis",
      label: "Generar análisis de notas",
      hint: `Crea el informe IA a partir de las notas de la ${tipo}`,
    });
  }

  items.push({
    id: "open-notes",
    label: "Abrir notas del documento",
    hint: "Grafo, crear notas y analizar desde el modal",
  });

  return items;
}

function onDocumentMenuSelect(
  record: CalendarAiAnalysisRecord,
  actionId: string,
): void {
  if (actionId === "view-document" || actionId === "view-detail") {
    openDetail(record);
  }
}

function onNoteMenuSelect(record: CalendarAiAnalysisRecord, actionId: string): void {
  switch (actionId) {
    case "view-notes-analysis":
      openNoteAnalysisModal(record, { autoGenerate: false, forceGenerate: false });
      break;
    case "regenerate-notes-analysis":
      openNoteAnalysisModal(record, { autoGenerate: false, forceGenerate: true });
      break;
    case "generate-notes-analysis":
      openNoteAnalysisModal(record, { autoGenerate: true, forceGenerate: false });
      break;
    case "open-notes":
      openNotesModal(record);
      break;
  }
}

function openNoteAnalysisModal(
  record: CalendarAiAnalysisRecord,
  options: { autoGenerate?: boolean; forceGenerate?: boolean } = {},
): void {
  noteAnalysisRecord.value = record;
  noteAnalysisAutoGenerate.value = options.autoGenerate ?? false;
  noteAnalysisForceGenerate.value = options.forceGenerate ?? false;
  noteAnalysisModalOpen.value = true;
}

function closeNoteAnalysisModal(): void {
  noteAnalysisModalOpen.value = false;
  noteAnalysisRecord.value = null;
  noteAnalysisAutoGenerate.value = false;
  noteAnalysisForceGenerate.value = false;
}

function onNoteAnalysisGenerated(): void {
  const id = noteAnalysisRecord.value?.id;
  if (id) {
    noteAnalysisIds.value = new Set([...noteAnalysisIds.value, id]);
  }
}

async function refreshNoteAnalysisIndex(): Promise<void> {
  try {
    const logs = await getCalendarAnalysisNoteAnalysisLogs();
    const ids = new Set<string>();
    for (const log of logs) {
      if (log.calendarAiAnalysisId) {
        ids.add(log.calendarAiAnalysisId);
      }
    }
    noteAnalysisIds.value = ids;
  } catch (err) {
    console.warn("[CalendarAIRepositoryPage] note analysis index", err);
    noteAnalysisIds.value = new Set();
  }
}

async function loadAnalyses(): Promise<void> {
  loading.value = true;
  error.value = null;
  try {
    analyses.value = await getCalendarAiAnalyses();
    await refreshNoteAnalysisIndex();
  } catch (err) {
    console.error("[CalendarAIRepositoryPage]", err);
    error.value =
      "No se pudo cargar el repositorio de análisis. Verifica que el servidor esté disponible.";
    analyses.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadAnalyses();
});
</script>
