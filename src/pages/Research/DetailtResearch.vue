<template>
    <div class="bg-white rounded-2xl border border-blue-100 shadow-sm p-8 mb-6">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
            <div>
                <h2 class="text-2xl font-bold text-gray-800 mb-3">{{ research?.name }}</h2>
            </div>
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{{ research?.description }}</p>
            </div>
        </div>
    </div>
    <div class="flex gap-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <!-- Boton Editar -->
        <button
            class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-blue-200 text-blue-600 rounded-xl font-medium hover:bg-blue-50 hover:border-blue-300 transition-all">
            <svg class="w-5 h-5 transition-transform duration-200 group-hover:rotate-12" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Editar</span>
        </button>
        <!-- Boton de eliminar -->
        <button class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-red-200 text-red-600 rounded-xl font-medium
      hover:bg-red-50 hover:border-red-400 hover:text-red-700 hover:shadow-md hover:shadow-red-100 hover:scale-[1.03] hover:-translate-y-0.5
      active:scale-95 active:shadow-none
      transition-all duration-200 ease-out
      group">
            <svg class="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Eliminar</span>
        </button>
        <!-- Botón IA -->
        <button @click="openAIModal" class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium
      hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-200 hover:scale-[1.03] hover:-translate-y-0.5
      active:scale-95 active:shadow-none
      transition-all duration-200 ease-out
      group">
            <svg class="w-5 h-5 transition-transform duration-300 group-hover:rotate-[20deg] group-hover:scale-110"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>Investigar por la IA</span>
        </button>
    </div>

    <!-- Lista de Investigaciones Generadas -->
    <div class="bg-white rounded-2xl border border-blue-100 shadow-sm p-8 mt-6">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <div class="flex-1">
                <h2 class="text-xl font-bold text-gray-800">Investigaciones Generadas</h2>
                <p class="text-sm text-gray-500">Historial de investigaciones creadas por IA</p>
            </div>
            <div class="flex items-center gap-2">
                <button @click="openNotesModal"
                    class="flex items-center gap-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-600 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span class="text-sm">Ver notas</span>
                </button>
                <button @click="getInvestigaciones" :disabled="investigacionesLoading"
                    class="flex items-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 rounded-lg text-indigo-600 transition-all">
                    <svg v-if="!investigacionesLoading" class="w-4 h-4" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span class="text-sm">{{ investigacionesLoading ? 'Cargando...' : 'Actualizar' }}</span>
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="investigacionesLoading" class="space-y-3 animate-pulse">
            <div v-for="n in 3" :key="n" class="h-20 bg-gray-100 rounded-xl"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="investigaciones.length === 0" class="text-center py-8">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            </div>
            <p class="text-gray-500">No hay investigaciones generadas aún</p>
            <p class="text-sm text-gray-400 mt-1">Usa "Investigar por la IA" para crear una</p>
        </div>

        <!-- List -->
        <div v-else class="space-y-3">
            <div v-for="inv in investigaciones" :key="inv.id"
                class="group border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-md font-medium">
                                ID: {{ inv.id_resource }}
                            </span>
                            <span v-if="inv.created_at" class="text-xs text-gray-400">
                                {{ new Date(inv.created_at).toLocaleDateString('es-ES') }}
                            </span>
                        </div>
                        <p class="text-sm text-gray-600 line-clamp-2">{{ stripHtml(inv.content_resource).substring(0,
                            150) }}...</p>
                    </div>
                    <div class="ml-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        @click="viewInvestigacion(inv)">
                        <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </div>
                    <button @click="openAnalysisModal"
                        class="ml-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg transition-colors">
                        Ver detalles
                    </button>
                </div>
            </div>
        </div>
    </div> <!-- Agregado el cierre del div -->
    <!-- Modal IA -->
    <ModalIAResearch v-if="showAIModal" :isOpen="showAIModal" :idResearch="research?.id || 0"
        :title="research?.title || ''" :description="research?.description || ''" @close="closeAIModal" />

    <!-- Modal Ver Investigación -->
    <ViewInvestigacionModal v-if="showViewModal" :isOpen="showViewModal" :investigacion="selectedInvestigacion"
        @close="closeViewModal" />

    <!-- Modal de Notas -->
    <NotesModal v-if="showNotesModal" :isOpen="showNotesModal" :researchId="researchId || ''"
        @close="closeNotesModal" />

    <!-- Modal de Análisis IA -->
    <div v-if="showAnalysisModal" class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeAnalysisModal">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-indigo-500">
                <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 class="text-lg font-semibold text-white">Análisis de IA</h3>
                </div>
                <div class="flex items-center gap-2">
                    <!-- Botón Actualizar -->
                    <button @click="fetchAnalysis" :disabled="isLoadingAnalysis"
                        class="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 disabled:opacity-50 rounded-lg text-white text-sm transition-all">
                        <svg v-if="!isLoadingAnalysis" class="w-4 h-4" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>{{ isLoadingAnalysis ? 'Actualizando...' : 'Actualizar' }}</span>
                    </button>
                    <!-- Botón Cerrar -->
                    <button @click="closeAnalysisModal" class="text-white/80 hover:text-white transition-colors p-1">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
            <!-- Content -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <!-- Estado 1: Cargando -->
                <div v-if="isLoadingAnalysis" class="flex flex-col items-center justify-center py-12">
                    <svg class="w-10 h-10 text-indigo-500 animate-spin mb-4" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <p class="text-gray-500 text-sm">Cargando análisis...</p>
                </div>

                <!-- Estado 2: Error -->
                <div v-else-if="analysisError" class="flex flex-col items-center justify-center py-12 text-center">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p class="text-gray-600 mb-4">{{ analysisError }}</p>
                    <button @click="fetchAnalysis"
                        class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors">
                        Reintentar
                    </button>
                </div>

                <!-- Estado 3: Datos cargados -->
                <div v-else-if="analysisData && analysisData.length > 0" class="space-y-6">
                    <!-- Info del modelo -->
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <span class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md font-medium">
                            {{ analysisData[0]?.analysis?.model || 'IA' }}
                        </span>
                        <span v-if="analysisData[0]?.analysis?.generatedAt">
                            {{ new Date(analysisData[0].analysis.generatedAt).toLocaleString('es-ES') }}
                        </span>
                        <span class="ml-auto text-gray-400">{{ analysisData[0]?.notesCount }} notas analizadas</span>
                    </div>
                    <!-- Resumen con Markdown -->
                    <div class="bg-gray-50 rounded-xl p-4">
                        <h4 class="text-sm font-semibold text-gray-700 mb-2">Resumen del Análisis</h4>
                        <div class="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                            v-html="analysisData[0]?.analysis?.summary ? md.render(analysisData[0].analysis.summary) : '<p>Sin resumen disponible</p>'">
                        </div>
                    </div>
                </div>

                <!-- Estado 4: Sin datos (estado inicial) -->
                <div v-else class="text-center py-12 text-gray-500">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <p>Abre una investigación para ver su análisis.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import ModalIAResearch from '../../components/research/ModalIAResearch.vue';
