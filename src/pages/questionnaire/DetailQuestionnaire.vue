<template>
    <div class="container mx-auto px-4 py-8">
    <aside class="w-full max-w-4xl mx-auto bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
      
      <!-- Header -->
      <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-white">Detalles del Cuestionario</h2>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-4 animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          <div class="h-32 bg-gray-200 rounded"></div>
        </div>

        <!-- Questionnaire Details -->
        <div v-else-if="questionnaire" class="space-y-6">
          
          <!-- Información General -->
          <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
            <div class="space-y-3">
              <div>
                <p class="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Nombre</p>
                <p class="text-base font-bold text-gray-800">{{ questionnaire.title ?? questionnaire.name }}</p>
              </div>
              
              <div>
                <p class="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Descripción</p>
                <p class="text-sm text-gray-700 leading-relaxed">{{ questionnaire.description ?? questionnaire.description }}</p>
              </div>
              
              <div class="flex items-center gap-2 pt-2">
                <div class="px-3 py-1 bg-indigo-500 text-white rounded-lg text-xs font-semibold">
                  {{ questionnaire.questions?.length }} pregunta{{ questionnaire.questions?.length !== 1 ? 's' : '' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Preguntas -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Preguntas del Cuestionario
            </h3>

            <div 
              v-for="(question, index) in questionnaire.questions" 
              :key="question.id"
              class="bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-indigo-200 transition-all"
            >
              <!-- Pregunta -->
              <div class="mb-4">
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span class="text-sm font-bold text-indigo-600">{{ index + 1 }}</span>
                  </div>
                  <div class="flex-1">
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Pregunta</p>
                    <p class="text-base font-semibold text-gray-800">{{ question?.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Opciones -->
              <div class="ml-11 space-y-2">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Opciones de Respuesta</p>
                <div 
                  v-for="(option, optIndex) in question.optionsAnswer" 
                  :key="option.id"
                  class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <div class="w-6 h-6 bg-white border-2 border-indigo-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-xs font-bold text-indigo-600">{{ String.fromCharCode(65 + optIndex) }}</span>
                  </div>
                  <p class="text-sm text-gray-700">{{ option?.text }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <p class="text-gray-500 font-medium">No hay cuestionario disponible</p>
        </div>

      </div>
    </aside>
  </div>
</template>
<script setup lang="ts">
    import { ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { watch } from 'vue';
    import axios from 'axios';

const route = useRoute();
const isLoading = ref(false);
const questionnaire = ref(null);


const fetchQuestionnaire = async (id: string) => {
    isLoading.value = true;
    try {
        const response = await axios.get(`http://localhost:3000/api/v1/questionnaires/${id}`);
        questionnaire.value = response.data;
        console.log('Questionnaire data:', response.data);
    } catch (error) {
        console.error('Error fetching questionnaire:', error);
    } finally {
        isLoading.value = false;
    }
};

watch(() => route.params.id, (newId) => {
    console.log('ID changed:', newId);
    
    // Fetch questionnaire data
    fetchQuestionnaire(newId as string);
});

// Fetch questionnaire on mount
fetchQuestionnaire(route.params.id as string);
</script>