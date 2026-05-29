<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import {
  NOTE_COLOR_THEMES,
  themeById,
} from "@/shared/constants/noteColorThemes";
import { createNotePackage } from "@/shared/api/notePackageApi";
import type { NotePackageDraftItem } from "@/shared/types/notePackage";

const router = useRouter();

const packageTitle = ref("");
const packageDescription = ref("");
const draftNotes = ref<NotePackageDraftItem[]>([]);

const subject = ref("");
const content = ref("");
const selectedThemeId = ref(NOTE_COLOR_THEMES[0]!.id);

const saving = ref(false);
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const selectedTheme = computed(() => themeById(selectedThemeId.value));
const canSavePackage = computed(
  () => packageTitle.value.trim().length > 0 && draftNotes.value.length > 0,
);

function addDraftNote() {
  errorMessage.value = null;
  if (!subject.value.trim() || !content.value.trim()) {
    errorMessage.value =
      "Completa asunto y contenido antes de agregar la nota.";
    return;
  }
  const theme = selectedTheme.value;
  draftNotes.value.push({
    localId: crypto.randomUUID(),
    subject: subject.value.trim(),
    content: content.value.trim(),
    color: theme.background,
    colorName: theme.name,
  });
  subject.value = "";
  content.value = "";
}

function removeDraftNote(localId: string) {
  draftNotes.value = draftNotes.value.filter((n) => n.localId !== localId);
}

async function savePackageGlobally() {
  if (!canSavePackage.value) return;
  saving.value = true;
  errorMessage.value = null;
  successMessage.value = null;
  try {
    const result = await createNotePackage({
      title: packageTitle.value.trim(),
      description: packageDescription.value.trim() || null,
      notes: draftNotes.value.map((n) => ({
        subject: n.subject,
        content: n.content,
        color: n.color,
        color_name: n.colorName,
      })),
    });
    successMessage.value = "Paquete guardado correctamente.";
    const id = result.package?.id;
    if (id) {
      setTimeout(
        () => router.push({ name: "note-package-detail", params: { id } }),
        600,
      );
    }
  } catch (e) {
    errorMessage.value =
      e instanceof Error
        ? e.message
        : "No se pudo guardar el paquete de notas.";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8 bg-white/100 rounded-2xl">
    <!-- Z-1 -->
    <header class="mb-8">
      <p class="text-xs font-semibold uppercase tracking-wide text-violet-600">
        Notas
      </p>
      <h1 class="mt-1 text-2xl font-semibold text-slate-900">
        Crear paquete de notas
      </h1>
      <p class="mt-2 text-base font-medium leading-relaxed text-slate-600">
        Agrega notas individuales y guárdalas juntas como una sección o paquete.
      </p>
    </header>

    <div
      v-if="errorMessage"
      class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ errorMessage }}
    </div>
    <div
      v-if="successMessage"
      class="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
    >
      {{ successMessage }}
    </div>

    <section
      class="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 class="text-base font-medium leading-relaxed text-slate-900">
        Datos del paquete
      </h2>
      <label class="mt-4 block">
        <span class="mb-1 block text-base font-medium text-slate-700"
          >Título de la sección</span
        >
        <input
          v-model="packageTitle"
          type="text"
          maxlength="120"
          placeholder="Ej. Seguimiento semanal — paciente A"
          class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base font-medium focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </label>
      <label class="mt-4 block">
        <span class="mb-1 block text-base font-medium text-slate-700"
          >Descripción (opcional)</span
        >
        <textarea
          v-model="packageDescription"
          rows="2"
          placeholder="Contexto del paquete…"
          class="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-base font-medium focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </label>
    </section>

    <!-- Z-2: nueva nota -->
    <section
      class="mb-8 rounded-2xl border border-violet-100 bg-violet-50/40 p-6"
    >
      <h2 class="text-base font-medium leading-relaxed text-slate-900">
        Nueva nota individual
      </h2>
      <label class="mt-4 block">
        <span class="mb-1 block text-base font-medium text-slate-700"
          >Asunto</span
        >
        <input
          v-model="subject"
          type="text"
          maxlength="120"
          class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base font-medium"
        />
      </label>
      <label class="mt-4 block">
        <span class="mb-1 block text-base font-medium text-slate-700"
          >Contenido</span
        >
        <textarea
          v-model="content"
          rows="4"
          class="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base font-medium leading-relaxed"
          :style="{ backgroundColor: `${selectedTheme.background}59` }"
        />
      </label>
      <div class="mt-4 flex flex-wrap gap-2">
        <button
          v-for="theme in NOTE_COLOR_THEMES"
          :key="theme.id"
          type="button"
          class="rounded-xl border-2 px-3 py-1.5 text-xs font-semibold"
          :class="
            selectedThemeId === theme.id
              ? 'ring-2 ring-violet-400 ring-offset-1'
              : ''
          "
          :style="{
            backgroundColor: theme.background,
            color: theme.contentText,
            borderColor: theme.contentText,
          }"
          @click="selectedThemeId = theme.id"
        >
          {{ theme.name }}
        </button>
      </div>
      <button
        type="button"
        class="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
        @click="addDraftNote"
      >
        Agregar nota al paquete
      </button>
    </section>

    <!-- Z-3: borrador + guardar -->
    <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-base font-medium leading-relaxed text-slate-900">
          Notas en este paquete ({{ draftNotes.length }})
        </h2>
        <button
          type="button"
          class="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          :disabled="!canSavePackage || saving"
          @click="savePackageGlobally"
        >
          {{ saving ? "Guardando…" : "Guardar paquete globalmente" }}
        </button>
      </div>

      <p
        v-if="draftNotes.length === 0"
        class="mt-4 text-base font-medium leading-relaxed text-slate-500"
      >
        Aún no hay notas. Agrega al menos una antes de guardar.
      </p>

      <ul v-else class="mt-4 space-y-3">
        <li
          v-for="note in draftNotes"
          :key="note.localId"
          class="rounded-xl border p-4"
          :style="{
            backgroundColor: note.color,
            borderColor: `${note.color}99`,
          }"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-base font-medium leading-relaxed text-slate-900">
                {{ note.subject }}
              </p>
              <p
                class="mt-1 text-base font-medium leading-relaxed text-slate-700"
              >
                {{ note.content }}
              </p>
              <p class="mt-2 text-xs font-medium text-slate-600">
                {{ note.colorName }}
              </p>
            </div>
            <button
              type="button"
              class="shrink-0 text-xs font-semibold text-red-700 hover:underline"
              @click="removeDraftNote(note.localId)"
            >
              Quitar
            </button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
