<template>
  <Teleport to="body">
    <Transition name="app-modal">
      <div v-if="isOpen" class="app-modal-root" style="z-index: 60">
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
            class="app-modal-panel app-modal-panel--sheet relative flex flex-col w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-ai-panel-title"
            @click.stop
          >
            <header
              class="sticky top-0 z-20 shrink-0 flex items-center justify-between gap-4 px-6 py-4 bg-linear-to-r from-violet-600/95 to-purple-600/95 backdrop-blur-sm text-white border-b border-white/10"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0"
                >
                  <svg
                    class="w-4 h-4"
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
                </div>
                <div class="min-w-0">
                  <h2
                    id="calendar-ai-panel-title"
                    class="text-base font-semibold truncate"
                  >
                    Análisis con IA
                  </h2>
                  <p class="text-xs text-white/70 truncate">
                    {{ eventTitle || "Evento del calendario" }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button
                  v-if="!readOnly"
                  type="button"
                  :disabled="!canSave || saving"
                  class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Guardar análisis generado por IA"
                  @click="emit('save')"
                >
                  <svg
                    v-if="saving"
                    class="w-4 h-4 animate-spin shrink-0"
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
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  {{ saving ? "Guardando…" : "Guardar" }}
                </button>
                <button
                  v-if="!readOnly"
                  type="button"
                  :disabled="loading || saving"
                  class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 disabled:opacity-50 transition-colors"
                  @click="emit('regenerate')"
                >
                  <svg
                    :class="{ 'animate-spin': loading }"
                    class="w-4 h-4"
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
                  Regenerar
                </button>
                <button
                  type="button"
                  class="p-2 rounded-xl hover:bg-white/10 transition-colors"
                  aria-label="Cerrar"
                  @click="emit('close')"
                >
                  <svg
                    class="w-5 h-5"
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
            </header>

            <div
              class="app-modal-body flex-1 overflow-y-auto max-h-[85vh] ai-panel-scroll px-8 py-10 space-y-12"
            >
              <!-- Metadata row -->
              <div
                class="flex flex-wrap items-center justify-between gap-3 max-w-4xl mx-auto w-full"
              >
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide',
                    eventType === 'task'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800',
                  ]"
                >
                  {{ eventType === "task" ? "Tarea" : "Investigación" }}
                </span>
                <div
                  class="flex items-center gap-2 text-sm text-slate-500"
                >
                  <svg
                    class="w-4 h-4 text-slate-400 shrink-0"
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
                  <span>{{ displayDate || "—" }}</span>
                </div>
              </div>

              <!-- Main title + generated timestamp -->
              <div class="text-center max-w-4xl mx-auto space-y-3">
                <h3 class="text-3xl sm:text-4xl font-bold text-slate-800 leading-tight tracking-tight">
                  {{ eventTitle }}
                </h3>
                <p
                  v-if="researchName"
                  class="text-sm text-slate-500 font-medium"
                >
                  Investigación: {{ researchName }}
                </p>
                <p
                  v-if="generatedAtLabel"
                  class="text-sm text-slate-500"
                >
                  Generado el {{ generatedAtLabel }}
                </p>
              </div>

              <!-- Summary cards -->
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full"
              >
                <div
                  class="bg-slate-50 border border-slate-200 rounded-2xl p-6"
                >
                  <p
                    class="text-xs uppercase tracking-wider font-semibold text-violet-600 mb-3"
                  >
                    Contexto del evento
                  </p>
                  <p class="text-sm leading-7 text-slate-700">
                    {{ contextSummary }}
                  </p>
                </div>
                <div
                  class="bg-slate-50 border border-slate-200 rounded-2xl p-6"
                >
                  <p
                    class="text-xs uppercase tracking-wider font-semibold text-violet-600 mb-3"
                  >
                    Enfoque del análisis
                  </p>
                  <p class="text-sm leading-7 text-slate-700">
                    Síntesis orientada a salud auditiva, planificación y
                    decisiones accionables para el equipo de investigación.
                  </p>
                </div>
              </div>

              <!-- Analysis content -->
              <div class="max-w-4xl mx-auto w-full space-y-8">
                <div
                  v-if="loading"
                  class="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div
                    class="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-4"
                  />
                  <p class="text-base font-medium text-slate-800">
                    Generando análisis con IA…
                  </p>
                  <p class="mt-2 text-sm text-slate-500 max-w-sm leading-7">
                    Estamos procesando el evento del calendario para ofrecerte un
                    resumen claro y fácil de escanear.
                  </p>
                </div>

                <div
                  v-else-if="error"
                  class="rounded-2xl border border-red-200 bg-red-50 px-6 py-5"
                >
                  <p class="text-sm font-medium text-red-800">{{ error }}</p>
                </div>

                <template v-else-if="content">
                  <section
                    v-for="section in analysisSections"
                    :key="section.id"
                    class="bg-white border border-slate-200 rounded-2xl overflow-hidden"
                  >
                    <button
                      v-if="section.collapsible"
                      type="button"
                      class="w-full flex items-center justify-between gap-4 px-8 py-5 text-left hover:bg-slate-50/80 transition-colors"
                      :aria-expanded="!isSectionCollapsed(section.id)"
                      @click="toggleSection(section.id)"
                    >
                      <h4 class="text-xl font-semibold text-slate-800">
                        {{ section.title }}
                      </h4>
                      <svg
                        class="w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200"
                        :class="{ 'rotate-180': !isSectionCollapsed(section.id) }"
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
                    </button>
                    <div
                      v-else
                      class="px-8 pt-8 pb-2"
                    >
                      <p
                        class="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2"
                      >
                        Resultado del análisis
                      </p>
                      <h4 class="text-xl font-semibold text-slate-800">
                        {{ section.title }}
                      </h4>
                    </div>

                    <div
                      v-show="!section.collapsible || !isSectionCollapsed(section.id)"
                      class="px-8 pb-8 space-y-6"
                    >
                      <div
                        class="ai-reading-prose max-w-3xl mx-auto"
                        v-html="section.html"
                      />
                    </div>
                  </section>
                </template>

                <div
                  v-else
                  class="py-12 text-center text-slate-500 text-sm"
                >
                  No hay contenido para mostrar.
                </div>

                <div
                  v-if="saveSuccess"
                  class="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4"
                >
                  <p class="text-sm font-medium text-emerald-800">
                    Análisis guardado correctamente en el servidor.
                  </p>
                </div>
                <div
                  v-if="saveError"
                  class="rounded-2xl border border-red-200 bg-red-50 px-6 py-4"
                >
                  <p class="text-sm font-medium text-red-800">{{ saveError }}</p>
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

