import { onMounted, onUnmounted } from "vue";
import { processScheduledCalendarAiJobs } from "../shared/service/calendarTaskAiScheduleRunner";

let intervalId: ReturnType<typeof setInterval> | null = null;
let mountCount = 0;

function startCalendarTaskAiScheduler() {
  if (intervalId) return;
  void processScheduledCalendarAiJobs();
  intervalId = setInterval(() => {
    void processScheduledCalendarAiJobs();
  }, 60_000);
}

function stopCalendarTaskAiScheduler() {
  if (mountCount > 0) return;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

/**
 * Ejecuta seguimiento IA programado en todo el rango de fechas del calendario.
 * Usar en Layout para que funcione fuera de la página de calendario.
 */
export function useCalendarTaskAiScheduler() {
  onMounted(() => {
    mountCount += 1;
    startCalendarTaskAiScheduler();
  });

  onUnmounted(() => {
    mountCount = Math.max(0, mountCount - 1);
    stopCalendarTaskAiScheduler();
  });

  return {
    processNow: processScheduledCalendarAiJobs,
  };
}
