<template>
  <div class="max-w-5xl mx-auto">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl mb-8">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
          </svg>
        </div>
        <div>
          <h2 class="text-3xl font-bold mb-1">Nuevo Tamizaje Auditivo 🔬</h2>
          <p class="text-white/90">Crea evaluaciones de identificación de sonidos</p>
        </div>
      </div>
    </div>

    <!-- Form Container -->
    <div class="bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden">
      <!-- Progress Indicator -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-4 border-b border-blue-100">
        <div class="flex items-center justify-between text-sm mb-3">
          <span class="text-gray-600 font-medium">Progreso del tamizaje</span>
          <span class="text-blue-600 font-semibold">{{ formProgress }}%</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
            :style="{ width: formProgress + '%' }"
          ></div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-8 space-y-8">
        
        <!-- Nombre de la Categoría -->
        <div class="space-y-2">
          <label for="categoryName" class="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
            Nombre de la Categoría
            <span class="text-red-500">*</span>
          </label>
          
          <div class="relative">
            <input
              id="categoryName"
              v-model="formData.categoryName"
              type="text"
              required
              maxlength="80"
              placeholder="Ej: Tonos Graves, Frecuencias Agudas, Identificación de Palabras"
              :class="[
                'w-full px-4 py-4 pl-12 pr-12 border-2 rounded-2xl transition-all duration-200',
                'focus:outline-none focus:ring-4',
                errors.categoryName
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                  : 'border-blue-200 focus:border-blue-500 focus:ring-blue-100',
                'placeholder:text-gray-400'
              ]"
              @input="validateCategoryName"
              @blur="validateCategoryName"
            />
            
            <!-- Icon -->
            <div class="absolute left-4 top-1/2 -translate-y-1/2">
              <div class="w-6 h-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                </svg>
              </div>
            </div>

            <!-- Character Count -->
            <div class="absolute right-4 top-1/2 -translate-y-1/2">
              <span :class="[
                'text-xs font-medium',
                formData.categoryName.length > 60 ? 'text-orange-500' : 'text-gray-400'
              ]">
                {{ formData.categoryName.length }}/80
              </span>
            </div>
          </div>

          <!-- Error Message -->
          <transition name="fade">
            <p v-if="errors.categoryName" class="text-sm text-red-600 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
              </svg>
              {{ errors.categoryName }}
            </p>
          </transition>

          <!-- Help Text -->
          <p class="text-xs text-gray-500 flex items-start gap-2">
            <svg class="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Categoría del tipo de sonido que se evaluará (frecuencias, tonos, palabras, etc.)</span>
          </p>
        </div>

        <!-- Agregar Sonido -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
            </svg>
            Sonido de Prueba
            <span class="text-red-500">*</span>
          </label>

          <!-- File Upload Area -->
          <div
            @click="triggerFileInput"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
            :class="[
              'relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 cursor-pointer',
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : audioFile
                  ? 'border-green-300 bg-green-50'
                  : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50'
            ]"
          >
            <input
              ref="fileInput"
              type="file"
              accept="audio/*"
              @change="handleFileSelect"
              class="hidden"
            />

            <!-- Upload Icon & Instructions -->
            <div v-if="!audioFile" class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
              </div>
              <p class="text-gray-700 font-medium mb-2">
                Click para seleccionar o arrastra el sonido de prueba
              </p>
              <p class="text-sm text-gray-500 mb-4">
                El paciente escuchará este sonido durante la evaluación
              </p>
              <p class="text-xs text-gray-400">
                Formatos: MP3, WAV, OGG • Máximo: 20MB
              </p>
            </div>

            <!-- File Selected -->
            <div v-else class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-800 truncate">{{ audioFile.name }}</p>
                  <p class="text-sm text-gray-500">{{ formatFileSize(audioFile.size) }} • {{ getFileExtension(audioFile.name) }}</p>
                </div>
              </div>
              <button
                type="button"
                @click.stop="removeFile"
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <transition name="fade">
            <p v-if="errors.audio" class="text-sm text-red-600 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
              </svg>
              {{ errors.audio }}
            </p>
          </transition>

          <!-- Audio Player Preview -->
          <transition name="fade">
            <div v-if="audioFile && audioURL" class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
              <h4 class="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Vista Previa del Sonido de Prueba
              </h4>
              <audio
                ref="audioPlayer"
                :src="audioURL"
                controls
                class="w-full"
              ></audio>
            </div>
          </transition>

          <!-- Help Text -->
          <p class="text-xs text-gray-500 flex items-start gap-2">
            <svg class="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Este es el sonido que el paciente escuchará y deberá identificar</span>
          </p>
        </div>

        <!-- Opciones de Respuestas -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
              Opciones de Respuesta para Identificar el Sonido
              <span class="text-red-500">*</span>
            </label>
            <span class="text-xs text-gray-500 font-medium">
              {{ responseOptions.length }} opción(es)
            </span>
          </div>

          <!-- Response Options List -->
          <div class="space-y-3">
            <TransitionGroup name="list">
              <div
                v-for="(option, index) in responseOptions"
                :key="option.id"
                class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200"
              >
                <div class="flex items-start gap-3">
                  <!-- Option Number -->
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">
                    {{ String.fromCharCode(65 + index) }}
                  </div>

                  <!-- Option Input -->
                  <div class="flex-1 space-y-2">
                    <input
                      v-model="option.text"
                      type="text"
                      required
                      maxlength="100"
                      placeholder="Ej: Tono agudo 1000Hz, Palabra 'casa', Silbido"
                      class="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    />
                    
                    <!-- Correct Answer Toggle -->
                    <div class="flex items-center justify-between">
                      <label class="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          v-model="option.isCorrect"
                          type="checkbox"
                          class="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-300"
                          @change="handleCorrectAnswer(index)"
                        />
                        <span class="font-medium">Respuesta correcta</span>
                      </label>
                      <span v-if="option.isCorrect" class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-lg font-semibold">
                        ✓ Correcta
                      </span>
                    </div>
                  </div>

                  <!-- Remove Button -->
                  <button
                    v-if="responseOptions.length > 2"
                    type="button"
                    @click="removeOption(index)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                    title="Eliminar opción"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <!-- Add Option Button -->
          <button
            type="button"
            @click="addOption"
            class="w-full px-4 py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Agregar Opción de Respuesta
          </button>

          <!-- Error Message -->
          <transition name="fade">
            <p v-if="errors.options" class="text-sm text-red-600 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
              </svg>
              {{ errors.options }}
            </p>
          </transition>

          <!-- Help Text -->
          <p class="text-xs text-gray-500 flex items-start gap-2">
            <svg class="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Crea opciones de respuesta y marca cuál es la correcta. Mínimo 2 opciones.</span>
          </p>
        </div>

        <!-- Preview Card -->
        <div v-if="formData.categoryName || audioFile || responseOptions.some(o => o.text)"
          class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            Vista Previa del Tamizaje
          </h3>
          
          <div class="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div class="mb-4">
              <span class="text-xs font-semibold text-blue-600 uppercase tracking-wider">Categoría</span>
              <h4 class="text-xl font-bold text-gray-800 mt-1">
                {{ formData.categoryName || 'Nombre de la categoría...' }}
              </h4>
            </div>

            <div v-if="audioFile" class="mb-4 p-3 bg-blue-50 rounded-lg">
              <div class="flex items-center gap-2 text-sm text-gray-700">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                </svg>
                <span class="font-medium">Sonido de prueba:</span>
                <span>{{ audioFile.name }}</span>
              </div>
            </div>

            <div v-if="responseOptions.some(o => o.text)">
              <p class="text-sm font-semibold text-gray-700 mb-3">
                ¿Qué sonido escuchó? Seleccione la opción correcta:
              </p>
              <div class="space-y-2">
                <label
                  v-for="(option, index) in responseOptions.filter(o => o.text)"
                  :key="index"
                  :class="[
                    'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border-2',
                    option.isCorrect
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                  ]"
                >
                  <input
                    type="radio"
                    :name="'preview-option'"
                    class="w-4 h-4 text-blue-600"
                    disabled
                  />
                  <span class="font-medium text-blue-600 mr-2">{{ String.fromCharCode(65 + index) }}.</span>
                  <span class="flex-1 text-gray-700">{{ option.text }}</span>
                  <span v-if="option.isCorrect" class="text-xs px-2 py-1 bg-green-600 text-white rounded font-semibold">
                    ✓ Correcta
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="resetForm"
            class="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Cancelar
          </button>

          <button
            type="submit"
            :disabled="!isFormValid || isSubmitting"
            :class="[
              'px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2',
              'shadow-lg hover:shadow-xl transform hover:scale-105',
              isFormValid && !isSubmitting
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            <svg v-if="!isSubmitting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ isSubmitting ? 'Guardando...' : 'Guardar Tamizaje' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Success Modal -->
    <transition name="modal">
      <div v-if="showSuccessModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="showSuccessModal = false">
        <div class="bg-white rounded-3xl p-8 max-w-md shadow-2xl transform scale-100" @click.stop>
          <div class="text-center">
            <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">¡Tamizaje Creado!</h3>
            <p class="text-gray-600 mb-6">El tamizaje auditivo ha sido guardado exitosamente.</p>
            <button
              @click="showSuccessModal = false"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface ResponseOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

