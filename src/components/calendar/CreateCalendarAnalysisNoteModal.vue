<template>
  <Teleport to="body">
    <Transition name="app-modal">
      <div v-if="isOpen" class="app-modal-root" style="z-index: 90">
        <div class="app-modal-backdrop" aria-hidden="true" @click="close" />
        <div class="app-modal-scrim app-modal-scrim--sheet" @click.self="close">
          <div
            class="app-modal-panel app-modal-panel--sheet relative max-h-[92vh] w-[min(520px,94vw)] overflow-hidden rounded-2xl bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-note-title"
            @click.stop
          >
            <header
              class="border-b border-slate-200 bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4"
            >
              <h2 id="create-note-title" class="text-lg font-bold text-white">
                Nueva nota
              </h2>
              <p class="mt-1 truncate text-xs text-violet-100">{{ eventTitle }}</p>
            </header>

            <form class="max-h-[calc(92vh-8rem)] overflow-y-auto p-5" @submit.prevent="save">
              <label class="mb-4 block">
                <span class="mb-1.5 block text-sm font-semibold text-slate-700">
                  Asunto de la nota
                </span>
                <input
                  v-model="subject"
                  type="text"
                  required
                  maxlength="120"
                  placeholder="Ej. Seguimiento clínico"
                  class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                />
              </label>

              <label class="mb-4 block">
                <span class="mb-1.5 block text-sm font-semibold text-slate-700">
                  Contenido de la nota
                </span>
                <textarea
                  v-model="content"
                  required
                  rows="5"
                  placeholder="Escribe el contenido…"
                  class="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm shadow-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                  :style="{
                    color: selectedTheme.contentText,
                    backgroundColor: `${selectedTheme.background}59`,
                  }"
                />
              </label>

              <label class="mb-4 block">
                <span class="mb-1.5 block text-sm font-semibold text-slate-700">
                  Creada el
                </span>
                <input
                  v-model="createdAtLocal"
                  type="datetime-local"
                  required
                  class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
                />
              </label>

              <fieldset class="mb-4">
                <legend class="mb-2 text-sm font-semibold text-slate-700">
                  Color de la nota
                </legend>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="theme in NOTE_COLOR_THEMES"
                    :key="theme.id"
                    type="button"
                    :class="[
                      'inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-xs font-semibold transition-all',
                      selectedTheme.id === theme.id
                        ? 'ring-2 ring-violet-400 ring-offset-1'
                        : 'opacity-90 hover:opacity-100',
                    ]"
                    :style="{
                      backgroundColor: theme.background,
                      color: theme.contentText,
                      borderColor:
                        selectedTheme.id === theme.id
                          ? theme.contentText
                          : `${theme.createdText}40`,
                    }"
                    @click="selectedTheme = theme"
                  >
                    <span
                      v-if="selectedTheme.id === theme.id"
                      class="inline-block h-1.5 w-1.5 rounded-full"
                      :style="{ backgroundColor: theme.contentText }"
                    />
                    {{ theme.name }}
                  </button>
                </div>
              </fieldset>

              <div class="mb-5">
                <p class="mb-2 text-xs font-medium text-slate-500">Vista previa</p>
                <div
                  class="rounded-xl border p-4 shadow-sm"
                  :style="{
                    backgroundColor: selectedTheme.background,
                    borderColor: `${selectedTheme.createdText}30`,
                  }"
                >
                  <p
                    class="mb-2 text-xs font-bold uppercase tracking-wide"
                    :style="{ color: selectedTheme.createdText }"
                  >
                    {{ subject.trim() || "Asunto" }}
                  </p>
                  <p
                    class="text-sm leading-relaxed"
                    :style="{ color: selectedTheme.contentText }"
                  >
                    {{ content.trim() || "Contenido de la nota…" }}
                  </p>
                  <p
                    class="mt-3 text-xs font-semibold"
                    :style="{ color: selectedTheme.createdText }"
                  >
                    {{ previewDateLabel }}
                  </p>
                </div>
              </div>

              <p v-if="saveError" class="mb-3 text-sm text-red-600">{{ saveError }}</p>

              <div class="flex gap-2">
                <button
                  type="button"
                  class="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  @click="close"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="flex-1 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                >
                  {{ saving ? "Guardando…" : "Guardar nota" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { createCalendarAnalysisNote } from "../../shared/api/calendarAnalysisNoteApi";
import {
  NOTE_COLOR_THEMES,
  type NoteColorTheme,
} from "../../shared/constants/noteColorThemes";

const props = defineProps<{
  isOpen: boolean;
  calendarAiAnalysisId: string;
  eventTitle: string;
}>();

const emit = defineEmits<{
  close: [];
  created: [];
}>();

const subject = ref("");
const content = ref("");
const createdAtLocal = ref(toLocalInputValue(new Date()));
const selectedTheme = ref<NoteColorTheme>(NOTE_COLOR_THEMES[0]!);
const saving = ref(false);
const saveError = ref<string | null>(null);

const previewDateLabel = computed(() => {
  const d = new Date(createdAtLocal.value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function resetForm(): void {
  subject.value = "";
  content.value = "";
  createdAtLocal.value = toLocalInputValue(new Date());
  selectedTheme.value = NOTE_COLOR_THEMES[0]!;
  saveError.value = null;
}

function close(): void {
  emit("close");
}

async function save(): Promise<void> {
  const trimmedSubject = subject.value.trim();
  const trimmedContent = content.value.trim();

  if (!trimmedSubject) {
    saveError.value = "El asunto es requerido.";
    return;
  }
  if (!trimmedContent) {
    saveError.value = "El contenido es requerido.";
    return;
  }

  const createdDate = new Date(createdAtLocal.value);
  if (Number.isNaN(createdDate.getTime())) {
    saveError.value = "La fecha no es válida.";
    return;
  }

  saving.value = true;
  saveError.value = null;

  try {
    await createCalendarAnalysisNote({
      calendar_ai_analysis_id: props.calendarAiAnalysisId,
      content: trimmedContent,
      color: selectedTheme.value.background,
      color_name: trimmedSubject,
      created_at: createdDate.toISOString(),
    });
    emit("created");
    resetForm();
    close();
  } catch (err) {
    console.error("[CreateCalendarAnalysisNoteModal]", err);
    saveError.value = "No se pudo guardar la nota.";
  } finally {
    saving.value = false;
  }
}

watch(
  () => props.isOpen,
  (open) => {
    if (open) resetForm();
  },
);
</script>
