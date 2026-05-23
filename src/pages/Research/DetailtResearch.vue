<template>
  <div
    class="relative min-h-screen overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-6"
  >
    <!-- ========================================== -->
    <!-- BACKGROUND: Salud Auditiva + Galáctico     -->
    <!-- ========================================== -->
    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <!-- Icono 1: Onda Sonora (Auditiva) - Arriba Izquierda -->
      <svg
        class="absolute top-[15%] left-[10%] w-24 h-24 text-cyan-600/5 -rotate-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M9 19V6m12-3v13M5 19V3m12 16V9m-4 10V5"
        />
      </svg>

      <!-- Ícono 2: Planeta con anillo (Galáctico) - Arriba Derecha -->
      <svg
        class="absolute top-[20%] right-[15%] w-32 h-32 text-indigo-600/5 animate-[pulse_4s_ease-in-out_infinite]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="5" stroke-width="1" />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="3"
          transform="rotate(30 12 12)"
          stroke-width="1"
        />
      </svg>

      <!-- Ícono 3: Oído / Escucha (Auditivo) - Centro Izquierda -->
      <svg
        class="absolute top-[50%] left-[5%] w-40 h-40 text-slate-600/5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="0.5"
          d="M17.5 12c0 2.5-2 5-4.5 5h-1a2 2 0 01-2-2v-6a2 2 0 012-2h1c2.5 0 4.5 2.5 4.5 5z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="0.5"
          d="M19.5 12c0 4-3 7.5-6.5 7.5h-1A3.5 3.5 0 018.5 16v-8A3.5 3.5 0 0112 4.5h1c3.5 0 6.5 3.5 6.5 7.5z"
        />
      </svg>

      <!-- Ícono 4: Constelación / Nodos (Galáctico + Neuronal/Auditivo) - Abajo Derecha -->
      <svg
        class="absolute bottom-[15%] right-[10%] w-48 h-48 text-cyan-700/5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="18" cy="6" r="2" stroke-width="1" />
        <circle cx="6" cy="12" r="2" stroke-width="1" />
        <circle cx="14" cy="18" r="2" stroke-width="1" />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="0.5"
          d="M16.5 7.5l-9 3M7.5 13.5l5 3.5M17 7.5l-2.5 9"
        />
      </svg>

      <!-- Ícono 5: Estrellas / Destellos (Galáctico) - Dispersos -->
      <svg
        class="absolute top-[40%] right-[30%] w-8 h-8 text-slate-500/10 animate-[pulse_3s_ease-in-out_infinite]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M12 3v18m9-9H3m12.728-6.364l-12.728 12.728M20.364 20.364L7.636 7.636"
        />
      </svg>
      <svg
        class="absolute bottom-[30%] left-[25%] w-12 h-12 text-indigo-500/5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M12 4l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"
        />
      </svg>

      <!-- Gradiente sutil para unificar el fondo -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-100/80"
      ></div>
    </div>
    <!-- ========================================== -->
    <!-- Background Circles (Guiando la diagonal de la "Z") -->
    <!-- Aro 1: Arriba-Derecha (Atrae la vista al punto 2 de la Z) -->
    <div
      class="absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-br from-cyan-50/80 to-transparent rounded-full pointer-events-none"
    ></div>

    <!-- Aro 2: Abajo-Izquierda (Guía la vista al punto 3 de la Z) -->
    <div
      class="absolute -bottom-16 -left-16 w-56 h-56 bg-gradient-to-tr from-slate-50 to-transparent rounded-full pointer-events-none"
    ></div>
    <!-- ========================================== -->
    <div class="relative z-10">
      <!-- Header -->
      <div
        class="flex flex-col items-start justify-between mb-8 pb-5 border-b border-slate-100/80"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 bg-cyan-50 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-cyan-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1
            class="text-sm font-semibold text-slate-400 uppercase tracking-wider"
          >
            Detalle de la investigación
          </h1>
        </div>
        <!-- Laoding State -->
        <div v-if="loading" class="space-y-5 animate-pulse">
          <div class="h-8 bg-slate-100 rounded-md w-2/3"></div>
          <div class="space-y-3 pt-4">
            <div class="h-4 bg-slate-50 rounded-md w-full"></div>
            <div class="h-4 bg-slate-50 rounded-md w-11/12"></div>
            <div class="h-4 bg-slate-50 rounded-md w-4/5"></div>
          </div>
        </div>
        <!-- Content -->
        <div v-else class="space-y-6 mb-8 w-full">
          <div>
            <h2 class="text-2xl font-medium text-slate-800 tracking-tight">
              {{ research?.name }}
            </h2>
          </div>
          <!-- Contenedor de descripcion minmalista -->
          <div class="bg-slate-50/50 rounded-xl p-6 border border-slate-100">
            <p
              class="text-base text-slate-600 leading-loose font-light whitespace-pre-wrap"
            >
              {{ research?.description }}
            </p>
          </div>
        </div>
      </div>
      <div
        class="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100/80"
      >
        <div class="flex gap-3">
          <!-- Boton Editar -->
          <button
            class="group flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-colors duration-200"
          >
            <svg
              class="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Editar</span>
          </button>
          <!-- Boton de eliminar -->
          <button
            class="group flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-sm font-medium hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-colors duration-200"
          >
            <svg
              class="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>Eliminar</span>
          </button>
        </div>
        <!-- Botón IA -->
        <button
          @click="openAIModal"
          class="group flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-700 shadow-sm transition-colors duration-200"
        >
          <svg
            class="w-4 h-4 text-slate-300 group-hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span>Investigar por la IA</span>
        </button>
      </div>
    </div>

    <!-- Lista de Investigaciones Generadas -->
    <div
      class="relative min-h-screen bg-white rounded-md border border-gray-200 overflow-hidden p-6 mt-4"
    >
      <!-- Fondo con icons de salud auditiva y constelaciones -->
      <div class="absolute inset-0 pointer-events-none opacity-30">
        <!-- Patron de iconos de Salud Auditiva -->
        <svg
          class="absolute w-32 h-32 top-20 left-10 text-indigo-400/40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="0.5"
        >
          <path
            d="M12 2C10.9 2 10 2.9 10 4V10C10 11.1 10.9 12 12 12C13.1 12 14 11.1 14 10V4C14 2.9 13.1 2 12 2Z"
          />
          <path
            d="M6 10C6 6.13 9.13 3 13 3C16.87 3 20 6.13 20 10V15C20 18.87 16.87 22 13 22C9.13 22 6 18.87 6 15V10Z"
          />
          <path d="M2 15V17C2 18.1 2.9 19 4 19" />
          <path d="M22 15V17C22 18.1 21.1 19 20 19" />
        </svg>
        <svg
          class="absolute w-20 h-20 bottom-60 left-1/4 text-cyan-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="0.5"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
        <!-- Constelacionees - Estrellas conectadas -->
        <svg
          class="absolute w-40 h-40 top-10 right-1/4 text-gray-400"
          viewBox="0 0 100 100"
        >
          <circle cx="20" cy="20" r="1.5" fill="currentColor" />
          <circle cx="50" cy="15" r="1" fill="currentColor" />
          <circle cx="80" cy="30" r="1.5" fill="currentColor" />
          <circle cx="35" cy="50" r="1" fill="currentColor" />
          <circle cx="70" cy="60" r="1.5" fill="currentColor" />
          <circle cx="45" cy="80" r="1" fill="currentColor" />
          <line
            x1="20"
            y1="20"
            x2="50"
            y2="15"
            stroke="currentColor"
            stroke-width="0.3"
          />
          <line
            x1="50"
            y1="15"
            x2="80"
            y2="30"
            stroke="currentColor"
            stroke-width="0.3"
          />
          <line
            x1="35"
            y1="50"
            x2="70"
            y2="60"
            stroke="currentColor"
            stroke-width="0.3"
          />
          <line
            x1="45"
            y1="80"
            x2="70"
            y2="60"
            stroke="currentColor"
            stroke-width="0.3"
          />
        </svg>

        <svg
          class="absolute w-32 h-32 bottom-20 right-10 text-gray-400"
          viewBox="0 0 100 100"
        >
          <circle cx="15" cy="25" r="1.5" fill="currentColor" />
          <circle cx="40" cy="10" r="1" fill="currentColor" />
          <circle cx="65" cy="20" r="1.5" fill="currentColor" />
          <circle cx="85" cy="40" r="1" fill="currentColor" />
          <circle cx="75" cy="65" r="1.5" fill="currentColor" />
          <line
            x1="15"
            y1="25"
            x2="40"
            y2="10"
            stroke="currentColor"
            stroke-width="0.3"
          />
          <line
            x1="40"
            y1="10"
            x2="65"
            y2="20"
            stroke="currentColor"
            stroke-width="0.3"
          />
          <line
            x1="65"
            y1="20"
            x2="85"
            y2="40"
            stroke="currentColor"
            stroke-width="0.3"
          />
          <line
            x1="75"
            y1="65"
            x2="85"
            y2="40"
            stroke="currentColor"
            stroke-width="0.3"
          />
        </svg>

        <svg
          class="absolute w-48 h-48 bottom-40 left-20 text-gray-500"
          viewBox="0 0 100 100"
        >
          <circle cx="10" cy="50" r="1" fill="currentColor" />
          <circle cx="30" cy="30" r="1.5" fill="currentColor" />
          <circle cx="50" cy="50" r="1" fill="currentColor" />
          <circle cx="70" cy="20" r="1.5" fill="currentColor" />
          <circle cx="90" cy="45" r="1" fill="currentColor" />
          <line
            x1="10"
            y1="50"
            x2="30"
            y2="30"
            stroke="currentColor"
            stroke-width="0.3"
          />
          <line
            x1="30"
            y1="30"
            x2="50"
            y2="50"
            stroke="currentColor"
            stroke-width="0.3"
          />
          <line
            x1="50"
            y1="50"
            x2="70"
            y2="20"
            stroke="currentColor"
            stroke-width="0.3"
          />
          <line
            x1="70"
            y1="20"
            x2="90"
            y2="45"
            stroke="currentColor"
            stroke-width="0.3"
          />
        </svg>

        <svg
          class="absolute w-40 h-40 top-80 right-1/2 text-gray-500"
          viewBox="0 0 100 100"
        >
          <circle cx="20" cy="20" r="2" fill="currentColor" />
          <circle cx="50" cy="15" r="1.5" fill="currentColor" />
          <circle cx="80" cy="30" r="2" fill="currentColor" />
          <circle cx="35" cy="50" r="1.5" fill="currentColor" />
          <circle cx="70" cy="60" r="2" fill="currentColor" />
          <circle cx="45" cy="80" r="1.5" fill="currentColor" />
          <line
            x1="20"
            y1="20"
            x2="50"
            y2="15"
            stroke="currentColor"
            stroke-width="0.3"
          />
          <line
            x1="50"
            y1="15"
            x2="80"
            y2="30"
            stroke="currentColor"
            stroke-width="0.3"
          />
          <line
            x1="35"
            y1="50"
            x2="70"
            y2="60"
            stroke="currentColor"
            stroke-width="0.3"
          />
          <line
            x1="45"
            y1="80"
            x2="70"
            y2="60"
            stroke="currentColor"
            stroke-width="0.3"
          />
        </svg>

        <svg
          class="absolute w-32 h-32 bottom-20 left-20 text-gray-400"
          viewBox="0 0 100 100"
        >
          <circle cx="15" cy="25" r="2" fill="currentColor" />
          <circle cx="40" cy="10" r="1.5" fill="currentColor" />
          <circle cx="65" cy="20" r="2" fill="currentColor" />
          <circle cx="85" cy="40" r="1.5" fill="currentColor" />
          <circle cx="75" cy="65" r="2" fill="currentColor" />
          <line
            x1="15"
            y1="25"
            x2="40"
            y2="10"
            stroke="currentColor"
            stroke-width="0.3"
          />
          <line
            x1="40"
            y1="10"
            x2="65"
            y2="20"
            stroke="currentColor"
            stroke-width="0.3"
          />
          <line
            x1="65"
            y1="20"
            x2="85"
            y2="40"
            stroke="currentColor"
            stroke-width="0.3"
          />
          <line
            x1="75"
            y1="65"
            x2="85"
            y2="40"
            stroke="currentColor"
            stroke-width="0.3"
          />
        </svg>

        <!-- Iconos adicionales de salud auditiva dispersos -->
        <svg
          class="absolute w-16 h-16 top-1/2 left-16 text-indigo-300/20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="0.5"
        >
          <path
            d="M12 2C10.9 2 10 2.9 10 4V10C10 11.1 10.9 12 12 12C13.1 12 14 11.1 14 10V4C14 2.9 13.1 2 12 2Z"
          />
          <path
            d="M6 10C6 6.13 9.13 3 13 3C16.87 3 20 6.13 20 10V15C20 18.87 16.87 22 13 22C9.13 22 6 18.87 6 15V10Z"
          />
        </svg>

        <svg
          class="absolute w-14 h-14 bottom-1/3 right-1/3 text-purple-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="0.5"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12 L16 12" />
          <path d="M12 8 L12 16" />
        </svg>
        <!-- Mas estrellas dispersas -->
        <div
          class="absolute top-32 left-1/3 w-1 h-1 bg-blue-200 rounded-full opacity-40"
        ></div>
        <div
          class="absolute top-48 right-1/4 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-50"
        ></div>
        <div
          class="absolute bottom-32 left-1/2 w-1 h-1 bg-blue-300 rounded-full opacity-30"
        ></div>
        <div
          class="absolute top-20 right-1/3 w-1 h-1 bg-blue-300 rounded-full opacity-40"
        ></div>
        <div
          class="absolute bottom-48 right-1/2 w-1.5 h-1.5 bg-blue-200 rounded-full opacity-35"
        ></div>
        <div
          class="absolute top-1/3 left-1/4 w-1 h-1 bg-blue-200 rounded-full opacity-45"
        ></div>
        <div
          class="absolute bottom-1/4 right-1/4 w-1 h-1 bg-blue-300 rounded-full opacity-30"
        ></div>
      </div>
      <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div
          class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"
        >
          <svg
            class="w-5 h-5 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div class="flex-1">
          <h2 class="text-xl font-medium text-gray-800">
            Investigaciones Generadas
          </h2>
          <p class="text-sm text-gray-500">
            Historial de investigaciones creadas por IA
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="openNotesModal"
            class="flex items-center gap-2 px-4 py-2.5 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-600 transition-all"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <span class="text-sm">Ver notas</span>
          </button>
          <button
            @click="getInvestigaciones"
            :disabled="investigacionesLoading"
            class="flex items-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 rounded-lg text-indigo-600 transition-all"
          >
            <svg
              v-if="!investigacionesLoading"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <svg
              v-else
              class="w-4 h-4 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span class="text-sm">{{
              investigacionesLoading ? "Cargando..." : "Actualizar"
            }}</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="investigacionesLoading" class="space-y-3 animate-pulse">
        <div v-for="n in 3" :key="n" class="h-20 bg-gray-100 rounded-xl"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="investigaciones.length === 0" class="text-center py-12">
        <div
          class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5 backdrop-blur-sm"
        >
          <svg
            class="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <p class="text-gray-500">No hay investigaciones generadas aún</p>
        <p class="text-sm text-gray-400 mt-2">
          Usa "Investigar por la IA" para crear una
        </p>
      </div>

      <!-- List -->
      <div v-else class="space-y-3">
        <div
          v-for="(inv, index) in investigaciones"
          :key="index"
          class="group border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-3">
                <span
                  class="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-md font-medium"
                >
                  ID: {{ inv.idResource ?? "Sin investigacion" }}
                </span>
                <span v-if="inv.createdAt" class="text-xs text-gray-400">
                  {{ new Date(inv.createdAt).toLocaleDateString("es-ES") }}
                </span>
              </div>
              <p class="text-sm text-gray-600 line-clamp-2">
                {{ stripHtml(inv.contentResource).substring(0, 150) }}...
              </p>
            </div>
            <div
              class="ml-4 cursor-pointer hover:text-indigo-600 hover:bg-indigo-50 rounded-lg p-2"
              @click="viewInvestigacion(inv)"
            >
              <svg
                class="w-8 h-8 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Agregado el cierre del div -->
    <!-- Modal IA -->
    <ModalIAResearch
      v-if="showAIModal"
      :isOpen="showAIModal"
      :idResearch="research?.id || 0"
      :title="research?.title || ''"
      :description="research?.description || ''"
      @close="closeAIModal"
    />

    <!-- Modal Ver Investigación -->
    <ViewInvestigacionModal
      v-if="showViewModal"
      :isOpen="showViewModal"
      :investigacion="selectedInvestigacion"
      @close="closeViewModal"
    />

    <!-- Modal de Notas -->
    <NotesModal
      v-if="showNotesModal"
      :isOpen="showNotesModal"
      :researchId="researchId || ''"
      @close="closeNotesModal"
    />

    <!-- Modal de Análisis IA -->
    <Teleport to="body">
    <Transition name="app-modal">
      <div v-if="showAnalysisModal" class="app-modal-root">
        <div class="app-modal-backdrop" aria-hidden="true" @click="closeAnalysisModal" />
        <div class="app-modal-scrim app-modal-scrim--sheet" @click.self="closeAnalysisModal">
          <div class="app-modal-panel app-modal-panel--sheet relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
       role="dialog" aria-modal="true" @click.stop>
        <!-- Header -->
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-indigo-500"
        >
          <div class="flex items-center gap-2">
            <svg
              class="w-5 h-5 text-white/80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h3 class="text-lg font-semibold text-white">Análisis de IA</h3>
          </div>
          <div class="flex items-center gap-2">
            <!-- Botón Actualizar -->
            <button
              @click="fetchAnalysis"
              :disabled="isLoadingAnalysis"
              class="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 disabled:opacity-50 rounded-lg text-white text-sm transition-all"
            >
              <svg
                v-if="!isLoadingAnalysis"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <svg
                v-else
                class="w-4 h-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>{{
                isLoadingAnalysis ? "Actualizando..." : "Actualizar"
              }}</span>
            </button>
            <!-- Botón Cerrar -->
            <button
              @click="closeAnalysisModal"
              class="text-white/80 hover:text-white transition-colors p-1"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <!-- Content -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <!-- Estado 1: Cargando -->
          <div
            v-if="isLoadingAnalysis"
            class="flex flex-col items-center justify-center py-12"
          >
            <svg
              class="w-10 h-10 text-indigo-500 animate-spin mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <p class="text-gray-500 text-sm">Cargando análisis...</p>
          </div>

          <!-- Estado 2: Error -->
          <div
            v-else-if="analysisError"
            class="flex flex-col items-center justify-center py-12 text-center"
          >
            <div
              class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"
            >
              <svg
                class="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p class="text-gray-600 mb-4">{{ analysisError }}</p>
            <button
              @click="fetchAnalysis"
              class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>

          <!-- Estado 3: Datos cargados -->
          <div
            v-else-if="analysisData && analysisData.length > 0"
            class="space-y-6"
          >
            <!-- Info del modelo -->
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <span
                class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md font-medium"
              >
                {{ analysisData[0]?.analysis?.model || "IA" }}
              </span>
              <span v-if="analysisData[0]?.analysis?.generatedAt">
                {{
                  new Date(analysisData[0].analysis.generatedAt).toLocaleString(
                    "es-ES",
                  )
                }}
              </span>
              <span class="ml-auto text-gray-400"
                >{{ analysisData[0]?.notesCount }} notas analizadas</span
              >
            </div>
            <!-- Resumen con Markdown -->
            <div class="bg-gray-50 rounded-xl p-4">
              <h4 class="text-sm font-semibold text-gray-700 mb-2">
                Resumen del Análisis
              </h4>
              <div
                class="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                v-html="
                  analysisData[0]?.analysis?.summary
                    ? md.render(analysisData[0].analysis.summary)
                    : '<p>Sin resumen disponible</p>'
                "
              ></div>
            </div>
          </div>

          <!-- Estado 4: Sin datos (estado inicial) -->
          <div v-else class="text-center py-12 text-gray-500">
            <div
              class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <p>Abre una investigación para ver su análisis.</p>
          </div>
        </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import MarkdownIt from "markdown-it";
