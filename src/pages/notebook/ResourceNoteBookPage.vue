<template>
  <div class="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

    <!-- Sidebar Izquierdo - Recursos -->
    <aside class="w-80 bg-white border-r border-blue-100 flex flex-col shadow-lg">
      <!-- Header del Sidebar -->
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <h2 class="text-xl font-bold mb-2 flex items-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Recursos
        </h2>
        <p class="text-white/80 text-sm">Documentos y archivos</p>
      </div>

      <!-- Botones de Acción -->
      <div class="p-4 border-b border-gray-200 space-y-2">
        <button @click="showAddResourceModal = true"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Agregar Recurso
        </button>

        <!-- Botón Transcribir Seleccionados -->
        <button @click="transcribeSelectedResources"
          :disabled="(selectedResources?.length ?? 0) === 0 || isTranscribing"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
          <svg v-if="!isTranscribing" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ isTranscribing ? 'Transcribiendo...' : 'Transcribir Seleccionados' }}
        </button>

        <!-- Botón Vincular Tamizajes/Cuestionarios -->
        <button @click="showLinkScreeningModal = true"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Vincular Tamizajes/Cuestionarios
        </button>

        <!-- Botón Agregar Respuestas de Tamizaje -->
        <button @click="openScreeningResponsesModal"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Agregar Respuestas Tamizaje
        </button>
      </div>

      <!-- Lista de Recursos -->
      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        <div v-if="(resources?.length ?? 0) === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="text-sm text-gray-500">No hay recursos agregados</p>
        </div>

        <!-- Resource Card -->
        <div v-for="resource in resources || []" :key="resource.id" :class="[
          'group bg-white border-2 rounded-xl p-4 transition-all',
          selectedResources.includes(resource.id)
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-200 hover:border-indigo-300'
        ]">
          <div class="flex items-start gap-3">
            <!-- Checkbox -->
            <div class="mt-1 cursor-pointer" @click="toggleResourceSelection(resource.id)">
              <div :class="[
                'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                selectedResources.includes(resource.id)
                  ? 'border-indigo-600 bg-indigo-600'
                  : 'border-gray-300 group-hover:border-indigo-400'
              ]">
                <svg v-if="selectedResources.includes(resource.id)" class="w-3 h-3 text-white" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                  <svg v-if="resource.transcriptionStatus === 'completed'" class="w-3 h-3" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-if="resource.transcriptionStatus === 'processing'" class="w-3 h-3 animate-spin" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {{ resource.transcriptionStatus === 'completed' ? 'Transcrito' :
                    resource.transcriptionStatus === 'processing' ? 'Procesando...' :
                      'Error' }}
                </div>
              </div>

              <!-- Botón Ver Transcripción -->
              <button v-if="resource.transcription" @click="viewTranscription(resource)"
                class="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors font-medium mb-2">
                Ver Transcripción
              </button>

              <div class="flex items-center justify-between text-xs text-gray-400">
                <span>{{ formatDate(resource.createdAt) }}</span>
                <button @click="deleteResource(resource.id)" class="text-red-500 hover:text-red-700 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
          <button @click="activeTab = 'chat'" :class="[
            'flex-1 px-6 py-4 font-medium transition-all border-b-2',
            activeTab === 'chat'
              ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          ]">
            <div class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Chat
            </div>
          </button>
          <button @click="activeTab = 'tree'" :class="[
            'flex-1 px-6 py-4 font-medium transition-all border-b-2',
            activeTab === 'tree'
              ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          ]">
            <div class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Árbol de Recursos
            </div>
          </button>
          <button @click="activeTab = 'notes'" :class="[
            'flex-1 px-6 py-4 font-medium transition-all border-b-2',
            activeTab === 'notes'
              ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          ]">
            <div class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Notas Clínicas
              <span v-if="clinicalNotes.length > 0"
                class="ml-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                {{ clinicalNotes.length }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Tab Content - Single Scroll Container -->
      <div class="flex-1 flex flex-col min-h-0">
        <!-- Chat Tab -->
        <div v-if="activeTab === 'chat'" class="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <!-- Header con botón Crear Cuadro Clínico -->
          <div class="bg-white border-b border-blue-100 shadow-sm flex-shrink-0">
            <div class="p-4 flex items-center justify-between">
              <div>
                <h2 class="text-base font-semibold text-gray-800 mb-1 flex items-center gap-2">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Recursos en la conversación
                </h2>
                <p class="text-xs text-gray-500">Selecciona recursos del panel izquierdo para incluirlos en la
                  conversación</p>
              </div>

              <!-- Botón Crear Cuadro Clínico -->
              <button @click="showClinicalPictureModal = true"
                class="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Crear Cuadro Clínico
              </button>
            </div>

            <div class="px-4 pb-4">
              <div v-if="selectedResources.length === 0"
                class="bg-gray-50 rounded-lg p-4 text-center border border-dashed border-gray-300">
                <p class="text-sm text-gray-500">Selecciona recursos del panel izquierdo para incluirlos en la
                  conversación.</p>
              </div>

              <div v-else class="flex flex-wrap gap-2">
                <div v-for="resourceId in selectedResources" :key="resourceId" :class="[
                  'px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2',
                  getResourceColor(getResourceById(resourceId)?.type || '').badge
                ]">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {{ getResourceById(resourceId)?.name }}
                  <button @click="toggleResourceSelection(resourceId)"
                    class="ml-1 hover:bg-white/30 rounded-full p-0.5">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
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
            <div v-for="message in messages" :key="message.id" :class="[
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            ]">
              <div :class="[
                'max-w-3xl rounded-2xl px-6 py-4',
                message.role === 'user'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-800'
              ]">
                <div class="flex items-start gap-3">
                  <div v-if="message.role === 'assistant'"
                    class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>

                  <div class="flex-1">
                    <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>

                    <!-- Recursos citados -->
                    <div v-if="message.resources && message.resources.length > 0"
                      class="mt-3 pt-3 border-t border-white/20">
                      <p class="text-xs opacity-70 mb-2">Basado en:</p>
                      <div class="flex flex-wrap gap-1">
                        <span v-for="resourceId in message.resources" :key="resourceId"
                          class="text-xs px-2 py-1 bg-white/20 rounded-lg">
                          {{ getResourceById(resourceId)?.name }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div v-if="message.role === 'user'"
                    class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
                    <svg class="w-5 h-5 text-indigo-600 animate-spin" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
              <input v-model="userInput" type="text" placeholder="Pregunta sobre los recursos seleccionados..."
                :disabled="selectedResources.length === 0 || isThinking"
                class="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed" />
              <button type="submit" :disabled="!userInput.trim() || selectedResources.length === 0 || isThinking"
                class="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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
        <div v-if="activeTab === 'tree'" class="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <!-- Header del Árbol -->
          <div class="bg-white border-b border-blue-100 shadow-sm p-4 flex-shrink-0">
            <h2 class="text-base font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Flujo de Transcripciones
            </h2>
            <p class="text-xs text-gray-500">Visualización jerárquica de recursos</p>
          </div>

          <!-- Árbol de Recursos -->
          <div class="flex-1 p-4">
            <div v-if="resources.length === 0" class="text-center py-12">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <p class="text-sm text-gray-500">No hay recursos para mostrar en el árbol</p>
            </div>

            <!-- Árbol con Recursos -->
            <div v-else class="space-y-4">
              <div v-for="resource in resources" :key="resource.id"
                class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <!-- Header del Recurso -->
                <div class="bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-3 border-b border-gray-200">
                  <div class="flex items-center gap-3">
                    <div :class="[
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      getResourceColor(resource.type).bg
                    ]">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p class="text-sm text-gray-500 mb-3">Este recurso aún no ha sido transcrito</p>
                    <button @click="toggleResourceSelection(resource.id); transcribeSelectedResources();"
                      class="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium">
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
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Vista Previa
                        </h4>
                        <div class="flex gap-2">
                          <button @click="viewTranscription(resource)"
                            class="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors">
                            Ver Completo
                          </button>
                          <button @click="copyTranscriptionText(resource.transcription)"
                            class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
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
        <div v-if="activeTab === 'notes'" class="flex-1 flex flex-col min-h-0">
          <!-- Header de Notas Clínicas -->
          <div class="bg-white border-b border-blue-100 shadow-sm p-4 flex-shrink-0">
            <div>
              <h2 class="text-lg font-semibold text-gray-800">Notas Clínicas</h2>
              <p class="text-xs text-gray-500">Notas creadas desde textos subrayados en transcripciones</p>
            </div>
          </div>

          <!-- Contenido de Notas Clínicas -->
          <div class="flex-1 overflow-y-auto p-6 relative">
            <div v-if="clinicalNotes.length === 0" class="text-center py-12">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-800 mb-2">No hay notas clínicas</h3>
              <p class="text-sm text-gray-500 max-w-md mx-auto">
                Abre una transcripción, selecciona texto y subrayalo con los colores disponibles.
                Luego haz doble clic en el subrayado para crear una nota clínica.
              </p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="note in clinicalNotes" :key="note.id"
                class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all">
                <!-- Header de la Nota -->
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-base font-semibold text-gray-900 mb-2 leading-tight">{{ note.title }}</h3>
                    <p class="text-xs text-gray-500 flex items-center gap-2">
                      <span class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">{{
                        note.resourceName }}</span>
                      <span class="text-gray-400">•</span>
                      <span>{{ formatDate(note.createdAt) }}</span>
                    </p>
                  </div>
                  <div class="flex items-center gap-1 ml-2">
                    <button @click="generateTreeFromNote(note)"
                      class="text-indigo-500 hover:text-indigo-700 p-2 rounded-lg hover:bg-indigo-50 transition-all"
                      title="Generar árbol de ideas">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 6h16M4 12h16M4 18h16M8 6v12M16 6v12" />
                      </svg>
                    </button>
                    <button
                      @click="deleteClinicalNote(note.id); clinicalNotes = clinicalNotes.filter(n => n.id !== note.id)"
                      class="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Texto Subrayado -->
                <div class="mb-4 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                  <p class="text-xs text-amber-800 font-medium mb-1 uppercase tracking-wide">Texto subrayado</p>
                  <p class="text-sm text-gray-700 italic leading-relaxed">"{{ note.highlightText }}"</p>
                </div>

                <!-- Descripción de la Nota -->
                <div class="mb-4">
                  <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{{ note.description }}</p>
                </div>

                <!-- Botón Analizar con IA -->
                <div v-if="note.description?.trim()" class="mb-4">
                  <button @click="analyzeNoteWithAI(note)" :disabled="isAnalyzingNote[note.id]"
                    class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg v-if="!isAnalyzingNote[note.id]" class="w-5 h-5" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {{ isAnalyzingNote[note.id] ? 'Analizando...' : 'Analizar con IA' }}
                  </button>
                </div>

                <!-- Resultados del Análisis IA -->
                <div v-if="note.aiAnalysis"
                  class="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
                  <div class="flex items-center gap-2 mb-3">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h4 class="font-semibold text-purple-800">Orientación Clínica (IA)</h4>
                    <span class="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      {{ formatDate(note.aiAnalysis.analyzedAt) }}
                    </span>
                  </div>

                  <div class="space-y-2">
                    <div v-for="(suggestion, index) in note.aiAnalysis.suggestions" :key="index"
                      class="flex items-start gap-3 p-3 bg-white/70 rounded-lg">
                      <span
                        class="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-semibold shrink-0">
                        {{ index + 1 }}
                      </span>
                      <p class="text-sm text-gray-700">{{ suggestion }}</p>
                    </div>
                  </div>

                  <div class="mt-3 pt-3 border-t border-purple-200">
                    <p class="text-xs text-purple-600 italic">
                      ⚠️ Estas son sugerencias orientativas, no constituyen diagnóstico médico. Consulte con un
                      profesional de salud.
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
          <div
            class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 rounded-t-3xl flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-white mb-1">Transcripción del Documento</h3>
              <p class="text-white/80 text-sm">{{ currentTranscription.name }}</p>
            </div>
            <button @click="showTranscriptionModal = false"
              class="text-white hover:bg-white/20 rounded-lg p-2 transition-all">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <div class="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
              <!-- Info del recurso -->
              <div class="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                <div :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  getResourceColor(currentTranscription.type).bg
                ]">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-800">{{ currentTranscription.type }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(currentTranscription.createdAt) }}</p>
                </div>
              </div>

              <!-- Información enriquecida del Paciente y Tamizaje (solo para screening_response) -->
              <div v-if="currentTranscription.type === 'screening_response'"
                class="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <!-- Título del Tamizaje -->
                <div v-if="currentTranscription.screeningTitle" class="mb-3 pb-3 border-b border-blue-200">
                  <p class="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Tamizaje</p>
                  <p class="text-lg font-bold text-gray-800">{{ currentTranscription.screeningTitle }}</p>
                </div>

                <!-- Información del Paciente -->
                <div v-if="currentTranscription.patientInfo" class="grid grid-cols-2 gap-3">
                  <div class="col-span-2">
                    <p class="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Paciente</p>
                    <p class="text-base font-semibold text-gray-800">{{ currentTranscription.patientInfo.name }}</p>
                  </div>
                  <div v-if="currentTranscription.patientInfo.email">
                    <p class="text-xs text-gray-500">Email</p>
                    <p class="text-sm text-gray-700">{{ currentTranscription.patientInfo.email }}</p>
                  </div>
                  <div v-if="currentTranscription.patientInfo.phone">
                    <p class="text-xs text-gray-500">Teléfono</p>
                    <p class="text-sm text-gray-700">{{ currentTranscription.patientInfo.phone }}</p>
                  </div>
                  <div v-if="currentTranscription.patientInfo.dateOfBirth">
                    <p class="text-xs text-gray-500">Fecha de Nacimiento</p>
                    <p class="text-sm text-gray-700">{{ currentTranscription.patientInfo.dateOfBirth }}</p>
                  </div>
                  <div v-if="currentTranscription.patientInfo.gender">
                    <p class="text-xs text-gray-500">Género</p>
                    <p class="text-sm text-gray-700">{{ currentTranscription.patientInfo.gender }}</p>
                  </div>
                  <!-- Badge de verificación -->
                  <div class="col-span-2 mt-2">
                    <span :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      currentTranscription.patientInfo.exists
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    ]">
                      <svg v-if="currentTranscription.patientInfo.exists" class="w-3 h-3 mr-1" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd" />
                      </svg>
                      <svg v-else class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clip-rule="evenodd" />
                      </svg>
                      {{ currentTranscription.patientInfo.exists ? 'Paciente Verificado' : 'Paciente No Encontrado' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Toolbar de Subrayado Mejorado -->
              <div class="mb-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                <div class="flex items-center gap-3 mb-3">
                  <span class="text-sm font-semibold text-gray-700">Selecciona texto y elige un color para
                    subrayar:</span>
                </div>

                <!-- Botones de color que crean highlight directamente -->
                <div class="flex items-center gap-2 flex-wrap">
                  <button v-for="color in highlightColors" :key="color"
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
                    ]" :disabled="!isTextSelected">
                    <div :class="[
                      'w-3 h-3 rounded-full',
                      color === 'yellow' && 'bg-yellow-500',
                      color === 'green' && 'bg-green-500',
                      color === 'red' && 'bg-red-500',
                      color === 'purple' && 'bg-purple-500',
                      color === 'orange' && 'bg-orange-500'
                    ]" />
                    {{ color === 'yellow' ? 'Amarillo' : color === 'green' ? 'Verde' : color === 'red' ? 'Rojo' : color
                      === 'purple' ? 'Púrpura' : 'Naranja' }}
                  </button>
                </div>

                <!-- Mensaje de ayuda -->
                <div class="mt-3 text-xs text-gray-500 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span v-if="isTextSelected">
                    ✅ Texto seleccionado. Haz clic en un color para subrayar.
                  </span>
                  <span v-else>
                    1. Selecciona texto con el mouse → 2. Haz clic en un color para subrayar → 3. Haz doble clic en el
                    subrayado para agregar nota
                  </span>
                </div>
              </div>

              <!-- Transcription Text with Highlights -->
              <div class="bg-white rounded-xl p-6 shadow-sm">
                <h4 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Contenido Transcrito
                </h4>
                <div class="prose prose-sm max-w-none" @mouseup="handleTextSelection">
                  <p class="text-gray-700 whitespace-pre-wrap leading-relaxed">{{ currentTranscription.transcription }}
                  </p>
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
            <button @click="copyTranscription"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-100 text-indigo-700 rounded-xl font-medium hover:bg-indigo-200 transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002 2v8a2 2 0 00-2 2z" />
              </svg>
              Copiar
            </button>
            <button @click="downloadTranscription"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Descargar
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal Agregar Recurso -->
    <transition name="modal">
      <div v-if="showAddResourceModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="closeAddResourceModal">
        <div class="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden" @click.stop>
          <div class="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Agregar Recurso</h3>
              <p class="text-xs text-gray-500">Sube un documento o pega una URL.</p>
            </div>
            <button type="button" @click="closeAddResourceModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="addResource" class="p-6 space-y-4">
            <div>
              <label class="text-xs font-medium text-gray-700">Tipo de recurso</label>
              <select v-model="newResourceMode"
                class="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200">
                <option value="file">Documento (PDF / Word / Excel)</option>
                <option value="url">URL</option>
              </select>
            </div>

            <div v-if="newResourceMode === 'file'">
              <label class="text-xs font-medium text-gray-700">Archivo</label>
              <input type="file" @change="handleFileChange" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                class="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              <p class="text-xs text-gray-500 mt-1">Selecciona un archivo para transcribir.</p>
            </div>

            <div v-if="newResourceMode === 'url'">
              <label class="text-xs font-medium text-gray-700">URL</label>
              <input v-model="newResourceUrl" type="url" placeholder="https://..."
                class="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
            </div>

            <div>
              <label class="text-xs font-medium text-gray-700">Nombre</label>
              <input v-model="newResourceName" type="text" placeholder="Título del recurso"
                class="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
            </div>

            <div>
              <label class="text-xs font-medium text-gray-700">Descripción</label>
              <textarea v-model="newResourceDescription" rows="3" placeholder="Descripción (opcional)"
                class="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"></textarea>
            </div>

            <div class="flex items-center justify-end gap-2">
              <button type="button" @click="closeAddResourceModal"
                class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
                Cancelar
              </button>
              <button type="submit" :disabled="!canAddResource"
                class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Agregar recurso
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal Vincular Tamizajes/Cuestionarios -->
    <transition name="modal">
      <div v-if="showLinkScreeningModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="showLinkScreeningModal = false">
        <div class="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          @click.stop>
          <!-- Header -->
          <div
            class="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-600 to-pink-600">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white">Vincular Tamizajes y Cuestionarios</h3>
                <p class="text-xs text-white/80">Selecciona tamizajes auditivos y cuestionarios de tinnitus para
                  vincular al cuaderno clínico.</p>
              </div>
            </div>
            <button type="button" @click="showLinkScreeningModal = false"
              class="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Search -->
          <div class="p-4 border-b border-gray-200">
            <div class="relative">
              <input v-model="screeningSearchQuery" type="text" placeholder="Buscar tamizajes o cuestionarios..."
                class="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all" />
              <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-4 space-y-6">
            <!-- Loading State -->
            <div v-if="isLoadingScreenings" class="text-center py-8">
              <svg class="w-8 h-8 animate-spin mx-auto mb-3 text-purple-600" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <p class="text-sm text-gray-600">Cargando tamizajes y cuestionarios...</p>
            </div>

            <template v-else>
              <!-- Tamizajes Section -->
              <div>
                <h4 class="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                    </svg>
                  </div>
                  Tamizajes Auditivos
                </h4>
                <div class="space-y-2">
                  <div v-for="screening in availableScreenings" :key="screening.id"
                    @click="toggleScreeningSelection(screening.id)" :class="[
                      'p-3 rounded-xl border-2 cursor-pointer transition-all',
                      selectedScreeningIds.includes(screening.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    ]">
                    <div class="flex items-start gap-3">
                      <div :class="[
                        'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                        selectedScreeningIds.includes(screening.id)
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      ]">
                        <svg v-if="selectedScreeningIds.includes(screening.id)" class="w-3 h-3 text-white" fill="none"
                          stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div class="flex-1">
                        <h5 class="font-medium text-gray-800">{{ screening.title }}</h5>
                        <p class="text-xs text-gray-500 line-clamp-2">{{ screening.description }}</p>
                        <div class="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          <span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Tamizaje</span>
                          <span v-if="screening.soundTitle">• {{ screening.soundTitle }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="availableScreenings.length === 0" class="text-center py-4 text-sm text-gray-500">
                    No hay tamizajes disponibles
                  </div>
                </div>
              </div>

              <!-- Questionnaires Section -->
              <div>
                <h4 class="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  Cuestionarios de Tinnitus
                </h4>
                <div class="space-y-2">
                  <div v-for="questionnaire in availableQuestionnaires" :key="questionnaire.id"
                    @click="toggleQuestionnaireSelection(String(questionnaire.id))" :class="[
                      'p-3 rounded-xl border-2 cursor-pointer transition-all',
                      selectedQuestionnaireIds.includes(String(questionnaire.id))
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    ]">
                    <div class="flex items-start gap-3">
                      <div :class="[
                        'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                        selectedQuestionnaireIds.includes(String(questionnaire.id))
                          ? 'border-purple-600 bg-purple-600'
                          : 'border-gray-300'
                      ]">
                        <svg v-if="selectedQuestionnaireIds.includes(String(questionnaire.id))"
                          class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div class="flex-1">
                        <h5 class="font-medium text-gray-800">{{ questionnaire.title }}</h5>
                        <p class="text-xs text-gray-500 line-clamp-2">{{ questionnaire.description }}</p>
                        <div class="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          <span class="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Cuestionario</span>
                          <span v-if="questionnaire.questions">• {{ questionnaire.questions.length }} preguntas</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="availableQuestionnaires.length === 0" class="text-center py-4 text-sm text-gray-500">
                    No hay cuestionarios disponibles
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <span class="text-sm text-gray-600">
              {{ selectedScreeningIds.length + selectedQuestionnaireIds.length }} seleccionados
            </span>
            <div class="flex items-center gap-2">
              <button type="button" @click="showLinkScreeningModal = false"
                class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
                Cancelar
              </button>
              <button type="button" @click="linkSelectedScreeningsAndQuestionnaires"
                :disabled="selectedScreeningIds.length === 0 && selectedQuestionnaireIds.length === 0"
                class="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Vincular Seleccionados
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal Nota de Highlight -->
    <transition name="modal">
      <div v-if="showHighlightNoteModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="closeHighlightNoteModal">
        <div class="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden" @click.stop>
          <div class="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">
                {{ currentHighlight?.noteId ? 'Editar Nota Clínica' : 'Crear Nota Clínica' }}
              </h3>
              <p class="text-xs text-gray-500">Agrega información clínica sobre el texto subrayado.</p>
            </div>
            <button type="button" @click="closeHighlightNoteModal"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
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
              <input v-model="noteForm.title" type="text"
                placeholder="Ej: Síntoma importante, Tratamiento recomendado..."
                class="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                required />
            </div>

            <div>
              <label class="text-xs font-medium text-gray-700">Descripción</label>
              <textarea v-model="noteForm.description" rows="4"
                placeholder="Describe la relevancia clínica de este texto..."
                class="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                required></textarea>
            </div>

            <div class="flex items-center justify-end gap-2">
              <button v-if="currentHighlight?.noteId" type="button"
                @click="deleteHighlightWithNote(currentHighlight.id)"
                class="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200">
                Eliminar
              </button>
              <button type="button" @click="closeHighlightNoteModal"
                class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
                Cancelar
              </button>
              <button type="submit" class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
                {{ currentHighlight?.noteId ? 'Actualizar Nota' : 'Guardar Nota' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal de Visualización de Árbol (Vue Flow) -->
    <transition name="fade">
      <div v-if="showTreeModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="showTreeModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-indigo-100 rounded-lg">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16M8 6v12M16 6v12" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-800">Árbol de Ideas</h3>
                <p class="text-sm text-gray-500">{{ currentTreeNote?.title }}</p>
              </div>
            </div>
            <button @click="showTreeModal = false"
              class="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Vue Flow Canvas -->
          <div class="flex-1 relative bg-gray-50">
            <VueFlow v-model:nodes="treeNodes" v-model:edges="treeEdges" :default-viewport="{ x: 0, y: 0, zoom: 1 }"
              :min-zoom="0.2" :max-zoom="4" fit-view-on-init class="w-full h-full">
              <!-- Panel de controles -->
              <div class="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button @click="fitView"
                  class="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all text-gray-600 hover:text-indigo-600"
                  title="Ajustar vista">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
            </VueFlow>
          </div>

          <!-- Footer con instrucciones -->
          <div class="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
            <span>Arrastra para mover • Usa la rueda del ratón para zoom</span>
            <span class="text-indigo-600 font-medium">{{ treeNodes.length }} nodos • {{ treeEdges.length }}
              conexiones</span>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal de Nuevo Cuadro Clínico -->
    <transition name="fade">
      <div v-if="showClinicalPictureModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="closeClinicalPictureModal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-emerald-50">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-emerald-100 rounded-lg">
                <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800">Nuevo Cuadro Clínico</h3>
            </div>
            <button @click="closeClinicalPictureModal"
              class="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Formulario -->
          <div class="p-6 space-y-4">
            <!-- Título -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input v-model="clinicalPictureForm.title" type="text"
                placeholder="Ej: Consulta inicial - Paciente Juan Pérez"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>

            <!-- Nombre del Paciente -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Paciente</label>
              <input v-model="clinicalPictureForm.patientName" type="text" placeholder="Nombre completo del paciente"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>

            <!-- Descripción -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea v-model="clinicalPictureForm.description" rows="3"
                placeholder="Descripción general del caso o motivo de consulta"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none" />
            </div>

            <!-- Estado -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select v-model="clinicalPictureForm.status"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                <option value="draft">Borrador</option>
                <option value="active">Activo</option>
                <option value="completed">Completado</option>
                <option value="archived">Archivado</option>
              </select>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button @click="closeClinicalPictureModal"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors">
              Cancelar
            </button>
            <button @click="createNewClinicalPicture"
              :disabled="isLoadingClinicalPictures || !clinicalPictureForm.title.trim()"
              class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-lg transition-all flex items-center gap-2">
              <svg v-if="isLoadingClinicalPictures" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {{ isLoadingClinicalPictures ? 'Creando...' : 'Crear Cuadro Clínico' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal de Respuestas de Tamizaje -->
    <transition name="modal">
      <div v-if="showScreeningResponsesModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="closeScreeningResponsesModal">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col"
          @click.stop>
          <!-- Header -->
          <div class="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white">Agregar Respuestas de Tamizaje</h3>
                  <p class="text-white/80 text-sm">Selecciona una respuesta para agregar a recursos y transcribir</p>
                </div>
              </div>
              <button @click="closeScreeningResponsesModal"
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
              <input v-model="screeningResponsesSearchQuery" type="text"
                placeholder="Buscar por ID, paciente o tamizaje..."
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all" />
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
            <div v-if="isLoadingScreeningResponses" class="flex flex-col items-center justify-center py-12">
              <svg class="w-12 h-12 text-cyan-600 animate-spin mb-4" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <p class="text-gray-600">Cargando respuestas de tamizaje...</p>
            </div>

            <!-- Empty -->
            <div v-else-if="filteredScreeningResponses.length === 0"
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
              <div v-for="response in filteredScreeningResponses" :key="response.id"
                @click="toggleScreeningResponse(response)"
                class="p-4 bg-white border-2 rounded-xl cursor-pointer transition-all hover:border-cyan-400 hover:shadow-lg"
                :class="selectedScreeningResponses.some(r => r.id === response.id) ? 'border-cyan-500 ring-2 ring-cyan-100' : 'border-gray-200'">
                <div class="flex items-start gap-4">
                  <!-- Checkbox explícito -->
                  <div class="flex items-center justify-center shrink-0 pt-1">
                    <div class="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                      :class="selectedScreeningResponses.some(r => r.id === response.id) ? 'bg-cyan-500 border-cyan-500' : 'border-gray-300 bg-white'">
                      <svg v-if="selectedScreeningResponses.some(r => r.id === response.id)"
                        class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div
                    class="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold shrink-0">
                    {{ response.id?.slice(0, 2).toUpperCase() }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h4 class="font-semibold text-gray-800">Respuesta #{{ response.id?.slice(-6) || 'N/A' }}</h4>
                      <span class="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">
                        {{ (response.options_answer?.length || 0) }} respuestas
                      </span>
                    </div>
                    <p class="text-sm text-gray-500">
                      <span class="font-medium">Paciente:</span> {{ response.patientInfo?.name || response.patientName
                        ||
                        response.id_patient?.slice(-8) || 'N/A' }}
                      <span v-if="response.patientExists === false"
                        class="ml-2 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                        No existe
                      </span>
                      <span v-else-if="response.patientExists === true"
                        class="ml-2 px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                        Verificado
                      </span>
                    </p>
                    <!-- Información adicional del paciente si existe -->
                    <div v-if="response.patientExists && response.patientInfo" class="mt-2 space-y-1">
                      <p v-if="response.patientInfo.email" class="text-xs text-gray-500">
                        <span class="font-medium">Email:</span> {{ response.patientInfo.email }}
                      </p>
                      <p v-if="response.patientInfo.phone" class="text-xs text-gray-500">
                        <span class="font-medium">Tel:</span> {{ response.patientInfo.phone }}
                      </p>
                      <p v-if="response.patientInfo.dateOfBirth" class="text-xs text-gray-500">
                        <span class="font-medium">Fecha Nac:</span> {{ new
                          Date(response.patientInfo.dateOfBirth).toLocaleDateString('es-ES') }}
                      </p>
                      <p v-if="response.patientInfo.gender" class="text-xs text-gray-500">
                        <span class="font-medium">Género:</span> {{ response.patientInfo.gender === 'male' ? 'Masculino'
                          :
                          response.patientInfo.gender === 'female' ? 'Femenino' : response.patientInfo.gender }}
                      </p>
                    </div>
                    <p class="text-sm text-gray-500 mt-2">
                      <span class="font-medium">Tamizaje:</span> {{ response.screeningTitle ||
                        response.id_screening?.slice(-8) || 'N/A' }}
                    </p>
                    <p class="text-xs text-gray-400 mt-1">
                      Creado: {{ response.created_at ? formatScreeningResponseDate(response.created_at) : 'N/A' }}
                    </p>
                    <!-- Opciones -->
                    <div v-if="(response.options_answer?.length || 0) > 0" class="mt-3 flex flex-wrap gap-2">
                      <span v-for="opt in response.options_answer?.slice(0, 3) || []" :key="opt.id"
                        class="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                        {{ opt.text }}: {{ opt.value === 1 ? 'Sí' : 'No' }}
                      </span>
                      <span v-if="(response.options_answer?.length || 0) > 3" class="px-2 py-1 text-gray-400 text-xs">
                        +{{ (response.options_answer?.length || 0) - 3 }} más
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <p class="text-sm text-gray-600">
              <span class="font-semibold">{{ filteredScreeningResponses.length }}</span> respuesta(s) encontrada(s)
            </p>
            <div class="flex gap-3">
              <button @click="closeScreeningResponsesModal"
                class="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-all">
                Cancelar
              </button>
              <button @click="addScreeningResponseToResources" :disabled="selectedScreeningResponses.length === 0"
                class="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Agregar {{ selectedScreeningResponses.length > 0 ? `(${selectedScreeningResponses.length})` : '' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Botones Flotantes de Cuadro Clínico y Árbol (fuera de tabs) -->
    <div class="fixed bottom-6 right-24 z-40 flex flex-col gap-3">
      <!-- Botón flotante Ver Cuadros Clínicos -->
      <button @click="router.push('/clinical-pictures')"
        class="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-10 group"
        title="Ver todos los cuadros clínicos">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span
          class="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Ver cuadros clínicos
        </span>
      </button>

      <!-- Botón flotante del árbol global -->
      <button @click="generateGlobalTree"
        class="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-10 group"
        title="Ver árbol global de notas">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16M8 6v12M16 6v12" />
        </svg>
        <span
          class="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Árbol global
        </span>
      </button>
    </div>

    <!-- Botón Flotante de Configuración de Subrayado -->
    <div class="fixed bottom-6 right-6 z-40">
      <!-- Menú de configuración -->
      <transition name="scale">
        <div v-if="showHighlightConfigMenu"
          class="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-72 mb-2">
          <div class="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
            <h4 class="font-semibold text-gray-800 text-sm">Configuración de Subrayado</h4>
            <button @click="showHighlightConfigMenu = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Colores por defecto -->
          <div class="mb-4">
            <p class="text-xs font-medium text-gray-600 mb-2">Color por defecto:</p>
            <div class="flex gap-2">
              <button v-for="color in highlightColors" :key="color" @click="selectedHighlightColor = color" :class="[
                'w-8 h-8 rounded-lg border-2 transition-all',
                selectedHighlightColor === color ? 'border-gray-800 scale-110' : 'border-transparent',
                color === 'yellow' && 'bg-yellow-300',
                color === 'green' && 'bg-green-300',
                color === 'red' && 'bg-red-300',
                color === 'purple' && 'bg-purple-300',
                color === 'orange' && 'bg-orange-300'
              ]" :title="color" />
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
            <button @click="clearAllHighlightsConfirm"
              class="w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Limpiar todos los subrayados
            </button>
            <button @click="exportHighlights"
              class="w-full px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exportar subrayados
            </button>
          </div>
        </div>
      </transition>

      <!-- Botón principal flotante -->
      <button @click="showHighlightConfigMenu = !showHighlightConfigMenu" :class="[
        'w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center',
        showHighlightConfigMenu
          ? 'bg-gray-800 text-white rotate-45'
          : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-110 hover:shadow-xl'
      ]" title="Configuración de Subrayado">
        <svg v-if="!showHighlightConfigMenu" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { VueFlow, useVueFlow, Position } from '@vue-flow/core';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
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

// Importar servicio de Cuadro Clínico
import {
  createClinicalPicture,
  getClinicalPictureById,
  listClinicalPictures,
  updateClinicalPicture,
  deleteClinicalPicture,
  addChatMessage,
  addClinicalNote as addNoteToClinicalPicture,
  addTranscription,
  addResource as addResourceToClinicalPicture
} from '../../services/clinicalPictureService';
import type {
  ClinicalPicture,
  CreateClinicalPictureDTO,
  ClinicalPictureChatMessage
} from '../../types/clinicalPicture';

// Importar servicio de integración para tamizajes y cuestionarios
import {
  getAllScreenings,
  getAllQuestionnaires,
  searchScreeningsAndQuestionnaires,
  generateTranscription,
  formatAsResource,
  type Screening,
  type Questionnaire
} from '../../services/clinicalIntegrationService';

// Configurar el worker de PDF.js
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdn.jsdelivr.net/npm/pdfjs-dist@3.1.81/build/pdf.worker.min.js';
}

// Configurar Gemini AI
const GEMINI_API_KEY = 'AIzaSyCxqVJx2Mr3CmNtmEYSyjpgAn1uVHOhcvM';
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
  // Información enriquecida para recursos de tamizaje
  patientInfo?: PatientInfo;
  screeningTitle?: string;
  idPatient?: string;
  idScreening?: string;
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

// Variables para Vue Flow - Visualización de árbol de notas
const showTreeModal = ref(false);
const treeNodes = ref<Array<{ id: string, label: string, position: { x: number, y: number }, style?: Record<string, string> }>>([]);
const treeEdges = ref<Array<{ id: string, source: string, target: string }>>([]);
const currentTreeNote = ref<ClinicalNote | null>(null);

// Variables para Cuadro Clínico
const clinicalPictures = ref<ClinicalPicture[]>([]);
const currentClinicalPicture = ref<ClinicalPicture | null>(null);
const showClinicalPictureModal = ref(false);
const clinicalPictureForm = ref<CreateClinicalPictureDTO>({
  title: '',
  description: '',
  patientName: '',
  status: 'draft'
});
const isLoadingClinicalPictures = ref(false);

// Variables para Tamizajes y Cuestionarios
const showLinkScreeningModal = ref(false);
const availableScreenings = ref<Screening[]>([]);
const availableQuestionnaires = ref<Questionnaire[]>([]);
const screeningSearchQuery = ref('');
const isLoadingScreenings = ref(false);
const selectedScreeningIds = ref<string[]>([]);
const selectedQuestionnaireIds = ref<string[]>([]);

// Variables para Respuestas de Tamizaje
const showScreeningResponsesModal = ref(false);
const screeningResponses = ref<ScreeningResponse[]>([]);
const selectedScreeningResponses = ref<ScreeningResponse[]>([]);
const screeningResponsesSearchQuery = ref('');
const isLoadingScreeningResponses = ref(false);

// Interface para información del paciente
interface PatientInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  exists: boolean;
}

// Interface para respuestas de tamizaje
interface ScreeningResponse {
  id: string;
  id_patient: string;
  id_screening: string;
  options_answer: Array<{ id: string; text: string; value: number }>;
  created_at: string;
  updated_at: string;
  patientName?: string;
  screeningTitle?: string;
  patientInfo?: PatientInfo;
  patientExists?: boolean;
}

// Computed para filtrar respuestas de tamizaje
const filteredScreeningResponses = computed(() => {
  if (!screeningResponsesSearchQuery.value.trim()) {
    return screeningResponses.value;
  }
  const query = screeningResponsesSearchQuery.value.toLowerCase();
  return screeningResponses.value.filter(response =>
    response.id.toLowerCase().includes(query) ||
    response.id_patient.toLowerCase().includes(query) ||
    response.id_screening.toLowerCase().includes(query) ||
    response.patientName?.toLowerCase().includes(query) ||
    response.screeningTitle?.toLowerCase().includes(query)
  );
});

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

// Router
const router = useRouter();

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

// ✅ FUNCIONES PARA TAMIZAJES Y CUESTIONARIOS

/**
 * Cargar tamizajes y cuestionarios cuando se abre el modal
 */
const loadScreeningsAndQuestionnaires = async () => {
  isLoadingScreenings.value = true;
  try {
    const [screenings, questionnaires] = await Promise.all([
      getAllScreenings(),
      getAllQuestionnaires()
    ]);
    availableScreenings.value = screenings;
    availableQuestionnaires.value = questionnaires;
  } catch (error) {
    console.error('Error loading screenings and questionnaires:', error);
    alert('Error al cargar tamizajes y cuestionarios');
  } finally {
    isLoadingScreenings.value = false;
  }
};

/**
 * Toggle selección de tamizaje
 */
const toggleScreeningSelection = (id: string) => {
  const index = selectedScreeningIds.value.indexOf(id);
  if (index === -1) {
    selectedScreeningIds.value.push(id);
  } else {
    selectedScreeningIds.value.splice(index, 1);
  }
};

/**
 * Toggle selección de cuestionario
 */
const toggleQuestionnaireSelection = (id: string) => {
  const index = selectedQuestionnaireIds.value.indexOf(id);
  if (index === -1) {
    selectedQuestionnaireIds.value.push(id);
  } else {
    selectedQuestionnaireIds.value.splice(index, 1);
  }
};

/**
 * Vincular tamizajes y cuestionarios seleccionados como recursos
 */
const linkSelectedScreeningsAndQuestionnaires = async () => {
  try {
    // Vincular tamizajes seleccionados
    for (const screeningId of selectedScreeningIds.value) {
      const screening = availableScreenings.value.find(s => s.id === screeningId);
      if (screening) {
        // Generar transcripción del tamizaje
        const transcription = await generateTranscription('screening', screeningId);

        // Crear recurso estructurado
        const resource = formatAsResource(screening, 'screening');

        // Agregar a recursos
        resources.value.push({
          ...resource,
          transcription,
          transcriptionStatus: 'completed'
        });

        // Guardar en persistencia
        await saveResource({
          id: resource.id,
          name: resource.name,
          type: resource.type,
          description: resource.description,
          url: resource.url,
          transcription,
          createdAt: resource.createdAt instanceof Date ? resource.createdAt.toISOString() : resource.createdAt
        });

        console.log('✅ Tamizaje vinculado:', screening.title);
      }
    }

    // Vincular cuestionarios seleccionados
    for (const questionnaireId of selectedQuestionnaireIds.value) {
      const questionnaire = availableQuestionnaires.value.find(q => String(q.id) === questionnaireId);
      if (questionnaire) {
        // Generar transcripción del cuestionario
        const transcription = await generateTranscription('questionnaire', questionnaireId);

        // Crear recurso estructurado
        const resource = formatAsResource(questionnaire, 'questionnaire');

        // Agregar a recursos
        resources.value.push({
          ...resource,
          transcription,
          transcriptionStatus: 'completed'
        });

        // Guardar en persistencia
        await saveResource({
          id: resource.id,
          name: resource.name,
          type: resource.type,
          description: resource.description,
          url: resource.url,
          transcription,
          createdAt: resource.createdAt instanceof Date ? resource.createdAt.toISOString() : resource.createdAt
        });

        console.log('✅ Cuestionario vinculado:', questionnaire.title);
      }
    }

    // Mostrar mensaje de éxito
    const totalLinked = selectedScreeningIds.value.length + selectedQuestionnaireIds.value.length;
    alert(`${totalLinked} elemento(s) vinculado(s) exitosamente al cuaderno clínico`);

    // Cerrar modal y limpiar selecciones
    showLinkScreeningModal.value = false;
    selectedScreeningIds.value = [];
    selectedQuestionnaireIds.value = [];

  } catch (error) {
    console.error('Error linking screenings/questionnaires:', error);
    alert('Error al vincular elementos. Por favor intente nuevamente.');
  }
};

// Watch para cargar datos cuando se abre el modal
watch(showLinkScreeningModal, (newValue) => {
  if (newValue) {
    loadScreeningsAndQuestionnaires();
  }
});

// ✅ FUNCIONES PARA RESPUESTAS DE TAMIZAJE

/**
 * Abrir modal de respuestas de tamizaje
 */
const openScreeningResponsesModal = async () => {
  showScreeningResponsesModal.value = true;
  screeningResponsesSearchQuery.value = '';
  selectedScreeningResponses.value = [];
  await loadScreeningResponses();
};

/**
 * Cerrar modal de respuestas de tamizaje
 */
const closeScreeningResponsesModal = () => {
  showScreeningResponsesModal.value = false;
  selectedScreeningResponses.value = [];
};

/**
 * Cargar respuestas de tamizaje desde el API y enriquecer con nombres
 */
const loadScreeningResponses = async () => {
  isLoadingScreeningResponses.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/v1/screening-responses/all', {
      timeout: 30000,
    });
    const rawResponses = response.data || [];

    // Enriquecer respuestas con nombres de pacientes y tamizajes
    screeningResponses.value = await enrichScreeningResponses(rawResponses);
  } catch (error: any) {
    let message = 'No se pudo cargar la lista de respuestas.';
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message = 'Error del servidor al obtener respuestas.';
      } else if (error.request) {
        message = 'No se pudo conectar con el servidor.';
      }
    }
    console.error('Error loading screening responses:', error);
    alert(message);
  } finally {
    isLoadingScreeningResponses.value = false;
  }
};

