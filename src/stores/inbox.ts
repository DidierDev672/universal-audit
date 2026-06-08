import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { CalendarAiScheduleEventType } from "../shared/types/calendarTaskAiSchedule";

export type categories =
  | "main"
  | "urgent"
  | "appointment"
  | "prescription"
  | "other"
  | "ai_research";

export type folder = "inbox" | "sent" | "drafts" | "trash" | "spam";

export interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  preview: string;
  body: string;
  date: Date;
  reading: boolean;
  featured: boolean;
  category: categories;
  folder: folder;
  avatar: string;
  color: string;
  /** Mensaje generado por seguimiento IA del calendario. */
  source?: "ai_calendar" | "user";
  calendarEventId?: string;
  jobId?: string;
  eventType?: CalendarAiScheduleEventType;
}

export interface AddAiResultMessagePayload {
  from: string;
  subject: string;
  preview: string;
  body: string;
  category: categories;
  avatar: string;
  color: string;
  calendarEventId: string;
  jobId?: string;
  eventType: CalendarAiScheduleEventType;
}

export const useInboxStore = defineStore(
  "inbox",
  () => {
    const messages = ref<Message[]>([]);
    const selectedId = ref<string | null>(null);
    const folderActive = ref<folder>("inbox");
    const categoryActive = ref<categories>("main");
    const searchQuery = ref("");
    const loading = ref(false);

    const filteredMessages = computed(() =>
      messages.value.filter((m: Message) => {
        const onFolder = m.folder === folderActive.value;
        const onCategory =
          folderActive.value !== "inbox" || m.category === categoryActive.value;
        const query = searchQuery.value.toLowerCase();
        const matchesSearch =
          !query ||
          m.from.toLowerCase().includes(query) ||
          m.subject.toLowerCase().includes(query) ||
          m.preview.toLowerCase().includes(query);

        return onFolder && onCategory && matchesSearch;
      }),
    );

    const selected = computed(
      () => messages.value.find((m) => m.id === selectedId.value) ?? null,
    );

    const notReading = computed(() =>
      messages.value.filter((m) => m.folder === "inbox" && !m.reading),
    );
    const trashMessages = computed(() =>
      messages.value.filter((m) => m.folder === "trash"),
    );

    const aiMessages = computed(() =>
      messages.value.filter((m) => m.source === "ai_calendar"),
    );

    async function loadMessages() {
      loading.value = true;
      await new Promise((resolve) => setTimeout(resolve, 200));
      loading.value = false;
    }

    function addAiResultMessage(payload: AddAiResultMessagePayload) {
      const duplicate = messages.value.find(
        (m) =>
          m.source === "ai_calendar" &&
          m.jobId === payload.jobId &&
          m.subject === payload.subject &&
          m.preview === payload.preview,
      );
      if (duplicate) return;

      messages.value.unshift({
        id: crypto.randomUUID(),
        from: payload.from,
        to: "Bandeja de entrada",
        subject: payload.subject,
        preview: payload.preview,
        body: payload.body,
        date: new Date(),
        reading: false,
        featured: false,
        category: payload.category === "urgent" ? "urgent" : "ai_research",
        folder: "inbox",
        avatar: payload.avatar,
        color: payload.color,
        source: "ai_calendar",
        calendarEventId: payload.calendarEventId,
        jobId: payload.jobId,
        eventType: payload.eventType,
      });
    }

    function selectMessage(id: string) {
      selectedId.value = id;
      const m = messages.value.find((msg) => msg.id === id);
      if (m) m.reading = true;
    }

    function toggleFeatured(id: string) {
      const m = messages.value.find((msg) => msg.id === id);
      if (m) m.featured = !m.featured;
    }

    function moveToFolder(id: string, targetFolder: folder) {
      const m = messages.value.find((msg) => msg.id === id);
      if (m) m.folder = targetFolder;
    }

    function remove(id: string) {
      messages.value = messages.value.filter((m) => m.id !== id);
    }

    function markAllAsRead() {
      messages.value
        .filter((m) => m.folder === folderActive.value)
        .forEach((m) => (m.reading = true));
    }

    return {
      messages,
      selectedId,
      folderActive,
      categoryActive,
      searchQuery,
      loading,
      filteredMessages,
      selected,
      notReading,
      trashMessages,
      aiMessages,
      loadMessages,
      addAiResultMessage,
      selectMessage,
      toggleFeatured,
      moveToFolder,
      remove,
      markAllAsRead,
    };
  },
  { persist: true },
);