import ModalIAResearch from "../../components/research/ModalIAResearch.vue";
import ViewInvestigacionModal from "../../components/research/ViewInvestigacionModal.vue";
import NotesModal from "../../components/research/NotesModal.vue";

interface Investigation {
  idResource: string;
  contentResource: string;
  createdAt: string;
  updatedAt: string;
}

const loading = ref(false);
const investigacionesLoading = ref(false);
const research = ref<any>({
  name: "",
  description: "",
});
const investigaciones = ref<Investigation[]>([]);
const showAIModal = ref(false);
const showViewModal = ref(false);
const showNotesModal = ref(false);
const showAnalysisModal = ref(false);
const selectedInvestigacion = ref<{
  id: number;
  id_resource: number;
  content_resource: string;
  created_at?: string;
} | null>(null);

// Datos del análisis de IA (la API devuelve un array)
const analysisData = ref<Array<{
  researchId: string;
  analysis: {
    model: string;
    generatedAt: string;
    summary: string;
  };
  notesCount: number;
  notesReferences: Array<{
    id: string;
    createdAt: string;
  }>;
}> | null>(null);
const isLoadingAnalysis = ref(false);
const analysisError = ref<string | null>(null);

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const route = useRoute();
const researchId = computed(() => {
  const id = route.params.id;
  if (Array.isArray(id)) return id[0];
  return id;
});