/**
 * Verificar si un paciente existe y obtener su información básica
 * Con logging detallado y manejo de caché (304)
 */
const verifyPatientExists = async (id: string): Promise<PatientInfo> => {
  console.log(`[PatientAPI] Iniciando verificación de paciente ID: ${id}`);
  console.log(`[PatientAPI] Endpoint: GET /api/v1/patients/${id}`);

  try {
    const response = await axios.get(`http://localhost:3000/api/v1/patients/${id}`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    // Logging de respuesta exitosa
    console.log(`[PatientAPI] Respuesta exitosa para paciente ${id}`);
    console.log(`[PatientAPI] Status: ${response.status} ${response.statusText}`);
    console.log(`[PatientAPI] Headers:`, response.headers);
    console.log(`[PatientAPI] Datos recibidos:`, response.data);

    const patient = response.data;

    if (patient) {
      console.log(`[PatientAPI] Paciente ${id} encontrado:`, {
        name: patient.fullName || patient.name,
        email: patient.email,
        phone: patient.phone
      });

      return {
        id: id,
        name: patient.fullName || patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Nombre no disponible',
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: patient.birthDate || patient.dateOfBirth,
        gender: patient.gender,
        exists: true
      };
    }

    console.warn(`[PatientAPI] Paciente ${id} no encontrado en la respuesta`);
    return { id, name: 'Paciente no encontrado', exists: false };

  } catch (error: any) {
    console.error(`[PatientAPI] Error al verificar paciente ${id}:`, error);

    // Manejo específico de códigos de estado HTTP
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const errorData = error.response?.data;

      console.error(`[PatientAPI] Status Code: ${statusCode}`);
      console.error(`[PatientAPI] Error Data:`, errorData);
      console.error(`[PatientAPI] Error Message:`, error.message);

      // Alerta personalizada para 304 Not Modified
      if (statusCode === 304) {
        const alertMessage = `⚠️ Alerta: Status 304 Not Modified\n\nEl servidor está devolviendo un código 304 porque:\n\n1. La información del paciente (ID: ${id}) no ha cambiado desde la última solicitud.\n2. El navegador o un proxy intermedio está cacheando la respuesta.\n3. No hay nueva información para actualizar.\n\nEsto es un comportamiento normal de caché HTTP.\nLos datos mostrados provienen de la caché local.`;

        console.warn(`[PatientAPI] Alerta 304: Datos de paciente ${id} obtenidos de caché`);
        alert(alertMessage);

        // Intentar obtener datos de caché local si existen
        const cachedResponse = screeningResponses.value.find(r => r.id_patient === id);
        if (cachedResponse?.patientInfo) {
          console.log(`[PatientAPI] Retornando datos en caché para paciente ${id}`);
          return cachedResponse.patientInfo;
        }

        return { id, name: 'Paciente (datos en caché)', exists: true };
      }

      // Manejo de otros errores HTTP comunes
      switch (statusCode) {
        case 400:
          console.error(`[PatientAPI] Error 400: Solicitud inválida para paciente ${id}`);
          break;
        case 401:
          console.error(`[PatientAPI] Error 401: No autorizado`);
          break;
        case 403:
          console.error(`[PatientAPI] Error 403: Acceso prohibido`);
          break;
        case 404:
          console.warn(`[PatientAPI] Error 404: Paciente ${id} no existe en la base de datos`);
          break;
        case 500:
          console.error(`[PatientAPI] Error 500: Error interno del servidor`);
          break;
        case 502:
          console.error(`[PatientAPI] Error 502: Bad Gateway`);
          break;
        case 503:
          console.error(`[PatientAPI] Error 503: Servicio no disponible`);
          break;
        default:
          console.error(`[PatientAPI] Error ${statusCode}: Error desconocido`);
      }

      // Log de error de red
      if (error.request && !error.response) {
        console.error(`[PatientAPI] Error de red: No se pudo conectar al servidor`);
        console.error(`[PatientAPI] Request config:`, error.config);
      }
    } else {
      // Error no relacionado con Axios
      console.error(`[PatientAPI] Error no-HTTP:`, error);
    }

    console.warn(`[PatientAPI] Retornando estado 'no encontrado' para paciente ${id}`);
    return { id, name: 'Paciente no encontrado', exists: false };
  }
};

