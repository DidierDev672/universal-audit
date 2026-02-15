<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4"
  >
    <!-- Container principal -->
    <div
      class="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden"
    >
      <!-- Panel izquierdo - Ilustración y branding -->
      <div
        class="md:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-12 flex flex-col justify-between text-white relative overflow-hidden"
      >
        <!-- Decoración de fondo -->
        <div class="absolute inset-0 opacity-10">
          <svg
            class="w-full h-full"
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="150" fill="white" />
            <circle cx="300" cy="300" r="120" fill="white" />
            <circle cx="350" cy="100" r="80" fill="white" />
          </svg>
        </div>

        <!-- Contenido -->
        <div class="relative z-10">
          <!-- Logo y nombre -->
          <div class="flex items-center gap-3 mb-8">
            <div
              class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold">AudioCare</h1>
              <p class="text-white/80 text-sm">Sistema de Salud Auditiva</p>
            </div>
          </div>

          <!-- Ilustración central -->
          <div class="my-12">
            <div
              class="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
            >
              <svg
                class="w-full h-48"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <!-- Ilustración de audífono -->
                <circle
                  cx="100"
                  cy="100"
                  r="60"
                  stroke="white"
                  stroke-width="3"
                  opacity="0.3"
                />
                <path
                  d="M70 100 Q70 60, 100 60 Q130 60, 130 100"
                  stroke="white"
                  stroke-width="4"
                  stroke-linecap="round"
                />
                <circle cx="100" cy="60" r="8" fill="white" />
                <line
                  x1="100"
                  y1="68"
                  x2="100"
                  y2="95"
                  stroke="white"
                  stroke-width="3"
                />
                <circle cx="100" cy="100" r="15" fill="white" opacity="0.8" />
                <!-- Ondas de sonido -->
                <path
                  d="M145 90 Q155 100, 145 110"
                  stroke="white"
                  stroke-width="2"
                  opacity="0.6"
                  stroke-linecap="round"
                />
                <path
                  d="M155 80 Q170 100, 155 120"
                  stroke="white"
                  stroke-width="2"
                  opacity="0.4"
                  stroke-linecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="relative z-10 space-y-4">
          <div class="flex items-start gap-3">
            <div
              class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
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
            <div
              class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
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
      <div class="md:w-1/2 p-12 flex flex-col justify-center">
        <div class="max-w-md mx-auto w-full">
          <!-- Encabezado -->
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-2">
              Bienvenido de vuelta
            </h2>
            <p class="text-gray-600">Ingresa a tu cuenta para continuar</p>
          </div>

          <!-- Alerta de error -->
          <!-- <div class="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div class="flex items-start">
              <svg
                class="w-5 h-5 text-red-500 mt-0.5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                />
              </svg>
              <div>
                <p class="text-sm font-medium text-red-800">{{ error }}</p>
              </div>
            </div>
          </div> -->

          <!-- Formulario -->
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Email -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo electrónico
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                >
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="pl-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <!-- Contraseña -->
            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                >
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  required
                  class="pl-12 pr-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <svg
                    v-if="!showPassword"
                    class="w-5 h-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <svg
                    v-else
                    class="w-5 h-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Recordarme y olvidé contraseña -->
            <div class="flex items-center justify-between">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 disabled:cursor-not-allowed"
                />
                <span class="ml-2 text-sm text-gray-600">Recordarme</span>
              </label>
              <a
                href="#"
                class="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <!-- Botón de submit -->
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <!-- <svg
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg> -->
              <span>{{
                isLoading ? "Iniciando sesión..." : "Iniciar sesión"
              }}</span>
            </button>
          </form>

          <!-- Registro -->
          <div class="mt-8 text-center">
            <p class="text-sm text-gray-600">
              ¿No tienes una cuenta?<span>{{
                isLoading ? "Iniciando sesión..." : "Iniciar sesión"
              }}</span>
              <a
                href="#"
                class="text-purple-600 hover:text-purple-700 font-medium"
              >
                Regístrate aquí
              </a>
            </p>
          </div>

          <!-- Footer -->
          <div
            class="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500"
          >
            <p>© 2024 AudioCare. Todos los derechos reservados.</p>
            <div class="mt-2 flex justify-center gap-4">
              <a href="#" class="hover:text-purple-600"
                >Política de Privacidad</a
              >
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
import { ref, computed } from "vue";

// const formDate = ref({
//   email: "",
//   password: "",
//   rememberMe: false,
// });

const showPassword = ref(false);
// const error = ref("");
const isLoading = ref(false);

const handleSubmit = async () => {
  try {
  } catch (error) {
    console.error("Error en login:", error);
  }
};
</script>
