<template>
  <Teleport to="body">
    <Transition name="app-modal-fade">
      <div v-if="isOpen" class="app-modal-root" style="z-index: 65">
        <div
          class="app-modal-backdrop"
          aria-hidden="true"
          @click="emit('close')"
        />
        <div
          class="app-modal-scrim app-modal-scrim--sheet"
          @click.self="emit('close')"
        >
          <div
            :class="[
              'app-modal-panel app-modal-panel--sheet relative flex flex-col bg-slate-50 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300',
              expanded
                ? 'w-[96vw] h-[96vh] max-w-none max-h-none'
                : 'w-full sm:w-[75%] max-w-5xl max-h-[92vh]',
            ]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-assign-ai-title"
            @click.stop
            @keydown.escape="onEscape"
          >
            <header
              class="shrink-0 flex items-center justify-between gap-4 px-6 py-4 bg-linear-to-r from-indigo-600 to-violet-600 text-white"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div class="min-w-0">
                  <h2
                    id="task-assign-ai-title"
                    class="text-lg font-bold truncate"
                  >
                    Asignación de tarea con IA
                  </h2>
                  <p class="text-xs text-white/80 truncate">
                    {{ eventTitle || "Tarea del calendario" }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-1 shrink-0 flex-wrap justify-end">
                <button
                  type="button"
                  class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl bg-white/15 hover:bg-white/25 transition-colors border border-white/20"
                  :title="expanded ? 'Reducir' : 'Expandir'"
                  :aria-expanded="expanded"
                  :aria-label="
                    expanded
                      ? 'Reducir modal de asignación IA'
                      : 'Expandir modal de asignación IA'
                  "
                  @click="expanded = !expanded"
                >
                  <svg
                    v-if="!expanded"
                    class="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                  <svg
                    v-else
                    class="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 9L4 4m0 0l5 5M4 4h5m6 5l5-5m0 0l-5 5m5-5v5m-5 6l5 5m0 0l-5-5m5 5v-5"
                    />
                  </svg>
                  <span class="hidden sm:inline">
                    {{ expanded ? "Reducir" : "Expandir" }}
                  </span>
                </button>
                <button
                  type="button"
                  :disabled="!canSave"
                  class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  title="Guardar análisis y propuesta en el servidor"
                  @click="emit('save')"
                >
                  <svg
                    v-if="saving"
                    class="w-4 h-4 animate-spin shrink-0"
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
                  <svg
                    v-else
                    class="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  {{ saving ? "Guardando…" : "Guardar" }}
                </button>
                <button
                  type="button"
                  :disabled="loading || saving"
                  class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl bg-white/20 hover:bg-white/30 disabled:opacity-50 transition-colors"
                  @click="emit('regenerate')"
                >
                  <svg
                    :class="{ 'animate-spin': loading }"
                    class="w-4 h-4 shrink-0"
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
                  <span class="hidden sm:inline">Regenerar</span>
                </button>
                <button
                  type="button"
                  class="p-2 rounded-xl hover:bg-white/20 transition-colors"
                  aria-label="Cerrar"
                  @click="emit('close')"
                >
                  <svg
                    class="w-5 h-5"
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

            <div class="flex-1 min-h-0 overflow-y-auto">
              <div
                v-if="assignment && !loading"
                class="px-6 py-4 border-b border-slate-200 bg-white"
              >
                <p
                  class="text-xs font-semibold uppercase tracking-wider text-violet-600 mb-3"
                >
                  Propuesta de asignación
                </p>
                <dl
                  :class="[
                    'grid gap-3 text-sm',
                    expanded ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2',
                  ]"
                >
                  <div>
                    <dt class="text-slate-500 font-medium">Título</dt>
                    <dd class="text-slate-800 font-semibold mt-0.5">
                      {{ assignment.title }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-slate-500 font-medium">Fechas</dt>
                    <dd class="text-slate-800 mt-0.5">
                      {{ assignment.startDate }} – {{ assignment.endDate }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-slate-500 font-medium">Horario</dt>
                    <dd class="text-slate-800 mt-0.5">
                      {{ assignment.startTime }} – {{ assignment.endTime }}
                    </dd>
                  </div>
                  <div
                    v-if="assignment.description"
                    :class="expanded ? 'sm:col-span-2 lg:col-span-3' : 'sm:col-span-2'"
                  >
                    <dt class="text-slate-500 font-medium">Descripción</dt>
                    <dd class="text-slate-700 mt-0.5 leading-relaxed">
                      {{ assignment.description }}
                    </dd>
                  </div>
                </dl>
              </div>

              <div class="px-6 py-6 max-w-4xl mx-auto w-full">
                <div
                  v-if="loading"
                  class="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div
                    class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"
                  />
                  <p class="text-base font-medium text-slate-700">
                    Generando asignación con IA…
                  </p>
                  <p class="mt-1 text-sm text-slate-500 max-w-sm">
                    Analizamos la tarea y preparamos una propuesta con fechas,
                    horario y recomendaciones.
                  </p>
                </div>

                <div
                  v-else-if="error"
                  class="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-center"
                >
                  <p class="text-sm font-medium text-red-800">{{ error }}</p>
                </div>

                <div
                  v-if="findings.length > 0 && !loading && !error"
                  class="mb-4 rounded-2xl border border-amber-200 bg-amber-50/80 overflow-hidden"
                >
                  <p
                    class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-amber-800 border-b border-amber-200"
                  >
                    Hallazgos detectados
                  </p>
                  <ul class="divide-y divide-amber-100">
                    <li
                      v-for="(finding, idx) in findings"
                      :key="idx"
                      class="px-4 py-3 text-sm"
                    >
                      <p class="font-semibold text-amber-900">
                        {{ finding.title }}
                      </p>
                      <p
                        v-if="finding.description"
                        class="text-amber-800/90 mt-0.5"
                      >
                        {{ finding.description }}
                      </p>
                    </li>
                  </ul>
                  <p class="px-4 py-2 text-xs text-amber-700 bg-amber-50">
                    También se enviaron a sus notificaciones del sistema.
                  </p>
                </div>

                <article
                  v-else-if="content"
                  class="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
                >
                  <div
                    class="px-5 py-3 border-b border-slate-100 bg-slate-50/80"
                  >
                    <p
                      class="text-xs font-semibold uppercase tracking-widest text-slate-500 text-center"
                    >
                      Análisis de la asignación
                    </p>
                    <p
                      v-if="generatedAtLabel"
                      class="text-xs text-slate-400 text-center mt-1"
                    >
                      Generado {{ generatedAtLabel }}
                    </p>
                  </div>
                  <div
                    class="px-6 sm:px-10 py-8 task-assign-ai-prose"
                    v-html="renderedHtml"
                  />
                </article>

                <div
                  v-else
                  class="py-12 text-center text-slate-500 text-sm"
                >
                  No hay contenido para mostrar.
                </div>

                <div
                  v-if="saveSuccess"
                  class="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center"
                >
                  <p class="text-sm font-medium text-emerald-800">
                    Análisis de asignación guardado correctamente.
                  </p>
                </div>
                <div
                  v-if="saveError"
                  class="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center"
                >
                  <p class="text-sm font-medium text-red-800">{{ saveError }}</p>
                </div>
                <div
                  v-if="applied"
                  class="mt-4 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-center"
                >
                  <p class="text-sm font-medium text-violet-800">
                    La propuesta se aplicó a la tarea en el calendario.
                  </p>
                </div>
              </div>
            </div>

            <footer
              class="shrink-0 px-6 py-4 border-t border-slate-200 bg-white flex flex-col-reverse sm:flex-row sm:items-center gap-3 sm:justify-between"
            >
              <button
                type="button"
                class="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium text-slate-700 transition-all"
                @click="emit('close')"
              >
                Cerrar
              </button>
              <button
                type="button"
                :disabled="!assignment || loading || saving"
                class="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                @click="emit('apply')"
              >
                Aplicar propuesta a la tarea
              </button>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import MarkdownIt from "markdown-it";
import type {
  TaskAssignmentFinding,
  TaskAssignmentProposal,
} from "../../shared/types/calendarAiAnalysis";

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    loading?: boolean;
    saving?: boolean;
    error?: string | null;
    saveError?: string | null;
    saveSuccess?: boolean;
    applied?: boolean;
    content?: string;
    assignment?: TaskAssignmentProposal | null;
    findings?: TaskAssignmentFinding[];
    eventTitle?: string;
    generatedAt?: Date | null;
  }>(),
  {
    loading: false,
    saving: false,
    error: null,
    saveError: null,
    saveSuccess: false,
    applied: false,
    content: "",
    assignment: null,
    findings: () => [],
    eventTitle: "",
    generatedAt: null,
  },
);

