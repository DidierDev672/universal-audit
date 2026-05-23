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

      <!-- Calendar Grid -->
      <div class="grid grid-cols-7 gap-2">
        <!-- Weekday Headers -->
        <div
          v-for="day in weekdays"
          :key="day"
          class="text-center py-2 font-semibold text-gray-500 text-sm uppercase tracking-wider"
        >
          {{ day }}
        </div>

        <!-- Calendar Days -->
        <div
          v-for="date in calendarDays"
          :key="date.dateString"
          @click="date.isCurrentMonth && openTaskModal(date.date)"
          :class="[
            'min-h-[120px] p-2 rounded-xl border-2 transition-all cursor-pointer',
            date.isCurrentMonth
              ? 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-md'
              : 'bg-gray-50 border-transparent text-gray-400',
            isToday(date.date) && 'ring-2 ring-blue-500 border-blue-500',
          ]"
        >
          <div class="flex items-center justify-between mb-2">
            <span
              :class="[
                'font-semibold w-8 h-8 flex items-center justify-center rounded-lg text-sm',
                isToday(date.date) ? 'bg-blue-500 text-white' : 'text-gray-700',
              ]"
            >
              {{ date.day }}
            </span>
            <span
              v-if="getEventsForDate(date.date).length > 0"
              class="text-xs font-medium text-gray-500"
            >
              {{ getEventsForDate(date.date).length }} eventos
            </span>
          </div>

          <!-- Events on this day -->
          <div class="space-y-1">
            <div
              v-for="event in getEventsForDate(date.date).slice(0, 3)"
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
            <div
              v-if="getEventsForDate(date.date).length > 3"
              class="text-xs text-gray-400 text-center"
            >
              +{{ getEventsForDate(date.date).length - 3 }} más
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Table -->
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
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Día / Fecha
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Tipo
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Título
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Investigación Asociada
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <template v-if="summaryMonthLoading">
              <tr>
                <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                  <span class="inline-flex items-center gap-2 justify-center">
                    <svg
                      class="w-6 h-6 text-blue-600 animate-spin"
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
                    Cargando resumen del mes…
                  </span>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr
                v-for="event in sortedSummaryMonthEvents"
                :key="event.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ formatDate(event.displayDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      event.type === 'task'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700',
                    ]"
                  >
                    {{ event.type === "task" ? "Tarea" : "Investigación" }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ event.title }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ event.researchName || "—" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    type="button"
                    :disabled="aiAnalyzingId === event.id"
                    class="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm transition-all"
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
                    <span class="hidden sm:inline">Analizar IA</span>
                    <span class="sm:hidden">IA</span>
                  </button>
                </td>
              </tr>
              <tr v-if="sortedSummaryMonthEvents.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                  No hay eventos programados para este mes
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Task Modal -->
    <Teleport to="body">
      <Transition name="app-modal">
        <div v-if="showTaskModal" class="app-modal-root" style="z-index: 50">
          <div class="app-modal-backdrop" aria-hidden="true" @click="closeTaskModal" />
          <div class="app-modal-scrim app-modal-scrim--sheet" @click.self="closeTaskModal">
            <div class="app-modal-panel app-modal-panel--sheet bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true" @click.stop>
              <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-800">
                {{ editingTask ? "Editar Tarea" : "Nueva Tarea Especial" }}
              </h3>
              <button
                @click="closeTaskModal"
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

          <form @submit.prevent="saveTask" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Título de la tarea <span class="text-red-500">*</span>
              </label>
              <input
                v-model="taskForm.title"
                type="text"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                placeholder="Ej: Revisar resultados de laboratorio"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"
                >Descripción</label
              >
              <textarea
                v-model="taskForm.description"
                rows="3"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all resize-none"
                placeholder="Descripción opcional de la tarea..."
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de inicio <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="taskForm.startDate"
                  type="date"
                  required
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de fin <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="taskForm.endDate"
                  type="date"
                  required
                  :min="taskForm.startDate"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                  :class="{ 'border-red-300': dateError }"
                />
              </div>
            </div>

            <div
              v-if="dateError"
              class="text-sm text-red-600 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                />
              </svg>
              {{ dateError }}
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Hora de inicio <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="taskForm.startTime"
                  type="time"
                  required
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Hora de fin <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="taskForm.endTime"
                  type="time"
                  required
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>
            </div>

            <div
              v-if="taskTimeValidationError"
              class="text-sm text-red-600 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                />
              </svg>
              {{ taskTimeValidationError }}
            </div>

            <div v-if="taskDuration" class="p-3 bg-purple-50 rounded-xl">
              <span class="text-sm font-medium text-purple-700">
                Duración: {{ taskDuration }}
              </span>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"
                >Investigación asociada</label
              >
              <select
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

            <div
              v-if="taskPostError"
              class="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
            >
              {{ taskPostError }}
            </div>

            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="closeTaskModal"
                :disabled="submittingTaskPost"
                class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-all disabled:opacity-60"
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
                  'flex-1 px-4 py-3 rounded-xl font-medium transition-all inline-flex items-center justify-center gap-2',
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
            </div>
          </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Research Modal -->
    <Teleport to="body">
      <Transition name="app-modal">
        <div v-if="showResearchModal" class="app-modal-root" style="z-index: 50">
          <div class="app-modal-backdrop" aria-hidden="true" @click="closeResearchModal" />
          <div class="app-modal-scrim app-modal-scrim--sheet" @click.self="closeResearchModal">
            <div class="app-modal-panel app-modal-panel--sheet bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true" @click.stop>
              <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-800">
                {{
                  editingResearch
                    ? "Editar Investigación"
                    : "NuevaInvestigación"
                }}
              </h3>
              <button
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

          <form @submit.prevent="saveResearch" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Título de la investigación <span class="text-red-500">*</span>
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
                <label class="block text-sm font-semibold text-gray-700 mb-2">
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
                <label class="block text-sm font-semibold text-gray-700 mb-2">
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
                <label class="block text-sm font-semibold text-gray-700 mb-2">
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
                <label class="block text-sm font-semibold text-gray-700 mb-2">
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
      <Transition name="app-modal">
        <div v-if="selectedEvent" class="app-modal-root" style="z-index: 50">
          <div class="app-modal-backdrop" aria-hidden="true" @click="selectedEvent = null" />
          <div class="app-modal-scrim app-modal-scrim--sheet" @click.self="selectedEvent = null">
            <div class="app-modal-panel app-modal-panel--sheet bg-white rounded-3xl shadow-2xl max-w-md w-full" role="dialog" aria-modal="true" @click.stop>
              <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium',
                  selectedEvent.type === 'task'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700',
                ]"
              >
                {{ selectedEvent.type === "task" ? "Tarea" : "Investigación" }}
              </span>
              <button
                @click="selectedEvent = null"
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

            <h3 class="text-xl font-bold text-gray-800 mb-2">
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
                <span>{{ formatDate(selectedEvent.date) }}</span>
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

            <div class="flex gap-3 mt-6">
              <button
                @click="editEvent(selectedEvent)"
                class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-all flex items-center justify-center gap-2"
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
                @click="deleteEvent(selectedEvent)"
                class="flex-1 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-xl font-medium text-red-700 transition-all flex items-center justify-center gap-2"
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
      :display-date="aiPanelEvent?.displayDate ?? ''"
      :research-name="aiPanelEvent?.researchName ?? null"
      :generated-at="aiGeneratedAt"
      :context-summary="aiContextSummary"
      @close="closeAIPanel"
      @regenerate="regenerateAIAnalysis"
      @save="saveAIAnalysis"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import CalendarAIResearchPanel from "../../components/calendar/CalendarAIResearchPanel.vue";