interface AnalysisSection {
  id: string;
  title: string;
  html: string;
  collapsible: boolean;
  defaultOpen: boolean;
}

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    readOnly?: boolean;
    loading?: boolean;
    saving?: boolean;
    error?: string | null;
    saveError?: string | null;
    saveSuccess?: boolean;
    content?: string;
    eventTitle?: string;
    eventType?: "task" | "research";
    displayDate?: string;
    researchName?: string | null;
    generatedAt?: Date | null;
    contextSummary?: string;
  }>(),
  {
    readOnly: false,
    loading: false,
    saving: false,
    error: null,
    saveError: null,
    saveSuccess: false,
    content: "",
    eventTitle: "",
    eventType: "task",
    displayDate: "",
    researchName: null,
    generatedAt: null,
    contextSummary: "",
  },
);

const emit = defineEmits<{
  close: [];
  regenerate: [];
  save: [];
}>();

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
});

const collapsedSections = ref<Record<string, boolean>>({});

const canSave = computed(
  () => !!props.content?.trim() && !props.loading && !props.saving,
);

function parseAnalysisSections(content: string): AnalysisSection[] {
  const trimmed = content.trim();
  if (!trimmed) return [];

  const hasH2 = /^##\s+/m.test(trimmed);
  const chunks = hasH2
    ? trimmed.split(/(?=^##\s+)/m).filter(Boolean)
    : [trimmed];

  return chunks.map((chunk, index) => {
    const titleMatch = chunk.match(/^##\s+(.+?)(?:\r?\n|$)/);
    const title = titleMatch
      ? titleMatch[1].trim()
      : index === 0
        ? "Análisis"
        : `Sección ${index + 1}`;
    const body = titleMatch
      ? chunk.slice(titleMatch[0].length).trim()
      : chunk.trim();
    const markdown = titleMatch ? body : chunk.trim();
    const defaultOpen = index === 0;

    return {
      id: `section-${index}`,
      title,
      html: md.render(markdown || chunk.trim()),
      collapsible: hasH2 && index > 0,
      defaultOpen,
    };
  });
}

const analysisSections = computed(() =>
  parseAnalysisSections(props.content ?? ""),
);

watch(
  () => props.content,
  () => {
    const next: Record<string, boolean> = {};
    for (const section of analysisSections.value) {
      if (section.collapsible) {
        next[section.id] = !section.defaultOpen;
      }
    }
    collapsedSections.value = next;
  },
  { immediate: true },
);

function isSectionCollapsed(id: string): boolean {
  return collapsedSections.value[id] ?? false;
}

function toggleSection(id: string): void {
  collapsedSections.value[id] = !isSectionCollapsed(id);
}

const generatedAtLabel = computed(() => {
  if (!props.generatedAt) return "";
  return props.generatedAt.toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  });
});
</script>

<style scoped>
.ai-panel-scroll {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.ai-panel-scroll::-webkit-scrollbar {
  width: 6px;
}

.ai-panel-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.ai-panel-scroll::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 9999px;
}

.ai-panel-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}

