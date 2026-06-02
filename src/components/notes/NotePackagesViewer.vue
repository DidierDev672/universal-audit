<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import NotePackageFolderCard, {
  type FolderNotePeek,
} from "@/components/notes/NotePackageFolderCard.vue";
import {
  deleteNotePackage,
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
const packageNotePeeks = ref<Record<string, FolderNotePeek[]>>({});
const indexingNotes = ref(false);
const deleteDialogOpen = ref(false);
const packagePendingDelete = ref<NotePackageRecord | null>(null);
const deletingPackage = ref(false);
const deleteErrorMessage = ref<string | null>(null);

async function loadPackageSearchIndex(items: NotePackageRecord[]) {
  if (items.length === 0) {
    packageNoteHaystack.value = {};
    packageNotePeeks.value = {};
    return;
  }

  indexingNotes.value = true;
  try {
    const details = await Promise.all(
      items.map((pkg) => getNotePackageById(pkg.id).catch(() => null)),
    );

    const haystack: Record<string, string> = {};
    const peeks: Record<string, FolderNotePeek[]> = {};

    for (const detail of details) {
      if (!detail) continue;
      haystack[detail.package.id] = detail.notes
        .map((note) => `${note.subject} ${note.content} ${note.colorName}`)
        .join(" ");
      peeks[detail.package.id] = detail.notes.slice(0, 5).map((note) => ({
        subject: note.subject,
        color: note.color,
      }));
    }

    packageNoteHaystack.value = haystack;
    packageNotePeeks.value = peeks;
  } finally {
    indexingNotes.value = false;
  }
}

async function loadPackages() {
  loading.value = true;
  errorMessage.value = null;
  searchQuery.value = "";
  packageNoteHaystack.value = {};
  packageNotePeeks.value = {};
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

const packageCountLabel = computed(() =>
  packages.value.length === 1 ? "Paquete" : "Paquetes",
);

const PACKAGES_COUNT_BADGE_CLASS =
  "inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-blue-50 via-sky-50/95 to-emerald-50 px-2.5 py-1 font-bold uppercase tracking-wide text-blue-900/90 ring-1 ring-blue-100/70 shadow-sm";

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

function requestDeletePackage(pkg: NotePackageRecord) {
  packagePendingDelete.value = pkg;
  deleteErrorMessage.value = null;
  deleteDialogOpen.value = true;
}

function cancelDeletePackage() {
  if (deletingPackage.value) return;
  deleteDialogOpen.value = false;
  packagePendingDelete.value = null;
  deleteErrorMessage.value = null;
}

async function confirmDeletePackage() {
  const pkg = packagePendingDelete.value;
  if (!pkg || deletingPackage.value) return;

  deletingPackage.value = true;
  deleteErrorMessage.value = null;
  errorMessage.value = null;

  try {
    await deleteNotePackage(pkg.id);
    packages.value = packages.value.filter((item) => item.id !== pkg.id);
    const nextHaystack = { ...packageNoteHaystack.value };
    delete nextHaystack[pkg.id];
    packageNoteHaystack.value = nextHaystack;
    const nextPeeks = { ...packageNotePeeks.value };
    delete nextPeeks[pkg.id];
    packageNotePeeks.value = nextPeeks;
    deleteDialogOpen.value = false;
    packagePendingDelete.value = null;
  } catch (e) {
    deleteErrorMessage.value =
      e instanceof Error
        ? e.message
        : "No se pudo eliminar el paquete de notas.";
  } finally {
    deletingPackage.value = false;
  }
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
        <p class="mt-2 text-base font-medium leading-relaxed text-slate-600">
          Cada tarjeta muestra una carpeta manila con las notas del paquete.
          Pasa el cursor sobre la carpeta para verlas asomarse.
        </p>
      </div>
      <router-link
        to="/note-packages/compose"
        class="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 ease-out hover:bg-violet-700 active:scale-[0.98]"
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
        <p
          class="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs font-medium text-slate-500"
        >
          <template v-if="indexingNotes">
            Indexando notas para búsqueda…
          </template>
          <template v-else-if="searchQuery.trim()">
            <span class="tabular-nums">{{ filteredPackages.length }}</span>
            {{ filteredPackages.length === 1 ? "resultado" : "resultados" }}
            de
            <span
              :class="PACKAGES_COUNT_BADGE_CLASS"
              class="text-[0.6875rem]"
              :aria-label="`${packages.length} ${packageCountLabel.toLowerCase()}`"
            >
              <span class="tabular-nums">{{ packages.length }}</span>
              <span>{{ packageCountLabel }}</span>
            </span>
          </template>
          <template v-else>
            <span
              :class="PACKAGES_COUNT_BADGE_CLASS"
              class="text-[0.6875rem]"
              :aria-label="`${packages.length} ${packageCountLabel.toLowerCase()}`"
            >
              <span class="tabular-nums">{{ packages.length }}</span>
              <span>{{ packageCountLabel }}</span>
            </span>
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

      <div
        v-else
        class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      >
        <NotePackageFolderCard
          v-for="(pkg, index) in filteredPackages"
          :key="pkg.id"
          :title="pkg.title"
          :description="pkg.description"
          :note-count="pkg.noteCount"
          :note-peeks="packageNotePeeks[pkg.id] ?? []"
          :index="index"
          @open="openPackage(pkg.id)"
          @delete="requestDeletePackage(pkg)"
        />
      </div>
    </template>

    <Teleport to="body">
      <div
        v-if="deleteDialogOpen && packagePendingDelete"
        class="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4"
        role="presentation"
        @click.self="cancelDeletePackage"
      >
        <div
          class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/80"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-package-dialog-title"
          aria-describedby="delete-package-dialog-desc"
          @keydown.escape="cancelDeletePackage"
        >
          <header
            class="border-b border-amber-200/80 bg-linear-to-r from-amber-50 via-white to-rose-50 px-6 py-4"
          >
            <div class="flex items-start gap-3">
              <span
                class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 ring-1 ring-amber-200/80"
                aria-hidden="true"
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </span>
              <div class="min-w-0">
                <h2
                  id="delete-package-dialog-title"
                  class="text-base font-semibold text-slate-900"
                >
                  Eliminar paquete de notas
                </h2>
                <p class="mt-1 text-sm font-medium text-slate-600">
                  «{{ packagePendingDelete.title }}»
                </p>
              </div>
            </div>
          </header>

          <div class="px-6 py-5">
            <p
              id="delete-package-dialog-desc"
              class="text-sm leading-relaxed text-slate-700"
            >
              Estas notas forman parte de una
              <strong class="font-semibold text-slate-900">investigación</strong>.
              Al eliminar este paquete se borrarán de forma permanente todas
              las notas y los análisis asociados.
            </p>
            <p class="mt-3 text-sm font-medium text-slate-800">
              ¿Está seguro de que desea eliminarlo?
            </p>
            <p
              v-if="deleteErrorMessage"
              class="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {{ deleteErrorMessage }}
            </p>
          </div>

          <footer
            class="flex flex-wrap justify-end gap-2 border-t border-slate-200 bg-slate-50/80 px-6 py-4"
          >
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200/80 transition-all duration-200 hover:bg-white hover:ring-slate-300/80 disabled:opacity-50"
              :disabled="deletingPackage"
              @click="cancelDeletePackage"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-rose-700 disabled:opacity-50"
              :disabled="deletingPackage"
              @click="confirmDeletePackage"
            >
              {{ deletingPackage ? "Eliminando…" : "Eliminar paquete" }}
            </button>
          </footer>
        </div>
      </div>
    </Teleport>
  </div>
</template>
