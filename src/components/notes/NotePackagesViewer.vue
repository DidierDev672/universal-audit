<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  getNotePackageById,
  getNotePackages,
} from "@/shared/api/notePackageApi";
import type { NotePackageRecord } from "@/shared/types/notePackage";

const router = useRouter();
const loading = ref(true);
const errorMessage = ref<string | null>(null);
const packages = ref<NotePackageRecord[]>([]);
const searchQuery = ref("");
const packageNoteHaystack = ref<Record<string, string>>({});
const indexingNotes = ref(false);

async function loadPackageSearchIndex(items: NotePackageRecord[]) {
  if (items.length === 0) {
    packageNoteHaystack.value = {};
    return;
  }

  indexingNotes.value = true;
  try {
    const details = await Promise.all(
      items.map((pkg) => getNotePackageById(pkg.id).catch(() => null)),
    );

    const haystack: Record<string, string> = {};
    for (const detail of details) {
      if (!detail) continue;
      haystack[detail.package.id] = detail.notes
        .map((note) => `${note.subject} ${note.content} ${note.colorName}`)
        .join(" ");
    }
    packageNoteHaystack.value = haystack;
  } finally {
    indexingNotes.value = false;
  }
}

async function loadPackages() {
  loading.value = true;
  errorMessage.value = null;
  searchQuery.value = "";
  packageNoteHaystack.value = {};
  try {
    const items = await getNotePackages();
    packages.value = items;
    void loadPackageSearchIndex(items);
  } catch (e) {
    errorMessage.value =
      e instanceof Error ? e.message : "No se pudieron cargar los paquetes.";
  } finally {
    loading.value = false;
  }
}

const filteredPackages = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return packages.value;

  return packages.value.filter((pkg) => {
    const searchable = [
      pkg.title,
      pkg.description ?? "",
      String(pkg.noteCount),
      formatDate(pkg.createdAt),
      packageNoteHaystack.value[pkg.id] ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(query);
  });
});

function openPackage(id: string) {
  router.push({ name: "note-package-detail", params: { id } });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function clearSearch() {
  searchQuery.value = "";
}

onMounted(loadPackages);
</script>

<template>
  <div class="mx-auto max-w-8xl px-4 py-8 bg-white/100 rounded-2xl">
    <header class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <p
          class="text-xs font-semibold uppercase tracking-wide text-emerald-600"
        >
          Secciones
        </p>
        <h1 class="mt-1 text-2xl font-semibold text-slate-900">
          Paquetes de notas
        </h1>
        <p class="mt-2 text-base font-medium leading-relaxed text-slate-600">
          Cada tarjeta es una sección guardada con sus notas individuales.
        </p>
      </div>
      <router-link
        to="/note-packages/compose"
        class="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
      >
        Crear nuevo paquete
      </router-link>
    </header>

    <div v-if="loading" class="flex justify-center py-16">
      <div
        class="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"
      />
    </div>

    <div
      v-else-if="errorMessage"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ errorMessage }}
      <button
        type="button"
        class="ml-2 font-semibold underline"
        @click="loadPackages"
      >
        Reintentar
      </button>
    </div>

    <div
      v-else-if="packages.length === 0"
      class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center"
    >
      <p class="text-base font-medium leading-relaxed text-slate-600">
        No hay paquetes guardados todavía.
      </p>
      <router-link
        to="/note-packages/compose"
        class="mt-4 inline-block text-sm font-semibold text-violet-600 hover:underline"
      >
        Crear el primer paquete
      </router-link>
    </div>

    <template v-else>
      <div class="mb-6">
        <label class="sr-only" for="note-packages-search">
          Buscar paquetes y notas
        </label>
        <div class="relative">
          <svg
            class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            id="note-packages-search"
            v-model="searchQuery"
            type="search"
            placeholder="Buscar por título, descripción o contenido de notas…"
            class="h-12 w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-11 text-sm text-slate-900 outline-none transition-shadow placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Limpiar búsqueda"
            @click="clearSearch"
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
        <p class="mt-2 text-xs font-medium text-slate-500">
          <template v-if="indexingNotes">
            Indexando notas para búsqueda…
          </template>
          <template v-else-if="searchQuery.trim()">
            {{ filteredPackages.length }}
            {{ filteredPackages.length === 1 ? "resultado" : "resultados" }}
            de {{ packages.length }}
          </template>
          <template v-else>
            {{ packages.length }}
            {{ packages.length === 1 ? "paquete" : "paquetes" }}
          </template>
        </p>
      </div>

      <div
        v-if="filteredPackages.length === 0"
        class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center"
      >
        <p class="text-base font-medium leading-relaxed text-slate-600">
          No se encontraron paquetes para «{{ searchQuery.trim() }}».
        </p>
        <button
          type="button"
          class="mt-4 text-sm font-semibold text-violet-600 hover:underline"
          @click="clearSearch"
        >
          Limpiar búsqueda
        </button>
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <button
          v-for="pkg in filteredPackages"
          :key="pkg.id"
          type="button"
          class="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-violet-300 hover:shadow-md"
          @click="openPackage(pkg.id)"
        >
          <div class="flex items-start justify-between gap-2">
            <h2
              class="text-base font-medium leading-relaxed text-slate-900 line-clamp-2"
            >
              {{ pkg.title }}
            </h2>
            <span
              class="shrink-0 rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700"
            >
              {{ pkg.noteCount }} {{ pkg.noteCount === 1 ? "nota" : "notas" }}
            </span>
          </div>
          <p
            v-if="pkg.description"
            class="mt-2 text-sm font-medium leading-relaxed text-slate-500 line-clamp-2"
          >
            {{ pkg.description }}
          </p>
          <p class="mt-3 text-xs font-medium text-slate-400">
            {{ formatDate(pkg.createdAt) }}
          </p>
        </button>
      </div>
    </template>
  </div>
</template>
