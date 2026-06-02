<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 rounded-3xl p-8 text-white shadow-2xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
            </svg>
          </div>
          <div>
            <h2 class="text-3xl font-bold mb-1">Cuestionarios de Tinnitus 🔔</h2>
            <p class="text-white/90">Evaluaciones personalizadas para síntomas auditivos</p>
          </div>
        </div>
        <button
          @click="showBuilder = !showBuilder"
          class="hidden md:flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          {{ showBuilder ? 'Ver Lista' : 'Crear Cuestionario' }}
        </button>
      </div>
    </div>

    <!-- Mobile Toggle -->
    <button
      @click="showBuilder = !showBuilder"
      class="md:hidden w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold shadow-lg"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
      </svg>
      {{ showBuilder ? 'Ver Lista' : 'Crear Cuestionario' }}
    </button>

    <!-- Content Toggle -->
    <transition name="fade" mode="out-in">
      <!-- Questionnaire Builder -->
      <div v-if="showBuilder" key="builder">
        <TinnitusQuestionnaireBuilder @questionnaire-saved="handleQuestionnaireSaved" />
      </div>

      <!-- Questionnaire List -->
      <div v-else key="list" class="space-y-6">
        <!-- Search -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar cuestionarios..."
              class="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>

        <!-- Questionnaire Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="questionnaire in filteredQuestionnaires"
            :key="questionnaire.id"
            class="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all group flex flex-col"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-start gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                    {{ questionnaire.title }}
                  </h3>
                  <p class="text-xs text-gray-500 mt-1">{{ questionnaire?.questions?.length || 0 }} preguntas</p>
                </div>
              </div>
            </div>

            <p class="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
              {{ questionnaire.description }}
            </p>

            <div class="pt-4 border-t border-gray-100 space-y-2">
              <RouterLink
                :to="`/detail-tinnitus-questionnaire/${questionnaire.id}`"
                class="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
              >
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                Ver detalles
              </RouterLink>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white rounded-xl shadow-sm ring-1 ring-slate-200/80 hover:bg-slate-50 hover:ring-slate-300/80 hover:shadow-md transition-all"
                  @click="openEdit(questionnaire)"
                >
                  <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Editar
                </button>
                <button
                  type="button"
                  class="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-rose-700 bg-white rounded-xl shadow-sm ring-1 ring-rose-200/70 hover:bg-rose-50/70 hover:ring-rose-300/70 hover:shadow-md transition-all"
                  @click="requestDelete(questionnaire)"
                >
                  <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Delete Confirmation Dialog -->
        <Teleport to="body">
          <Transition name="fade">
            <div
              v-if="deleteDialogOpen && questionnairePendingDelete"
              class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
              role="presentation"
              @click.self="cancelDelete"
            >
              <div
                class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/80"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-q-dialog-title"
                aria-describedby="delete-q-dialog-desc"
                @keydown.escape="cancelDelete"
              >
                <header class="border-b border-purple-200/80 bg-gradient-to-r from-purple-50 via-white to-pink-50 px-6 py-4">
                  <div class="flex items-start gap-3">
                    <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700 ring-1 ring-purple-200/80" aria-hidden="true">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                      </svg>
                    </span>
                    <div class="min-w-0">
                      <h2 id="delete-q-dialog-title" class="text-base font-semibold text-slate-900">
                        ¿Eliminar este cuestionario?
                      </h2>
                      <p class="mt-1 text-sm font-medium text-slate-500 truncate">
                        «{{ questionnairePendingDelete.title }}»
                      </p>
                    </div>
                  </div>
                </header>

                <div class="px-6 py-5">
                  <p id="delete-q-dialog-desc" class="text-sm leading-relaxed text-slate-700">
                    Este cuestionario forma parte del
                    <strong class="font-semibold text-slate-900">protocolo de evaluación clínica</strong>
                    de tinnitus. Eliminarlo borrará de manera permanente
                    <strong class="font-semibold text-rose-700">todas las respuestas de pacientes</strong>,
                    el historial de aplicaciones y los resultados estadísticos acumulados —
                    datos que <strong class="font-semibold text-rose-700">no podrán recuperarse</strong>.
                  </p>
                  <p class="mt-3 text-sm leading-relaxed text-slate-700">
                    Si el contenido no es exacto o está desactualizado, te recomendamos
                    <strong class="font-semibold text-emerald-800">editar el cuestionario</strong>
                    en lugar de eliminarlo: así conservas el historial de evaluaciones, los patrones
                    detectados y la trazabilidad clínica del seguimiento de tus pacientes.
                  </p>
                </div>

                <footer class="flex flex-col gap-2 border-t border-slate-200 bg-slate-50/80 px-6 py-4 sm:flex-row sm:flex-wrap sm:justify-end">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200/80 transition-all hover:bg-white"
                    :disabled="deletingItem"
                    @click="cancelDelete"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700"
                    :disabled="deletingItem"
                    @click="openEditFromDeleteDialog"
                  >
                    <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Editar cuestionario
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-rose-700 ring-1 ring-rose-200/80 transition-all hover:bg-rose-50 disabled:opacity-50"
                    :disabled="deletingItem"
                    @click="confirmDelete"
                  >
                    {{ deletingItem ? 'Eliminando…' : 'Eliminar de todos modos' }}
                  </button>
                </footer>
              </div>
            </div>
          </Transition>
        </Teleport>

        <!-- Edit Modal -->
        <Teleport to="body">
          <Transition name="fade">
            <div
              v-if="editDialogOpen"
              class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
              role="presentation"
              @click.self="cancelEdit"
            >
              <div
                class="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/80"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-q-dialog-title"
                @keydown.escape="cancelEdit"
              >
                <header class="border-b border-purple-200/80 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 px-6 py-4">
                  <div class="flex items-center gap-3">
                    <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white" aria-hidden="true">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </span>
                    <div>
                      <h2 id="edit-q-dialog-title" class="text-base font-semibold text-white">Editar cuestionario</h2>
                      <p class="text-xs text-white/75 mt-0.5">Actualiza el título y descripción</p>
                    </div>
                    <button type="button" class="ml-auto p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors" aria-label="Cerrar" @click="cancelEdit">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </header>

                <div class="px-6 py-5 space-y-4">
                  <div>
                    <label for="edit-q-title" class="block text-sm font-semibold text-slate-700 mb-1.5">
                      Título <span class="text-rose-500">*</span>
                    </label>
                    <input
                      id="edit-q-title"
                      v-model="editTitle"
                      type="text"
                      maxlength="200"
                      placeholder="Ej: Evaluación de Severidad de Tinnitus"
                      class="w-full px-4 py-3 border-2 border-purple-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label for="edit-q-desc" class="block text-sm font-semibold text-slate-700 mb-1.5">
                      Descripción <span class="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="edit-q-desc"
                      v-model="editDescription"
                      rows="4"
                      maxlength="1000"
                      placeholder="Describe el objetivo y alcance de este cuestionario…"
                      class="w-full px-4 py-3 border-2 border-purple-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all resize-none placeholder:text-slate-400"
                    />
                  </div>
                  <p v-if="editError" class="text-sm text-rose-600 flex items-center gap-1.5">
                    <svg class="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                    {{ editError }}
                  </p>
                </div>

                <footer class="flex gap-3 border-t border-slate-200 bg-slate-50/80 px-6 py-4">
                  <button
                    type="button"
                    class="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200/80 transition-all hover:bg-white disabled:opacity-50"
                    :disabled="savingEdit"
                    @click="cancelEdit"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    class="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="savingEdit || !editTitle.trim() || !editDescription.trim()"
                    @click="saveEdit"
                  >
                    <svg v-if="savingEdit" class="h-4 w-4 animate-spin shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    {{ savingEdit ? 'Guardando…' : 'Guardar cambios' }}
                  </button>
                </footer>
              </div>
            </div>
          </Transition>
        </Teleport>

        <!-- Empty State -->
        <div v-if="filteredQuestionnaires.length === 0" class="bg-white rounded-2xl shadow-lg p-12 text-center border border-purple-100">
          <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">No se encontraron cuestionarios</h3>
          <p class="text-gray-600 mb-6">Crea tu primer cuestionario de tinnitus</p>
          <button
            @click="showBuilder = true"
            class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Crear Cuestionario
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from 'axios';
import TinnutusQuestionnaireForm from './TinnitusQuestionnaireForm.vue';

