<template>
  <div class="max-w-5xl mx-auto">
    <!-- Header -->
    <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl mb-8">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <div>
          <h2 class="text-3xl font-bold mb-1">Registro de Paciente 📋</h2>
          <p class="text-white/90">Sistema de salud auditiva</p>
        </div>
      </div>
    </div>

    <!-- Form Container -->
    <div class="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
      <!-- Progress Indicator -->
      <div class="bg-gradient-to-r from-emerald-50 to-teal-50 px-8 py-4 border-b border-emerald-100">
        <div class="flex items-center justify-between text-sm mb-3">
          <span class="text-gray-600 font-medium">Progreso del formulario</span>
          <span class="text-emerald-600 font-semibold">{{ formProgress }}%</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
            :style="{ width: formProgress + '%' }"
          ></div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-8 space-y-8">
        
        <!-- SECCIÓN 1: DATOS PERSONALES -->
        <div class="space-y-6">
          <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2 pb-3 border-b border-gray-200">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            Datos Personales
          </h3>

          <!-- Nombre Completo -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-800">
              Nombre Completo <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.fullName"
              type="text"
              required
              placeholder="Ej: Juan Carlos Pérez García"
              class="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
            />
          </div>

          <!-- Tipo y Número de Documento -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Tipo de Documento -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-800">
                Tipo de Documento <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.documentType"
                required
                class="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
              >
                <option value="">Seleccione...</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="PA">Pasaporte</option>
                <option value="TE">Tarjeta de Extranjero</option>
              </select>
            </div>

            <!-- Número de Documento -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-800">
                Número de Documento <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.documentNumber"
                type="text"
                required
                placeholder="Ej: 1234567890"
                class="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <!-- Fecha de Nacimiento -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-800">
              Fecha de Nacimiento <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.birthDate"
              type="date"
              required
              :max="maxDate"
              class="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
            />
            <p v-if="patientAge" class="text-xs text-gray-500 mt-1">
              Edad: {{ patientAge }} años
            </p>
          </div>

          <!-- Altura y Peso -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Altura -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-800">
                Altura (cm) <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formData.height"
                type="number"
                required
                min="50"
                max="250"
                placeholder="Ej: 170"
                class="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
              />
            </div>

            <!-- Peso -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-800">
                Peso (kg) <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formData.weight"
                type="number"
                required
                min="20"
                max="300"
                step="0.1"
                placeholder="Ej: 70.5"
                class="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <!-- Alergias a Medicamentos -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-800">
              ¿Alérgico a algún medicamento? <span class="text-red-500">*</span>
            </label>
            <div class="flex items-center gap-6 mb-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="formData.isAllergic"
                  type="radio"
                  :value="true"
                  class="w-4 h-4 text-emerald-600"
                />
                <span class="text-gray-700">Sí</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="formData.isAllergic"
                  type="radio"
                  :value="false"
                  class="w-4 h-4 text-emerald-600"
                />
                <span class="text-gray-700">No</span>
              </label>
            </div>
          </div>
        </div>

        <!-- SECCIÓN 2: DATOS FAMILIARES -->
        <div class="space-y-6">
          <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2 pb-3 border-b border-gray-200">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            Datos Familiares
          </h3>

          <!-- Información del Padre -->
          <div class="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Información del Padre
            </h4>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-800 mb-2">
                  Nombre Completo del Padre <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.familyData.father.fullName"
                  type="text"
                  required
                  placeholder="Ej: Carlos Pérez Rodríguez"
                  class="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-800 mb-2">
                  Edad del Padre <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="formData.familyData.father.age"
                  type="number"
                  required
                  min="18"
                  max="120"
                  placeholder="Ej: 55"
                  class="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-800 mb-2">
                  Enfermedades del Padre
                </label>
                <textarea
                  v-model="formData.familyData.father.diseases"
                  rows="3"
                  placeholder="Especifique enfermedades o condiciones médicas (Ej: Diabetes, Hipertensión). Deje en blanco si no tiene."
                  class="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Información de la Madre -->
          <div class="bg-pink-50 rounded-2xl p-6 border border-pink-100">
            <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <svg class="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Información de la Madre
            </h4>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-800 mb-2">
                  Nombre Completo de la Madre <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.familyData.mother.fullName"
                  type="text"
                  required
                  placeholder="Ej: María García López"
                  class="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-800 mb-2">
                  Edad de la Madre <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="formData.familyData.mother.age"
                  type="number"
                  required
                  min="18"
                  max="120"
                  placeholder="Ej: 52"
                  class="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-800 mb-2">
                  Enfermedades de la Madre
                </label>
                <textarea
                  v-model="formData.familyData.mother.diseases"
                  rows="3"
                  placeholder="Especifique enfermedades o condiciones médicas (Ej: Artritis, Colesterol alto). Deje en blanco si no tiene."
                  class="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Vista Previa -->
        <div v-if="formProgress > 30" class="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-6 border-2 border-emerald-200">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            Vista Previa del Registro
          </h3>
          
          <div class="bg-white rounded-xl p-5 space-y-4">
            <div v-if="formData.fullName" class="flex items-start gap-3">
              <span class="text-sm font-semibold text-gray-500 w-32">Paciente:</span>
              <span class="text-sm text-gray-800">{{ formData.fullName }}</span>
            </div>
            <div v-if="formData.documentType && formData.documentNumber" class="flex items-start gap-3">
              <span class="text-sm font-semibold text-gray-500 w-32">Documento:</span>
              <span class="text-sm text-gray-800">{{ documentTypeLabel }} - {{ formData.documentNumber }}</span>
            </div>
            <div v-if="patientAge" class="flex items-start gap-3">
              <span class="text-sm font-semibold text-gray-500 w-32">Edad:</span>
              <span class="text-sm text-gray-800">{{ patientAge }} años</span>
            </div>
            <div v-if="formData.height && formData.weight" class="flex items-start gap-3">
              <span class="text-sm font-semibold text-gray-500 w-32">Medidas:</span>
              <span class="text-sm text-gray-800">{{ formData.height }} cm / {{ formData.weight }} kg (IMC: {{ calculateBMI() }})</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="resetForm"
            class="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all flex items-center gap-2"
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
              'px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg',
              isFormValid && !isSubmitting
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            <svg v-if="!isSubmitting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ isSubmitting ? 'Registrando...' : 'Registrar Paciente' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Success Modal -->
    <transition name="modal">
      <div v-if="showSuccessModal" 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="showSuccessModal = false">
        <div class="bg-white rounded-3xl p-8 max-w-md shadow-2xl" @click.stop>
          <div class="text-center">
            <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">¡Paciente Registrado!</h3>
            <p class="text-gray-600 mb-6">El paciente ha sido registrado exitosamente en el sistema.</p>
            <button
              @click="showSuccessModal = false"
              class="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
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
import axios from 'axios';

