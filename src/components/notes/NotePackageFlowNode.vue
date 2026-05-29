<template>
  <div
    class="pkg-note-node"
    :style="{
      backgroundColor: theme.background,
      borderColor: `${theme.createdText}30`,
    }"
  >
    <div class="pkg-note-node__subject" :style="{ color: theme.contentText }">
      {{ data.subject }}
    </div>
    <div class="pkg-note-node__content" :style="{ color: theme.contentText }">
      {{ truncatedContent }}
    </div>
    <div class="pkg-note-node__footer">
      <span class="pkg-note-node__meta" :style="{ color: theme.createdText }">
        {{ data.colorName }} · {{ formattedDate }}
      </span>
      <button
        type="button"
        class="pkg-note-node__view-btn"
        title="Ver nota completa"
        aria-label="Ver nota completa"
        :style="{
          color: theme.contentText,
          borderColor: `${theme.createdText}40`,
        }"
        @click.stop="emit('view')"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { themeByBackground } from "@/shared/constants/noteColorThemes";

defineOptions({ name: "NotePackageFlowNode" });

export interface NotePackageFlowNodeData {
  subject: string;
  content: string;
  colorName: string;
  createdAt: string;
  color?: string;
}

const props = defineProps<{ data: NotePackageFlowNodeData }>();

const emit = defineEmits<{ view: [] }>();

const theme = computed(() => {
  const fromColor = themeByBackground(props.data.color ?? "");
  if (fromColor) return fromColor;
  return themeByBackground("#FAD4C0")!;
});

const truncatedContent = computed(() => {
  const text = props.data.content ?? "";
  return text.length <= 120 ? text : `${text.slice(0, 117)}…`;
});

const formattedDate = computed(() =>
  new Date(props.data.createdAt).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
);
</script>

<style scoped>
.pkg-note-node {
  width: 240px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.1);
}

.pkg-note-node__subject {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1.35;
}

.pkg-note-node__content {
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 12px;
  opacity: 0.92;
}

.pkg-note-node__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.pkg-note-node__meta {
  font-size: 11px;
  font-weight: 600;
}

.pkg-note-node__view-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 6px;
  border: 1px solid;
  background: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  transition:
    background 0.15s ease,
    transform 0.15s ease;
}

.pkg-note-node__view-btn:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: scale(1.05);
}
</style>
