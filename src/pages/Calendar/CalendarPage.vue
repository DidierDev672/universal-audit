<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Header -->
    <div
      class="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl mb-8"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div
            class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h2 class="text-3xl font-bold mb-1">
              Calendario de Investigaciones
            </h2>
            <p class="text-white/90">
              Gestiona investigaciones y tareas especiales
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <button
            @click="openTaskModal()"
            class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-all flex items-center gap-2"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nueva Tarea
          </button>
          <button
            @click="openResearchModal()"
            class="px-4 py-2 bg-white hover:bg-white/90 text-blue-600 rounded-xl font-medium transition-all flex items-center gap-2"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Nueva Investigación
          </button>
        </div>
      </div>
    </div>

    <!-- Error Alert -->
    <div
      v-if="researchError"
      class="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center gap-3"
    >
      <svg
        class="w-6 h-6 text-orange-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span class="text-orange-700 font-medium"
        >No se pudieron cargar las investigaciones. Intenta de nuevo.</span
      >
    </div>

    <!-- Calendar Navigation -->
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <button
            @click="previousMonth"
            class="p-2 hover:bg-gray-100 rounded-xl transition-all"
          >
            <svg
              class="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h3 class="text-2xl font-bold text-gray-800">
            {{ currentMonthName }} {{ currentYear }}
          </h3>
          <button
            @click="nextMonth"
            class="p-2 hover:bg-gray-100 rounded-xl transition-all"
          >
            <svg
              class="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <button
          @click="goToToday"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-all"
        >
          Hoy
        </button>
      </div>

      <!-- Calendar Grid (semanas con barras de rango) -->
      <div>
        <div class="grid grid-cols-7 gap-2 mb-2">
          <div
            v-for="day in weekdays"
            :key="day"
            class="text-center py-2 font-semibold text-gray-500 text-sm uppercase tracking-wider"
          >
            {{ day }}
          </div>
        </div>

        <div
          v-for="(week, weekIndex) in calendarWeekViews"
          :key="weekIndex"
          class="mb-2"
        >
          <div class="grid grid-cols-7 gap-2">
            <div
              v-for="date in week.days"
              :key="date.dateString"
              @click="date.isCurrentMonth && openTaskModal(date.date)"
              :class="[
                'min-h-[100px] p-2 rounded-xl border-2 transition-all cursor-pointer flex flex-col',
                date.isCurrentMonth
                  ? 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-md'
                  : 'bg-gray-50 border-transparent text-gray-400',
                isToday(date.date) && 'ring-2 ring-blue-500 border-blue-500',
              ]"
            >
              <div class="flex items-center justify-between mb-1">
                <span
                  :class="[
                    'font-semibold w-8 h-8 flex items-center justify-center rounded-lg text-sm shrink-0',
                    isToday(date.date)
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700',
                  ]"
                >
                  {{ date.day }}
                </span>
                <span
                  v-if="getEventsTouchingDate(date.date).length > 0"
                  class="text-xs font-medium text-gray-500"
                >
                  {{ getEventsTouchingDate(date.date).length }}
                </span>
              </div>

              <!-- Solo eventos de un día (sin barra de rango) -->
              <div class="space-y-1 flex-1">
                <div
                  v-for="event in getSingleDayEventsForDate(date.date).slice(
                    0,
                    2,
                  )"
                  :key="event.id"
                  @click.stop="openEventDetail(event)"
                  :class="[
                    'px-2 py-1 rounded-lg text-xs font-medium truncate cursor-pointer hover:opacity-80 transition-opacity',
                    event.type === 'task'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700',
                  ]"
                >
                  {{ event.title }}
                </div>
              </div>
            </div>
          </div>

          <!-- Barras continuas para tareas/investigaciones con rango de fechas -->
          <div
            v-if="week.bars.length > 0"
            class="grid grid-cols-7 gap-2 mt-1 px-0.5"
            :style="{
              gridTemplateRows: `repeat(${week.barLaneCount}, 1.35rem)`,
            }"
          >
            <div
              v-for="bar in week.bars"
              :key="`${bar.event.id}-w${weekIndex}-l${bar.lane}`"
              :style="{
                gridColumn: `${bar.colStart} / span ${bar.colSpan}`,
                gridRow: bar.lane + 1,
              }"
              class="relative flex items-end min-h-[1.35rem] pb-0.5 cursor-pointer"
              :title="bar.event.title"
              @click.stop="openEventDetail(bar.event)"
            >
              <div
                :class="[
                  'absolute inset-x-0 bottom-0 h-1',
                  bar.event.type === 'task' ? 'bg-purple-500' : 'bg-blue-500',
                  bar.isRangeStart && 'rounded-l-full',
                  bar.isRangeEnd && 'rounded-r-full',
                ]"
                aria-hidden="true"
              />
              <span
                v-if="bar.showTitle"
                :class="[
                  'relative z-10 text-[10px] sm:text-xs font-semibold truncate max-w-full leading-tight',
                  bar.event.type === 'task'
                    ? 'text-purple-800'
                    : 'text-blue-800',
                ]"
              >
                {{ bar.event.title }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resumen del mes (cards) -->
    <div
      class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
    >
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h3 class="text-lg font-bold text-gray-800">
            Resumen del Mes - {{ currentMonthName }} {{ currentYear }}
          </h3>
          <button
            type="button"
            :disabled="summaryMonthLoading"
            class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors disabled:opacity-60"
            @click="fetchCalendarSummaryForMonth"
          >
            <svg
              :class="{ 'animate-spin': summaryMonthLoading }"
              class="w-4 h-4 shrink-0"
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
            Actualizar resumen
          </button>
        </div>
        <p v-if="summaryMonthError" class="mt-2 text-sm text-amber-800">
          {{ summaryMonthError }}
        </p>

        <div class="mt-4 flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1 min-w-0">
            <label for="summary-month-search" class="sr-only">
              Buscar en el resumen del mes
            </label>
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              id="summary-month-search"
              v-model="summaryMonthSearchQuery"
              type="search"
              autocomplete="off"
              placeholder="Buscar tareas e investigaciones por título o investigación asociada…"
              class="w-full pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <button
              v-if="summaryMonthSearchQuery.trim()"
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Limpiar búsqueda"
              @click="summaryMonthSearchQuery = ''"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div
            class="flex items-center gap-2 shrink-0"
            role="group"
            aria-label="Filtrar por tipo"
          >
            <button
              v-for="opt in summaryMonthTypeFilterOptions"
              :key="opt.value"
              type="button"
              :class="[
                'px-3 py-2.5 text-sm font-medium rounded-xl border-2 transition-all',
                summaryMonthTypeFilter === opt.value
                  ? opt.activeClass
                  : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50',
              ]"
              @click="summaryMonthTypeFilter = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
        <p
          v-if="!summaryMonthLoading && summaryMonthEvents.length > 0"
          class="mt-2 text-xs text-gray-500"
        >
          {{
            filteredSummaryMonthEvents.length === summaryMonthEvents.length
              ? `${summaryMonthEvents.length} evento${summaryMonthEvents.length === 1 ? "" : "s"} en el mes`
              : `${filteredSummaryMonthEvents.length} de ${summaryMonthEvents.length} eventos`
          }}
        </p>
      </div>
      <div class="px-4 sm:px-6 py-6">
        <div
          v-if="summaryMonthLoading"
          class="flex flex-col items-center justify-center gap-3 py-16 text-gray-500"
        >
          <svg
            class="w-8 h-8 text-blue-600 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <p class="text-sm font-medium">Cargando resumen del mes…</p>
        </div>

        <div
          v-else-if="
            filteredSummaryMonthEvents.length === 0 &&
            summaryMonthEvents.length > 0
          "
          class="flex flex-col items-center justify-center gap-2 py-16 text-center text-gray-500"
        >
          <svg
            class="w-12 h-12 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p class="text-sm font-medium text-gray-600">
            No hay resultados para tu búsqueda o filtro
          </p>
          <p class="text-xs text-gray-400 max-w-sm">
            Prueba otro término o selecciona «Todas».
          </p>
        </div>

        <div
          v-else-if="summaryMonthEvents.length === 0"
          class="flex flex-col items-center justify-center gap-2 py-16 text-center text-gray-500"
        >
          <svg
            class="w-12 h-12 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p class="text-sm font-medium text-gray-600">
            No hay eventos programados para este mes
          </p>
        </div>

        <ul
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 list-none p-0 m-0"
          role="list"
        >
          <li
            v-for="event in filteredSummaryMonthEvents"
            :key="event.id"
            class="group flex flex-col rounded-2xl border-2 border-gray-100 bg-white hover:border-blue-200 hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <div
              :class="[
                'h-1.5 shrink-0',
                event.type === 'task'
                  ? 'bg-linear-to-r from-purple-500 to-violet-500'
                  : 'bg-linear-to-r from-blue-500 to-cyan-500',
              ]"
              aria-hidden="true"
            />

            <div class="flex flex-col flex-1 p-4 sm:p-5 gap-3">
              <div class="flex items-start justify-between gap-2">
                <span
                  :class="[
                    'shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold',
                    event.type === 'task'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700',
                  ]"
                >
                  {{ event.type === "task" ? "Tarea" : "Investigación" }}
                </span>
                <time
                  class="text-xs font-medium text-gray-500 text-right leading-snug"
                  :datetime="`${event.startDate}/${event.endDate}`"
                >
                  {{ formatDateRange(event.startDate, event.endDate) }}
                </time>
              </div>

              <h4
                class="text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-800 transition-colors"
              >
                {{ event.title }}
              </h4>

              <div
                v-if="event.type === 'task' && event.researchName"
                class="flex items-start gap-2 text-sm text-gray-600"
              >
                <svg
                  class="w-4 h-4 text-gray-400 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span class="line-clamp-2">
                  <span class="text-gray-400">Investigación:</span>
                  {{ event.researchName }}
                </span>
              </div>
              <p
                v-else-if="event.type === 'task'"
                class="text-xs text-gray-400 italic"
              >
                Sin investigación asociada
              </p>

              <div class="mt-auto pt-2 border-t border-gray-100">
                <button
                  type="button"
                  :disabled="aiAnalyzingId === event.id"
                  class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm transition-all"
                  title="Analizar con inteligencia artificial"
                  @click="analyzeEventWithAI(event)"
                >
                  <svg
                    v-if="aiAnalyzingId === event.id"
                    class="w-4 h-4 animate-spin shrink-0"
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
                    class="w-4 h-4 shrink-0"
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
                  {{
                    aiAnalyzingId === event.id ? "Analizando…" : "Analizar IA"
                  }}
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Task Modal (patrón Z + expandir) -->
    <Teleport to="body">
      <Transition name="app-modal-fade">
        <div v-if="showTaskModal" class="app-modal-root" style="z-index: 50">
          <div
            class="app-modal-backdrop"
            aria-hidden="true"
            @click="closeTaskModal"
          />
          <div
            class="app-modal-scrim app-modal-scrim--sheet"
            @click.self="closeTaskModal"
          >
            <div
              :class="[
                'app-modal-panel app-modal-panel--sheet bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300',
                taskModalExpanded
                  ? 'w-[96vw] h-[96vh] max-w-none max-h-none'
                  : 'w-full sm:w-[75%] max-w-5xl max-h-[90vh]',
              ]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="task-modal-title"
              @click.stop
              @keydown.escape="onTaskModalEscape"
            >
              <!-- Cabecera: inicio del recorrido Z (arriba-izq → arriba-der) -->
              <header
                class="shrink-0 px-6 py-4 border-b border-gray-100 bg-linear-to-r from-purple-50 to-indigo-50"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="flex items-start gap-3 min-w-0">
                    <div
                      class="w-11 h-11 shrink-0 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm"
                      aria-hidden="true"
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
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <h3
                        id="task-modal-title"
                        class="text-xl font-bold text-gray-800"
                      >
                        {{
                          editingTask ? "Editar Tarea" : "Nueva Tarea Especial"
                        }}
                      </h3>
                      <p class="text-sm text-gray-600 mt-0.5">
                        Sigue el recorrido en Z: define qué, luego cuándo y al
                        final la vinculación.
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      class="inline-flex items-center gap-2 px-3 py-2 hover:bg-white/80 rounded-xl transition-all text-gray-700 border border-purple-200/80 bg-white/60"
                      :title="taskModalExpanded ? 'Reducir' : 'Expandir'"
                      :aria-expanded="taskModalExpanded"
                      :aria-label="
                        taskModalExpanded
                          ? 'Reducir modal de tarea'
                          : 'Expandir modal de tarea a pantalla completa'
                      "
                      @click="toggleTaskModalExpanded"
                    >
                      <svg
                        v-if="!taskModalExpanded"
                        class="w-5 h-5 shrink-0 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                        />
                      </svg>
                      <svg
                        v-else
                        class="w-5 h-5 shrink-0 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 9L4 4m0 0l5 5M4 4h5m6 5l5-5m0 0l-5 5m5-5v5m-5 6l5 5m0 0l-5-5m5 5v-5"
                        />
                      </svg>
                      <span class="text-sm font-medium hidden sm:inline">
                        {{ taskModalExpanded ? "Reducir" : "Expandir" }}
                      </span>
                    </button>
                    <button
                      type="button"
                      class="p-2 hover:bg-white/80 rounded-xl transition-all"
                      aria-label="Cerrar modal de tarea"
                      @click="closeTaskModal"
                    >
                      <svg
                        class="w-5 h-5 text-gray-500"
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

                <!-- Pista visual del patrón Z (reduce carga cognitiva) -->
                <nav
                  class="task-z-trail mt-4"
                  aria-label="Recorrido del formulario en patrón Z"
                >
                  <ol class="task-z-trail-list">
                    <li class="task-z-trail-item task-z-trail-item--active">
                      <span class="task-z-trail-dot">1</span>
                      <span class="task-z-trail-label">Qué</span>
                    </li>
                    <li class="task-z-trail-connector" aria-hidden="true" />
                    <li class="task-z-trail-item">
                      <span class="task-z-trail-dot">2</span>
                      <span class="task-z-trail-label">Cuándo</span>
                    </li>
                    <li class="task-z-trail-connector" aria-hidden="true" />
                    <li class="task-z-trail-item">
                      <span class="task-z-trail-dot">3</span>
                      <span class="task-z-trail-label">Vincular</span>
                    </li>
                  </ol>
                </nav>
              </header>

              <form
                @submit.prevent="saveTask"
                class="flex flex-col flex-1 min-h-0 overflow-y-auto"
              >
                <div
                  :class="[
                    'p-6 space-y-8 flex-1',
                    taskModalExpanded && 'lg:p-8 lg:space-y-10',
                  ]"
                >
                  <!-- 1 · Qué (arriba-izquierda → ancla superior derecha) -->
                  <section
                    class="task-z-section"
                    aria-labelledby="task-z-what-heading"
                  >
                    <h4 id="task-z-what-heading" class="task-z-heading">
                      <span class="task-z-step">1</span>
                      Qué vas a hacer
                    </h4>
                    <div
                      :class="[
                        'grid gap-6',
                        taskModalExpanded
                          ? 'lg:grid-cols-[1fr_minmax(240px,320px)]'
                          : 'lg:grid-cols-1',
                      ]"
                    >
                      <div class="space-y-4">
                        <div>
                          <label
                            for="task-title"
                            class="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            Título de la tarea
                            <span class="text-red-500">*</span>
                          </label>
                          <input
                            id="task-title"
                            v-model="taskForm.title"
                            type="text"
                            required
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                            placeholder="Ej: Revisar resultados de laboratorio"
                          />
                        </div>
                        <div>
                          <label
                            for="task-description"
                            class="block text-sm font-semibold text-gray-700 mb-2"
                            >Descripción</label
                          >
                          <textarea
                            id="task-description"
                            v-model="taskForm.description"
                            :rows="taskModalExpanded ? 5 : 3"
                            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all resize-y min-h-[5rem]"
                            placeholder="Contexto, objetivo o notas opcionales…"
                          ></textarea>
                        </div>
                      </div>
                      <aside
                        v-if="taskModalExpanded"
                        class="rounded-2xl border border-purple-100 bg-purple-50/60 p-4 flex flex-col justify-center gap-2"
                        aria-live="polite"
                      >
                        <p
                          class="text-xs font-semibold uppercase tracking-wider text-purple-600"
                        >
                          Vista previa
                        </p>
                        <p class="text-sm font-medium text-gray-800 truncate">
                          {{ taskForm.title.trim() || "Sin título aún" }}
                        </p>
                        <p
                          v-if="taskDuration"
                          class="text-sm text-purple-700 font-medium"
                        >
                          Duración: {{ taskDuration }}
                        </p>
                        <p v-else class="text-xs text-gray-500">
                          Indica fechas para ver la duración estimada.
                        </p>
                      </aside>
                    </div>
                  </section>

                  <!-- 2 · Cuándo (tramo diagonal Z: fechas izq → horas der) -->
                  <section
                    class="task-z-section task-z-section--when"
                    aria-labelledby="task-z-when-heading"
                  >
                    <h4 id="task-z-when-heading" class="task-z-heading">
                      <span class="task-z-step">2</span>
                      Cuándo ocurre
                    </h4>
                    <div
                      :class="[
                        'grid gap-6',
                        taskModalExpanded ? 'lg:grid-cols-2' : 'md:grid-cols-2',
                      ]"
                    >
                      <div class="space-y-4">
                        <p
                          class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                        >
                          Fechas
                        </p>
                        <div class="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label
                              for="task-start-date"
                              class="block text-sm font-semibold text-gray-700 mb-2"
                            >
                              Inicio <span class="text-red-500">*</span>
                            </label>
                            <input
                              id="task-start-date"
                              v-model="taskForm.startDate"
                              type="date"
                              required
                              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                            />
                          </div>
                          <div>
                            <label
                              for="task-end-date"
                              class="block text-sm font-semibold text-gray-700 mb-2"
                            >
                              Fin <span class="text-red-500">*</span>
                            </label>
                            <input
                              id="task-end-date"
                              v-model="taskForm.endDate"
                              type="date"
                              required
                              :min="taskForm.startDate"
                              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                              :class="{ 'border-red-300': dateError }"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="space-y-4">
                        <p
                          class="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                        >
                          Horario
                        </p>
                        <div class="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label
                              for="task-start-time"
                              class="block text-sm font-semibold text-gray-700 mb-2"
                            >
                              Hora inicio <span class="text-red-500">*</span>
                            </label>
                            <input
                              id="task-start-time"
                              v-model="taskForm.startTime"
                              type="time"
                              required
                              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                            />
                          </div>
                          <div>
                            <label
                              for="task-end-time"
                              class="block text-sm font-semibold text-gray-700 mb-2"
                            >
                              Hora fin <span class="text-red-500">*</span>
                            </label>
                            <input
                              id="task-end-time"
                              v-model="taskForm.endTime"
                              type="time"
                              required
                              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="dateError || taskTimeValidationError"
                      class="mt-4 space-y-2"
                    >
                      <p
                        v-if="dateError"
                        class="text-sm text-red-600 flex items-center gap-2"
                      >
                        <svg
                          class="w-4 h-4 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          />
                        </svg>
                        {{ dateError }}
                      </p>
                      <p
                        v-if="taskTimeValidationError"
                        class="text-sm text-red-600 flex items-center gap-2"
                      >
                        <svg
                          class="w-4 h-4 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          />
                        </svg>
                        {{ taskTimeValidationError }}
                      </p>
                    </div>
                    <div
                      v-if="taskDuration && !taskModalExpanded"
                      class="mt-4 p-3 bg-purple-50 rounded-xl"
                    >
                      <span class="text-sm font-medium text-purple-700">
                        Duración: {{ taskDuration }}
                      </span>
                    </div>
                  </section>

                  <!-- 3 · Vinculación (tramo inferior del Z) -->
                  <section
                    class="task-z-section"
                    aria-labelledby="task-z-link-heading"
                  >
                    <h4 id="task-z-link-heading" class="task-z-heading">
                      <span class="task-z-step">3</span>
                      Vinculación
                    </h4>
                    <div
                      :class="['max-w-xl', taskModalExpanded && 'max-w-2xl']"
                    >
                      <label
                        for="task-research"
                        class="block text-sm font-semibold text-gray-700 mb-2"
                        >Investigación asociada</label
                      >
                      <select
                        id="task-research"
                        v-model="taskForm.researchId"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all bg-white"
                      >
                        <option value="">— Sin investigación —</option>
                        <option
                          v-for="research in researchList"
                          :key="research.id"
                          :value="research.id"
                        >
                          {{ research.name }}
                        </option>
                      </select>
                    </div>
                  </section>

                  <div
                    v-if="taskPostError"
                    class="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
                    role="alert"
                  >
                    {{ taskPostError }}
                  </div>
                </div>

                <!-- Pie: cierre del Z (izq cancelar → der acción principal) -->
                <footer
                  class="shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50/80 flex flex-col-reverse sm:flex-row sm:items-center gap-3 sm:justify-between"
                >
                  <button
                    type="button"
                    @click="closeTaskModal"
                    :disabled="submittingTaskPost"
                    class="w-full sm:w-auto px-5 py-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl font-medium text-gray-700 transition-all disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    :disabled="
                      !isTaskFormValid ||
                      !!dateError ||
                      !!taskTimeValidationError ||
                      submittingTaskPost
                    "
                    :class="[
                      'w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all inline-flex items-center justify-center gap-2 shadow-sm',
                      isTaskFormValid &&
                      !dateError &&
                      !taskTimeValidationError &&
                      !submittingTaskPost
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed',
                    ]"
                  >
                    <svg
                      v-if="submittingTaskPost"
                      class="w-5 h-5 animate-spin shrink-0"
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
                    {{
                      submittingTaskPost
                        ? "Enviando…"
                        : editingTask
                          ? "Guardar Cambios"
                          : "Crear Tarea"
                    }}
                  </button>
                </footer>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Research Modal -->
    <Teleport to="body">
      <Transition name="app-modal-fade">
        <div
          v-if="showResearchModal"
          class="app-modal-root"
          style="z-index: 50"
        >
          <div
            class="app-modal-backdrop"
            aria-hidden="true"
            @click="closeResearchModal"
          />
          <div
            class="app-modal-scrim app-modal-scrim--sheet"
            @click.self="closeResearchModal"
          >
            <div
              :class="[
                'app-modal-panel app-modal-panel--sheet bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300',
                researchModalExpanded
                  ? 'w-[96vw] h-[96vh] max-w-none max-h-none'
                  : 'w-full sm:w-[75%] max-w-5xl max-h-[90vh]',
              ]"
              role="dialog"
              aria-modal="true"
              @click.stop
              @keydown.escape="onResearchModalEscape"
            >
              <div class="p-6 border-b border-gray-100 shrink-0">
                <div class="flex items-center justify-between gap-3">
                  <h3 class="text-xl font-bold text-gray-800 min-w-0">
                    {{
                      editingResearch
                        ? "Editar Investigación"
                        : "Nueva Investigación"
                    }}
                  </h3>
                  <div class="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      class="inline-flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl transition-all text-gray-700 border border-gray-200"
                      :title="researchModalExpanded ? 'Reducir' : 'Expandir'"
                      :aria-expanded="researchModalExpanded"
                      :aria-label="
                        researchModalExpanded
                          ? 'Reducir modal'
                          : 'Expandir modal a pantalla completa'
                      "
                      @click="toggleResearchModalExpanded"
                    >
                      <svg
                        v-if="!researchModalExpanded"
                        class="w-5 h-5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                        />
                      </svg>
                      <svg
                        v-else
                        class="w-5 h-5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 9L4 4m0 0l5 5M4 4h5m6 5l5-5m0 0l-5 5m5-5v5m-5 6l5 5m0 0l-5-5m5 5v-5"
                        />
                      </svg>
                      <span class="text-sm font-medium hidden sm:inline">
                        {{ researchModalExpanded ? "Reducir" : "Expandir" }}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label="Cerrar modal de investigación"
                      @click="closeResearchModal"
                      class="p-2 hover:bg-gray-100 rounded-xl transition-all"
                    >
                      <svg
                        class="w-5 h-5 text-gray-500"
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
              </div>

              <form
                @submit.prevent="saveResearch"
                class="p-6 space-y-4 flex-1 min-h-0 overflow-y-auto"
              >
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Título de la investigación
                    <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="researchForm.title"
                    type="text"
                    required
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="Ej: Estudio de audición infantil"
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2"
                    >Descripción</label
                  >
                  <textarea
                    v-model="researchForm.description"
                    rows="3"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                    placeholder="Descripción opcional de la investigación..."
                  ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Fecha de inicio <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="researchForm.startDate"
                      type="date"
                      required
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Fecha de fin <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="researchForm.endDate"
                      type="date"
                      required
                      :min="researchForm.startDate"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      :class="{ 'border-red-300': researchDateError }"
                    />
                  </div>
                </div>

                <div
                  v-if="researchDateError"
                  class="text-sm text-red-600 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    />
                  </svg>
                  {{ researchDateError }}
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Hora de inicio <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="researchForm.startTime"
                      type="time"
                      required
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Hora de fin <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="researchForm.endTime"
                      type="time"
                      required
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                <div
                  v-if="researchTimeValidationError"
                  class="text-sm text-red-600 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    />
                  </svg>
                  {{ researchTimeValidationError }}
                </div>

                <div
                  v-if="researchPostError"
                  class="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
                >
                  {{ researchPostError }}
                </div>

                <section
                  class="pt-4 mt-2 border-t border-gray-100"
                  aria-labelledby="research-ai-section-title"
                >
                  <h4
                    id="research-ai-section-title"
                    class="text-sm font-bold text-gray-800 flex items-center gap-2"
                  >
                    <svg
                      class="w-5 h-5 text-blue-600 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Asignar a la Inteligencia Artificial
                  </h4>
                  <p class="text-xs text-gray-500 mt-1 mb-3 leading-relaxed">
                    Complete título, fechas y horario. Puede generar el análisis
                    ahora o programarlo para todo el rango; los hallazgos
                    programados aparecerán en notificaciones.
                  </p>

                  <div
                    v-if="researchAiFormError"
                    class="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800"
                  >
                    {{ researchAiFormError }}
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      :disabled="
                        !isResearchFormValid ||
                        researchAiFormLoading ||
                        submittingResearchPost
                      "
                      class="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all text-sm"
                      @click="runResearchInstantAIFromForm"
                    >
                      <svg
                        v-if="researchAiFormLoading"
                        class="w-4 h-4 animate-spin shrink-0"
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
                        class="w-4 h-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      {{
                        researchAiFormLoading
                          ? "Generando…"
                          : "Generar instantáneamente"
                      }}
                    </button>
                    <button
                      type="button"
                      :disabled="
                        !isResearchFormValid ||
                        researchAiFormLoading ||
                        submittingResearchPost
                      "
                      class="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-blue-800 bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                      @click="registerScheduledResearchAIFromForm"
                    >
                      <svg
                        class="w-4 h-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Generar de acuerdo al rango de fecha
                    </button>
                  </div>
                </section>

                <div class="flex gap-3 pt-4">
                  <button
                    type="button"
                    @click="closeResearchModal"
                    :disabled="submittingResearchPost"
                    class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-all disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    :disabled="
                      !isResearchFormValid ||
                      !!researchDateError ||
                      !!researchTimeValidationError ||
                      submittingResearchPost
                    "
                    :class="[
                      'flex-1 px-4 py-3 rounded-xl font-medium transition-all inline-flex items-center justify-center gap-2',
                      isResearchFormValid &&
                      !researchDateError &&
                      !researchTimeValidationError &&
                      !submittingResearchPost
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed',
                    ]"
                  >
                    <svg
                      v-if="submittingResearchPost"
                      class="w-5 h-5 animate-spin shrink-0"
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
                    {{
                      submittingResearchPost
                        ? "Enviando…"
                        : editingResearch
                          ? "Guardar Cambios"
                          : "Crear Investigación"
                    }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Event Detail Modal -->
    <Teleport to="body">
      <Transition name="app-modal-fade">
        <div v-if="selectedEvent" class="app-modal-root" style="z-index: 50">
          <div
            class="app-modal-backdrop"
            aria-hidden="true"
            @click="closeEventDetail"
          />
          <div
            class="app-modal-scrim app-modal-scrim--sheet"
            @click.self="closeEventDetail"
          >
            <div
              :class="[
                'app-modal-panel app-modal-panel--sheet bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300',
                eventDetailModalExpanded
                  ? 'w-[96vw] h-[96vh] max-w-none max-h-none'
                  : 'w-full sm:w-[75%] max-w-4xl max-h-[90vh]',
              ]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="event-detail-title"
              @click.stop
              @keydown.escape="onEventDetailModalEscape"
            >
              <div
                class="p-6 sm:p-8 flex flex-col flex-1 min-h-0 overflow-y-auto"
              >
                <div class="flex items-center justify-between mb-4 gap-3">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium shrink-0',
                      selectedEvent.type === 'task'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700',
                    ]"
                  >
                    {{
                      selectedEvent.type === "task" ? "Tarea" : "Investigación"
                    }}
                  </span>
                  <div class="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      class="inline-flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl transition-all text-gray-700 border border-gray-200"
                      :title="eventDetailModalExpanded ? 'Reducir' : 'Expandir'"
                      :aria-expanded="eventDetailModalExpanded"
                      :aria-label="
                        eventDetailModalExpanded
                          ? 'Reducir modal de detalle'
                          : 'Expandir modal de detalle a pantalla completa'
                      "
                      @click="toggleEventDetailModalExpanded"
                    >
                      <svg
                        v-if="!eventDetailModalExpanded"
                        class="w-5 h-5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                        />
                      </svg>
                      <svg
                        v-else
                        class="w-5 h-5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 9L4 4m0 0l5 5M4 4h5m6 5l5-5m0 0l-5 5m5-5v5m-5 6l5 5m0 0l-5-5m5 5v-5"
                        />
                      </svg>
                      <span class="text-sm font-medium hidden sm:inline">
                        {{ eventDetailModalExpanded ? "Reducir" : "Expandir" }}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label="Cerrar detalle del evento"
                      @click="closeEventDetail"
                      class="p-2 hover:bg-gray-100 rounded-xl transition-all"
                    >
                      <svg
                        class="w-5 h-5 text-gray-500"
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

                <h3
                  id="event-detail-title"
                  class="text-xl sm:text-2xl font-bold text-gray-800 mb-2 leading-snug"
                >
                  {{ selectedEvent.title }}
                </h3>
                <p v-if="selectedEvent.description" class="text-gray-600 mb-4">
                  {{ selectedEvent.description }}
                </p>

                <div class="space-y-3">
                  <div class="flex items-center gap-3 text-sm text-gray-600">
                    <svg
                      class="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{{
                      formatDateRange(
                        selectedEvent.startDate,
                        selectedEvent.endDate,
                      )
                    }}</span>
                  </div>

                  <div
                    v-if="selectedEvent.startTime"
                    class="flex items-center gap-3 text-sm text-gray-600"
                  >
                    <svg
                      class="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span
                      >{{ selectedEvent.startTime }} -
                      {{ selectedEvent.endTime }}</span
                    >
                  </div>

                  <div
                    v-if="selectedEvent.researchName"
                    class="flex items-center gap-3 text-sm text-gray-600"
                  >
                    <svg
                      class="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <span>Investigación: {{ selectedEvent.researchName }}</span>
                  </div>
                </div>

                <section
                  v-if="selectedEvent.type === 'research'"
                  class="mt-6 pt-4 border-t border-gray-100"
                  aria-labelledby="event-detail-research-ai-title"
                >
                  <h4
                    id="event-detail-research-ai-title"
                    class="text-sm font-bold text-gray-800 mb-3"
                  >
                    Asignar a la Inteligencia Artificial
                  </h4>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      :disabled="researchAiFormLoading"
                      class="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-60 shadow-sm text-sm"
                      @click="runResearchInstantAIFromEvent(selectedEvent)"
                    >
                      <svg
                        v-if="researchAiFormLoading"
                        class="w-4 h-4 animate-spin shrink-0"
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
                      {{
                        researchAiFormLoading
                          ? "Generando…"
                          : "Generar instantáneamente"
                      }}
                    </button>
                    <button
                      type="button"
                      :disabled="researchAiFormLoading"
                      class="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-blue-800 bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 text-sm"
                      @click="registerScheduledResearchAI(selectedEvent)"
                    >
                      Generar de acuerdo al rango de fecha
                    </button>
                  </div>
                </section>

                <div
                  :class="[
                    'flex gap-3 mt-6 pt-4 border-t border-gray-100',
                    eventDetailModalExpanded
                      ? 'flex-row flex-wrap items-center justify-between'
                      : 'flex-col sm:flex-row flex-wrap',
                  ]"
                >
                  <button
                    @click="editEvent(selectedEvent)"
                    class="flex-1 min-w-[7rem] px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-all flex items-center justify-center gap-2"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Editar
                  </button>
                  <button
                    v-if="selectedEvent.type === 'task'"
                    type="button"
                    :disabled="taskAssignAiPanelLoading"
                    class="flex-1 min-w-[10rem] px-4 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                    title="Asignar tarea con inteligencia artificial"
                    @click="assignTaskFromDetailWithAI"
                  >
                    <svg
                      v-if="taskAssignAiPanelLoading"
                      class="w-4 h-4 animate-spin shrink-0"
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
                      class="w-4 h-4 shrink-0"
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
                    <span class="text-center leading-snug">{{
                      taskAssignAiPanelLoading
                        ? "Analizando…"
                        : eventDetailModalExpanded
                          ? "Asignar tarea por inteligencia artificial"
                          : "Asignar con IA"
                    }}</span>
                  </button>
                  <button
                    @click="deleteEvent(selectedEvent)"
                    class="flex-1 min-w-[7rem] px-4 py-3 bg-red-100 hover:bg-red-200 rounded-xl font-medium text-red-700 transition-all flex items-center justify-center gap-2"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <CalendarAIResearchPanel
      :is-open="aiPanelOpen"
      :loading="aiPanelLoading"
      :saving="aiSaving"
      :error="aiPanelError"
      :save-error="aiSaveError"
      :save-success="aiSaveSuccess"
      :content="aiPanelContent"
      :event-title="aiPanelEvent?.title ?? ''"
      :event-type="aiPanelEvent?.type ?? 'task'"
      :display-date="
        aiPanelEvent
          ? formatDateRange(aiPanelEvent.startDate, aiPanelEvent.endDate)
          : ''
      "
      :research-name="aiPanelEvent?.researchName ?? null"
      :generated-at="aiGeneratedAt"
      :context-summary="aiContextSummary"
      @close="closeAIPanel"
      @regenerate="regenerateAIAnalysis"
      @save="saveAIAnalysis"
    />

    <TaskAssignModeDialog
      :is-open="taskAssignModeDialogOpen"
      :event="taskAssignModeDialogEvent"
      :date-range-label="taskAssignModeDateRangeLabel"
      @close="closeTaskAssignModeDialog"
      @select="onTaskAssignModeSelected"
    />

    <CalendarTaskAssignmentAIPanel
      :is-open="taskAssignAiPanelOpen"
      :loading="taskAssignAiPanelLoading"
      :saving="taskAssignAiSaving"
      :error="taskAssignAiPanelError"
      :save-error="taskAssignAiSaveError"
      :save-success="taskAssignAiSaveSuccess"
      :applied="taskAssignAiApplied"
      :content="taskAssignAiPanelContent"
      :assignment="taskAssignAiAssignment"
      :findings="taskAssignAiFindings"
      :event-title="taskAssignAiPanelEvent?.title ?? ''"
      :generated-at="taskAssignAiGeneratedAt"
      @close="closeTaskAssignAiPanel"
      @regenerate="regenerateTaskAssignAi"
      @save="saveTaskAssignmentAIAnalysis"
      @apply="applyTaskAssignmentFromPanel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import axios from "axios";
