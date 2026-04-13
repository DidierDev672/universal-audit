<template>
  <div class="flex h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-purple-50 overflow-hidden">
    <!-- Sidebar -->
    <Sidebar :is-open="isSidebarOpen" :active-item="activeItem" @toggle="toggleSidebar" @navigate="handleNavigate" />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Bar -->
      <header class="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 z-10">
        <div class="px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <!-- Mobile menu button -->
            <button @click="toggleSidebar" class="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <!-- Page Title -->
            <div class="flex items-center gap-3">
              <div class="hidden lg:block">
                <h1 class="text-2xl font-bold text-gray-800">{{ currentPageTitle }}</h1>
                <p class="text-sm text-gray-500">{{ currentPageSubtitle }}</p>
              </div>
            </div>

            <!-- User Menu -->
            <div class="flex items-center gap-4">
              <!-- Notifications -->
              <button class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <!-- User Avatar -->
              <div @click="goToProfile"
                class="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition">
                <div
                  class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                  {{ userInitials }}
                </div>
                <div class="hidden sm:block text-left">
                  <p class="text-sm font-medium text-gray-700">{{ displayName }}</p>
                  <p class="text-xs text-gray-500">{{ userRole }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div class="px-4 sm:px-6 lg:px-8 py-8">
          <nav class="mb-8 border-b border-gray-100 pb-4">
            <div class="flex flex-wrap gap-1">

              <RouterLink to="/research"
                class="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Investigaciones</span>
              </RouterLink>

              <RouterLink to="/questionnaire"
                class="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 rounded-lg hover:text-purple-600 hover:bg-purple-50 transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Cuestionarios</span>
              </RouterLink>

              <RouterLink to="/hearing"
                class="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span>Evaluación Auditiva</span>
              </RouterLink>

              <RouterLink to="/audio-library"
                class="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 rounded-lg hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <span>Sonidos</span>
              </RouterLink>

              <RouterLink to="/create-screening"
                class="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 rounded-lg hover:text-gray-700 hover:bg-gray-100 transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543-.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543-.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
                </svg>
                <span>Crear Tamizaje</span>
              </RouterLink>

              <RouterLink to="/patient-screening-assignment"
                class="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 rounded-lg hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Asignar Tamizaje</span>
              </RouterLink>

            </div>
          </nav>
          <RouterView></RouterView>
        </div>
      </main>

      <!-- Footer -->
      <Footer />
    </div>
    <div v-if="isSidebarOpen" @click="toggleSidebar" class="lg:hidden fixed inset-0 bg-black/50 z-30"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar.vue';
import Footer from '../footer/Footer.vue';

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

// ── Props ───────────────────────────────────────────────────────────────────
interface Props {
  userName?: string;
  userRole?: string;
  pageTitle?: string;
  pageSubtitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  userName: 'Dr. Juan Pérez',
  userRole: '',
  pageTitle: 'Dashboard',
  pageSubtitle: 'Resumen de actividades',
});

const route = useRoute();
const router = useRouter();
const isSidebarOpen = ref(false);
const currentPage = ref('dashboard');
const patient = ref<Patient | null>(null);
const isLoadingPatient = ref(false);
const patientError = ref('');

const displayName = computed(() => {
  return patient.value?.fullName || props.userName;
});

const userInitials = computed(() => {
  const name = displayName.value;
  const names = name.split(' ');
  return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
});

const currentPageTitle = computed(() => props.pageTitle);
const currentPageSubtitle = computed(() => props.pageSubtitle);

const activeItem = computed(() => {
  const path = route.path;
  if (path === '/research-form') return 'crear-investigacion-auditiva';
  if (path === '/tinnitus-questionnaire') return 'crear-cuestionarios-tinnitus';
  if (path === '/hearing-screening-form' || path === '/create-screening') return 'crear-tamizaje';
  if (path === '/patient-registration-form') return 'crear-registro-paciente';
  if (path === '/user-registration') return 'crear-usuario-sistema';
  return '';
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const handleNavigate = (page: string) => {
  currentPage.value = page;
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false;
  }
};

// ── API Methods ─────────────────────────────────────────────────────────────
const fetchPatientData = async () => {
  const id = localStorage.getItem('id');
  if (!id) {
    patientError.value = 'No se encontró ID del paciente';
    return;
  }

  isLoadingPatient.value = true;
  patientError.value = '';

  try {
    const response = await axios.get<Patient>(
      `http://localhost:3000/api/v1/patients/${id}`,
      {
        timeout: 10000
      }
    );

    patient.value = response.data;
  } catch (error: any) {
    console.error('Error fetching patient:', error);
    if (error.response?.status === 404) {
      patientError.value = 'El paciente no se encuentra registrado';
    } else {
      patientError.value = 'Error al cargar datos del paciente';
    }
  } finally {
    isLoadingPatient.value = false;
  }
};

const goToProfile = () => {
  router.push('/patient-profile');
};

// ── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  fetchPatientData();
});
</script>