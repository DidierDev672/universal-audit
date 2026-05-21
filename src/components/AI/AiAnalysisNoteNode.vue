<template>
  <div
    class="ai-analysis-note-node w-[240px] rounded-lg border p-3 shadow-sm"
    :class="[data.bgClass, data.borderClass]"
  >
    <div class="flex items-center justify-between gap-2 mb-2">
      <span
        class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/70"
        :class="data.textClass"
      >
        {{ data.colorName }}
      </span>
      <span class="text-[10px] text-[#86868b] shrink-0">{{ fecha }}</span>
    </div>
    <p class="text-[12px] font-medium leading-snug line-clamp-3" :class="data.textClass">
      {{ data.content }}
    </p>
    <p
      v-if="data.context?.trim()"
      class="text-[11px] text-[#52525b] mt-2 line-clamp-2 italic border-t border-black/10 pt-2"
    >
      {{ data.context }}
    </p>
    <div class="flex items-center justify-end gap-1 mt-2">
      <button
        type="button"
        class="p-1 rounded-md border border-black/10 bg-white/80 hover:border-[#0d9e6e] hover:text-[#0d9e6e] transition-colors"
        title="Editar contexto"
        @click.stop="$emit('editContext')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
      <button
        type="button"
        class="p-1 rounded-md border border-black/10 bg-white/80 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
        title="Ver nota completa"
        @click.stop="$emit('expand')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
import type { AiAnalysisNote } from "@/types/aiAnalysisNote";

defineOptions({ name: "AiAnalysisNoteNode" });

const props = defineProps<{
  data: AiAnalysisNote;
}>();

defineEmits<{
  expand: [];
  editContext: [];
}>();

const fecha = computed(() => {
  const d = new Date(props.data.updatedAt || props.data.createdAt);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
});
</script>