import { push } from "notivue";
import CalendarAIResearchPanel from "../../components/calendar/CalendarAIResearchPanel.vue";
import CalendarTaskAssignmentAIPanel from "../../components/calendar/CalendarTaskAssignmentAIPanel.vue";
import TaskAssignModeDialog from "../../components/calendar/TaskAssignModeDialog.vue";
import { postCalendarAiAnalysis } from "../../shared/api/calendarAiAnalysisApi";
import { useCalendarTaskAiScheduleStore } from "../../stores/calendarTaskAiSchedule";
import { useNotificationsStore } from "../../stores/notifications";
import type {
  CreateCalendarAiAnalysisPayload,
  TaskAssignmentAIEnvelope,
  TaskAssignmentFinding,
  TaskAssignmentProposal,
} from "../../shared/types/calendarAiAnalysis";
import type {
  CalendarResearchDraftSnapshot,
  TaskAssignmentExecutionMode,
} from "../../shared/types/calendarTaskAiSchedule";
import type { CalendarTaskAiScheduleJob } from "../../shared/types/calendarTaskAiSchedule";
import { useGetGenerativeModelGP } from "../../shared/service/useGetGenerativeModelGP";

/** Base URL recurso calendar-events (GET con query, POST cuerpo plano). */
const CALENDAR_EVENTS_API = "http://localhost:3000/api/v1/calendar-events";

