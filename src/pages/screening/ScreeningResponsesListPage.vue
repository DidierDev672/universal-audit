<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useGenAI } from '../../shared/service/useGenAi';

const isAnalyzing = ref(false);
const showAnalysisModal = ref(false);
const currentAnalysis = ref<{
  patientName: string;
  screeningTitle: string;
  analysis: string;
  positiveCount: number;
  negativeCount: number;
  totalQuestions: number;
  recommendations: string[];
} | null>(null);
const screeningResponses = ref<ScreeningResponse[]>([]);
const patients = ref<Patient[]>([]);
const screenings = ref<Screening[]>([]);
const isLoading = ref(false);
const error = ref('');
const searchQuery = ref('');

// Mapas de lookup
const patientsMap = computed(() => {
  const map = new Map<string, Patient>();
  patients.value.forEach(p => map.set(p.id, p));
  return map;
});

const screeningsMap = computed(() => {
  const map = new Map<string, Screening>();
  screenings.value.forEach(s => map.set(s.id, s));
  return map;
});

// Obtener nombre del paciente
const getPatientName = (id: string) => {
  return patientsMap.value.get(id)?.fullName || 'Paciente desconocido';
};

// Obtener nombre del tamizaje
const getScreeningTitle = (id: string) => {
  return screeningsMap.value.get(id)?.title || 'Tamizaje desconocido';
};

// Interfaces
interface ScreeningOption {
  id: string;
  text: string;
  value: number;
}

interface ScreeningResponse {
  id: string;
  id_patient: string;
  id_screening: string;
  options_answer: ScreeningOption[];
  created_at: string;
  updated_at: string;
}

interface Patient {
  id: string;
  fullName: string;
  documentNumber?: string;
  email?: string;
  phone?: string;
}

interface Screening {
  id: string;
  title: string;
  description?: string;
}

// Cargar pacientes
const loadPatients = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/v1/patients', { timeout: 30000 });
    const data = response.data;
    patients.value = Array.isArray(data) ? data : (data?.data || []);
    console.log(`✅ ${patients.value.length} pacientes cargados`);
  } catch (err) {
    console.error('Error loading patients:', err);
  }
};

// Cargar tamizajes
const loadScreenings = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/v1/screenings', { timeout: 30000 });
    const data = response.data;
    screenings.value = Array.isArray(data) ? data : (data?.data || []);
    console.log(`✅ ${screenings.value.length} tamizajes cargados`);
  } catch (err) {
    console.error('Error loading screenings:', err);
  }
};
const loadScreeningResponses = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    const response = await axios.get('http://localhost:3000/api/v1/screening-responses/all', {
      timeout: 30000,
    });
    // Handle both array response and wrapped response formats
    const data = response.data;
    screeningResponses.value = Array.isArray(data) ? data : (data?.data || []);
    console.log(`✅ ${screeningResponses.value.length} respuestas de tamizaje cargadas`);
  } catch (err: any) {
    let message = 'No se pudo cargar la lista de respuestas de tamizaje.';
    if (axios.isAxiosError(err)) {
      if (err.response) {
        message = 'Error del servidor al obtener respuestas.';
      } else if (err.request) {
        message = 'No se pudo conectar con el servidor.';
      }
    }
    error.value = message;
    console.error('Error loading screening responses:', err);
  } finally {
    isLoading.value = false;
  }
};

// Filtrar respuestas
const filteredResponses = computed(() => {
  let filtered = screeningResponses.value;

  // Filtrar por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(response =>
      response.id.toLowerCase().includes(query) ||
      getPatientName(response.id_patient).toLowerCase().includes(query) ||
      getScreeningTitle(response.id_screening).toLowerCase().includes(query)
    );
  }

  return filtered.sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
});

