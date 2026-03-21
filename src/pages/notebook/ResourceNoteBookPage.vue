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

      <!-- Botones de Acción -->
      <div class="p-4 border-b border-gray-200 space-y-2">
        <button
          @click="showAddResourceModal = true"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Agregar Recurso
        </button>

        <!-- Botón Transcribir Seleccionados -->
        <button
          @click="transcribeSelectedResources"
          :disabled="(selectedResources?.length ?? 0) === 0 || isTranscribing"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="!isTranscribing" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ isTranscribing ? 'Transcribiendo...' : 'Transcribir Seleccionados' }}
        </button>
      </div>

      <!-- Lista de Recursos -->
      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        <div v-if="(resources?.length ?? 0) === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <p class="text-sm text-gray-500">No hay recursos agregados</p>
        </div>

        <!-- Resource Card -->
        <div
          v-for="resource in resources || []"
          :key="resource.id"
          :class="[
            'group bg-white border-2 rounded-xl p-4 transition-all',
            selectedResources.includes(resource.id)
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-200 hover:border-indigo-300'
          ]"
        >
          <div class="flex items-start gap-3">
            <!-- Checkbox -->
            <div class="mt-1 cursor-pointer" @click="toggleResourceSelection(resource.id)">
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

              <!-- Estado de Transcripción -->
              <div v-if="resource.transcriptionStatus" class="mb-2">
                <div :class="[
                  'text-xs px-2 py-1 rounded-lg inline-flex items-center gap-1',
                  resource.transcriptionStatus === 'completed' ? 'bg-green-100 text-green-700' :
                  resource.transcriptionStatus === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                ]">
                  <svg v-if="resource.transcriptionStatus === 'completed'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <svg v-if="resource.transcriptionStatus === 'processing'" class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  {{ resource.transcriptionStatus === 'completed' ? 'Transcrito' :
                     resource.transcriptionStatus === 'processing' ? 'Procesando...' :
                     'Error' }}
                </div>
              </div>

              <!-- Botón Ver Transcripción -->
              <button
                v-if="resource.transcription"
                @click="viewTranscription(resource)"
                class="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors font-medium mb-2"
              >
                Ver Transcripción
              </button>

              <div class="flex items-center justify-between text-xs text-gray-400">
                <span>{{ formatDate(resource.createdAt) }}</span>
                <button
                  @click="deleteResource(resource.id)"
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
          <span>{{ resources?.length ?? 0 }} recursos</span>
          <span>{{ selectedResources?.length ?? 0 }} seleccionados</span>
        </div>
      </div>
    </aside>

    <!-- Panel Central - Chat con Tabs -->
    <main class="flex-1 flex flex-col">
      <!-- Tabs Navigation -->
      <div class="bg-white border-b border-blue-100 shadow-sm">
        <div class="flex">
          <button
            @click="activeTab = 'chat'"
            :class="[
              'flex-1 px-6 py-4 font-medium transition-all border-b-2',
              activeTab === 'chat'
                ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
              Chat
            </div>
          </button>
          <button
            @click="activeTab = 'tree'"
            :class="[
              'flex-1 px-6 py-4 font-medium transition-all border-b-2',
              activeTab === 'tree'
                ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
              Árbol de Recursos
            </div>
          </button>
          <button
            @click="activeTab = 'notes'"
            :class="[
              'flex-1 px-6 py-4 font-medium transition-all border-b-2',
              activeTab === 'notes'
                ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Notas Clínicas
              <span v-if="clinicalNotes.length > 0" class="ml-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                {{ clinicalNotes.length }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Chat Tab -->
        <div v-if="activeTab === 'chat'" class="flex-1 flex flex-col">
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
                    getResourceColor(getResourceById(resourceId)?.type || '').badge
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
          <div class="flex-1 overflow-y-auto p-6 space-y-4" ref="chatContainer">
            <!-- Mensaje de bienvenida -->
            <div v-if="messages.length === 0" class="flex items-center justify-center h-full">
              <div class="text-center max-w-md">
                <div class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Asistente de Recursos</h3>
                <p class="text-gray-600 mb-6">Selecciona recursos, transcríbelos y haz preguntas sobre su contenido</p>
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
            <form @submit.prevent="chatWithAI" class="flex gap-3">
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
        </div>

        <!-- Tree Tab -->
        <div v-if="activeTab === 'tree'" class="flex-1 flex flex-col">
          <!-- Header del Árbol -->
          <div class="bg-white border-b border-blue-100 shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
              Flujo de Transcripciones
            </h2>
            <p class="text-sm text-gray-600">Visualización jerárquica de recursos y sus transcripciones</p>
          </div>

          <!-- Árbol de Recursos -->
          <div class="flex-1 overflow-y-auto p-6">
            <div v-if="resources.length === 0" class="text-center py-12">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
              </div>
              <p class="text-sm text-gray-500">No hay recursos para mostrar en el árbol</p>
            </div>

            <!-- Árbol con Recursos -->
            <div v-else class="space-y-4">
              <div
                v-for="resource in resources"
                :key="resource.id"
                class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <!-- Header del Recurso -->
                <div class="bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-3 border-b border-gray-200">
                  <div class="flex items-center gap-3">
                    <div :class="[
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      getResourceColor(resource.type).bg
                    ]">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <h3 class="text-sm font-semibold text-gray-800">{{ resource.name }}</h3>
                      <p class="text-xs text-gray-500">{{ resource.type }} • {{ formatDate(resource.createdAt) }}</p>
                    </div>
                    <div :class="[
                      'px-2 py-1 rounded-lg text-xs font-medium',
                      resource.transcriptionStatus === 'completed' ? 'bg-green-100 text-green-700' :
                      resource.transcriptionStatus === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                      resource.transcriptionStatus === 'error' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    ]">
                      {{ resource.transcriptionStatus === 'completed' ? 'Transcrito' :
                         resource.transcriptionStatus === 'processing' ? 'Procesando...' :
                         resource.transcriptionStatus === 'error' ? 'Error' :
                         'No transcrito' }}
                    </div>
                  </div>
                </div>

                <!-- Contenido del Recurso (Transcripción) -->
                <div class="p-4">
                  <!-- Si no hay transcripción -->
                  <div v-if="!resource.transcription" class="text-center py-6">
                    <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    <p class="text-sm text-gray-500 mb-3">Este recurso aún no ha sido transcrito</p>
                    <button
                      @click="toggleResourceSelection(resource.id); transcribeSelectedResources();"
                      class="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                    >
                      Transcribir Ahora
                    </button>
                  </div>

                  <!-- Si hay transcripción -->
                  <div v-else class="space-y-3">
                    <!-- Estadísticas de la Transcripción -->
                    <div class="grid grid-cols-3 gap-3 mb-4">
                      <div class="bg-gray-50 rounded-lg p-3 text-center">
                        <p class="text-xs text-gray-500 mb-1">Palabras</p>
                        <p class="text-lg font-bold text-gray-800">{{ countWords(resource.transcription) }}</p>
                      </div>
                      <div class="bg-gray-50 rounded-lg p-3 text-center">
                        <p class="text-xs text-gray-500 mb-1">Caracteres</p>
                        <p class="text-lg font-bold text-gray-800">{{ resource.transcription?.length || 0 }}</p>
                      </div>
                      <div class="bg-gray-50 rounded-lg p-3 text-center">
                        <p class="text-xs text-gray-500 mb-1">Líneas</p>
                        <p class="text-lg font-bold text-gray-800">{{ countLines(resource.transcription) }}</p>
                      </div>
                    </div>

                    <!-- Preview de la Transcripción -->
                    <div class="bg-gray-50 rounded-lg p-4">
                      <div class="flex items-center justify-between mb-2">
                        <h4 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          Vista Previa
                        </h4>
                        <div class="flex gap-2">
                          <button
                            @click="viewTranscription(resource)"
                            class="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                          >
                            Ver Completo
                          </button>
                          <button
                            @click="copyTranscriptionText(resource.transcription)"
                            class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                          >
                            Copiar
                          </button>
                        </div>
                      </div>
                      <div class="text-sm text-gray-600 line-clamp-3 whitespace-pre-wrap">
                        {{ resource.transcription }}
                      </div>
                    </div>

                    <!-- Palabras Clave (Simulado) -->
                    <div class="bg-blue-50 rounded-lg p-3">
                      <h5 class="text-xs font-semibold text-blue-800 mb-2">Palabras Clave Detectadas</h5>
                      <div class="flex flex-wrap gap-1">
                        <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">tinnitus</span>
                        <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">auditivo</span>
                        <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">tratamiento</span>
                        <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">síntomas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notas Clínicas Tab -->
        <div v-if="activeTab === 'notes'" class="flex-1 flex flex-col">
          <!-- Header de Notas Clínicas -->
          <div class="bg-white border-b border-blue-100 shadow-sm p-6">
            <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Notas Clínicas
            </h2>
            <p class="text-sm text-gray-600">
              Notas creadas desde textos subrayados en las transcripciones.
              Haz doble clic en cualquier subrayado para agregar o editar una nota.
            </p>
          </div>

          <!-- Lista de Notas Clínicas -->
          <div class="flex-1 overflow-y-auto p-6">
            <div v-if="clinicalNotes.length === 0" class="text-center py-12">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-800 mb-2">No hay notas clínicas</h3>
              <p class="text-sm text-gray-500 max-w-md mx-auto">
                Abre una transcripción, selecciona texto y subrayalo con los colores disponibles.
                Luego haz doble clic en el subrayado para crear una nota clínica.
              </p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="note in clinicalNotes"
                :key="note.id"
                class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
              >
                <!-- Header de la Nota -->
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ note.title }}</h3>
                    <p class="text-xs text-gray-500 flex items-center gap-2">
                      <span class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded">{{ note.resourceName }}</span>
                      <span>•</span>
                      <span>{{ formatDate(note.createdAt) }}</span>
                    </p>
                  </div>
                  <button
                    @click="deleteClinicalNote(note.id); clinicalNotes = clinicalNotes.filter(n => n.id !== note.id)"
                    class="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>

                <!-- Texto Subrayado -->
                <div class="mb-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                  <p class="text-xs text-yellow-800 font-medium mb-1">Texto subrayado:</p>
                  <p class="text-sm text-gray-700 italic line-clamp-2">"{{ note.highlightText }}"</p>
                </div>

                <!-- Descripción de la Nota -->
                <div class="prose prose-sm max-w-none mb-4">
                  <p class="text-gray-700 whitespace-pre-wrap">{{ note.description }}</p>
                </div>

                <!-- Botón Analizar con IA -->
                <div v-if="note.description?.trim()" class="mb-4">
                  <button
                    @click="analyzeNoteWithAI(note)"
                    :disabled="isAnalyzingNote[note.id]"
                    class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg v-if="!isAnalyzingNote[note.id]" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                    <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    {{ isAnalyzingNote[note.id] ? 'Analizando...' : 'Analizar con IA' }}
                  </button>
                </div>

                <!-- Resultados del Análisis IA -->
                <div v-if="note.aiAnalysis" class="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
                  <div class="flex items-center gap-2 mb-3">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    <h4 class="font-semibold text-purple-800">Orientación Clínica (IA)</h4>
                    <span class="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      {{ formatDate(note.aiAnalysis.analyzedAt) }}
                    </span>
                  </div>
                  
                  <div class="space-y-2">
                    <div
                      v-for="(suggestion, index) in note.aiAnalysis.suggestions"
                      :key="index"
                      class="flex items-start gap-3 p-3 bg-white/70 rounded-lg"
                    >
                      <span class="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-semibold shrink-0">
                        {{ index + 1 }}
                      </span>
                      <p class="text-sm text-gray-700">{{ suggestion }}</p>
                    </div>
                  </div>

                  <div class="mt-3 pt-3 border-t border-purple-200">
                    <p class="text-xs text-purple-600 italic">
                      ⚠️ Estas son sugerencias orientativas, no constituyen diagnóstico médico. Consulte con un profesional de salud.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Ver Transcripción -->
    <transition name="modal">
      <div v-if="showTranscriptionModal && currentTranscription"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="showTranscriptionModal = false">
        <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl" @click.stop>
          <!-- Header -->
          <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 rounded-t-3xl flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-white mb-1">Transcripción del Documento</h3>
              <p class="text-white/80 text-sm">{{ currentTranscription.name }}</p>
            </div>
            <button
              @click="showTranscriptionModal = false"
              class="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <div class="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
              <!-- Info -->
              <div class="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                <div :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  getResourceColor(currentTranscription.type).bg
                ]">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-800">{{ currentTranscription.type }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(currentTranscription.createdAt) }}</p>
                </div>
              </div>

              <!-- Toolbar de Subrayado Mejorado -->
              <div class="mb-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                <div class="flex items-center gap-3 mb-3">
                  <span class="text-sm font-semibold text-gray-700">Selecciona texto y elige un color para subrayar:</span>
                </div>
                
                <!-- Botones de color que crean highlight directamente -->
                <div class="flex items-center gap-2 flex-wrap">
                  <button
                    v-for="color in highlightColors"
                    :key="color"
                    @click="selectedHighlightColor = color; if (isTextSelected) createHighlightFromTooltip(color)"
                    :class="[
                      'px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2',
                      selectedHighlightColor === color 
                        ? 'ring-2 ring-offset-2 ring-gray-800 scale-105' 
                        : 'hover:scale-105',
                      color === 'yellow' && 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300',
                      color === 'green' && 'bg-green-200 text-green-800 hover:bg-green-300',
                      color === 'red' && 'bg-red-200 text-red-800 hover:bg-red-300',
                      color === 'purple' && 'bg-purple-200 text-purple-800 hover:bg-purple-300',
                      color === 'orange' && 'bg-orange-200 text-orange-800 hover:bg-orange-300'
                    ]"
                    :disabled="!isTextSelected"
                  >
                    <div :class="[
                      'w-3 h-3 rounded-full',
                      color === 'yellow' && 'bg-yellow-500',
                      color === 'green' && 'bg-green-500',
                      color === 'red' && 'bg-red-500',
                      color === 'purple' && 'bg-purple-500',
                      color === 'orange' && 'bg-orange-500'
                    ]" />
                    {{ color === 'yellow' ? 'Amarillo' : color === 'green' ? 'Verde' : color === 'red' ? 'Rojo' : color === 'purple' ? 'Púrpura' : 'Naranja' }}
                  </button>
                </div>
                
                <!-- Mensaje de ayuda -->
                <div class="mt-3 text-xs text-gray-500 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span v-if="isTextSelected">
                    ✅ Texto seleccionado. Haz clic en un color para subrayar.
                  </span>
                  <span v-else>
                    1. Selecciona texto con el mouse  →  2. Haz clic en un color para subrayar  →  3. Haz doble clic en el subrayado para agregar nota
                  </span>
                </div>
              </div>

              <!-- Transcription Text with Highlights -->
              <div class="bg-white rounded-xl p-6 shadow-sm">
                <h4 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Contenido Transcrito
                </h4>
                <div 
                  class="prose prose-sm max-w-none"
                  @mouseup="handleTextSelection"
                >
                  <p class="text-gray-700 whitespace-pre-wrap leading-relaxed">{{ currentTranscription.transcription }}</p>
                </div>
              </div>

              <!-- Stats -->
              <div class="mt-4 grid grid-cols-3 gap-3">
                <div class="bg-white rounded-lg p-3 text-center">
                  <p class="text-xs text-gray-500 mb-1">Palabras</p>
                  <p class="text-lg font-bold text-gray-800">{{ countWords(currentTranscription.transcription) }}</p>
                </div>
                <div class="bg-white rounded-lg p-3 text-center">
                  <p class="text-xs text-gray-500 mb-1">Caracteres</p>
                  <p class="text-lg font-bold text-gray-800">{{ currentTranscription.transcription?.length || 0 }}</p>
                </div>
                <div class="bg-white rounded-lg p-3 text-center">
                  <p class="text-xs text-gray-500 mb-1">Líneas</p>
                  <p class="text-lg font-bold text-gray-800">{{ countLines(currentTranscription.transcription) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer con acciones -->
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-3xl flex gap-3">
            <button
              @click="copyTranscription"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-100 text-indigo-700 rounded-xl font-medium hover:bg-indigo-200 transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002 2v8a2 2 0 00-2 2z"/>
              </svg>
              Copiar
            </button>
            <button
              @click="downloadTranscription"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Descargar
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal Agregar Recurso -->
    <transition name="modal">
      <div
        v-if="showAddResourceModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="closeAddResourceModal"
      >
        <div
          class="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
          @click.stop
        >
          <div class="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Agregar Recurso</h3>
              <p class="text-xs text-gray-500">Sube un documento o pega una URL.</p>
            </div>
            <button
              type="button"
              @click="closeAddResourceModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form @submit.prevent="addResource" class="p-6 space-y-4">
            <div>
              <label class="text-xs font-medium text-gray-700">Tipo de recurso</label>
              <select
                v-model="newResourceMode"
                class="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="file">Documento (PDF / Word / Excel)</option>
                <option value="url">URL</option>
              </select>
            </div>

            <div v-if="newResourceMode === 'file'">
              <label class="text-xs font-medium text-gray-700">Archivo</label>
              <input
                type="file"
                @change="handleFileChange"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                class="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <p class="text-xs text-gray-500 mt-1">Selecciona un archivo para transcribir.</p>
            </div>

            <div v-if="newResourceMode === 'url'">
              <label class="text-xs font-medium text-gray-700">URL</label>
              <input
                v-model="newResourceUrl"
                type="url"
                placeholder="https://..."
                class="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div>
              <label class="text-xs font-medium text-gray-700">Nombre</label>
              <input
                v-model="newResourceName"
                type="text"
                placeholder="Título del recurso"
                class="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div>
              <label class="text-xs font-medium text-gray-700">Descripción</label>
              <textarea
                v-model="newResourceDescription"
                rows="3"
                placeholder="Descripción (opcional)"
                class="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              ></textarea>
            </div>

            <div class="flex items-center justify-end gap-2">
              <button
                type="button"
                @click="closeAddResourceModal"
                class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="!canAddResource"
                class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agregar recurso
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal Nota de Highlight -->
    <transition name="modal">
      <div
        v-if="showHighlightNoteModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="closeHighlightNoteModal"
      >
        <div
          class="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
          @click.stop
        >
          <div class="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">
                {{ currentHighlight?.noteId ? 'Editar Nota Clínica' : 'Crear Nota Clínica' }}
              </h3>
              <p class="text-xs text-gray-500">Agrega información clínica sobre el texto subrayado.</p>
            </div>
            <button
              type="button"
              @click="closeHighlightNoteModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveHighlightNote" class="p-6 space-y-4">
            <!-- Texto Subrayado -->
            <div class="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
              <p class="text-xs text-yellow-800 font-medium mb-1">Texto subrayado:</p>
              <p class="text-sm text-gray-700 italic line-clamp-3">"{{ currentHighlight?.text }}"</p>
            </div>

            <div>
              <label class="text-xs font-medium text-gray-700">Título de la Nota</label>
              <input
                v-model="noteForm.title"
                type="text"
                placeholder="Ej: Síntoma importante, Tratamiento recomendado..."
                class="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                required
              />
            </div>

            <div>
              <label class="text-xs font-medium text-gray-700">Descripción</label>
              <textarea
                v-model="noteForm.description"
                rows="4"
                placeholder="Describe la relevancia clínica de este texto..."
                class="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                required
              ></textarea>
            </div>

            <div class="flex items-center justify-end gap-2">
              <button
                v-if="currentHighlight?.noteId"
                type="button"
                @click="deleteHighlightWithNote(currentHighlight.id)"
                class="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
              >
                Eliminar
              </button>
              <button
                type="button"
                @click="closeHighlightNoteModal"
                class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {{ currentHighlight?.noteId ? 'Actualizar Nota' : 'Guardar Nota' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Botón Flotante de Configuración de Subrayado -->
    <div class="fixed bottom-6 right-6 z-40">
      <!-- Menú de configuración -->
      <transition name="scale">
        <div
          v-if="showHighlightConfigMenu"
          class="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-72 mb-2"
        >
          <div class="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
            <h4 class="font-semibold text-gray-800 text-sm">Configuración de Subrayado</h4>
            <button
              @click="showHighlightConfigMenu = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <!-- Colores por defecto -->
          <div class="mb-4">
            <p class="text-xs font-medium text-gray-600 mb-2">Color por defecto:</p>
            <div class="flex gap-2">
              <button
                v-for="color in highlightColors"
                :key="color"
                @click="selectedHighlightColor = color"
                :class="[
                  'w-8 h-8 rounded-lg border-2 transition-all',
                  selectedHighlightColor === color ? 'border-gray-800 scale-110' : 'border-transparent',
                  color === 'yellow' && 'bg-yellow-300',
                  color === 'green' && 'bg-green-300',
                  color === 'red' && 'bg-red-300',
                  color === 'purple' && 'bg-purple-300',
                  color === 'orange' && 'bg-orange-300'
                ]"
                :title="color"
              />
            </div>
          </div>
          
          <!-- Estadísticas de subrayados -->
          <div class="bg-gray-50 rounded-lg p-3 mb-3">
            <p class="text-xs text-gray-600 mb-1">Estadísticas:</p>
            <div class="flex justify-between text-xs">
              <span class="text-gray-500">Subrayados:</span>
              <span class="font-semibold text-gray-800">{{ highlights.length }}</span>
            </div>
            <div class="flex justify-between text-xs mt-1">
              <span class="text-gray-500">Notas clínicas:</span>
              <span class="font-semibold text-gray-800">{{ clinicalNotes.length }}</span>
            </div>
          </div>
          
          <!-- Acciones -->
          <div class="space-y-2">
            <button
              @click="clearAllHighlightsConfirm"
              class="w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              Limpiar todos los subrayados
            </button>
            <button
              @click="exportHighlights"
              class="w-full px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Exportar subrayados
            </button>
          </div>
        </div>
      </transition>
      
      <!-- Botón principal flotante -->
      <button
        @click="showHighlightConfigMenu = !showHighlightConfigMenu"
        :class="[
          'w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center',
          showHighlightConfigMenu 
            ? 'bg-gray-800 text-white rotate-45' 
            : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-110 hover:shadow-xl'
        ]"
        title="Configuración de Subrayado"
      >
        <svg v-if="!showHighlightConfigMenu" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { LMStudioClient } from '@lmstudio/sdk';
import {
  initDatabase,
  saveResource,
  getAllResources,
  deleteResource as deleteResourceFromDB,
  saveFile,
  getFile,
  deleteFile,
  saveHighlight,
  getHighlightsByResource,
  getHighlightById,
  deleteHighlight,
  saveClinicalNote,
  getAllClinicalNotes,
  deleteClinicalNote,
  getClinicalNoteByHighlightId,
  type HighlightColor
} from '../../services/persistenceService';

// Configurar el worker de PDF.js
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdn.jsdelivr.net/npm/pdfjs-dist@3.1.81/build/pdf.worker.min.js';
}

// Configurar Gemini AI
const GEMINI_API_KEY = 'AIzaSyDWorLQO9nxyF_cZ4KsGT4z1XzHSKAiYVg';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Función para enviar chat a LMStudio (ejecutar solo cuando LMStudio esté corriendo)
 */
const sendNoteChat = async (prompt: string = "Hello, how are you?") => {
  try {
    const client = new LMStudioClient();
    const model = await client.llm.model("google/gemma-3-4b");
    const result = await model.respond(prompt);
    console.log('LMStudio response:', result.content);
    return result.content;
  } catch (error) {
    console.error('Error al conectar con LMStudio:', error);
    console.log('Asegúrate de que LMStudio esté corriendo en http://localhost:1234');
    return null;
  }
};

// NOTA: Descomentar solo cuando LMStudio esté corriendo y el SDK esté estable
// sendNoteChat();

interface Resource {
  id: number;
  name: string;
  type: string;
  description: string;
  createdAt: Date | string;
  file?: File;
  url?: string;
  transcription?: string;
  transcriptionStatus?: 'processing' | 'completed' | 'error';
}

interface Message {
  id: number;
  role: 'assistant' | 'user';
  content: string;
  resources: number[];
}

// Interfaces para Highlights y Notas Clínicas
interface Highlight {
  id: string;
  resourceId: number;
  text: string;
  color: HighlightColor;
  startOffset: number;
  endOffset: number;
  createdAt: Date;
  noteId?: string;
}

interface AIAnalysis {
  suggestions: string[];
  analyzedAt: Date;
  promptSent: string;
}

interface ClinicalNote {
  id: string;
  highlightId: string;
  resourceId: number;
  resourceName: string;
  highlightText: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date;
  aiAnalysis?: AIAnalysis;
}

// Variables reactivas
const resources = ref<Resource[]>([]);
const selectedResources = ref<number[]>([]);
const messages = ref<Message[]>([]);
const userInput = ref('');
const isThinking = ref(false);
const isTranscribing = ref(false);
const showTranscriptionModal = ref(false);
const showAddResourceModal = ref(false);
const currentTranscription = ref<Resource | null>(null);
const messagesEnd = ref<HTMLElement | null>(null);
const chatContainer = ref<HTMLElement | null>(null);
const activeTab = ref<'chat' | 'tree' | 'notes'>('chat');
const isLoading = ref(false);
const loadError = ref<string | null>(null);

// Variables para Highlights y Notas Clínicas
const highlights = ref<Highlight[]>([]);
const clinicalNotes = ref<ClinicalNote[]>([]);
const selectedHighlightColor = ref<HighlightColor>('yellow');
const showHighlightNoteModal = ref(false);
const currentHighlight = ref<Highlight | null>(null);
const noteForm = ref({
  title: '',
  description: ''
});
const isTextSelected = ref(false);
const selectionRange = ref<{ start: number; end: number; text: string } | null>(null);

// Variables para análisis de IA en notas clínicas
const isAnalyzingNote = ref<Record<string, boolean>>({});

// Variables para tooltip flotante de subrayado
const showHighlightTooltip = ref(false);
const highlightTooltipPosition = ref({ x: 0, y: 0 });

// Variables para botón flotante de configuración
const showHighlightConfigMenu = ref(false);

// Colores disponibles para subrayado
const highlightColors: HighlightColor[] = ['yellow', 'green', 'red', 'purple', 'orange'];

// Función auxiliar para obtener clase de color del botón
const getHighlightButtonClass = (color: HighlightColor): string => {
  const colorMap: Record<HighlightColor, string> = {
    yellow: 'bg-yellow-300',
    green: 'bg-green-300',
    red: 'bg-red-300',
    purple: 'bg-purple-300',
    orange: 'bg-orange-300'
  };
  return colorMap[color];
};

// Contadores
let messageIdCounter = 0;
const resourceIdCounter = ref(1);

// Add resource modal state
const newResourceMode = ref<'file' | 'url'>('file');
const newResourceName = ref('');
const newResourceDescription = ref('');
const newResourceUrl = ref('');
const newResourceFile = ref<File | null>(null);

// Computed
const canAddResource = computed(() => {
  if (newResourceMode.value === 'file') {
    return !!newResourceFile.value;
  }
  return newResourceUrl.value.trim().length > 0;
});

// Funciones helper
const getResourceById = (id: number) => resources.value.find((r) => r.id === id);

// ✅ FUNCIÓN DE CARGA DE RECURSOS (PERSISTENCIA)
const loadResources = async () => {
  try {
    isLoading.value = true;
    loadError.value = null;
    
    // Inicializar base de datos
    await initDatabase();
    
    // Cargar recursos desde IndexedDB
    const storedResources = await getAllResources();
    
    // Recuperar archivos y reconstruir objetos Resource
    const loadedResources: Resource[] = [];
    let maxId = 0;
    
    for (const stored of storedResources) {
      // Actualizar contador de IDs
      if (stored.id > maxId) maxId = stored.id;
      
      // Reconstruir recurso
      const resource: Resource = {
        id: stored.id,
        name: stored.name,
        type: stored.type,
        description: stored.description,
        createdAt: new Date(stored.createdAt),
        url: stored.url,
        transcription: stored.transcription,
        transcriptionStatus: stored.transcriptionStatus
      };
      
      // Si tiene archivo asociado, recuperarlo
      if (stored.fileId) {
        const file = await getFile(stored.fileId);
        if (file) {
          resource.file = file;
        }
      }
      
      loadedResources.push(resource);
    }
    
    // Actualizar estado
    resources.value = loadedResources;
    resourceIdCounter.value = maxId + 1;
    
    console.log(`✅ Cargados ${loadedResources.length} recursos desde IndexedDB`);
  } catch (error) {
    console.error('Error al cargar recursos:', error);
    loadError.value = `Error al cargar recursos: ${error}`;
  } finally {
    isLoading.value = false;
  }
};

// Cargar recursos al montar el componente
onMounted(() => {
  loadResources();
  loadAllClinicalNotes();
});

// ✅ FUNCIONES PARA HIGHLIGHTS Y NOTAS CLÍNICAS

/**
 * Carga todos los highlights de un recurso y los renderiza en el DOM
 */
const loadHighlightsForResource = async (resourceId: number) => {
  try {
    const storedHighlights = await getHighlightsByResource(resourceId);
    const loadedHighlights: Highlight[] = storedHighlights.map(h => ({
      id: h.id,
      resourceId: h.resourceId,
      text: h.text,
      color: h.color,
      startOffset: h.startOffset,
      endOffset: h.endOffset,
      createdAt: new Date(h.createdAt),
      noteId: h.noteId
    }));
    
    // Filtrar highlights del recurso actual
    highlights.value = highlights.value.filter(h => h.resourceId !== resourceId);
    highlights.value.push(...loadedHighlights);
    
    // Renderizar los highlights en el DOM después de cargar
    nextTick(() => {
      renderHighlightsInTranscription();
    });
    
    return loadedHighlights;
  } catch (error) {
    console.error('Error al cargar highlights:', error);
    return [];
  }
};

/**
 * Renderiza los highlights existentes en el texto de la transcripción
 */
const renderHighlightsInTranscription = () => {
  if (!currentTranscription.value?.transcription) return;
  
  const container = document.querySelector('.prose p');
  if (!container) return;
  
  const resourceId = currentTranscription.value.id;
  const resourceHighlights = highlights.value.filter(h => h.resourceId === resourceId);
  
  if (resourceHighlights.length === 0) return;
  
  // Obtener el texto original
  const originalText = currentTranscription.value.transcription;
  
  // Crear un nuevo HTML con los highlights aplicados
  let html = originalText;
  
  // Ordenar highlights por posición (de atrás hacia adelante para no desplazar índices)
  const sortedHighlights = [...resourceHighlights].sort((a, b) => b.startOffset - a.startOffset);
  
  // Aplicar cada highlight
  for (const highlight of sortedHighlights) {
    const colorStyles: Record<HighlightColor, string> = {
      yellow: 'background-color: #fef08a;',
      green: 'background-color: #bbf7d0;',
      red: 'background-color: #fecaca;',
      purple: 'background-color: #e9d5ff;',
      orange: 'background-color: #fed7aa;'
    };
    
    const escapedText = highlight.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedText})`, 'g');
    
    html = html.replace(regex, `<span 
      data-highlight-id="${highlight.id}" 
      data-color="${highlight.color}"
      style="${colorStyles[highlight.color]} padding: 2px 4px; border-radius: 3px; cursor: pointer;"
      class="highlighted-text"
    >$1</span>`);
  }
  
  // Actualizar el contenido del contenedor
  container.innerHTML = html;
  
  // Agregar event listeners a los spans creados
  const spans = container.querySelectorAll('.highlighted-text');
  spans.forEach(span => {
    span.addEventListener('dblclick', () => {
      const highlightId = span.getAttribute('data-highlight-id');
      const highlight = highlights.value.find(h => h.id === highlightId);
      if (highlight) {
        handleHighlightDoubleClick(highlight);
      }
    });
  });
  
  console.log(`✅ ${resourceHighlights.length} highlights renderizados en el DOM`);
};

/**
 * Carga todas las notas clínicas
 */
const loadAllClinicalNotes = async () => {
  try {
    const storedNotes = await getAllClinicalNotes();
    clinicalNotes.value = storedNotes.map(n => {
      const resource = getResourceById(n.resourceId);
      return {
        id: n.id,
        highlightId: n.highlightId,
        resourceId: n.resourceId,
        resourceName: resource?.name || 'Recurso desconocido',
        highlightText: '', // Se actualizará después
        title: n.title,
        description: n.description,
        createdAt: new Date(n.createdAt),
        updatedAt: n.updatedAt ? new Date(n.updatedAt) : undefined
      };
    });
    
    // Actualizar el texto del highlight para cada nota
    for (const note of clinicalNotes.value) {
      const highlight = await getHighlightById(note.highlightId);
      if (highlight) {
        note.highlightText = highlight.text;
      }
    }
    
    console.log(`✅ Cargadas ${clinicalNotes.value.length} notas clínicas`);
  } catch (error) {
    console.error('Error al cargar notas clínicas:', error);
  }
};

/**
 * Obtiene el color de highlight según el tipo seleccionado
 */
const getHighlightColorClass = (color: HighlightColor): string => {
  const colorMap: Record<HighlightColor, string> = {
    yellow: 'bg-yellow-200 hover:bg-yellow-300',
    green: 'bg-green-200 hover:bg-green-300',
    red: 'bg-red-200 hover:bg-red-300',
    purple: 'bg-purple-200 hover:bg-purple-300',
    orange: 'bg-orange-200 hover:bg-orange-300'
  };
  return colorMap[color] || colorMap.yellow;
};

/**
 * Maneja la selección de texto en la transcripción - muestra tooltip flotante
 */
const handleTextSelection = (event: MouseEvent) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    isTextSelected.value = false;
    selectionRange.value = null;
    showHighlightTooltip.value = false;
    return;
  }
  
  const range = selection.getRangeAt(0);
  const text = selection.toString().trim();
  
  if (text.length > 0) {
    isTextSelected.value = true;
    selectionRange.value = {
      start: range.startOffset,
      end: range.endOffset,
      text: text
    };
    
    // Mostrar tooltip flotante cerca del cursor
    showHighlightTooltip.value = true;
    highlightTooltipPosition.value = {
      x: event.clientX,
      y: event.clientY - 60 // Posicionar arriba del cursor
    };
  } else {
    isTextSelected.value = false;
    selectionRange.value = null;
    showHighlightTooltip.value = false;
  }
};

/**
 * Aplica el subrayado visual al texto seleccionado en el DOM
 */
const applyHighlightToDOM = (range: Range, color: HighlightColor, highlightId: string) => {
  const span = document.createElement('span');
  span.className = `${getHighlightColorClass(color)} cursor-pointer transition-all`;
  span.dataset.highlightId = highlightId;
  span.dataset.color = color;
  
  // Aplicar estilos inline para asegurar visibilidad
  const colorStyles: Record<HighlightColor, string> = {
    yellow: 'background-color: #fef08a;',
    green: 'background-color: #bbf7d0;',
    red: 'background-color: #fecaca;',
    purple: 'background-color: #e9d5ff;',
    orange: 'background-color: #fed7aa;'
  };
  span.style.cssText = `${colorStyles[color]} padding: 2px 4px; border-radius: 3px;`;
  
  try {
    range.surroundContents(span);
    
    // Agregar evento de doble clic al span
    span.addEventListener('dblclick', () => {
      const highlight = highlights.value.find(h => h.id === highlightId);
      if (highlight) {
        handleHighlightDoubleClick(highlight);
      }
    });
    
    return span;
  } catch (error) {
    console.error('Error al aplicar highlight al DOM:', error);
    return null;
  }
};

/**
 * Crea un highlight con el texto seleccionado desde el tooltip
 */
const createHighlightFromTooltip = async (color: HighlightColor) => {
  if (!currentTranscription.value || !selectionRange.value) return;
  
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  const resourceId = currentTranscription.value.id;
  const highlightId = `highlight-${resourceId}-${Date.now()}`;
  
  // Aplicar el subrayado visual al DOM primero
  const span = applyHighlightToDOM(range, color, highlightId);
  if (!span) {
    console.error('No se pudo aplicar el highlight al DOM');
    return;
  }
  
  const newHighlight: Highlight = {
    id: highlightId,
    resourceId: resourceId,
    text: selectionRange.value.text,
    color: color,
    startOffset: selectionRange.value.start,
    endOffset: selectionRange.value.end,
    createdAt: new Date()
  };
  
  try {
    // Guardar en IndexedDB
    await saveHighlight({
      id: newHighlight.id,
      resourceId: newHighlight.resourceId,
      text: newHighlight.text,
      color: newHighlight.color,
      startOffset: newHighlight.startOffset,
      endOffset: newHighlight.endOffset,
      createdAt: newHighlight.createdAt.toISOString()
    });
    
    // Agregar al estado
    highlights.value.push(newHighlight);
    
    // Ocultar tooltip y limpiar selección
    showHighlightTooltip.value = false;
    window.getSelection()?.removeAllRanges();
    isTextSelected.value = false;
    selectionRange.value = null;
    
    // Abrir modal para crear nota
    currentHighlight.value = newHighlight;
    noteForm.value = { title: '', description: '' };
    showHighlightNoteModal.value = true;
    
    console.log(`✅ Highlight creado y aplicado visualmente: ${highlightId}`);
  } catch (error) {
    console.error('Error al crear highlight:', error);
  }
};

/**
 * Maneja el doble clic en un highlight existente
 */
const handleHighlightDoubleClick = async (highlight: Highlight) => {
  currentHighlight.value = highlight;
  
  // Buscar si ya existe una nota para este highlight
  const existingNote = await getClinicalNoteByHighlightId(highlight.id);
  
  if (existingNote) {
    // Cargar datos de la nota existente
    noteForm.value = {
      title: existingNote.title,
      description: existingNote.description
    };
  } else {
    // Crear nueva nota
    noteForm.value = { title: '', description: '' };
  }
  
  showHighlightNoteModal.value = true;
};

/**
 * Guarda la nota clínica asociada al highlight
 */
const saveHighlightNote = async () => {
  if (!currentHighlight.value) return;
  
  const noteId = `note-${currentHighlight.value.id}`;
  const now = new Date();
  
  const note: ClinicalNote = {
    id: noteId,
    highlightId: currentHighlight.value.id,
    resourceId: currentHighlight.value.resourceId,
    resourceName: getResourceById(currentHighlight.value.resourceId)?.name || 'Recurso',
    highlightText: currentHighlight.value.text,
    title: noteForm.value.title,
    description: noteForm.value.description,
    createdAt: now,
    updatedAt: now
  };
  
  try {
    // Guardar en IndexedDB
    await saveClinicalNote({
      id: note.id,
      highlightId: note.highlightId,
      resourceId: note.resourceId,
      title: note.title,
      description: note.description,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt?.toISOString()
    });
    
    // Actualizar el highlight con el noteId
    await saveHighlight({
      id: currentHighlight.value.id,
      resourceId: currentHighlight.value.resourceId,
      text: currentHighlight.value.text,
      color: currentHighlight.value.color,
      startOffset: currentHighlight.value.startOffset,
      endOffset: currentHighlight.value.endOffset,
      createdAt: currentHighlight.value.createdAt.toISOString(),
      noteId: noteId
    });
    
    currentHighlight.value.noteId = noteId;
    
    // Actualizar lista de notas
    const existingIndex = clinicalNotes.value.findIndex(n => n.id === noteId);
    if (existingIndex >= 0) {
      clinicalNotes.value[existingIndex] = note;
    } else {
      clinicalNotes.value.unshift(note);
    }
    
    console.log(`✅ Nota clínica guardada: ${noteId}`);
    
    // Cerrar modal
    closeHighlightNoteModal();
  } catch (error) {
    console.error('Error al guardar nota clínica:', error);
  }
};

/**
 * Cierra el modal de nota de highlight
 */
const closeHighlightNoteModal = () => {
  showHighlightNoteModal.value = false;
  currentHighlight.value = null;
  noteForm.value = { title: '', description: '' };
};

/**
 * Elimina un highlight y su nota asociada
 */
const deleteHighlightWithNote = async (highlightId: string) => {
  try {
    // Eliminar nota asociada si existe
    const note = await getClinicalNoteByHighlightId(highlightId);
    if (note) {
      await deleteClinicalNote(note.id);
      clinicalNotes.value = clinicalNotes.value.filter(n => n.id !== note.id);
    }
    
    // Eliminar highlight
    await deleteHighlight(highlightId);
    highlights.value = highlights.value.filter(h => h.id !== highlightId);
    
    console.log(`✅ Highlight ${highlightId} eliminado`);
  } catch (error) {
    console.error('Error al eliminar highlight:', error);
  }
};

/**
 * Analiza una nota clínica con IA y genera propuestas orientativas
 */
const analyzeNoteWithAI = async (note: ClinicalNote) => {
  if (!note.description?.trim()) {
    alert('La nota debe tener contenido para analizar');
    return;
  }

  // Marcar como analizando
  isAnalyzingNote.value[note.id] = true;

  try {
    // Construir el prompt para la IA
    const prompt = `Actúa como un asistente de orientación clínica (no médico). 

Analiza la siguiente nota clínica y proporciona 3-5 sugerencias orientativas, NO diagnósticos. Las sugerencias deben ser:
- Claras y comprensibles
- Responsables y prudentes
- No deterministas (evita conclusiones definitivas)
- Orientadas a recomendar consultar con profesionales cuando sea apropiado

NOTA CLÍNICA:
Título: ${note.title}
Descripción: ${note.description}
Texto subrayado: ${note.highlightText}

Proporciona las sugerencias numeradas, una por línea, sin introducción ni conclusión.`;

    // Llamar al servicio de IA (usando Gemini)
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Procesar la respuesta para extraer sugerencias
    const suggestions = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.match(/^\d+\./)) // Remove number prefixes
      .map(line => line.replace(/^\d+\.\s*/, '')) // Clean up any remaining numbers
      .slice(0, 5); // Máximo 5 sugerencias

    // Si no se extrajeron sugerencias, usar el texto completo dividido en oraciones
    const finalSuggestions = suggestions.length > 0 
      ? suggestions 
      : text.split('.').filter(s => s.trim().length > 20).slice(0, 5);

    // Guardar el análisis en la nota
    note.aiAnalysis = {
      suggestions: finalSuggestions,
      analyzedAt: new Date(),
      promptSent: prompt
    };

    console.log(`✅ Nota ${note.id} analizada con IA:`, finalSuggestions);
  } catch (error) {
    console.error('Error al analizar nota con IA:', error);
    alert('Error al analizar la nota. Por favor intenta de nuevo.');
  } finally {
    isAnalyzingNote.value[note.id] = false;
  }
};

/**
 * Confirmar y limpiar todos los highlights
 */
const clearAllHighlightsConfirm = async () => {
  if (!confirm('¿Estás seguro de que deseas eliminar TODOS los subrayados y notas clínicas? Esta acción no se puede deshacer.')) {
    return;
  }
  
  try {
    // Eliminar todos los highlights y sus notas
    for (const highlight of [...highlights.value]) {
      await deleteHighlightWithNote(highlight.id);
    }
    
    highlights.value = [];
    clinicalNotes.value = [];
    
    console.log('✅ Todos los highlights han sido eliminados');
    alert('Todos los subrayados y notas han sido eliminados.');
  } catch (error) {
    console.error('Error al limpiar highlights:', error);
  }
};

/**
 * Exportar highlights a JSON
 */
const exportHighlights = () => {
  const exportData = {
    highlights: highlights.value.map(h => ({
      id: h.id,
      resourceId: h.resourceId,
      text: h.text,
      color: h.color,
      startOffset: h.startOffset,
      endOffset: h.endOffset,
      createdAt: h.createdAt.toISOString(),
      noteId: h.noteId
    })),
    clinicalNotes: clinicalNotes.value.map(n => ({
      id: n.id,
      highlightId: n.highlightId,
      resourceId: n.resourceId,
      resourceName: n.resourceName,
      highlightText: n.highlightText,
      title: n.title,
      description: n.description,
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt?.toISOString()
    })),
    exportedAt: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `highlights_export_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log('✅ Highlights exportados');
};

