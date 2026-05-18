import { onMounted, onUnmounted } from "vue";
import { push } from "notivue";
import { useNotificationsStore } from "../stores/notifications";

export function useNotifications() {
  const store = useNotificationsStore();
  let intervalId: ReturnType<typeof setInterval> | null = null;

  function notify(
    title: string,
    message: string,
    type: "success" | "error" | "info" | "warning" = "info",
  ) {
    push[type]({ title: title, message: message });

    store.add({ title, message, type, scheduledFor: new Date().toISOString() });
  }

  // ── Notificación programada para una fecha futura ────────────────
  function programNotification(
    title: string,
    message: string,
    dateISO: string,
    type: "success" | "error" | "info" | "warning" = "info",
  ) {
    const date = new Date(dateISO);
    if (isNaN(date.getTime())) {
      console.warn("Fecha inválida para programación");
      return;
    }

    store.program({ title, message, type, scheduledFor: dateISO });

    // setTimeout para la sesión actual
    const delay = date.getTime() - Date.now();
    setTimeout(() => {
      const pending = store.scheduled.find(
        (n) => n.scheduledFor === dateISO && n.title === title,
      );
      if (!pending) return;
      store.programToActive(pending.id);
      push[type]({ title: title, message: message });
    }, delay);
  }

  // ── Verificar programadas al recargar la app ─────────────────────
  // (reschedule las que aún no han llegado, ejecuta las vencidas)
  function verifyProgram() {
    const hour = new Date();

    store.scheduled.forEach((n) => {
      if (!n.scheduledFor) return;
      const date = new Date(n.scheduledFor);

      if (date <= hour) {
        // Venció mientras la app estaba cerrada — disparar de inmediato
        store.programToActive(n.id);
        push[n.type]({ title: n.title, message: n.message });
      } else {
        // Aún no llega — reregistrar el setTimeout
        const delay = date.getTime() - hour.getTime();
        setTimeout(() => {
          store.programToActive(n.id);
          push[n.type]({ title: n.title, message: n.message });
        }, delay);
      }
    });
  }

  // ── Polling cada minuto — para rangos largos (mayo–agosto) ───────
  // Útil si tienes notificaciones diarias/semanales en ese rango

  function startScheduler() {
    intervalId = setInterval(() => {
      const now = new Date();
      const month = now.getMonth() + 1;
      const hour = now.getHours();
      const minute = now.getMinutes();

      // Ejemplo: cada día a las 9:00am de mayo (5) a agosto (8)
      if (month >= 5 && month <= 8 && hour === 9 && minute === 0) {
        notify(
          "Seguimiento auditivo",
          "Recuerda registrar la evaluación del día",
          "info",
        );
      }
    }, 60_000); // revisa cada minuto
  }

  function stopSchedule() {
    if (intervalId) clearInterval(intervalId);
  }

  // ── Montar / desmontar ───────────────────────────────────────────
  onMounted(() => {
    verifyProgram();
    startScheduler();
  });

  onUnmounted(() => {
    stopSchedule();
  });

  return {
    notifications: store.notifications,
    readingNot: store.readingMark,
    allReadingMark: store.allReadingMark,
    notify,
    programNotification,
    readingMark: store.readingMark,
    markAllAsRead: store.allReadingMark,
    delete: store.remove,
  };
}
