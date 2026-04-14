<template>
  <div class="min-h-screen bg-slate-50">

    <!-- Header minimalista -->
    <header class="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-100">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
        <div class="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h1 class="text-sm font-semibold text-slate-800 tracking-tight">
          Dashboard de Tamizajes Auditivos
        </h1>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

      <!-- Encabezado de sección -->
      <div class="mb-10">
        <h2 class="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight leading-snug">
          Tamizajes Auditivos
        </h2>
        <p class="mt-2 text-sm sm:text-base text-slate-500 max-w-lg leading-relaxed">
          Gestiona evaluaciones auditivas, visualiza respuestas de pacientes y obtén análisis inteligentes.
        </p>
        <div class="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          <svg class="w-3.5 h-3.5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Sistema certificado de evaluación audiológica</span>
        </div>
      </div>

      <!-- Grid de cards principales -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        <!-- Card 1: Gestión de Tamizajes -->
        <div
          class="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 overflow-hidden">

          <!-- Header de card -->
          <div class="px-5 pt-5 pb-4 border-b border-slate-50 flex items-center gap-3">
            <div class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </div>
            <div>
              <h2 class="text-sm font-semibold text-slate-800 leading-tight">Gestión de Tamizajes</h2>
              <p class="text-xs text-slate-400 mt-0.5">Crear y administrar evaluaciones</p>
            </div>
          </div>

          <!-- Acciones -->
          <div class="p-5 space-y-2.5">

            <!-- Crear Tamizaje -->
            <button
              class="w-full group flex items-center justify-between px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-150 active:scale-95">
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 bg-white/15 rounded-md flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div class="text-left">
                  <p class="text-sm font-medium">Crear Tamizaje</p>
                  <p class="text-xs text-white/70 mt-0.5">Nueva evaluación auditiva</p>
                </div>
              </div>
              <svg class="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- Lista de Tamizajes -->
            <button
              class="w-full group flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 rounded-lg transition-all duration-150 active:scale-95">
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 bg-blue-50 rounded-md flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <div class="text-left">
                  <p class="text-sm font-medium text-slate-700">Lista de Tamizajes</p>
                  <p class="text-xs text-slate-400 mt-0.5">Ver todas las evaluaciones</p>
                </div>
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
<script setup lang="ts"></script>
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
</style>