// Formatear fecha
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Analizar respuestas con IA (Gemini)
const analyzeResponses = async (response: ScreeningResponse) => {
  try {
    isAnalyzing.value = true;

    // Contar respuestas positivas (1) y negativas (0)
    const positiveCount = response.options_answer.filter(opt => opt.value === 1).length;
    const negativeCount = response.options_answer.filter(opt => opt.value === 0).length;
    const totalQuestions = response.options_answer.length;

    // Preparar datos para el prompt
    const patientName = getPatientName(response.id_patient);
    const screeningTitle = getScreeningTitle(response.id_screening);

    // Crear lista de respuestas con su interpretación
    const answersList = response.options_answer.map(opt =>
      `- "${opt.text}": ${opt.value === 1 ? 'SÍ (1/True) - Positivo para indicador de riesgo' : 'NO (0/False) - Negativo para indicador de riesgo'}`
    ).join('\n');

    // Construir prompt para Gemini
    const prompt = `Actúa como un especialista médico en audiología.Analiza las siguientes respuestas de un tamizaje auditivo y proporciona un análisis clínico profesional.

** CONTEXTO IMPORTANTE:**
    - Valor "1" = "SÍ"(respuesta positiva al síntoma / pregunta)
    - Valor "0" = "NO"(respuesta negativa al síntoma / pregunta)
    - Una respuesta con valor 1 indica la PRESENCIA de un indicador de riesgo auditivo
    - Una respuesta con valor 0 indica la AUSENCIA de ese indicador de riesgo

    ** DATOS DEL PACIENTE:**
    - Nombre: ${patientName}
    - Tamizaje: ${screeningTitle}
    - Total de preguntas: ${totalQuestions}
    - Respuestas con valor 1(indicadores positivos): ${positiveCount}
    - Respuestas con valor 0(indicadores negativos): ${negativeCount}

    ** RESPUESTAS DEL PACIENTE:**
    ${answersList}

Por favor, proporciona tu análisis en el siguiente formato JSON(responde ÚNICAMENTE con el JSON, sin markdown ni explicaciones adicionales):

      {
        "interpretacion": "Análisis clínico detallado del significado de estas respuestas para la salud auditiva del paciente. Explica qué significan los indicadores positivos encontrados.",
        "nivelRiesgo": "ALTO|MEDIO|BAJO",
        "recomendaciones": [
          "Recomendación médica específica 1",
          "Recomendación médica específica 2",
          "Recomendación médica específica 3",
          "Recomendación médica específica 4"
        ]
      }`;

    // Llamar a Gemini
    const model = useGenAI();
    const result = await model.generateContent(prompt);
    const geminiResponse = result.response.text();

    // Parsear la respuesta JSON
    let analysisData;
    try {
      // Intentar extraer JSON de la respuesta
      const jsonMatch = geminiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No se encontró JSON en la respuesta');
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      // Fallback a análisis local si Gemini no responde correctamente
      analysisData = generateFallbackAnalysis(positiveCount, negativeCount, totalQuestions);
    }

    currentAnalysis.value = {
      patientName,
      screeningTitle,
      analysis: analysisData.interpretacion || analysisData.analysis || 'Análisis no disponible',
      positiveCount,
      negativeCount,
      totalQuestions,
      recommendations: analysisData.recomendaciones || analysisData.recommendations || []
    };

    showAnalysisModal.value = true;
  } catch (err) {
    console.error('Error analyzing responses with Gemini:', err);
    alert('Error al analizar las respuestas con IA. Por favor intente nuevamente.');
  } finally {
    isAnalyzing.value = false;
  }
};

// Análisis de respaldo en caso de error con Gemini
const generateFallbackAnalysis = (positiveCount: number, negativeCount: number, totalQuestions: number) => {
  const positivePercentage = totalQuestions > 0 ? (positiveCount / totalQuestions) * 100 : 0;

  if (positivePercentage >= 70) {
    return {
      interpretacion: `El paciente presenta ${positiveCount} de ${totalQuestions} indicadores positivos(${Math.round(positivePercentage)} %).Esto sugiere una alta probabilidad de condiciones auditivas que requieren atención especializada.`,
      nivelRiesgo: 'ALTO',
      recomendaciones: [
        'Programar evaluación auditiva completa',
        'Considerar derivación a otorrinolaringología',
        'Realizar seguimiento periódico de la condición',
        'Documentar antecedentes familiares relacionados'
      ]
    };
  } else if (positivePercentage >= 40) {
    return {
      interpretacion: `El paciente presenta ${positiveCount} de ${totalQuestions} indicadores positivos(${Math.round(positivePercentage)} %).Se observan señales mixtas que podrían indicar condiciones auditivas en desarrollo.`,
      nivelRiesgo: 'MEDIO',
      recomendaciones: [
        'Realizar evaluación auditiva de seguimiento',
        'Monitorear cambios en la audición',
        'Educar al paciente sobre signos de alerta',
        'Programar revisión en 3-6 meses'
      ]
    };
  } else {
    return {
      interpretacion: `El paciente presenta ${positiveCount} de ${totalQuestions} indicadores positivos(${Math.round(positivePercentage)} %).La mayoría de las respuestas son negativas, lo que sugiere bajo riesgo auditivo actual.`,
      nivelRiesgo: 'BAJO',
      recomendaciones: [
        'Continuar con chequeos auditivos de rutina',
        'Mantener hábitos de protección auditiva',
        'Programar revisión anual preventiva',
        'Educar sobre prevención de daño auditivo'
      ]
    };
  }
};

const closeAnalysisModal = () => {
  showAnalysisModal.value = false;
  currentAnalysis.value = null;
};

