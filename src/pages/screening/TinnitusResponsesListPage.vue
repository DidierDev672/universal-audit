<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// Interfaces
interface AnswerOption {
  text: string;
  value: number;
}

interface Answer {
  title: string;
  description: string;
  optionsAnswer: AnswerOption[];
}

interface TinnitusResponse {
  id: string;
  idPatient: string;
  idTinnitusQuestionnaires: string;
  answer: Answer[];
  patientName?: string;
  questionnaireTitle?: string;
}

interface Patient {
  id: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  height: number;
  weight: number;
  isAllergic: boolean;
  email?: string;
}

interface Questionnaire {
  id: string;
  title: string;
  description?: string;
}

// Estado
const responses = ref<TinnitusResponse[]>([]);
const patients = ref<Map<string, Patient>>(new Map());
const questionnaires = ref<Map<string, Questionnaire>>(new Map());
const isLoading = ref(false);
const searchQuery = ref('');
const selectedResponse = ref<TinnitusResponse | null>(null);
const showDetailModal = ref(false);

// Computed
const filteredResponses = computed(() => {
  if (!searchQuery.value.trim()) return responses.value;
  const query = searchQuery.value.toLowerCase();
  return responses.value.filter(
    (r) =>
      r.patientName?.toLowerCase().includes(query) ||
      r.questionnaireTitle?.toLowerCase().includes(query)
  );
});

// Cargar respuestas
const loadResponses = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/v1/tinnitus-responses', {
      timeout: 30000
    });
    const data = response.data;
    responses.value = Array.isArray(data) ? data : (data?.data || []);
    console.log(`✅ ${responses.value.length} respuestas cargadas`);

    // Cargar información de pacientes y cuestionarios
    await enrichResponseData();
  } catch (error) {
    console.error('❌ Error al cargar respuestas:', error);
    showAlert('Error al cargar las respuestas. Intente nuevamente.', 'error');
  } finally {
    isLoading.value = false;
  }
};

// Enriquecer datos con pacientes y cuestionarios
const enrichResponseData = async () => {
  const patientIds = [...new Set(responses.value.map((r) => r.idPatient))];
  const questionnaireIds = [...new Set(responses.value.map((r) => r.idTinnitusQuestionnaires))];

  // Cargar pacientes
  for (const patientId of patientIds) {
    if (!patients.value.has(patientId)) {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/patients/${patientId}`, {
          timeout: 10000
        });
        patients.value.set(patientId, response.data);
      } catch (error) {
        console.error(`❌ Error al cargar paciente ${patientId}:`, error);
      }
    }
  }

  // Cargar cuestionarios
  for (const questionnaireId of questionnaireIds) {
    if (!questionnaires.value.has(questionnaireId)) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/questionnaires/${questionnaireId}`,
          { timeout: 10000 }
        );
        questionnaires.value.set(questionnaireId, response.data);
      } catch (error) {
        console.error(`❌ Error al cargar cuestionario ${questionnaireId}:`, error);
      }
    }
  }

  // Actualizar respuestas con nombres
  responses.value = responses.value.map((r) => ({
    ...r,
    patientName: getPatientName(r.idPatient),
    questionnaireTitle: getQuestionnaireTitle(r.idTinnitusQuestionnaires)
  }));
};

// Obtener nombre del paciente
const getPatientName = (patientId: string): string => {
  const patient = patients.value.get(patientId);
  if (patient) {
    return patient.fullName;
  }
  return 'Paciente desconocido';
};

// Obtener título del cuestionario
const getQuestionnaireTitle = (questionnaireId: string): string => {
  const questionnaire = questionnaires.value.get(questionnaireId);
  return questionnaire?.title || 'Cuestionario desconocido';
};

// Ver detalle de respuesta
const viewResponseDetail = (response: TinnitusResponse) => {
  selectedResponse.value = response;
  showDetailModal.value = true;
};

// Cerrar modal
const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedResponse.value = null;
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
  alertDiv.innerHTML = `<span class="font-medium">${message}</span>`;
  document.body.appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 4000);
};

// Calcular puntuación total
const calculateTotalScore = (answers: Answer[]): number => {
  return answers.reduce((total, answer) => {
    const answerValue = answer.optionsAnswer?.[0]?.value || 0;
    return total + answerValue;
  }, 0);
};

// Obtener nivel de severidad basado en puntuación
const getSeverityLevel = (score: number): { label: string; color: string } => {
  if (score <= 5) return { label: 'Leve', color: 'bg-green-100 text-green-700' };
  if (score <= 10) return { label: 'Moderado', color: 'bg-yellow-100 text-yellow-700' };
  if (score <= 15) return { label: 'Severo', color: 'bg-orange-100 text-orange-700' };
  return { label: 'Muy Severo', color: 'bg-red-100 text-red-700' };
};