/**
 * Obtener título de tamizaje por ID
 * Consume el endpoint /api/v1/screenings/:id para obtener el título
 */
const getScreeningTitleById = async (id: string): Promise<string | null> => {
  console.log(`[ScreeningAPI] Obteniendo título para tamizaje ID: ${id}`);

  try {
    const response = await axios.get(`http://localhost:3000/api/v1/screenings/${id}`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json'
      }
    });

    console.log(`[ScreeningAPI] Respuesta exitosa para tamizaje ${id}`);
    console.log(`[ScreeningAPI] Status: ${response.status}`);
    console.log(`[ScreeningAPI] Datos recibidos:`, response.data);

    const screening = response.data;

    if (screening && screening.title) {
      console.log(`[ScreeningAPI] Título encontrado: "${screening.title}"`);
      return screening.title;
    }

    console.warn(`[ScreeningAPI] No se encontró título en la respuesta para tamizaje ${id}`);
    return null;
  } catch (error: any) {
    console.error(`[ScreeningAPI] Error al obtener título del tamizaje ${id}:`, error);

    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      console.error(`[ScreeningAPI] Status Code: ${statusCode}`);

      switch (statusCode) {
        case 304:
          console.warn(`[ScreeningAPI] Datos de tamizaje ${id} obtenidos de caché`);
          break;
        case 404:
          console.warn(`[ScreeningAPI] Tamizaje ${id} no encontrado`);
          break;
        default:
          console.error(`[ScreeningAPI] Error ${statusCode}:`, error.message);
      }
    }

    return null;
  }
};