const formatDate = (date?: Date | string) => {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(d);
};

const getResourceColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'pdf':
      return { bg: 'bg-red-500', badge: 'bg-red-100 text-red-700' };
    case 'word':
    case 'docx':
    case 'doc':
      return { bg: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700' };
    case 'excel':
    case 'xlsx':
    case 'xls':
      return { bg: 'bg-green-500', badge: 'bg-green-100 text-green-700' };
    case 'txt':
      return { bg: 'bg-gray-500', badge: 'bg-gray-100 text-gray-700' };
    case 'url':
      return { bg: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700' };
    default:
      return { bg: 'bg-slate-400', badge: 'bg-slate-100 text-slate-700' };
  }
};

const toggleResourceSelection = (id: number) => {
  const index = selectedResources.value.indexOf(id);
  if (index >= 0) {
    selectedResources.value.splice(index, 1);
  } else {
    selectedResources.value.push(id);
  }
};

// ✅ FUNCIÓN DE ELIMINACIÓN CON PERSISTENCIA
const deleteResource = async (id: number) => {
  try {
    // Obtener el recurso antes de eliminarlo
    const resource = getResourceById(id);
    
    // Eliminar archivo asociado si existe
    if (resource?.file) {
      await deleteFile(id);
    }
    
    // Eliminar de IndexedDB
    await deleteResourceFromDB(id);
    
    // Eliminar del estado
    resources.value = resources.value.filter((r) => r.id !== id);
    selectedResources.value = selectedResources.value.filter((selectedId) => selectedId !== id);
    
    console.log(`✅ Recurso ${id} eliminado de IndexedDB`);
  } catch (error) {
    console.error('Error al eliminar recurso:', error);
  }
};

