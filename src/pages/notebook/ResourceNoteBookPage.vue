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

              <!-- Transcription Text -->
              <div class="bg-white rounded-xl p-6 shadow-sm">
                <h4 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Contenido Transcrito
                </h4>
                <div class="prose prose-sm max-w-none">
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configurar el worker de PDF.js
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdn.jsdelivr.net/npm/pdfjs-dist@3.1.81/build/pdf.worker.min.js';
}

// Configurar Gemini AI
const GEMINI_API_KEY = 'AIzaSyDNP0r2CAaKvjf0sT4DQMvir1b-zTxMVho';
const genAI = new GoogleGenerativeAI({ apiKey: GEMINI_API_KEY });

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

const deleteResource = (id: number) => {
  resources.value = resources.value.filter((r) => r.id !== id);
  selectedResources.value = selectedResources.value.filter((selectedId) => selectedId !== id);
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

const addResource = () => {
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

  resources.value.unshift(newRes);
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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
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
    console.log(response.text());
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

const sendMessage = async () => {
  if (!userInput.value.trim() || selectedResources.value.length === 0) return;

  messages.value.push({
    id: messageIdCounter++,
    role: 'user',
    content: userInput.value,
    resources: []
  });

  const userQuestion = userInput.value;
  userInput.value = '';

  await scrollToBottom();

  isThinking.value = true;
  
  setTimeout(async () => {
    const transcribedResources = selectedResources.value
      .map(id => getResourceById(id))
      .filter(r => r && r.transcription);

    if (transcribedResources.length === 0) {
      messages.value.push({
        id: messageIdCounter++,
        role: 'assistant',
        content: `⚠️ **Recursos no transcritos**\n\nLos recursos seleccionados aún no han sido transcritos. Por favor, haz clic en "Transcribir Seleccionados" primero.`,
        resources: [...selectedResources.value]
      });
      isThinking.value = false;
      await scrollToBottom();
      return;
    }

    const selectedResourcesNames = transcribedResources
      .map(r => r?.name)
      .join(', ');

    let contextInfo = '\n\n📚 **Análisis de documentos:**\n';
    transcribedResources.forEach(r => {
      if (r && r.transcription) {
        const preview = r.transcription.substring(0, 300).replace(/\n/g, ' ');
        const wordCount = r.transcription.split(/\s+/).length;
        contextInfo += `\n📄 **${r.name}** (${wordCount} palabras)\n${preview}...\n`;
      }
    });

    let responseContent = `Basándome en los ${transcribedResources.length} documento(s) seleccionado(s) (${selectedResourcesNames}), aquí está mi análisis sobre: "${userQuestion}"\n`;
    
    responseContent += contextInfo;
    
    responseContent += '';

    messages.value.push({
      id: messageIdCounter++,
      role: 'assistant',
      content: responseContent,
      resources: [...selectedResources.value]
    });

    isThinking.value = false;
    await scrollToBottom();
  }, 2000);
};

const scrollToBottom = async () => {
  await nextTick();
  messagesEnd.value?.scrollIntoView({ behavior: 'smooth' });
};

// Funciones de visualización
const viewTranscription = (resource: Resource) => {
  currentTranscription.value = resource;
  showTranscriptionModal.value = true;
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