/**
 * Enriquecer respuestas con nombres de pacientes y títulos de tamizajes
 * Consume endpoints /api/v1/patients/:id y /api/v1/screenings/:id
 */
const enrichScreeningResponses = async (responses: ScreeningResponse[] | any): Promise<ScreeningResponse[]> => {
  // Validar que responses sea un array
  if (!Array.isArray(responses)) {
    console.warn('responses no es un array:', responses);
    // Si es un objeto con una propiedad que contiene el array, intentar extraerlo
    if (responses && typeof responses === 'object') {
      const possibleArray = responses.data || responses.items || responses.results || Object.values(responses)[0];
      if (Array.isArray(possibleArray)) {
        responses = possibleArray;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  console.log(`[Enrich] Enriqueciendo ${responses.length} respuestas de tamizaje`);

  const enriched = await Promise.all(
    responses.map(async (response) => {
      // Verificar que el paciente existe y obtener su información
      // También obtener el título del tamizaje desde el endpoint dedicado
      const [patientInfo, screeningTitle] = await Promise.all([
        verifyPatientExists(response.id_patient),
        getScreeningTitleById(response.id_screening)
      ]);

      console.log(`[Enrich] Respuesta ${response.id} enriquecida:`, {
        patientName: patientInfo.name,
        patientExists: patientInfo.exists,
        screeningTitle: screeningTitle || 'No disponible'
      });

      return {
        ...response,
        patientName: patientInfo.name,
        patientInfo: patientInfo,
        patientExists: patientInfo.exists,
        screeningTitle: screeningTitle || undefined
      };
    })
  );

  console.log(`[Enrich] ${enriched.length} respuestas enriquecidas exitosamente`);
  return enriched;
};

/**
 * Seleccionar una sola respuesta de tamizaje (comportamiento radio button)
 */
const toggleScreeningResponse = (response: ScreeningResponse) => {
  // Si ya está seleccionada, deseleccionarla
  const index = selectedScreeningResponses.value.findIndex(r => r.id === response.id);
  if (index !== -1) {
    selectedScreeningResponses.value = [];
  } else {
    // Reemplazar selección anterior con la nueva
    selectedScreeningResponses.value = [response];
  }
};

/**
 * Agregar respuestas seleccionadas a recursos con transcripción
 */
const addScreeningResponseToResources = async () => {
  if (selectedScreeningResponses.value.length === 0) return;

  try {
    let addedCount = 0;

    for (const response of selectedScreeningResponses.value) {
      // Validar campos requeridos
      if (!response.id_patient) {
        console.warn('Respuesta sin id_patient, omitiendo:', response.id);
        continue;
      }
      if (!response.id_screening) {
        console.warn('Respuesta sin id_screening, omitiendo:', response.id);
        continue;
      }

      // Crear texto de transcripción con las respuestas
      const optionsText = response.options_answer
        ?.map((opt: { text: string; value: number }) => `${opt.text}: ${opt.value === 1 ? 'Sí' : 'No'}`)
        .join('\n') || '';

      const transcriptionText = `Respuesta de Tamizaje

Paciente ID: ${response.id_patient}
Tamizaje ID: ${response.id_screening}
Fecha: ${new Date(response.created_at).toLocaleDateString('es-ES')}

Respuestas:
${optionsText}`;

      // Crear recurso con información enriquecida
      const newResource: Resource = {
        id: resourceIdCounter.value++,
        name: `Respuesta Tamizaje - ${response.id_patient.slice(-8)}`,
        type: 'screening_response',
        description: `Respuestas del tamizaje ${response.id_screening.slice(-8)} - ${response.options_answer?.length || 0} preguntas respondidas`,
        createdAt: new Date(),
        url: `/screening-responses/${response.id}`,
        transcription: transcriptionText,
        transcriptionStatus: 'completed',
        // Información enriquecida del paciente y tamizaje
        patientInfo: response.patientInfo,
        screeningTitle: response.screeningTitle,
        idPatient: response.id_patient,
        idScreening: response.id_screening
      };

      // Agregar a la lista de recursos
      resources.value.push(newResource);

      // Guardar en persistencia
      await saveResource({
        id: newResource.id,
        name: newResource.name,
        type: newResource.type,
        description: newResource.description,
        url: newResource.url,
        transcription: newResource.transcription,
        createdAt: newResource.createdAt instanceof Date ? newResource.createdAt.toISOString() : newResource.createdAt
      });

      addedCount++;
    }

    console.log(`✅ ${addedCount} respuestas de tamizaje agregadas a recursos`);
    alert(`${addedCount} respuesta(s) de tamizaje agregada(s) exitosamente a recursos`);

    // Cerrar modal y limpiar selección
    closeScreeningResponsesModal();
  } catch (error) {
    console.error('Error al agregar respuestas a recursos:', error);
    alert('Error al agregar respuestas de tamizaje');
  }
};

/**
 * Formatear fecha de respuesta
 */
const formatScreeningResponseDate = (date: string | null | undefined) => {
  if (!date) return 'Fecha no disponible';
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return 'Fecha inválida';
    }
    return parsedDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Fecha inválida';
  }
};

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
 * Genera un árbol de ideas a partir del contenido de una nota clínica
 */
const generateTreeFromNote = (note: ClinicalNote) => {
  currentTreeNote.value = note;

  // Procesar el contenido para crear nodos
  const content = note.description || '';
  const title = note.title || 'Nota sin título';
  const lines = content.split('\n').filter(line => line.trim());

  const nodes: Array<{ id: string, label: string, position: { x: number, y: number }, style?: Record<string, string> }> = [];
  const edges: Array<{ id: string, source: string, target: string }> = [];

  // Nodo raíz (título de la nota)
  nodes.push({
    id: 'root',
    label: title,
    position: { x: 400, y: 50 },
    style: { background: '#4f46e5', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold' }
  });

  // Crear nodos hijos a partir del contenido
  let currentY = 150;
  let childIndex = 0;

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.length > 0) {
      const nodeId = `node-${index}`;

      // Determinar el nivel basado en el contenido
      let level = 1;
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
        level = 2;
      } else if (/^\d+\./.test(trimmedLine)) {
        level = 1;
      }

      nodes.push({
        id: nodeId,
        label: trimmedLine.substring(0, 50) + (trimmedLine.length > 50 ? '...' : ''),
        position: { x: 200 + (childIndex % 3) * 200, y: currentY + Math.floor(childIndex / 3) * 100 },
        style: {
          background: level === 1 ? '#e0e7ff' : '#f3f4f6',
          border: '1px solid #c7d2fe',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          width: '180px'
        }
      });

      // Conectar con el nodo raíz o con el nodo anterior del mismo nivel
      edges.push({
        id: `edge-${index}`,
        source: level === 1 ? 'root' : `node-${Math.max(0, index - 1)}`,
        target: nodeId
      });

      childIndex++;
    }
  });

  // Si no hay contenido, crear un nodo informativo
  if (nodes.length === 1) {
    nodes.push({
      id: 'info',
      label: 'Sin contenido detallado',
      position: { x: 400, y: 200 },
      style: { background: '#fef3c7', border: '1px solid #fbbf24', padding: '8px', borderRadius: '6px' }
    });
    edges.push({
      id: 'edge-info',
      source: 'root',
      target: 'info'
    });
  }

  treeNodes.value = nodes;
  treeEdges.value = edges;
  showTreeModal.value = true;

  console.log(`🌳 Árbol generado: ${nodes.length} nodos, ${edges.length} conexiones`);
};