onMounted(() => {
  loadPatients();
  loadScreenings();
  loadScreeningResponses();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Respuestas de Tamizaje</h1>
            <p class="text-sm text-gray-500 mt-1">Lista de respuestas registradas por pacientes</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
              {{ filteredResponses.length }} respuestas
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Search Bar -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="Buscar por ID, paciente o tamizaje..."
            class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" />
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
        <svg class="w-12 h-12 text-emerald-600 animate-spin mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <p class="text-gray-600">Cargando respuestas de tamizaje...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-12 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 class="text-lg font-semibold text-gray-800 mb-2">Error al cargar</h4>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button @click="loadScreeningResponses"
          class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reintentar
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredResponses.length === 0"
        class="flex flex-col items-center justify-center py-12 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h4 class="text-lg font-semibold text-gray-800 mb-2">No se encontraron respuestas</h4>
        <p class="text-gray-600">
          {{ searchQuery ? 'Intenta con otra búsqueda.' : 'No hay respuestas de tamizaje registradas.' }}
        </p>
      </div>

      <!-- List -->
      <div v-else class="grid grid-cols-1 gap-4">
        <div v-for="response in filteredResponses" :key="response.id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold shrink-0">
              {{ response.id.slice(0, 2).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <h3 class="font-semibold text-gray-800">Respuesta #{{ response.id.slice(-6) }}</h3>
                  <span class="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                    {{ response.options_answer.length }} respuestas
                  </span>
                </div>
                <!-- Botón Analizar con IA -->
                <button @click.stop="analyzeResponses(response)" :disabled="isAnalyzing"
                  class="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg v-if="isAnalyzing" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  {{ isAnalyzing ? 'Analizando...' : 'Analizar con IA' }}
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide">Paciente</p>
                  <p class="text-sm font-medium text-gray-900">{{ getPatientName(response.id_patient) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide">Tamizaje</p>
                  <p class="text-sm font-medium text-gray-900">{{ getScreeningTitle(response.id_screening) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide">Creado</p>
                  <p class="text-sm text-gray-700">{{ formatDate(response.created_at) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide">Actualizado</p>
                  <p class="text-sm text-gray-700">{{ formatDate(response.updated_at) }}</p>
                </div>
              </div>

              <!-- Opciones de respuesta -->
              <div v-if="response.options_answer.length > 0" class="mt-4">
                <p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Respuestas</p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="opt in response.options_answer" :key="opt.id"
                    class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm flex items-center gap-1">
                    <span class="font-medium">{{ opt.text }}:</span>
                    <span class="text-emerald-600 font-semibold">{{ opt.value }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="shrink-0">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Análisis con IA -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showAnalysisModal && currentAnalysis"
          class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeAnalysisModal"></div>

          <!-- Modal Content -->
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 rounded-t-2xl">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-white">Análisis con IA</h2>
                    <p class="text-white/80 text-sm">Resultados del tamizaje auditivo</p>
                  </div>
                </div>
                <button @click="closeAnalysisModal" class="text-white/80 hover:text-white transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="p-6">
              <!-- Patient & Screening Info -->
              <div class="bg-gray-50 rounded-xl p-4 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wide">Paciente</p>
                    <p class="text-lg font-semibold text-gray-900">{{ currentAnalysis.patientName }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wide">Tamizaje</p>
                    <p class="text-lg font-semibold text-gray-900">{{ currentAnalysis.screeningTitle }}</p>
                  </div>
                </div>
              </div>

              <!-- Statistics -->
              <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="bg-emerald-50 rounded-xl p-4 text-center">
                  <p class="text-2xl font-bold text-emerald-600">{{ currentAnalysis.positiveCount }}</p>
                  <p class="text-xs text-emerald-700 uppercase tracking-wide">Positivas (1)</p>
                </div>
                <div class="bg-red-50 rounded-xl p-4 text-center">
                  <p class="text-2xl font-bold text-red-600">{{ currentAnalysis.negativeCount }}</p>
                  <p class="text-xs text-red-700 uppercase tracking-wide">Negativas (0)</p>
                </div>
                <div class="bg-blue-50 rounded-xl p-4 text-center">
                  <p class="text-2xl font-bold text-blue-600">{{ currentAnalysis.totalQuestions }}</p>
                  <p class="text-xs text-blue-700 uppercase tracking-wide">Total</p>
                </div>
              </div>

              <!-- Analysis Text -->
              <div class="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl p-4 mb-6">
                <h3 class="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Interpretación
                </h3>
                <p class="text-indigo-800 leading-relaxed">{{ currentAnalysis.analysis }}</p>
              </div>

              <!-- Recommendations -->
              <div>
                <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Recomendaciones
                </h3>
                <ul class="space-y-2">
                  <li v-for="(rec, index) in currentAnalysis.recommendations" :key="index"
                    class="flex items-start gap-2">
                    <span
                      class="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">{{
                        index + 1 }}</span>
                    <span class="text-gray-700">{{ rec }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end">
              <button @click="closeAnalysisModal"
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
