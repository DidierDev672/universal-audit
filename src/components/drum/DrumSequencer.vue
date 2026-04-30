<template>
  <div class="bg-[#111827] border border-[#1F2937] rounded-lg p-4 space-y-4">
    <!-- Header with controls -->
    <div class="flex items-center justify-between">
      <span class="text-sm font-mono text-gray-400 uppercase">Secuenciador · 16 pasos</span>

      <div class="flex items-center gap-3">
        <!-- BPM Control -->
        <div class="flex items-center gap-2">
          <span class="text-xs font-mono text-gray-500">BPM</span>
          <input :value="bpm" type="number" min="60" max="180"
            class="w-14 text-sm font-mono text-gray-300 text-center bg-[#0B0F12] border border-[#1F2937] rounded px-2 py-1 outline-none focus:border-gray-600"
            @change="updateBpm($event)">
        </div>

        <!-- Play/Pause Button -->
        <button class="px-3 py-1.5 text-xs font-mono rounded border transition-colors flex items-center gap-2" :class="isPlaying
          ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30'
          : 'bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30'" @click="togglePlay">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path v-if="isPlaying" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            <path v-else d="M8 5v14l11-7z" />
          </svg>
          {{ isPlaying ? 'PAUSE' : 'PLAY' }}
        </button>

        <!-- Stop Button -->
        <button
          class="px-3 py-1.5 text-xs font-mono rounded border bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30 transition-colors"
          @click="stop">
          STOP
        </button>

        <!-- Clear Button -->
        <button
          class="px-3 py-1.5 text-xs font-mono rounded border bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-400 transition-colors"
          @click="clear">
          CLEAR
        </button>
      </div>
    </div>

    <!-- Step position indicator -->
    <div class="flex gap-px pl-[72px]">
      <div v-for="step in 16" :key="step - 1" class="flex-1 h-0.5 rounded-full transition-colors duration-75"
        :class="currentStep === step - 1 && isPlaying ? 'bg-purple-400' : 'bg-gray-800'" />
    </div>

    <!-- Sequencer rows -->
    <div class="space-y-1">
      <SequencerRow v-for="(color, index) in colors" :key="color.id" :color-id="color.id"
        :accent-color="color.color[3] || color.color[0]" :sequence="sequences[index] || []" :is-playing="isPlaying"
        :current-step="currentStep" @toggle="toggleStep(index, $event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import SequencerRow from './SequencerRow.vue'
import type { Color } from '@/data/colors'

const props = defineProps<{
  colors: Color[]
}>()

const emit = defineEmits<{
  (e: 'play', colorId: string, soundIndex: number): void
}>()

const bpm = ref(120)
const isPlaying = ref(false)
const currentStep = ref(-1)
const timer = ref<ReturnType<typeof setInterval> | null>(null)

// Initialize sequences (one boolean array per color)
const sequences = ref<boolean[][]>(
  props.colors.map(() => Array(16).fill(false))
)

function updateBpm(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseInt(target.value)
  if (value >= 60 && value <= 180) {
    bpm.value = value
    if (isPlaying.value) {
      stop()
      play()
    }
  }
}

function togglePlay() {
  isPlaying.value ? pause() : play()
}

function play() {
  if (!isPlaying.value) {
    isPlaying.value = true
    currentStep.value = currentStep.value === -1 ? 0 : currentStep.value
    startTimer()
  }
}

function pause() {
  isPlaying.value = false
  stopTimer()
}

function stop() {
  isPlaying.value = false
  stopTimer()
  currentStep.value = -1
}

function clear() {
  sequences.value = props.colors.map(() => Array(16).fill(false))
}

function startTimer() {
  stopTimer()
  const interval = (60 / bpm.value / 4) * 1000
  timer.value = setInterval(() => {
    tick()
  }, interval)
}

function stopTimer() {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

function tick() {
  currentStep.value = (currentStep.value + 1) % 16

  // Play sounds for active steps
  sequences.value.forEach((sequence, colorIndex) => {
    if (sequence[currentStep.value]) {
      const color = props.colors[colorIndex]
      emit('play', color.id, 0)
    }
  })
}

function toggleStep(rowIndex: number, step: number) {
  if (sequences.value[rowIndex]) {
    sequences.value[rowIndex][step] = !sequences.value[rowIndex][step]
  }
}

onUnmounted(() => {
  stopTimer()
})
</script>
