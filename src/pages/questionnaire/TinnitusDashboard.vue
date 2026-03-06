<template>
  <div class="w-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 min-h-screen">
    <!-- Header minimalista -->
    <div class="w-full h-16 bg-white/80 backdrop-blur-sm border-b border-purple-100 flex items-center justify-center shadow-sm">
      <div class="flex items-center gap-3">
        <!-- Icono de tinnitus/salud auditiva -->
        <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <h1 class="text-xl font-semibold text-gray-800">Dashboard de Cuestionarios - Tinnitus</h1>
      </div>
    </div>

    <div class="p-8 max-w-7xl mx-auto">
      <!-- Descripción minimalista -->
      <div class="mb-8">
        <p class="text-sm text-gray-600 mb-2">
          Gestiona y analiza cuestionarios de evaluación de tinnitus con inteligencia artificial.
        </p>
        <div class="flex items-center gap-2 text-xs text-gray-500">
          <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>Sistema de evaluación clínica validado</span>
        </div>
      </div>

      <!-- Grid de cards principales (2 cards grandes) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        <!-- Card 1: Gestión de Cuestionarios -->
        <div class="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
          <!-- Header -->
          <div class="h-32 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 relative overflow-hidden">
            <div class="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
            <div class="relative h-full flex items-center justify-between px-6">
              <div>
                <h2 class="text-xl font-bold text-white mb-1">Gestión de Cuestionarios</h2>
                <p class="text-sm text-white/80">Crear y administrar evaluaciones</p>
              </div>
              <div class="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg class="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Contenido -->
          <div class="p-6">
            <!-- Estadísticas rápidas -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-2xl font-bold text-gray-800">12</p>
                    <p class="text-xs text-gray-500">Cuestionarios</p>
                  </div>
                </div>
              </div>

              <div class="bg-pink-50 rounded-xl p-4 border border-pink-100">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-2xl font-bold text-gray-800">234</p>
                    <p class="text-xs text-gray-500">Respuestas</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Acciones principales -->
            <div class="space-y-3">
              <!-- Crear Cuestionario -->
              <button class="w-full group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl p-4 transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow-md">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="font-semibold text-sm">Crear Cuestionario</p>
                    <p class="text-xs text-white/80">Nuevo cuestionario de tinnitus</p>
                  </div>
                </div>
                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>

              <!-- Ver Lista de Cuestionarios -->
              <button class="w-full group bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-300 text-gray-800 rounded-xl p-4 transition-all duration-200 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="font-semibold text-sm">Lista de Cuestionarios</p>
                    <p class="text-xs text-gray-500">Ver todos los cuestionarios</p>
                  </div>
                </div>
                <svg class="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <!-- Cuestionarios recientes -->
            <div class="mt-6 pt-6 border-t border-gray-100">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recientes</h3>
              <div class="space-y-2">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div class="flex items-center gap-3">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span class="text-sm text-gray-700">Evaluación de Severidad THI</span>
                  </div>
                  <span class="text-xs text-gray-400">45 respuestas</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div class="flex items-center gap-3">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span class="text-sm text-gray-700">Impacto Emocional TFI</span>
                  </div>
                  <span class="text-xs text-gray-400">38 respuestas</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div class="flex items-center gap-3">
                    <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span class="text-sm text-gray-700">Frecuencia de Síntomas</span>
                  </div>
                  <span class="text-xs text-gray-400">12 respuestas</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: Análisis con IA -->
        <div class="bg-white rounded-2xl border border-indigo-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
          <!-- Header -->
          <div class="h-32 bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 relative overflow-hidden">
            <div class="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
            <!-- Patrón decorativo -->
            <div class="absolute inset-0 opacity-10">
              <div class="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div class="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
            </div>
            <div class="relative h-full flex items-center justify-between px-6">
              <div>
                <h2 class="text-xl font-bold text-white mb-1">Análisis con IA</h2>
                <p class="text-sm text-white/80">Inteligencia artificial médica</p>
              </div>
              <div class="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg class="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Contenido -->
          <div class="p-6">
            <!-- Estadísticas de IA -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-2xl font-bold text-gray-800">234</p>
                    <p class="text-xs text-gray-500">Análisis</p>
                  </div>
                </div>
              </div>

              <div class="bg-cyan-50 rounded-xl p-4 border border-cyan-100">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-2xl font-bold text-gray-800">94%</p>
                    <p class="text-xs text-gray-500">Precisión</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Descripción de capacidades -->
            <div class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 mb-6 border border-indigo-100">
              <h3 class="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                Capacidades de IA
              </h3>
              <ul class="space-y-2 text-xs text-gray-600">
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Detección de patrones en respuestas de pacientes</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Predicción de severidad y recomendaciones</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Análisis comparativo con casos similares</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Generación automática de informes clínicos</span>
                </li>
              </ul>
            </div>

            <!-- Acción principal -->
            <button class="w-full group bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white rounded-xl p-4 transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow-md">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <div class="text-left flex-1">
                <p class="font-semibold text-sm">Analizar Cuestionarios</p>
                <p class="text-xs text-white/80">Procesamiento con IA médica</p>
              </div>
            </div>
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            <!-- Análisis recientes -->
            <div class="mt-6 pt-6 border-t border-gray-100">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Análisis Recientes</h3>
              <div class="space-y-2">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-gray-700 font-medium">Paciente #1234</p>
                      <p class="text-xs text-gray-500">Severidad: Moderada</p>
                    </div>
                  </div>
                  <span class="text-xs text-gray-400">Hace 2h</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-gray-700 font-medium">Paciente #1235</p>
                      <p class="text-xs text-gray-500">Severidad: Leve</p>
                    </div>
                  </div>
                  <span class="text-xs text-gray-400">Hace 5h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mini cards de acceso rápido (opcional) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Mini card 1 -->
        <div class="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer group">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-800">Historial</p>
              <p class="text-xs text-gray-500">Ver evaluaciones pasadas</p>
            </div>
          </div>
        </div>

        <!-- Mini card 2 -->
        <div class="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer group">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-800">Reportes</p>
              <p class="text-xs text-gray-500">Generar informes</p>
            </div>
          </div>
        </div>

        <!-- Mini card 3 -->
        <div class="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer group">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
              <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-800">Configuración</p>
              <p class="text-xs text-gray-500">Ajustes del sistema</p>
            </div>
          </div>
        </div>
      </div>
    </div>
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