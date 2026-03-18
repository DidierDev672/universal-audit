<template>
    <div class="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    
    <!-- Sidebar Izquierdo - Recursos -->
    <aside class="w-80 bg-white border-r border-blue-100 flex flex-col shadow-lg">
      <!-- Header del Sidebar -->
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <h2 class="text-xl font-bold mb-2 flex items-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Recursos
        </h2>
        <p class="text-white/80 text-sm">Documentos y archivos</p>
      </div>
 
      <!-- Botón Agregar Recurso -->
      <div class="p-4 border-b border-gray-200">
        <button
          @click="showAddResourceModal = true"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Agregar Recurso
        </button>
      </div>
 
      <!-- Lista de Recursos -->
      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        <div v-if="resources.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <p class="text-sm text-gray-500">No hay recursos agregados</p>
        </div>
 
        <!-- Resource Card -->
        <div
          v-for="resource in resources"
          :key="resource.id"
          :class="[
            'group bg-white border-2 rounded-xl p-4 transition-all cursor-pointer',
            selectedResources.includes(resource.id)
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-200 hover:border-indigo-300'
          ]"
          @click="toggleResourceSelection(resource.id)"
        >
          <div class="flex items-start gap-3">
            <!-- Checkbox -->
            <div class="mt-1">
              <div :class="[
                'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                selectedResources.includes(resource.id)
                  ? 'border-indigo-600 bg-indigo-600'
                  : 'border-gray-300 group-hover:border-indigo-400'
              ]">
                <svg v-if="selectedResources.includes(resource.id)" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
 
            <!-- Resource Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start gap-2 mb-1">
                <div :class="[
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                  getResourceColor(resource.type).bg
                ]">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-semibold text-gray-800 truncate">
                    {{ resource.name }}
                  </h3>
                  <p class="text-xs text-gray-500">{{ resource.type }}</p>
                </div>
              </div>
              
              <p class="text-xs text-gray-600 line-clamp-2 mb-2">
                {{ resource.description }}
              </p>
 
              <div class="flex items-center justify-between text-xs text-gray-400">
                <span>{{ formatDate(resource.createdAt) }}</span>
                <button
                  @click.stop="deleteResource(resource.id)"
                  class="text-red-500 hover:text-red-700 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      <!-- Footer del Sidebar -->
      <div class="p-4 border-t border-gray-200 bg-gray-50">
        <div class="text-xs text-gray-600 flex items-center justify-between">
          <span>{{ resources.length }} recursos</span>
          <span>{{ selectedResources.length }} seleccionados</span>
        </div>
      </div>
    </aside>
 
    <!-- Panel Central - Chat -->
    <main class="flex-1 flex flex-col">
      <!-- Resumen de Recursos Seleccionados -->
      <div class="bg-white border-b border-blue-100 shadow-sm">
        <div class="p-6">
          <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
            Contexto de Conversación
          </h2>
 
          <div v-if="selectedResources.length === 0" class="bg-gray-50 rounded-xl p-6 text-center border-2 border-dashed border-gray-200">
            <p class="text-sm text-gray-500">No hay recursos seleccionados. Selecciona recursos del panel izquierdo para comenzar.</p>
          </div>
 
          <div v-else class="flex flex-wrap gap-2">
            <div
              v-for="resourceId in selectedResources"
              :key="resourceId"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2',
                getResourceColor(getResourceById(resourceId)?.type).badge
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              {{ getResourceById(resourceId)?.name }}
              <button
                @click="toggleResourceSelection(resourceId)"
                class="ml-1 hover:bg-white/30 rounded-full p-0.5"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
 
      <!-- Área de Chat -->
      <div class="flex-1 overflow-y-auto p-6 space-y-4">
        <!-- Mensaje de bienvenida -->
        <div v-if="messages.length === 0" class="flex items-center justify-center h-full">
          <div class="text-center max-w-md">
            <div class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Asistente de Recursos</h3>
            <p class="text-gray-600 mb-6">Selecciona recursos y pregunta cualquier cosa sobre ellos</p>
            <div class="bg-indigo-50 rounded-xl p-4 text-left">
              <p class="text-sm font-semibold text-indigo-900 mb-2">Ejemplos de preguntas:</p>
              <ul class="text-sm text-indigo-700 space-y-1">
                <li>• ¿Qué dicen estos documentos sobre tinnitus?</li>
                <li>• Resume los puntos principales</li>
                <li>• ¿Hay información sobre tratamientos?</li>
              </ul>
            </div>
          </div>
        </div>
 
        <!-- Mensajes del Chat -->
        <div
          v-for="message in messages"
          :key="message.id"
          :class="[
            'flex',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          ]"
        >
          <div :class="[
            'max-w-3xl rounded-2xl px-6 py-4',
            message.role === 'user'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
              : 'bg-white border border-gray-200 text-gray-800'
          ]">
            <div class="flex items-start gap-3">
              <div v-if="message.role === 'assistant'" class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              
              <div class="flex-1">
                <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
                
                <!-- Recursos citados -->
                <div v-if="message.resources && message.resources.length > 0" class="mt-3 pt-3 border-t border-white/20">
                  <p class="text-xs opacity-70 mb-2">Basado en:</p>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="resourceId in message.resources"
                      :key="resourceId"
                      class="text-xs px-2 py-1 bg-white/20 rounded-lg"
                    >
                      {{ getResourceById(resourceId)?.name }}
                    </span>
                  </div>
                </div>
              </div>
 
              <div v-if="message.role === 'user'" class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
 
        <!-- Loading indicator -->
        <div v-if="isThinking" class="flex justify-start">
          <div class="max-w-3xl bg-white border border-gray-200 rounded-2xl px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </div>
              <p class="text-sm text-gray-600">Analizando recursos...</p>
            </div>
          </div>
        </div>
 
        <div ref="messagesEnd"></div>
      </div>
 
      <!-- Input de Chat -->
      <div class="border-t border-gray-200 bg-white p-6">
        <form @submit.prevent="sendMessage" class="flex gap-3">
          <input
            v-model="userInput"
            type="text"
            placeholder="Pregunta sobre los recursos seleccionados..."
            :disabled="selectedResources.length === 0 || isThinking"
            class="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            :disabled="!userInput.trim() || selectedResources.length === 0 || isThinking"
            class="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </form>
        <p class="text-xs text-gray-500 mt-2">
          {{ selectedResources.length > 0
            ? `Consultando ${selectedResources.length} recurso(s) seleccionado(s)`
            : 'Selecciona al menos un recurso para comenzar' }}
        </p>
      </div>
    </main>
 
    <!-- Modal Agregar Recurso -->
    <transition name="modal">
      <div v-if="showAddResourceModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="showAddResourceModal = false">
        <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl" @click.stop>
          <h3 class="text-2xl font-bold text-gray-800 mb-6">Agregar Recurso</h3>
          
          <form @submit.prevent="addResource" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
              <input
                v-model="newResource.name"
                type="text"
                required
                placeholder="Ej: Estudio sobre Tinnitus 2024"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
              />
            </div>
 
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
              <select
                v-model="newResource.type"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
              >
                <option value="PDF">📄 PDF</option>
                <option value="DOC">📝 Documento Word</option>
                <option value="XLS">📊 Excel</option>
                <option value="TXT">📄 Texto</option>
                <option value="URL">🔗 Enlace</option>
              </select>
            </div>

            <!-- Campo para URL -->
            <div v-if="newResource.type === 'URL'">
              <label class="block text-sm font-semibold text-gray-700 mb-2">URL</label>
              <input
                v-model="newResource.url"
                type="url"
                placeholder="https://ejemplo.com/recurso"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
              />
            </div>

            <!-- Campo para archivo -->
            <div v-if="newResource.type !== 'URL'">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Archivo</label>
              <input
                type="file"
                @change="handleFileUpload"
                :accept="getFileAcceptType()"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <p v-if="newResource.fileName" class="text-xs text-gray-600 mt-2">
                Archivo seleccionado: {{ newResource.fileName }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
              <textarea
                v-model="newResource.description"
                rows="3"
                placeholder="Breve descripción del contenido..."
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 resize-none"
              ></textarea>
            </div>
 
            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="showAddResourceModal = false"
                class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
              >
                Agregar
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';
import {GoogleGenAI} from '@google/genai';
import { resourceService, localStorageService, type ResourceDB } from '../../services/supabase';

interface Resource {
  id: string | number;
  name: string;
  type: string;
  description: string;
  url?: string;
  fileName?: string;
  createdAt: string;
}

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  resources?: (string | number)[];
}

