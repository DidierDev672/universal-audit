<template>
  <aside :class="[
      'fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out',
      'w-80 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-indigo-100',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]">
    <div class="flex flex-col h-full">
      <!-- Logo & Brand -->
       <div class="px-6 py-6 border-b border-indigo-100 bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-700">
        <div class="flex items-center">
          <!-- Logo Icon -->
           <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
             <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
           </div>
           <div class="text-white">
            <h2 class="text-xl font-bold">Creación</h2>
            <p class="text-xs text-white/80">Portal de Gestión</p>
           </div>
        </div>
       </div>

       <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 overflow-y-auto">
          <div class="space-y-2">
            <!-- Crear Investigación Auditiva -->
            <NavItem
              id="crear-investigacion-auditiva"
              :active="activeItem === 'crear-investigacion-auditiva'"
              icon="research"
              label="Crear Investigación Auditiva"
              description="Nueva investigación auditiva"
            />

            <!-- Crear Cuestionarios para Tinnitus -->
            <NavItem
              id="crear-cuestionarios-tinnitus"
              :active="activeItem === 'crear-cuestionarios-tinnitus'"
              icon="questionnaire"
              label="Crear Cuestionarios para Tinnitus"
              description="Cuestionarios especializados"
            />

            <!-- Crear Tamizaje -->
            <NavItem
              id="crear-tamizaje"
              :active="activeItem === 'crear-tamizaje'"
              icon="screening"
              label="Crear Tamizaje"
              description="Nuevo tamizaje auditivo"
            />

            <!-- Crear Registro Paciente -->
            <NavItem
              id="crear-registro-paciente"
              :active="activeItem === 'crear-registro-paciente'"
              icon="user"
              label="Crear Registro Paciente"
              description="Nuevo paciente"
            />
          </div>

          <!-- Divider -->
           <div class="my-6 border-t border-gray-200"></div>
           
           <!-- Info Card -->
            <div class="bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
                </div>
                <div>
              <p class="text-sm font-semibold text-gray-800">Acciones Rápidas</p>
            </div>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
            Crea nuevos registros y gestiona el sistema de forma eficiente.
          </p>
            </div>
        </nav>
        
        <div class="p-4 border-t border-indigo-100 bg-linear-to-br from-gray-50 to-indigo-50">
           <!-- Logout Button -->
        <button class="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group">
          <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span class="font-medium">Cerrar Sesión</span>
        </button>
        </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import NavItem from './Navitem.vue';

interface Props {
  isOpen: boolean;
  activeItem: string;
}

defineProps<Props>();
</script>