// Funciones de modal
const resetNewResourceForm = () => {
  newResourceMode.value = 'file';
  newResourceName.value = '';
  newResourceDescription.value = '';
  newResourceUrl.value = '';
  newResourceFile.value = null;
};

const closeAddResourceModal = () => {
  showAddResourceModal.value = false;
  resetNewResourceForm();
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input?.files?.[0] ?? null;
  newResourceFile.value = file;
  if (file && !newResourceName.value) {
    newResourceName.value = file.name;
  }
};

// ✅ FUNCIÓN DE AGREGAR RECURSO CON PERSISTENCIA
const addResource = async () => {
  const now = new Date();
  const id = resourceIdCounter.value++;
  
  let type = 'DOCUMENTO';
  
  if (newResourceMode.value === 'file' && newResourceFile.value) {
    const extension = newResourceFile.value.name.split('.').pop()?.toLowerCase() || '';
    
    if (extension === 'pdf') {
      type = 'PDF';
    } else if (['doc', 'docx'].includes(extension)) {
      type = 'WORD';
    } else if (['xls', 'xlsx'].includes(extension)) {
      type = 'EXCEL';
    } else if (['txt'].includes(extension)) {
      type = 'TXT';
    } else if (['png', 'jpg', 'jpeg'].includes(extension)) {
      type = 'IMAGE';
    }
  } else if (newResourceMode.value === 'url') {
    type = 'URL';
  }

  const newRes: Resource = {
    id,
    name: newResourceName.value.trim() || (newResourceFile.value?.name ?? 'Documento'),
    type,
    description: newResourceDescription.value.trim() || '',
    createdAt: now,
    file: newResourceMode.value === 'file' ? (newResourceFile.value ?? undefined) : undefined,
    url: newResourceMode.value === 'url' ? newResourceUrl.value.trim() : undefined,
  };

  try {
    // Guardar archivo en IndexedDB si existe
    if (newRes.file) {
      await saveFile(id, newRes.file);
    }
    
    // Guardar metadatos del recurso
    const resourceToStore = {
      id: newRes.id,
      name: newRes.name,
      type: newRes.type,
      description: newRes.description,
      createdAt: newRes.createdAt instanceof Date ? newRes.createdAt.toISOString() : newRes.createdAt,
      url: newRes.url,
      transcription: newRes.transcription,
      transcriptionStatus: newRes.transcriptionStatus,
      fileId: newRes.file ? id : undefined
    };
    
    await saveResource(resourceToStore);
    
    // Agregar al estado
    resources.value.unshift(newRes);
    
    console.log(`✅ Recurso ${id} guardado en IndexedDB`);
  } catch (error) {
    console.error('Error al guardar recurso:', error);
  }

  closeAddResourceModal();
};

