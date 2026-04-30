<template>
  <button class="relative w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg transition-all duration-150 overflow-hidden"
    :style="{
      backgroundColor: color,
      boxShadow: isActive
        ? `0 0 20px ${color}, inset 0 0 10px rgba(255,255,255,0.3)`
        : 'inset 0 2px 4px rgba(0,0,0,0.3)'
    }" :class="{
      'scale-95': isPressed,
      'scale-100': !isPressed,
      'brightness-110': isActive
    }" @mousedown="handlePress" @mouseup="handleRelease" @mouseleave="handleRelease"
    @touchstart.prevent="handleTouchStart" @touchend.prevent="handleTouchEnd">
    <!-- Flash overlay -->
    <div class="absolute inset-0 bg-white transition-opacity duration-200 pointer-events-none"
      :class="flashOpacity === 100 ? 'opacity-100' : 'opacity-0'" />

    <!-- Keyboard shortcut label -->
    <span v-if="keyboardShortcut"
      class="absolute bottom-0.5 right-1 text-[8px] font-mono text-black/50 uppercase select-none">
      {{ keyboardShortcut }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  color: string
  colorId: string
  padIndex: number
  keyboardShortcut?: string
  playMode: 'trigger' | 'hold'
}>()

const emit = defineEmits<{
  (e: 'play', colorId: string, padIndex: number): void
  (e: 'stop', colorId: string): void
}>()

const isPressed = ref(false)
const isActive = ref(false)
const flashOpacity = ref(0)

function triggerPad() {
  isPressed.value = true
  flashOpacity.value = 100
  emit('play', props.colorId, props.padIndex)

  setTimeout(() => {
    flashOpacity.value = 0
  }, 200)

  setTimeout(() => {
    isPressed.value = false
  }, 150)
}

function handlePress() {
  if (props.playMode === 'trigger') {
    triggerPad()
  } else {
    // Hold mode
    isPressed.value = true
    isActive.value = true
    flashOpacity.value = 100
    emit('play', props.colorId, props.padIndex)
  }
}

function handleRelease() {
  if (props.playMode === 'hold') {
    isPressed.value = false
    isActive.value = false
    flashOpacity.value = 0
    emit('stop', props.colorId)
  }
}

function handleTouchStart() {
  handlePress()
}

function handleTouchEnd() {
  handleRelease()
}
</script>
