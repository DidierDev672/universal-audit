<template>
  <div
    class="flex flex-col bg-slate-50 overflow-hidden"
    :class="embedded ? 'h-full' : 'h-screen'"
  >
    <!-- Barra superior: búsqueda + acciones -->
    <header
      class="shrink-0 border-b border-slate-200 bg-white px-4 py-3 sm:px-5"
    >
      <div class="flex items-center gap-3">
        <div class="relative min-w-0 flex-1">
          <svg
            class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Buscar conversaciones, usuarios o mensajes"
            class="h-12 w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition-shadow placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          />
        </div>

        <span
          v-if="notReading.length > 0"
          class="inline-flex h-[22px] min-w-[22px] shrink-0 items-center justify-center rounded-full bg-red-100 px-2 text-xs font-medium text-red-600"
        >
          {{ notReading.length }}
        </span>

        <button
          v-if="notReading.length > 0"
          type="button"
          title="Marcar todo como leído"
          class="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 sm:flex"
          @click="markAllAsRead"
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>

        <button
          type="button"
          title="Nuevo mensaje"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm transition hover:bg-violet-700"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>

        <button
          v-if="embedded"
          type="button"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100"
          aria-label="Cerrar bandeja"
          @click="emit('close')"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </header>

    <div class="flex min-h-0 flex-1 overflow-hidden">
      <!-- Sidebar carpetas -->
      <aside
        class="flex w-20 shrink-0 flex-col border-r border-slate-200 bg-slate-50 py-3"
      >
        <button
          type="button"
          class="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm transition hover:bg-violet-700"
          title="Redactar"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>

        <nav class="flex flex-1 flex-col items-center gap-1 px-2">
          <button
            v-for="item in navItems"
            :key="item.folder"
            type="button"
            :title="item.label"
            class="flex w-full flex-col items-center gap-1 rounded-xl px-1 py-2.5 text-[10px] font-medium transition-all duration-200"
            :class="
              folderActive === item.folder
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            "
            @click="setActiveFolder(item.folder)"
          >
            <svg
              class="h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="item.icon"
              />
            </svg>
            <span class="truncate w-full text-center leading-tight">{{
              item.short
            }}</span>
          </button>
        </nav>
      </aside>

      <!-- Lista + detalle -->
      <div class="relative flex min-w-0 flex-1 overflow-hidden">
        <!-- Columna conversaciones -->
        <section
          class="flex w-full max-w-md flex-col border-r border-slate-200 bg-white sm:w-96"
          :class="selected && 'hidden sm:flex'"
        >
          <!-- Tabs -->
          <div
            v-if="folderActive === 'inbox'"
            class="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-slate-100 px-3"
          >
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              class="shrink-0 border-b-2 px-3 py-3 text-sm transition-colors duration-200"
              :class="
                activeListTab === tab.id
                  ? 'border-violet-600 font-medium text-violet-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              "
              @click="setListTab(tab.id)"
            >
              {{ tab.label }}
              <span
                v-if="tab.id === 'unread' && notReading.length > 0"
                class="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-100 px-1 text-[10px] font-medium text-red-600"
              >
                {{ notReading.length }}
              </span>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto">
            <!-- Skeleton -->
            <div v-if="loading" class="space-y-0 p-2">
              <div
                v-for="i in 4"
                :key="i"
                class="flex animate-pulse items-start gap-3 border-b border-slate-100 px-4 py-4"
              >
                <div class="h-11 w-11 shrink-0 rounded-2xl bg-slate-200" />
                <div class="min-w-0 flex-1 space-y-2 pt-1">
                  <div class="h-3 w-2/3 rounded bg-slate-200" />
                  <div class="h-2.5 w-full rounded bg-slate-100" />
                  <div class="h-2.5 w-4/5 rounded bg-slate-100" />
                </div>
              </div>
            </div>

            <div
              v-else-if="displayMessages.length === 0"
              class="flex flex-col items-center justify-center px-6 py-16 text-center"
            >
              <div
                class="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"
              >
                <svg
                  class="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p class="text-sm font-medium text-slate-600">
                Sin conversaciones
              </p>
              <p class="mt-1 text-xs text-slate-400">
                No hay mensajes en esta vista
              </p>
            </div>

            <template v-else>
              <MessageRow
                v-for="message in displayMessages"
                :key="message.id"
                :message="message"
                :active="selectedId === message.id"
                @selected="selectMessage"
                @starred="toggleFeatured"
                @unstarred="toggleFeatured"
                @removed="remove"
              />
            </template>
          </div>
        </section>

        <!-- Panel detalle -->
        <section class="hidden min-w-0 flex-1 flex-col bg-white sm:flex">
          <MessageDetail
            v-if="selected"
            :message="selected"
            @starred="toggleFeatured"
            @removed="remove"
          />
          <div
            v-else
            class="flex h-full flex-col items-center justify-center px-8 text-center text-slate-400"
          >
            <div
              class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50"
            >
              <svg
                class="h-8 w-8 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p class="text-sm font-medium text-slate-500">
              Selecciona una conversación para comenzar
            </p>
            <p class="mt-1 max-w-xs text-xs text-slate-400">
              Elige un mensaje de la lista para leerlo y responder
            </p>
          </div>
        </section>

        <!-- Detalle móvil (pantalla completa al seleccionar) -->
        <section
          v-if="selected"
          class="absolute inset-0 z-10 flex flex-col bg-white sm:hidden"
        >
          <div
            class="flex shrink-0 items-center gap-2 border-b border-slate-200 px-3 py-2"
          >
            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
              @click="selectedId = null"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span class="truncate text-sm font-medium text-slate-800">{{
              selected.from
            }}</span>
          </div>
          <MessageDetail
            class="min-h-0 flex-1"
            :message="selected"
            @starred="toggleFeatured"
            @removed="onRemoveMobile"
          />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useInbox } from "../../composables/useInbox";
