<template>
  <aside :class="[
      'fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out',
      'w-80 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-indigo-100',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]">
    <div class="flex flex-col h-full">
      <!-- Logo & Brand -->
       <div class="px-6 py-6 border-b border-indigo-100 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700">
        <div class="flex items-center">
          <!-- Logo Icon -->
           <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
             <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
            </svg>
           </div>
           <div class="text-white">
            <h2 class="text-xl font-bold">Centro Auditivo</h2>
            <p class="text-xs text-white/80">Portal de Salud</p>
           </div>
        </div>
       </div>

       <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 overflow-y-auto">
          <div class="space-y-2">
            <!-- Home -->
             <Navitem
              label="Inicio"
              description="Panel principal"
              icon="home"
              :active="activeItem === 'home'"
              @click="navigateTo('home')" />

              <!-- Sonidos Relajantes -->
          <NavItem
            id="relaxing"
            :active="activeItem === 'relaxing'"
            icon="music"
            label="Sonidos Relajantes"
            description="Terapia de sonido"
            @click="navigateTo('relaxing')"
          />

          <!-- Investigaciones -->
          <NavItem
            id="research"
            :active="activeItem === 'research'"
            icon="research"
            label="Investigaciones"
            description="Avances científicos"
            badge="New"
            @click="navigateTo('research')"
          />

          <!-- Tamizaje Auditivo -->
          <NavItem
            id="screening"
            :active="activeItem === 'screening'"
            icon="screening"
            label="Tamizaje Auditivo"
            description="Evaluación auditiva"
            @click="navigateTo('screening')"
          />

          <!-- Cuestionarios Auditivos -->
          <NavItem
            id="questionnaires"
            :active="activeItem === 'questionnaires'"
            icon="questionnaire"
            label="Cuestionarios Auditivos"
            description="Evaluación de síntomas"
            @click="navigateTo('questionnaires')"
          />
          </div>

          <!-- Divider -->
           <div class="my-6 border-t border-gray-200"></div>
           <!-- Additional Info Card -->
            <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
                </div>
                <div>
              <p class="text-sm font-semibold text-gray-800">Consejo del día</p>
            </div>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
            Protege tu audición evitando ruidos fuertes prolongados. Usa protección auditiva cuando sea necesario.
          </p>
            </div>
        </nav>
        <div class="p-4 border-t border-indigo-100 bg-gradient-to-br from-gray-50 to-indigo-50">
           <!-- Progress Card -->
            <div class="bg-white rounded-2xl p-4 shadow-sm mb-3 border border-indigo-100">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
                </div>
                <div class="flex-1">
              <p class="text-xs text-gray-500">Progreso del mes</p>
              <p class="text-lg font-bold text-gray-800">85%</p>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500" style="width: 85%"></div>
          </div>
          <p class="text-xs text-gray-500 mt-2">4 de 5 evaluaciones completadas</p>
              </div>

              <!-- Logout Button -->
        <button class="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group mt-2">
          <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span class="font-medium">Cerrar Sesión</span>
        </button>
            </div>
        </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import Navitem from './Navitem.vue';

interface Props {
  isOpen: boolean;
  activeItem: string;
}

defineProps<Props>();

const emit = defineEmits<{
  toggle: [];
  navigate: [page: string];
}>();

const navigateTo = (page: string) => {
  emit('navigate', page);
};
</script>