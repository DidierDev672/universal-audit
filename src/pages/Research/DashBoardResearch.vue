
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
        
        <!-- Card 1 - Investigación Auditiva -->
        <div class="group bg-white rounded-2xl border border-blue-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
          <!-- Header con gradiente -->
          <aside class="h-24 bg-gradient-to-br from-blue-500 to-indigo-600 relative overflow-hidden">
            <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div class="relative h-full flex items-center justify-center">
              <svg class="w-10 h-10 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
            </div>
          </aside>

          <!-- Contenido -->
          <div class="p-5">
            <h3 class="text-base font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
              Investigación Auditiva
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Estudio sobre los mecanismos del sistema auditivo humano y nuevas terapias.
            </p>
          </div>

          <!-- Footer opcional -->
          <div class="px-5 pb-5 flex items-center gap-2 text-xs text-gray-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Actualizado hoy</span>
          </div>
        </div>

        <!-- Card 2 - Lista de Investigaciones -->
        <div class="group bg-white rounded-2xl border border-emerald-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
          <!-- Header con gradiente -->
          <aside class="h-24 bg-gradient-to-br from-emerald-500 to-teal-600 relative overflow-hidden">
            <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div class="relative h-full flex items-center justify-center">
              <svg class="w-10 h-10 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </aside>

          <!-- Contenido -->
          <div class="p-5">
            <h3 class="text-base font-semibold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
              Lista de Investigaciones
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Catálogo completo de estudios sobre tinnitus, implantes cocleares y más.
            </p>
          </div>

          <!-- Footer opcional -->
          <div class="px-5 pb-5 flex items-center gap-2 text-xs text-gray-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>12 estudios activos</span>
          </div>
        </div>

        <!-- Card 3 - Análisis (ejemplo adicional) -->
        <div class="group bg-white rounded-2xl border border-purple-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
          <aside class="h-24 bg-gradient-to-br from-purple-500 to-indigo-600 relative overflow-hidden">
            <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div class="relative h-full flex items-center justify-center">
              <svg class="w-10 h-10 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
          </aside>

          <div class="p-5">
            <h3 class="text-base font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
              Análisis de Datos
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Visualiza métricas y resultados de evaluaciones audiométricas.
            </p>
          </div>

          <div class="px-5 pb-5 flex items-center gap-2 text-xs text-gray-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
            <span>85% completado</span>
          </div>
        </div>

        <!-- Card 4 - Reportes (ejemplo adicional) -->
        <div class="group bg-white rounded-2xl border border-amber-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
          <aside class="h-24 bg-gradient-to-br from-amber-500 to-orange-600 relative overflow-hidden">
            <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div class="relative h-full flex items-center justify-center">
              <svg class="w-10 h-10 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </aside>

          <div class="p-5">
            <h3 class="text-base font-semibold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
              Reportes Clínicos
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Genera informes detallados sobre tamizajes y evaluaciones auditivas.
            </p>
          </div>

          <div class="px-5 pb-5 flex items-center gap-2 text-xs text-gray-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            <span>24 reportes</span>
          </div>
        </div>

      </aside>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref }from "vue";
</script>