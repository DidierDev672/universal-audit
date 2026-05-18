import { defineStore } from "pinia";
import { computed, ref } from "vue";

export type TypeNotification = "success" | "error" | "info" | "warning";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: TypeNotification;
  reading: boolean;
  date: Date;
  scheduledFor: string;
}

export const useNotificationsStore = defineStore(
  "notifications",
  () => {
    const notifications = ref<AppNotification[]>([]);
    const scheduled = ref<AppNotification[]>([]);

    const unreadNotifications = computed(() =>
      notifications.value.filter((n) => !n.reading),
    );

    const scheduledNotifications = computed(() => scheduled.value);

    function add(payload: Omit<AppNotification, "id" | "reading" | "date">) {
      notifications.value.unshift({
        ...payload,
        id: crypto.randomUUID(),
        reading: false,
        date: new Date(),
      });
    }

    function program(
      payload: Omit<AppNotification, "id" | "reading" | "date"> & {
        scheduledFor: string;
      },
    ) {
      scheduled.value.push({
        ...payload,
        id: crypto.randomUUID(),
        reading: false,
        date: new Date(),
      });
    }

    function readingMark(id: string) {
      const n = notifications.value.find((item) => item.id === id);
      if (n) n.reading = true;
    }

    function allReadingMark() {
      notifications.value.forEach((n) => (n.reading = true));
    }

    function remove(id: string) {
      notifications.value = notifications.value.filter((n) => n.id !== id);
    }

    function clearAll() {
      notifications.value = [];
    }

    function programToActive(id: string) {
      const idx = scheduled.value.findIndex((n) => n.id === id);
      if (idx === -1) return;

      const [notification] = scheduled.value.splice(idx, 1);
      if (!notification) return;

      notifications.value.unshift({
        ...notification,
        date: new Date(),
      });
    }

    return {
      notifications,
      scheduled,
      unreadNotifications,
      scheduledNotifications,
      add,
      program,
      readingMark,
      allReadingMark,
      remove,
      clearAll,
      programToActive,
    };
  },
  { persist: true },
);
