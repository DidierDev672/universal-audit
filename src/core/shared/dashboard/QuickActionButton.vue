<template>
  <button :class="[
    'w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200',
    'hover:scale-105 active:scale-95',
    colorClasses[color]
  ]">
    <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
      <component :is="iconComponent" class="w-5 h-5 text-white" />
    </div>
    <span class="flex-1 text-left font-medium text-white">{{ label }}</span>
    <svg class="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
    </svg>
  </button>
</template>

<script  setup lang="ts">
  import { computed } from 'vue';

interface Props {
  icon: string;
  label: string;
  color: 'orange' | 'purple' | 'blue' | 'amber';
}

const props = defineProps<Props>();

const colorClasses = {
  orange: 'bg-gradient-to-r from-orange-500 to-pink-500',
  purple: 'bg-gradient-to-r from-purple-500 to-pink-500',
  blue: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  amber: 'bg-gradient-to-r from-amber-500 to-orange-500',
};

const iconComponents: Record<string, any> = {
  plus: {
    render: () => (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
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
  headphones: {
    render: () => (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
      </svg>
    ),
  },
};
const iconComponent = computed(() => iconComponents[props.icon] || iconComponents.plus);
</script>