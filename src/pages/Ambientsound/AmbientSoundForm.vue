<template>
<div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-2xl mb-8">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
          </svg>
        </div>
        <div>
          <h2 class="text-3xl font-bold mb-1">Nuevo Sonido de Ambiente 🎵</h2>
          <p class="text-white/90">Agrega sonidos terapéuticos para tinnitus y relajación</p>
        </div>
      </div>
    </div>

    <!-- Form Container -->
    <div class="bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden">
      <!-- Progress Indicator -->
      <div class="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-4 border-b border-indigo-100">
        <div class="flex items-center justify-between text-sm mb-3">
          <span class="text-gray-600 font-medium">Progreso del formulario</span>
          <span class="text-indigo-600 font-semibold">{{ formProgress }}%</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
            :style="{ width: formProgress + '%' }"
          ></div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-8 space-y-8">
        
        <!-- Nombre del Sonido -->
        <div class="space-y-2">
          <label for="soundName" class="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
            </svg>
            Nombre del Sonido
            <span class="text-red-500">*</span>
          </label>
          
          <div class="relative">
            <input
              id="soundName"
              v-model="formData.name"
              type="text"
              required
              maxlength="100"
              placeholder="Ej: Lluvia Suave en el Bosque"
              :class="[
                'w-full px-4 py-4 pl-12 pr-12 border-2 rounded-2xl transition-all duration-200',
                'focus:outline-none focus:ring-4',
                errors.name
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                  : 'border-indigo-200 focus:border-indigo-500 focus:ring-indigo-100',
                'placeholder:text-gray-400'
              ]"
              @input="validateName"
              @blur="validateName"
            />
            
            <!-- Icon -->
            <div class="absolute left-4 top-1/2 -translate-y-1/2">
              <div class="w-6 h-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </svg>
              </div>
            </div>

            <!-- Character Count -->
            <div class="absolute right-4 top-1/2 -translate-y-1/2">
              <span :class="[
                'text-xs font-medium',
                formData.name.length > 80 ? 'text-orange-500' : 'text-gray-400'
              ]">
                {{ formData.name.length }}/100
              </span>
            </div>
          </div>

          <!-- Error Message -->
          <transition name="fade">
            <p v-if="errors.name" class="text-sm text-red-600 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
              </svg>
              {{ errors.name }}
            </p>
          </transition>

          <!-- Help Text -->
          <p class="text-xs text-gray-500 flex items-start gap-2">
            <svg class="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Nombre descriptivo del ambiente sonoro (ej: Olas del Mar, Bosque Nocturno)</span>
          </p>
        </div>

        <!-- Descripción del Sonido -->
        <div class="space-y-2">
          <label for="soundDescription" class="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
            </svg>
            Descripción del Sonido
            <span class="text-red-500">*</span>
          </label>

          <div class="relative">
            <textarea
              id="soundDescription"
              v-model="formData.description"
              required
              rows="6"
              maxlength="500"
              placeholder="Describe las características del sonido, su efecto terapéutico y cuándo es recomendado escucharlo..."
              :class="[
                'w-full px-4 py-4 pl-12 border-2 rounded-2xl transition-all duration-200',
                'focus:outline-none focus:ring-4 resize-none',
                errors.description
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                  : 'border-indigo-200 focus:border-indigo-500 focus:ring-indigo-100',
                'placeholder:text-gray-400'
              ]"
              @input="validateDescription"
              @blur="validateDescription"
            ></textarea>

            <!-- Icon -->
            <div class="absolute left-4 top-4">
              <div class="w-6 h-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
            </div>

            <!-- Character Count -->
            <div class="absolute right-4 bottom-4">
              <span :class="[
                'text-xs font-medium px-2 py-1 rounded-lg',
                formData.description.length > 450
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-gray-100 text-gray-600'
              ]">
                {{ formData.description.length }}/500
              </span>
            </div>
          </div>

          <!-- Error Message -->
          <transition name="fade">
            <p v-if="errors.description" class="text-sm text-red-600 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
              </svg>
              {{ errors.description }}
            </p>
          </transition>

          <!-- Help Text -->
          <p class="text-xs text-gray-500 flex items-start gap-2">
            <svg class="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Incluye beneficios terapéuticos, duración recomendada y situaciones de uso</span>
          </p>
        </div>

        <!-- Audio de Ambiente -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
            </svg>
            Archivo de Audio
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
                ? 'border-indigo-500 bg-indigo-50'
                : audioFile
                  ? 'border-green-300 bg-green-50'
                  : 'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50'
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
              <div class="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
              </div>
              <p class="text-gray-700 font-medium mb-2">
                Click para seleccionar o arrastra el archivo aquí
              </p>
              <p class="text-sm text-gray-500 mb-4">
                Formatos: MP3, WAV, OGG, M4A
              </p>
              <p class="text-xs text-gray-400">
                Tamaño máximo: 50MB
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
            <div v-if="audioFile && audioURL" class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
              <h4 class="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Vista Previa del Audio
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
            <svg class="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Sube un archivo de audio de alta calidad para terapia de sonido</span>
          </p>
        </div>

        <!-- Preview Card -->
        <div v-if="formData.name || formData.description"
          class="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-indigo-200">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            Vista Previa del Sonido
          </h3>
          
          <div class="bg-white rounded-xl p-5 shadow-sm border border-indigo-100">
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-gray-800 mb-2 text-lg">
                  {{ formData.name || 'Nombre del sonido...' }}
                </h4>
                <p class="text-sm text-gray-600 mb-3 whitespace-pre-wrap">
                  {{ formData.description || 'Descripción del sonido...' }}
                </p>
                <div v-if="audioFile" class="flex items-center gap-2 text-xs text-gray-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                  </svg>
                  <span>{{ audioFile.name }}</span>
                  <span>•</span>
                  <span>{{ formatFileSize(audioFile.size) }}</span>
                </div>
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
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            <svg v-if="!isSubmitting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ isSubmitting ? 'Guardando...' : 'Guardar Sonido' }}
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
            <h3 class="text-2xl font-bold text-gray-800 mb-2">¡Sonido Agregado!</h3>
            <p class="text-gray-600 mb-6">El sonido de ambiente ha sido guardado exitosamente.</p>
            <button
              @click="showSuccessModal = false"
              class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
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
import{ ref, computed } from 'vue'
// Form Data
const formData = ref({
  name: '',
  description: '',
});

