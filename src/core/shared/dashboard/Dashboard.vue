<template>
   <div class="space-y-6">
    <!-- Welcome Banner -->
    <div class="bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold mb-2">¡Bienvenido de vuelta, Dr. Pérez! ☕</h2>
          <p class="text-white/90">Hoy es {{ todayDate }}. Tienes 12 citas programadas.</p>
        </div>
        <div class="hidden md:block">
          <div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Pacientes Hoy"
        value="12"
        change="+8%"
        icon="users"
        color="orange"
      />
      <StatCard
        title="Nuevos Pacientes"
        value="3"
        change="+20%"
        icon="user-plus"
        color="purple"
      />
      <StatCard
        title="Evaluaciones"
        value="8"
        change="+5%"
        icon="clipboard"
        color="blue"
      />
      <StatCard
        title="Satisfacción"
        value="4.8"
        change="+0.2"
        icon="star"
        color="amber"
      />
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Appointments Today -->
      <div class="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-800">Citas de Hoy</h3>
          <button class="text-sm text-orange-600 hover:text-orange-700 font-medium">
            Ver todas →
          </button>
        </div>

        <div class="space-y-4">
          <AppointmentCard
            v-for="appointment in todayAppointments"
            :key="appointment.id"
            :time="appointment.time"
            :patient="appointment.patient"
            :type="appointment.type"
            :status="appointment.status"
          />
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-6">Acciones Rápidas</h3>
        
        <div class="space-y-3">
          <QuickActionButton
            icon="plus"
            label="Nueva Cita"
            color="orange"
          />
          <QuickActionButton
            icon="user-plus"
            label="Registrar Paciente"
            color="purple"
          />
          <QuickActionButton
            icon="clipboard"
            label="Nueva Evaluación"
            color="blue"
          />
          <QuickActionButton
            icon="headphones"
            label="Inventario Audífonos"
            color="amber"
          />
        </div>

        <!-- Coffee Break Reminder -->
        <div class="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-800">Descanso sugerido</p>
              <p class="text-xs text-gray-600">En 30 minutos ☕</p>
            </div>
          </div>
          <p class="text-xs text-gray-600">
            Has trabajado 2.5 horas. ¡Toma un café!
          </p>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-2xl shadow-lg p-6">
      <h3 class="text-xl font-bold text-gray-800 mb-6">Actividad Reciente</h3>
      
      <div class="space-y-4">
        <ActivityItem
          icon="check"
          title="Evaluación completada"
          description="María González - Audiometría tonal"
          time="Hace 15 minutos"
          color="green"
        />
        <ActivityItem
          icon="user-plus"
          title="Nuevo paciente registrado"
          description="Carlos Ramírez - Primera consulta"
          time="Hace 1 hora"
          color="blue"
        />
        <ActivityItem
          icon="headphones"
          title="Audífono configurado"
          description="Ana Martínez - Ajuste bilateral"
          time="Hace 2 horas"
          color="purple"
        />
        <ActivityItem
          icon="coffee"
          title="Break finalizado"
          description="Tiempo de descanso completado"
          time="Hace 3 horas"
          color="amber"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Statcard from '../layout/Statcard.vue';
import Appointmentcard from './Appointmentcard.vue';
import QuickActionButton from './Quickactionbutton.vue';

const todayAppointments = ref([
  {
    id: 1,
    time: '09:00',
    patient: 'María González',
    type: 'Audiometría',
    status: 'completed'
  },
  {
    id: 2,
    time: '10:30',
    patient: 'Juan Pérez',
    type: 'Consulta',
    status: 'in-progress'
  },
  {
    id: 3,
    time: '12:00',
    patient: 'Ana Martínez',
    type: 'Seguimiento',
    status: 'pending'
  },
  {
    id: 4,
    time: '14:00',
    patient: 'Carlos López',
    type: 'Ajuste Audífono',
    status: 'pending'
  },
]);

const todayDate = computed(() => {
  const date = new Date();
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});
</script>