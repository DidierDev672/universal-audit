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
        
        <!-- Nombre del Tamizaje -->
        <div class="space-y-2">
          <label for="screeningName" class="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
            Nombre del Tamizaje
            <span class="text-red-500">*</span>
          </label>
          
          <div class="relative">
            <input
              id="screeningName"
              v-model="formData.title"
              type="text"
              required
              maxlength="80"
              placeholder="Ej: Tonos Graves, Frecuencias Agudas, Identificación de Palabras"
              :class="[
                'w-full px-4 py-4 pl-12 pr-12 border-2 rounded-2xl transition-all duration-200',
                'focus:outline-none focus:ring-4',
                errors.title
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                  : 'border-blue-200 focus:border-blue-500 focus:ring-blue-100',
                'placeholder:text-gray-400'
              ]"
              @blur="validateTitle"
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
                formData.title.length > 60 ? 'text-orange-500' : 'text-gray-400'
              ]">
                {{ formData.title.length }}/80
              </span>
            </div>
          </div>

          <!-- Error Message -->
          <transition name="fade">
            <p v-if="errors.title" class="text-sm text-red-600 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
              </svg>
              {{ errors.title }}
            </p>
          </transition>
        </div>

        <!-- Descripción del Tamizaje -->
        <div class="space-y-2">
          <label for="description" class="flex items-center gap-2 text-sm font-semibold text-gray-800">
            Descripción del Tamizaje
            <span class="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            v-model="formData.description"
            required
            rows="3"
            placeholder="Escribe una descripción del tamizaje..."
            :class="[
              'w-full px-4 py-4 border-2 rounded-2xl transition-all duration-200',
              'focus:outline-none focus:ring-4',
              errors.description
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                : 'border-blue-200 focus:border-blue-500 focus:ring-blue-100',
            ]"
          ></textarea>
          
          <!-- Error Message -->
          <transition name="fade">
            <p v-if="errors.description" class="text-sm text-red-600 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
              </svg>
              {{ errors.description }}
            </p>
          </transition>
        </div>

        <!-- Seleccionar Sonidos (Opciones de Respuesta) -->
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
            </svg>
            Seleccionar Sonidos (Opciones de Respuesta)
            <span class="text-red-500">*</span>
          </label>
          
          <p class="text-xs text-gray-500 mb-2">
            Seleccione los sonidos que el paciente deberá identificar. Cada sonido será una opción de respuesta.
          </p>

          <!-- Loading State -->
          <div v-if="loadingSounds" class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="ml-3 text-gray-600">Cargando sonidos...</span>
          </div>

          <!-- Sound List -->
          <div v-else-if="sounds.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto p-2 border-2 border-blue-200 rounded-2xl">
            <div
              v-for="sound in sounds"
              :key="sound.id"
              @click="toggleSound(sound)"
              :class="[
                'p-4 rounded-xl cursor-pointer transition-all border-2',
                isSoundSelected(sound.id)
                  ? 'bg-blue-50 border-blue-500 shadow-md'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              ]"
            >
              <div class="flex items-start gap-3">
                <div :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                  isSoundSelected(sound.id) 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                ]">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-800 truncate">{{ sound.title }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ sound.description }}</p>
                  <p class="text-xs text-blue-600 mt-1">{{ sound.category }}</p>
                </div>
                <div v-if="isSoundSelected(sound.id)" class="text-blue-500">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="sounds.length === 0" class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <p class="text-yellow-800">No hay sonidos disponibles. Debe agregar sonidos primero.</p>
            <a href="/add-sound" class="text-blue-600 hover:underline text-sm font-medium">
              Agregar sonido
            </a>
          </div>

          <!-- Selected count -->
          <div v-if="selectedSounds.length > 0" class="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-700 font-medium">
              {{ selectedSounds.length }} sonido(s) seleccionado(s) como opciones de respuesta
            </p>
          </div>

          <!-- Error Message -->
          <transition name="fade">
            <p v-if="errors.soundId" class="text-sm text-red-600 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
              </svg>
              {{ errors.soundId }}
            </p>
          </transition>
        </div>

        <!-- Preview Card -->
        <div v-if="formData.title || selectedSounds.length > 0"
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
              <span class="text-xs font-semibold text-blue-600 uppercase tracking-wider">Nombre</span>
              <h4 class="text-xl font-bold text-gray-800 mt-1">
                {{ formData.title || 'Nombre del tamizaje...' }}
              </h4>
            </div>

            <!-- Vista previa con sonidos seleccionados -->
            <div v-if="selectedSounds.length >= 2">
              <p class="text-sm font-semibold text-gray-700 mb-3">
                🎵 Sonidos seleccionados y sus opciones de respuesta:
              </p>
              
              <!-- Cada sonido con sus opciones -->
              <div v-for="(sound, soundIndex) in selectedSounds" :key="sound.id" class="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <div class="flex items-center gap-3 mb-2">
                  <span class="w-8 h-8 flex items-center justify-center bg-purple-500 text-white font-bold rounded-full text-sm">
                    {{ soundIndex + 1 }}
                  </span>
                  <span class="font-bold text-purple-800">{{ sound.title }}</span>
                </div>
                
                <!-- Audio del sonido con botón play -->
                <div class="ml-11 mb-2">
                  <div class="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200">
                    <button
                      @click="togglePreviewPlay(sound.id)"
                      :disabled="!!audioErrors[sound.id]"
                      class="w-12 h-12 flex items-center justify-center rounded-full transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      :class="audioErrors[sound.id] ? 'bg-red-500' : 'bg-purple-500 hover:bg-purple-600 text-white'"
                    >
                      <svg v-if="audioErrors[sound.id]" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <svg v-else-if="previewPlayingId !== sound.id" class="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                    </button>
                    <div class="flex-1">
                      <audio
                        :id="`audio-${sound.id}`"
                        :src="sound.sound"
                        @ended="onPreviewEnded(sound.id)"
                        @error="onAudioError(sound.id, $event)"
                        @loadedmetadata="onAudioLoaded(sound.id)"
                      ></audio>
                      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          class="h-full bg-purple-500 transition-all duration-300"
                          :style="{ width: previewProgress[sound.id] || '0%' }"
                        ></div>
                      </div>
                      <p class="text-xs mt-1" :class="audioErrors[sound.id] ? 'text-red-500' : 'text-gray-500'">
                        {{ audioErrors[sound.id] || (previewPlayingId === sound.id ? 'Reproduciendo...' : 'Click para reproducir') }}
                      </p>
                    </div>
                  </div>
                </div>
                
                <!-- Opciones de respuesta de este sonido (incluyendo las demás como distractores) -->
                <div class="ml-11 p-2 bg-white rounded-lg border border-purple-100">
                  <p class="text-xs font-semibold text-purple-600 mb-2">Opciones de respuesta:</p>
                  <div class="space-y-1">
                    <!-- Opción correcta (este sonido) -->
                    <div class="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                      <span class="w-6 h-6 flex items-center justify-center bg-green-500 text-white font-bold rounded-full text-xs">
                        {{ String.fromCharCode(65 + soundIndex) }}
                      </span>
                      <span class="flex-1 text-sm text-gray-700">{{ sound.title }}</span>
                      <span class="text-xs text-green-600 font-bold">✓ Correcta</span>
                    </div>
                    
                    <!-- Opciones incorrectas (los demás sonidos) -->
                    <div v-for="(otherSound, otherIndex) in selectedSounds.filter(s => s.id !== sound.id)" :key="otherSound.id" class="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                      <span class="w-6 h-6 flex items-center justify-center bg-red-400 text-white font-bold rounded-full text-xs">
                        {{ String.fromCharCode(65 + selectedSounds.findIndex(s => s.id === otherSound.id)) }}
                      </span>
                      <span class="flex-1 text-sm text-gray-700">{{ otherSound.title }}</span>
                      <span class="text-xs text-red-500 font-bold">✗ Incorrecta</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Resumen de opciones -->
              <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p class="text-sm text-blue-700 mb-2">
                  📊 <strong>Resumen:</strong> {{ selectedSounds.length }} sonidos = {{ selectedSounds.length }} opciones de respuesta
                </p>
                <p class="text-xs text-blue-600">
                  💡 Durante la evaluación, se reproducirá aleatoriamente uno de estos sonidos y el paciente deberá identificarlo correctamente entre todas las opciones.
                </p>
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
              @click="handleSuccessClose"
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
import { ref, computed, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { ScreeningRepository } from '../../../infrastructure/screening/repositories/ScreeningRepository';
import { SoundRepository } from '../../../infrastructure/screening/repositories/SoundRepository';
import { CreateScreeningUseCase, GetSoundsUseCase } from '../../../application/screening/use-cases/ScreeningUseCases';
import type { Sound } from '../../../core/screening/entities/screening';

// Repositories (Dependency Injection)
const screeningRepository = new ScreeningRepository();
const soundRepository = new SoundRepository();

// Use Cases
const createScreeningUseCase = new CreateScreeningUseCase(screeningRepository);
const getSoundsUseCase = new GetSoundsUseCase(soundRepository);

// Form Data
const formData = ref({
  title: '',
  description: '',
});

// State
const sounds = ref<Sound[]>([]);
const selectedSounds = ref<Sound[]>([]);
const loadingSounds = ref(false);
const isSubmitting = ref(false);
const showSuccessModal = ref(false);

// Preview Audio State
const previewPlayingId = ref<string | null>(null);
const previewProgress = ref<Record<string, string>>({});
const audioErrors = ref<Record<string, string>>({});

// Errors
const errors = ref({
  title: '',
  description: '',
  soundId: '',
});

// Computed
const isFormValid = computed(() => {
  const hasTitle = formData.value.title.length >= 3;
  const hasDescription = formData.value.description.trim().length > 0;
  const hasSounds = selectedSounds.value.length >= 2;
  
  return hasTitle && hasDescription && hasSounds
    && !errors.value.title
    && !errors.value.description
    && !errors.value.soundId;
});

const formProgress = computed(() => {
  let progress = 0;
  if (formData.value.title.length >= 3) progress += 33;
  if (formData.value.description.trim().length > 0) progress += 33;
  if (selectedSounds.value.length >= 2) progress += 34;
  return progress;
});

// Methods
const isSoundSelected = (soundId: string): boolean => {
  return selectedSounds.value.some(s => s.id === soundId);
};

const toggleSound = (sound: Sound) => {
  const index = selectedSounds.value.findIndex(s => s.id === sound.id);
  if (index === -1) {
    selectedSounds.value.push(sound);
  } else {
    selectedSounds.value.splice(index, 1);
  }
};

// Preview Audio Methods
const togglePreviewPlay = (soundId: string) => {
  const audioElement = document.getElementById(`audio-${soundId}`) as HTMLAudioElement;
  
  if (!audioElement) {
    console.error('Audio element not found for sound:', soundId);
    return;
  }
  
  console.log('Toggle play for sound:', soundId, 'src:', audioElement.src);
  
  if (previewPlayingId.value === soundId) {
    audioElement.pause();
    previewPlayingId.value = null;
    previewProgress.value[soundId] = '0%';
  } else {
    // Pause all other audios
    document.querySelectorAll('audio').forEach(a => (a as HTMLAudioElement).pause());
    previewPlayingId.value = soundId;
    audioElement.play().catch(err => {
      console.error('Error playing audio:', err);
      previewPlayingId.value = null;
    });
  }
};

const onPreviewEnded = (soundId: string) => {
  previewPlayingId.value = null;
  previewProgress.value[soundId] = '0%';
};

const onAudioError = (soundId: string, event: Event) => {
  const audio = event.target as HTMLAudioElement;
  console.error('Audio error for sound', soundId, ':', audio.error);
  audioErrors.value[soundId] = audio.error?.message || 'Error loading audio';
};

const onAudioLoaded = (soundId: string) => {
  const audio = document.getElementById(`audio-${soundId}`) as HTMLAudioElement;
  if (audio) {
    audio.addEventListener('timeupdate', () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      previewProgress.value[soundId] = `${progress}%`;
    });
  }
};