/**
 * Genera un árbol global de todas las notas clínicas
 * Cada nodo representa una nota completa, conectadas por recurso y fecha
 */
const generateGlobalTree = () => {
  if (clinicalNotes.value.length === 0) {
    alert('No hay notas clínicas para visualizar');
    return;
  }

  const nodes: Array<{ id: string, label: string, position: { x: number, y: number }, style?: Record<string, string> }> = [];
  const edges: Array<{ id: string, source: string, target: string }> = [];

  // Nodo raíz central
  nodes.push({
    id: 'root',
    label: 'Notas Clínicas',
    position: { x: 400, y: 50 },
    style: {
      background: '#4f46e5',
      color: 'white',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '8px',
      fontWeight: 'bold',
      fontSize: '14px'
    }
  });

  // Agrupar notas por recurso
  const notesByResource = new Map<string, ClinicalNote[]>();
  clinicalNotes.value.forEach(note => {
    const resourceName = note.resourceName || 'Sin recurso';
    if (!notesByResource.has(resourceName)) {
      notesByResource.set(resourceName, []);
    }
    notesByResource.get(resourceName)?.push(note);
  });

  let resourceIndex = 0;
  const resourceEntries = Array.from(notesByResource.entries());

  resourceEntries.forEach(([resourceName, notes], rIndex) => {
    // Nodo de recurso (nivel 1)
    const resourceNodeId = `resource-${rIndex}`;
    const resourceX = 150 + (rIndex % 3) * 250;
    const resourceY = 180 + Math.floor(rIndex / 3) * 150;

    nodes.push({
      id: resourceNodeId,
      label: resourceName,
      position: { x: resourceX, y: resourceY },
      style: {
        background: '#e0e7ff',
        border: '2px solid #6366f1',
        padding: '10px 16px',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '12px',
        color: '#4338ca',
        width: '160px'
      }
    });

    // Conectar recurso al root
    edges.push({
      id: `edge-resource-${rIndex}`,
      source: 'root',
      target: resourceNodeId
    });

    // Ordenar notas por fecha
    notes.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // Crear nodos de notas para este recurso
    notes.forEach((note, nIndex) => {
      const noteNodeId = `note-${note.id}`;
      const noteX = resourceX + (nIndex % 2) * 180 - 90;
      const noteY = resourceY + 100 + Math.floor(nIndex / 2) * 100;

      // Truncar título si es muy largo
      const shortTitle = note.title.length > 25
        ? note.title.substring(0, 25) + '...'
        : note.title;

      nodes.push({
        id: noteNodeId,
        label: shortTitle,
        position: { x: noteX, y: noteY },
        style: {
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '11px',
          color: '#334155',
          width: '140px'
        }
      });

      // Conectar nota a su recurso padre
      edges.push({
        id: `edge-note-${note.id}`,
        source: resourceNodeId,
        target: noteNodeId
      });

      // Conectar notas secuenciales del mismo recurso (evolución temporal)
      if (nIndex > 0) {
        const prevNote = notes[nIndex - 1];
        edges.push({
          id: `edge-sequence-${prevNote.id}-${note.id}`,
          source: `note-${prevNote.id}`,
          target: noteNodeId,
          // @ts-ignore - estilo personalizado para conexiones temporales
          style: { stroke: '#94a3b8', strokeDasharray: '5,5' }
        });
      }
    });
  });

  treeNodes.value = nodes;
  treeEdges.value = edges;
  showTreeModal.value = true;
  currentTreeNote.value = null; // Indica que es vista global

  console.log(`🌳 Árbol global generado: ${nodes.length} nodos, ${edges.length} conexiones, ${resourceEntries.length} recursos`);
};