import ViewInvestigacionModal from '../../components/research/ViewInvestigacionModal.vue';
import NotesModal from '../../components/research/NotesModal.vue';

const loading = ref(false);
const investigacionesLoading = ref(false);
const research = ref<any>({
    name: '',
    description: ''
});
const investigaciones = ref<Array<{
    id: number;
    id_resource: number;
    content_resource: string;
    created_at?: string;
}>>([]);
const showAIModal = ref(false);
const showViewModal = ref(false);
const showNotesModal = ref(false);
const showAnalysisModal = ref(false);
const selectedInvestigacion = ref<{
    id: number;
    id_resource: number;
    content_resource: string;
    created_at?: string;
} | null>(null);

// Datos del análisis de IA (la API devuelve un array)
const analysisData = ref<Array<{
    researchId: string;
    analysis: {
        model: string;
        generatedAt: string;
        summary: string;
    };
    notesCount: number;
    notesReferences: Array<{
        id: string;
        createdAt: string;
    }>;
}> | null>(null);
const isLoadingAnalysis = ref(false);
const analysisError = ref<string | null>(null);

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
});

const route = useRoute();
const researchId = computed(() => {
    const id = route.params.id;
    if (Array.isArray(id)) return id[0];
    return id;
});

// Obtener lista de investigaciones generadas
const getInvestigaciones = async () => {
    const id = researchId.value;
    if (!id) {
        console.error('[getInvestigaciones] researchId is undefined');
        return;
    }
    investigacionesLoading.value = true;
    try {
        const response = await axios.get(`http://localhost:3000/api/v1/investigaciones/${id}`);
        investigaciones.value.push({
            id: response.data.id,
            id_resource: response.data.id_resource,
            content_resource: response.data.content_resource,
            created_at: response.data.created_at
        });
    } catch (error) {
        console.error('Error cargando investigaciones:', error);
        investigaciones.value = [];
    } finally {
        investigacionesLoading.value = false;
    }
};

// Helper para remover HTML
const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

const getResearch = async () => {
    const id = researchId.value;
    if (!id) {
        console.error('[getResearch] researchId is undefined');
        return;
    }
    loading.value = true;
    const response = await axios.get(`http://localhost:3000/api/v1/research/${id}`);
    research.value = response.data;
    loading.value = false;
};

const openAIModal = () => {
    showAIModal.value = true;
};

const closeAIModal = () => {
    showAIModal.value = false;
};

const viewInvestigacion = (inv: typeof investigaciones.value[0]) => {
    selectedInvestigacion.value = inv;
    showViewModal.value = true;
};

const closeViewModal = () => {
    showViewModal.value = false;
    selectedInvestigacion.value = null;
};

const openNotesModal = () => {
    showNotesModal.value = true;
};

const closeNotesModal = () => {
    showNotesModal.value = false;
};

const openAnalysisModal = () => {
    showAnalysisModal.value = true;
};

const fetchAnalysis = async () => {
    const id = researchId.value;
    if (!id) {
        console.error('[fetchAnalysis] researchId is undefined');
        return;
    }
    // 1. Activa el loading al iniciar la petición
    isLoadingAnalysis.value = true;
    analysisError.value = null;

    try {
        // 2. Realiza la petición HTTP
        const response = await axios.get(`http://localhost:3000/api/v1/research-analysis/research/${id}`);

        // 3. Asigna los datos a analysisData
        console.log('[fetchAnalysis] Respuesta API:', response.data);
        analysisData.value = response.data;
        console.log('[fetchAnalysis] analysisData asignado:', analysisData.value);
        // 4. Espera a que Vue actualice el DOM con analysisData
        //    ANTES de desactivar el loading
        await nextTick();

    } catch (error: any) {
        // 5. Si falla, registra el error
        console.error('Error cargando análisis:', error);
        if (error.response?.status === 404) {
            analysisError.value = 'No se encontró análisis para esta investigación.';
            analysisData.value = null;
        } else {
            analysisError.value = 'No se pudo cargar el análisis. Intenta de nuevo.';
        }
    } finally {
        // 6. Desactiva el loading en cualquier caso (éxito o error)
        isLoadingAnalysis.value = false;
    }
};

const closeAnalysisModal = () => {
    showAnalysisModal.value = false;
};

getResearch();
getInvestigaciones();
fetchAnalysis();
</script>