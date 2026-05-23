<template>
  <Teleport to="body">
    <Transition name="app-modal-fade">
      <div
        v-if="isOpen && event"
        class="app-modal-root"
        style="z-index: 66"
      >
        <div
          class="app-modal-backdrop"
          aria-hidden="true"
          @click="emit('close')"
        />
        <div
          class="app-modal-scrim app-modal-scrim--sheet"
          @click.self="emit('close')"
        >
          <div
            class="app-modal-panel app-modal-panel--sheet bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-assign-mode-title"
            @click.stop
          >
            <div class="p-6 border-b border-gray-100">
              <h3
                id="task-assign-mode-title"
                class="text-xl font-bold text-gray-800"
              >
                ¿Cómo desea asignar esta tarea?
              </h3>
              <p class="text-sm text-gray-600 mt-2 leading-relaxed">
                Elija si el análisis con IA se ejecuta ahora o durante el rango
                programado de la tarea.
              </p>
              <p
                class="mt-3 text-sm font-medium text-violet-700 bg-violet-50 border border-violet-100 rounded-xl px-3 py-2"
              >
                Rango de la tarea: {{ dateRangeLabel }}
              </p>
            </div>

            <div class="p-6 space-y-3">
              <button
                type="button"
                class="w-full text-left p-4 rounded-2xl border-2 border-indigo-200 bg-indigo-50/80 hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
                @click="emit('select', 'instant')"
              >
                <div class="flex items-start gap-3">
                  <span
                    class="w-10 h-10 shrink-0 rounded-xl bg-indigo-600 text-white flex items-center justify-center"
                    aria-hidden="true"
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </span>
                  <div>
                    <p class="font-semibold text-gray-800 group-hover:text-indigo-900">
                      Asignación instantánea
                    </p>
                    <p class="text-sm text-gray-600 mt-1 leading-relaxed">
                      Genera el análisis con IA de inmediato y lo muestra en el
                      modal de asignación para revisar, guardar y aplicar.
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                class="w-full text-left p-4 rounded-2xl border-2 border-purple-200 bg-purple-50/60 hover:border-purple-400 hover:bg-purple-50 transition-all group"
                @click="emit('select', 'scheduled_range')"
              >
                <div class="flex items-start gap-3">
                  <span
                    class="w-10 h-10 shrink-0 rounded-xl bg-purple-600 text-white flex items-center justify-center"
                    aria-hidden="true"
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  <div>
                    <p class="font-semibold text-gray-800 group-hover:text-purple-900">
                      Programada en el rango de fechas
                    </p>
                    <p class="text-sm text-gray-600 mt-1 leading-relaxed">
                      La IA revisará la tarea cada día dentro del rango
                      {{ dateRangeLabel }}. Si detecta hallazgos, aparecerán en
                      las notificaciones del sistema.
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div class="px-6 pb-6">
              <button
                type="button"
                class="w-full py-3 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
                @click="emit('close')"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { TaskAssignmentExecutionMode } from "../../shared/types/calendarTaskAiSchedule";

defineProps<{
  isOpen: boolean;
  event: { title: string; startDate: string; endDate: string } | null;
  dateRangeLabel: string;
}>();

const emit = defineEmits<{
  close: [];
  select: [mode: TaskAssignmentExecutionMode];
}>();
</script>
