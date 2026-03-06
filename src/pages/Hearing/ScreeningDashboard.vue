<template>
  <div class="w-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 min-h-screen">
    <!-- Header minimalista -->
    <div class="w-full h-16 bg-white/80 backdrop-blur-sm border-b border-blue-100 flex items-center justify-center shadow-sm">
      <div class="flex items-center gap-3">
        <!-- Icono de tamizaje auditivo -->
        <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
          </svg>
        </div>
        <h1 class="text-xl font-semibold text-gray-800">Dashboard de Tamizajes Auditivos</h1>
      </div>
    </div>

    <div class="p-8 max-w-7xl mx-auto">
      <!-- Descripción minimalista -->
      <div class="mb-8">
        <p class="text-sm text-gray-600 mb-2">
          Gestiona evaluaciones auditivas, visualiza respuestas de pacientes y obtén análisis inteligentes.
        </p>
        <div class="flex items-center gap-2 text-xs text-gray-500">
          <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <span>Sistema certificado de evaluación audiológica</span>
        </div>
      </div>

      <!-- Grid de cards principales (2 cards grandes) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        <!-- Card 1: Gestión de Tamizajes -->
        <div class="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
          <!-- Header -->
          <div class="h-32 bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 relative overflow-hidden">
            <div class="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
            <!-- Patrón decorativo -->
            <div class="absolute inset-0 opacity-10">
              <div class="absolute top-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <div class="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 translate-y-1/2"></div>
            </div>
            <div class="relative h-full flex items-center justify-between px-6">
              <div>
                <h2 class="text-xl font-bold text-white mb-1">Gestión de Tamizajes</h2>
                <p class="text-sm text-white/80">Crear y administrar evaluaciones</p>
              </div>
              <div class="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg class="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Contenido -->
          <div class="p-6">
            <!-- Estadísticas rápidas -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-2xl font-bold text-gray-800">8</p>
                    <p class="text-xs text-gray-500">Tamizajes</p>
                  </div>
                </div>
              </div>

              <div class="bg-cyan-50 rounded-xl p-4 border border-cyan-100">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-2xl font-bold text-gray-800">342</p>
                    <p class="text-xs text-gray-500">Pacientes</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Acciones principales -->
            <div class="space-y-3">
              <!-- Crear Tamizaje -->
              <button class="w-full group bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl p-4 transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow-md">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="font-semibold text-sm">Crear Tamizaje</p>
                    <p class="text-xs text-white/80">Nueva evaluación auditiva</p>
                  </div>
                </div>
                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>

              <!-- Ver Lista de Tamizajes -->
              <button class="w-full group bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300 text-gray-800 rounded-xl p-4 transition-all duration-200 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="font-semibold text-sm">Lista de Tamizajes</p>
                    <p class="text-xs text-gray-500">Ver todas las evaluaciones</p>
                  </div>
                </div>
                <svg class="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>

              <!-- Ver Respuestas de Pacientes -->
              <button class="w-full group bg-white hover:bg-cyan-50 border-2 border-cyan-200 hover:border-cyan-300 text-gray-800 rounded-xl p-4 transition-all duration-200 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="font-semibold text-sm">Respuestas de Pacientes</p>
                    <p class="text-xs text-gray-500">Consultar resultados</p>
                  </div>
                </div>
                <svg class="w-5 h-5 text-cyan-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <!-- Tamizajes recientes -->
            <div class="mt-6 pt-6 border-t border-gray-100">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tamizajes Activos</h3>
              <div class="space-y-2">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div class="flex items-center gap-3">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p class="text-sm text-gray-700 font-medium">Tonos Graves (125-500 Hz)</p>
                      <p class="text-xs text-gray-500">87 evaluaciones</p>
                    </div>
                  </div>
                  <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-lg font-semibold">92%</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div class="flex items-center gap-3">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p class="text-sm text-gray-700 font-medium">Palabras Monosilábicas</p>
                      <p class="text-xs text-gray-500">64 evaluaciones</p>
                    </div>
                  </div>
                  <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-lg font-semibold">88%</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div class="flex items-center gap-3">
                    <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p class="text-sm text-gray-700 font-medium">Ruidos Ambientales</p>
                      <p class="text-xs text-gray-500">23 evaluaciones</p>
                    </div>
                  </div>
                  <span class="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg font-semibold">75%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: Análisis con IA -->
        <div class="bg-white rounded-2xl border border-indigo-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
          <!-- Header -->
          <div class="h-32 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 relative overflow-hidden">
            <div class="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
            <!-- Patrón decorativo -->
            <div class="absolute inset-0 opacity-10">
              <div class="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div class="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
            </div>
            <div class="relative h-full flex items-center justify-between px-6">
              <div>
                <h2 class="text-xl font-bold text-white mb-1">Análisis Inteligente</h2>
                <p class="text-sm text-white/80">IA médica especializada</p>
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
                    <p class="text-2xl font-bold text-gray-800">342</p>
                    <p class="text-xs text-gray-500">Análisis</p>
                  </div>
                </div>
              </div>

              <div class="bg-pink-50 rounded-xl p-4 border border-pink-100">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-2xl font-bold text-gray-800">96%</p>
                    <p class="text-xs text-gray-500">Precisión</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Descripción de capacidades -->
            <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 mb-6 border border-indigo-100">
              <h3 class="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                Capacidades de IA Audiológica
              </h3>
              <ul class="space-y-2 text-xs text-gray-600">
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Evaluación automática de umbrales auditivos</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Detección de patrones de pérdida auditiva</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Comparación con bases de datos normativas</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Recomendaciones de seguimiento personalizadas</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Generación de audiogramas automatizados</span>
                </li>
              </ul>
            </div>

            <!-- Acción principal -->
            <button class="w-full group bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white rounded-xl p-4 transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow-md">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                </div>
                <div class="text-left flex-1">
                  <p class="font-semibold text-sm">Analizar con IA</p>
                  <p class="text-xs text-white/80">Procesamiento inteligente de tamizajes</p>
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
                      <p class="text-sm text-gray-700 font-medium">Paciente #A4521</p>
                      <p class="text-xs text-gray-500">Audición: Normal</p>
                    </div>
                  </div>
                  <span class="text-xs text-gray-400">Hace 1h</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-gray-700 font-medium">Paciente #A4522</p>
                      <p class="text-xs text-gray-500">Audición: Leve pérdida</p>
                    </div>
                  </div>
                  <span class="text-xs text-gray-400">Hace 3h</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-gray-700 font-medium">Paciente #A4523</p>
                      <p class="text-xs text-gray-500">Audición: Normal</p>
                    </div>
                  </div>
                  <span class="text-xs text-gray-400">Hace 5h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mini cards de acceso rápido -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Mini card 1 -->
        <div class="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer group">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-800">Estadísticas</p>
              <p class="text-xs text-gray-500">Ver métricas</p>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-800">Historial</p>
              <p class="text-xs text-gray-500">Ver registros</p>
            </div>
          </div>
        </div>

        <!-- Mini card 4 -->
        <div class="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer group">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-800">Configuración</p>
              <p class="text-xs text-gray-500">Ajustes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
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