// Funciones de transcripción
const transcribeSelectedResources = async () => {
  if (selectedResources.value.length === 0) return;
  
  isTranscribing.value = true;
  
  try {
    const selectedResourcesInfo = selectedResources.value
      .map((id) => getResourceById(id))
      .filter(Boolean) as Resource[];

    for (const resource of selectedResourcesInfo) {
      resource.transcriptionStatus = 'processing';

      if (!resource.file) {
        resource.transcriptionStatus = 'error';
        resource.transcription = 'No hay archivo asociado al recurso para transcribir.';
        continue;
      }

      try {
        await transcribeResource(resource);
        resource.transcriptionStatus = 'completed';
      } catch (error) {
        console.error(`Error transcribiendo ${resource.name}:`, error);
        resource.transcriptionStatus = 'error';
        resource.transcription = `Error al transcribir: ${error}`;
      }
    }
    
    const successful = selectedResourcesInfo.filter(r => r.transcriptionStatus === 'completed').length;
    const failed = selectedResourcesInfo.filter(r => r.transcriptionStatus === 'error').length;
    
    messages.value.push({
      id: messageIdCounter++,
      role: 'assistant',
      content: `✅ **Transcripción completada**\n\n` +
        `• Exitosos: ${successful} documento(s)\n` +
        `• Fallidos: ${failed} documento(s)\n\n` +
        `Puedes ver las transcripciones haciendo clic en "Ver Transcripción" en cada recurso.`,
      resources: [...selectedResources.value]
    });

    await scrollToBottom();
    
  } catch (error) {
    console.error('Error en transcripción masiva:', error);
    messages.value.push({
      id: messageIdCounter++,
      role: 'assistant',
      content: `❌ **Error en transcripción**\n\nNo se pudieron transcribir los recursos seleccionados.\n\n**Error:** ${error}`,
      resources: [...selectedResources.value]
    });
  } finally {
    isTranscribing.value = false;
  }
};

