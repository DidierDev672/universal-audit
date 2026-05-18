import { storeToRefs } from "pinia";
import { useInboxStore } from "../stores/inbox";

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function useInbox() {
  const store = useInboxStore();
  const {
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
  } = storeToRefs(store);

  const formatDate = (iso: string): string => {
    const date = new Date(iso);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString())
      return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    if (date.toDateString() === yesterday.toDateString()) return "Ayer";
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    });
  };

  const colorAvatar = (color: string) =>
    ({
      teal: "bg-violet-100 text-violet-700",
      purple: "bg-violet-100 text-violet-700",
      amber: "bg-amber-100 text-amber-700",
      blue: "bg-sky-100 text-sky-700",
      red: "bg-rose-100 text-rose-700",
    })[color] ?? "bg-violet-100 text-violet-700";

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
    loadMessages: store.loadMessages,
    selectMessage: store.selectMessage,
    toggleFeatured: store.toggleFeatured,
    moveToFolder: store.moveToFolder,
    remove: store.remove,
    markAllAsRead: store.markAllAsRead,
    formatDate,
    colorAvatar,
    getInitials,
  };
}