const resources = ref<Resource[]>([]);
const selectedResources = ref<(string | number)[]>([]);
const messages = ref<Message[]>([]);
const userInput = ref('');
const isThinking = ref(false);
const showAddResourceModal = ref(false);
const messagesEnd = ref<HTMLElement | null>(null);

const newResource = ref({
  name: '',
  type: '',
  description: '',
  url: '',
  fileName: '',
});

let resourceIdCounter = 1;
let messageIdCounter = 1;

// Methods
const addResource = async () => {
  try {
    // Guardar en Supabase
    const savedResource = await resourceService.saveResource({
      name: newResource.value.name,
      type: newResource.value.type,
      description: newResource.value.description,
      url: newResource.value.url,
      fileName: newResource.value.fileName
    });

    // Agregar al estado local
    const resourceToAdd: Resource = {
      id: savedResource.id || resourceIdCounter++,
      name: savedResource.name,
      type: savedResource.type,
      description: savedResource.description,
      url: savedResource.url,
      fileName: savedResource.fileName,
      createdAt: savedResource.created_at || new Date().toISOString()
    };

    resources.value.push(resourceToAdd);

    // Guardar en localStorage como backup
    localStorageService.saveResources(resources.value);

    // Reset form
    newResource.value = {
      name: '',
      type: 'PDF',
      description: '',
      url: '',
      fileName: '',
    };

    showAddResourceModal.value = false;
  } catch (error) {
    console.error('Error saving resource:', error);
    
    // Fallback: guardar solo en localStorage
    const resourceToAdd: Resource = {
      id: resourceIdCounter++,
      name: newResource.value.name,
      type: newResource.value.type,
      description: newResource.value.description,
      url: newResource.value.url,
      fileName: newResource.value.fileName,
      createdAt: new Date().toISOString()
    };

    resources.value.push(resourceToAdd);
    localStorageService.saveResources(resources.value);

    newResource.value = {
      name: '',
      type: 'PDF',
      description: '',
      url: '',
      fileName: '',
    };

    showAddResourceModal.value = false;
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    newResource.value.fileName = file.name;
  }
}