// Types
interface Research {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/** Payload que se envía y que puede devolver el API (opcionalmente con `id`). */
interface CalendarEventsPostBody {
  type: "task" | "research";
  title: string;
  description: string;
  date: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  researchId: number | null;
  researchName: string | null;
}

interface CalendarEvent {
  id: string;
  type: "task" | "research";
  title: string;
  description: string;
  date: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  researchId?: number;
  researchName?: string;
}

/** Fila del «Resumen del Mes» — una por tarea/evento con rango de fechas. */
interface CalendarSummaryTableRow {
  id: string;
  type: "task" | "research";
  title: string;
  startDate: string;
  endDate: string;
  researchName: string | null;
  researchId?: string | number | null;
}

interface CalendarDayCell {
  date: Date;
  day: number;
  dateString: string;
  isCurrentMonth: boolean;
}

interface CalendarWeekRangeBar {
  event: CalendarEvent;
  colStart: number;
  colSpan: number;
  lane: number;
  showTitle: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
}

interface CalendarWeekView {
  days: CalendarDayCell[];
  bars: CalendarWeekRangeBar[];
  barLaneCount: number;
}

interface TaskForm {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  researchId: string;
}

interface ResearchForm {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

// State
const currentDate = ref(new Date());
const researchList = ref<Research[]>([]);
const researchError = ref(false);
const events = ref<CalendarEvent[]>([]);
const selectedEvent = ref<CalendarEvent | null>(null);

// Modal states
const showTaskModal = ref(false);
const showResearchModal = ref(false);
const editingTask = ref(false);
const editingResearch = ref(false);
const editingEventId = ref<string>("");
const taskPostError = ref<string | null>(null);
const researchPostError = ref<string | null>(null);
const submittingTaskPost = ref(false);
const submittingResearchPost = ref(false);
const taskModalExpanded = ref(false);

/** Modal de asignación de tarea con IA (detalle → Asignar con IA). */
const taskAssignAiPanelOpen = ref(false);
const taskAssignAiPanelLoading = ref(false);
const taskAssignAiPanelError = ref<string | null>(null);
const taskAssignAiPanelContent = ref("");
const taskAssignAiAssignment = ref<TaskAssignmentProposal | null>(null);
const taskAssignAiPanelEvent = ref<CalendarEvent | null>(null);
const taskAssignAiGeneratedAt = ref<Date | null>(null);
const taskAssignAiSaving = ref(false);
const taskAssignAiSaveError = ref<string | null>(null);
const taskAssignAiSaveSuccess = ref(false);
const taskAssignAiApplied = ref(false);
const taskAssignAiFindings = ref<TaskAssignmentFinding[]>([]);

const researchAiFormError = ref<string | null>(null);
const researchAiFormLoading = ref(false);

interface ResearchMonitoringAIEnvelope {
  reportMarkdown: string;
  findings: TaskAssignmentFinding[];
}

const taskAssignModeDialogOpen = ref(false);
const taskAssignModeDialogEvent = ref<CalendarEvent | null>(null);

const calendarTaskAiScheduleStore = useCalendarTaskAiScheduleStore();
const notificationsStore = useNotificationsStore();
let taskAiScheduleIntervalId: ReturnType<typeof setInterval> | null = null;
const eventDetailModalExpanded = ref(false);
const researchModalExpanded = ref(false);

/** Cards «Resumen del Mes» — datos del servidor. */
const summaryMonthEvents = ref<CalendarSummaryTableRow[]>([]);
const summaryMonthLoading = ref(false);
const summaryMonthError = ref<string | null>(null);
const summaryMonthSearchQuery = ref("");
const summaryMonthTypeFilter = ref<"all" | "task" | "research">("all");

const summaryMonthTypeFilterOptions = [
  {
    value: "all" as const,
    label: "Todas",
    activeClass: "border-gray-700 bg-gray-800 text-white",
  },
  {
    value: "task" as const,
    label: "Tareas",
    activeClass: "border-purple-500 bg-purple-600 text-white",
  },
  {
    value: "research" as const,
    label: "Investigaciones",
    activeClass: "border-blue-500 bg-blue-600 text-white",
  },
];

/** Panel de resultados IA (resumen del mes). */
const aiPanelOpen = ref(false);
const aiPanelLoading = ref(false);
const aiPanelError = ref<string | null>(null);
const aiPanelContent = ref("");
const aiPanelEvent = ref<CalendarSummaryTableRow | null>(null);
const aiGeneratedAt = ref<Date | null>(null);
const aiAnalyzingId = ref<string | null>(null);
const aiSaving = ref(false);
const aiSaveError = ref<string | null>(null);
const aiSaveSuccess = ref(false);

const aiContextSummary = computed(() => {
  const ev = aiPanelEvent.value;
  if (!ev) return "";
  const tipo =
    ev.type === "task" ? "tarea especial" : "bloque de investigación";
  const inv = ev.researchName
    ? ` vinculada a la investigación «${ev.researchName}».`
    : " sin investigación asociada en el calendario.";
  return `Evento de tipo ${tipo} programado para el calendario${inv}`;
});

// Forms
const taskForm = ref<TaskForm>({
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  researchId: "",
});

const researchForm = ref<ResearchForm>({
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
});

// Weekdays
const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// Computed
const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonth = computed(() => currentDate.value.getMonth());
const currentMonthName = computed(() => {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return months[currentMonth.value];
});

const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const days: {
    date: Date;
    day: number;
    dateString: string;
    isCurrentMonth: boolean;
  }[] = [];

