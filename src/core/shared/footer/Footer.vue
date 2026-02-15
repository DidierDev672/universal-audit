<template>
  <footer class="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-auto">
    <div class="px-6 py-4">
      <!-- Main Footer Content -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Left Section - Branding -->
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-white"
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
              <p class="text-sm font-semibold text-gray-800">AudioUniversal</p>
              <p class="text-xs text-gray-500">Salud Auditiva Premium</p>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="hidden md:flex items-center gap-4 text-sm text-gray-600">
            <a href="#" class="hover:text-orange-600 transition">Acerca de</a>
            <span class="text-gray-300">•</span>
            <a href="#" class="hover:text-orange-600 transition">Contacto</a>
            <span class="text-gray-300">•</span>
            <a href="#" class="hover:text-orange-600 transition">Soporte</a>
          </div>
        </div>

        <!-- Center Section - Status Indicators -->
        <div class="flex items-center gap-4">
          <!-- System Status -->
          <div
            class="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg"
          >
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-xs font-medium text-green-700"
              >Sistema Operativo</span
            >
          </div>

          <!-- Environment Indicator -->
          <div
            class="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg"
          >
            <svg
              class="w-4 h-4 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span class="text-xs font-medium text-amber-700"
              >Ambiente Cálido</span
            >
          </div>
        </div>

        <!-- Right Section - Copyright & Info -->
        <div class="text-center md:text-right">
          <p class="text-xs text-gray-500">
            © {{ currentYear }} AudioUniversal. Todos los derechos reservados.
          </p>
          <p class="text-xs text-gray-400 mt-1">
            Versión {{ version }} • Última actualización: {{ lastUpdate }}
          </p>
        </div>
      </div>

      <!-- Additional Footer Row (Optional) -->
      <div class="mt-4 pt-4 border-t border-gray-100">
        <div
          class="flex flex-col md:flex-row items-center justify-between gap-3"
        >
          <!-- Features Pills -->
          <div
            class="flex flex-wrap items-center justify-center md:justify-start gap-2"
          >
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium"
            >
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Datos Seguros
            </span>
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
            >
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Alta Velocidad
            </span>
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium"
            >
              <svg
                class="w-3.5 h-3.5"
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
              Certificado ISO
            </span>
          </div>

          <!-- Social & Support Links -->
          <div class="flex items-center gap-3">
            <span class="text-xs text-gray-500 hidden md:inline"
              >Síguenos:</span
            >
            <div class="flex items-center gap-2">
              <a
                href="#"
                class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600 transition"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
              </a>
              <a
                href="#"
                class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600 transition"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                  />
                </svg>
              </a>
              <a
                href="#"
                class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600 transition"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const version = ref("2.1.0");
const currentYear = computed(() => new Date().getFullYear());
const lastUpdate = computed(() => {
  const date = new Date();
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
});
</script>