import { useGetGenerativeModelGP } from "../../shared/service/useGetGenerativeModelGP";

/** Base URL recurso calendar-events (GET con query, POST cuerpo plano). */
const CALENDAR_EVENTS_API = "http://localhost:3000/api/v1/calendar-events";
const CALENDAR_AI_ANALYSES_API =
  "http://localhost:3000/api/v1/calendar-ai-analyses";

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

/** Fila del «Resumen del Mes» cargada desde GET /calendar-events. */
interface CalendarSummaryTableRow {
  id: string;
  type: "task" | "research";
  title: string;
  /** YYYY-MM-DD para la columna Día / Fecha */
  displayDate: string;
  researchName: string | null;
  researchId?: string | number | null;
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

/** Tabla «Resumen del Mes» — datos del servidor. */
const summaryMonthEvents = ref<CalendarSummaryTableRow[]>([]);
const summaryMonthLoading = ref(false);
const summaryMonthError = ref<string | null>(null);

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
  const tipo = ev.type === "task" ? "tarea especial" : "bloque de investigación";
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

const sortedSummaryMonthEvents = computed(() =>
  [...summaryMonthEvents.value].sort(
    (a, b) =>
      new Date(a.displayDate).getTime() -
      new Date(b.displayDate).getTime(),
  ),
);

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

function validateCalendarEventsPostBody(body: CalendarEventsPostBody): string | null {
  const e = body;

  if (e.type !== "task" && e.type !== "research") {
    return "type debe ser task o research";
  }
  if (!e.title.trim()) return "El título del evento es obligatorio";

  const datesOk =
    ISO_DATE_RE.test(e.date) &&
    ISO_DATE_RE.test(e.startDate) &&
    ISO_DATE_RE.test(e.endDate);
  const timesOk =
    TIME_HM_RE.test(e.startTime) && TIME_HM_RE.test(e.endTime);

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
  if (Array.isArray(evs) && evs[0] !== undefined && typeof evs[0] === "object") {
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
  const nameTrim = typeof row.researchName === "string" ? row.researchName.trim() : "";
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
    const msgs = (
      d as { message?: string; path?: (string | number)[] }[]
    ).map((x) => x.message ?? "");
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

/** Normaliza distintos formatos del GET (array plano o `{ events|data }`) y camelCase/snake_case. */
function normalizeCalendarEventsApiResponse(
  payload: unknown,
): CalendarSummaryTableRow[] {
  const rows: CalendarSummaryTableRow[] = [];

  let items: unknown[] = [];
  if (Array.isArray(payload)) {
    items = payload;
  } else if (payload && typeof payload === "object") {
    const o = payload as Record<string, unknown>;
    if (Array.isArray(o.events)) items = o.events;
    else if (Array.isArray(o.data)) items = o.data;
  }

  items.forEach((item, idx) => {
    if (!item || typeof item !== "object") return;
    const r = item as Record<string, unknown>;

    const typeRaw = r.type;
    const type =
      typeRaw === "research"
        ? "research"
        : typeRaw === "task"
          ? "task"
          : null;
    if (!type) return;

    const id =
      typeof r.id === "string" || typeof r.id === "number"
        ? String(r.id)
        : `evt-${idx}`;

    const title =
      typeof r.title === "string" ? r.title : String(r.title ?? "Sin título");

    const rawDateCandidates = [
      r.date,
      r.startDate,
      r.start_date,
    ];
    let rawDate = "";
    for (const c of rawDateCandidates) {
      if (typeof c === "string" && ISO_DATE_RE.test(c)) {
        rawDate = c;
        break;
      }
    }
    if (!rawDate) return;

    let researchName: string | null = null;
    const rn =
      typeof r.researchName === "string"
        ? r.researchName
        : typeof r.research_name === "string"
          ? r.research_name
          : "";
    const trimmedRn = rn.trim();
    if (trimmedRn) researchName = trimmedRn;

    let researchId: string | number | null = null;
    const rid = r.researchId ?? r.research_id;
    if (typeof rid === "string" || typeof rid === "number") {
      researchId = rid;
    }

    rows.push({
      id,
      type,
      title,
      displayDate: rawDate,
      researchName,
      researchId,
    });
  });

  return rows;
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

    summaryMonthEvents.value = normalizeCalendarEventsApiResponse(data);
  } catch (err) {
    summaryMonthEvents.value = [];
    summaryMonthError.value =
      readAxiosErrorMessage(err) || "No se pudieron cargar los eventos del mes.";
    console.error("[fetchCalendarSummaryForMonth]", err);
  } finally {
    summaryMonthLoading.value = false;
  }
}

function formatDateKey(date: Date): string {
  return date.toISOString().split("T")[0] || "";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function getEventsForDate(date: Date): CalendarEvent[] {
  const dateKey = formatDateKey(date);
  return events.value.filter((event) => event.date === dateKey);
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
function openTaskModal(preselectedDate?: Date) {
  editingTask.value = false;
  editingEventId.value = "";
  taskPostError.value = null;
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
}

function openResearchModal(preselectedDate?: Date) {
  editingResearch.value = false;
  editingEventId.value = "";
  researchPostError.value = null;
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
}

function openEventDetail(event: CalendarEvent) {
  selectedEvent.value = event;
}

function editEvent(event: CalendarEvent) {
  selectedEvent.value = null;
  editingEventId.value = event.id;

  if (event.type === "task") {
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
    researchIdNumeric !== null
      ? (research?.name ?? "").trim() || null
      : null;

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
    const { data } = await axios.post<unknown>(
      CALENDAR_EVENTS_API,
      eventDraft,
    );
    const apiPayload = extractCreatedCalendarEventPayload(data);
    const fallbackId = `task-${Date.now()}`;
    const normalized = apiPayload
      ? mapPostBodyToCalendarEvent(apiPayload, fallbackId)
      : mapPostBodyToCalendarEvent(eventDraft, fallbackId);
    events.value.push(normalized);
    closeTaskModal();
    void fetchCalendarSummaryForMonth();
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
    const { data } = await axios.post<unknown>(
      CALENDAR_EVENTS_API,
      eventDraft,
    );
    const apiPayload = extractCreatedCalendarEventPayload(data);
    const fb = `research-${Date.now()}`;
    const normalized = apiPayload
      ? mapPostBodyToCalendarEvent(apiPayload, fb)
      : mapPostBodyToCalendarEvent(eventDraft, fb);
    events.value.push(normalized);
    closeResearchModal();
    void fetchCalendarSummaryForMonth();
  } catch (err) {
    researchPostError.value = readAxiosErrorMessage(err);
  } finally {
    submittingResearchPost.value = false;
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

  return `Eres un asistente experto en salud auditiva e investigación clínica.

Analiza el siguiente evento del calendario de investigaciones y redacta un informe en español, claro y fácil de escanear.

Datos del evento:
- Tipo: ${tipo}
- Título: ${event.title}
- Fecha: ${event.displayDate}
- ${inv}

Estructura obligatoria en markdown (usa ## para cada sección):
## Resumen ejecutivo
(2-3 oraciones centradas en lo esencial)

## Contexto y objetivos
(Qué representa este evento en el plan de investigación)

## Hallazgos clave
(Lista con viñetas de 3-5 puntos concretos)

## Recomendaciones
(Lista accionable para el equipo)

## Próximos pasos
(Lista breve de acciones sugeridas)

Usa frases cortas, lenguaje profesional y evita redundancias.`;
}

function resetAISaveState() {
  aiSaving.value = false;
  aiSaveError.value = null;
  aiSaveSuccess.value = false;
}

async function runAIAnalysisForEvent(event: CalendarSummaryTableRow) {
  aiPanelEvent.value = event;
  aiPanelOpen.value = true;
  aiPanelLoading.value = true;
  aiPanelError.value = null;
  aiPanelContent.value = "";
  resetAISaveState();
  aiAnalyzingId.value = event.id;

  try {
    const prompt = buildCalendarEventAIPrompt(event);
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
    const payload = {
      calendarEventId: event.id,
      researchId: event.researchId ?? null,
      eventTitle: event.title,
      eventType: event.type,
      eventDate: event.displayDate,
      researchName: event.researchName,
      content,
      generatedAt:
        aiGeneratedAt.value?.toISOString() ?? new Date().toISOString(),
    };

    await axios.post(CALENDAR_AI_ANALYSES_API, payload);
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
  void fetchCalendarSummaryForMonth();
});

onMounted(async () => {
  await fetchResearch();
  await fetchCalendarSummaryForMonth();
});
</script>

<style scoped>
</style>