const API_BASE = 'http://localhost:3000/api/v1/questionnaires';

interface Questionnaire {
  id: number | string;
  title: string;
  description: string;
  questions?: unknown[];
}

const showBuilder = ref(false);
const searchQuery = ref('');

const questionnaires = ref<Questionnaire[]>([
  {
    id: 1,
    title: 'Evaluación de Severidad de Tinnitus (TSS)',
    description: 'Cuestionario estandarizado para medir la intensidad y el impacto del tinnitus en la vida diaria del paciente.',
  },
  {
    id: 2,
    title: 'Cuestionario de Impacto Emocional del Tinnitus',
    description: 'Evaluación del efecto emocional y psicológico del tinnitus, incluyendo ansiedad, depresión y calidad del sueño.',
  },
  {
    id: 3,
    title: 'Frecuencia y Características del Tinnitus',
    description: 'Registro detallado de la frecuencia, tipo de sonido, volumen percibido y momentos del día en que se presenta el tinnitus.',
  },
]);

const filteredQuestionnaires = computed(() => {
  if (!searchQuery.value) return questionnaires.value;
  const query = searchQuery.value.toLocaleLowerCase();
  return questionnaires.value.filter(q =>
    q.title.toLocaleLowerCase().includes(query) ||
    q.description.toLocaleLowerCase().includes(query),
  );
});

