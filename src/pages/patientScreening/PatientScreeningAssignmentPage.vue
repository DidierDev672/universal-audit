<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl mb-8">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <div>
          <h2 class="text-3xl font-bold mb-1">Asignar Tamizaje a Paciente 🏥</h2>
          <p class="text-white/90">Gestiona la asignación de tamizajes auditivos a pacientes registrados</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Patient Selection -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
          <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Seleccionar Paciente
          </h3>
        </div>

        <div class="p-6 space-y-4">
          <!-- Search -->
          <div class="relative">
            <input v-model="patientSearchQuery" type="text" placeholder="Buscar paciente por nombre..."
              class="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              @input="searchPatients" />
            <div class="absolute left-4 top-1/2 -translate-y-1/2">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Patient List -->
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div v-for="patient in filteredPatients" :key="patient.id" @click="selectPatient(patient)" :class="[
              'p-4 rounded-xl cursor-pointer transition-all border-2',
              selectedPatient?.id === patient.id
                ? 'bg-blue-50 border-blue-500'
                : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-200',
            ]">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {{ getInitials(patient.fullName) }}
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-gray-800">{{ patient.fullName }}</p>
                  <p class="text-sm text-gray-500">{{ patient.documentType }}: {{ patient.documentNumber }}</p>
                </div>
                <div v-if="selectedPatient?.id === patient.id" class="text-blue-600">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div v-if="filteredPatients.length === 0" class="text-center py-8 text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No se encontraron pacientes</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Screening Selection -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-4 border-b border-teal-100">
          <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
            <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Seleccionar Tamizaje
          </h3>
        </div>

        <div class="p-6 space-y-4">
          <!-- Search -->
          <div class="relative">
            <input v-model="screeningSearchQuery" type="text" placeholder="Buscar tamizaje..."
              class="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all" />
            <div class="absolute left-4 top-1/2 -translate-y-1/2">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Screening List -->
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div v-for="screening in filteredScreenings" :key="screening.id" @click="selectScreening(screening)" :class="[
              'p-4 rounded-xl cursor-pointer transition-all border-2',
              selectedScreenings.some(s => s.id === screening.id)
                ? 'bg-teal-50 border-teal-500'
                : 'bg-gray-50 border-gray-200 hover:bg-teal-50 hover:border-teal-200',
            ]">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-gray-800">{{ screening.title }}</p>
                  <p class="text-sm text-gray-500 line-clamp-1">{{ screening.description }}</p>
                </div>
                <div v-if="selectedScreenings.some(s => s.id === screening.id)" class="text-teal-600">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div v-if="filteredScreenings.length === 0" class="text-center py-8 text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No se encontraron tamizajes</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Assignment Details -->
    <div v-if="selectedPatient && selectedScreenings.length > 0"
      class="mt-6 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div class="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-100">
        <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Confirmar Asignación ({{ selectedScreenings.length }} tamizajes)
        </h3>
      </div>

      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-blue-50 rounded-xl p-4">
            <p class="text-sm text-gray-500 mb-1">Paciente</p>
            <p class="font-semibold text-gray-800">{{ selectedPatient.fullName }}</p>
            <p class="text-sm text-gray-600">{{ selectedPatient.documentType }}: {{ selectedPatient.documentNumber }}
            </p>
          </div>
          <div class="bg-teal-50 rounded-xl p-4">
            <p class="text-sm text-gray-500 mb-1">Tamizajes Seleccionados</p>
            <div class="space-y-1 max-h-32 overflow-y-auto">
              <p v-for="s in selectedScreenings" :key="s.id" class="font-medium text-gray-800 text-sm">• {{ s.title }}
              </p>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-2">Notas (opcional)</label>
          <textarea v-model="assignmentNotes" rows="3" placeholder="Ingrese notas adicionales sobre la asignación..."
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all resize-none"></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4">
          <button @click="clearSelection"
            class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all">
            Cancelar
          </button>
          <button @click="createAssignment" :disabled="isCreating" :class="[
            'flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2',
            isCreating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl',
          ]">
            <svg v-if="isCreating" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ isCreating ? 'Asignando...' : 'Confirmar Asignación' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Existing Assignments -->
    <div class="mt-8">
      <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Asignaciones Existentes
      </h3>

      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div v-if="assignments.length === 0" class="p-8 text-center text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-lg">No hay asignaciones registradas</p>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div v-for="assignment in assignments" :key="assignment.id" class="p-4 hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold">
                  {{ getInitials(assignment.patientName) }}
                </div>
                <div>
                  <p class="font-semibold text-gray-800">{{ assignment.patientName }}</p>
                  <p class="text-sm text-gray-500">{{ assignment.screeningTitle }}</p>
                  <p class="text-xs text-gray-400">Asignado: {{ formatDate(assignment.assignedAt) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-medium',
                  getStatusClass(assignment.status),
                ]">
                  {{ getStatusLabel(assignment.status) }}
                </span>
                <button @click="deleteAssignment(assignment.id)"
                  class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar asignación">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { PatientScreeningAssignmentRepository } from '../../infrastructure/patientScreening/repositories/PatientScreeningAssignmentRepository';
import { PatientRepository } from '../../infrastructure/patientScreening/repositories/PatientRepository';
import { ScreeningRepository } from '../../infrastructure/screening/repositories/ScreeningRepository';
import {
  AssignScreeningToPatientUseCase,
  GetAllAssignmentsUseCase,
  DeleteAssignmentUseCase,
  GetAllPatientsUseCase,
} from '../../application/patientScreening/use-cases/PatientScreeningAssignmentUseCases';
import { GetAllScreeningsUseCase } from '../../application/screening/use-cases/ScreeningUseCases';
import type { PatientScreeningAssignment, Patient } from '../../core/patientScreening/entities/patientScreeningAssignment';
import type { Screening } from '../../core/screening/entities/screening';

// State
const patients = ref<Patient[]>([]);
const screenings = ref<Screening[]>([]);
const assignments = ref<PatientScreeningAssignment[]>([]);
const selectedPatient = ref<Patient | null>(null);
const selectedScreenings = ref<Screening[]>([]);
const patientSearchQuery = ref('');
const screeningSearchQuery = ref('');
const assignmentNotes = ref('');
const isCreating = ref(false);
const isLoading = ref(false);

// Repositories
const patientRepo = new PatientRepository();
const screeningRepo = new ScreeningRepository();
const assignmentRepo = new PatientScreeningAssignmentRepository();

// Use Cases
const assignUseCase = new AssignScreeningToPatientUseCase(assignmentRepo, patientRepo, screeningRepo);
const getAssignmentsUseCase = new GetAllAssignmentsUseCase(assignmentRepo);
const deleteAssignmentUseCase = new DeleteAssignmentUseCase(assignmentRepo);
const getPatientsUseCase = new GetAllPatientsUseCase(patientRepo);
const getScreeningsUseCase = new GetAllScreeningsUseCase(screeningRepo);

// Filtered lists
const filteredPatients = computed(() => {
  if (!patientSearchQuery.value) return patients.value;
  const query = patientSearchQuery.value.toLowerCase();
  return patients.value.filter((p) => p.fullName.toLowerCase().includes(query));
});

const filteredScreenings = computed(() => {
  if (!screeningSearchQuery.value) return screenings.value;
  const query = screeningSearchQuery.value.toLowerCase();
  return screenings.value.filter((s) =>
    s.title.toLowerCase().includes(query) || s.description.toLowerCase().includes(query),
  );
});

// Methods
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const selectPatient = (patient: Patient) => {
  selectedPatient.value = patient;
};

const selectScreening = (screening: Screening) => {
  const index = selectedScreenings.value.findIndex(s => s.id === screening.id);
  if (index > -1) {
    selectedScreenings.value.splice(index, 1);
  } else {
    selectedScreenings.value.push(screening);
  }
};

const clearSelection = () => {
  selectedPatient.value = null;
  selectedScreenings.value = [];
  assignmentNotes.value = '';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    in_progress: 'En progreso',
    completed: 'Completado',
    cancelled: 'Cancelado',
  };
  return labels[status] || status;
};

