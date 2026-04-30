<template>
    <div class="bg-gray-50 rounded-xl p-4 space-y-4">

        <!-- Header -->
        <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-600">Instrumentos ({{ instruments.length }} canales)</span>
            <slot name="header" />
        </div>

        <!-- Knob grid -->
        <div class="grid gap-3" :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }">
            <KnobControl v-for="inst in instruments" :key="inst.key" :model-value="modelValue[inst.key]"
                :label="inst.label" :color="inst.color" :size="48" @update:model-value="v => onUpdate(inst.key, v)" />
        </div>

        <!-- Level bars -->
        <div v-if="showBars" class="space-y-1.5 pt-2 border-t border-gray-200">
            <div v-for="inst in instruments" :key="inst.key" class="flex items-center gap-2">
                <span class="text-[9px] font-medium text-gray-400 uppercase w-10 truncate flex-shrink-0">
                    {{ inst.label }}
                </span>
                <div class="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-150" :style="{
                        width: modelValue[inst.key] + '%',
                        background: inst.color
                    }" />
                </div>
                <span class="text-[9px] font-semibold text-gray-500 w-5 text-right tabular-nums">
                    {{ Math.round(modelValue[inst.key]) }}
                </span>
            </div>
        </div>

        <!-- Master level indicator -->
        <div v-if="showMaster" class="bg-white rounded-lg p-3 border border-gray-200">
            <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-medium text-gray-600">Nivel maestro</span>
                <span class="text-base font-semibold tabular-nums" :class="masterColor">
                    {{ Math.round(masterLevel) }}%
                </span>
            </div>
            <div class="h-5 bg-gray-100 rounded-lg overflow-hidden flex">
                <div v-for="n in 20" :key="n"
                    class="flex-1 border-r border-gray-200 last:border-r-0 transition-colors duration-100"
                    :class="masterSegmentClass(n)" />
            </div>
            <div class="flex justify-between mt-1 text-[9px] text-gray-400">
                <span>0%</span><span>50%</span><span>100%</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export type InstrumentKey = 'snare' | 'kick' | 'hat' | 'violin' | 'guitar' |
    'bass' | 'claps' | 'flute' | 'chorus' | 'kick2' | 'drum'

export interface InstrumentDef {
    key: InstrumentKey
    label: string
    color: string
}

export const INSTRUMENT_LIST: InstrumentDef[] = [
    { key: 'snare', label: 'Snare', color: '#ef4444' },
    { key: 'kick', label: 'Kick', color: '#f97316' },
    { key: 'hat', label: 'Hat', color: '#eab308' },
    { key: 'violin', label: 'Violin', color: '#8b5cf6' },
    { key: 'guitar', label: 'Guitar', color: '#ec4899' },
    { key: 'bass', label: 'Bass', color: '#14b8a6' },
    { key: 'claps', label: 'Claps', color: '#06b6d4' },
    { key: 'flute', label: 'Flute', color: '#22c55e' },
    { key: 'chorus', label: 'Chorus', color: '#a855f7' },
    { key: 'kick2', label: 'Kick 2', color: '#f59e0b' },
    { key: 'drum', label: 'Drum', color: '#3b82f6' },
]
</script>

<script setup lang="ts">
import { computed } from 'vue'
import Knobcontrol from './Knobcontrol.vue';

const props = withDefaults(defineProps<{
    modelValue: Record<InstrumentKey, number>
    /** Override list; defaults to all 11 instruments */
    instruments?: InstrumentDef[]
    showBars?: boolean
    showMaster?: boolean
    /** Number of columns in the knob grid */
    columns?: number
}>(), {
    instruments: () => INSTRUMENT_LIST,
    showBars: true,
    showMaster: true,
    columns: 6,
})

const emit = defineEmits<{
    (e: 'update:modelValue', v: Record<InstrumentKey, number>): void
}>()

function onUpdate(key: InstrumentKey, value: number) {
    emit('update:modelValue', { ...props.modelValue, [key]: value })
}

const masterLevel = computed(() => {
    const vals = props.instruments.map(i => props.modelValue[i.key])
    return vals.reduce((a, b) => a + b, 0) / vals.length
})

const masterColor = computed(() =>
    masterLevel.value < 50 ? 'text-green-600'
        : masterLevel.value < 75 ? 'text-yellow-600'
            : 'text-red-600'
)

function masterSegmentClass(n: number): string {
    const threshold = Math.round((masterLevel.value / 100) * 20)
    if (n > threshold) return 'bg-transparent'
    return n <= 10 ? 'bg-green-400' : n <= 15 ? 'bg-yellow-400' : 'bg-red-400'
}
</script>