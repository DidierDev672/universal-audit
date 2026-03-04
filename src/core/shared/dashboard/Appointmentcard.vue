<template>
  <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer">
    <div class="flex-shrink-0">
      <div :class="['w-16 h-16 rounded-xl flex flex-col items-center justify-center', statusColors[status]]">
        <span class="text-sm font-bold text-white">{{ time.split(':')[0] }}</span>
        <span class="text-xs text-white/80">{{ time.split(':')[1] }}</span>
      </div>
    </div>
     <div class="flex-1 min-w-0">
      <h4 class="font-semibold text-gray-800 truncate">{{ patient }}</h4>
      <p class="text-sm text-gray-600">{{ type }}</p>
    </div>

    <div class="flex-shrink-0">
      <span :class="['px-3 py-1 rounded-full text-xs font-medium', statusBadges[status]]">
        {{ statusLabels[status] }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
  interface Props {
  time: string;
  patient: string;
  type: string;
  status: 'completed' | 'in-progress' | 'pending';
}

defineProps<Props>();

const statusColors = {
  'completed': 'bg-green-500',
  'in-progress': 'bg-orange-500',
  'pending': 'bg-gray-400'
};

const statusBadges = {
  'completed': 'bg-green-100 text-green-700',
  'in-progress': 'bg-orange-100 text-orange-700',
  'pending': 'bg-gray-100 text-gray-700'
};

const statusLabels = {
  'completed': 'Completado',
  'in-progress': 'En curso',
  'pending': 'Pendiente'
};
</script>