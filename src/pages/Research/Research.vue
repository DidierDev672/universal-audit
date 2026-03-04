<template>
   <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-3xl font-bold mb-1">Investigaciones en Salud Auditiva 📚</h2>
            <p class="text-white/90">Gestiona y consulta estudios científicos</p>
          </div>
        </div>
        <button
          @click="showForm = !showForm"
          class="hidden md:flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          {{ showForm ? 'Ver Lista' : 'Nueva Investigación' }}
        </button>
      </div>
    </div>

    <!-- Mobile Toggle Button -->
    <button
      @click="showForm = !showForm"
      class="md:hidden w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
      </svg>
      {{ showForm ? 'Ver Lista' : 'Nueva Investigación' }}
    </button>

    <!-- Content Toggle -->
    <transition name="fade" mode="out-in">
      <!-- Research Form -->
      <div v-if="showForm" key="form">
        <ResearchForm @research-saved="handleResearchSaved" />
      </div>

      <!-- Research List -->
      <div v-else key="list" class="space-y-6">
        <!-- Search and Filters -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1 relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar investigaciones..."
                class="w-full pl-12 pr-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <select class="px-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all">
              <option>Todas las categorías</option>
              <option>Tinnitus</option>
              <option>Audífonos</option>
              <option>Implantes</option>
              <option>Prevención</option>
            </select>
          </div>
        </div>

        <!-- Research Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="research in filteredResearches"
            :key="research.id"
            class="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-start gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                    {{ research.name }}
                  </h3>
                  <p class="text-xs text-gray-500">{{ research.date }}</p>
                </div>
              </div>
              <span :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                research.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              ]">
                {{ research.status }}
              </span>
            </div>

            <p class="text-sm text-gray-600 mb-4 line-clamp-3">
              {{ research.description }}
            </p>

            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                {{ research.author }}
              </div>
              <button class="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1">
                Ver más
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredResearches.length === 0" class="bg-white rounded-2xl shadow-lg p-12 text-center border border-indigo-100">
          <div class="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">No se encontraron investigaciones</h3>
          <p class="text-gray-600 mb-6">Intenta con otros términos de búsqueda o crea una nueva investigación</p>
          <button
            @click="showForm = true"
            class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Nueva Investigación
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref, computed }  from 'vue';
import Researchform from './Researchform.vue';


// State
const showForm = ref(false);
const searchQuery = ref('');

// Mock data
const researches = ref([
  {
    id: 1,
    name: 'Efectos de la terapia de sonido en pacientes con tinnitus crónico',
    description: 'Estudio longitudinal de 12 meses evaluando la eficacia de diferentes frecuencias de sonido blanco en la reducción de síntomas de tinnitus en pacientes con pérdida auditiva neurosensorial.',
    author: 'Dr. Carlos Mendoza',
    date: '15 Feb 2024',
    status: 'Activo',
    category: 'Tinnitus'
  },
  {
    id: 2,
    name: 'Implantes cocleares en adultos mayores: Calidad de vida post-intervención',
    description: 'Análisis comparativo de mejoras en comprensión del habla y calidad de vida en pacientes mayores de 65 años con implantes cocleares versus audífonos convencionales.',
    author: 'Dra. María González',
    date: '10 Feb 2024',
    status: 'Activo',
    category: 'Implantes'
  },
  {
    id: 3,
    name: 'Prevención de pérdida auditiva inducida por ruido en trabajadores industriales',
    description: 'Programa de intervención y educación para reducir la incidencia de pérdida auditiva en entornos laborales de alta exposición a ruido.',
    author: 'Dr. Juan Pérez',
    date: '05 Feb 2024',
    status: 'Finalizado',
    category: 'Prevención'
  },
]);

// Computed
const filteredResearches = computed(() => {
  if (!searchQuery.value) return researches.value;
  
  const query = searchQuery.value.toLowerCase();
  return researches.value.filter(r =>
    r.name.toLowerCase().includes(query) ||
    r.description.toLowerCase().includes(query) ||
    r.author.toLowerCase().includes(query)
  );
});

// Methods
const handleResearchSaved = () => {
  showForm.value = false;
  // Aquí podrías recargar la lista de investigaciones
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>