// ✅ FUNCIÓN DE TRANSCRIPCIÓN CON PERSISTENCIA
const transcribeResource = async (resource: Resource): Promise<void> => {
  if (!resource.file) {
    throw new Error('No hay archivo asociado al recurso');
  }

  const type = resource.type.toUpperCase();
  
  if (type === 'PDF') {
    resource.transcription = await transcribePDF(resource.file);
  } else if (['WORD', 'DOC', 'DOCX'].includes(type)) {
    resource.transcription = await transcribeDOCX(resource.file);
  } else if (type === 'TXT') {
    resource.transcription = await transcribeTXT(resource.file);
  } else if (['IMAGE', 'PNG', 'JPG', 'JPEG'].includes(type)) {
    resource.transcription = await transcribeImage(resource.file);
  } else {
    throw new Error(`Tipo de archivo no soportado: ${resource.type}`);
  }
  
  // ✅ GUARDAR TRANSCRIPCIÓN EN INDEXEDDB
  try {
    const existingResource = await getAllResources().then(resources => 
      resources.find(r => r.id === resource.id)
    );
    
    if (existingResource) {
      const updatedResource = {
        ...existingResource,
        transcription: resource.transcription,
        transcriptionStatus: resource.transcriptionStatus
      };
      await saveResource(updatedResource);
      console.log(`✅ Transcripción guardada para recurso ${resource.id}`);
    }
  } catch (error) {
    console.error('Error al guardar transcripción:', error);
  }
};

const transcribePDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += `\n--- Página ${pageNum} ---\n${pageText}\n`;
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('Error en transcripción de PDF:', error);
    throw new Error(`Error al procesar PDF: ${error}`);
  }
};

const transcribeDOCX = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (result.messages.length > 0) {
      console.warn('Advertencias al procesar DOCX:', result.messages);
    }
    
    return result.value;
  } catch (error) {
    console.error('Error en transcripción de DOCX:', error);
    throw new Error(`Error al procesar DOCX: ${error}`);
  }
};

const transcribeTXT = async (file: File): Promise<string> => {
  try {
    const text = await file.text();
    return text;
  } catch (error) {
    console.error('Error en transcripción de TXT:', error);
    throw new Error(`Error al procesar TXT: ${error}`);
  }
};

const transcribeImage = async (file: File): Promise<string> => {
  try {
    const result = await Tesseract.recognize(
      file,
      'spa',
      {
        logger: (m: any) => console.log(m)
      }
    );
    
    return result.data.text;
  } catch (error) {
    console.error('Error en OCR de imagen:', error);
    throw new Error(`Error al procesar imagen: ${error}`);
  }
};

// ✅ FUNCIÓN DE CHAT CON IA (GEMINI AI)
const chatWithAI = async () => {
  if (!userInput.value.trim() || selectedResources.value.length === 0) return;

  // Agregar mensaje del usuario
  messages.value.push({
    id: messageIdCounter++,
    role: 'user',
    content: userInput.value,
    resources: []
  });

  const userQuestion = userInput.value;
  userInput.value = '';

  // Scroll al final
  await nextTick();
  messagesEnd.value?.scrollIntoView({ behavior: 'smooth' });

  // Activar estado de carga
  isThinking.value = true;
  
  try {
    // Obtener recursos seleccionados con sus transcripciones
    const selectedResourcesInfo = selectedResources.value
      .map((id) => getResourceById(id))
      .filter(Boolean) as Resource[];

    // Preparar contexto con transcripciones completas
    const resourcesWithTranscriptions = selectedResourcesInfo.map(resource => {
      const transcription = resource.transcription || 'No hay transcripción disponible';
      return {
        ...resource,
        transcription
      };
    });

    const contextWithTranscriptions = resourcesWithTranscriptions.map(resource => 
      `=== RECURSO: ${resource.name} ===\n` +
      `Tipo: ${resource.type}\n` +
      `Descripción: ${resource.description}\n` +
      `Transcripción:\n${resource.transcription}\n` +
      `---`
    ).join('\n\n');

    // Llamar a Gemini AI
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    
    const prompt = `Eres un asistente experto especializado en análisis de documentos académicos. Tu tarea es responder preguntas específicas basándote únicamente en el contenido completo de los recursos transcritos.

Tienes acceso a las transcripciones completas de los siguientes recursos:

${contextWithTranscriptions}

Instrucciones específicas:
- Responde basándote únicamente en el contenido transcribir que se proporciona
- Si la pregunta es sobre información específica, cita o referencia el texto exacto del documento
- Si hay múltiples recursos, compara la información entre ellos
- Proporciona respuestas detalladas y precisas
- Si no encuentras información relevante en las transcripciones, indícalo claramente
- Usa un tono profesional y académico
- Responde en español

Pregunta del usuario: ${userQuestion}

Proporciona una respuesta completa y detallada basada en el contenido transcribir de los documentos.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text() || 'Lo siento, no pude procesar tu pregunta en este momento.';

    // Agregar respuesta de la IA
    messages.value.push({
      id: messageIdCounter++,
      role: 'assistant',
      content: aiResponse,
      resources: [...selectedResources.value]
    });

  } catch (error) {
    console.error('Error en chat con Gemini AI:', error);
    
    // Respuesta de fallback
    const selectedResourcesNames = selectedResources.value
      .map((id) => getResourceById(id)?.name)
      .filter(Boolean)
      .join(', ');

    messages.value.push({
      id: messageIdCounter++,
      role: 'assistant',
      content: `❌ **Error al conectar con Gemini AI**\n\nNo se pudo procesar tu pregunta en este momento. Por favor, intenta nuevamente más tarde.\n\nRecursos seleccionados: ${selectedResourcesNames}`,
      resources: [...selectedResources.value]
    });
  }

  isThinking.value = false;
  
  // Scroll al final
  nextTick(() => {
    messagesEnd.value?.scrollIntoView({ behavior: 'smooth' });
  });
};

// Funciones de visualización
// ✅ FUNCIÓN DE VISUALIZACIÓN DE TRANSCRIPCIÓN CON HIGHLIGHTS
const viewTranscription = async (resource: Resource) => {
  currentTranscription.value = resource;
  showTranscriptionModal.value = true;
  
  // Cargar highlights del recurso
  if (resource.id) {
    await loadHighlightsForResource(resource.id);
  }
};

const copyTranscription = async () => {
  if (!currentTranscription.value?.transcription) return;
  
  try {
    await navigator.clipboard.writeText(currentTranscription.value.transcription);
    alert('Transcripción copiada al portapapeles');
  } catch (error) {
    console.error('Error al copiar:', error);
  }
};

const copyTranscriptionText = async (text?: string) => {
  if (!text) return;
  
  try {
    await navigator.clipboard.writeText(text);
    alert('Transcripción copiada al portapapeles');
  } catch (error) {
    console.error('Error al copiar:', error);
  }
};

const downloadTranscription = () => {
  if (!currentTranscription.value?.transcription) return;
  
  const blob = new Blob([currentTranscription.value.transcription], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `transcripcion-${currentTranscription.value.name}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Utilidades
const countWords = (text?: string): number => {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
};

const countLines = (text?: string): number => {
  if (!text) return 0;
  return text.split('\n').length;
};

const scrollToBottom = async () => {
  await nextTick();
  messagesEnd.value?.scrollIntoView({ behavior: 'smooth' });
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