.ai-reading-prose :deep(h1),
.ai-reading-prose :deep(h2),
.ai-reading-prose :deep(h3),
.ai-reading-prose :deep(h4) {
  color: #1e293b;
  font-weight: 600;
  line-height: 1.35;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.ai-reading-prose :deep(h1) {
  font-size: 1.5rem;
}

.ai-reading-prose :deep(h2) {
  font-size: 1.25rem;
}

.ai-reading-prose :deep(h3) {
  font-size: 1.125rem;
}

.ai-reading-prose :deep(h4) {
  font-size: 1rem;
}

.ai-reading-prose :deep(p) {
  color: #334155;
  font-size: 1rem;
  line-height: 2;
  margin: 0.75rem 0;
}

.ai-reading-prose :deep(ul),
.ai-reading-prose :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
  color: #334155;
  line-height: 1.875;
}

.ai-reading-prose :deep(li) {
  margin: 0.35rem 0;
}

.ai-reading-prose :deep(li::marker) {
  color: #7c3aed;
}

.ai-reading-prose :deep(strong) {
  color: #1e293b;
  font-weight: 600;
}

.ai-reading-prose :deep(blockquote) {
  border-left: 4px solid #8b5cf6;
  background: #f5f3ff;
  padding: 1.25rem 1.5rem;
  margin: 1.25rem 0;
  border-radius: 0 0.75rem 0.75rem 0;
  color: #5b21b6;
  font-style: normal;
}

.ai-reading-prose :deep(blockquote p) {
  color: #5b21b6;
  margin: 0.25rem 0;
}

.ai-reading-prose :deep(hr) {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 2rem 0;
}

.ai-reading-prose :deep(a) {
  color: #7c3aed;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.ai-reading-prose :deep(a:hover) {
  color: #6d28d9;
}

.ai-reading-prose :deep(code) {
  font-size: 0.875rem;
  background: #f1f5f9;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  color: #475569;
}

.ai-reading-prose :deep(> :first-child) {
  margin-top: 0;
}

.ai-reading-prose :deep(> :last-child) {
  margin-bottom: 0;
}
</style>
