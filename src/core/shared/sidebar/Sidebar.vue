<template>
  <aside :class="[
    'fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out',
    'w-80 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-indigo-100',
    isOpen ? 'translate-x-0' : '-translate-x-full'
  ]">
    <div class="flex flex-col h-full">
      <!-- Logo & Brand -->
      <div
        class="px-6 py-6 border-b border-indigo-100 bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-700 overflow-hidden">
        <!-- Background WhatsApp-style with music icons -->
        <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
          <!-- Nota musical - top left -->
          <div class="absolute top-3 left-4 w-8 h-8 rounded-full bg-gray-100/20 flex items-center justify-center">
            <svg class="w-4 h-4 text-white/40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>

          <!-- Corcheas - top right -->
          <div class="absolute top-5 right-12 w-6 h-6 rounded-full bg-gray-400/20 flex items-center justify-center">
            <svg class="w-3 h-3 text-white/35" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>

          <!-- Auriculares - middle left -->
          <div class="absolute top-16 left-2 w-10 h-10 rounded-full bg-slate-200/15 flex items-center justify-center">
            <svg class="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>

          <!-- Parlantes - bottom right -->
          <div class="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-gray-700/15 flex items-center justify-center">
            <svg class="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </div>

          <!-- Clave de sol - middle right -->
          <div class="absolute top-12 right-6 w-8 h-8 rounded-full bg-slate-500/15 flex items-center justify-center">
            <svg class="w-4 h-4 text-white/35" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 3c-1.5 0-2.7.4-3.6 1.2C7.5 5 7 6.2 7 7.5c0 1.5.7 2.6 2 3.3V18c0 1.1.9 2 2 2s2-.9 2-2v-2h-2v-2h3c.6 0 1-.4 1-1V7.5C13 5.5 12.5 3 12 3zm0 7c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
            </svg>
          </div>

          <!-- Ecualizador - bottom left -->
          <div class="absolute bottom-6 left-8 w-7 h-7 rounded-full bg-gray-100/20 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>

          <!-- Disco de vinilo - center right -->
          <div class="absolute top-20 right-16 w-11 h-11 rounded-full bg-gray-400/10 flex items-center justify-center">
            <svg class="w-6 h-6 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke-width="1.5" />
              <circle cx="12" cy="12" r="3" stroke-width="1.5" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
            </svg>
          </div>

          <!-- Micrófono - top center -->
          <div class="absolute top-2 left-24 w-6 h-6 rounded-full bg-slate-200/20 flex items-center justify-center">
            <svg class="w-3 h-3 text-white/35" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>

          <!-- Pentagrama - middle area -->
          <div class="absolute top-10 left-16 w-8 h-8 rounded-full bg-gray-700/10 flex items-center justify-center">
            <svg class="w-4 h-4 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M3 6h18M3 10h18M3 14h18M3 18h18" />
            </svg>
          </div>

          <!-- Pulso musical - bottom center -->
          <div class="absolute bottom-3 left-20 w-7 h-7 rounded-full bg-slate-500/15 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- Logo Icon -->
            <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div class="text-white">
              <h2 class="text-xl font-bold">Creación</h2>
              <p class="text-xs text-white/80">Portal de Gestión</p>
            </div>
          </div>

          <!-- Toggle Button -->
          <button @click="$emit('toggle')" class="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            title="Ocultar/Mostrar sidebar">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 overflow-y-auto">
        <div class="space-y-2">
          <!-- Crear Investigación Auditiva -->
          <RouterLink to="/research-form" :class="[
            'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group',
            activeItem === 'crear-investigacion-auditiva'
              ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
              : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
          ]">
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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
            <svg v-if="activeItem === 'crear-investigacion-auditiva'" class="w-5 h-5 text-white animate-pulse"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>

          <!-- Calendario de Investigaciones -->
          <RouterLink to="/calendar" @click="activeItem = 'calendario'" :class="[
            'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group',
            activeItem === 'calendario'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
              : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
          ]">
            <div :class="[
              'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all',
              activeItem === 'calendario'
                ? 'bg-white/20 backdrop-blur-sm'
                : 'bg-gradient-to-br from-emerald-100 to-teal-100 group-hover:from-emerald-200 group-hover:to-teal-200'
            ]">
              <svg :class="[
                'w-6 h-6 transition-transform',
                activeItem === 'calendario' ? 'text-white scale-110' : 'text-emerald-600'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <div class="flex-1 text-left">
              <span class="font-semibold block">Calendario</span>
              <p :class="[
                'text-xs mt-0.5',
                activeItem === 'calendario' ? 'text-white/80' : 'text-gray-500'
              ]">
                Gestión de tareas e investigaciones
              </p>
            </div>

            <svg v-if="activeItem === 'calendario'" class="w-5 h-5 text-white animate-pulse" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>

          <!-- Crear Cuestionarios para Tinnitus -->
          <RouterLink to="/tinnitus-questionnaire" :class="[
            'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group',
            activeItem === 'crear-cuestionarios-tinnitus'
              ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
              : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
          ]">
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <svg v-if="activeItem === 'crear-cuestionarios-tinnitus'" class="w-5 h-5 text-white animate-pulse"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>

          <!-- Asignar Cuestionarios de Tinnitus -->
          <RouterLink to="/tinnitus-assignment" @click="activeItem = 'asignar-cuestionarios-tinnitus'" :class="[
            'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group',
            activeItem === 'asignar-cuestionarios-tinnitus'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
              : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
          ]">
            <div :class="[
              'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all',
              activeItem === 'asignar-cuestionarios-tinnitus'
                ? 'bg-white/20 backdrop-blur-sm'
                : 'bg-gradient-to-br from-emerald-100 to-teal-100 group-hover:from-emerald-200 group-hover:to-teal-200'
            ]">
              <svg :class="[
                'w-6 h-6 transition-transform',
                activeItem === 'asignar-cuestionarios-tinnitus' ? 'text-white scale-110' : 'text-emerald-600'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>

            <div class="flex-1 text-left">
              <span class="font-semibold block">Asignar Cuestionarios</span>
              <p :class="[
                'text-xs mt-0.5',
                activeItem === 'asignar-cuestionarios-tinnitus' ? 'text-white/80' : 'text-gray-500'
              ]">
                Asignar a pacientes
              </p>
            </div>

            <svg v-if="activeItem === 'asignar-cuestionarios-tinnitus'" class="w-5 h-5 text-white animate-pulse"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>

          <!-- Ver Respuestas de Tinnitus -->
          <RouterLink to="/tinnitus-responses" @click="activeItem = 'ver-respuestas-tinnitus'" :class="[
            'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group',
            activeItem === 'ver-respuestas-tinnitus'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
              : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
          ]">
            <div :class="[
              'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all',
              activeItem === 'ver-respuestas-tinnitus'
                ? 'bg-white/20 backdrop-blur-sm'
                : 'bg-gradient-to-br from-emerald-100 to-teal-100 group-hover:from-emerald-200 group-hover:to-teal-200'
            ]">
              <svg :class="[
                'w-6 h-6 transition-transform',
                activeItem === 'ver-respuestas-tinnitus' ? 'text-white scale-110' : 'text-emerald-600'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <div class="flex-1 text-left">
              <span class="font-semibold block">Ver Respuestas Tinnitus</span>
              <p :class="[
                'text-xs mt-0.5',
                activeItem === 'ver-respuestas-tinnitus' ? 'text-white/80' : 'text-gray-500'
              ]">
                Respuestas de pacientes
              </p>
            </div>

            <svg v-if="activeItem === 'ver-respuestas-tinnitus'" class="w-5 h-5 text-white animate-pulse" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>

          <!-- Crear Tamizaje -->
          <RouterLink to="/hearing-screening-form" :class="[
            'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group',
            activeItem === 'crear-tamizaje'
              ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
              : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
          ]">
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
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
            <svg v-if="activeItem === 'crear-tamizaje'" class="w-5 h-5 text-white animate-pulse" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>
          <RouterLink to="/add-sound" :class="[
            'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group',
            activeItem === 'crear-tamizaje'
              ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
              : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
          ]">
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div class="flex-1 text-left">
              <span class="font-semibold">Agregar sonidos</span>
              <p :class="[
                'text-xs mt-0.5',
                activeItem === 'crear-tamizaje' ? 'text-white/80' : 'text-gray-500'
              ]">
                Agregar sonidos
              </p>
            </div>
            <svg v-if="activeItem === 'crear-tamizaje'" class="w-5 h-5 text-white animate-pulse" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>
          <RouterLink to="/audio-mixer" @click="activeItem = 'audio-mixer'" :class="[
            /* Clases base del contenedor */
            'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group',
            /* Estado Activo vs Inactivo */
            activeItem === 'audio-mixer'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
              : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
          ]">
            <div :class="[
              'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all',
              activeItem === 'audio-mixer'
                ? 'bg-white/20 backdrop-blur-sm'
                : 'bg-gradient-to-br from-emerald-100 to-teal-100 group-hover:from-emerald-200 group-hover:to-teal-200'
            ]">
              <svg :class="[
                'w-6 h-6 transition-transform',
                activeItem === 'audio-mixer' ? 'text-white scale-110' : 'text-emerald-600'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>

            <div class="flex-1 text-left">
              <span class="font-semibold block">Mezclador de audio (Alfa)</span>
              <p :class="[
                'text-xs mt-0.5',
                activeItem === 'audio-mixer' ? 'text-white/80' : 'text-gray-500'
              ]">
                Personalización de ambiente
              </p>
            </div>

            <svg v-if="activeItem === 'audio-mixer'" class="w-5 h-5 text-white animate-pulse" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>
          <RouterLink to="/notebook" @click="activeItem = 'notebook'" :class="[
            'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group',
            activeItem === 'notebook'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
              : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
          ]">
            <div :class="[
              'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all',
              activeItem === 'notebook'
                ? 'bg-white/20 backdrop-blur-sm'
                : 'bg-gradient-to-br from-emerald-100 to-teal-100 group-hover:from-emerald-200 group-hover:to-teal-200'
            ]">
              <svg :class="[
                'w-6 h-6 transition-transform',
                activeItem === 'notebook' ? 'text-white scale-110' : 'text-emerald-600'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            <div class="flex-1 text-left">
              <span class="font-semibold block">Cuaderno clínico</span>
              <p :class="[
                'text-xs mt-0.5',
                activeItem === 'notebook' ? 'text-white/80' : 'text-gray-500'
              ]">
                Nuevo paciente
              </p>
            </div>

            <svg v-if="activeItem === 'notebook'" class="w-5 h-5 text-white animate-pulse" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>

          <!-- Ver Cuadros Clínicos -->
          <RouterLink to="/clinical-pictures" @click="activeItem = 'clinical-pictures'" :class="[
            'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group',
            activeItem === 'clinical-pictures'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
              : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
          ]">
            <div :class="[
              'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all',
              activeItem === 'clinical-pictures'
                ? 'bg-white/20 backdrop-blur-sm'
                : 'bg-gradient-to-br from-emerald-100 to-teal-100 group-hover:from-emerald-200 group-hover:to-teal-200'
            ]">
              <svg :class="[
                'w-6 h-6 transition-transform',
                activeItem === 'clinical-pictures' ? 'text-white scale-110' : 'text-emerald-600'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <div class="flex-1 text-left">
              <span class="font-semibold block">Ver Cuadros Clínicos</span>
              <p :class="[
                'text-xs mt-0.5',
                activeItem === 'clinical-pictures' ? 'text-white/80' : 'text-gray-500'
              ]">
                Lista de cuadros clínicos
              </p>
            </div>

            <svg v-if="activeItem === 'clinical-pictures'" class="w-5 h-5 text-white animate-pulse" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>

          <!-- Ver Respuestas de Tamizaje -->
          <RouterLink to="/screening-responses" @click="activeItem = 'screening-responses'" :class="[
            'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group',
            activeItem === 'screening-responses'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
              : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
          ]">
            <div :class="[
              'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all',
              activeItem === 'screening-responses'
                ? 'bg-white/20 backdrop-blur-sm'
                : 'bg-gradient-to-br from-emerald-100 to-teal-100 group-hover:from-emerald-200 group-hover:to-teal-200'
            ]">
              <svg :class="[
                'w-6 h-6 transition-transform',
                activeItem === 'screening-responses' ? 'text-white scale-110' : 'text-emerald-600'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>

            <div class="flex-1 text-left">
              <span class="font-semibold block">Ver Respuestas de Tamizaje</span>
              <p :class="[
                'text-xs mt-0.5',
                activeItem === 'screening-responses' ? 'text-white/80' : 'text-gray-500'
              ]">
                Respuestas por paciente
              </p>
            </div>

            <svg v-if="activeItem === 'screening-responses'" class="w-5 h-5 text-white animate-pulse" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>

          <!-- Crear Registro Paciente -->
          <RouterLink to="/patient-registration-form" :class="[
            'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group',
            activeItem === 'crear-registro-paciente'
              ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
              : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
          ]">
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
            <svg v-if="activeItem === 'crear-registro-paciente'" class="w-5 h-5 text-white animate-pulse" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>

          <!-- Crear Usuario del Sistema -->
          <RouterLink to="/user-registration" :class="[
            'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group',
            activeItem === 'crear-usuario-sistema'
              ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
              : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
          ]">
            <div :class="[
              'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all',
              activeItem === 'crear-usuario-sistema'
                ? 'bg-white/20 backdrop-blur-sm'
                : 'bg-linear-to-br from-emerald-100 to-teal-100 group-hover:from-emerald-200 group-hover:to-teal-200'
            ]">
              <svg :class="[
                'w-6 h-6 transition-transform',
                activeItem === 'crear-usuario-sistema' ? 'text-white scale-110' : 'text-emerald-600'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div class="flex-1 text-left">
              <span class="font-semibold">Crear Usuario</span>
              <p :class="[
                'text-xs mt-0.5',
                activeItem === 'crear-usuario-sistema' ? 'text-white/80' : 'text-gray-500'
              ]">
                Nuevo usuario del sistema
              </p>
            </div>
            <svg v-if="activeItem === 'crear-usuario-sistema'" class="w-5 h-5 text-white animate-pulse" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>

          <!-- Perfil de Usuario -->
          <RouterLink to="/patient-profile" @click="activeItem = 'perfil-usuario'" :class="[
            'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group',
            activeItem === 'perfil-usuario'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
              : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
          ]">
            <div :class="[
              'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all',
              activeItem === 'perfil-usuario'
                ? 'bg-white/20 backdrop-blur-sm'
                : 'bg-gradient-to-br from-emerald-100 to-teal-100 group-hover:from-emerald-200 group-hover:to-teal-200'
            ]">
              <svg :class="[
                'w-6 h-6 transition-transform',
                activeItem === 'perfil-usuario' ? 'text-white scale-110' : 'text-emerald-600'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            <div class="flex-1 text-left">
              <span class="font-semibold block">Perfil de Usuario</span>
              <p :class="[
                'text-xs mt-0.5',
                activeItem === 'perfil-usuario' ? 'text-white/80' : 'text-gray-500'
              ]">
                Ver información personal
              </p>
            </div>

            <svg v-if="activeItem === 'perfil-usuario'" class="w-5 h-5 text-white animate-pulse" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>
        </div>

        <!-- Divider -->
        <div class="my-6 border-t border-gray-200"></div>

        <!-- Info Card -->
        <div class="bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
          <div class="flex items-center gap-3 mb-3">
            <div
              class="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
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
        <button
          class="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group">
          <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  </aside>

  <!-- Floating button to show sidebar when hidden -->
  <button v-if="!isOpen" @click="$emit('toggle')"
    class="fixed top-4 left-4 z-40 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg transition-all hover:scale-105"
    title="Mostrar sidebar">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

interface Props {
  isOpen: boolean;
  activeItem: string;
}

defineProps<Props>();

defineEmits<{
  toggle: [];
}>();
</script>