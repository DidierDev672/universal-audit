<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { ClinicalPicture } from '../../types/clinicalPicture';
import { listClinicalPictures, deleteClinicalPicture } from '../../services/clinicalPictureService';

const router = useRouter();
const clinicalPictures = ref<ClinicalPicture[]>([]);
const isLoading = ref(false);
const searchQuery = ref('');
const statusFilter = ref('all');

// Cargar cuadros clínicos
const loadClinicalPictures = async () => {
  try {
    isLoading.value = true;
    const response = await listClinicalPictures();
    clinicalPictures.value = response.data;
    console.log(`✅ ${response.data.length} cuadros clínicos cargados`);
  } catch (error) {
    console.error('Error al cargar cuadros clínicos:', error);
    alert('Error al cargar cuadros clínicos');
  } finally {
    isLoading.value = false;
  }
};

// Filtrar cuadros clínicos
const filteredPictures = computed(() => {
  let filtered = clinicalPictures.value;
  
  // Filtrar por estado
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(p => p.status === statusFilter.value);
  }
  
  // Filtrar por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.patientName?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    );
  }
  
  return filtered.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
});

// Navegar a detalle
const viewDetail = (id: string) => {
  router.push(`/clinical-picture/${id}`);
};

// Crear nuevo cuadro clínico
const createNew = () => {
  router.push('/notebook');
};

// Eliminar cuadro clínico
const deletePicture = async (id: string) => {
  if (!confirm('¿Estás seguro de eliminar este cuadro clínico?')) return;
  
  try {
    await deleteClinicalPicture(id);
    clinicalPictures.value = clinicalPictures.value.filter(p => p.id !== id);
    console.log('✅ Cuadro clínico eliminado');
  } catch (error) {
    console.error('Error al eliminar:', error);
    alert('Error al eliminar cuadro clínico');
  }
};

// Formatear fecha
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Obtener color según estado
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    archived: 'bg-yellow-100 text-yellow-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

// Obtener texto según estado
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    draft: 'Borrador',
    active: 'Activo',
    completed: 'Completado',
    archived: 'Archivado'
  };
  return texts[status] || status;
};

onMounted(() => {
  loadClinicalPictures();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-emerald-100 rounded-xl">
              <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Cuadros Clínicos</h1>
              <p class="text-sm text-gray-500">Gestiona todos los cuadros clínicos de tus pacientes</p>
            </div>
          </div>
          <button
            @click="createNew"
            class="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nuevo Cuadro Clínico
          </button>
        </div>
      </div>
    </div>

    <!-- Filtros y Búsqueda -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Búsqueda -->
          <div class="flex-1 relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por título, paciente o descripción..."
              class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
          
          <!-- Filtro de estado -->
          <select
            v-model="statusFilter"
            class="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
          >
            <option value="all">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="active">Activo</option>
            <option value="completed">Completado</option>
            <option value="archived">Archivado</option>
          </select>
        </div>
      </div>

      <!-- Lista de Cuadros Clínicos -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <svg class="animate-spin w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      </div>

      <div v-else-if="filteredPictures.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No hay cuadros clínicos</h3>
        <p class="text-gray-500 mb-4">Comienza creando tu primer cuadro clínico</p>
        <button
          @click="createNew"
          class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all"
        >
          Crear Cuadro Clínico
        </button>
      </div>

      <div v-else class="grid gap-4">
        <div
          v-for="picture in filteredPictures"
          :key="picture.id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
          @click="viewDetail(picture.id)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {{ picture.title }}
                </h3>
                <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusColor(picture.status)]">
                  {{ getStatusText(picture.status) }}
                </span>
              </div>
              
              <p v-if="picture.patientName" class="text-sm text-gray-600 mb-2">
                <span class="font-medium">Paciente:</span> {{ picture.patientName }}
              </p>
              
              <p v-if="picture.description" class="text-sm text-gray-500 line-clamp-2 mb-3">
                {{ picture.description }}
              </p>
              
              <div class="flex items-center gap-4 text-xs text-gray-400">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  {{ formatDate(picture.createdAt) }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                  </svg>
                  {{ picture.chat?.messages?.length || 0 }} mensajes
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  {{ picture.notes?.length || 0 }} notas
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                  </svg>
                  {{ picture.transcriptions?.length || 0 }} transcripciones
                </span>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <button
                @click.stop="viewDetail(picture.id)"
                class="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                title="Ver detalle"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
              <button
                @click.stop="deletePicture(picture.id)"
                class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Eliminar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