  // Previous month days
  const prevMonth = new Date(year, month, 0);
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonth.getDate() - i;
    const date = new Date(year, month - 1, day);
    days.push({
      date,
      day,
      dateString: formatDateKey(date),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    days.push({
      date,
      day: i,
      dateString: formatDateKey(date),
      isCurrentMonth: true,
    });
  }

  // Next month days to fill grid (6 rows x 7 cols = 42 cells)
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date,
      day: i,
      dateString: formatDateKey(date),
      isCurrentMonth: false,
    });
  }

  return days;
});

const calendarWeekViews = computed((): CalendarWeekView[] => {
  const views: CalendarWeekView[] = [];
  const days = calendarDays.value;

  for (let i = 0; i < days.length; i += 7) {
    const weekDays = days.slice(i, i + 7) as CalendarDayCell[];
    const bars = buildWeekRangeBars(weekDays);
    views.push({
      days: weekDays,
      bars,
      barLaneCount: bars.length ? Math.max(...bars.map((b) => b.lane)) + 1 : 0,
    });
  }

  return views;
});

const taskAssignModeDateRangeLabel = computed(() => {
  const ev = taskAssignModeDialogEvent.value;
  if (!ev) return "";
  return formatDateRange(ev.startDate, ev.endDate);
});

const sortedSummaryMonthEvents = computed(() =>
  [...summaryMonthEvents.value].sort(
    (a, b) =>
      new Date(`${a.startDate}T12:00:00`).getTime() -
      new Date(`${b.startDate}T12:00:00`).getTime(),
  ),
);

