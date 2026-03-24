<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { ClinicalPicture, ClinicalPictureChatMessage, ClinicalPictureNote, ClinicalPictureTranscription, ClinicalPictureResource } from '../../types/clinicalPicture';
import { getClinicalPictureById, updateClinicalPicture, addChatMessage, addClinicalNote, deleteClinicalPicture } from '../../services/clinicalPictureService';

const route = useRoute();
const router = useRouter();
const clinicalPicture = ref<ClinicalPicture | null>(null);
const isLoading = ref(false);
const isEditing = ref(false);
const activeTab = ref('overview'); // overview, chat, notes, transcriptions, resources

// Formulario de edición
const editForm = ref({
  title: '',
  description: '',
  patientName: '',
  status: 'draft' as const
});

// Nuevas entradas
const newChatMessage = ref('');
const newNote = ref({ title: '', description: '', highlightText: '' });
const newTranscription = ref({ title: '', content: '', audioUrl: '' });
const newResource = ref({ title: '', type: '', url: '', description: '' });

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
      patientName: editForm.value.patientName,
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
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
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
            <button
              @click="goBack"
              class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
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
            <button
              @click="isEditing = !isEditing"
              class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              {{ isEditing ? 'Cancelar' : 'Editar' }}
            </button>
            <button
              @click="deletePicture"
              class="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
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
                <input
                  v-model="editForm.title"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                <input
                  v-model="editForm.patientName"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  v-model="editForm.description"
                  rows="3"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  v-model="editForm.status"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  <option value="draft">Borrador</option>
                  <option value="active">Activo</option>
                  <option value="completed">Completado</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>
              <div class="flex justify-end gap-2">
                <button
                  @click="isEditing = false"
                  class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  @click="saveChanges"
                  class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>

          <!-- Chat -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
              Chat ({{ clinicalPicture.chat?.messages?.length || 0 }})
            </h2>
            
            <div v-if="clinicalPicture.chat?.messages?.length" class="space-y-3 max-h-96 overflow-y-auto mb-4">
              <div
                v-for="message in clinicalPicture.chat.messages"
                :key="message.id"
                :class="['p-3 rounded-lg', message.role === 'user' ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8']"
              >
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-medium" :class="message.role === 'user' ? 'text-blue-600' : 'text-gray-600'">
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
              <input
                v-model="newChatMessage"
                type="text"
                placeholder="Escribe un mensaje..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                @keyup.enter="addMessage"
              />
              <button
                @click="addMessage"
                :disabled="!newChatMessage.trim()"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-all"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Notas Clínicas -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Notas Clínicas ({{ clinicalPicture.notes?.length || 0 }})
            </h2>
            
            <!-- Agregar nota -->
            <div class="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
              <input
                v-model="newNote.title"
                type="text"
                placeholder="Título de la nota..."
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
              />
              <textarea
                v-model="newNote.description"
                placeholder="Descripción..."
                rows="2"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm resize-none"
              />
              <button
                @click="addNote"
                :disabled="!newNote.title.trim()"
                class="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-lg transition-all text-sm font-medium"
              >
                Agregar Nota
              </button>
            </div>
            
            <div v-if="clinicalPicture.notes?.length" class="space-y-3">
              <div
                v-for="note in clinicalPicture.notes"
                :key="note.id"
                class="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
              </svg>
              Transcripciones ({{ clinicalPicture.transcriptions?.length || 0 }})
            </h3>
            <div v-if="clinicalPicture.transcriptions?.length" class="space-y-2">
              <div
                v-for="trans in clinicalPicture.transcriptions"
                :key="trans.id"
                class="p-3 bg-gray-50 rounded-lg"
              >
                <h4 class="font-medium text-sm text-gray-900">{{ trans.title }}</h4>
                <p class="text-xs text-gray-500 mt-1">{{ formatDate(trans.createdAt) }}</p>
              </div>
            </div>
            <p v-else class="text-gray-500 text-sm text-center py-4">No hay transcripciones</p>
          </div>

          <!-- Recursos -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
              </svg>
              Recursos ({{ clinicalPicture.resources?.length || 0 }})
            </h3>
            <div v-if="clinicalPicture.resources?.length" class="space-y-2">
              <a
                v-for="resource in clinicalPicture.resources"
                :key="resource.id"
                :href="resource.url"
                target="_blank"
                class="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h4 class="font-medium text-sm text-gray-900">{{ resource.title }}</h4>
                <p class="text-xs text-gray-500 mt-1">{{ resource.type }} • {{ formatDate(resource.createdAt) }}</p>
              </a>
            </div>
            <p v-else class="text-gray-500 text-sm text-center py-4">No hay recursos</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
