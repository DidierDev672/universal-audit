import { defineStore } from "pinia";
import { computed, ref } from "vue";

export type categories =
  | "main"
  | "urgent"
  | "appointment"
  | "prescription"
  | "other";

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
}

export const useInboxStore = defineStore("inbox", () => {
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

  const notReading = computed(() => messages.value.filter((m) => !m.reading));
  const trashMessages = computed(() =>
    messages.value.filter((m) => m.folder === "trash"),
  );

  // Simula carga inicial (remplaza con tu API)
  async function loadMessages() {
    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      messages.value = [
        {
          id: "1",
          from: "John Doe",
          to: "Jane Doe",
          subject: "Hello",
          preview: "Hello, how are you?",
          body: "Hello, how are you?",
          date: new Date(),
          reading: false,
          featured: false,
          category: "main",
          folder: "inbox",
          avatar: "JD",
          color: "teal",
        },
        {
          id: "2",
          from: "Jane Doe",
          to: "John Doe",
          subject: "Recordatorio de cita",
          preview: "Tu cita está confirmada para mañana a las 10:00.",
          body: "Hola,\n\nTu cita está confirmada para mañana a las 10:00. Por favor llega 15 minutos antes.\n\nSaludos.",
          date: new Date(),
          reading: false,
          featured: true,
          category: "appointment",
          folder: "inbox",
          avatar: "JD",
          color: "purple",
        },
      ];
    } finally {
      loading.value = false;
    }
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

  function sendMessage(payload: Omit<Message, "id" | "reading" | "date">) {
    messages.value.unshift({
      ...payload,
      id: crypto.randomUUID(),
      reading: false,
      date: new Date(),
    });
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
    loadMessages,
    selectMessage,
    toggleFeatured,
    moveToFolder,
    remove,
    markAllAsRead,
  };
});
