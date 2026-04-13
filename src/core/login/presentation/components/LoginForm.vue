<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
    <!-- Container principal -->
    <div class="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden">
      <!-- Panel izquierdo - Ilustración y branding -->
      <div
        class="md:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-12 flex flex-col justify-between text-white relative overflow-hidden">
        <!-- Decoración de fondo -->
        <div class="absolute inset-0 opacity-10">
          <svg class="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="150" fill="white" />
            <circle cx="300" cy="300" r="120" fill="white" />
            <circle cx="350" cy="100" r="80" fill="white" />
          </svg>
        </div>

        <!-- Íconos flotantes de salud auditiva y salud humana -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div v-for="(particle, idx) in floatingIcons" :key="idx" class="floating-icon" :style="{
            left: particle.left + '%',
            top: particle.top + '%',
            animationDuration: particle.duration + 's',
            animationDelay: particle.delay + 's',
            opacity: particle.opacity,
            color: particle.icon.color
          }">
            <div class="icon-wrapper" :style="{
              width: particle.size + 'px',
              height: particle.size + 'px',
              filter: particle.glow ? `drop-shadow(0 0 10px ${particle.icon.color})` : 'none'
            }" v-html="particle.icon.svg" />
          </div>
        </div>

        <!-- Contenido -->
        <div class="relative z-10">
          <!-- Logo y nombre -->
          <div class="flex items-center gap-3 mb-8">
            <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold">AudioCare</h1>
              <p class="text-white/80 text-sm">Sistema de Salud Auditiva</p>
            </div>
          </div>

          <!-- Ilustración central -->
          <div class="my-12">
            <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <svg class="w-full h-48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Ilustración de audífono -->
                <circle cx="100" cy="100" r="60" stroke="white" stroke-width="3" opacity="0.3" />
                <path d="M70 100 Q70 60, 100 60 Q130 60, 130 100" stroke="white" stroke-width="4"
                  stroke-linecap="round" />
                <circle cx="100" cy="60" r="8" fill="white" />
                <line x1="100" y1="68" x2="100" y2="95" stroke="white" stroke-width="3" />
                <circle cx="100" cy="100" r="15" fill="white" opacity="0.8" />
                <!-- Ondas de sonido -->
                <path d="M145 90 Q155 100, 145 110" stroke="white" stroke-width="2" opacity="0.6"
                  stroke-linecap="round" />
                <path d="M155 80 Q170 100, 155 120" stroke="white" stroke-width="2" opacity="0.4"
                  stroke-linecap="round" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="relative z-10 space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold mb-1">Atención Personalizada</h3>
              <p class="text-white/70 text-sm">
                Seguimiento continuo de tu salud auditiva
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold mb-1">Tecnología Avanzada</h3>
              <p class="text-white/70 text-sm">Equipos de última generación</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel derecho - Formulario de login -->
      <div class="md:w-1/2 p-12 flex flex-col justify-center relative">
        <!-- Overlay de carga -->
        <div v-if="isLoading"
          class="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-3xl">
          <div class="flex flex-col items-center gap-4">
            <svg class="animate-spin h-12 w-12 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p class="text-purple-600 font-medium">Iniciando sesión...</p>
          </div>
        </div>

        <div class="max-w-md mx-auto w-full">
          <!-- Encabezado -->
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-2">
              Bienvenido de vuelta
            </h2>
            <p class="text-gray-600">Ingresa a tu cuenta para continuar</p>
          </div>

          <!-- Alerta de error -->
          <div v-if="errorMessage" class="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-red-500 mt-0.5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
              </svg>
              <div>
                <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Formulario -->
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input id="email" v-model="form.email" type="email" autocomplete="email" :disabled="isLoading"
                  class="pl-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  :class="{ 'border-red-500 focus:ring-red-500': formErrors.email }" placeholder="tu@email.com" />
              </div>
              <p v-if="formErrors.email" class="mt-1 text-sm text-red-600">{{ formErrors.email }}</p>
            </div>

            <!-- Contraseña -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password" :disabled="isLoading"
                  class="pl-12 pr-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  :class="{ 'border-red-500 focus:ring-red-500': formErrors.password }" placeholder="••••••••" />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center" :disabled="isLoading">
                  <svg v-if="!showPassword" class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <p v-if="formErrors.password" class="mt-1 text-sm text-red-600">{{ formErrors.password }}</p>
            </div>

            <!-- Recordarme y olvidé contraseña -->
            <div class="flex items-center justify-between">
              <label class="flex items-center">
                <input type="checkbox" :disabled="isLoading"
                  class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 disabled:cursor-not-allowed" />
                <span class="ml-2 text-sm text-gray-600">Recordarme</span>
              </label>
              <a href="#" class="text-sm text-purple-600 hover:text-purple-700 font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <!-- Botón de submit -->
            <button type="submit" :disabled="isSubmitDisabled"
              class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>{{ isLoading ? "Iniciando sesión..." : "Iniciar sesión" }}</span>
            </button>
          </form>

          <!-- Registro -->
          <div class="mt-8 text-center">
            <p class="text-sm text-gray-600">
              ¿No tienes una cuenta?<span>{{
                isLoading ? "Iniciando sesión..." : "Iniciar sesión"
              }}</span>
              <a href="#" class="text-purple-600 hover:text-purple-700 font-medium">
                Regístrate aquí
              </a>
            </p>
          </div>

          <!-- Footer -->
          <div class="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>© 2024 AudioCare. Todos los derechos reservados.</p>
            <div class="mt-2 flex justify-center gap-4">
              <a href="#" class="hover:text-purple-600">Política de Privacidad</a>
              <span>•</span>
              <a href="#" class="hover:text-purple-600">Términos de Servicio</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