const emit = defineEmits<{
  close: [];
  regenerate: [];
  save: [];
  apply: [];
}>();

const expanded = ref(false);

watch(
  () => props.isOpen,
  (open) => {
    if (!open) expanded.value = false;
  },
);

const canSave = computed(
  () =>
    !!props.content?.trim() &&
    !!props.assignment &&
    !props.loading &&
    !props.saving,
);

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
});

const renderedHtml = computed(() => {
  if (!props.content?.trim()) return "";
  return md.render(props.content);
});

const generatedAtLabel = computed(() => {
  if (!props.generatedAt) return "";
  return props.generatedAt.toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  });
});

function onEscape(event: KeyboardEvent) {
  if (!expanded.value) return;
  event.stopPropagation();
  expanded.value = false;
}
</script>

<style scoped>
.task-assign-ai-prose :deep(h1),
.task-assign-ai-prose :deep(h2),
.task-assign-ai-prose :deep(h3) {
  color: #1e293b;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
.task-assign-ai-prose :deep(h2) {
  font-size: 1.125rem;
  color: #5b21b6;
}
.task-assign-ai-prose :deep(p),
.task-assign-ai-prose :deep(li) {
  color: #475569;
  line-height: 1.75;
  font-size: 0.9375rem;
}
.task-assign-ai-prose :deep(ul),
.task-assign-ai-prose :deep(ol) {
  padding-left: 1.25rem;
  margin: 0.5rem 0;
}
</style>