const getFileAcceptType = () => {
  switch (newResource.value.type) {
    case 'PDF':
      return '.pdf';
    case 'DOC':
      return '.doc,.docx';
    case 'XLS':
      return '.xls,.xlsx';
    case 'TXT':
      return '.txt';
    default:
      return '*';
  }
};

const deleteResource = async (id: string | number) => {
  try {
    // Eliminar de Supabase si es un ID string (UUID)
    if (typeof id === 'string') {
      await resourceService.deleteResource(id);
    }
    
    // Eliminar del estado local
    resources.value = resources.value.filter(r => r.id !== id);
    selectedResources.value = selectedResources.value.filter(rid => rid !== id);
    
    // Actualizar localStorage
    localStorageService.saveResources(resources.value);
  } catch (error) {
    console.error('Error deleting resource:', error);
    
    // Fallback: eliminar solo del estado local y localStorage
    resources.value = resources.value.filter(r => r.id !== id);
    selectedResources.value = selectedResources.value.filter(rid => rid !== id);
    localStorageService.saveResources(resources.value);
  }
};

// ... 
const toggleResourceSelection = (id: string | number) => {
  const index  = selectedResources.value.indexOf(id);
  if(index > -1){
    selectedResources.value.splice(index, 1);
  }else {
    selectedResources.value.push(id);
  }
};

const getResourceById = (id: string | number) => {
  return resources.value.find(r => r.id === id);
}

const getResourceColor = (type?: string) => {
  const colors = {
    'PDF': { bg: 'bg-red-500', badge: 'bg-red-100 text-red-700' },
    'DOC': { bg: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700' },
    'TXT': { bg: 'bg-gray-500', badge: 'bg-gray-100 text-gray-700' },
    'URL': { bg: 'bg-green-500', badge: 'bg-green-100 text-green-700' },
  };

  return colors[type as keyof typeof colors] || colors.PDF;
};

const formatDate = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = (now.getTime() - dateObj.getTime()) / 1000;
  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(diff / 3600);
  const days = Math.floor(diff / 86400);


  if (minutes < 1) return 'Ahora';
  if(minutes < 60) return `Hace ${minutes}m`;
  if(hours < 24) return `Hace ${hours}h`;

  return `Hace ${days}d`;
}

// Cargar recursos al iniciar
onMounted(async () => {
  try {
    // Intentar cargar desde Supabase
    const supabaseResources = await resourceService.getResources();
    
    if (supabaseResources && supabaseResources.length > 0) {
      // Convertir recursos de Supabase al formato local
      resources.value = supabaseResources.map(resource => ({
        id: resource.id!,
        name: resource.name,
        type: resource.type,
        description: resource.description,
        url: resource.url,
        fileName: resource.fileName,
        createdAt: resource.created_at || new Date().toISOString()
      }));
    } else {
      // Fallback: cargar desde localStorage
      resources.value = localStorageService.loadResources();
    }
  } catch (error) {
    console.error('Error loading resources from Supabase:', error);
    // Fallback: cargar desde localStorage
    resources.value = localStorageService.loadResources();
  }
});

