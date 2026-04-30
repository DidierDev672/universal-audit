<template>
  <div class="min-h-screen bg-[#0B0F12] p-6 font-mono" tabindex="0" @keydown="handleKeydown" @keyup="handleKeyup">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-200 tracking-tight">
            DRUM<span class="text-purple-500">CONTROLLER</span>
          </h1>
          <p class="text-sm text-gray-600 mt-1">
            {{ colors.length }} tracks · {{ totalSounds }} sounds
          </p>
        </div>

        <!-- Controls -->
        <DrumControls v-model:volume="volume" v-model:play-mode="playMode" :is-ready="isReady" :progress="progress" />
      </div>

      <!-- Pad Grid -->
      <div class="bg-[#111827] border border-[#1F2937] rounded-lg p-4 space-y-2">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-mono text-gray-500 uppercase">Pad Controller</span>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-600">Atajos:</span>
            <span class="text-xs font-mono text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">Q W E R</span>
            <span class="text-xs font-mono text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">A S D F</span>
          </div>
        </div>

        <DrumPadRow v-for="(color, index) in colors" :key="color.id" :color="color" :play-mode="playMode"
          :row-index="index" @play="handlePadPlay" @stop="handlePadStop" />
      </div>

      <!-- Sequencer -->
      <DrumSequencer :colors="colors" @play="handleSequencerPlay" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { colors, type Color } from '@/data/colors'
import { useDrumAudio } from '@/composables/useDrumAudio'
import DrumPadRow from './DrumPadRow.vue'
import DrumSequencer from './DrumSequencer.vue'
import DrumControls from './DrumControls.vue'

// Audio setup
const { isReady, progress, loadAllSounds, playSound, setVolume, getSoundIndexForPad } = useDrumAudio(colors.value)

// State
const volume = ref(80)
const playMode = ref<'trigger' | 'hold'>('trigger')
const activeSources = ref<Map<string, AudioBufferSourceNode>>(new Map())

// Computed
const totalSounds = computed(() =>
  colors.value.reduce((sum: number, c: Color) => sum + c.sound.length, 0)
)

// Watch volume changes
watch(volume, (newVal: number) => {
  setVolume(newVal)
})

// Load sounds on mount
onMounted(() => {
  loadAllSounds()
})

// Pad event handlers
function handlePadPlay(colorId: string, padIndex: number) {
  const color = colors.value.find((c: Color) => c.id === colorId)
  if (!color) return

  const soundIndex = getSoundIndexForPad(color, padIndex)

  if (playMode.value === 'hold') {
    // In hold mode, we need to track the source to stop it later
    const source = playSound(colorId, soundIndex)
    if (source) {
      activeSources.value.set(colorId, source)
    }
  } else {
    // In trigger mode, just play
    playSound(colorId, soundIndex)
  }
}

function handlePadStop(colorId: string) {
  if (playMode.value === 'hold') {
    const source = activeSources.value.get(colorId)
    if (source) {
      try {
        source.stop()
      } catch {
        // Source might already be stopped
      }
      activeSources.value.delete(colorId)
    }
  }
}

// Sequencer event handler
function handleSequencerPlay(colorId: string, soundIndex: number) {
  playSound(colorId, soundIndex)
}

// Keyboard handlers
const keyboardMap: Record<string, { colorId: string; padIndex: number }> = {}

// Build keyboard map for first row only
if (colors.value.length > 0) {
  const firstColor = colors.value[0]
  const shortcuts = ['q', 'w', 'e', 'r', 'a', 's', 'd', 'f']
  firstColor.color.forEach((_: string, index: number) => {
    if (shortcuts[index]) {
      keyboardMap[shortcuts[index]] = { colorId: firstColor.id, padIndex: index }
    }
  })
}

const pressedKeys = ref<Set<string>>(new Set())

function handleKeydown(event: KeyboardEvent) {
  const key = event.key.toLowerCase()

  if (keyboardMap[key] && !pressedKeys.value.has(key)) {
    pressedKeys.value.add(key)
    const { colorId, padIndex } = keyboardMap[key]
    handlePadPlay(colorId, padIndex)
  }
}

function handleKeyup(event: KeyboardEvent) {
  const key = event.key.toLowerCase()

  if (keyboardMap[key]) {
    pressedKeys.value.delete(key)
    const { colorId } = keyboardMap[key]
    handlePadStop(colorId)
  }
}

// Cleanup
onUnmounted(() => {
  activeSources.value.forEach((source) => {
    try {
      source.stop()
    } catch {
      // Ignore errors
    }
  })
  activeSources.value.clear()
})
</script>
