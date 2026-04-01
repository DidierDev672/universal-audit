<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import type { ClinicalPicture, ClinicalPictureChatMessage, ClinicalPictureNote, ClinicalPictureTranscription, ClinicalPictureResource } from '../../types/clinicalPicture';
import { getClinicalPictureById, updateClinicalPicture, addChatMessage, addClinicalNote, deleteClinicalPicture } from '../../services/clinicalPictureService';

const route = useRoute();
const router = useRouter();
const clinicalPicture = ref<ClinicalPicture | null>(null);
const isLoading = ref(false);
const isEditing = ref(false);
const activeTab = ref('overview');

// Estados para modal de respuestas de tamizaje
const showScreeningModal = ref(false);
const isLoadingScreenings = ref(false);
const screeningError = ref('');
const screeningResponses = ref<ScreeningResponse[]>([]);
const selectedScreening = ref<ScreeningResponse | null>(null);
const screeningSearchQuery = ref('');

// Estados para modal de recursos de tamizaje
const showScreeningResourcesModal = ref(false);
const isLoadingScreeningResources = ref(false);
const screeningResourcesError = ref('');
const availableScreeningResponses = ref<ScreeningResponse[]>([]);
const selectedScreeningForResource = ref<ScreeningResponse | null>(null);
const screeningResourceSearchQuery = ref('');

// Formulario de edición
const editForm = ref({
  title: '',
  description: '',
  patientName: '',
  status: 'draft' as 'draft' | 'active' | 'archived' | 'completed'
});

// Nuevas entradas
const newChatMessage = ref('');
const newNote = ref({ title: '', description: '', highlightText: '' });
const newTranscription = ref({ title: '', content: '', audioUrl: '' });
const newResource = ref({ title: '', type: '', url: '', description: '' });

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
  patientName?: string;
  screeningTitle?: string;
}

// Computed para filtrar respuestas
const filteredScreenings = computed(() => {
  if (!screeningSearchQuery.value.trim()) {
    return screeningResponses.value;
  }
  const query = screeningSearchQuery.value.toLowerCase();
  return screeningResponses.value.filter(response =>
    response.id.toLowerCase().includes(query) ||
    response.id_patient.toLowerCase().includes(query) ||
    response.id_screening.toLowerCase().includes(query) ||
    response.patientName?.toLowerCase().includes(query) ||
    response.screeningTitle?.toLowerCase().includes(query)
  );
});

// Computed para filtrar respuestas de recursos
const filteredScreeningResources = computed(() => {
  if (!screeningResourceSearchQuery.value.trim()) {
    return availableScreeningResponses.value;
  }
  const query = screeningResourceSearchQuery.value.toLowerCase();
  return availableScreeningResponses.value.filter(response =>
    response.id.toLowerCase().includes(query) ||
    response.id_patient.toLowerCase().includes(query) ||
    response.id_screening.toLowerCase().includes(query) ||
    response.patientName?.toLowerCase().includes(query) ||
    response.screeningTitle?.toLowerCase().includes(query)
  );
});

// Cargar cuadro clínico
const loadClinicalPicture = async () => {
  const id = route.params.id as string;
  if (!id) {
    router.push('/clinical-pictures');
    return;
  }

  try {
    isLoading.value = true;
    const picture = await getClinicalPictureById(id);
    if (picture) {
      clinicalPicture.value = picture;
      editForm.value = {
        title: picture.title,
        description: picture.description || '',
        patientName: picture.patientName || '',
        status: picture.status
      };
      console.log('✅ Cuadro clínico cargado:', picture.title);
    } else {
      alert('Cuadro clínico no encontrado');
      router.push('/clinical-pictures');
    }
  } catch (error) {
    console.error('Error al cargar cuadro clínico:', error);
    alert('Error al cargar cuadro clínico');
    router.push('/clinical-pictures');
  } finally {
    isLoading.value = false;
  }
};

// Guardar cambios
const saveChanges = async () => {
  if (!clinicalPicture.value) return;

  try {
    await updateClinicalPicture(clinicalPicture.value.id, {
      title: editForm.value.title,
      description: editForm.value.description,
      status: editForm.value.status
    });

    clinicalPicture.value = {
      ...clinicalPicture.value,
      title: editForm.value.title,
      description: editForm.value.description,
      patientName: editForm.value.patientName,
      status: editForm.value.status
    };

    isEditing.value = false;
    console.log('✅ Cambios guardados');
  } catch (error) {
    console.error('Error al guardar:', error);
    alert('Error al guardar cambios');
  }
};