// ── Router y Store ───────────────────────────────────────────────────────────
const router = useRouter();
const authStore = useAuthStore();

// ── Interfaces ───────────────────────────────────────────────────────────────
interface HealthIcon {
  id: string;
  color: string;
  svg: string;
}

interface FloatingParticle {
  id: number;
  icon: HealthIcon;
  size: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
  opacity: number;
  glow: boolean;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  status: number;
  body: {
    patientLogin: {
      id: string;
      idPatient: string;
      email: string;
      username: string;
      permits: string[];
      token: string;
      createdAt: string;
      updatedAt: string;
    };
    token: string;
  };
}

// ── Íconos de Salud Auditiva y Salud Humana ─────────────────────────────────
const HEALTH_ICONS: HealthIcon[] = [
  // Oído / Audición
  {
    id: "ear",
    color: "#60a5fa",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 8a6 6 0 0 1 12 0c0 2.5-1.5 4-3 5.5S13 15 13 17a2 2 0 0 1-4 0c0-3 2-4 3.5-5.5S14 9 12 8a4 4 0 0 0-4 4v1a1 1 0 0 1-2 0v-1c0-2.5 2-5 5-5z"/><path d="M12 19v2"/></svg>`
  },
  // Ondas de sonido
  {
    id: "sound-waves",
    color: "#34d399",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`
  },
  // Corazón
  {
    id: "heart",
    color: "#f472b6",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
  },
  // Pulso/Actividad cardíaca
  {
    id: "heart-pulse",
    color: "#f87171",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.78 7.65 7.65 7.65-7.65.77-.78a5.4 5.4 0 0 0 0-7.65z"/><path d="M3.5 12h2.5l2-6 4 12 3-8 2 2h2.5"/></svg>`
  },
  // Estetoscopio
  {
    id: "stethoscope",
    color: "#a78bfa",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 0 0-.2.3"/><path d="M8 15v4"/><path d="M16 4v4a4 4 0 0 0 4 4v0a4 4 0 0 0 4-4V4"/><path d="M20 15v3a3 3 0 0 1-3 3v0a3 3 0 0 1-3-3v-3"/></svg>`
  },
  // Cerebro
  {
    id: "brain",
    color: "#fbbf24",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.37 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.37 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`
  },
  // Cruz médica
  {
    id: "medical-cross",
    color: "#fb7185",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 2v20"/><path d="M2 8h20"/><rect x="6" y="6" width="12" height="12" rx="2"/></svg>`
  },
  // Frecuencia/ECG
  {
    id: "activity",
    color: "#22d3ee",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`
  },
  // Usuario salud
  {
    id: "user-health",
    color: "#a3e635",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 3v4"/><path d="M10 5h4"/></svg>`
  },
  // Pastilla/Medicina
  {
    id: "pill",
    color: "#f472b6",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`
  },
  // Escudo/Salud protegida
  {
    id: "shield",
    color: "#2dd4bf",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`
  },
  // Ojo (salud visual conexión)
  {
    id: "eye",
    color: "#818cf8",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`
  }
];

// ── Generar partículas flotantes ────────────────────────────────────────────
function createParticle(id: number): FloatingParticle {
  const icon = HEALTH_ICONS[Math.floor(Math.random() * HEALTH_ICONS.length)]!;
  return {
    id,
    icon,
    size: 24 + Math.random() * 32,
    left: 5 + Math.random() * 85,
    top: 5 + Math.random() * 85,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * 10,
    opacity: 0.15 + Math.random() * 0.35,
    glow: Math.random() > 0.7
  };
}

const floatingIcons = ref<FloatingParticle[]>(
  Array.from({ length: 18 }, (_, i) => createParticle(i))
);

// ── Estado del formulario ──────────────────────────────────────────────────
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const form = ref<LoginFormData>({
  email: "",
  password: ""
});

// ── Validación ──────────────────────────────────────────────────────────────
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const formErrors = computed(() => {
  const errors: { email?: string; password?: string } = {};

  if (!form.value.email) {
    errors.email = "El correo electrónico es requerido";
  } else if (!isValidEmail(form.value.email)) {
    errors.email = "Ingresa un correo electrónico válido";
  }

  if (!form.value.password) {
    errors.password = "La contraseña es requerida";
  } else if (form.value.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
  }

  return errors;
});

const isFormValid = computed(() => {
  return Object.keys(formErrors.value).length === 0;
});

const isSubmitDisabled = computed(() => {
  return !isFormValid.value || isLoading.value;
});

// ── Manejo de submit ─────────────────────────────────────────────────────────
const handleSubmit = async () => {
  // Limpiar error previo al iniciar nuevo intento
  errorMessage.value = "";

  // Validar antes de enviar
  if (!isFormValid.value) {
    return;
  }

  isLoading.value = true;

  try {
    const response = await axios.post<LoginResponse>(
      "http://localhost:3000/api/v1/auth/login",
      {
        email: form.value.email,
        password: form.value.password
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );


    // Flujo de éxito
    if (response.status === 200) {
      const body: any = response.data;

      // Guardar token en localStorage
      localStorage.setItem("auth_token", body.token);
      localStorage.setItem("id", body?.patientLogin?.idPatient);
      // Guardar usuario en el store
      authStore.setToken(body.token);
      authStore.setUser({
        id: body?.patientLogin?.id,
        idPatient: body?.patientLogin?.idPatient,
        email: body?.patientLogin?.email,
        username: body?.patientLogin?.username,
        permits: body?.patientLogin?.permits,
        token: body?.patientLogin?.token
      });

      // Redirigir a /home
      await router.push("/home").then(() => {
        console.log("Redirigido a /home");
      })
        .catch((error) => {
          console.error("Error al redirigir:", error);
        });
    }
  } catch (error: any) {
    // Debug: Mostrar detalles del error en consola
    console.error("Error en login:", error);
    console.error("Response status:", error.response?.status);
    console.error("Response data:", error.response?.data);
    console.error("Request payload:", { email: form.value.email, password: "***" });

    // Flujo de error
    if (error.response?.status === 401) {
      // Mostrar mensaje específico del servidor si existe, o mensaje genérico
      const serverMessage = error.response?.data?.message || error.response?.data?.error;
      errorMessage.value = serverMessage || "Credenciales incorrectas. Por favor verifica tu correo y contraseña.";
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message;
    } else if (error.code === "ERR_NETWORK") {
      errorMessage.value = "No se pudo conectar con el servidor. Verifica que el servidor esté corriendo en http://localhost:3000";
    } else {
      errorMessage.value = "Error al iniciar sesión. Por favor intenta nuevamente.";
    }
  } finally {
    isLoading.value = false;
  }
};

// ── Recrear partículas periódicamente para variación ────────────────────────
let particleInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  // Cada 8 segundos, regenerar algunas partículas para mantener el movimiento fresco
  particleInterval = setInterval(() => {
    const idx = Math.floor(Math.random() * floatingIcons.value.length);
    floatingIcons.value[idx] = createParticle(idx);
  }, 8000);
});

onUnmounted(() => {
  if (particleInterval) clearInterval(particleInterval);
});
</script>

<style scoped>
/* ── Animación flotante suave ──────────────────────────────────────────────── */
.floating-icon {
  position: absolute;
  will-change: transform, opacity;
  animation: gentleFloat linear infinite;
}

@keyframes gentleFloat {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0;
  }

  10% {
    opacity: var(--final-opacity, 0.3);
  }

  25% {
    transform: translateY(-20px) translateX(10px) rotate(5deg);
  }

  50% {
    transform: translateY(-40px) translateX(-5px) rotate(-3deg);
  }

  75% {
    transform: translateY(-60px) translateX(15px) rotate(8deg);
  }

  90% {
    opacity: var(--final-opacity, 0.3);
  }

  100% {
    transform: translateY(-80px) translateX(5px) rotate(0deg);
    opacity: 0;
  }
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.floating-icon:hover .icon-wrapper {
  transform: scale(1.2);
}

/* ── Animación de pulso sutil para algunos íconos ──────────────────────────── */
@keyframes softPulse {

  0%,
  100% {
    opacity: 0.2;
    transform: scale(1);
  }

  50% {
    opacity: 0.4;
    transform: scale(1.1);
  }
}
</style>