// Form Data
const formData = ref({
  categoryName: '',
});

const audioFile = ref<File | null>(null);
const audioURL = ref<string>('');
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const audioPlayer = ref<HTMLAudioElement | null>(null);

const responseOptions = ref<ResponseOption[]>([
  { id: 'opt-0', text: '', isCorrect: false },
  { id: 'opt-1', text: '', isCorrect: false },
]);

let optionIdCounter = 2;

// Errors
const errors = ref({
  categoryName: '',
  audio: '',
  options: '',
});

// States
const isSubmitting = ref(false);
const showSuccessModal = ref(false);

// Computed
const isFormValid = computed(() => {
  const hasCategory = formData.value.categoryName.length >= 3;
  const hasAudio = audioFile.value !== null;
  const hasValidOptions = responseOptions.value.length >= 2
    && responseOptions.value.every(opt => opt.text.length > 0)
    && responseOptions.value.some(opt => opt.isCorrect);
  
  return hasCategory && hasAudio && hasValidOptions
    && !errors.value.categoryName
    && !errors.value.audio
    && !errors.value.options;
});

const formProgress = computed(() => {
  let progress = 0;
  if (formData.value.categoryName.length >= 3) progress += 30;
  if (audioFile.value) progress += 35;
  if (responseOptions.value.length >= 2 && responseOptions.value.every(opt => opt.text.length > 0)) progress += 20;
  if (responseOptions.value.some(opt => opt.isCorrect)) progress += 15;
  return progress;
});