const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return classes[status] || 'bg-gray-100 text-gray-700';
};

const createAssignment = async () => {
  if (!selectedPatient.value || selectedScreenings.value.length === 0) return;

  isCreating.value = true;
  try {
    await assignUseCase.execute({
      patientId: selectedPatient.value.id,
      screeningIds: selectedScreenings.value.map(s => s.id),
      notes: assignmentNotes.value,
      assignedBy: 'current-user',
    });

    alert('Asignación creada exitosamente');
    clearSelection();
    await loadAssignments();
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Error al crear asignación');
  } finally {
    isCreating.value = false;
  }
};

const deleteAssignment = async (id: string) => {
  if (!confirm('¿Está seguro de eliminar esta asignación?')) return;

  try {
    await deleteAssignmentUseCase.execute(id);
    alert('Asignación eliminada exitosamente');
    await loadAssignments();
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Error al eliminar asignación');
  }
};

const loadData = async () => {
  isLoading.value = true;
  try {
    const [patientsData, screeningsData] = await Promise.all([
      getPatientsUseCase.execute(),
      getScreeningsUseCase.execute(),
    ]);
    patients.value = patientsData;
    screenings.value = screeningsData;
    await loadAssignments();
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    isLoading.value = false;
  }
};

const loadAssignments = async () => {
  try {
    assignments.value = await getAssignmentsUseCase.execute();
  } catch (error) {
    console.error('Error loading assignments:', error);
  }
};

const searchPatients = () => {
  // Search is handled by computed property
};

// Lifecycle
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