// Obtener lista de investigaciones generadas
const getInvestigaciones = async () => {
  const id = researchId.value;
  if (!id) {
    console.error("[getInvestigaciones] researchId is undefined");
    return;
  }
  investigacionesLoading.value = true;
  try {
    const response = await axios.get(
      `http://localhost:3000/api/v1/investigaciones/list/${id}`,
    );
    if (response.data.length > 0) {
      investigaciones.value = response.data[0].map((item: any) => ({
        idResource: item.id_resource,
        contentResource: item.content_resource,
        createdAt: item.created_at || "",
        updatedAt: item.updated_at || "",
      }));
    }
  } catch (error) {
    console.error("Error cargando investigaciones:", error);
    investigaciones.value = [];
  } finally {
    investigacionesLoading.value = false;
  }
};

// Helper para remover HTML
const stripHtml = (html: string) => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const getResearch = async () => {
  const id = researchId.value;
  if (!id) {
    console.error("[getResearch] researchId is undefined");
    return;
  }
  loading.value = true;
  const response = await axios.get(
    `http://localhost:3000/api/v1/research/${id}`,
  );
  research.value = response.data;
  loading.value = false;
};

const openAIModal = () => {
  showAIModal.value = true;
};

const closeAIModal = () => {
  showAIModal.value = false;
};

