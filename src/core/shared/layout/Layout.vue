<template>
  <div class="flex h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-purple-50 overflow-hidden">
    <!-- Sidebar -->
    <Sidebar :is-open="isSidebarOpen" :active-item="activeItem" @toggle="toggleSidebar" @navigate="handleNavigate" />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Bar -->
      <header class="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 z-10 relative overflow-hidden">

        <!-- Íconos flotantes decorativos -->
        <div class="absolute inset-0 pointer-events-none select-none" aria-hidden="true">

          <!-- Salud humana -->
          <!-- Corazón -->
          <svg class="absolute top-2 left-[6%] w-5 h-5 text-rose-300 opacity-50 animate-float-slow" fill="currentColor"
            viewBox="0 0 24 24">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>

          <!-- Estetoscopio (custom path simplificado) -->
          <svg class="absolute bottom-1 left-[18%] w-5 h-5 text-blue-300 opacity-40 animate-float-medium" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9 2v6a3 3 0 006 0V2M6 8a6 6 0 0012 0M12 14v4m0 0a3 3 0 003 3h0a3 3 0 003-3v-1" />
          </svg>

          <!-- Pulso / ECG -->
          <svg class="absolute top-3 left-[32%] w-6 h-6 text-emerald-300 opacity-40 animate-float-fast" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12h3l2-7 4 14 3-9 2 4h4" />
          </svg>

          <!-- Cruz médica -->
          <svg class="absolute bottom-2 left-[44%] w-4 h-4 text-red-300 opacity-35 animate-float-slow"
            fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-4 8h-2v2a1 1 0 01-2 0v-2H9a1 1 0 010-2h2V7a1 1 0 012 0v2h2a1 1 0 010 2z" />
          </svg>

          <!-- Literatura universal -->
          <!-- Libro abierto -->
          <svg class="absolute top-2 right-[30%] w-5 h-5 text-amber-300 opacity-45 animate-float-medium" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>

          <!-- Pluma de escritura -->
          <svg class="absolute bottom-1 right-[18%] w-5 h-5 text-violet-300 opacity-40 animate-float-fast" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828L9 13z" />
          </svg>

          <!-- Pergamino / documento -->
          <svg class="absolute top-2 right-[8%] w-4 h-4 text-orange-300 opacity-35 animate-float-slow" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v14l-3-2-2 2-2-2-2 2-2-2-3 2V6a2 2 0 012-2z" />
          </svg>

        </div>

        <!-- Contenido del header (sin cambios) -->
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

      <!-- Animated Background -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <!-- Health Icons -->
        <div class="floating-icon health-icon-1">
          <svg class="w-16 h-16 text-rose-200/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div class="floating-icon health-icon-2">
          <svg class="w-20 h-20 text-teal-200/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div class="floating-icon health-icon-3">
          <svg class="w-14 h-14 text-cyan-200/35" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <div class="floating-icon health-icon-4">
          <svg class="w-12 h-12 text-emerald-200/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </svg>
        </div>

        <!-- Literature Icons -->
        <div class="floating-icon lit-icon-1">
          <svg class="w-20 h-20 text-amber-200/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div class="floating-icon lit-icon-2">
          <svg class="w-16 h-16 text-indigo-200/35" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <div class="floating-icon lit-icon-3">
          <svg class="w-14 h-14 text-violet-200/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
          </svg>
        </div>
        <div class="floating-icon lit-icon-4">
          <svg class="w-12 h-12 text-purple-200/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <div class="floating-icon lit-icon-5">
          <svg class="w-16 h-16 text-pink-200/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.131A8 8 0 008 3.239c-3.34 4.183-3.906 9.806-1.628 14.232" />
          </svg>
        </div>

        <!-- DNA/Science Icon -->
        <div class="floating-icon science-icon-1">
          <svg class="w-14 h-14 text-blue-200/35" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
      </div>

      <!-- Main Content -->
      <main
        class="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50/90 via-blue-50/90 to-indigo-50/90 relative z-10">
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

<style scoped>
/* ── Animated Background Icons ─────────────────────────────────────────────── */
.floating-icon {
  position: absolute;
  opacity: 0.6;
  filter: blur(0.5px);
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

/* Health Icons Positions & Animations */
.health-icon-1 {
  top: 10%;
  left: 5%;
  animation: float1 20s infinite ease-in-out;
}

.health-icon-2 {
  top: 25%;
  right: 8%;
  animation: float2 25s infinite ease-in-out;
}

.health-icon-3 {
  bottom: 30%;
  left: 12%;
  animation: float3 22s infinite ease-in-out;
}

.health-icon-4 {
  top: 60%;
  right: 15%;
  animation: float4 18s infinite ease-in-out;
}

/* Literature Icons Positions & Animations */
.lit-icon-1 {
  top: 15%;
  right: 25%;
  animation: float2 28s infinite ease-in-out;
}

.lit-icon-2 {
  bottom: 20%;
  right: 5%;
  animation: float1 24s infinite ease-in-out;
}

.lit-icon-3 {
  top: 45%;
  left: 3%;
  animation: float3 26s infinite ease-in-out;
}

.lit-icon-4 {
  bottom: 40%;
  right: 30%;
  animation: float4 21s infinite ease-in-out;
}

.lit-icon-5 {
  top: 70%;
  left: 20%;
  animation: float2 23s infinite ease-in-out;
}

/* Science Icons */
.science-icon-1 {
  top: 35%;
  right: 12%;
  animation: float1 19s infinite ease-in-out;
}

/* Float Animations */
@keyframes float1 {

  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }

  25% {
    transform: translate(20px, -30px) rotate(5deg);
  }

  50% {
    transform: translate(40px, 10px) rotate(-3deg);
  }

  75% {
    transform: translate(-10px, 20px) rotate(2deg);
  }
}

@keyframes float2 {

  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }

  33% {
    transform: translate(-25px, 25px) rotate(-8deg);
  }

  66% {
    transform: translate(30px, -15px) rotate(6deg);
  }
}

@keyframes float3 {

  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }

  20% {
    transform: translate(15px, 35px) rotate(3deg);
  }

  40% {
    transform: translate(-20px, 10px) rotate(-5deg);
  }

  60% {
    transform: translate(25px, -25px) rotate(7deg);
  }

  80% {
    transform: translate(-5px, -10px) rotate(-2deg);
  }
}

@keyframes float4 {

  0%,
  100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }

  50% {
    transform: translate(-15px, 20px) rotate(10deg) scale(1.05);
  }
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .floating-icon {
    transform: scale(0.7);
  }

  .health-icon-1 {
    top: 5%;
    left: 2%;
  }

  .health-icon-2 {
    top: 20%;
    right: 5%;
  }

  .lit-icon-1 {
    top: 10%;
    right: 15%;
  }

  .lit-icon-2 {
    bottom: 15%;
    right: 2%;
  }
}
</style>