// Validation Functions
const validateCategoryName = () => {
  if (formData.value.categoryName.length === 0) {
    errors.value.categoryName = '';
  } else if (formData.value.categoryName.length < 3) {
    errors.value.categoryName = 'El nombre debe tener al menos 3 caracteres';
  } else if (formData.value.categoryName.length > 80) {
    errors.value.categoryName = 'El nombre no puede exceder 80 caracteres';
  } else {
    errors.value.categoryName = '';
  }
};

// File Handling
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const handleFileDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const validateAndSetFile = (file: File) => {
  const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/x-m4a'];
  if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a)$/i)) {
    errors.value.audio = 'Formato de archivo no válido. Use MP3, WAV, OGG o M4A';
    return;
  }

  const maxSize = 20 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.value.audio = 'El archivo es demasiado grande. Máximo 20MB';
    return;
  }

  errors.value.audio = '';
  audioFile.value = file;
  
  if (audioURL.value) {
    URL.revokeObjectURL(audioURL.value);
  }
  audioURL.value = URL.createObjectURL(file);
};

const removeFile = () => {
  if (audioURL.value) {
    URL.revokeObjectURL(audioURL.value);
  }
  audioFile.value = null;
  audioURL.value = '';
  errors.value.audio = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Options Handling
const addOption = () => {
  responseOptions.value.push({
    id: `opt-${optionIdCounter++}`,
    text: '',
    isCorrect: false,
  });
};

const removeOption = (index: number) => {
  responseOptions.value.splice(index, 1);
};

const handleCorrectAnswer = (index: number) => {
  // Opcional: Si quieres que solo una opción sea correcta a la vez
  // responseOptions.value.forEach((opt, i) => {
  //   if (i !== index) opt.isCorrect = false;
  // });
};

// Utility Functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toUpperCase() || '';
};

// Form Actions
const handleSubmit = async () => {
  validateCategoryName();
  
  if (!isFormValid.value) return;
  
  isSubmitting.value = true;
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const data = {
    categoryName: formData.value.categoryName,
    audioFile: audioFile.value,
    responseOptions: responseOptions.value.filter(opt => opt.text),
    createdAt: new Date(),
  };
  
  console.log('Tamizaje guardado:', data);
  
  isSubmitting.value = false;
  showSuccessModal.value = true;
};

const resetForm = () => {
  formData.value = {
    categoryName: '',
  };
  removeFile();
  responseOptions.value = [
    { id: 'opt-0', text: '', isCorrect: false },
    { id: 'opt-1', text: '', isCorrect: false },
  ];
  optionIdCounter = 2;
  errors.value = {
    categoryName: '',
    audio: '',
    options: '',
  };
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>