const filteredSummaryMonthEvents = computed(() => {
  const q = summaryMonthSearchQuery.value.trim().toLowerCase();
  const typeFilter = summaryMonthTypeFilter.value;

  return sortedSummaryMonthEvents.value.filter((event) => {
    if (typeFilter !== "all" && event.type !== typeFilter) return false;
    if (!q) return true;

    const typeLabels =
      event.type === "task"
        ? "tarea tareas task"
        : "investigación investigaciones research";

    const haystack = [
      event.title,
      event.researchName ?? "",
      typeLabels,
      formatDateRange(event.startDate, event.endDate),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
});

const dateError = computed(() => {
  if (taskForm.value.startDate && taskForm.value.endDate) {
    const start = new Date(taskForm.value.startDate);
    const end = new Date(taskForm.value.endDate);
    if (end < start) {
      return "La fecha de fin no puede ser anterior a la fecha de inicio";
    }
  }
  return "";
});

const researchDateError = computed(() => {
  if (researchForm.value.startDate && researchForm.value.endDate) {
    const start = new Date(researchForm.value.startDate);
    const end = new Date(researchForm.value.endDate);
    if (end < start) {
      return "La fecha de fin no puede ser anterior a la fecha de inicio";
    }
  }
  return "";
});

const taskDuration = computed(() => {
  if (taskForm.value.startDate && taskForm.value.endDate) {
    const start = new Date(taskForm.value.startDate);
    const end = new Date(taskForm.value.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? "1 día" : `${diffDays} días`;
  }
  return "";
});

const isTaskFormValid = computed(() => {
  return (
    taskForm.value.title.trim() !== "" &&
    taskForm.value.startDate !== "" &&
    taskForm.value.endDate !== "" &&
    taskForm.value.startTime !== "" &&
    taskForm.value.endTime !== ""
  );
});

const isResearchFormValid = computed(() => {
  return (
    researchForm.value.title.trim() !== "" &&
    researchForm.value.startDate !== "" &&
    researchForm.value.endDate !== "" &&
    researchForm.value.startTime !== "" &&
    researchForm.value.endTime !== ""
  );
});

/** Mismo día: hora fin >= hora inicio */
const taskTimeValidationError = computed(() =>
  validateTimeOrderSameDay(
    taskForm.value.startDate,
    taskForm.value.endDate,
    taskForm.value.startTime,
    taskForm.value.endTime,
  ),
);

const researchTimeValidationError = computed(() =>
  validateTimeOrderSameDay(
    researchForm.value.startDate,
    researchForm.value.endDate,
    researchForm.value.startTime,
    researchForm.value.endTime,
  ),
);

// Helper functions
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_HM_RE = /^\d{2}:\d{2}$/;

function validateTimeOrderSameDay(
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
): string | null {
  if (!startDate || !endDate || !startTime || !endTime) return null;
  if (startDate !== endDate) return null;
  if (startTime >= endTime) {
    return "La hora de fin debe ser posterior a la de inicio cuando es el mismo día";
  }
  return null;
}

function parseNumericResearchId(idStr: string): number | null {
  const trimmed = idStr.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function validateCalendarEventsPostBody(
  body: CalendarEventsPostBody,
): string | null {
  const e = body;

  if (e.type !== "task" && e.type !== "research") {
    return "type debe ser task o research";
  }
  if (!e.title.trim()) return "El título del evento es obligatorio";

  const datesOk =
    ISO_DATE_RE.test(e.date) &&
    ISO_DATE_RE.test(e.startDate) &&
    ISO_DATE_RE.test(e.endDate);
  const timesOk = TIME_HM_RE.test(e.startTime) && TIME_HM_RE.test(e.endTime);

  if (!datesOk || !timesOk) {
    return "Formato inválido de fecha (YYYY-MM-DD) u hora (HH:mm)";
  }

  if (e.date !== e.startDate) {
    return "date debe coincidir con startDate (compatibilidad con la grilla)";
  }
  if (e.startDate > e.endDate) {
    return "startDate no puede ser posterior a endDate";
  }

  if (e.startDate === e.endDate) {
    const timeErr = validateTimeOrderSameDay(
      e.startDate,
      e.endDate,
      e.startTime,
      e.endTime,
    );
    if (timeErr) return timeErr;
  }

  if (e.type === "research") {
    if (e.researchId !== null || e.researchName !== null) {
      return "Para type research los campos researchId y researchName deben ser null";
    }
  } else {
    if (
      e.researchId !== null &&
      (e.researchName === null ||
        !(typeof e.researchName === "string" && e.researchName.trim()))
    ) {
      return "Si researchId tiene valor, researchName debe indicarse";
    }
    if (
      e.researchId === null &&
      e.researchName !== null &&
      String(e.researchName).trim() !== ""
    ) {
      return "Sin researchId numérico, researchName debe ser null";
    }
  }

  return null;
}

function extractCreatedCalendarEventPayload(
  data: unknown,
): (CalendarEventsPostBody & { id?: string }) | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  const evs = obj.events;
  if (
    Array.isArray(evs) &&
    evs[0] !== undefined &&
    typeof evs[0] === "object"
  ) {
    return evs[0] as unknown as CalendarEventsPostBody & { id?: string };
  }
  const t = obj.type;
  if (t === "task" || t === "research") {
    return obj as unknown as CalendarEventsPostBody & { id?: string };
  }
  return null;
}

function mapPostBodyToCalendarEvent(
  row: CalendarEventsPostBody & { id?: string },
  fallbackId: string,
): CalendarEvent {
  const evt: CalendarEvent = {
    id: row.id ?? fallbackId,
    type: row.type,
    title: row.title,
    description: row.description ?? "",
    date: row.date,
    startDate: row.startDate,
    endDate: row.endDate,
    startTime: row.startTime,
    endTime: row.endTime,
  };
  if (
    row.type === "task" &&
    typeof row.researchId === "number" &&
    Number.isFinite(row.researchId)
  ) {
    evt.researchId = row.researchId;
  }
  const nameTrim =
    typeof row.researchName === "string" ? row.researchName.trim() : "";
  if (nameTrim) {
    evt.researchName = nameTrim;
  }
  return evt;
}

function readAxiosErrorMessage(err: unknown): string {
  const e = err as {
    response?: {
      data?: unknown;
    };
    message?: string;
  };
  const d = e.response?.data;
  if (Array.isArray(d) && d.length > 0) {
    const msgs = (d as { message?: string; path?: (string | number)[] }[]).map(
      (x) => x.message ?? "",
    );
    const joined = msgs.filter(Boolean).join(" · ");
    if (joined) return joined.slice(0, 500);
  }
  const flat = d as { message?: string; error?: string } | undefined;
  return (
    flat?.message ??
    flat?.error ??
    e.message ??
    "Error al comunicarse con el servidor"
  );
}

function pickIsoDate(...candidates: unknown[]): string {
  for (const c of candidates) {
    if (typeof c === "string" && ISO_DATE_RE.test(c)) return c;
  }
  return "";
}

function extractCalendarApiItems(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const o = payload as Record<string, unknown>;
    if (Array.isArray(o.events)) return o.events;
    if (Array.isArray(o.data)) return o.data;
  }
  return [];
}

function mapApiItemToCalendarEvent(
  item: unknown,
  idx: number,
): CalendarEvent | null {
  if (!item || typeof item !== "object") return null;
  const r = item as Record<string, unknown>;

  const type =
    r.type === "research" ? "research" : r.type === "task" ? "task" : null;
  if (!type) return null;

  const id =
    typeof r.id === "string" || typeof r.id === "number"
      ? String(r.id)
      : `evt-${idx}`;

  const title =
    typeof r.title === "string" ? r.title : String(r.title ?? "Sin título");

  const startDate = pickIsoDate(r.startDate, r.start_date, r.date);
  if (!startDate) return null;

  const endDate = pickIsoDate(r.endDate, r.end_date) || startDate;
  const rangeStart = startDate <= endDate ? startDate : endDate;
  const rangeEnd = startDate <= endDate ? endDate : startDate;

  const evt: CalendarEvent = {
    id,
    type,
    title,
    description: typeof r.description === "string" ? r.description : "",
    date: rangeStart,
    startDate: rangeStart,
    endDate: rangeEnd,
    startTime:
      typeof r.startTime === "string"
        ? r.startTime
        : typeof r.start_time === "string"
          ? r.start_time
          : "",
    endTime:
      typeof r.endTime === "string"
        ? r.endTime
        : typeof r.end_time === "string"
          ? r.end_time
          : "",
  };

  const rid = r.researchId ?? r.research_id;
  if (type === "task" && typeof rid === "number" && Number.isFinite(rid)) {
    evt.researchId = rid;
  } else if (type === "task" && typeof rid === "string" && /^\d+$/.test(rid)) {
    evt.researchId = Number(rid);
  }

  const rn =
    typeof r.researchName === "string"
      ? r.researchName
      : typeof r.research_name === "string"
        ? r.research_name
        : "";
  const trimmedRn = rn.trim();
  if (trimmedRn) evt.researchName = trimmedRn;

  return evt;
}

function normalizeCalendarEventsFromApi(payload: unknown): CalendarEvent[] {
  return extractCalendarApiItems(payload)
    .map((item, idx) => mapApiItemToCalendarEvent(item, idx))
    .filter((e): e is CalendarEvent => e !== null);
}

function calendarEventsToSummaryRows(
  calendarEvents: CalendarEvent[],
): CalendarSummaryTableRow[] {
  return calendarEvents.map((ev) => ({
    id: ev.id,
    type: ev.type,
    title: ev.title,
    startDate: ev.startDate,
    endDate: ev.endDate,
    researchName: ev.researchName ?? null,
    researchId: ev.researchId ?? null,
  }));
}

function syncSummaryFromEvents() {
  summaryMonthEvents.value = calendarEventsToSummaryRows(events.value);
}

function getEventRangeBounds(event: CalendarEvent): {
  start: string;
  end: string;
} {
  const start = event.startDate || event.date;
  const end = event.endDate || start;
  return start <= end ? { start, end } : { start: end, end: start };
}

function isMultiDayEvent(event: CalendarEvent): boolean {
  const { start, end } = getEventRangeBounds(event);
  return start !== end;
}

function eventTouchesDate(event: CalendarEvent, dateKey: string): boolean {
  const { start, end } = getEventRangeBounds(event);
  return dateKey >= start && dateKey <= end;
}

function buildWeekRangeBars(
  weekDays: CalendarDayCell[],
): CalendarWeekRangeBar[] {
  const weekStart = weekDays[0]?.dateString ?? "";
  const weekEnd = weekDays[6]?.dateString ?? "";

  const candidates = events.value
    .filter(isMultiDayEvent)
    .filter((event) => {
      const { start, end } = getEventRangeBounds(event);
      return !(end < weekStart || start > weekEnd);
    })
    .map((event) => {
      const { start, end } = getEventRangeBounds(event);

      let colStart = 1;
      let colEnd = 7;
      for (let i = 0; i < 7; i++) {
        const ds = weekDays[i]?.dateString ?? "";
        if (eventTouchesDate(event, ds)) {
          colStart = i + 1;
          break;
        }
      }
      for (let i = 6; i >= 0; i--) {
        const ds = weekDays[i]?.dateString ?? "";
        if (eventTouchesDate(event, ds)) {
          colEnd = i + 1;
          break;
        }
      }

      const segmentStartDate = weekDays[colStart - 1]?.dateString ?? "";
      const segmentEndDate = weekDays[colEnd - 1]?.dateString ?? "";

      return {
        event,
        colStart,
        colSpan: colEnd - colStart + 1,
        showTitle: start === segmentStartDate,
        isRangeStart: start === segmentStartDate,
        isRangeEnd: end === segmentEndDate,
        lane: 0,
        sortKey: colStart * 100 + colEnd,
      };
    })
    .sort((a, b) => a.sortKey - b.sortKey);

  const laneEnds: number[] = [];
  for (const bar of candidates) {
    const endCol = bar.colStart + bar.colSpan - 1;
    let lane = laneEnds.findIndex((laneEnd) => laneEnd < bar.colStart);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(endCol);
    } else {
      laneEnds[lane] = endCol;
    }
    bar.lane = lane;
  }

  return candidates.map(({ sortKey: _sortKey, ...bar }) => bar);
}

async function fetchCalendarSummaryForMonth() {
  summaryMonthLoading.value = true;
  summaryMonthError.value = null;

  try {
    const y = currentYear.value;
    const m = currentMonth.value;
    const from = formatDateKey(new Date(y, m, 1));
    const to = formatDateKey(new Date(y, m + 1, 0));

    const { data } = await axios.get<unknown>(CALENDAR_EVENTS_API, {
      params: { from, to },
    });

    const monthEvents = normalizeCalendarEventsFromApi(data);
    events.value = monthEvents;
    summaryMonthEvents.value = calendarEventsToSummaryRows(monthEvents);
  } catch (err) {
    events.value = [];
    summaryMonthEvents.value = [];
    summaryMonthError.value =
      readAxiosErrorMessage(err) ||
      "No se pudieron cargar los eventos del mes.";
    console.error("[fetchCalendarSummaryForMonth]", err);
  } finally {
    summaryMonthLoading.value = false;
  }
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDate(dateString: string): string {
  const date = new Date(`${dateString}T12:00:00`);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateRange(startDate: string, endDate: string): string {
  const { start, end } =
    startDate <= endDate
      ? { start: startDate, end: endDate }
      : { start: endDate, end: startDate };
  if (start === end) return formatDate(start);
  return `${formatDate(start)} – ${formatDate(end)}`;
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function getEventsTouchingDate(date: Date): CalendarEvent[] {
  const dateKey = formatDateKey(date);
  return events.value.filter((event) => eventTouchesDate(event, dateKey));
}

function getSingleDayEventsForDate(date: Date): CalendarEvent[] {
  const dateKey = formatDateKey(date);
  return events.value.filter((event) => {
    const { start, end } = getEventRangeBounds(event);
    return start === end && start === dateKey;
  });
}

// Navigation
function previousMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
}

function nextMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
}

function goToToday() {
  currentDate.value = new Date();
}

// Modal functions
function resetTaskAssignAiPanelState() {
  taskAssignAiPanelLoading.value = false;
  taskAssignAiPanelError.value = null;
  taskAssignAiPanelContent.value = "";
  taskAssignAiAssignment.value = null;
  taskAssignAiGeneratedAt.value = null;
  taskAssignAiSaving.value = false;
  taskAssignAiSaveError.value = null;
  taskAssignAiSaveSuccess.value = false;
  taskAssignAiApplied.value = false;
  taskAssignAiFindings.value = [];
}

function toggleTaskModalExpanded() {
  taskModalExpanded.value = !taskModalExpanded.value;
}

function toggleEventDetailModalExpanded() {
  eventDetailModalExpanded.value = !eventDetailModalExpanded.value;
}

function toggleResearchModalExpanded() {
  researchModalExpanded.value = !researchModalExpanded.value;
}

/** Escape: primero reduce si está expandido; el cierre lo gestiona el scrim. */
function onTaskModalEscape(event: KeyboardEvent) {
  if (!taskModalExpanded.value) return;
  event.stopPropagation();
  taskModalExpanded.value = false;
}

function onEventDetailModalEscape(event: KeyboardEvent) {
  if (!eventDetailModalExpanded.value) return;
  event.stopPropagation();
  eventDetailModalExpanded.value = false;
}

function onResearchModalEscape(event: KeyboardEvent) {
  if (!researchModalExpanded.value) return;
  event.stopPropagation();
  researchModalExpanded.value = false;
}

function openTaskModal(preselectedDate?: Date) {
  editingTask.value = false;
  editingEventId.value = "";
  taskPostError.value = null;
  taskModalExpanded.value = false;
  resetTaskAssignAiPanelState();
  taskForm.value = {
    title: "",
    description: "",
    startDate: preselectedDate ? formatDateKey(preselectedDate) : "",
    endDate: preselectedDate ? formatDateKey(preselectedDate) : "",
    startTime: "",
    endTime: "",
    researchId: "",
  };
  showTaskModal.value = true;
}

function closeTaskModal() {
  showTaskModal.value = false;
  editingTask.value = false;
  editingEventId.value = "";
  taskPostError.value = null;
  submittingTaskPost.value = false;
  taskModalExpanded.value = false;
  resetTaskAssignAiPanelState();
}

function openResearchModal(preselectedDate?: Date) {
  editingResearch.value = false;
  editingEventId.value = "";
  researchPostError.value = null;
  researchModalExpanded.value = false;
  researchForm.value = {
    title: "",
    description: "",
    startDate: preselectedDate ? formatDateKey(preselectedDate) : "",
    endDate: preselectedDate ? formatDateKey(preselectedDate) : "",
    startTime: "",
    endTime: "",
  };
  showResearchModal.value = true;
}

function closeResearchModal() {
  showResearchModal.value = false;
  editingResearch.value = false;
  editingEventId.value = "";
  researchPostError.value = null;
  submittingResearchPost.value = false;
  researchModalExpanded.value = false;
}

function closeEventDetail() {
  selectedEvent.value = null;
  eventDetailModalExpanded.value = false;
  closeTaskAssignAiPanel();
}

function openEventDetail(event: CalendarEvent) {
  closeTaskAssignAiPanel();
  eventDetailModalExpanded.value = false;
  selectedEvent.value = event;
}

function editEvent(event: CalendarEvent) {
  selectedEvent.value = null;
  editingEventId.value = event.id;

  if (event.type === "task") {
    resetTaskAssignAiPanelState();
    taskModalExpanded.value = false;
    editingTask.value = true;
    taskForm.value = {
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
      researchId: event.researchId?.toString() || "",
    };
    showTaskModal.value = true;
  } else {
    editingResearch.value = true;
    researchForm.value = {
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
    };
    showResearchModal.value = true;
  }
}

function deleteEvent(event: CalendarEvent) {
  if (confirm("¿Estás seguro de que deseas eliminar este evento?")) {
    events.value = events.value.filter((e) => e.id !== event.id);
    syncSummaryFromEvents();
    selectedEvent.value = null;
  }
}

// Save functions
async function saveTask() {
  if (dateError.value || taskTimeValidationError.value) return;
  taskPostError.value = null;

  const research = researchList.value.find(
    (r) => String(r.id) === String(taskForm.value.researchId),
  );
  const researchIdNumeric = parseNumericResearchId(taskForm.value.researchId);
  /** Sin id numérico (p. ej. UUID): association null conforme al contrato JSON del doc. */
  const researchNameForPayload =
    researchIdNumeric !== null ? (research?.name ?? "").trim() || null : null;

  const eventDraft = {
    type: "task" as const,
    title: taskForm.value.title.trim(),
    description: (taskForm.value.description || "").trim(),
    date: taskForm.value.startDate,
    startDate: taskForm.value.startDate,
    endDate: taskForm.value.endDate,
    startTime: taskForm.value.startTime,
    endTime: taskForm.value.endTime,
    researchId: researchIdNumeric,
    researchName: researchNameForPayload,
  };

  const newEventLocalOnly: CalendarEvent = mapPostBodyToCalendarEvent(
    {
      ...eventDraft,
      id: editingEventId.value || undefined,
    },
    editingEventId.value || `task-${Date.now()}`,
  );

  if (editingEventId.value) {
    const index = events.value.findIndex((e) => e.id === editingEventId.value);
    if (index !== -1) {
      events.value[index] = {
        ...newEventLocalOnly,
        id: editingEventId.value,
      };
    }
    syncSummaryFromEvents();
    closeTaskModal();
    return;
  }

  if (!isTaskFormValid.value) return;

  if (
    researchIdNumeric !== null &&
    (!research?.name || !String(research.name).trim())
  ) {
    taskPostError.value =
      "La investigación asociada debe tener nombre para este payload.";
    return;
  }

  const clientErr = validateCalendarEventsPostBody(eventDraft);
  if (clientErr) {
    taskPostError.value = clientErr;
    return;
  }

  submittingTaskPost.value = true;
  try {
    await axios.post<unknown>(CALENDAR_EVENTS_API, eventDraft);
    closeTaskModal();
    await fetchCalendarSummaryForMonth();
  } catch (err) {
    taskPostError.value = readAxiosErrorMessage(err);
  } finally {
    submittingTaskPost.value = false;
  }
}

async function saveResearch() {
  researchPostError.value = null;
  if (researchDateError.value || researchTimeValidationError.value) return;

  const eventDraft: CalendarEventsPostBody = {
    type: "research",
    title: researchForm.value.title.trim(),
    description: (researchForm.value.description || "").trim(),
    date: researchForm.value.startDate,
    startDate: researchForm.value.startDate,
    endDate: researchForm.value.endDate,
    startTime: researchForm.value.startTime,
    endTime: researchForm.value.endTime,
    researchId: null,
    researchName: null,
  };

  const fallbackId = editingEventId.value || `research-${Date.now()}`;
  const newEventLocalOnly = mapPostBodyToCalendarEvent(
    {
      ...eventDraft,
      id: editingEventId.value || undefined,
    },
    fallbackId,
  );

  if (editingEventId.value) {
    const index = events.value.findIndex((e) => e.id === editingEventId.value);
    if (index !== -1) {
      events.value[index] = {
        ...newEventLocalOnly,
        id: editingEventId.value,
      };
    }
    syncSummaryFromEvents();
    closeResearchModal();
    return;
  }

  if (!isResearchFormValid.value) return;

  const clientErr = validateCalendarEventsPostBody(eventDraft);
  if (clientErr) {
    researchPostError.value = clientErr;
    return;
  }

  submittingResearchPost.value = true;
  try {
    await axios.post<unknown>(CALENDAR_EVENTS_API, eventDraft);
    closeResearchModal();
    await fetchCalendarSummaryForMonth();
  } catch (err) {
    researchPostError.value = readAxiosErrorMessage(err);
  } finally {
    submittingResearchPost.value = false;
  }
}

function buildTaskAssignmentAIPrompt(event: CalendarEvent): string {
  const research =
    event.researchId != null
      ? researchList.value.find(
          (r) => String(r.id) === String(event.researchId),
        )
      : event.researchName
        ? researchList.value.find((r) => r.name === event.researchName)
        : undefined;

  const inv = research
    ? `Investigación asociada: «${research.name}». ${research.description ? `Contexto: ${research.description}` : ""}`
    : event.researchName
      ? `Investigación asociada: «${event.researchName}».`
      : "Sin investigación asociada (mantén coherencia con salud auditiva).";

  const today = formatDateKey(new Date());
  const { start, end } = getEventRangeBounds(event);

  return `Eres un asistente experto en salud auditiva e investigación clínica.

Refina y asigna esta tarea ya existente en el calendario de investigaciones (mejora título, descripción, fechas y horario si procede).
${inv}
Fecha de referencia (hoy): ${today}.

Tarea actual:
- Título: ${event.title}
- Descripción: ${event.description || "(sin descripción)"}
`;
}

function normalizeTaskAssignmentProposal(
  raw: unknown,
): TaskAssignmentProposal | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;
  const title = typeof p.title === "string" ? p.title.trim() : "";
  const description =
    typeof p.description === "string" ? p.description.trim() : "";
  const startDate = typeof p.startDate === "string" ? p.startDate.trim() : "";
  const endDate = typeof p.endDate === "string" ? p.endDate.trim() : "";
  const startTime = typeof p.startTime === "string" ? p.startTime.trim() : "";
  const endTime = typeof p.endTime === "string" ? p.endTime.trim() : "";

  if (
    !title ||
    !ISO_DATE_RE.test(startDate) ||
    !ISO_DATE_RE.test(endDate) ||
    !TIME_HM_RE.test(startTime) ||
    !TIME_HM_RE.test(endTime) ||
    startDate > endDate
  ) {
    return null;
  }

  return { title, description, startDate, endDate, startTime, endTime };
}

function buildAssignmentReportFromProposal(
  assignment: TaskAssignmentProposal,
): string {
  return `## Resumen de la propuesta

La IA sugiere actualizar la tarea con el siguiente plan.

## Propuesta de fechas y horario

- **Inicio:** ${assignment.startDate} a las ${assignment.startTime}
- **Fin:** ${assignment.endDate} a las ${assignment.endTime}

## Detalle

**${assignment.title}**

${assignment.description || "_Sin descripción adicional._"}`;
}

function normalizeTaskAssignmentFindings(
  raw: unknown,
): TaskAssignmentFinding[] {
  if (!Array.isArray(raw)) return [];
  const out: TaskAssignmentFinding[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const f = item as Record<string, unknown>;
    const title = typeof f.title === "string" ? f.title.trim() : "";
    const description =
      typeof f.description === "string" ? f.description.trim() : "";
    if (!title) continue;
    const sev = f.severity;
    const severity =
      sev === "critical" || sev === "warning" || sev === "info"
        ? sev
        : "warning";
    out.push({ severity, title, description: description || title });
  }
  return out;
}

function parseTaskAssignmentAIResponse(
  raw: string,
): TaskAssignmentAIEnvelope | null {
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  try {
    const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
    const findings = normalizeTaskAssignmentFindings(parsed.findings);

    if (parsed.assignment && typeof parsed.reportMarkdown === "string") {
      const assignment = normalizeTaskAssignmentProposal(parsed.assignment);
      const reportMarkdown = parsed.reportMarkdown.trim();
      if (!assignment || !reportMarkdown) return null;
      return { reportMarkdown, assignment, findings };
    }

    const legacy = normalizeTaskAssignmentProposal(parsed);
    if (!legacy) return null;
    return {
      reportMarkdown: buildAssignmentReportFromProposal(legacy),
      assignment: legacy,
      findings,
    };
  } catch {
    return null;
  }
}

function mapFindingToNotificationType(
  severity: TaskAssignmentFinding["severity"],
): "info" | "warning" | "error" {
  if (severity === "critical") return "error";
  if (severity === "warning") return "warning";
  return "info";
}

function publishTaskAssignmentFindings(
  findings: TaskAssignmentFinding[],
  eventTitle: string,
) {
  if (!findings.length) return;

  for (const finding of findings) {
    const type = mapFindingToNotificationType(finding.severity);
    const title = `Hallazgo IA — ${eventTitle}`;
    const message = `${finding.title}${finding.description ? `: ${finding.description}` : ""}`;

    notificationsStore.add({
      title,
      message,
      type,
      scheduledFor: new Date().toISOString(),
    });
    push[type]({ title, message });
  }
}

async function fetchTaskAssignmentEnvelope(
  event: CalendarEvent,
): Promise<TaskAssignmentAIEnvelope> {
  const prompt = buildTaskAssignmentAIPrompt(event);
  const result = await useGetGenerativeModelGP(prompt);
  const envelope = parseTaskAssignmentAIResponse(result ?? "");
  if (!envelope) {
    throw new Error(
      "No se pudo interpretar la propuesta de la IA. Intenta de nuevo.",
    );
  }
  return envelope;
}

function applyTaskAssignmentToEvent(
  eventId: string,
  assignment: TaskAssignmentProposal,
): CalendarEvent | null {
  const idx = events.value.findIndex((e) => e.id === eventId);
  const base = idx !== -1 ? events.value[idx] : selectedEvent.value;
  if (!base) return null;

  const updated: CalendarEvent = {
    ...base,
    title: assignment.title,
    description: assignment.description,
    date: assignment.startDate,
    startDate: assignment.startDate,
    endDate: assignment.endDate,
    startTime: assignment.startTime,
    endTime: assignment.endTime,
  };

  if (idx !== -1) events.value[idx] = updated;
  if (selectedEvent.value?.id === eventId) selectedEvent.value = updated;
  syncSummaryFromEvents();
  return updated;
}

function assignTaskFromDetailWithAI() {
  const event = selectedEvent.value;
  if (!event || event.type !== "task") return;
  taskAssignModeDialogEvent.value = event;
  taskAssignModeDialogOpen.value = true;
}

function closeTaskAssignModeDialog() {
  taskAssignModeDialogOpen.value = false;
  taskAssignModeDialogEvent.value = null;
}

function onTaskAssignModeSelected(mode: TaskAssignmentExecutionMode) {
  const event = taskAssignModeDialogEvent.value;
  closeTaskAssignModeDialog();
  if (!event) return;

  if (mode === "instant") {
    void runTaskAssignmentAI(event);
    return;
  }

  void registerScheduledTaskAssignment(event);
}

async function registerScheduledTaskAssignment(event: CalendarEvent) {
  const { start, end } = getEventRangeBounds(event);

  calendarTaskAiScheduleStore.upsertJob({
    calendarEventId: event.id,
    eventTitle: event.title,
    startDate: start,
    endDate: end,
    researchName: event.researchName ?? null,
    eventType: "task",
    researchDraft: null,
  });

  const rangeLabel = formatDateRange(start, end);
  const title = "Asignación IA programada";
  const message = `Seguimiento activo de «${event.title}» del ${rangeLabel}. Los hallazgos aparecerán en notificaciones.`;

  notificationsStore.add({
    title,
    message,
    type: "info",
    scheduledFor: new Date().toISOString(),
  });
  push.info({ title, message });

  const today = formatDateKey(new Date());
  if (today >= start && today <= end) {
    await runScheduledTaskAiCheckForEvent(event.id);
  }
}

function buildResearchDraftSnapshot(): CalendarResearchDraftSnapshot | null {
  if (!isResearchFormValid.value) return null;
  return {
    title: researchForm.value.title.trim(),
    description: (researchForm.value.description || "").trim(),
    startDate: researchForm.value.startDate,
    endDate: researchForm.value.endDate,
    startTime: researchForm.value.startTime,
    endTime: researchForm.value.endTime,
  };
}

function buildSummaryRowFromResearchForm(): CalendarSummaryTableRow | null {
  const draft = buildResearchDraftSnapshot();
  if (!draft) return null;
  return {
    id: editingEventId.value || `draft-research-${Date.now()}`,
    type: "research",
    title: draft.title,
    startDate: draft.startDate,
    endDate: draft.endDate,
    researchName: null,
    researchId: null,
  };
}

function buildSummaryRowFromCalendarEvent(
  event: CalendarEvent,
): CalendarSummaryTableRow {
  const { start, end } = getEventRangeBounds(event);
  return {
    id: event.id,
    type: event.type,
    title: event.title,
    startDate: start,
    endDate: end,
    researchName: event.researchName ?? null,
    researchId: event.researchId ?? null,
  };
}

function buildResearchMonitoringAIPrompt(
  row: CalendarSummaryTableRow,
  extras?: { description?: string; startTime?: string; endTime?: string },
): string {
  const desc = extras?.description?.trim() || "(sin descripción)";
  const schedule =
    extras?.startTime && extras?.endTime
      ? `${extras.startTime} – ${extras.endTime}`
      : "—";

  return `Eres un asistente experto en salud auditiva e investigación clínica.

Analiza este bloque de investigación en el calendario y propón seguimiento claro para el equipo.

Datos:
- Título: ${row.title}
- Descripción: ${desc}
- Horario: ${schedule}`;
}

function parseResearchMonitoringAIResponse(
  raw: string,
): ResearchMonitoringAIEnvelope | null {
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    if (trimmed.length < 40) return null;
    return { reportMarkdown: trimmed, findings: [] };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
    const reportMarkdown =
      typeof parsed.reportMarkdown === "string"
        ? parsed.reportMarkdown.trim()
        : trimmed;
    if (!reportMarkdown) return null;
    return {
      reportMarkdown,
      findings: normalizeTaskAssignmentFindings(parsed.findings),
    };
  } catch {
    if (trimmed.length < 40) return null;
    return { reportMarkdown: trimmed, findings: [] };
  }
}

async function fetchResearchMonitoringEnvelope(
  row: CalendarSummaryTableRow,
  extras?: { description?: string; startTime?: string; endTime?: string },
): Promise<ResearchMonitoringAIEnvelope> {
  const prompt = buildResearchMonitoringAIPrompt(row, extras);
  const result = await useGetGenerativeModelGP(prompt);
  const envelope = parseResearchMonitoringAIResponse(result ?? "");
  if (!envelope) {
    throw new Error(
      "No se pudo interpretar el análisis de investigación de la IA.",
    );
  }
  return envelope;
}

function publishResearchFindings(
  findings: TaskAssignmentFinding[],
  eventTitle: string,
) {
  if (!findings.length) return;

  for (const finding of findings) {
    const type = mapFindingToNotificationType(finding.severity);
    const title = `Hallazgo IA — Investigación: ${eventTitle}`;
    const message = `${finding.title}${finding.description ? `: ${finding.description}` : ""}`;
    notificationsStore.add({
      title,
      message,
      type,
      scheduledFor: new Date().toISOString(),
    });
    push[type]({ title, message });
  }
}

async function runResearchInstantAI(
  row: CalendarSummaryTableRow,
  extras?: { description?: string; startTime?: string; endTime?: string },
) {
  researchAiFormLoading.value = true;
  researchAiFormError.value = null;
  aiPanelEvent.value = row;
  aiPanelOpen.value = true;
  aiPanelLoading.value = true;
  aiPanelError.value = null;
  aiPanelContent.value = "";
  resetAISaveState();
  aiAnalyzingId.value = row.id;

  try {
    const envelope = await fetchResearchMonitoringEnvelope(row, extras);
    aiPanelContent.value = envelope.reportMarkdown;
    aiGeneratedAt.value = new Date();
  } catch (err) {
    console.error("[runResearchInstantAI]", err);
    aiPanelError.value =
      readAxiosErrorMessage(err) ||
      "No se pudo generar el análisis de investigación con IA.";
    aiPanelContent.value = "";
  } finally {
    aiPanelLoading.value = false;
    aiAnalyzingId.value = null;
    researchAiFormLoading.value = false;
  }
}

function runResearchInstantAIFromForm() {
  const row = buildSummaryRowFromResearchForm();
  if (!row) {
    researchAiFormError.value =
      "Complete título, fechas y horario antes de usar la IA.";
    return;
  }
  const draft = buildResearchDraftSnapshot();
  void runResearchInstantAI(row, {
    description: draft?.description,
    startTime: draft?.startTime,
    endTime: draft?.endTime,
  });
}

function runResearchInstantAIFromEvent(event: CalendarEvent) {
  if (event.type !== "research") return;
  const row = buildSummaryRowFromCalendarEvent(event);
  void runResearchInstantAI(row, {
    description: event.description,
    startTime: event.startTime,
    endTime: event.endTime,
  });
}

async function registerScheduledResearchAI(event: CalendarEvent) {
  if (event.type !== "research") return;
  const { start, end } = getEventRangeBounds(event);

  calendarTaskAiScheduleStore.upsertJob({
    calendarEventId: event.id,
    eventTitle: event.title,
    startDate: start,
    endDate: end,
    researchName: event.researchName ?? null,
    eventType: "research",
    researchDraft: {
      title: event.title,
      description: event.description || "",
      startDate: event.startDate,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
    },
  });

  const rangeLabel = formatDateRange(start, end);
  const title = "Investigación IA programada";
  const message = `Seguimiento de «${event.title}» del ${rangeLabel}. Los hallazgos se publicarán en notificaciones.`;

  notificationsStore.add({
    title,
    message,
    type: "info",
    scheduledFor: new Date().toISOString(),
  });
  push.info({ title, message });

  const today = formatDateKey(new Date());
  if (today >= start && today <= end) {
    const job = calendarTaskAiScheduleStore.jobs.find(
      (j) => j.calendarEventId === event.id,
    );
    if (job) await runScheduledCalendarAiCheckForJob(job);
  }
}

async function registerScheduledResearchAIFromForm() {
  const row = buildSummaryRowFromResearchForm();
  const draft = buildResearchDraftSnapshot();
  if (!row || !draft) {
    researchAiFormError.value =
      "Complete título, fechas y horario antes de programar la IA.";
    return;
  }
  researchAiFormError.value = null;

  calendarTaskAiScheduleStore.upsertJob({
    calendarEventId: row.id,
    eventTitle: row.title,
    startDate: draft.startDate,
    endDate: draft.endDate,
    researchName: null,
    eventType: "research",
    researchDraft: draft,
  });

  const rangeLabel = formatDateRange(draft.startDate, draft.endDate);
  const title = "Investigación IA programada";
  const message = `Seguimiento de «${draft.title}» del ${rangeLabel}. Los hallazgos se publicarán en notificaciones.`;

  notificationsStore.add({
    title,
    message,
    type: "info",
    scheduledFor: new Date().toISOString(),
  });
  push.info({ title, message });

  const today = formatDateKey(new Date());
  if (today >= draft.startDate && today <= draft.endDate) {
    const job = calendarTaskAiScheduleStore.jobs.find(
      (j) => j.calendarEventId === row.id,
    );
    if (job) await runScheduledCalendarAiCheckForJob(job);
  }
}

function resolveCalendarEventFromJob(
  job: CalendarTaskAiScheduleJob,
): CalendarEvent | null {
  const fromList = events.value.find((e) => e.id === job.calendarEventId);
  if (fromList) return fromList;
  if (selectedEvent.value?.id === job.calendarEventId) {
    return selectedEvent.value;
  }
  if (job.eventType === "research" && job.researchDraft) {
    const d = job.researchDraft;
    return {
      id: job.calendarEventId,
      type: "research",
      title: d.title,
      description: d.description,
      date: d.startDate,
      startDate: d.startDate,
      endDate: d.endDate,
      startTime: d.startTime,
      endTime: d.endTime,
    };
  }
  return null;
}

async function runScheduledCalendarAiCheckForJob(
  job: CalendarTaskAiScheduleJob,
) {
  const today = formatDateKey(new Date());
  if (today < job.startDate || today > job.endDate) return;
  if (job.lastRunDate === today) return;

  const eventType = job.eventType ?? "task";
  const event = resolveCalendarEventFromJob(job);
  if (!event) return;

  try {
    if (eventType === "research") {
      const row = buildSummaryRowFromCalendarEvent(event);
      const envelope = await fetchResearchMonitoringEnvelope(row, {
        description: event.description,
        startTime: event.startTime,
        endTime: event.endTime,
      });
      calendarTaskAiScheduleStore.markRunToday(job.id, today);
      publishResearchFindings(envelope.findings, event.title);

      if (envelope.findings.length > 0) {
        const payload: CreateCalendarAiAnalysisPayload = {
          calendarEventId: event.id,
          researchId: null,
          eventTitle: event.title,
          eventType: "research",
          eventDate: row.startDate,
          eventEndDate: row.endDate,
          researchName: null,
          content: envelope.reportMarkdown,
          generatedAt: new Date().toISOString(),
          analysisType: "task_assignment",
          assignmentProposal: null,
          findings: envelope.findings,
        };
        await postCalendarAiAnalysis(payload).catch((err) =>
          console.warn("[scheduledResearchAi save]", err),
        );
      }
      return;
    }

    if (event.type !== "task") return;

    const envelope = await fetchTaskAssignmentEnvelope(event);
    calendarTaskAiScheduleStore.markRunToday(job.id, today);
    publishTaskAssignmentFindings(envelope.findings, event.title);

    if (envelope.findings.length > 0) {
      await postCalendarAiAnalysis(
        buildTaskAssignmentAnalysisPayload(event, envelope, new Date()),
      ).catch((err) => console.warn("[scheduledTaskAi save]", err));
    }
  } catch (err) {
    console.error("[runScheduledCalendarAiCheckForJob]", err);
    const errTitle =
      eventType === "research"
        ? "Error en seguimiento IA de investigación"
        : "Error en seguimiento IA programado";
    const errMsg =
      readAxiosErrorMessage(err) ||
      `No se pudo analizar «${job.eventTitle}» hoy.`;
    notificationsStore.add({
      title: errTitle,
      message: errMsg,
      type: "error",
      scheduledFor: new Date().toISOString(),
    });
    push.error({ title: errTitle, message: errMsg });
  }
}

async function runScheduledTaskAiCheckForEvent(calendarEventId: string) {
  const job = calendarTaskAiScheduleStore.jobs.find(
    (j) => j.calendarEventId === calendarEventId,
  );
  if (!job) return;
  await runScheduledCalendarAiCheckForJob(job);
}

async function processScheduledTaskAiJobs() {
  const today = formatDateKey(new Date());
  calendarTaskAiScheduleStore.pruneExpired(today);

  for (const job of [...calendarTaskAiScheduleStore.jobs]) {
    if (today < job.startDate || today > job.endDate) continue;
    if (job.lastRunDate === today) continue;
    await runScheduledCalendarAiCheckForJob(job);
  }
}

function startTaskAiSchedulePolling() {
  if (taskAiScheduleIntervalId) return;
  void processScheduledTaskAiJobs();
  taskAiScheduleIntervalId = setInterval(() => {
    void processScheduledTaskAiJobs();
  }, 60_000);
}

function stopTaskAiSchedulePolling() {
  if (taskAiScheduleIntervalId) {
    clearInterval(taskAiScheduleIntervalId);
    taskAiScheduleIntervalId = null;
  }
}

function closeTaskAssignAiPanel() {
  taskAssignAiPanelOpen.value = false;
  taskAssignAiPanelEvent.value = null;
  resetTaskAssignAiPanelState();
}

function buildTaskAssignmentAnalysisPayload(
  event: CalendarEvent,
  envelope: TaskAssignmentAIEnvelope,
  generatedAt: Date,
): CreateCalendarAiAnalysisPayload {
  const { start, end } = getEventRangeBounds(event);
  return {
    calendarEventId: event.id,
    researchId: event.researchId ?? null,
    eventTitle: event.title,
    eventType: "task",
    eventDate: start,
    eventEndDate: end,
    researchName: event.researchName ?? null,
    content: envelope.reportMarkdown,
    generatedAt: generatedAt.toISOString(),
    analysisType: "task_assignment",
    assignmentProposal: envelope.assignment,
    findings: envelope.findings.length ? envelope.findings : null,
  };
}

async function runTaskAssignmentAI(event: CalendarEvent) {
  taskAssignAiPanelEvent.value = event;
  taskAssignAiPanelOpen.value = true;
  taskAssignAiPanelLoading.value = true;
  taskAssignAiPanelError.value = null;
  taskAssignAiPanelContent.value = "";
  taskAssignAiAssignment.value = null;
  taskAssignAiGeneratedAt.value = null;
  taskAssignAiSaveError.value = null;
  taskAssignAiSaveSuccess.value = false;
  taskAssignAiApplied.value = false;

  try {
    const envelope = await fetchTaskAssignmentEnvelope(event);
    taskAssignAiPanelContent.value = envelope.reportMarkdown;
    taskAssignAiAssignment.value = envelope.assignment;
    taskAssignAiFindings.value = envelope.findings;
    taskAssignAiGeneratedAt.value = new Date();

    if (envelope.findings.length > 0) {
      publishTaskAssignmentFindings(envelope.findings, event.title);
    }
  } catch (err) {
    console.error("[runTaskAssignmentAI]", err);
    taskAssignAiPanelError.value =
      readAxiosErrorMessage(err) ||
      "No se pudo generar la asignación con IA. Intenta de nuevo.";
  } finally {
    taskAssignAiPanelLoading.value = false;
  }
}

function regenerateTaskAssignAi() {
  const event = taskAssignAiPanelEvent.value;
  if (event) void runTaskAssignmentAI(event);
}

async function saveTaskAssignmentAIAnalysis() {
  const event = taskAssignAiPanelEvent.value;
  const assignment = taskAssignAiAssignment.value;
  const content = taskAssignAiPanelContent.value?.trim();
  if (!event || !assignment || !content) return;

  taskAssignAiSaving.value = true;
  taskAssignAiSaveError.value = null;
  taskAssignAiSaveSuccess.value = false;

  try {
    const payload = buildTaskAssignmentAnalysisPayload(
      event,
      {
        reportMarkdown: content,
        assignment,
        findings: taskAssignAiFindings.value,
      },
      taskAssignAiGeneratedAt.value ?? new Date(),
    );
    await postCalendarAiAnalysis(payload);
    taskAssignAiSaveSuccess.value = true;
  } catch (err) {
    console.error("[saveTaskAssignmentAIAnalysis]", err);
    taskAssignAiSaveError.value =
      readAxiosErrorMessage(err) ||
      "No se pudo guardar el análisis de asignación. Intenta de nuevo.";
  } finally {
    taskAssignAiSaving.value = false;
  }
}

function applyTaskAssignmentFromPanel() {
  const event = taskAssignAiPanelEvent.value;
  const assignment = taskAssignAiAssignment.value;
  if (!event || !assignment) return;

  const updated = applyTaskAssignmentToEvent(event.id, assignment);
  if (updated) {
    taskAssignAiApplied.value = true;
    taskAssignAiPanelEvent.value = updated;
  }
}

function buildCalendarEventAIPrompt(event: CalendarSummaryTableRow): string {
  const tipo =
    event.type === "task"
      ? "Tarea especial del calendario"
      : "Bloque de investigación en calendario";
  const inv = event.researchName
    ? `Investigación asociada: ${event.researchName}.`
    : "Sin investigación asociada.";

  return `
    Eres un asistente especializado en investigación académica y salud.
Redacta un informe estructurado en español a partir del siguiente evento.

## Datos del evento
- **Tipo:** ${tipo}
- **Título:** ${event.title}
- **Fechas:** ${formatDateRange(event.startDate, event.endDate)}
- **Detalles:** ${inv}

## Formato de salida requerido
Usa exactamente estas secciones:

### Resumen ejecutivo
[7-14 oraciones que respondan: qué es, quién lo hace y para qué.]

### Objetivos
[Lista de 7-14 puntos concisos.]

### Metodología
[7-14 oraciones que describan el enfoque, herramientas o fases clave.]

### Resultados o entregables esperados
[7-14 oraciones que describan los resultados o entregables esperados.]

### Relevancia
[Por qué importa este evento en su área: salud o educación.]

## Instrucciones adicionales
- Usa lenguaje técnico pero accesible.
- Evita párrafos densos: prefiere listas y secciones cortas.
- Si falta información, indícalo con: [Dato no disponible].
- Extensión total: máximo 500 palabras.
- Dejar recuadros de color para las secciones.
- Dejar los recursos bibliográficos al final del informe.
  `;
}

function resetAISaveState() {
  aiSaving.value = false;
  aiSaveError.value = null;
  aiSaveSuccess.value = false;
}

async function runAIAnalysisForEvent(
  event: CalendarSummaryTableRow,
  customPrompt?: string,
) {
  aiPanelEvent.value = event;
  aiPanelOpen.value = true;
  aiPanelLoading.value = true;
  aiPanelError.value = null;
  aiPanelContent.value = "";
  resetAISaveState();
  aiAnalyzingId.value = event.id;

  try {
    const prompt = customPrompt ?? buildCalendarEventAIPrompt(event);
    const result = await useGetGenerativeModelGP(prompt);
    aiPanelContent.value =
      result?.trim() || "No se recibió contenido del modelo de IA.";
    aiGeneratedAt.value = new Date();
  } catch (err) {
    console.error("[analyzeEventWithAI]", err);
    aiPanelError.value =
      readAxiosErrorMessage(err) ||
      "No se pudo generar el análisis. Intenta de nuevo.";
    aiPanelContent.value = "";
  } finally {
    aiPanelLoading.value = false;
    aiAnalyzingId.value = null;
  }
}

function analyzeEventWithAI(event: CalendarSummaryTableRow) {
  void runAIAnalysisForEvent(event);
}

function closeAIPanel() {
  aiPanelOpen.value = false;
  aiPanelLoading.value = false;
  aiAnalyzingId.value = null;
  resetAISaveState();
}

function regenerateAIAnalysis() {
  if (aiPanelEvent.value) {
    void runAIAnalysisForEvent(aiPanelEvent.value);
  }
}

async function saveAIAnalysis() {
  const event = aiPanelEvent.value;
  const content = aiPanelContent.value?.trim();
  if (!event || !content) return;

  aiSaving.value = true;
  aiSaveError.value = null;
  aiSaveSuccess.value = false;

  try {
    const payload: CreateCalendarAiAnalysisPayload = {
      calendarEventId: event.id,
      researchId: event.researchId ?? null,
      eventTitle: event.title,
      eventType: event.type,
      eventDate: event.startDate,
      eventEndDate: event.endDate,
      researchName: event.researchName,
      content,
      generatedAt:
        aiGeneratedAt.value?.toISOString() ?? new Date().toISOString(),
      analysisType: "event_review",
      assignmentProposal: null,
      findings: null,
    };

    await postCalendarAiAnalysis(payload);
    aiSaveSuccess.value = true;
  } catch (err) {
    console.error("[saveAIAnalysis]", err);
    aiSaveError.value =
      readAxiosErrorMessage(err) ||
      "No se pudo guardar el análisis. Intenta de nuevo.";
  } finally {
    aiSaving.value = false;
  }
}

// API functions
async function fetchResearch() {
  try {
    const response = await axios.get("http://localhost:3000/api/v1/research");
    researchList.value = [...response.data];
    researchError.value = false;
  } catch (error: any) {
    if (error.response?.status === 404) {
      researchError.value = true;
    }
    console.error("Error fetching research:", error);
  }
}

// Lifecycle
watch(currentDate, () => {
  summaryMonthSearchQuery.value = "";
  summaryMonthTypeFilter.value = "all";
  void fetchCalendarSummaryForMonth();
});

onMounted(async () => {
  await fetchResearch();
  await fetchCalendarSummaryForMonth();
  startTaskAiSchedulePolling();
});

onUnmounted(() => {
  stopTaskAiSchedulePolling();
});
</script>

<style scoped>
.task-z-trail-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.task-z-trail-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
}

