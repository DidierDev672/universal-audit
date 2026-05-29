<template>
  <Teleport to="body">
    <Transition name="app-modal">
      <div v-if="isOpen && note" class="app-modal-root" style="z-index: 95">
        <div class="app-modal-backdrop" aria-hidden="true" @click="close" />
        <div class="app-modal-scrim app-modal-scrim--sheet" @click.self="close">
          <div
            class="app-modal-panel app-modal-panel--sheet relative max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="note-detail-title"
            @click.stop
          >
            <header
              class="flex items-start justify-between gap-4 border-b px-6 py-4"
              :style="{
                backgroundColor: theme.background,
                borderColor: `${theme.createdText}30`,
              }"
            >
              <div class="min-w-0">
                <p
                  class="text-xs font-semibold uppercase tracking-wide"
                  :style="{ color: theme.createdText }"
                >
                  Nota completa
                </p>
                <h2
                  id="note-detail-title"
                  class="mt-1 text-lg font-bold leading-snug"
                  :style="{ color: theme.contentText }"
                >
                  {{ note.title }}
                </h2>
              </div>
              <button
                type="button"
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-black/5"
                :style="{ color: theme.contentText }"
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
            </header>

            <div class="max-h-[50vh] overflow-y-auto p-6">
              <p
                class="whitespace-pre-wrap text-sm leading-relaxed"
                :style="{ color: theme.contentText }"
              >
                {{ note.content }}
              </p>
            </div>

            <footer
              class="flex items-center justify-between border-t px-6 py-4"
              :style="{
                backgroundColor: `${theme.background}80`,
                borderColor: `${theme.createdText}25`,
              }"
            >
              <time
                class="text-sm font-medium"
                :style="{ color: theme.createdText }"
                :datetime="note.createdAt"
              >
                {{ formattedDate }}
              </time>
              <button
                type="button"
                class="rounded-xl px-4 py-2 text-sm font-medium text-white"
                :style="{ backgroundColor: theme.contentText }"
                @click="close"
              >
                Cerrar
              </button>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { themeByBackground } from "../../shared/constants/noteColorThemes";

export interface CalendarNoteDetailData {
  title: string;
  content: string;
  createdAt: string;
  color?: string;
}

const props = defineProps<{
  isOpen: boolean;
  note: CalendarNoteDetailData | null;
}>();

const emit = defineEmits<{ close: [] }>();

const theme = computed(() => {
  const fromColor = themeByBackground(props.note?.color ?? "");
  return fromColor ?? themeByBackground("#FAD4C0")!;
});

const formattedDate = computed(() => {
  if (!props.note?.createdAt) return "";
  const d = new Date(props.note.createdAt);
  if (Number.isNaN(d.getTime())) return props.note.createdAt;
  return d.toLocaleString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

function close(): void {
  emit("close");
}
</script>
