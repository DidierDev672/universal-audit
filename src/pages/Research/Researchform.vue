<template>
    <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl mb-8">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <div>
          <h2 class="text-3xl font-bold mb-1">Nueva Investigación</h2>
          <p class="text-white/90">Registra un nuevo estudio de salud auditiva</p>
        </div>
      </div>
    </div>

    <!-- Form Container -->
    <div class="bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden">
      <!-- Form Progress Indicator -->
      <div class="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-4 border-b border-indigo-100">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600 font-medium">Paso 1 de 1</span>
          <span class="text-indigo-600 font-semibold">Información General</span>
        </div>
        <div class="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
            :style="{ width: formProgress + '%' }"
          ></div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-8 space-y-8">
        
        <!-- Nombre de la Investigación -->
        <div class="space-y-2">
          <label for="researchName" class="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Nombre de la Investigación
            <span class="text-red-500">*</span>
          </label>
          
          <div class="relative">
            <input
              id="researchName"
              v-model="formData.name"
              type="text"
              required
              maxlength="200"
              placeholder="Ej: Efectos de la terapia de sonido en pacientes con tinnitus"
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>

            <!-- Character Count -->
            <div class="absolute right-4 top-1/2 -translate-y-1/2">
              <span :class="[
                'text-xs font-medium',
                formData.name.length > 180 ? 'text-orange-500' : 'text-gray-400'
              ]">
                {{ formData.name.length }}/200
              </span>
            </div>
          </div>

          <!-- Error Message -->
          <transition name="fade">
            <p v-if="errors.name" class="text-sm text-red-600 flex items-center gap-2 mt-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
              </svg>
              {{ errors.name }}
            </p>
          </transition>

          <!-- Help Text -->
          <p class="text-xs text-gray-500 flex items-start gap-2 mt-2">
            <svg class="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Ingresa un título claro y descriptivo para tu investigación</span>
          </p>
        </div>

        <!-- Descripción de la Investigación -->
        <div class="space-y-2">
          <label for="researchDescription" class="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
            </svg>
            Descripción de la Investigación
            <span class="text-red-500">*</span>
          </label>

          <div class="relative">
            <textarea
              id="researchDescription"
              v-model="formData.description"
              required
              rows="8"
              maxlength="2000"
              placeholder="Describe los objetivos, metodología, alcance y resultados esperados de la investigación..."
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
                formData.description.length > 1800
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-gray-100 text-gray-600'
              ]">
                {{ formData.description.length }}/2000
              </span>
            </div>
          </div>

          <!-- Error Message -->
          <transition name="fade">
            <p v-if="errors.description" class="text-sm text-red-600 flex items-center gap-2 mt-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
              </svg>
              {{ errors.description }}
            </p>
          </transition>

          <!-- Help Text -->
          <p class="text-xs text-gray-500 flex items-start gap-2 mt-2">
            <svg class="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Incluye detalles como objetivos, metodología, población objetivo y resultados esperados</span>
          </p>
        </div>

        <!-- Preview Card -->
        <div v-if="formData.name || formData.description"
          class="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-indigo-200">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            Vista Previa
          </h3>
          
          <div class="bg-white rounded-xl p-4 shadow-sm border border-indigo-100">
            <h4 class="font-bold text-gray-800 mb-2">
              {{ formData.name || 'Nombre de la investigación...' }}
            </h4>
            <p class="text-sm text-gray-600 whitespace-pre-wrap">
              {{ formData.description || 'Descripción de la investigación...' }}
            </p>
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
            {{ isSubmitting ? 'Guardando...' : 'Guardar Investigación' }}
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
            <h3 class="text-2xl font-bold text-gray-800 mb-2">¡Investigación Guardada!</h3>
            <p class="text-gray-600 mb-6">La investigación ha sido registrada exitosamente en el sistema.</p>
            <button
              @click="showSuccessModal = false"
              class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
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
import axios  from 'axios';

// Form Data
const formData = ref({
  name: '',
  description: '',
});

// Errors
const errors = ref({
  name: '',
  description: '',
});

// States
const isSubmitting = ref(false);
const showSuccessModal = ref(false);

// Computed
const isFormValid = computed(() => {
  return formData.value.name.length >= 10
    && formData.value.description.length >= 50
    && !errors.value.name
    && !errors.value.description;
});

const formProgress = computed(() => {
  let progress = 0;
  if (formData.value.name.length >= 10) progress += 50;
  if (formData.value.description.length >= 50) progress += 50;
  return progress;
});

// Validation Functions
const validateName = () => {
  if (formData.value.name.length === 0) {
    errors.value.name = '';
  } else if (formData.value.name.length < 10) {
    errors.value.name = 'El nombre debe tener al menos 10 caracteres';
  } else if (formData.value.name.length > 200) {
    errors.value.name = 'El nombre no puede exceder 200 caracteres';
  } else {
    errors.value.name = '';
  }
};

const validateDescription = () => {
  if (formData.value.description.length === 0) {
    errors.value.description = '';
  } else if (formData.value.description.length < 50) {
    errors.value.description = 'La descripción debe tener al menos 50 caracteres';
  } else if (formData.value.description.length > 2000) {
    errors.value.description = 'La descripción no puede exceder 2000 caracteres';
  } else {
    errors.value.description = '';
  }
};

// Form Actions
const handleSubmit = async () => {
  validateName();
  validateDescription();
  
  if (!isFormValid.value) return;
  
  isSubmitting.value = true;
  
  // Simular envío a API
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  console.log('Investigación guardada:', formData.value);


  // Enviar a API
  await axios.post('http://localhost:3000/api/v1/research', formData.value);
  
  isSubmitting.value = false;
  showSuccessModal.value = true;
  
  // Resetear después de mostrar modal
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
  errors.value = {
    name: '',
    description: '',
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