const handleQuestionnaireSaved = () => {
  showBuilder.value = false;
  fetchQuestionnaires();
};

const fetchQuestionnaires = async () => {
  try {
    const response = await axios.get(API_BASE);
    questionnaires.value = response.data;
  } catch (error) {
    console.error('Error fetching questionnaires:', error);
  }
};

// ── Delete ────────────────────────────────────────────────────────────────────
const deleteDialogOpen = ref(false);
const questionnairePendingDelete = ref<Questionnaire | null>(null);
const deletingItem = ref(false);

function requestDelete(q: Questionnaire) {
  questionnairePendingDelete.value = q;
  deleteDialogOpen.value = true;
}

function cancelDelete() {
  if (deletingItem.value) return;
  questionnairePendingDelete.value = null;
  deleteDialogOpen.value = false;
}

async function confirmDelete() {
  if (!questionnairePendingDelete.value) return;
  deletingItem.value = true;
  try {
    await axios.delete(`${API_BASE}/${questionnairePendingDelete.value.id}`);
    questionnaires.value = questionnaires.value.filter(
      q => q.id !== questionnairePendingDelete.value!.id,
    );
  } catch {
    questionnaires.value = questionnaires.value.filter(
      q => q.id !== questionnairePendingDelete.value!.id,
    );
  } finally {
    deletingItem.value = false;
    deleteDialogOpen.value = false;
    questionnairePendingDelete.value = null;
  }
}

// ── Edit ──────────────────────────────────────────────────────────────────────
const editDialogOpen = ref(false);
const editingId = ref<number | string | null>(null);
const editTitle = ref('');
const editDescription = ref('');
const editError = ref('');
const savingEdit = ref(false);

function openEdit(q: Questionnaire) {
  editingId.value = q.id;
  editTitle.value = q.title;
  editDescription.value = q.description;
  editError.value = '';
  editDialogOpen.value = true;
}

function cancelEdit() {
  if (savingEdit.value) return;
  editDialogOpen.value = false;
  editingId.value = null;
  editTitle.value = '';
  editDescription.value = '';
  editError.value = '';
}

async function saveEdit() {
  const title = editTitle.value.trim();
  const description = editDescription.value.trim();
  if (!title) { editError.value = 'El título es requerido.'; return; }
  if (!description) { editError.value = 'La descripción es requerida.'; return; }
  editError.value = '';
  savingEdit.value = true;
  try {
    await axios.patch(`${API_BASE}/${editingId.value}`, { title, description });
    const idx = questionnaires.value.findIndex(q => q.id === editingId.value);
    const existing = idx !== -1 ? questionnaires.value[idx] : null;
    if (existing) {
      questionnaires.value[idx] = { id: existing.id, questions: existing.questions, title, description };
    }
    cancelEdit();
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
    editError.value = msg ?? 'No se pudo guardar. Intenta de nuevo.';
  } finally {
    savingEdit.value = false;
  }
}

function openEditFromDeleteDialog() {
  const q = questionnairePendingDelete.value;
  deleteDialogOpen.value = false;
  questionnairePendingDelete.value = null;
  if (q) openEdit(q);
}

fetchQuestionnaires();
</script>


<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>