.task-z-trail-item--active {
  color: #6d28d9;
}

.task-z-trail-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.375rem;
  height: 1.375rem;
  border-radius: 9999px;
  background: #ede9fe;
  color: #6d28d9;
  font-size: 0.6875rem;
  font-weight: 800;
}

.task-z-trail-item--active .task-z-trail-dot {
  background: #7c3aed;
  color: #fff;
}

.task-z-trail-connector {
  width: 1.5rem;
  height: 1px;
  background: linear-gradient(90deg, #c4b5fd, #e5e7eb);
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .task-z-trail-connector {
    width: 2.5rem;
  }
}

.task-z-section {
  position: relative;
}

.task-z-heading {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 1rem;
}

.task-z-step {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.5rem;
  background: #7c3aed;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 800;
  flex-shrink: 0;
}

.task-z-section + .task-z-section::before {
  content: "";
  display: block;
  height: 1px;
  background: linear-gradient(90deg, #e9d5ff 0%, #e5e7eb 40%, transparent 100%);
  margin-bottom: 2rem;
}

/* Sección «Cuándo»: refuerzo visual del tramo diagonal del Z */
.task-z-section--when::after {
  content: "";
  pointer-events: none;
  position: absolute;
  top: 2.5rem;
  left: 12%;
  right: 12%;
  height: 3rem;
  background: linear-gradient(
    118deg,
    transparent 0%,
    rgba(167, 139, 250, 0.12) 45%,
    transparent 70%
  );
  border-radius: 0.5rem;
  z-index: 0;
}

.task-z-section--when > * {
  position: relative;
  z-index: 1;
}
</style>

<style>
/* Fade suave en modales del calendario (sin deslizamiento ni escala) */
.app-modal-fade-enter-active,
.app-modal-fade-leave-active {
  transition: opacity 280ms ease;
}

.app-modal-fade-enter-from,
.app-modal-fade-leave-to {
  opacity: 0;
}

.app-modal-fade-enter-active .app-modal-backdrop,
.app-modal-fade-leave-active .app-modal-backdrop {
  transition: opacity 280ms ease;
}

.app-modal-fade-enter-from .app-modal-backdrop,
.app-modal-fade-leave-to .app-modal-backdrop {
  opacity: 0;
}

.app-modal-fade-enter-active .app-modal-panel,
.app-modal-fade-leave-active .app-modal-panel {
  transition: opacity 300ms ease;
}

.app-modal-fade-enter-from .app-modal-panel,
.app-modal-fade-leave-to .app-modal-panel {
  opacity: 0;
  transform: none;
}

@media (max-width: 639px) {
  .app-modal-fade-enter-from .app-modal-panel--sheet,
  .app-modal-fade-leave-to .app-modal-panel--sheet {
    opacity: 0;
    transform: none;
  }
}
</style>
