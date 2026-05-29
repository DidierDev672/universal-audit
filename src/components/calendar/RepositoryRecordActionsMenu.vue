<template>
  <div ref="rootRef" class="relative w-full">
    <button
      type="button"
      class="flex w-full items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors"
      :class="menuButtonClass"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click.stop="open = !open"
    >
      <slot name="icon">
        <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      </slot>
      <span class="truncate">{{ label }}</span>
      <svg
        class="h-4 w-4 shrink-0 opacity-70 transition-transform"
        :class="{ 'rotate-180': open }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition name="menu-fade">
      <div
        v-if="open"
        class="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        role="menu"
      >
        <button
          v-for="item in items"
          :key="item.id"
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          :class="item.destructive ? 'text-red-700 hover:bg-red-50' : 'text-slate-700'"
          :disabled="item.disabled"
          @click="onSelect(item)"
        >
          <span class="min-w-0 flex-1">
            <span class="block font-medium">{{ item.label }}</span>
            <span v-if="item.hint" class="block text-xs text-slate-500">{{ item.hint }}</span>
          </span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

export interface RepositoryMenuItem {
  id: string;
  label: string;
  hint?: string;
  disabled?: boolean;
  destructive?: boolean;
}

defineProps<{
  label: string;
  items: RepositoryMenuItem[];
  menuButtonClass?: string;
}>();

const emit = defineEmits<{
  select: [item: RepositoryMenuItem];
}>();

const open = ref(false);
const rootRef = ref<HTMLElement | null>(null);

function onSelect(item: RepositoryMenuItem): void {
  if (item.disabled) return;
  open.value = false;
  emit("select", item);
}

function onDocumentClick(event: MouseEvent): void {
  if (!rootRef.value?.contains(event.target as Node)) {
    open.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", onDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener("click", onDocumentClick);
});
</script>

<style scoped>
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
