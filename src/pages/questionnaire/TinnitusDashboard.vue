<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden">

    <!-- Background Icons -->
    <div class="absolute inset-0 pointer-events-none">
      <div v-for="icon in backgroundIcons" :key="icon.id"
        class="absolute transition-all duration-1000 ease-in-out opacity-8" :style="{
          left: `${icon.x}%`,
          top: `${icon.y}%`,
          fontSize: `${icon.size}px`,
          color: icon.color,
          transform: `translate(-50%, -50%) rotate(${icon.rotation}deg)`,
          animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`
        }">
        {{ icon.icon }}
      </div>
    </div>

    <!-- Header minimalista -->
    <header class="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-slate-100">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
        <div class="w-7 h-7 bg-purple-600 rounded-md flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 class="text-sm font-semibold text-slate-800 tracking-tight">
          Dashboard de Cuestionarios — Tinnitus
        </h1>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 relative z-10">

      <!-- Encabezado de sección -->
      <div class="mb-10">
        <h2 class="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight leading-snug">
          Cuestionarios
        </h2>
        <p class="mt-2 text-sm sm:text-base text-slate-500 max-w-lg leading-relaxed">
          Gestiona y analiza cuestionarios de evaluación de tinnitus con inteligencia artificial.
        </p>
        <div class="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          <svg class="w-3.5 h-3.5 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Sistema de evaluación clínica validado</span>
        </div>
      </div>

      <!-- Grid de cards principales -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        <!-- Card 1: Gestión de Cuestionarios -->
        <div
          class="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 overflow-hidden">

          <!-- Header de card -->
          <div class="px-5 pt-5 pb-4 border-b border-slate-50 flex items-center gap-3">
            <div class="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 class="text-sm font-semibold text-slate-800 leading-tight">Gestión de Cuestionarios</h2>
              <p class="text-xs text-slate-400 mt-0.5">Crear y administrar evaluaciones</p>
            </div>
          </div>

          <!-- Acciones -->
          <div class="p-5 space-y-2.5">

            <!-- Crear Cuestionario -->
            <button
              class="w-full group flex items-center justify-between px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-150 active:scale-95">
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 bg-white/15 rounded-md flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <RouterLink to="/tinnitus-questionnaire" class="text-sm font-medium">
                  Crear Cuestionario
                </RouterLink>
              </div>
              <svg class="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- Lista de Cuestionarios -->
            <button
              class="w-full group flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 rounded-lg transition-all duration-150 active:scale-95">
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 bg-purple-50 rounded-md flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <RouterLink to="/list-tinnitus-questionnaire" class="text-sm font-medium text-slate-700">
                  Lista de Cuestionarios
                </RouterLink>
              </div>
              <svg class="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              class="w-full group flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 rounded-lg transition-all duration-150 active:scale-95">
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 bg-purple-50 rounded-md flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5 text-purple-600" xmlns="http://www.w3.org/2000/svg" width="200" height="200"
                    viewBox="0 0 32 32">
                    <path fill="currentColor"
                      d="M16 3c-1.258 0-2.152.89-2.594 2H6v23h20V5h-7.406C18.152 3.89 17.258 3 16 3zm0 2c.555 0 1 .445 1 1v1h3v2h-8V7h3V6c0-.555.445-1 1-1zM8 7h2v4h12V7h2v19H8zm7 7v3h-3v2h3v3h2v-3h3v-2h-3v-3z" />
                  </svg>
                </div>
                <RouterLink to="/tinnitus-responses" class="text-sm font-medium text-slate-700">
                  Ver las respuestas de los pacientes
                </RouterLink>
              </div>
              <svg class="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Estado para fondo de iconos
const backgroundIcons = ref<Array<{ id: number, icon: string, color: string, x: number, y: number, size: number, rotation: number }>>([]);

// Iconos de salud auditiva y música
const healthMusicIcons = [
  '🎵', // Nota musical
  '♪',   // Corchea
  '♫',   // Doble corchea
  '🎧',   // Auriculares
  '🔊',   // Parlante
  '🎼',   // Clave de sol
  '🎚️',   // Ecualizador
  '💿',   // Disco de vinilo
  '🎤',   // Micrófono
  '🎶',   // Pentagrama musical
  '👂',   // Oído
  '🧠',   // Percepción
  '👂🏻',  // Audición sana
  '🛡️',   // Protección
  '📊',   // Audigrama
  '⚠️',   // Alerta auditiva
  '🦻',   // Audífono
  '🔬',   // Test auditivo
  '🤫',   // Sin ruido
  '😌',   // Bienestar
  '〰️',   // Frecuencia
  '🏥',   // Hospital/salud
  '⚕️',   // Salud médica
  '💊',   // Medicamento
  '🩺',   // Estetoscopio
  '🧪',   // Análisis
  '📈',   // Progreso
  '✅',   // Salud ok
  '🌟',   // Calidad
  '💚',   // Salud verde
  '🎯',   // Precisión
  '🔍',   // Diagnóstico
];

const iconColors = [
  '#D97706',
  '#FBBF24',
  '#D6D3D1',
  '#FB7185',
  '#1E3A5F',
  '#064E3B',
  '#059669',
  '#D1FAE5',
  '#1E293B',
  '#64748B',
  '#374151',
  '#9CA3AF'
];

// Generar posición aleatoria para iconos
const generateRandomIcons = () => {
  const icons = [];
  const numberOfIcons = 20; // Número de iconos en el fondo (más minimalista)

  for (let i = 0; i < numberOfIcons; i++) {
    icons.push({
      id: i,
      icon: healthMusicIcons[Math.floor(Math.random() * healthMusicIcons.length)],
      color: iconColors[Math.floor(Math.random() * iconColors.length)],
      x: Math.random() * 100, // Posición X en porcentaje
      y: Math.random() * 100, // Posición Y en porcentaje
      size: Math.random() * 16 + 10, // Tamaño entre 10px y 26px (más pequeño)
      rotation: Math.random() * 360 - 180 // Rotación aleatoria
    });
  }

  backgroundIcons.value = icons;
};

onMounted(() => {
  generateRandomIcons();
});
</script>
<style scoped>
/* Animación suave para hover */
.group:hover {
  transform: translateY(-2px);
}

/* Transiciones suaves */
* {
  transition-property: background-color, border-color, color, transform, shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Animación flotante para los iconos de fondo */
@keyframes float {

  0%,
  100% {
    transform: translate(-50%, -50%) translateY(0px) rotate(var(--rotation));
  }

  50% {
    transform: translate(-50%, -50%) translateY(-8px) rotate(calc(var(--rotation) + 3deg));
  }
}
</style>