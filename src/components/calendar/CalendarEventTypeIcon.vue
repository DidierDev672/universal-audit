<template>
  <svg
    :class="sizeClass"
    class="shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- Investigación — libro (SF Symbol book.closed) -->
    <template v-if="type === 'research'">
      <path
        :stroke="strokeColor"
        stroke-width="1.65"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M5.5 7.2A2.2 2.2 0 0 1 7.4 5h2.1v13.8c-1.4-.7-3.1-1-4.5-.6V7.2Z"
      />
      <path
        :stroke="strokeColor"
        stroke-width="1.65"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M18.5 7.2A2.2 2.2 0 0 0 16.6 5h-2.1v13.8c1.4-.7 3.1-1 4.5-.6V7.2Z"
      />
      <path
        :stroke="strokeColor"
        stroke-width="1.65"
        stroke-linecap="round"
        d="M9.5 5v13.5M14.5 5v13.5"
      />
    </template>

    <!-- Tarea — marca en círculo (SF Symbol checkmark.circle / Reminders) -->
    <template v-else>
      <circle
        :stroke="strokeColor"
        stroke-width="1.65"
        cx="12"
        cy="12"
        r="8"
      />
      <path
        :stroke="strokeColor"
        stroke-width="1.65"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M8.5 12.2 10.6 14.3 15.5 9.2"
      />
    </template>
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { CalendarEventType } from "../../shared/types/calendarAiAnalysis";

const props = withDefaults(
  defineProps<{
    type: CalendarEventType;
    size?: "xs" | "sm" | "md";
    color?: string;
  }>(),
  {
    size: "sm",
  },
);

const sizeClass = computed(() => {
  switch (props.size) {
    case "xs":
      return "h-3.5 w-3.5";
    case "md":
      return "h-5 w-5";
    default:
      return "h-4 w-4";
  }
});

const strokeColor = computed(() => props.color ?? "currentColor");
</script>