onMounted(() => {
  loadResponses();
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold">Respuestas de Cuestionarios de Tinnitus</h1>
            <p class="text-teal-100">Visualización de respuestas de pacientes</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search Bar -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div class="relative max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input v-model="searchQuery" type="text" placeholder="Buscar por paciente o cuestionario..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <span class="ml-4 text-gray-600 font-medium">Cargando respuestas...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="responses.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">No hay respuestas disponibles</h3>
        <p class="text-gray-500 mt-2">No se encontraron respuestas de cuestionarios de tinnitus.</p>
      </div>

      <!-- Responses Grid -->
      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="response in filteredResponses" :key="response.id"
          class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all cursor-pointer"
          @click="viewResponseDetail(response)">
          <!-- Card Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ response.patientName }}</h3>
                <p class="text-sm text-gray-500">{{ response.questionnaireTitle }}</p>
              </div>
            </div>
          </div>

          <!-- Score Badge -->
          <div class="flex items-center gap-2 mb-4">
            <span :class="getSeverityLevel(calculateTotalScore(response.answer)).color"
              class="px-3 py-1 rounded-full text-xs font-medium">
              {{ getSeverityLevel(calculateTotalScore(response.answer)).label }}
            </span>
            <span class="text-sm text-gray-600">
              Puntuación: {{ calculateTotalScore(response.answer) }}
            </span>
          </div>

          <!-- Summary -->
          <div class="border-t border-gray-100 pt-4">
            <p class="text-sm text-gray-600 mb-2">
              <span class="font-medium">{{ response.answer?.length || 0 }}</span> preguntas respondidas
            </p>
            <div class="flex flex-wrap gap-2">
              <span v-for="(ans, idx) in response.answer?.slice(0, 2)" :key="idx"
                class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {{ ans.title?.substring(0, 30) }}...
              </span>
              <span v-if="(response.answer?.length || 0) > 2" class="text-xs text-gray-500">
                +{{ response.answer.length - 2 }} más
              </span>
            </div>
          </div>

          <!-- View Button -->
          <div class="mt-4 pt-4 border-t border-gray-100">
            <button
              class="w-full py-2 bg-teal-50 text-teal-700 rounded-lg font-medium hover:bg-teal-100 transition-all flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c8.837 0 8.837 0 8.837 0m-8.837 14c-4.477 0-8.268-2.943-9.542-7 0 0 0 0 0 0m0 0c1.274-4.057 5.065-7 9.542-7 8.837 0 8.837 0 8.837 0" />
              </svg>
              Ver Detalle
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDetailModal && selectedResponse" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeDetailModal"></div>

          <!-- Modal Content -->
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-white">Detalle de Respuesta</h2>
                    <p class="text-teal-100 text-sm">{{ selectedResponse.patientName }}</p>
                  </div>
                </div>
                <button @click="closeDetailModal" class="text-white/80 hover:text-white transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <!-- Info Cards -->
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500 uppercase font-medium mb-1">Paciente</p>
                  <p class="font-semibold text-gray-900">{{ selectedResponse.patientName }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500 uppercase font-medium mb-1">Cuestionario</p>
                  <p class="font-semibold text-gray-900">{{ selectedResponse.questionnaireTitle }}</p>
                </div>
              </div>

              <!-- Total Score -->
              <div class="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-teal-700 font-medium">Puntuación Total</p>
                    <p class="text-3xl font-bold text-teal-800">
                      {{ calculateTotalScore(selectedResponse.answer) }}
                    </p>
                  </div>
                  <span :class="getSeverityLevel(calculateTotalScore(selectedResponse.answer)).color"
                    class="px-4 py-2 rounded-full text-sm font-bold">
                    {{ getSeverityLevel(calculateTotalScore(selectedResponse.answer)).label }}
                  </span>
                </div>
              </div>

              <!-- Answers List -->
              <div class="space-y-4">
                <h3 class="font-semibold text-gray-900 text-lg">Respuestas</h3>

                <div v-for="(answer, idx) in selectedResponse.answer" :key="idx"
                  class="bg-white border border-gray-200 rounded-xl p-4">
                  <div class="flex items-start gap-3">
                    <div
                      class="w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                      {{ idx + 1 }}
                    </div>
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-900 mb-1">{{ answer.title }}</h4>
                      <p class="text-sm text-gray-500 mb-3">{{ answer.description }}</p>

                      <div class="flex items-center gap-2">
                        <span class="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-sm font-medium">
                          {{ answer.optionsAnswer?.[0]?.text }}
                        </span>
                        <span class="text-sm text-gray-500">
                          (Valor: {{ answer.optionsAnswer?.[0]?.value }})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 px-6 py-4 flex justify-end">
              <button @click="closeDetailModal"
                class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-all">
                Cerrar
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
