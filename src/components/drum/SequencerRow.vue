<template>
  <div class="flex items-center gap-2">
    <!-- Track label -->
    <span class="w-16 text-xs font-mono text-gray-500 uppercase shrink-0">
      {{ colorId }}
    </span>
    
    <!-- Step buttons -->
    <div class="flex gap-px">
      <button
        v-for="step in 16"
        :key="step - 1"
        class="w-6 h-8 transition-all duration-75 border-r border-gray-800 last:border-r-0"
        :class="{
          'opacity-100': sequence[step - 1],
          'bg-gray-800 hover:bg-gray-700': !sequence[step - 1],
          'brightness-125': isPlaying && currentStep === step - 1
        }"
        :style="sequence[step - 1] ? { backgroundColor: accentColor } : {}"
        @click="toggleStep(step - 1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  colorId: string
  accentColor: string
  sequence: boolean[]
  isPlaying: boolean
  currentStep: number
}>()

const emit = defineEmits<{
  (e: 'toggle', step: number): void
}>()

function toggleStep(step: number) {
  emit('toggle', step)
}
</script>