const validateTitle = () => {
  if (formData.value.title.length === 0) {
    errors.value.title = '';
  } else if (formData.value.title.length < 3) {
    errors.value.title = 'El nombre debe tener al menos 3 caracteres';
  } else if (formData.value.title.length > 80) {
    errors.value.title = 'El nombre no puede exceder 80 caracteres';
  } else {
    errors.value.title = '';
  }
};

const loadSounds = async () => {
  loadingSounds.value = true;
  try {
    sounds.value = await getSoundsUseCase.execute();
    console.log('Loaded sounds with URLs:', sounds.value.map(s => ({ id: s.id, title: s.title, sound: s.sound })));
  } catch (error) {
    console.error('Error al cargar sonidos:', error);
    errors.value.soundId = 'Error al cargar los sonidos';
  } finally {
    loadingSounds.value = false;
  }
};

const handleSubmit = async () => {
  validateTitle();
  
  if (!isFormValid.value) return;
  
  isSubmitting.value = true;
  
  try {
    await createScreeningUseCase.execute({
      title: formData.value.title,
      description: formData.value.description,
      soundId: selectedSounds.value.map(s => s.id),
      options: selectedSounds.value.map((sound, index) => ({
        text: sound.title,
        isCorrect: index === 0, // First one is correct by default
      })),
    });
    
    showSuccessModal.value = true;
  } catch (error: any) {
    console.error('Error al crear tamizaje:', error);
    alert(error.message || 'Error al crear el tamizaje');
  } finally {
    isSubmitting.value = false;
  }
};

const handleSuccessClose = () => {
  showSuccessModal.value = false;
  resetForm();
};

const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
  };
  selectedSounds.value = [];
  errors.value = {
    title: '',
    description: '',
    soundId: '',
  };
};

// Lifecycle
onMounted(() => {
  loadSounds();
});
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
