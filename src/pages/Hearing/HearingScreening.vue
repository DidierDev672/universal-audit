<template>
   <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
            </svg>
          </div>
          <div>
            <h2 class="text-3xl font-bold mb-1">Tamizajes Auditivos 🔬</h2>
            <p class="text-white/90">Evaluaciones de identificación de sonidos</p>
          </div>
        </div>
        <button
          @click="showForm = !showForm"
          class="hidden md:flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          {{ showForm ? 'Ver Lista' : 'Crear Tamizaje' }}
        </button>
      </div>
    </div>

    <!-- Mobile Toggle -->
    <button
      @click="showForm = !showForm"
      class="md:hidden w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
      </svg>
      {{ showForm ? 'Ver Lista' : 'Crear Tamizaje' }}
    </button>

    <!-- Content Toggle -->
    <transition name="fade" mode="out-in">
      <!-- Screening Form -->
      <div v-if="showForm" key="form">
        <HearingScreeningForm @screening-saved="handleScreeningSaved" />
      </div>

      <!-- Screening List -->
      <div v-else key="list" class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-1">Total Tamizajes</p>
            <p class="text-3xl font-bold text-gray-800">{{ screenings.length }}</p>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-1">Evaluaciones</p>
            <p class="text-3xl font-bold text-gray-800">342</p>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-1">Tasa de Acierto</p>
            <p class="text-3xl font-bold text-gray-800">87%</p>
          </div>
        </div>

        <!-- Search -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar tamizajes..."
              class="w-full pl-12 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>

        <!-- Screening Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="screening in filteredScreenings"
            :key="screening.id"
            class="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all cursor-pointer group"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-start gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {{ screening.category }}
                  </h3>
                  <p class="text-xs text-gray-500 mt-1">{{ screening.options }} opciones</p>
                </div>
              </div>
              <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                {{ screening.type }}
              </span>
            </div>

            <p class="text-sm text-gray-600 mb-4">
              {{ screening.description }}
            </p>

            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div class="flex items-center gap-4 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ screening.completed }} evaluaciones
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                  {{ screening.accuracy }}% acierto
                </span>
              </div>
              <button class="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                Ver detalles
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredScreenings.length === 0" class="bg-white rounded-2xl shadow-lg p-12 text-center border border-blue-100">
          <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">No se encontraron tamizajes</h3>
          <p class="text-gray-600 mb-6">Crea tu primer tamizaje auditivo</p>
          <button
            @click="showForm = true"
            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Crear Tamizaje
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import HearingScreeningForm from './HearingScreeningForm.vue';

// State
const showForm = ref(false);
const searchQuery = ref('');

// Mock data
const screenings = ref([
  {
    id: 1,
    category: 'Tonos Graves (125-500 Hz)',
    description: 'Evaluación de percepción de tonos de baja frecuencia',
    options: 4,
    type: 'Frecuencias',
    completed: 87,
    accuracy: 92,
  },
  {
    id: 2,
    category: 'Tonos Agudos (2000-8000 Hz)',
    description: 'Evaluación de percepción de tonos de alta frecuencia',
    options: 4,
    type: 'Frecuencias',
    completed: 76,
    accuracy: 85,
  },
  {
    id: 3,
    category: 'Identificación de Palabras Monosilábicas',
    description: 'Discriminación de palabras simples en ambiente silencioso',
    options: 5,
    type: 'Palabras',
    completed: 92,
    accuracy: 88,
  },
  {
    id: 4,
    category: 'Ruidos Ambientales',
    description: 'Identificación de sonidos cotidianos (timbre, teléfono, alarma)',
    options: 6,
    type: 'Ambiente',
    completed: 64,
    accuracy: 91,
  },
]);

// Computed
const filteredScreenings = computed(() => {
  if (!searchQuery.value) return screenings.value;
  
  const query = searchQuery.value.toLowerCase();
  return screenings.value.filter(s =>
    s.category.toLowerCase().includes(query) ||
    s.description.toLowerCase().includes(query) ||
    s.type.toLowerCase().includes(query)
  );
});

// Methods
const handleScreeningSaved = () => {
  showForm.value = false;
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>