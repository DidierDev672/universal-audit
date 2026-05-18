<template>
  <div v-if="message" class="flex h-full flex-col">
    <header class="shrink-0 border-b border-slate-200 px-6 py-5">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0 flex-1">
          <h2 class="text-lg font-semibold text-slate-900">
            {{ message.subject }}
          </h2>
          <div class="mt-4 flex items-start gap-3">
            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold"
              :class="colorAvatar(message.color)"
            >
              {{ avatarLabel }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-slate-900">{{ message.from }}</p>
              <p class="mt-0.5 text-xs text-slate-500">
                Para: {{ message.to }} · {{ formatDate(message.date.toString()) }}
              </p>
            </div>
          </div>
        </div>
        <div class="flex shrink-0 items-center gap-1">
          <button
            v-for="action in actions"
            :key="action.id"
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100"
            :class="action.class"
            :title="action.title"
            @click="action.onClick"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="action.path"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto px-6 py-6">
      <p class="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
        {{ message.body }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Message } from "../../stores/inbox";
import { getInitials, useInbox } from "../../composables/useInbox";

const props = defineProps<{ message: Message }>();
const emit = defineEmits<{
  removed: [id: string];
  starred: [id: string];
}>();

const { colorAvatar, formatDate } = useInbox();

const avatarLabel = computed(() => {
  const raw = props.message.avatar?.trim() ?? "";
  if (raw && !raw.startsWith("http")) return raw.slice(0, 2).toUpperCase();
  return getInitials(props.message.from);
});

const actions = [
  {
    id: "archive",
    title: "Archivar",
    class: "hover:text-amber-600",
    path: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12",
    onClick: () => emit("starred", props.message.id),
  },
  {
    id: "delete",
    title: "Eliminar",
    class: "hover:text-red-600",
    path: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
    onClick: () => emit("removed", props.message.id),
  },
];
</script>