// Agregar mensaje al chat
const addMessage = async () => {
  if (!clinicalPicture.value || !newChatMessage.value.trim()) return;

  try {
    await addChatMessage(clinicalPicture.value.id, {
      role: 'user',
      content: newChatMessage.value,
      metadata: { timestamp: new Date().toISOString() }
    });

    // Recargar para obtener el mensaje actualizado
    await loadClinicalPicture();
    newChatMessage.value = '';
    console.log('✅ Mensaje agregado');
  } catch (error) {
    console.error('Error al agregar mensaje:', error);
    alert('Error al agregar mensaje');
  }
};

// Agregar nota clínica
const addNote = async () => {
  if (!clinicalPicture.value || !newNote.value.title.trim()) return;

  try {
    await addClinicalNote(clinicalPicture.value.id, {
      title: newNote.value.title,
      description: newNote.value.description,
      highlightText: newNote.value.highlightText
    });

    await loadClinicalPicture();
    newNote.value = { title: '', description: '', highlightText: '' };
    console.log('✅ Nota agregada');
  } catch (error) {
    console.error('Error al agregar nota:', error);
    alert('Error al agregar nota');
  }
};

// Volver a la lista
const goBack = () => {
  router.push('/clinical-pictures');
};

// Eliminar cuadro clínico
const deletePicture = async () => {
  if (!clinicalPicture.value) return;
  if (!confirm('¿Estás seguro de eliminar este cuadro clínico? Esta acción no se puede deshacer.')) return;

  try {
    await deleteClinicalPicture(clinicalPicture.value.id);
    console.log('✅ Cuadro clínico eliminado');
    router.push('/clinical-pictures');
  } catch (error) {
    console.error('Error al eliminar:', error);
    alert('Error al eliminar cuadro clínico');
  }
};

// Formatear fecha
const formatDate = (date: string | Date | undefined) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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

// Funciones para modal de recursos de tamizaje
const openScreeningResourcesModal = async () => {
  showScreeningResourcesModal.value = true;
  screeningResourceSearchQuery.value = '';
  selectedScreeningForResource.value = null;
  await loadScreeningResourcesForSelection();
};

const closeScreeningResourcesModal = () => {
  showScreeningResourcesModal.value = false;
  selectedScreeningForResource.value = null;
};

const loadScreeningResourcesForSelection = async () => {
  isLoadingScreeningResources.value = true;
  screeningResourcesError.value = '';

  try {
    const response = await axios.get('http://localhost:3000/api/v1/screening-responses/all', {
      timeout: 30000,
    });
    availableScreeningResponses.value = response.data || [];
  } catch (error: any) {
    let message = 'No se pudo cargar la lista de respuestas.';
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message = 'Error del servidor al obtener respuestas.';
      } else if (error.request) {
        message = 'No se pudo conectar con el servidor.';
      }
    }
    screeningResourcesError.value = message;
    console.error('Error loading screening responses:', error);
  } finally {
    isLoadingScreeningResources.value = false;
  }
};

const selectScreeningForResource = (screening: ScreeningResponse) => {
  selectedScreeningForResource.value = screening;
};

const confirmAddScreeningResource = async () => {
  if (!selectedScreeningForResource.value || !clinicalPicture.value) return;

  try {
    const screening = selectedScreeningForResource.value;
    const optionsText = screening.options_answer
      .map(opt => `${opt.text}: ${opt.value === 1 ? 'Sí' : 'No'}`)
      .join('\n');

    const resourceTitle = `Respuesta Tamizaje: ${screening.screeningTitle || screening.id_screening}`;
    const resourceDescription = `Paciente: ${screening.patientName || screening.id_patient}\nFecha: ${new Date(screening.created_at).toLocaleDateString('es-ES')}\n\nRespuestas:\n${optionsText}`;

    // Importar el servicio de recursos
    const { addResource, addTranscription } = await import('../../services/clinicalPictureService');

    // Agregar como recurso
    await addResource(clinicalPicture.value.id, {
      name: resourceTitle,
      type: 'url',
      url: `/screening-responses/${screening.id}`,
      description: resourceDescription
    });

    // Agregar como transcripción
    await addTranscription(clinicalPicture.value.id, {
      resourceName: `Transcripción - ${resourceTitle}`,
      text: resourceDescription,
      resourceId: Date.now()
    });

    await loadClinicalPicture();
    closeScreeningResourcesModal();
    console.log('✅ Recurso y transcripción de tamizaje agregados');
  } catch (error) {
    console.error('Error al agregar recurso:', error);
    alert('Error al agregar recurso de tamizaje');
  }
};

const formatScreeningResourceDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Funciones para modal de respuestas de tamizaje
const openScreeningModal = async () => {
  showScreeningModal.value = true;
  screeningSearchQuery.value = '';
  selectedScreening.value = null;
  await loadScreeningResponses();
};

const closeScreeningModal = () => {
  showScreeningModal.value = false;
  selectedScreening.value = null;
};

const loadScreeningResponses = async () => {
  isLoadingScreenings.value = true;
  screeningError.value = '';

  try {
    const response = await axios.get('http://localhost:3000/api/v1/screening-responses/all', {
      timeout: 30000,
    });
    screeningResponses.value = response.data || [];
  } catch (error: any) {
    let message = 'No se pudo cargar la lista de respuestas de tamizaje.';
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message = 'Error del servidor al obtener respuestas.';
      } else if (error.request) {
        message = 'No se pudo conectar con el servidor.';
      }
    }
    screeningError.value = message;
    console.error('Error loading screening responses:', error);
  } finally {
    isLoadingScreenings.value = false;
  }
};

const selectScreening = (screening: ScreeningResponse) => {
  selectedScreening.value = screening;
};

const confirmScreeningSelection = async () => {
  if (!selectedScreening.value || !clinicalPicture.value) return;

  try {
    // Agregar la respuesta de tamizaje como una nota clínica
    const screening = selectedScreening.value;
    const optionsText = screening.options_answer
      .map(opt => `${opt.text}: ${opt.value}`)
      .join(', ');

    await addClinicalNote(clinicalPicture.value.id, {
      title: `Tamizaje: ${screening.screeningTitle || screening.id_screening}`,
      description: `ID Paciente: ${screening.id_patient}\nRespuestas: ${optionsText}`,
      highlightText: `ID Respuesta: ${screening.id}`
    });

    await loadClinicalPicture();
    closeScreeningModal();
    console.log('✅ Respuesta de tamizaje vinculada');
  } catch (error) {
    console.error('Error al vincular respuesta:', error);
    alert('Error al vincular respuesta de tamizaje');
  }
};

const formatScreeningDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  loadClinicalPicture();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50" v-if="clinicalPicture">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button @click="goBack"
              class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-2xl font-bold text-gray-900">{{ clinicalPicture.title }}</h1>
                <span :class="['px-3 py-1 rounded-full text-sm font-medium', getStatusColor(clinicalPicture.status)]">
                  {{ getStatusText(clinicalPicture.status) }}
                </span>
              </div>
              <p v-if="clinicalPicture.patientName" class="text-sm text-gray-500">
                Paciente: {{ clinicalPicture.patientName }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button @click="openScreeningModal"
              class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Vincular Tamizaje
            </button>
            <button @click="openScreeningResourcesModal"
              class="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Agregar Recursos
            </button>
            <button @click="isEditing = !isEditing"
              class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {{ isEditing ? 'Cancelar' : 'Editar' }}
            </button>
            <button @click="deletePicture"
              class="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Panel Principal -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Información General -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div v-if="!isEditing">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Información General</h2>
              <div class="space-y-4">
                <div>
                  <label class="text-sm font-medium text-gray-500">Título</label>
                  <p class="text-gray-900">{{ clinicalPicture.title }}</p>
                </div>
                <div v-if="clinicalPicture.patientName">
                  <label class="text-sm font-medium text-gray-500">Paciente</label>
                  <p class="text-gray-900">{{ clinicalPicture.patientName }}</p>
                </div>
                <div v-if="clinicalPicture.description">
                  <label class="text-sm font-medium text-gray-500">Descripción</label>
                  <p class="text-gray-900">{{ clinicalPicture.description }}</p>
                </div>
                <div class="flex gap-4 text-sm text-gray-500">
                  <span>Creado: {{ formatDate(clinicalPicture.createdAt) }}</span>
                  <span>Actualizado: {{ formatDate(clinicalPicture.updatedAt) }}</span>
                </div>
              </div>
            </div>

            <div v-else class="space-y-4">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Editar Información</h2>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input v-model="editForm.title" type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                <input v-model="editForm.patientName" type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea v-model="editForm.description" rows="3"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select v-model="editForm.status"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                  <option value="draft">Borrador</option>
                  <option value="active">Activo</option>
                  <option value="completed">Completado</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>
              <div class="flex justify-end gap-2">
                <button @click="isEditing = false"
                  class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors">
                  Cancelar
                </button>
                <button @click="saveChanges"
                  class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all">
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>

          <!-- Chat -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Chat ({{ clinicalPicture.chat?.messages?.length || 0 }})
            </h2>

            <div v-if="clinicalPicture.chat?.messages?.length" class="space-y-3 max-h-96 overflow-y-auto mb-4">
              <div v-for="message in clinicalPicture.chat.messages" :key="message.id"
                :class="['p-3 rounded-lg', message.role === 'user' ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8']">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-medium"
                    :class="message.role === 'user' ? 'text-blue-600' : 'text-gray-600'">
                    {{ message.role === 'user' ? 'Usuario' : 'Asistente' }}
                  </span>
                  <span class="text-xs text-gray-400">{{ formatDate(message.timestamp) }}</span>
                </div>
                <p class="text-sm text-gray-800">{{ message.content }}</p>
              </div>
            </div>
            <p v-else class="text-gray-500 text-center py-4">No hay mensajes en el chat</p>

            <!-- Agregar mensaje -->
            <div class="flex gap-2 mt-4">
              <input v-model="newChatMessage" type="text" placeholder="Escribe un mensaje..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                @keyup.enter="addMessage" />
              <button @click="addMessage" :disabled="!newChatMessage.trim()"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Notas Clínicas -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Notas Clínicas ({{ clinicalPicture.notes?.length || 0 }})
            </h2>

            <!-- Agregar nota -->
            <div class="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
              <input v-model="newNote.title" type="text" placeholder="Título de la nota..."
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
              <textarea v-model="newNote.description" placeholder="Descripción..." rows="2"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm resize-none" />
              <button @click="addNote" :disabled="!newNote.title.trim()"
                class="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-lg transition-all text-sm font-medium">
                Agregar Nota
              </button>
            </div>

            <div v-if="clinicalPicture.notes?.length" class="space-y-3">
              <div v-for="note in clinicalPicture.notes" :key="note.id"
                class="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <h3 class="font-medium text-gray-900 mb-1">{{ note.title }}</h3>
                <p v-if="note.description" class="text-sm text-gray-600 mb-2">{{ note.description }}</p>
                <p v-if="note.highlightText" class="text-xs text-gray-500 italic bg-yellow-50 p-2 rounded">
                  "{{ note.highlightText }}"
                </p>
                <span class="text-xs text-gray-400">{{ formatDate(note.createdAt) }}</span>
              </div>
            </div>
            <p v-else class="text-gray-500 text-center py-4">No hay notas clínicas</p>
          </div>
        </div>

        <!-- Panel Lateral -->
        <div class="space-y-6">
          <!-- Resumen -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumen</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Mensajes</span>
                <span class="font-medium text-gray-900">{{ clinicalPicture.chat?.messages?.length || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Notas</span>
                <span class="font-medium text-gray-900">{{ clinicalPicture.notes?.length || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Transcripciones</span>
                <span class="font-medium text-gray-900">{{ clinicalPicture.transcriptions?.length || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">Recursos</span>
                <span class="font-medium text-gray-900">{{ clinicalPicture.resources?.length || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Transcripciones -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Transcripciones ({{ clinicalPicture.transcriptions?.length || 0 }})
            </h3>
            <div v-if="clinicalPicture.transcriptions?.length" class="space-y-2">
              <div v-for="trans in clinicalPicture.transcriptions" :key="trans.id" class="p-3 bg-gray-50 rounded-lg">
                <h4 class="font-medium text-sm text-gray-900">{{ trans.resourceName }}</h4>
                <p class="text-xs text-gray-500 mt-1">{{ formatDate(trans.createdAt) }}</p>
              </div>
            </div>
            <p v-else class="text-gray-500 text-sm text-center py-4">No hay transcripciones</p>
          </div>

          <!-- Recursos -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Recursos ({{ clinicalPicture.resources?.length || 0 }})
            </h3>
            <div v-if="clinicalPicture.resources?.length" class="space-y-2">
              <a v-for="resource in clinicalPicture.resources" :key="resource.id" :href="resource.url" target="_blank"
                class="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <h4 class="font-medium text-sm text-gray-900">{{ resource.name }}</h4>
                <p class="text-xs text-gray-500 mt-1">{{ resource.type }} • {{ formatDate(resource.createdAt) }}</p>
              </a>
            </div>
            <p v-else class="text-gray-500 text-sm text-center py-4">No hay recursos</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Respuestas de Tamizaje -->
    <transition name="modal">
      <div v-if="showScreeningModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="closeScreeningModal">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col"
          @click.stop>
          <!-- Header -->
          <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white">Vincular Respuesta de Tamizaje</h3>
                  <p class="text-white/80 text-sm">Selecciona una respuesta para agregar al cuaderno clínico</p>
                </div>
              </div>
              <button @click="closeScreeningModal"
                class="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                aria-label="Cerrar modal">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div class="relative">
              <input v-model="screeningSearchQuery" type="text" placeholder="Buscar por ID, paciente o tamizaje..."
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <!-- Loading -->
            <div v-if="isLoadingScreenings" class="flex flex-col items-center justify-center py-12">
              <svg class="w-12 h-12 text-indigo-600 animate-spin mb-4" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <p class="text-gray-600">Cargando respuestas de tamizaje...</p>
            </div>

            <!-- Error -->
            <div v-else-if="screeningError" class="flex flex-col items-center justify-center py-12 text-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-800 mb-2">Error al cargar</h4>
              <p class="text-gray-600 mb-4">{{ screeningError }}</p>
              <button @click="loadScreeningResponses"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reintentar
              </button>
            </div>

            <!-- Empty -->
            <div v-else-if="filteredScreenings.length === 0"
              class="flex flex-col items-center justify-center py-12 text-center">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-800 mb-2">No se encontraron respuestas</h4>
              <p class="text-gray-600">Intenta con otra búsqueda o verifica que hay respuestas registradas.</p>
            </div>

            <!-- List -->
            <div v-else class="grid grid-cols-1 gap-4">
              <div v-for="screening in filteredScreenings" :key="screening.id" @click="selectScreening(screening)"
                class="p-4 bg-white border-2 rounded-xl cursor-pointer transition-all hover:border-indigo-400 hover:shadow-lg"
                :class="selectedScreening?.id === screening.id ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-200'">
                <div class="flex items-start gap-4">
                  <div
                    class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold shrink-0">
                    {{ screening.id.slice(0, 2).toUpperCase() }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h4 class="font-semibold text-gray-800">Respuesta #{{ screening.id.slice(-6) }}</h4>
                      <span class="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                        {{ screening.options_answer.length }} respuestas
                      </span>
                    </div>
                    <p class="text-sm text-gray-500">
                      <span class="font-medium">Paciente:</span> {{ screening.patientName || screening.id_patient }}
                    </p>
                    <p class="text-sm text-gray-500">
                      <span class="font-medium">Tamizaje:</span> {{ screening.screeningTitle || screening.id_screening
                      }}
                    </p>
                    <p class="text-xs text-gray-400 mt-1">
                      Creado: {{ formatScreeningDate(screening.created_at) }}
                    </p>
                    <!-- Opciones -->
                    <div v-if="screening.options_answer.length > 0" class="mt-3 flex flex-wrap gap-2">
                      <span v-for="opt in screening.options_answer.slice(0, 3)" :key="opt.id"
                        class="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                        {{ opt.text }}: {{ opt.value }}
                      </span>
                      <span v-if="screening.options_answer.length > 3" class="px-2 py-1 text-gray-400 text-xs">
                        +{{ screening.options_answer.length - 3 }} más
                      </span>
                    </div>
                  </div>
                  <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                    :class="selectedScreening?.id === screening.id ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'">
                    <svg v-if="selectedScreening?.id === screening.id" class="w-4 h-4 text-white" fill="none"
                      stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <p class="text-sm text-gray-600">
              <span class="font-semibold">{{ filteredScreenings.length }}</span> respuesta(s) encontrada(s)
            </p>
            <div class="flex gap-3">
              <button @click="closeScreeningModal"
                class="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-all">
                Cancelar
              </button>
              <button @click="confirmScreeningSelection" :disabled="!selectedScreening"
                class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Vincular al Cuaderno
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal de Recursos de Tamizaje -->
    <transition name="modal">
      <div v-if="showScreeningResourcesModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="closeScreeningResourcesModal">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col"
          @click.stop>
          <!-- Header -->
          <div class="bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white">Agregar Recursos de Tamizaje</h3>
                  <p class="text-white/80 text-sm">Selecciona una respuesta para agregar a recursos y transcripciones
                  </p>
                </div>
              </div>
              <button @click="closeScreeningResourcesModal"
                class="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                aria-label="Cerrar modal">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div class="relative">
              <input v-model="screeningResourceSearchQuery" type="text"
                placeholder="Buscar por ID, paciente o tamizaje..."
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <!-- Loading -->
            <div v-if="isLoadingScreeningResources" class="flex flex-col items-center justify-center py-12">
              <svg class="w-12 h-12 text-emerald-600 animate-spin mb-4" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <p class="text-gray-600">Cargando respuestas de tamizaje...</p>
            </div>

            <!-- Error -->
            <div v-else-if="screeningResourcesError"
              class="flex flex-col items-center justify-center py-12 text-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-800 mb-2">Error al cargar</h4>
              <p class="text-gray-600 mb-4">{{ screeningResourcesError }}</p>
              <button @click="loadScreeningResourcesForSelection"
                class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reintentar
              </button>
            </div>

            <!-- Empty -->
            <div v-else-if="filteredScreeningResources.length === 0"
              class="flex flex-col items-center justify-center py-12 text-center">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-800 mb-2">No se encontraron respuestas</h4>
              <p class="text-gray-600">Intenta con otra búsqueda o verifica que hay respuestas registradas.</p>
            </div>

            <!-- List -->
            <div v-else class="grid grid-cols-1 gap-4">
              <div v-for="screening in filteredScreeningResources" :key="screening.id"
                @click="selectScreeningForResource(screening)"
                class="p-4 bg-white border-2 rounded-xl cursor-pointer transition-all hover:border-emerald-400 hover:shadow-lg"
                :class="selectedScreeningForResource?.id === screening.id ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-gray-200'">
                <div class="flex items-start gap-4">
                  <div
                    class="w-12 h-12 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold shrink-0">
                    {{ screening.id.slice(0, 2).toUpperCase() }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h4 class="font-semibold text-gray-800">Respuesta #{{ screening.id.slice(-6) }}</h4>
                      <span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                        {{ screening.options_answer.length }} respuestas
                      </span>
                    </div>
                    <p class="text-sm text-gray-500">
                      <span class="font-medium">Paciente:</span> {{ screening.patientName || screening.id_patient }}
                    </p>
                    <p class="text-sm text-gray-500">
                      <span class="font-medium">Tamizaje:</span> {{ screening.screeningTitle || screening.id_screening
                      }}
                    </p>
                    <p class="text-xs text-gray-400 mt-1">
                      Creado: {{ formatScreeningResourceDate(screening.created_at) }}
                    </p>
                    <!-- Opciones -->
                    <div v-if="screening.options_answer.length > 0" class="mt-3 flex flex-wrap gap-2">
                      <span v-for="opt in screening.options_answer.slice(0, 3)" :key="opt.id"
                        class="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                        {{ opt.text }}: {{ opt.value === 1 ? 'Sí' : 'No' }}
                      </span>
                      <span v-if="screening.options_answer.length > 3" class="px-2 py-1 text-gray-400 text-xs">
                        +{{ screening.options_answer.length - 3 }} más
                      </span>
                    </div>
                  </div>
                  <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                    :class="selectedScreeningForResource?.id === screening.id ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'">
                    <svg v-if="selectedScreeningForResource?.id === screening.id" class="w-4 h-4 text-white" fill="none"
                      stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <p class="text-sm text-gray-600">
              <span class="font-semibold">{{ filteredScreeningResources.length }}</span> respuesta(s) encontrada(s)
            </p>
            <div class="flex gap-3">
              <button @click="closeScreeningResourcesModal"
                class="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-all">
                Cancelar
              </button>
              <button @click="confirmAddScreeningResource" :disabled="!selectedScreeningForResource"
                class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Agregar a Recursos
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