// Form Data
const formData = ref({
  // Datos Personales
  fullName: '',
  documentType: '',
  documentNumber: '',
  birthDate: '',
  height: null as number | null,
  weight: null as number | null,
  isAllergic: null as boolean | null,
  // Datos Familiares
  familyData: {
    father: {
      fullName: '',
      age: null as number | null,
      diseases: '',
    },
    mother: {
      fullName: '',
      age: null as number | null,
      diseases: '',
    },
  },
});

// States
const isSubmitting = ref(false);
const showSuccessModal = ref(false);

// Computed
const maxDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

const patientAge = computed(() => {
  if (!formData.value.birthDate) return null;
  const today = new Date();
  const birthDate = new Date(formData.value.birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

const documentTypeLabel = computed(() => {
  const types: Record<string, string> = {
    'TI': 'Tarjeta de identidad',
    'CC': 'Cedula de ciudadania',
    'PA': 'Pasaporte',
    'TE': 'Tarjeta de extranjero',
  };
  return types[formData.value.documentType] || '';
});

const isFormValid = computed(() => {
  const personalDataValid = 
    formData.value.fullName.length > 0 &&
    formData.value.documentType &&
    formData.value.documentNumber &&
    formData.value.birthDate &&
    formData.value.height !== null &&
    formData.value.weight !== null;


  return personalDataValid;
});

const formProgress = computed(() => {
  let progress = 0;
  const totalFields = 11;
  let completedFields = 0;

  if (formData.value.fullName) completedFields++;
  if (formData.value.documentType) completedFields++;
  if (formData.value.documentNumber) completedFields++;
  if (formData.value.birthDate) completedFields++;
  if (formData.value.height) completedFields++;
  if (formData.value.weight) completedFields++;
  progress = Math.round((completedFields / totalFields) * 100);
  return progress;
});

// Methods
const calculateBMI = (): string => {
  if (!formData.value.height || !formData.value.weight) return '-';
  const heightInMeters = formData.value.height / 100;
  const bmi = formData.value.weight / (heightInMeters * heightInMeters);
  return bmi.toFixed(1);
};

const handleSubmit = async () => {
  if (!isFormValid.value) return;
  
  isSubmitting.value = true;
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const data = {
    ...formData.value,
    documentType: documentTypeLabel.value,
    age: patientAge.value,
    familyData: {
      father: {
        ...formData.value.familyData.father,
        diseases: formData.value.familyData.father.diseases ? [formData.value.familyData.father.diseases] : [],
      },
      mother: {
        ...formData.value.familyData.mother,
        diseases: formData.value.familyData.mother.diseases ? [formData.value.familyData.mother.diseases] : [],
      },
    },
  };

  
  axios.post('http://localhost:3000/api/v1/patients', data)
  .then((result) => {
    console.log('The record has been successfully created');
  })
  .catch((error: Error) => console.log({error}));

  console.log('Paciente registrado:', data);
  
  isSubmitting.value = false;
  showSuccessModal.value = true;
};

const resetForm = () => {
  formData.value = {
    fullName: '',
    documentType: '',
    documentNumber: '',
    birthDate: '',
    height: null,
    weight: null,
    isAllergic: null,
    familyData: {
      father: {
        fullName: '',
        age: null,
        diseases: '',
      },
      mother: {
        fullName: '',
        age: null,
        diseases: '',
      },
    },
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
</style>