/**
 * Ajusta la vista del árbol para mostrar todos los nodos
 */
const fitView = () => {
  // La funcionalidad fit-view-on-init ya está habilitada en VueFlow
  // Esta función puede expandirse para ajustes personalizados
  console.log('🔍 Ajustando vista del árbol');
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

// ============================================
// FUNCIONES DE CUADRO CLÍNICO
// ============================================

/**
 * Cargar todos los cuadros clínicos desde Supabase
 */
const loadClinicalPictures = async () => {
  try {
    isLoadingClinicalPictures.value = true;
    const response = await listClinicalPictures();
    clinicalPictures.value = response.data;
    console.log(`✅ ${response.data.length} cuadros clínicos cargados`);
  } catch (error) {
    console.error('Error al cargar cuadros clínicos:', error);
    alert('Error al cargar cuadros clínicos');
  } finally {
    isLoadingClinicalPictures.value = false;
  }
};

/**
 * Crear un nuevo cuadro clínico con todos los datos relacionados
 * Incluye: recursos, transcripciones, notas clínicas e historial de chat
 */
const createNewClinicalPicture = async () => {
  if (!clinicalPictureForm.value.title.trim()) {
    alert('El título es obligatorio');
    return;
  }

  try {
    isLoadingClinicalPictures.value = true;

    // Preparar los recursos con sus transcripciones
    const resourcesData = resources.value.map(resource => ({
      id: resource.id,
      name: resource.name,
      type: resource.type as 'pdf' | 'audio' | 'video' | 'url' | 'youtube',
      description: resource.description,
      url: resource.url,
      fileSize: resource.file?.size,
      transcription: resource.transcription,
      createdAt: new Date()
    }));

    // Preparar las transcripciones como entidades independientes
    const transcriptionsData = resources.value
      .filter(r => r.transcription && r.transcription.trim())
      .map(resource => ({
        id: crypto.randomUUID(),
        text: resource.transcription!,
        resourceId: resource.id,
        resourceName: resource.name,
        createdAt: new Date()
      }));

    // Preparar las notas clínicas
    const notesData = clinicalNotes.value.map(note => ({
      id: note.id,
      title: note.title,
      description: note.description,
      highlightText: note.highlightText,
      resourceId: note.resourceId,
      resourceName: note.resourceName,
      highlightId: note.highlightId,
      createdAt: new Date(note.createdAt)
    }));

    // Preparar el chat con todos los mensajes
    const chatData = {
      id: crypto.randomUUID(),
      title: `Chat - ${clinicalPictureForm.value.title}`,
      messages: messages.value.map(msg => ({
        id: crypto.randomUUID(),
        role: msg.role,
        content: msg.content,
        timestamp: new Date(),
        metadata: { resources: msg.resources }
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Crear el cuadro clínico completo con todos los datos
    const newPicture = await createClinicalPicture({
      title: clinicalPictureForm.value.title,
      description: clinicalPictureForm.value.description,
      patientName: clinicalPictureForm.value.patientName,
      status: clinicalPictureForm.value.status,
      // Datos relacionados integrados
      resources: resourcesData,
      transcriptions: transcriptionsData,
      notes: notesData,
      chat: chatData
    });

    clinicalPictures.value.unshift(newPicture);
    showClinicalPictureModal.value = false;

    // Reset form
    clinicalPictureForm.value = {
      title: '',
      description: '',
      patientName: '',
      status: 'draft'
    };

    console.log('✅ Cuadro clínico creado exitosamente:', {
      id: newPicture.id,
      resources: resourcesData.length,
      transcriptions: transcriptionsData.length,
      notes: notesData.length,
      messages: chatData.messages.length
    });
    alert(`Cuadro clínico creado exitosamente con ${resourcesData.length} recursos, ${transcriptionsData.length} transcripciones, ${notesData.length} notas y ${chatData.messages.length} mensajes`);
  } catch (error) {
    console.error('Error al crear cuadro clínico:', error);
    alert('Error al crear cuadro clínico. Por favor intente nuevamente.');
  } finally {
    isLoadingClinicalPictures.value = false;
  }
};

/**
 * Abrir un cuadro clínico existente
 */
const openClinicalPicture = async (id: string) => {
  try {
    isLoadingClinicalPictures.value = true;
    const picture = await getClinicalPictureById(id);
    if (picture) {
      currentClinicalPicture.value = picture;
      console.log('✅ Cuadro clínico abierto:', picture.title);
    }
  } catch (error) {
    console.error('Error al abrir cuadro clínico:', error);
    alert('Error al abrir cuadro clínico');
  } finally {
    isLoadingClinicalPictures.value = false;
  }
};

/**
 * Guardar chat actual en cuadro clínico
 */
const saveChatToClinicalPicture = async (clinicalPictureId: string) => {
  try {
    const chatMessages = chatHistory.value.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
      metadata: { timestamp: msg.timestamp }
    }));

    for (const message of chatMessages) {
      await addChatMessage(clinicalPictureId, message);
    }

    console.log(`✅ ${chatMessages.length} mensajes guardados en cuadro clínico`);
    alert('Chat guardado en cuadro clínico');
  } catch (error) {
    console.error('Error al guardar chat:', error);
    alert('Error al guardar chat');
  }
};

/**
 * Guardar notas clínicas en cuadro clínico
 */
const saveNotesToClinicalPicture = async (clinicalPictureId: string) => {
  try {
    for (const note of clinicalNotes.value) {
      await addNoteToClinicalPicture(clinicalPictureId, {
        title: note.title,
        description: note.description,
        highlightText: note.highlightText,
        resourceId: note.resourceId,
        resourceName: note.resourceName,
        highlightId: note.highlightId
      });
    }

    console.log(`✅ ${clinicalNotes.value.length} notas guardadas en cuadro clínico`);
    alert('Notas guardadas en cuadro clínico');
  } catch (error) {
    console.error('Error al guardar notas:', error);
    alert('Error al guardar notas');
  }
};

/**
 * Cerrar modal de cuadro clínico
 */
const closeClinicalPictureModal = () => {
  showClinicalPictureModal.value = false;
  clinicalPictureForm.value = {
    title: '',
    description: '',
    patientName: '',
    status: 'draft'
  };
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
  console.log('[TranscribeSelected] Iniciando transcripción de recursos seleccionados');
  console.log(`[TranscribeSelected] Total recursos seleccionados: ${selectedResources.value.length}`);
  console.log(`[TranscribeSelected] IDs seleccionados:`, selectedResources.value);

  if (selectedResources.value.length === 0) {
    console.warn('[TranscribeSelected] No hay recursos seleccionados para transcribir');
    return;
  }

  isTranscribing.value = true;
  console.log('[TranscribeSelected] Estado isTranscribing activado');

  try {
    console.log('[TranscribeSelected] Obteniendo información de recursos seleccionados...');
    const selectedResourcesInfo = selectedResources.value
      .map((id) => getResourceById(id))
      .filter(Boolean) as Resource[];

    console.log(`[TranscribeSelected] Recursos válidos para transcripción: ${selectedResourcesInfo.length}`);
    console.log('[TranscribeSelected] Detalle de recursos:', selectedResourcesInfo.map(r => ({ id: r.id, name: r.name, type: r.type, hasFile: !!r.file })));

    let processedCount = 0;
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const resource of selectedResourcesInfo) {
      processedCount++;
      console.log(`[TranscribeSelected] [${processedCount}/${selectedResourcesInfo.length}] Procesando recurso: ${resource.name} (ID: ${resource.id})`);

      resource.transcriptionStatus = 'processing';
      console.log(`[TranscribeSelected] Estado cambiado a 'processing' para ${resource.name}`);

      // 🔍 Verificar si es un recurso de tamizaje (ya tiene transcripción generada)
      const isScreeningResource = ['screening_response', 'screening'].includes(resource.type.toLowerCase());

      if (isScreeningResource) {
        console.log(`[TranscribeSelected] ℹ️ Recurso ${resource.name} es de tipo tamizaje, ya tiene transcripción generada`);
        console.log(`[TranscribeSelected] Tipo: ${resource.type} - Saltando transcripción`);

        // Si ya tiene transcripción, marcar como completado sin procesar
        if (resource.transcription && resource.transcription.length > 0) {
          resource.transcriptionStatus = 'completed';
          successCount++;
          console.log(`[TranscribeSelected] ✅ Recurso de tamizaje ya transcrito (transcripción existente)`);
        } else {
          console.warn(`[TranscribeSelected] ⚠️ Recurso de tamizaje sin transcripción: ${resource.name}`);
          resource.transcriptionStatus = 'error';
          resource.transcription = 'Error: Recurso de tamizaje sin datos de transcripción';
          errorCount++;
        }
        continue;
      }

      if (!resource.file) {
        console.warn(`[TranscribeSelected] Recurso ${resource.name} (ID: ${resource.id}) no tiene archivo asociado`);
        resource.transcriptionStatus = 'error';
        resource.transcription = 'No hay archivo asociado al recurso para transcribir.';
        skippedCount++;
        continue;
      }

      console.log(`[TranscribeSelected] Archivo válido encontrado: ${resource.file.name} (${resource.file.size} bytes)`);

      try {
        console.log(`[TranscribeSelected] Llamando a transcribeResource para ${resource.name}`);
        await transcribeResource(resource);
        resource.transcriptionStatus = 'completed';
        successCount++;
        console.log(`[TranscribeSelected] ✅ Recurso ${resource.name} transcrito exitosamente`);
      } catch (error: any) {
        errorCount++;
        console.error(`[TranscribeSelected] ❌ Error transcribiendo ${resource.name}:`, error);
        console.error(`[TranscribeSelected] Error message:`, error.message);
        console.error(`[TranscribeSelected] Error stack:`, error.stack);

        // 🔍 Llamar a función de diagnóstico detallado
        diagnoseTranscriptionError(resource, error);

        resource.transcriptionStatus = 'error';
        resource.transcription = `Error al transcribir: ${error.message || error}`;
      }
    }

    console.log('[TranscribeSelected] Resumen de transcripción:');
    console.log(`[TranscribeSelected] - Total procesados: ${processedCount}`);
    console.log(`[TranscribeSelected] - Exitosos: ${successCount}`);
    console.log(`[TranscribeSelected] - Fallidos: ${errorCount}`);
    console.log(`[TranscribeSelected] - Omitidos (sin archivo): ${skippedCount}`);

    const successful = selectedResourcesInfo.filter(r => r.transcriptionStatus === 'completed').length;
    const failed = selectedResourcesInfo.filter(r => r.transcriptionStatus === 'error').length;

    console.log(`[TranscribeSelected] Enviando mensaje de resumen al chat`);
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
    console.log('[TranscribeSelected] Transcripción masiva completada exitosamente');

  } catch (error: any) {
    console.error('[TranscribeSelected] ❌ Error crítico en transcripción masiva:', error);
    console.error('[TranscribeSelected] Error message:', error.message);
    console.error('[TranscribeSelected] Error stack:', error.stack);

    messages.value.push({
      id: messageIdCounter++,
      role: 'assistant',
      content: `❌ **Error en transcripción**\n\nNo se pudieron transcribir los recursos seleccionados.\n\n**Error:** ${error.message || error}`,
      resources: [...selectedResources.value]
    });
  } finally {
    isTranscribing.value = false;
    console.log('[TranscribeSelected] Estado isTranscribing desactivado (finally)');
  }
};

// ✅ FUNCIÓN DE DIAGNÓSTICO DETALLADO PARA ERRORES DE TRANSCRIPCIÓN
const diagnoseTranscriptionError = (resource: Resource, error: any): void => {
  console.group(`🔍 [Diagnóstico] Error en transcripción de: ${resource.name}`);

  // Información del recurso
  console.log('📄 Información del recurso:');
  console.log('  - ID:', resource.id);
  console.log('  - Nombre:', resource.name);
  console.log('  - Tipo:', resource.type);
  console.log('  - Descripción:', resource.description);
  console.log('  - URL:', resource.url || 'No disponible');

  // Información del archivo
  if (resource.file) {
    console.log('📁 Información del archivo:');
    console.log('  - Nombre:', resource.file.name);
    console.log('  - Tipo MIME:', resource.file.type);
    console.log('  - Tamaño:', resource.file.size, 'bytes');
    console.log('  - Última modificación:', new Date(resource.file.lastModified).toISOString());
  } else {
    console.warn('⚠️ No hay archivo asociado al recurso');
  }

  // Análisis del error
  console.log('❌ Información del error:');
  console.log('  - Tipo de error:', typeof error);
  console.log('  - Constructor:', error?.constructor?.name || 'N/A');
  console.log('  - Mensaje:', error?.message || 'Sin mensaje');
  console.log('  - Stack trace:', error?.stack || 'No disponible');

  // Información adicional del error
  if (error?.cause) {
    console.log('  - Causa:', error.cause);
  }
  if (error?.code) {
    console.log('  - Código:', error.code);
  }
  if (error?.response) {
    console.log('  - Respuesta HTTP:', error.response);
  }

  // Intentar diagnosticar el tipo de error específico
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorType = resource.type.toUpperCase();

  console.log('🔧 Diagnóstico específico:');

  if (errorType === 'PDF') {
    if (errorMessage.includes('invalid') || errorMessage.includes('corrupted')) {
      console.error('  → El archivo PDF parece estar corrupto o no es un PDF válido');
    } else if (errorMessage.includes('password') || errorMessage.includes('encrypted')) {
      console.error('  → El PDF está protegido con contraseña o encriptado');
    } else if (errorMessage.includes('structure')) {
      console.error('  → El PDF tiene una estructura inválida o incompleta');
    } else {
      console.error('  → Error desconocido en procesamiento PDF');
    }
  } else if (['WORD', 'DOC', 'DOCX'].includes(errorType)) {
    if (errorMessage.includes('zip') || errorMessage.includes('archive')) {
      console.error('  → El archivo DOCX está corrupto (es un ZIP inválido)');
    } else if (errorMessage.includes('xml') || errorMessage.includes('parse')) {
      console.error('  → Error al parsear el XML interno del documento');
    } else {
      console.error('  → Error desconocido en procesamiento DOCX');
    }
  } else if (['IMAGE', 'PNG', 'JPG', 'JPEG'].includes(errorType)) {
    if (errorMessage.includes('tesseract')) {
      console.error('  → Error en el motor OCR (Tesseract.js)');
    } else if (errorMessage.includes('load') || errorMessage.includes('decode')) {
      console.error('  → No se pudo cargar o decodificar la imagen');
    } else {
      console.error('  → Error desconocido en procesamiento de imagen (OCR)');
    }
  } else if (errorType === 'TXT') {
    console.error('  → Error al leer archivo de texto (codificación incompatible)');
  } else {
    console.error('  → Tipo de archivo no soportado para diagnóstico específico');
  }

  // Recomendaciones
  console.log('💡 Recomendaciones:');
  console.log('  1. Verificar que el archivo no esté corrupto');
  console.log('  2. Intentar abrir el archivo en otro programa para confirmar validez');
  console.log('  3. Si es PDF: asegurar que no esté protegido con contraseña');
  console.log('  4. Si es imagen: verificar que sea un formato soportado (PNG, JPG, JPEG)');
  console.log('  5. Reintentar la transcripción con una copia del archivo');

  console.groupEnd();
};

// ✅ FUNCIÓN DE TRANSCRIPCIÓN CON PERSISTENCIA
const transcribeResource = async (resource: Resource): Promise<void> => {
  console.log(`[Transcription] Iniciando transcripción para recurso ID: ${resource.id}`);
  console.log(`[Transcription] Nombre: ${resource.name}`);
  console.log(`[Transcription] Tipo: ${resource.type}`);
  console.log(`[Transcription] Archivo: ${resource.file?.name || 'Sin archivo'}`);

  if (!resource.file) {
    console.error(`[Transcription] Error: No hay archivo asociado al recurso ${resource.id}`);
    throw new Error('No hay archivo asociado al recurso');
  }

  const type = resource.type.toUpperCase();
  console.log(`[Transcription] Tipo procesado: ${type}`);

  try {
    console.log(`[Transcription] Procesando archivo tipo ${type}...`);

    if (type === 'PDF') {
      console.log(`[Transcription] Llamando transcribePDF para ${resource.name}`);
      resource.transcription = await transcribePDF(resource.file);
      console.log(`[Transcription] PDF transcrito exitosamente`);
    } else if (['WORD', 'DOC', 'DOCX'].includes(type)) {
      console.log(`[Transcription] Llamando transcribeDOCX para ${resource.name}`);
      resource.transcription = await transcribeDOCX(resource.file);
      console.log(`[Transcription] DOCX transcrito exitosamente`);
    } else if (type === 'TXT') {
      console.log(`[Transcription] Llamando transcribeTXT para ${resource.name}`);
      resource.transcription = await transcribeTXT(resource.file);
      console.log(`[Transcription] TXT transcrito exitosamente`);
    } else if (['IMAGE', 'PNG', 'JPG', 'JPEG'].includes(type)) {
      console.log(`[Transcription] Llamando transcribeImage (OCR) para ${resource.name}`);
      resource.transcription = await transcribeImage(resource.file);
      console.log(`[Transcription] Imagen transcrita exitosamente`);
    } else {
      console.error(`[Transcription] Tipo de archivo no soportado: ${resource.type}`);
      throw new Error(`Tipo de archivo no soportado: ${resource.type}`);
    }

    console.log(`[Transcription] Transcripción completada para ${resource.name}`);
    console.log(`[Transcription] Longitud del texto: ${resource.transcription?.length || 0} caracteres`);

  } catch (transcriptionError: any) {
    console.error(`[Transcription] Error durante la transcripción de ${resource.name}:`, transcriptionError);
    console.error(`[Transcription] Mensaje de error: ${transcriptionError.message}`);
    throw transcriptionError;
  }

  // ✅ GUARDAR TRANSCRIPCIÓN EN INDEXEDDB
  console.log(`[Transcription] Guardando transcripción en IndexedDB para recurso ${resource.id}`);

  try {
    const existingResource = await getAllResources().then(resources =>
      resources.find(r => r.id === resource.id)
    );

    if (existingResource) {
      console.log(`[Transcription] Recurso existente encontrado, actualizando...`);
      const updatedResource = {
        ...existingResource,
        transcription: resource.transcription,
        transcriptionStatus: resource.transcriptionStatus
      };
      await saveResource(updatedResource);
      console.log(`[Transcription] ✅ Transcripción guardada exitosamente para recurso ${resource.id}`);
    } else {
      console.warn(`[Transcription] No se encontró recurso existente con ID ${resource.id}`);
    }
  } catch (error: any) {
    console.error(`[Transcription] Error al guardar transcripción en IndexedDB:`, error);
    console.error(`[Transcription] Detalle del error:`, error.message);
  }

  console.log(`[Transcription] Proceso completado para recurso: ${resource.name}`);
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
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
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
