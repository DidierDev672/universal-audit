<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// Interfaces
interface Questionnaire {
  id: string;
  title: string;
  description?: string;
  type: string;
  isActive: boolean;
  createdAt?: string;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  documentNumber?: string;
  phone?: string;
}

// Estado
const questionnaires = ref<Questionnaire[]>([]);
const patients = ref<Patient[]>([]);
const selectedQuestionnaires = ref<Set<string>>(new Set());
const selectedPatients = ref<Set<string>>(new Set());
const isLoadingQuestionnaires = ref(false);
const isLoadingPatients = ref(false);
const isAssigning = ref(false);
const showPatientModal = ref(false);
const searchQuery = ref('');
const patientSearchQuery = ref('');

// Computed
const filteredQuestionnaires = computed(() => {
  if (!searchQuery.value.trim()) return questionnaires.value;
  const query = searchQuery.value.toLowerCase();
  return questionnaires.value.filter(
    (q) =>
      q.title.toLowerCase().includes(query) ||
      (q.description && q.description.toLowerCase().includes(query))
  );
});

const filteredPatients = computed(() => {
  if (!patientSearchQuery.value.trim()) return patients.value;
  const query = patientSearchQuery.value.toLowerCase();
  return patients.value.filter(
    (p) =>
      p.firstName.toLowerCase().includes(query) ||
      p.lastName.toLowerCase().includes(query) ||
      (p.email && p.email.toLowerCase().includes(query)) ||
      (p.documentNumber && p.documentNumber.toLowerCase().includes(query))
  );
});

const hasSelectedQuestionnaires = computed(() => selectedQuestionnaires.value.size > 0);
const hasSelectedPatients = computed(() => selectedPatients.value.size > 0);

const selectedCountText = computed(() => {
  const count = selectedQuestionnaires.value.size;
  return count === 1 ? '1 cuestionario seleccionado' : `${count} cuestionarios seleccionados`;
});

// Cargar cuestionarios
const loadQuestionnaires = async () => {
  isLoadingQuestionnaires.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/v1/questionnaires', {
      timeout: 30000,
    });
    questionnaires.value = response.data || [];
    console.log(`✅ ${questionnaires.value.length} cuestionarios de tinnitus cargados`);
  } catch (error) {
    console.error('❌ Error al cargar cuestionarios:', error);
    showAlert('Error al cargar los cuestionarios. Intente nuevamente.', 'error');
  } finally {
    isLoadingQuestionnaires.value = false;
  }
};

// Cargar pacientes
const loadPatients = async () => {
  isLoadingPatients.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/v1/patients', {
      timeout: 30000
    });
    const data = response.data;
    patients.value = Array.isArray(data) ? data : (data?.data || []);
    console.log(`✅ ${patients.value.length} pacientes cargados`);
  } catch (error) {
    console.error('❌ Error al cargar pacientes:', error);
    showAlert('Error al cargar los pacientes. Intente nuevamente.', 'error');
  } finally {
    isLoadingPatients.value = false;
  }
};

// Toggle selección de cuestionario
const toggleQuestionnaire = (id: string) => {
  if (selectedQuestionnaires.value.has(id)) {
    selectedQuestionnaires.value.delete(id);
  } else {
    selectedQuestionnaires.value.add(id);
  }
};

// Seleccionar/deseleccionar todos
const selectAllQuestionnaires = () => {
  if (selectedQuestionnaires.value.size === filteredQuestionnaires.value.length) {
    selectedQuestionnaires.value.clear();
  } else {
    filteredQuestionnaires.value.forEach((q) => selectedQuestionnaires.value.add(q.id));
  }
};

// Toggle selección de paciente
const togglePatient = (id: string) => {
  if (selectedPatients.value.has(id)) {
    selectedPatients.value.delete(id);
  } else {
    selectedPatients.value.add(id);
  }
};

// Abrir modal de pacientes
const openPatientModal = () => {
  if (!hasSelectedQuestionnaires.value) {
    showAlert('Por favor seleccione al menos un cuestionario', 'warning');
    return;
  }
  selectedPatients.value.clear();
  patientSearchQuery.value = '';
  showPatientModal.value = true;
  loadPatients();
};

// Cerrar modal de pacientes
const closePatientModal = () => {
  showPatientModal.value = false;
  selectedPatients.value.clear();
  patientSearchQuery.value = '';
};

// Asignar cuestionarios a pacientes
const assignQuestionnaires = async () => {
  if (!hasSelectedQuestionnaires.value || !hasSelectedPatients.value) {
    showAlert('Debe seleccionar cuestionarios y pacientes', 'warning');
    return;
  }

  isAssigning.value = true;

  try {
    const questionnaireIds = Array.from(selectedQuestionnaires.value);
    const patientIds = Array.from(selectedPatients.value);

    console.log('📤 Asignando cuestionarios:', { questionnaireIds, patientIds });

    // Asignar cada cuestionario a cada paciente
    const promises: Promise<any>[] = [];

    for (const patientId of patientIds) {
      for (const questionnaireId of questionnaireIds) {
        const assignmentData = {
          idPatient: patientId,
          idTinnitusQuestionnaires: questionnaireId
        };

        console.log('📤 Enviando asignación:', assignmentData);

        promises.push(
          axios.post(
            'http://localhost:3000/api/v1/tinnitus-assignments',
            assignmentData,
            { timeout: 30000 }
          )
        );
      }
    }

    await Promise.all(promises);

    console.log('✅ Cuestionarios asignados exitosamente');

    showAlert(
      `Cuestionarios asignados a ${patientIds.length} paciente(s) exitosamente`,
      'success'
    );

    closePatientModal();
    selectedQuestionnaires.value.clear();
  } catch (error: any) {
    console.error('❌ Error al asignar cuestionarios:', error);
    showAlert(
      error.response?.data?.message || 'Error al asignar los cuestionarios. Intente nuevamente.',
      'error'
    );
  } finally {
    isAssigning.value = false;
  }
};

