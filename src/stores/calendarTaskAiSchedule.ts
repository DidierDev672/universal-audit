import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { CalendarTaskAiScheduleJob } from "../shared/types/calendarTaskAiSchedule";

export const useCalendarTaskAiScheduleStore = defineStore(
  "calendarTaskAiSchedule",
  () => {
    const jobs = ref<CalendarTaskAiScheduleJob[]>([]);

    const activeJobs = computed(() => jobs.value);

    function upsertJob(
      payload: Omit<
        CalendarTaskAiScheduleJob,
        "id" | "lastRunDate" | "createdAt"
      >,
    ): CalendarTaskAiScheduleJob {
      const existing = jobs.value.find(
        (j) => j.calendarEventId === payload.calendarEventId,
      );

      if (existing) {
        existing.eventTitle = payload.eventTitle;
        existing.startDate = payload.startDate;
        existing.endDate = payload.endDate;
        existing.researchName = payload.researchName;
        existing.eventType = payload.eventType;
        existing.researchDraft = payload.researchDraft ?? null;
        return existing;
      }

      const job: CalendarTaskAiScheduleJob = {
        ...payload,
        id: crypto.randomUUID(),
        lastRunDate: null,
        createdAt: new Date().toISOString(),
      };
      jobs.value.push(job);
      return job;
    }

    function markRunToday(jobId: string, dateKey: string) {
      const job = jobs.value.find((j) => j.id === jobId);
      if (job) job.lastRunDate = dateKey;
    }

    function removeByEventId(calendarEventId: string) {
      jobs.value = jobs.value.filter(
        (j) => j.calendarEventId !== calendarEventId,
      );
    }

    function removeJob(jobId: string) {
      jobs.value = jobs.value.filter((j) => j.id !== jobId);
    }

    /** Elimina trabajos cuyo rango terminó hace más de 7 días. */
    function pruneExpired(todayKey: string) {
      jobs.value = jobs.value.filter((j) => {
        const end = j.endDate >= j.startDate ? j.endDate : j.startDate;
        if (end >= todayKey) return true;
        return daysBetween(end, todayKey) <= 7;
      });
    }

    return {
      jobs,
      activeJobs,
      upsertJob,
      markRunToday,
      removeByEventId,
      removeJob,
      pruneExpired,
    };
  },
  { persist: true },
);

function daysBetween(from: string, to: string): number {
  const a = new Date(`${from}T12:00:00`).getTime();
  const b = new Date(`${to}T12:00:00`).getTime();
  return Math.floor(Math.abs(b - a) / (1000 * 60 * 60 * 24));
}
