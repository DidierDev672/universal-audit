<template>
  <div class="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition cursor-pointer">
    <div  :class="['w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', colorClasses[color]]">
       <component :is="iconComponent" class="w-5 h-5 text-white" />
    </div>
    <div class="flex-1 min-w-0">
      <h4 class="font-medium text-gray-800">{{ title }}</h4>
      <p class="text-sm text-gray-600 mt-0.5">{{ description }}</p>
    </div>
     <span class="text-xs text-gray-500 flex-shrink-0">{{ time }}</span>
  </div>
</template>
<script  setup lang="ts">
  import { computed } from 'vue';

interface Props {
  icon: string;
  title: string;
  description: string;
  time: string;
  color: 'green' | 'blue' | 'purple' | 'amber';
}

const props = defineProps<Props>();

const colorClasses = {
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  amber: 'bg-amber-500',
};

const iconComponents: Record<string, any> = {
  check: {
    render: () => (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
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
  headphones: {
    render: () => (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
      </svg>
    ),
  },
  coffee: {
    render: () => (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
    ),
  },
};

const iconComponent = computed(() => iconComponents[props.icon] || iconComponents.check);
</script>