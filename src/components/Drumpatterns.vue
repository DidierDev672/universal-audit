<template>
    <div class="space-y-3">

        <!-- Pattern selector -->
        <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-medium text-gray-600 mr-1">Patrón</span>
            <button v-for="p in patterns" :key="p.name" @click="selectPattern(p)"
                class="px-3 py-1.5 text-xs rounded-lg border transition-all duration-150" :class="activePattern === p.name
                    ? 'bg-purple-50 border-purple-200 text-purple-700 font-medium'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'">
                {{ p.name }}
            </button>

            <!-- Random re-roll -->
            <button v-if="showRandom" @click="rollRandom" class="px-3 py-1.5 text-xs rounded-lg border bg-white border-gray-200 text-gray-500
               hover:border-purple-200 hover:text-purple-600 transition-all duration-150 flex items-center gap-1.5">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Aleatorio
            </button>

            <!-- Clear -->
            <button @click="clearPattern" class="ml-auto px-3 py-1.5 text-xs rounded-lg border bg-white border-gray-200 text-gray-400
               hover:border-red-200 hover:text-red-500 transition-all duration-150">
                Limpiar
            </button>
        </div>

        <!-- Sequencer grid (16 steps × tracks) -->
        <div v-if="showGrid" class="space-y-1.5">

            <!-- Beat position bar -->
            <div class="flex gap-px" :style="{ paddingLeft: trackLabelWidth + 'px' }">
                <div v-for="s in steps" :key="s" class="flex-1 h-0.5 rounded-full transition-colors duration-75"
                    :class="currentStep === s - 1 && isPlaying ? 'bg-purple-400' : 'bg-gray-100'" />
            </div>

            <!-- Track rows -->
            <div v-for="(track, rowIdx) in grid" :key="rowIdx" class="flex items-center gap-1.5">
                <!-- Track label slot or default -->
                <div class="flex-shrink-0 text-[9px] font-medium text-gray-400 uppercase truncate"
                    :style="{ width: trackLabelWidth + 'px' }">
                    <slot name="track-label" :index="rowIdx">
                        {{ rowIdx + 1 }}
                    </slot>
                </div>

                <!-- Steps -->
                <div class="flex gap-px flex-1">
                    <button v-for="step in steps" :key="step" @click="toggleStep(rowIdx, step - 1)"
                        class="flex-1 rounded-sm transition-all duration-75" :style="{
                            height: stepHeight + 'px',
                            background: track[step - 1]
                                ? (trackColors[rowIdx] ?? '#8b5cf6')
                                : undefined
                        }" :class="[
                            track[step - 1] ? 'opacity-100' : 'bg-gray-100 hover:bg-gray-200',
                            isPlaying && currentStep === step - 1 ? 'brightness-110' : ''
                        ]" />
                </div>
            </div>
        </div>

        <!-- BPM + transport -->
        <div v-if="showTransport" class="flex items-center gap-3 pt-2 border-t border-gray-100">
            <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500">BPM</span>
                <input :value="bpm" type="number" min="40" max="240" class="w-14 text-sm font-semibold text-gray-700 text-center bg-white border border-gray-200
                 rounded-lg px-2 py-1 outline-none focus:border-purple-300"
                    @change="emit('update:bpm', Number(($event.target as HTMLInputElement).value))" />
            </div>

            <button @click="emit('toggle')"
                class="px-3 py-1.5 text-xs rounded-lg border transition-colors flex items-center gap-1.5" :class="isPlaying
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                    : 'bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100'">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path v-if="isPlaying" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    <path v-else d="M8 5v14l11-7z" />
                </svg>
                {{ isPlaying ? 'Detener' : 'Reproducir' }}
            </button>
        </div>
    </div>
</template>

<script lang="ts">
export interface DrumPattern {
    name: string
    pattern: number[][]
}

export const DEFAULT_PATTERNS: DrumPattern[] = [
    { name: 'House', pattern: [[0, 4], [8, 12], [2, 6, 10, 14], [0, 4, 8, 12]] },
    { name: 'Techno', pattern: [[0, 2, 4, 6, 8, 10, 12, 14], [], [1, 3, 5, 7, 9, 11, 13, 15], [4, 12]] },
    { name: 'Hip Hop', pattern: [[0, 5, 8, 13], [10], [4, 12], [2, 6, 10, 14]] },
]
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    /** Current sequencer grid: rows × 16 booleans */
    modelValue: boolean[][]
    /** Named patterns to offer as presets */
    patterns?: DrumPattern[]
    activePattern?: string
    isPlaying?: boolean
    currentStep?: number
    bpm?: number
    steps?: number
    /** One hex color per track row */
    trackColors?: string[]
    trackLabelWidth?: number
    stepHeight?: number
    showGrid?: boolean
    showTransport?: boolean
    showRandom?: boolean
}>(), {
    patterns: () => DEFAULT_PATTERNS,
    activePattern: '',
    isPlaying: false,
    currentStep: -1,
    bpm: 120,
    steps: 16,
    trackColors: () => [],
    trackLabelWidth: 24,
    stepHeight: 20,
    showGrid: true,
    showTransport: true,
    showRandom: true,
})

const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean[][]): void
    (e: 'update:activePattern', v: string): void
    (e: 'update:bpm', v: number): void
    (e: 'toggle'): void
}>()

// Convert the step-index arrays to a boolean grid aligned to current rows
function patternToGrid(pattern: number[][]): boolean[][] {
    return props.modelValue.map((_, rowIdx) => {
        const steps = pattern[rowIdx] ?? []
        return Array.from({ length: props.steps }, (_, s) => steps.includes(s))
    })
}

function selectPattern(p: DrumPattern) {
    emit('update:modelValue', patternToGrid(p.pattern))
    emit('update:activePattern', p.name)
}

function rollRandom() {
    const grid = props.modelValue.map(() =>
        Array.from({ length: props.steps }, () => Math.random() > 0.8)
    )
    emit('update:modelValue', grid)
    emit('update:activePattern', 'Aleatorio')
}

function clearPattern() {
    const grid = props.modelValue.map(() => Array<boolean>(props.steps).fill(false))
    emit('update:modelValue', grid)
    emit('update:activePattern', '')
}

function toggleStep(row: number, step: number) {
    const next = props.modelValue.map((track, r) =>
        r === row
            ? track.map((v, s) => s === step ? !v : v)
            : [...track]
    )
    emit('update:modelValue', next)
}

const grid = computed(() => props.modelValue)
</script>