import MessageRow from "./MessageRow.vue";
import MessageDetail from "./MessageDetail.vue";
import type { categories, folder } from "../../stores/inbox";

type ListTab = "all" | "unread" | categories;

const { embedded = false } = defineProps<{ embedded?: boolean }>();
const emit = defineEmits<{ close: [] }>();

const {
  messages,
  selectedId,
  folderActive,
  categoryActive,
  searchQuery,
  loading,
  selected,
  notReading,
  loadMessages,
  selectMessage,
  toggleFeatured,
  remove,
  markAllAsRead,
} = useInbox();

const activeListTab = ref<ListTab>("all");

const navItems: {
  folder: folder;
  label: string;
  short: string;
  icon: string;
}[] = [
  {
    folder: "inbox",
    label: "Bandeja de entrada",
    short: "Inbox",
    icon: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4",
  },
  {
    folder: "sent",
    label: "Enviados",
    short: "Enviados",
    icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
  },
  {
    folder: "drafts",
    label: "Borradores",
    short: "Borrador",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    folder: "trash",
    label: "Papelera",
    short: "Papelera",
    icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  },
  {
    folder: "spam",
    label: "Spam",
    short: "Spam",
    icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
  },
];

const tabs: { id: ListTab; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "unread", label: "No leídos" },
  { id: "urgent", label: "Urgentes" },
  { id: "appointment", label: "Citas" },
];

const displayMessages = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  let list = messages.value.filter((m) => {
    if (m.folder !== folderActive.value) return false;
    if (
      q &&
      !m.from.toLowerCase().includes(q) &&
      !m.subject.toLowerCase().includes(q) &&
      !m.preview.toLowerCase().includes(q)
    ) {
      return false;
    }
    return true;
  });

  if (folderActive.value === "inbox") {
    if (activeListTab.value === "unread") {
      list = list.filter((m) => !m.reading);
    } else if (activeListTab.value !== "all") {
      list = list.filter((m) => m.category === activeListTab.value);
    }
  }

  return list;
});

const setActiveFolder = (f: folder) => {
  folderActive.value = f;
  activeListTab.value = "all";
  categoryActive.value = "main";
  selectedId.value = null;
};

const setListTab = (tab: ListTab) => {
  activeListTab.value = tab;
  if (tab !== "all" && tab !== "unread") {
    categoryActive.value = tab;
  }
};

const onRemoveMobile = (id: string) => {
  remove(id);
  selectedId.value = null;
};

onMounted(() => loadMessages());
</script>
