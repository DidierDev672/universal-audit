<template>
  <div class="min-h-full">
    <!-- Header de perfil -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 mb-8 text-white shadow-lg">
      <div class="flex items-center gap-6">
        <div
          class="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold border-4 border-white/30">
          {{ userInitials }}
        </div>
        <div>
          <h1 class="text-3xl font-bold mb-1">{{ patient?.fullName || 'Cargando...' }}</h1>
          <p class="text-blue-100">{{ patient?.documentType }}: {{ patient?.documentNumber }}</p>
          <div class="flex gap-2 mt-3">
            <span class="px-3 py-1 bg-white/20 rounded-full text-sm">{{ age }} años</span>
            <span v-if="patient?.isAllergic"
              class="px-3 py-1 bg-red-500/30 rounded-full text-sm flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Alérgico
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
      <svg class="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p class="text-gray-500">Cargando información del paciente...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8">
      <div class="flex items-start">
        <svg class="w-6 h-6 text-red-500 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="text-red-800 font-semibold">Error al cargar el perfil</h3>
          <p class="text-red-600 mt-1">{{ error }}</p>
          <button @click="fetchPatientData"
            class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Reintentar
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido del perfil -->
    <div v-else-if="patient" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Información Personal -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Información Personal
        </h2>

        <div class="space-y-4">
          <div class="flex justify-between py-3 border-b border-gray-100">
            <span class="text-gray-500">Nombre completo</span>
            <span class="font-medium text-gray-800">{{ patient.fullName }}</span>
          </div>
          <div class="flex justify-between py-3 border-b border-gray-100">
            <span class="text-gray-500">Tipo de documento</span>
            <span class="font-medium text-gray-800">{{ patient.documentType }}</span>
          </div>
          <div class="flex justify-between py-3 border-b border-gray-100">
            <span class="text-gray-500">Número de documento</span>
            <span class="font-medium text-gray-800">{{ patient.documentNumber }}</span>
          </div>
          <div class="flex justify-between py-3 border-b border-gray-100">
            <span class="text-gray-500">Fecha de nacimiento</span>
            <span class="font-medium text-gray-800">{{ formattedBirthDate }}</span>
          </div>
          <div class="flex justify-between py-3 border-b border-gray-100">
            <span class="text-gray-500">Edad</span>
            <span class="font-medium text-gray-800">{{ age }} años</span>
          </div>
          <div class="flex justify-between py-3 border-b border-gray-100">
            <span class="text-gray-500">Altura</span>
            <span class="font-medium text-gray-800">{{ patient.height }} cm</span>
          </div>
          <div class="flex justify-between py-3 border-b border-gray-100">
            <span class="text-gray-500">Peso</span>
            <span class="font-medium text-gray-800">{{ patient.weight }} kg</span>
          </div>
          <div class="flex justify-between py-3 border-b border-gray-100">
            <span class="text-gray-500">Alergias</span>
            <span :class="patient.isAllergic ? 'text-red-600 font-medium' : 'text-gray-800'">
              {{ patient.isAllergic ? 'Sí' : 'No' }}
            </span>
          </div>
          <div class="flex justify-between py-3 border-b border-gray-100">
            <span class="text-gray-500">Consentimiento informado</span>
            <span :class="patient.hasConsent ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'">
              {{ patient.hasConsent ? 'Sí' : 'Pendiente' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Historia Familiar -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Historia Familiar
        </h2>

        <!-- Padre -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Padre
          </h3>
          <div class="bg-gray-50 rounded-xl p-4 space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-500">Nombre</span>
              <span class="font-medium text-gray-800">{{ patient.familyData.father.fullName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Edad</span>
              <span class="font-medium text-gray-800">{{ patient.familyData.father.age }} años</span>
            </div>
            <div>
              <span class="text-gray-500 block mb-2">Enfermedades</span>
              <div class="flex flex-wrap gap-2">
                <span v-for="(disease, index) in patient.familyData.father.diseases" :key="index"
                  class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {{ disease }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Madre -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Madre
          </h3>
          <div class="bg-gray-50 rounded-xl p-4 space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-500">Nombre</span>
              <span class="font-medium text-gray-800">{{ patient.familyData.mother.fullName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Edad</span>
              <span class="font-medium text-gray-800">{{ patient.familyData.mother.age }} años</span>
            </div>
            <div>
              <span class="text-gray-500 block mb-2">Enfermedades</span>
              <div class="flex flex-wrap gap-2">
                <span v-for="(disease, index) in patient.familyData.mother.diseases" :key="index"
                  class="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                  {{ disease }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// ── Interfaces ─────────────────────────────────────────────────────────────
interface FamilyMember {
  fullName: string;
  age: number;
  diseases: string[];
}

interface FamilyData {
  father: FamilyMember;
  mother: FamilyMember;
}

interface Patient {
  id: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  height: number;
  weight: number;
  isAllergic: boolean;
  familyData: FamilyData;
  hasConsent: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── State ────────────────────────────────────────────────────────────────────
const patient = ref<Patient | null>(null);
const isLoading = ref(false);
const error = ref('');

// ── Computed ─────────────────────────────────────────────────────────────────
const userInitials = computed(() => {
  if (!patient.value?.fullName) return '??';
  const names = patient.value.fullName.split(' ');
  return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
});

const age = computed(() => {
  if (!patient.value?.birthDate) return 0;
  const birth = new Date(patient.value.birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
});

const formattedBirthDate = computed(() => {
  if (!patient.value?.birthDate) return '';
  const date = new Date(patient.value.birthDate);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// ── Methods ─────────────────────────────────────────────────────────────────
const fetchPatientData = async () => {
  const id = localStorage.getItem('id');
  if (!id) {
    error.value = 'No se encontró ID del paciente en el almacenamiento local';
    return;
  }

  isLoading.value = true;
  error.value = '';

  try {
    // const token = localStorage.getItem('auth_token');
    const response = await axios.get<Patient>(
      `http://localhost:3000/api/v1/patients/${id}`,
      {
        headers: {
          // 'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    patient.value = response.data;
  } catch (err: any) {
    console.error('Error fetching patient:', err);
    if (err.response?.status === 404) {
      error.value = 'El paciente no se encuentra registrado';
    } else if (err.response?.data?.error) {
      error.value = err.response.data.error;
    } else {
      error.value = 'Error al cargar los datos del paciente. Por favor intente nuevamente.';
    }
  } finally {
    isLoading.value = false;
  }
};

// ── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  fetchPatientData();
});
</script>
