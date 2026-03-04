<template>
  <div class="space-y-6">
    <!-- Header with Actions -->
    <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold mb-1">Gestión de Pacientes</h2>
          <p class="text-white/90">{{ totalPatients }} pacientes registrados</p>
        </div>
        <button class="px-6 py-3 bg-white text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo Paciente
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-2xl shadow-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2">
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Buscar paciente por nombre, DNI o email..."
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
        <div>
          <select class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option>Todos los estados</option>
            <option>Activo</option>
            <option>En tratamiento</option>
            <option>Inactivo</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Patients Table -->
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Paciente
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contacto
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Última Visita
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="patient in filteredPatients" :key="patient.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {{ patient.initials }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">{{ patient.name }}</p>
                    <p class="text-sm text-gray-500">{{ patient.dni }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-800">{{ patient.email }}</p>
                <p class="text-sm text-gray-500">{{ patient.phone }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-800">{{ patient.lastVisit }}</p>
              </td>
              <td class="px-6 py-4">
                <span :class="['px-3 py-1 rounded-full text-xs font-medium', getStatusColor(patient.status)]">
                  {{ patient.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <p class="text-sm text-gray-600">
          Mostrando {{ filteredPatients.length }} de {{ totalPatients }} pacientes
        </p>
        <div class="flex items-center gap-2">
          <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            Anterior
          </button>
          <button class="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition">
            1
          </button>
          <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            2
          </button>
          <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
const searchQuery = ref('');

const patients = ref([
  {
    id: 1,
    name: 'María González',
    initials: 'MG',
    dni: '12345678A',
    email: 'maria@email.com',
    phone: '+34 600 123 456',
    lastVisit: '15 Feb 2024',
    status: 'Activo'
  },
  {
    id: 2,
    name: 'Juan Pérez',
    initials: 'JP',
    dni: '87654321B',
    email: 'juan@email.com',
    phone: '+34 600 654 321',
    lastVisit: '10 Feb 2024',
    status: 'En tratamiento'
  },
  {
    id: 3,
    name: 'Ana Martínez',
    initials: 'AM',
    dni: '11223344C',
    email: 'ana@email.com',
    phone: '+34 600 789 012',
    lastVisit: '08 Feb 2024',
    status: 'Activo'
  },
  {
    id: 4,
    name: 'Carlos López',
    initials: 'CL',
    dni: '44332211D',
    email: 'carlos@email.com',
    phone: '+34 600 345 678',
    lastVisit: '05 Feb 2024',
    status: 'Inactivo'
  },
]);

const totalPatients = computed(() => patients.value.length);
const filteredPatients = computed(() => {
  if (!searchQuery.value) return patients.value;
  
  const query = searchQuery.value.toLowerCase();
  return patients.value.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.dni.toLowerCase().includes(query) ||
    p.email.toLowerCase().includes(query)
  );
});

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Activo': 'bg-green-100 text-green-700',
    'En tratamiento': 'bg-orange-100 text-orange-700',
    'Inactivo': 'bg-gray-100 text-gray-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};
</script>