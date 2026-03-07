<template>
  <aside :class="[
      'fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out',
      'w-80 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-indigo-100',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]">
    <div class="flex flex-col h-full">
      <!-- Logo & Brand -->
       <div class="px-6 py-6 border-b border-indigo-100 bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-700">
        <div class="flex items-center">
          <!-- Logo Icon -->
           <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
             <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
           </div>
           <div class="text-white">
            <h2 class="text-xl font-bold">Creación</h2>
            <p class="text-xs text-white/80">Portal de Gestión</p>
           </div>
        </div>
       </div>

       <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 overflow-y-auto">
          <div class="space-y-2">
            <!-- Crear Investigación Auditiva -->
            <RouterLink 
              to="/research-form" 
              :class="[
                'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group',
                activeItem === 'crear-investigacion-auditiva'
                  ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
                  : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
              ]"
            >
              <div :class="[
                'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                activeItem === 'crear-investigacion-auditiva'
                  ? 'bg-white/20 backdrop-blur-sm'
                  : 'bg-linear-to-br from-emerald-100 to-teal-100 group-hover:from-emerald-200 group-hover:to-teal-200'
              ]">
                <svg :class="[
                      'w-6 h-6 transition-transform',
                      activeItem === 'crear-investigacion-auditiva' ? 'text-white scale-110' : 'text-emerald-600'
                    ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <div class="flex-1 text-left">
                <span class="font-semibold">Crear Investigación Auditiva</span>
                <p :class="[
                      'text-xs mt-0.5',
                      activeItem === 'crear-investigacion-auditiva' ? 'text-white/80' : 'text-gray-500'
                    ]">
                  Nueva investigación auditiva
                </p>
              </div>
              <svg
                v-if="activeItem === 'crear-investigacion-auditiva'"
                class="w-5 h-5 text-white animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </RouterLink>

            <!-- Crear Cuestionarios para Tinnitus -->
            <RouterLink 
              to="/tinnitus-questionnaire" 
              :class="[
                'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group',
                activeItem === 'crear-cuestionarios-tinnitus'
                  ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
                  : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
              ]"
            >
              <div :class="[
                'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                activeItem === 'crear-cuestionarios-tinnitus'
                  ? 'bg-white/20 backdrop-blur-sm'
                  : 'bg-linear-to-br from-emerald-100 to-teal-100 group-hover:from-emerald-200 group-hover:to-teal-200'
              ]">
                <svg :class="[
                      'w-6 h-6 transition-transform',
                      activeItem === 'crear-cuestionarios-tinnitus' ? 'text-white scale-110' : 'text-emerald-600'
                    ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="flex-1 text-left">
                <span class="font-semibold">Crear Cuestionarios para Tinnitus</span>
                <p :class="[
                      'text-xs mt-0.5',
                      activeItem === 'crear-cuestionarios-tinnitus' ? 'text-white/80' : 'text-gray-500'
                    ]">
                  Cuestionarios especializados
                </p>
              </div>
              <svg
                v-if="activeItem === 'crear-cuestionarios-tinnitus'"
                class="w-5 h-5 text-white animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </RouterLink>

            <!-- Crear Tamizaje -->
            <RouterLink 
              to="/hearing-screening-form" 
              :class="[
                'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group',
                activeItem === 'crear-tamizaje'
                  ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
                  : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
              ]"
            >
              <div :class="[
                'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                activeItem === 'crear-tamizaje'
                  ? 'bg-white/20 backdrop-blur-sm'
                  : 'bg-linear-to-br from-emerald-100 to-teal-100 group-hover:from-emerald-200 group-hover:to-teal-200'
              ]">
                <svg :class="[
                      'w-6 h-6 transition-transform',
                      activeItem === 'crear-tamizaje' ? 'text-white scale-110' : 'text-emerald-600'
                    ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                </svg>
              </div>
              <div class="flex-1 text-left">
                <span class="font-semibold">Crear Tamizaje</span>
                <p :class="[
                      'text-xs mt-0.5',
                      activeItem === 'crear-tamizaje' ? 'text-white/80' : 'text-gray-500'
                    ]">
                  Nuevo tamizaje auditivo
                </p>
              </div>
              <svg
                v-if="activeItem === 'crear-tamizaje'"
                class="w-5 h-5 text-white animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </RouterLink>

            <!-- Crear Registro Paciente -->
            <RouterLink 
              to="/patient-registration-form" 
              :class="[
                'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group',
                activeItem === 'crear-registro-paciente'
                  ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
                  : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
              ]"
            >
              <div :class="[
                'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                activeItem === 'crear-registro-paciente'
                  ? 'bg-white/20 backdrop-blur-sm'
                  : 'bg-linear-to-br from-emerald-100 to-teal-100 group-hover:from-emerald-200 group-hover:to-teal-200'
              ]">
                <svg :class="[
                      'w-6 h-6 transition-transform',
                      activeItem === 'crear-registro-paciente' ? 'text-white scale-110' : 'text-emerald-600'
                    ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <div class="flex-1 text-left">
                <span class="font-semibold">Crear Registro Paciente</span>
                <p :class="[
                      'text-xs mt-0.5',
                      activeItem === 'crear-registro-paciente' ? 'text-white/80' : 'text-gray-500'
                    ]">
                  Nuevo paciente
                </p>
              </div>
              <svg
                v-if="activeItem === 'crear-registro-paciente'"
                class="w-5 h-5 text-white animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </RouterLink>
          </div>

          <!-- Divider -->
           <div class="my-6 border-t border-gray-200"></div>
           
           <!-- Info Card -->
            <div class="bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
                </div>
                <div>
              <p class="text-sm font-semibold text-gray-800">Acciones Rápidas</p>
            </div>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
            Crea nuevos registros y gestiona el sistema de forma eficiente.
          </p>
            </div>
        </nav>
        
        <div class="p-4 border-t border-indigo-100 bg-linear-to-br from-gray-50 to-indigo-50">
           <!-- Logout Button -->
        <button class="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group">
          <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span class="font-medium">Cerrar Sesión</span>
        </button>
        </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

interface Props {
  isOpen: boolean;
  activeItem: string;
}

defineProps<Props>();
</script>