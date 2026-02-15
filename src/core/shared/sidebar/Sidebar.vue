<template>
  <aside
    :class="[
      'fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-300',
      'w-72 bg-white/95 backdrop-blur-sm shadow-xl border-r border-gray-200',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Logo & Brand -->
      <div
        class="px-6 py-6 border-b border-gray-200 bg-gradient-to-br from-amber-500 to-purple-600"
      >
        <div class="flex items-center gap-3">
          <!-- Logo Icon -->
          <div
            class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
          >
            <svg
              class="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
          <div class="text-white">
            <h2 class="text-xl font-bold">Audio universal</h2>
            <p class="text-xs text-white/80">Salud Auditiva Premium</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 overflow-y-auto">
        <div class="space-y-2">
          <!-- Main Navigation -->
          <div class="mb-6">
            <p
              class="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider"
            >
              Principal
            </p>
          </div>

          <!-- Patient Management -->
          <div class="mb-6">
            <p
              class="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider"
            >
              Pacientes
            </p>
          </div>
          <!-- Cafe Features -->
          <div class="mb-6">
            <p
              class="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider"
            >
              Experiencia
            </p>
          </div>
          <!-- Settings -->
          <div>
            <p
              class="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider"
            >
              Sistema
            </p>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>
<script setup lang="ts">
import { ref } from "vue";

interface Props {
  isOpen: boolean;
}

interface NavItemData {
  id: string;
  icon: string;
  label: string;
  badge?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  toggle: [];
  navigate: [page: string];
}>();

const activeItem = ref("dashboard");

const mainNavItems: NavItemData[] = [
  { id: "dashboard", icon: "home", label: "Dashboard" },
  { id: "calendar", icon: "calendar", label: "Agenda", badge: "3" },
  { id: "appointments", icon: "clock", label: "Citas de Hoy", badge: "5" },
];

const patientNavItems: NavItemData[] = [
  { id: "patients", icon: "users", label: "Pacientes" },
  { id: "evaluations", icon: "clipboard", label: "Evaluaciones" },
  { id: "treatments", icon: "heart", label: "Tratamientos" },
  { id: "hearing-aids", icon: "headphones", label: "Audífonos" },
];

const cafeNavItems: NavItemData[] = [
  { id: "lounge", icon: "coffee", label: "Sala de Espera" },
  { id: "feedback", icon: "star", label: "Experiencia" },
  { id: "music", icon: "music", label: "Ambiente Musical" },
];

const systemNavItems: NavItemData[] = [
  { id: "reports", icon: "chart", label: "Reportes" },
  { id: "settings", icon: "settings", label: "Configuración" },
  { id: "help", icon: "help", label: "Ayuda" },
];

// Methods
const navigateTo = (page: string) => {
  activeItem.value = page;
  emit("navigate", page);
};
</script>
