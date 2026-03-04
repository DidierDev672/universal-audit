<template>
  <footer class="bg-white/90 backdrop-blur-lg border-t border-indigo-100 mt-auto shadow-lg">
    <div class="px-6 py-6">
      <!-- Main Footer Content -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <!-- Left Section - Branding -->
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-bold text-gray-800">Centro Auditivo</p>
              <p class="text-xs text-gray-500">Tu salud auditiva importa</p>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="hidden md:flex items-center gap-4 text-sm text-gray-600">
            <a href="#" class="hover:text-indigo-600 transition-colors font-medium">Acerca de</a>
            <span class="text-gray-300">•</span>
            <a href="#" class="hover:text-indigo-600 transition-colors font-medium">Privacidad</a>
            <span class="text-gray-300">•</span>
            <a href="#" class="hover:text-indigo-600 transition-colors font-medium">Contacto</a>
            <span class="text-gray-300">•</span>
            <a href="#" class="hover:text-indigo-600 transition-colors font-medium">Ayuda</a>
          </div>
        </div>

        <!-- Center Section - Health Indicators -->
        <div class="flex items-center gap-3 flex-wrap justify-center">
          <!-- Hearing Health Status -->
          <div class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div class="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
            <span class="text-xs font-semibold text-green-700">Salud Auditiva Óptima</span>
          </div>

          <!-- System Status -->
          <div class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <span class="text-xs font-semibold text-blue-700">Sistema Seguro</span>
          </div>
        </div>

        <!-- Right Section - Copyright & Version -->
        <div class="text-center md:text-right">
          <p class="text-xs text-gray-600 font-medium">
            © {{ currentYear }} Centro Auditivo. Todos los derechos reservados.
          </p>
          <p class="text-xs text-gray-400 mt-1">
            Versión {{ version }} • Actualizado: {{ lastUpdate }}
          </p>
        </div>
      </div>

      <!-- Additional Info Row -->
      <div class="mt-6 pt-6 border-t border-indigo-100">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Certifications & Features -->
          <div class="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-xl text-xs font-semibold border border-indigo-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              Certificado Médico
            </span>
            <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-xl text-xs font-semibold border border-green-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              ISO 9001
            </span>
            <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-xl text-xs font-semibold border border-blue-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              HIPAA Compliant
            </span>
          </div>

          <!-- Social & Professional Links -->
          <div class="flex items-center gap-3">
            <span class="text-xs text-gray-500 hidden md:inline font-medium">Síguenos:</span>
            <div class="flex items-center gap-2">
              <!-- LinkedIn -->
              <a href="#" class="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-indigo-100 hover:to-purple-100 text-gray-600 hover:text-indigo-600 transition-all shadow-sm hover:shadow-md">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <!-- Twitter/X -->
              <a href="#" class="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-indigo-100 hover:to-purple-100 text-gray-600 hover:text-indigo-600 transition-all shadow-sm hover:shadow-md">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <!-- YouTube -->
              <a href="#" class="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-indigo-100 hover:to-purple-100 text-gray-600 hover:text-indigo-600 transition-all shadow-sm hover:shadow-md">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Medical Disclaimer -->
      <div class="mt-4 pt-4 border-t border-indigo-100">
        <p class="text-xs text-gray-500 text-center leading-relaxed">
          <span class="font-semibold">Aviso Médico:</span> Este portal proporciona información general sobre salud auditiva.
          No reemplaza el consejo médico profesional. Consulte a un audiólogo certificado para evaluación y tratamiento personalizado.
        </p>
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts">
  import {ref, computed} from 'vue';

  const version = ref('3.0.1');
  const currentYear = computed(() => new Date().getFullYear());
  const lastUpdate = computed(() => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });
</script>