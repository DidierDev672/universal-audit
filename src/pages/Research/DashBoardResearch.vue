
<template>
 <div class="w-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
    <!-- Header minimalista -->
    <div class="w-full h-16 bg-white/80 backdrop-blur-sm border-b border-blue-100 flex items-center justify-center shadow-sm">
      <div class="flex items-center gap-3">
        <!-- Icono de salud auditiva -->
        <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
          </svg>
        </div>
        <h1 class="text-xl font-semibold text-gray-800">Panel de Investigaciones</h1>
      </div>
    </div>

    <div class="p-8 max-w-7xl mx-auto">
      <!-- Descripción minimalista -->
      <p class="text-sm text-gray-600 mb-8 max-w-2xl">
        Gestiona tus proyectos de investigación en salud auditiva y consulta análisis detallados.
      </p>

      <!-- Grid de cards minimalista -->
      <aside class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
  <div class="p-6">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
      </div>
      <h2 class="text-base font-semibold text-gray-800">Crear Investigación</h2>
    </div>
    <RouterLink 
      to="/research-form" 
      class="block w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md"
    >
      Crear
    </RouterLink>
  </div>
</div>

<div class="bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
  <div class="p-6">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
        </svg>
      </div>
      <h2 class="text-base font-semibold text-gray-800">Listar Investigaciones</h2>
    </div>
    <RouterLink 
      to="/research-list" 
      class="block w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all shadow-sm hover:shadow-md"
    >
      Listar
    </RouterLink>
  </div>
</div>
      </aside>
    </div>
  </div>
</template>
<script setup lang="ts">
</script>