<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { onClickOutside } from "@vueuse/core";
import { useNotificationsStore } from "../../stores/notifications";

const store = useNotificationsStore();
const { notifications } = storeToRefs(store);

const unreadCount = computed(() => store.unreadNotifications.length);

const open = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);
onClickOutside(wrapperRef, () => (open.value = false));

function formatDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("es", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
</script>

<template>
  <div ref="wrapperRef" class="relative">
    <button
      type="button"
      class="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
      aria-label="Notificaciones"
      @click="open = !open"
    >
      <svg
        class="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      <span
        v-if="unreadCount > 0"
        class="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white"
      >
        {{ unreadCount > 9 ? "9+" : unreadCount }}
      </span>
    </button>

    <div
      v-if="open"
      class="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
    >
      <div
        class="flex items-center justify-between border-b border-gray-100 px-4 py-3"
      >
        <h3 class="text-sm font-semibold text-gray-800">Notificaciones</h3>
        <div class="flex gap-1">
          <button
            v-if="unreadCount > 0"
            type="button"
            class="rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50"
            @click="store.allReadingMark()"
          >
            Marcar todas
          </button>
          <button
            v-if="notifications.length > 0"
            type="button"
            class="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
            @click="store.clearAll()"
          >
            Limpiar
          </button>
        </div>
      </div>

      <ul class="max-h-80 overflow-y-auto">
        <li
          v-if="notifications.length === 0"
          class="px-4 py-8 text-center text-sm text-gray-400"
        >
          No hay notificaciones
        </li>
        <li
          v-for="item in notifications"
          :key="item.id"
          class="border-b border-gray-50 last:border-0"
          :class="!item.reading ? 'bg-blue-50/40' : ''"
        >
          <div class="flex gap-3 px-4 py-3">
            <div
              class="mt-0.5 h-2 w-2 shrink-0 rounded-full"
              :class="{
                'bg-green-500': item.type === 'success',
                'bg-red-500': item.type === 'error',
                'bg-blue-500': item.type === 'info',
                'bg-amber-500': item.type === 'warning',
              }"
            />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-gray-800">
                {{ item.title }}
              </p>
              <p class="mt-0.5 text-xs text-gray-600">{{ item.message }}</p>
              <p class="mt-1 text-[10px] text-gray-400">
                {{ formatDate(item.date) }}
              </p>
            </div>
            <div class="flex shrink-0 flex-col gap-1">
              <button
                v-if="!item.reading"
                type="button"
                class="rounded p-1 text-gray-400 hover:bg-white hover:text-blue-600"
                title="Marcar como leída"
                @click="store.readingMark(item.id)"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
              <button
                type="button"
                class="rounded p-1 text-gray-400 hover:bg-white hover:text-red-500"
                title="Eliminar"
                @click="store.remove(item.id)"
              >
                <svg
                  class="h-4 w-4"
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
        </li>
      </ul>
    </div>
  </div>
</template>
