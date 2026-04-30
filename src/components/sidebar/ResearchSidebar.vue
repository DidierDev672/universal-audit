<template>
  <aside class="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
    <!-- Logo/Header -->
    <div class="p-6 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <div>
          <h2 class="font-semibold text-gray-800 text-sm">Investigación</h2>
          <p class="text-xs text-gray-500">Panel de control</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-2">
      <!-- Crear investigación auditiva -->
      <RouterLink 
        to="/research-form"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
        :class="isActive('/research-form') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
      >
        <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          :class="isActive('/research-form') ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'"
        >
          <svg class="w-4 h-4" :class="isActive('/research-form') ? 'text-blue-600' : 'text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
          </svg>
        </div>
        <span>Crear investigación auditiva</span>
      </RouterLink>

      <!-- Crear cuestionarios para el tinnitus -->
      <RouterLink 
        to="/tinnitus-form"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
        :class="isActive('/tinnitus-form') ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
      >
        <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          :class="isActive('/tinnitus-form') ? 'bg-purple-100' : 'bg-gray-100 group-hover:bg-gray-200'"
        >
          <svg class="w-4 h-4" :class="isActive('/tinnitus-form') ? 'text-purple-600' : 'text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
          </svg>
        </div>
        <span>Crear cuestionarios para el tinnitus</span>
      </RouterLink>

      <!-- Crear tamizaje -->
      <RouterLink 
        to="/screening-form"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
        :class="isActive('/screening-form') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
      >
        <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          :class="isActive('/screening-form') ? 'bg-emerald-100' : 'bg-gray-100 group-hover:bg-gray-200'"
        >
          <svg class="w-4 h-4" :class="isActive('/screening-form') ? 'text-emerald-600' : 'text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <span>Crear tamizaje</span>
      </RouterLink>

      <!-- Crear registro paciente -->
      <RouterLink 
        to="/patient-form"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
        :class="isActive('/patient-form') ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
      >
        <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          :class="isActive('/patient-form') ? 'bg-amber-100' : 'bg-gray-100 group-hover:bg-gray-200'"
        >
          <svg class="w-4 h-4" :class="isActive('/patient-form') ? 'text-amber-600' : 'text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <span>Crear registro paciente</span>
      </RouterLink>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-100">
      <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
        <p class="text-xs text-gray-500 mb-2">¿Necesitas ayuda?</p>
        <button class="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
          Ver documentación →
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path: string): boolean => {
  return route.path === path || route.path.startsWith(path)
}
</script>
