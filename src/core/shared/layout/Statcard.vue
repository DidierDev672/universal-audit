<template>
   <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-sm text-gray-600 mb-1">{{ title }}</p>
        <h3 class="text-3xl font-bold text-gray-800 mb-2">{{ value }}</h3>
        <div class="flex items-center gap-2">
          <span :class="[
            'text-sm font-medium',
            change.startsWith('+') ? 'text-green-600' : 'text-red-600'
          ]">
            {{ change }}
          </span>
          <span class="text-xs text-gray-500">vs. mes anterior</span>
        </div>
      </div>
      
      <div :class="[
        'w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform',
        colorClasses[color]
      ]">
        <component :is="iconComponent" class="w-6 h-6 text-white" />
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        :class="['h-full rounded-full transition-all duration-500', progressColorClasses[color]]"
        :style="{ width: progressWidth }"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: 'orange' | 'purple' | 'blue' | 'amber';
}

const props = defineProps<Props>();


const colorClasses = {
  orange: 'bg-gradient-to-br from-orange-500 to-pink-500',
  purple: 'bg-gradient-to-br from-purple-500 to-pink-500',
  blue: 'bg-gradient-to-br from-blue-500 to-cyan-500',
  amber: 'bg-gradient-to-br from-amber-500 to-orange-500',
};

const progressColorClasses = {
  orange: 'bg-gradient-to-r from-orange-500 to-pink-500',
  purple: 'bg-gradient-to-r from-purple-500 to-pink-500',
  blue: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  amber: 'bg-gradient-to-r from-amber-500 to-orange-500',
};

const progressWidth = computed(() => {
  const changeValue = parseInt(props.change.replace('%', '').replace('+', ''));
  return `${Math.min(Math.abs(changeValue) * 5, 100)}%`;
});

const iconComponents: Record<string, any> = {
  users: {
    render: () => (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
    ),
  },
  'user-plus': {
    render: () => (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
      </svg>
    ),
  },
  clipboard: {
    render: () => (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
    ),
  },
  star: {
    render: () => (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
      </svg>
    ),
  },
};

const iconComponent = computed(() => {
  return iconComponents[props.icon] || iconComponents.users;
});
</script>
