<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  minFreq: number
  maxFreq?: number
  gain: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxFreq: 0,
  color: '#3b82f6'
})

const emit = defineEmits<{
  'update:gain': [value: number]
}>()

const displayFreq = computed(() => {
  if (props.maxFreq && props.maxFreq !== props.minFreq) {
    return `${formatFreq(props.minFreq)} - ${formatFreq(props.maxFreq)}`
  }
  return formatFreq(props.minFreq)
})

function formatFreq(freq: number): string {
  if (freq >= 1000) {
    return `${(freq / 1000).toFixed(1)}kHz`
  }
  return `${freq}Hz`
}

function onSliderChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:gain', parseFloat(target.value))
}

function onDragUp() {
  const newValue = Math.min(12, props.gain + 1)
  emit('update:gain', newValue)
}

function onDragDown() {
  const newValue = Math.max(-12, props.gain - 1)
  emit('update:gain', newValue)
}
</script>

<template>
  <div class="frequency-slider flex flex-col items-center gap-2 p-3 bg-gray-900/50 rounded-lg">
    <!-- Label y Frecuencia -->
    <div class="text-center">
      <p class="text-xs font-medium text-gray-300">{{ label }}</p>
      <p class="text-xs text-gray-500">{{ displayFreq }}</p>
    </div>

    <!-- Barra vertical con controles -->
    <div class="flex items-center gap-3">
      <!-- Botón subir -->
      <button
        type="button"
        @click="onDragUp"
        class="p-1 rounded hover:bg-gray-700 transition-colors"
        :aria-label="`Aumentar ganancia ${label}`"
      >
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <!-- Slider vertical -->
      <div class="relative h-32 w-8 bg-gray-800 rounded-full overflow-hidden">
        <!-- Línea de referencia central (0dB) -->
        <div class="absolute top-1/2 left-0 right-0 h-px bg-gray-600 z-10"></div>

        <!-- Barra de nivel -->
        <div
          class="absolute bottom-1/2 left-0 right-0 transition-all duration-200"
          :class="gain > 0 ? 'bg-green-500' : 'bg-red-500'"
          :style="{
            height: gain >= 0 ? `${(gain / 12) * 50}%` : `${(Math.abs(gain) / 12) * 50}%`,
            bottom: gain >= 0 ? '50%' : 'auto',
            top: gain < 0 ? '50%' : 'auto',
            backgroundColor: gain > 0 ? color : '#ef4444'
          }"
        ></div>

        <!-- Input range oculto (para accesibilidad) -->
        <input
          type="range"
          :value="gain"
          min="-12"
          max="12"
          step="0.5"
          @input="onSliderChange"
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          :aria-label="`Control de ganancia ${label}`"
        />
      </div>

      <!-- Botón bajar -->
      <button
        type="button"
        @click="onDragDown"
        class="p-1 rounded hover:bg-gray-700 transition-colors"
        :aria-label="`Disminuir ganancia ${label}`"
      >
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    <!-- Valor de ganancia -->
    <p
      class="text-sm font-semibold tabular-nums"
      :class="gain > 0 ? 'text-green-400' : gain < 0 ? 'text-red-400' : 'text-gray-400'"
    >
      {{ gain > 0 ? '+' : '' }}{{ gain.toFixed(1) }}dB
    </p>
  </div>
</template>

<style scoped>
.frequency-slider {
  min-width: 80px;
}

/* Accesibilidad: indicador visual de foco */
button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
</style>
