<template>
  <div class="flex items-center gap-2">
    <!-- Color label -->
    <span class="w-16 text-xs font-mono text-gray-500 uppercase shrink-0">
      {{ color.id }}
    </span>

    <!-- Pads -->
    <div class="flex gap-1.5">
      <DrumPad v-for="(tone, index) in color.color" :key="index" :color="tone" :color-id="color.id" :pad-index="index"
        :keyboard-shortcut="getKeyboardShortcut(index)" :play-mode="playMode"
        @play="(colorId, padIndex) => $emit('play', colorId, padIndex)" @stop="(colorId) => $emit('stop', colorId)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DrumPad from './DrumPad.vue'
import type { Color } from '@/data/colors'

const props = defineProps<{
  color: Color
  playMode: 'trigger' | 'hold'
  rowIndex: number
}>()

const emit = defineEmits<{
  (e: 'play', colorId: string, padIndex: number): void
  (e: 'stop', colorId: string): void
}>()

// Keyboard shortcuts for first 8 pads (q w e r a s d f)
const shortcuts = ['q', 'w', 'e', 'r', 'a', 's', 'd', 'f']

function getKeyboardShortcut(padIndex: number): string | undefined {
  // Only first row gets keyboard shortcuts
  if (props.rowIndex !== 0) return undefined
  return shortcuts[padIndex]
}
</script>
