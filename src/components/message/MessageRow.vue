<template>
  <div
    role="button"
    tabindex="0"
    class="group flex cursor-pointer items-start gap-3 border-b border-slate-100 px-4 py-4 transition-colors duration-200 ease-out hover:bg-slate-50"
    :class="rowClass"
    @click="$emit('selected', message.id)"
    @keydown.enter="$emit('selected', message.id)"
  >
    <div
      class="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold"
      :class="[colorAvatar(message.color), active && 'ring-2 ring-violet-500 ring-offset-1']"
    >
      {{ avatarLabel }}
      <span
        v-if="!message.reading"
        class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-violet-600"
      />
    </div>

    <div class="min-w-0 flex-1">
      <div class="mb-0.5 flex items-baseline justify-between gap-2">
        <span
          class="truncate text-sm"
          :class="message.reading ? 'font-medium text-slate-700' : 'font-semibold text-slate-900'"
        >
          {{ message.from }}
        </span>
        <span class="shrink-0 text-xs text-slate-400">
          {{ formatDate(message.date.toString()) }}
        </span>
      </div>
      <p
        class="truncate text-sm"
        :class="message.reading ? 'text-slate-500' : 'font-medium text-slate-800'"
      >
        {{ message.subject }}
      </p>
      <p class="mt-0.5 truncate text-sm text-slate-500">
        {{ message.preview }}
      </p>
    </div>

    <div class="flex shrink-0 flex-col items-center gap-1 pt-1">
      <button
        v-if="message.featured"
        type="button"
        class="text-amber-400 transition hover:text-amber-500"
        title="Quitar destacado"
        @click.stop="$emit('unstarred', message.id)"
      >
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </button>
      <div class="hidden items-center gap-0.5 group-hover:flex">
        <button
          type="button"
          class="rounded-lg p-1 text-slate-400 transition hover:bg-white hover:text-amber-500"
          title="Destacar"
          @click.stop="$emit('starred', message.id)"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
        <button
          type="button"
          class="rounded-lg p-1 text-slate-400 transition hover:bg-white hover:text-red-500"
          title="Eliminar"
          @click.stop="$emit('removed', message.id)"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Message } from "../../stores/inbox";
import { getInitials, useInbox } from "../../composables/useInbox";

const props = defineProps<{ message: Message; active?: boolean }>();
defineEmits<{
  selected: [id: string];
  starred: [id: string];
  unstarred: [id: string];
  removed: [id: string];
}>();

const { colorAvatar, formatDate } = useInbox();

const avatarLabel = computed(() => {
  const raw = props.message.avatar?.trim() ?? "";
  if (raw && !raw.startsWith("http")) return raw.slice(0, 2).toUpperCase();
  return getInitials(props.message.from);
});

const rowClass = computed(() =>
  props.active
    ? "bg-violet-50 border-r-2 border-r-violet-600"
    : !props.message.reading
      ? "bg-white"
      : "bg-white",
);
</script>
