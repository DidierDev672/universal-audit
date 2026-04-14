<template>
  <div class="min-h-screen bg-slate-50">

    <!-- Header minimalista -->
    <header class="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-100">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
        <div class="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <h1 class="text-sm font-semibold text-slate-800 tracking-tight">
          Panel de Investigaciones
        </h1>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

      <!-- Encabezado de sección -->
      <div class="mb-10">
        <h2 class="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight leading-snug">
          Investigaciones
        </h2>
        <p class="mt-2 text-sm sm:text-base text-slate-500 max-w-lg leading-relaxed">
          Gestiona tus proyectos de investigación en salud auditiva y consulta análisis detallados.
        </p>
      </div>

      <!-- Grid de acciones -->
      <aside class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <!-- Card: Crear -->
        <div
          class="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 p-5 flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 class="text-sm font-semibold text-slate-800 leading-tight">Crear</h2>
              <p class="text-xs text-slate-400 mt-0.5">Nueva investigación</p>
            </div>
          </div>
          <RouterLink to="/research-form"
            class="block w-full px-4 py-2.5 bg-blue-600 text-white text-center text-sm rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition-all duration-150">
            Crear
          </RouterLink>
        </div>

        <!-- Card: Listar -->
        <div
          class="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 p-5 flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <div>
              <h2 class="text-sm font-semibold text-slate-800 leading-tight">Listar</h2>
              <p class="text-xs text-slate-400 mt-0.5">Ver todas las investigaciones</p>
            </div>
          </div>
          <RouterLink to="/research-list"
            class="block w-full px-4 py-2.5 bg-emerald-600 text-white text-center text-sm rounded-lg font-medium hover:bg-emerald-700 active:scale-95 transition-all duration-150">
            Listar
          </RouterLink>
        </div>

      </aside>
    </main>
  </div>
</template>
<script setup lang="ts">
</script>