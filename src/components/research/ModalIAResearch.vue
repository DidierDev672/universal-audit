<template>
  <!-- Modal Overlay -->
  <transition name="modal">
    <div 
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click="close"
    >
      <!-- Modal Container -->
      <div 
        class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <h1 class="text-xl font-bold text-white">
              Investigar por IA
            </h1>
          </div>
          
          <!-- Botón Cerrar -->
          <!-- <button 
            @click="closeModal"
            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-all text-white"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button> -->
        </div>

        <!-- Modal Content (Scrollable) -->
        <div class="overflow-y-auto max-h-[calc(90vh-80px)] p-8">
          
          <!-- Información de la investigación -->
          <div class="mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
            <h2 class="text-lg font-bold text-gray-800 mb-2">
              {{ props.title }}
            </h2>
            <p class="text-sm text-gray-600 leading-relaxed">
              {{ props.description }}
            </p>
          </div>

          <!-- Respuesta de la IA -->
          <div class="mb-10">
            <AIAnswer :answer="answer"/>
          </div>

          <!-- Formulario de pregunta -->
          <form class="mb-5" @submit.prevent="fetchAnswer">
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div class="p-4">
                <label class="block text-sm font-semibold text-gray-700 mb-3">
                  Tu pregunta para la IA
                </label>
                <textarea 
                  v-model="question" 
                  placeholder="Escribe tu pregunta aquí..."
                  rows="4"
                  class="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all resize-none placeholder:text-gray-400"
                ></textarea>
              </div>
              
              <div class="px-4 pb-4">
                <button 
                  type="submit" 
                  :disabled="isLoading"
                  :class="[
                    'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-sm',
                    isLoading 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:shadow-md'
                  ]"
                >
                  <svg v-if="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <span>{{ isLoading ? 'Enviando...' : 'Enviar Pregunta' }}</span>
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useGetGenerativeModelGP } from '../../shared/service/useGetGenerativeModelGP';



const props  = defineProps<{
    isOpen: boolean;
    onClose: () => void;
    idResearch: number;
    title: string;
    description: string;
}>();

const question = ref(props.title + ' ' + props.description);
const answer = ref('');
const isLoading = ref(false);

const fetchAnswer = async () => {
    answer.value = 'Respuesta de la IA';
    isLoading.value = true;

    try{
        answer.value = await useGetGenerativeModelGP(question.value);
    } catch (error) {
        console.error({error});
    } finally {
        isLoading.value = false;
        question.value = '';
    }
};

const init = async () => {
    const answerResult = await useGetGenerativeModelGP(question.value);
    answer.value = answerResult;
};

init();

const close = () => {
    props.onClose();
};
</script>