// Mostrar alerta
const showAlert = (message: string, type: 'success' | 'error' | 'warning' = 'warning') => {
  const colors = {
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200'
  };

  const alertDiv = document.createElement('div');
  alertDiv.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${colors[type]}`;
  alertDiv.innerHTML = `
    <span class="font-medium">${message}</span>
  `;
  document.body.appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 4000);
};

// Formatear nombre del paciente
const getPatientFullName = (patient: Patient) => {
  return `${patient?.fullName || ''}`;
};

onMounted(() => {
  loadQuestionnaires();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold">Asignación de Cuestionarios de Tinnitus</h1>
            <p class="text-teal-100">Seleccione cuestionarios y asígnelos a pacientes</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search and Actions Bar -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <!-- Search -->
          <div class="relative w-full sm:w-96">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input v-model="searchQuery" type="text" placeholder="Buscar cuestionarios..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
          </div>

          <!-- Selection Info & Actions -->
          <div class="flex items-center gap-4">
            <span v-if="hasSelectedQuestionnaires" class="text-sm text-gray-600 font-medium">
              {{ selectedCountText }}
            </span>
            <button @click="openPatientModal" :disabled="!hasSelectedQuestionnaires"
              class="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-medium hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Asignar a Pacientes
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingQuestionnaires" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <span class="ml-4 text-gray-600 font-medium">Cargando cuestionarios...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="questionnaires.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">No hay cuestionarios disponibles</h3>
        <p class="text-gray-500 mt-2">No se encontraron cuestionarios de tinnitus en el sistema.</p>
      </div>

      <!-- Questionnaires Grid -->
      <div v-else class="grid gap-4">
        <!-- Select All Header -->
        <div class="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3">
          <input type="checkbox"
            :checked="selectedQuestionnaires.size === filteredQuestionnaires.length && filteredQuestionnaires.length > 0"
            @change="selectAllQuestionnaires"
            class="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer" />
          <span class="text-sm font-medium text-gray-700">Seleccionar todos los cuestionarios visibles</span>
        </div>

        <!-- Questionnaire Items -->
        <div v-for="questionnaire in filteredQuestionnaires" :key="questionnaire.id"
          class="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
          @click="toggleQuestionnaire(questionnaire.id)">
          <div class="flex items-start gap-4">
            <input type="checkbox" :checked="selectedQuestionnaires.has(questionnaire.id)" @click.stop
              @change="toggleQuestionnaire(questionnaire.id)"
              class="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer mt-1" />

            <div class="flex-1">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ questionnaire.title }}</h3>
                  <p v-if="questionnaire.description" class="text-gray-600 mt-1 text-sm">
                    {{ questionnaire.description }}
                  </p>
                </div>
                <span class="px-2.5 py-1 bg-teal-100 text-teal-700 rounded-lg text-xs font-medium uppercase">
                  {{ questionnaire.type }}
                </span>
              </div>

              <div class="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Creado: {{ new Date(questionnaire.createdAt || '').toLocaleDateString('es-ES') }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <span :class="questionnaire.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
                    class="px-2 py-0.5 rounded text-xs font-medium">
                    {{ questionnaire.isActive ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Selección de Pacientes -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showPatientModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closePatientModal"></div>

          <!-- Modal Content -->
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-white">Seleccionar Pacientes</h2>
                    <p class="text-teal-100 text-sm">Seleccione los pacientes para asignar los cuestionarios</p>
                  </div>
                </div>
                <button @click="closePatientModal" class="text-white/80 hover:text-white transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <!-- Search -->
              <div class="relative mb-4">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input v-model="patientSearchQuery" type="text"
                  placeholder="Buscar pacientes por nombre, email o documento..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
              </div>

              <!-- Loading -->
              <div v-if="isLoadingPatients" class="flex items-center justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <span class="ml-3 text-gray-600">Cargando pacientes...</span>
              </div>

              <!-- Empty -->
              <div v-else-if="patients.length === 0" class="text-center py-8">
                <p class="text-gray-500">No hay pacientes disponibles</p>
              </div>

              <!-- Patients List -->
              <div v-else class="space-y-2">
                <div v-for="patient in filteredPatients" :key="patient.id"
                  class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
                  @click="togglePatient(patient.id)">
                  <input type="checkbox" :checked="selectedPatients.has(patient.id)" @click.stop
                    @change="togglePatient(patient.id)"
                    class="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer" />

                  <div class="flex-1">
                    <p class="font-medium text-gray-900">{{ getPatientFullName(patient) }}</p>
                    <div class="flex items-center gap-3 text-sm text-gray-500">
                      <span v-if="patient.email" class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {{ patient.email }}
                      </span>
                      <span v-if="patient.documentNumber" class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3 3 0 00-3 3m3-3a3 3 0 013 3m-3 0h3" />
                        </svg>
                        {{ patient.documentNumber }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Selected Count -->
              <div v-if="hasSelectedPatients" class="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
                <p class="text-sm text-teal-800 font-medium">
                  {{ selectedPatients.size }} paciente(s) seleccionado(s)
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button @click="closePatientModal"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-all">
                Cancelar
              </button>
              <button @click="assignQuestionnaires" :disabled="!hasSelectedPatients || isAssigning"
                class="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-medium hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="isAssigning" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ isAssigning ? 'Asignando...' : 'Asignar Cuestionarios' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
