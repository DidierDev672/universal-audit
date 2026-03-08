<template>
    <div class="bg-white rounded-2xl border border-blue-100 shadow-sm p-8 mb-6">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                 <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
            </div>
            <h1 class="text-xl font-bold text-gray-800">Detalle de la investigación</h1>
        </div>
        <!-- Laoding State -->
        <div v-if="loading" class="space-y-4 animate-pulse">
            <div class="h-8 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <!-- Content -->
        <div v-else class="space-y-4">
            <div >
                <h2 class="text-2xl font-bold text-gray-800 mb-3">{{ research?.name }}</h2>
            </div>
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{{ research?.description }}</p>
            </div>
        </div>
    </div>
    <div class="flex gap-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <!-- Boton Editar -->
            <button class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-blue-200 text-blue-600 rounded-xl font-medium hover:bg-blue-50 hover:border-blue-300 transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
                <span>Editar</span>
            </button>
        <!-- Boton de eliminar -->
        <button class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 hover:border-red-300 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
           <span>Eliminar</span>
        </button>
         <!-- Botón IA -->
        <button @click="openAIModal" class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-sm hover:shadow-md">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            <span>Investigar por la IA</span>
        </button>
    </div>

    <!-- Modal IA -->
    <ModalIAResearch 
        v-if="showAIModal" 
        :isOpen="showAIModal"
        :idResearch="research?.id || 0"
        :title="research?.title || ''" 
        :description="research?.description || ''"
        @close="closeAIModal"
    />
</template>
<script setup lang="ts">
    import { ref } from 'vue';
    import { useRoute } from 'vue-router';
    import axios from 'axios';
    import ModalIAResearch from '../../components/research/ModalIAResearch.vue';

    
    const loading = ref(false);
    const research = ref<any>({
        name: '',
        description: ''
    });
    const showAIModal = ref(false);
    const route = useRoute();
    const researchId = route.params.id;
    
    const getResearch = async () => {
        loading.value = true;
        const response = await axios.get(`http://localhost:3000/api/v1/research/${researchId}`);
        research.value = response.data;
        loading.value = false;
    };
    
    const openAIModal = () => {
        showAIModal.value = true;
    };

    const closeAIModal = () => {
        showAIModal.value = false;
    };
    
    getResearch();
</script>