<template>
  <div class="min-h-screen bg-slate-50">

    <!-- Header minimalista -->
    <header class="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-100">
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
    <main class="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

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

          </div>
        </div>

      </div>
    </main>
  </div>
</template>
<script setup lang="ts">
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
</style>