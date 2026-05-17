<template>
  <transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
      @click.self="emit('close')"
    >
      <div
        class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div
        class="relative flex flex-col w-full max-w-4xl max-h-[92vh] bg-slate-50 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-labelledby="calendar-ai-panel-title"
        @click.stop
      >
        <!-- Barra superior -->
        <div
          class="shrink-0 flex items-center justify-between gap-4 px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div
              class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0"
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
              <h2 id="calendar-ai-panel-title" class="text-lg font-bold truncate">
                Análisis con IA
              </h2>
              <p class="text-xs text-white/80 truncate">
                {{ eventTitle || "Evento del calendario" }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              :disabled="!canSave || saving"
              class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              title="Guardar análisis generado por IA"
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
                class="w-4 h-4"
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
              Regenerar
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
        </div>

        <!-- Contenido con patrón Z -->
        <div class="flex-1 overflow-y-auto">
          <!-- Z-1: esquina superior izquierda → derecha -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 gap-3 px-6 pt-6 pb-2 max-w-3xl mx-auto w-full"
          >
            <div
              class="flex items-center gap-2 justify-center sm:justify-start text-sm"
            >
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  eventType === 'task'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800',
                ]"
              >
                {{ eventType === "task" ? "Tarea" : "Investigación" }}
              </span>
            </div>
            <div
              class="flex items-center gap-2 justify-center sm:justify-end text-sm text-slate-600"
            >
              <svg
                class="w-4 h-4 text-slate-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span class="font-medium">{{ formattedDate }}</span>
            </div>
          </div>

          <!-- Z-2: ancla central (título + investigación) -->
          <div class="px-6 py-4 text-center max-w-2xl mx-auto">
            <h3 class="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight tracking-tight">
              {{ eventTitle }}
            </h3>
            <p
              v-if="researchName"
              class="mt-2 text-sm text-slate-500 font-medium"
            >
              Investigación: {{ researchName }}
            </p>
            <p
              v-if="generatedAtLabel"
              class="mt-3 text-xs text-slate-400"
            >
              Generado {{ generatedAtLabel }}
            </p>
          </div>

          <!-- Z-3: diagonal — tarjetas contexto (izq) → enfoque (der) -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-2 max-w-3xl mx-auto w-full"
          >
            <div
              class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-center md:text-left"
            >
              <p class="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
                Contexto del evento
              </p>
              <p class="text-sm text-slate-600 leading-relaxed">
                {{ contextSummary }}
              </p>
            </div>
            <div
              class="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 shadow-sm text-center md:text-right"
            >
              <p class="text-xs font-semibold uppercase tracking-wider text-indigo-700 mb-2">
                Enfoque del análisis
              </p>
              <p class="text-sm text-indigo-900/80 leading-relaxed">
                Síntesis orientada a salud auditiva, planificación y decisiones
                accionables para el equipo de investigación.
              </p>
            </div>
          </div>

          <!-- Z-4: zona principal de lectura (centrada) -->
          <div class="px-6 pb-8 max-w-3xl mx-auto w-full">
            <div
              v-if="loading"
              class="flex flex-col items-center justify-center py-16 text-center"
            >
              <div
                class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"
              />
              <p class="text-base font-medium text-slate-700">
                Generando análisis con IA…
              </p>
              <p class="mt-1 text-sm text-slate-500 max-w-sm">
                Estamos procesando el evento del calendario para ofrecerte un
                resumen claro y fácil de escanear.
              </p>
            </div>

            <div
              v-else-if="error"
              class="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-center"
            >
              <p class="text-sm font-medium text-red-800">{{ error }}</p>
            </div>

            <article
              v-else-if="content"
              class="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
            >
              <div
                class="px-5 py-3 border-b border-slate-100 bg-slate-50/80 text-center"
              >
                <p class="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Resultado del análisis
                </p>
              </div>
              <div
                class="px-6 sm:px-10 py-8 ai-z-prose mx-auto text-center"
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
                Análisis guardado correctamente en el servidor.
              </p>
            </div>
            <div
              v-if="saveError"
              class="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center"
            >
              <p class="text-sm font-medium text-red-800">{{ saveError }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MarkdownIt from "markdown-it";

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
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

const canSave = computed(
  () => !!props.content?.trim() && !props.loading && !props.saving,
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

const formattedDate = computed(() => {
  if (!props.displayDate) return "—";
  const d = new Date(props.displayDate + "T12:00:00");
  if (Number.isNaN(d.getTime())) return props.displayDate;
  return d.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

const generatedAtLabel = computed(() => {
  if (!props.generatedAt) return "";
  return props.generatedAt.toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  });
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Lectura centrada + escaneo Z en el cuerpo del análisis */
.ai-z-prose :deep(h1),
.ai-z-prose :deep(h2),
.ai-z-prose :deep(h3) {
  text-align: center;
  color: #1e293b;
  font-weight: 700;
  margin-top: 1.75rem;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}
.ai-z-prose :deep(h1) {
  font-size: 1.5rem;
}
.ai-z-prose :deep(h2) {
  font-size: 1.25rem;
  color: #4338ca;
}
.ai-z-prose :deep(h3) {
  font-size: 1.125rem;
}
.ai-z-prose :deep(p) {
  text-align: center;
  color: #475569;
  font-size: 1rem;
  line-height: 1.85;
  margin: 0.75rem auto;
  max-width: 42rem;
}
.ai-z-prose :deep(ul),
.ai-z-prose :deep(ol) {
  text-align: left;
  max-width: 36rem;
  margin: 1rem auto;
  padding-left: 1.5rem;
  color: #475569;
  line-height: 1.75;
}
.ai-z-prose :deep(li) {
  margin: 0.4rem 0;
}
.ai-z-prose :deep(strong) {
  color: #0f172a;
  font-weight: 600;
}
.ai-z-prose :deep(blockquote) {
  border-left: 4px solid #a5b4fc;
  background: #eef2ff;
  padding: 1rem 1.25rem;
  margin: 1.25rem auto;
  max-width: 36rem;
  border-radius: 0 1rem 1rem 0;
  text-align: center;
  color: #4338ca;
  font-style: normal;
}
.ai-z-prose :deep(hr) {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 2rem auto;
  max-width: 12rem;
}
</style>