// Extraer contenido de recursos para Gemini
const extractResourceContent = async (resource: Resource) => {
  try {
    if (resource.url) {
      // Para URLs, intentar extraer contenido básico
      if (resource.url.includes('pdf')) {
        return `[PDF Document] ${resource.name}\n${resource.description}\nURL: ${resource.url}`;
      } else if (resource.url.includes('doc') || resource.url.includes('docx')) {
        return `[Word Document] ${resource.name}\n${resource.description}\nURL: ${resource.url}`;
      } else if (resource.url.includes('xls') || resource.url.includes('xlsx')) {
        return `[Excel Document] ${resource.name}\n${resource.description}\nURL: ${resource.url}`;
      } else {
        return `[Web Resource] ${resource.name}\n${resource.description}\nURL: ${resource.url}`;
      }
    } else if (resource.fileName) {
      // Para archivos locales, proporcionar metadatos
      const fileExtension = resource.fileName.split('.').pop()?.toLowerCase();
      let fileType = 'Document';
      
      switch (fileExtension) {
        case 'pdf':
          fileType = 'PDF Document';
          break;
        case 'doc':
        case 'docx':
          fileType = 'Word Document';
          break;
        case 'xls':
        case 'xlsx':
          fileType = 'Excel Spreadsheet';
          break;
        case 'txt':
          fileType = 'Text File';
          break;
      }
      
      return `[${fileType}] ${resource.name}\n${resource.description}\nFile: ${resource.fileName}\nType: ${resource.type}`;
    }
    
    return resource.description || 'No content available';
  } catch (error) {
    console.error('Error extracting resource content:', error);
    return resource.description || 'Content extraction failed';
  }
};

const sendMessage = async () => {
  if(!userInput.value.trim() || selectedResources.value.length === 0) return;

  // Add user message
  messages.value.push({
    id: messageIdCounter++,
    role: 'user',
    content: userInput.value
  });

  const userQuestion = userInput.value;
  userInput.value = '';

  // Scroll to bottom
  await nextTick();
  messagesEnd.value?.scrollIntoView({ behavior: 'smooth' });

  // AI response with chatCompletion
  isThinking.value = true;

  const ai = new GoogleGenAI({apiKey: 'AIzaSyD8WD3LcQb-nX1gnOugvQdIeM_ZAvJE5SQ'}); 
  try {
    // Get selected resources information
    const selectedResourcesInfo = selectedResources.value
      .map((id) => getResourceById(id))
      .filter(Boolean);

    // Extraer contenido detallado de cada recurso
    const resourcesWithContent = await Promise.all(
      selectedResourcesInfo.map(async (resource) => {
        const content = await extractResourceContent(resource!);
        return {
          ...resource!,
          extractedContent: content
        };
      })
    );

    // Preparar contexto enriquecido para Gemini
    const resourcesContext = resourcesWithContent.map(resource => 
      `=== RECURSO: ${resource.name} ===\n` +
      `Tipo: ${resource.type}\n` +
      `Descripción: ${resource.description}\n` +
      `Contenido Extraído: ${resource.extractedContent}\n` +
      `---`
    ).join('\n\n');

    // Call chat completion API (using Gemini) con contexto enriquecido
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{
          text: `Eres un asistente experto que analiza recursos académicos y documentos. Tu tarea es responder preguntas basándote en los recursos proporcionados por el usuario. 

Tienes acceso al siguiente contenido detallado de los recursos:

${resourcesContext}

Analiza este contenido de manera profesional y proporciona respuestas detalladas y útiles. Puedes hacer referencia específica al contenido extraído, citas directas, y análisis profundo del material.

Pregunta del usuario: ${userQuestion}

Instrucciones adicionales:
- Usa el contenido extraído para fundamentar tus respuestas
- Haz citas específicas cuando sea relevante
- Proporciona análisis comparativo entre múltiples recursos si aplica
- Menciona detalles específicos del contenido que apoyen tu respuesta`
        }]
      }]
    });

    const aiResponse = response.text || 'Lo siento, no pude procesar tu solicitud en este momento.';

    // Add AI response
    messages.value.push({
      id: messageIdCounter++,
      role: 'assistant',
      content: aiResponse,
      resources: [...selectedResources.value],
    });

  } catch (error) {
    console.error('Error en chat completion:', error);
    
    // Fallback response
    const selectedResourcesInfo = selectedResources.value
      .map((id) => getResourceById(id)?.name)
      .join(', ');

    messages.value.push({
      id: messageIdCounter++,
      role: 'assistant', 
      content: `Lo siento, ocurrió un error al procesar tu solicitud. Sin embargo, basándome en los recursos seleccionados (${selectedResourcesInfo}), te puedo decir que estos documentos contienen información relevante sobre tu consulta. Por favor, intenta nuevamente más tarde.`,
      resources: [...selectedResources.value],
    });
  }

  isThinking.value = false;
  nextTick(() => {
    messagesEnd.value?.scrollIntoView({ behavior: 'smooth' });
  });
};

</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
 
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
 
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
 
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
 
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
 
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
 
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>