const audioFile = ref<File | null>(null);
const audioURL = ref<string>('');
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const audioPlayer = ref<HTMLAudioElement | null>(null);

// Errors
const errors = ref({
  name: '',
  description: '',
  audio: '',
});

// States
const isSubmitting = ref(false);
const showSuccessModal = ref(false);

// Computed
const isFormValid = computed(() => {
  return formData.value.name.length >= 3
    && formData.value.description.length >= 20
    && audioFile.value !== null
    && !errors.value.name
    && !errors.value.description
    && !errors.value.audio;
});

const formProgress = computed(() => {
  let progress = 0;
  if (formData.value.name.length >= 3) progress += 33;
  if (formData.value.description.length >= 20) progress += 33;
  if (audioFile.value) progress += 34;
  return progress;
});

// Validation Functions
const validateName = () => {
  if (formData.value.name.length === 0) {
    errors.value.name = '';
  } else if (formData.value.name.length < 3) {
    errors.value.name = 'El nombre debe tener al menos 3 caracteres';
  } else if (formData.value.name.length > 100) {
    errors.value.name = 'El nombre no puede exceder 100 caracteres';
  } else {
    errors.value.name = '';
  }
};

const validateDescription = () => {
  if (formData.value.description.length === 0) {
    errors.value.description = '';
  } else if (formData.value.description.length < 20) {
    errors.value.description = 'La descripción debe tener al menos 20 caracteres';
  } else if (formData.value.description.length > 500) {
    errors.value.description = 'La descripción no puede exceder 500 caracteres';
  } else {
    errors.value.description = '';
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
  // Validate file type
  const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/x-m4a'];
  if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a)$/i)) {
    errors.value.audio = 'Formato de archivo no válido. Use MP3, WAV, OGG o M4A';
    return;
  }

  // Validate file size (50MB max)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.value.audio = 'El archivo es demasiado grande. Máximo 50MB';
    return;
  }

  // File is valid
  errors.value.audio = '';
  audioFile.value = file;
  
  // Create URL for preview
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
  validateName();
  validateDescription();
  
  if (!isFormValid.value) return;
  
  isSubmitting.value = true;
  
  // Simular envío (aquí iría la lógica real de subida)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const data = {
    ...formData.value,
    audioFile: audioFile.value,
    createdAt: new Date(),
  };
  
  console.log('Sonido guardado:', data);
  
  isSubmitting.value = false;
  showSuccessModal.value = true;
  
  // Resetear después de cerrar modal
  setTimeout(() => {
    if (!showSuccessModal.value) {
      resetForm();
    }
  }, 3000);
};

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
  };
  removeFile();
  errors.value = {
    name: '',
    description: '',
    audio: '',
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