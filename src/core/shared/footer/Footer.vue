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