<template>
  <RouterLink :to="`/${id}`" :class="[
    'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group',
      active
        ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
  ]">
  <div :class="[
    'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all',
      active
        ? 'bg-white/20 backdrop-blur-sm'
        : 'bg-linear-to-br from-indigo-100 to-purple-100 group-hover:from-indigo-200 group-hover:to-purple-200'
  ]">
    <svg :class="[
          'w-6 h-6 transition-transform',
          active ? 'text-white scale-110' : 'text-indigo-600'
        ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconComponent"/>
    </svg>
  </div>

  <!-- Label and Description -->
   <div class="flex-1 text-left">
    <div class="flex items-center gap-2">
      <span class="font-semibold">{{ label }}</span>
      <span v-if="badge"
          :class="[
            'px-2 py-0.5 text-xs font-bold rounded-full',
            active
              ? 'bg-white text-indigo-600'
              : 'bg-indigo-100 text-indigo-600'
          ]">
    {{ badge }}
  </span>
  </div>
  <p :class="[
        'text-xs mt-0.5',
        active ? 'text-white/80' : 'text-gray-500'
      ]">
    {{ description }}
  </p>
   </div>
   <!-- Arrow indicator -->
     <svg
      v-if="active"
      class="w-5 h-5 text-white animate-pulse"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
    </svg>
  </RouterLink>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

// Icons mapping
const icons = {
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  music: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
  research: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  screening: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  questionnaire: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  ear: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
  user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
};

interface Props {
  id: string;
  icon: string;
  label: string;
  description: string;
  active?: boolean;
  badge?:  string;
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  icon: 'home'
});

const iconComponent = computed(() => {
  return icons[props.icon as keyof typeof icons] || icons.home;
});

defineEmits<{
  click: [];
}>();
</script>