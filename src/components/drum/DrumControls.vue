<template>
  <div class="bg-[#111827]/80 backdrop-blur-sm border border-[#1F2937] rounded-lg p-4">
    <div class="flex flex-wrap items-center gap-6">
      <!-- Loading indicator -->
      <div v-if="!isReady" class="flex items-center gap-3">
        <div class="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            :style="{ width: `${progress}%` }"
          />
        </div>
        <span class="text-xs font-mono text-gray-500">
          {{ progress }}%
        </span>
      </div>
      
      <div v-else class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span class="text-xs font-mono text-green-500">READY</span>
      </div>
      
      <!-- Master Volume -->
      <div class="flex items-center gap-3">
        <span class="text-xs font-mono text-gray-500 uppercase">Volumen</span>
        <input
          :value="volume"
          type="range"
          min="0"
          max="100"
          class="w-32 h-1 bg-gray-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:transition-colors [&::-webkit-slider-thumb]:hover:bg-purple-400"
          @input="updateVolume($event)"
        >
        <span class="w-10 text-xs font-mono text-gray-400 text-right">
          {{ volume }}
        </span>
      </div>
      
      <!-- Play Mode -->
      <div class="flex items-center gap-2">
        <span class="text-xs font-mono text-gray-500 uppercase">Modo</span>
        <div class="flex rounded border border-[#1F2937] overflow-hidden">
          <button
            class="px-3 py-1.5 text-xs font-mono transition-colors"
            :class="playMode === 'trigger'
              ? 'bg-purple-500/30 text-purple-400'
              : 'bg-transparent text-gray-500 hover:text-gray-400'"
            @click="setPlayMode('trigger')"
          >
            TRIGGER
          </button>
          <button
            class="px-3 py-1.5 text-xs font-mono transition-colors border-l border-[#1F2937]"
            :class="playMode === 'hold'
              ? 'bg-purple-500/30 text-purple-400'
              : 'bg-transparent text-gray-500 hover:text-gray-400'"
            @click="setPlayMode('hold')"
          >
            HOLD
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isReady: boolean
  progress: number
  volume: number
  playMode: 'trigger' | 'hold'
}>()

const emit = defineEmits<{
  (e: 'update:volume', value: number): void
  (e: 'update:playMode', mode: 'trigger' | 'hold'): void
}>()

function updateVolume(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:volume', parseInt(target.value))
}

function setPlayMode(mode: 'trigger' | 'hold') {
  emit('update:playMode', mode)
}
</script>
