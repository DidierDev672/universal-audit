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
        <!-- Info Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-1">Total Cuestionarios</p>
            <p class="text-3xl font-bold text-gray-800">{{ questionnaires.length }}</p>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-1">Activos</p>
            <p class="text-3xl font-bold text-gray-800">3</p>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-1">Respuestas</p>
            <p class="text-3xl font-bold text-gray-800">127</p>
          </div>
        </div>

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
            class="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all cursor-pointer group"
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
                  <p class="text-xs text-gray-500 mt-1">{{ questionnaire.questions }} preguntas</p>
                </div>
              </div>
              <span :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                questionnaire.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              ]">
                {{ questionnaire.active ? 'Activo' : 'Inactivo' }}
              </span>
            </div>

            <p class="text-sm text-gray-600 mb-4 line-clamp-2">
              {{ questionnaire.description }}
            </p>

            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div class="flex items-center gap-4 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ questionnaire.duration }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  {{ questionnaire.responses }} respuestas
                </span>
              </div>
              <button class="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1">
                Ver detalles
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

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
import TinnutusQuestionnaireForm from './TinnitusQuestionnaireForm.vue';


const showBuilder = ref(false);
const searchQuery = ref('');


const questionnaires= ref([
   {
    id: 1,
    title: 'Evaluación de Severidad de Tinnitus (TSS)',
    description: 'Cuestionario estandarizado para medir la intensidad y el impacto del tinnitus en la vida diaria del paciente.',
    questions: 12,
    duration: '5-7 min',
    responses: 45,
    active: true,
  },
  {
    id: 2,
    title: 'Cuestionario de Impacto Emocional del Tinnitus',
    description: 'Evaluación del efecto emocional y psicológico del tinnitus, incluyendo ansiedad, depresión y calidad del sueño.',
    questions: 15,
    duration: '8-10 min',
    responses: 38,
    active: true,
  },
  {
    id: 3,
    title: 'Frecuencia y Características del Tinnitus',
    description: 'Registro detallado de la frecuencia, tipo de sonido, volumen percibido y momentos del día en que se presenta el tinnitus.',
    questions: 8,
    duration: '3-5 min',
    responses: 44,
    active: true,
  },
]);

const filteredQuestionnaires = computed(() => {
  if(!searchQuery.value) return questionnaires.value;

  const query = searchQuery.value.toLocaleLowerCase();
  return questionnaires.value.filter(q =>
    q.title.toLocaleLowerCase().includes(query) ||
    q.description.toLocaleLowerCase().includes(query)
  );
});

const handleQuestionnaireSaved = () => {
  showBuilder.value = false;
};
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