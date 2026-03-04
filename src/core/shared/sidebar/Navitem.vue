<template>
  <button @click="$emit('click')" :class="[
    'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group',
      active
        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
  ]">
  <div :class="[
    'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all',
      active
        ? 'bg-white/20 backdrop-blur-sm'
        : 'bg-gradient-to-br from-indigo-100 to-purple-100 group-hover:from-indigo-200 group-hover:to-purple-200'
  ]">
    <component  :is="iconComponent"
        :class="[
          'w-6 h-6 transition-transform',
          active ? 'text-white scale-110' : 'text-indigo-600'
        ]"/>
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
  </button>
</template>
<script setup lang="ts">
import{ computed } from 'vue';


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
});



defineEmits<{
  click: [];
}>();

</script>