const viewInvestigacion = (inv: Investigation) => {
  selectedInvestigacion.value = {
    id: Number(inv.idResource),
    id_resource: Number(inv.idResource),
    content_resource: inv.contentResource,
    created_at: inv.createdAt,
  };
  showViewModal.value = true;
};

const closeViewModal = () => {
  showViewModal.value = false;
  selectedInvestigacion.value = null;
};

const openNotesModal = () => {
  showNotesModal.value = true;
};

const closeNotesModal = () => {
  showNotesModal.value = false;
};

const fetchAnalysis = async () => {
  const id = researchId.value;
  if (!id) {
    console.error("[fetchAnalysis] researchId is undefined");
    return;
  }
  // 1. Activa el loading al iniciar la petición
  isLoadingAnalysis.value = true;
  analysisError.value = null;

  try {
    // 2. Realiza la petición HTTP
    const response = await axios.get(
      `http://localhost:3000/api/v1/research-analysis/research/${id}`,
    );

    // 3. Asigna los datos a analysisData
    console.log("[fetchAnalysis] Respuesta API:", response.data);
    analysisData.value = response.data;
    console.log("[fetchAnalysis] analysisData asignado:", analysisData.value);
    // 4. Espera a que Vue actualice el DOM con analysisData
    //    ANTES de desactivar el loading
    await nextTick();
  } catch (error: any) {
    // 5. Si falla, registra el error
    console.error("Error cargando análisis:", error);
    if (error.response?.status === 404) {
      analysisError.value = "No se encontró análisis para esta investigación.";
      analysisData.value = null;
    } else {
      analysisError.value = "No se pudo cargar el análisis. Intenta de nuevo.";
    }
  } finally {
    // 6. Desactiva el loading en cualquier caso (éxito o error)
    isLoadingAnalysis.value = false;
  }
};

const closeAnalysisModal = () => {
  showAnalysisModal.value = false;
};

getResearch();
getInvestigaciones();
fetchAnalysis();
</script>
