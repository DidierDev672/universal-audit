<template>
    <div class="bg-gray-50 rounded-xl p-4 space-y-4">

        <!-- Header slot -->
        <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-600">Equalizador</span>
            <slot name="header" />
        </div>

        <!-- Knob rows -->
        <div class="flex justify-center gap-6 flex-wrap">
            <KnobControl v-for="knob in knobConfig" :key="knob.key" :model-value="modelValue[knob.key]"
                :label="knob.label" :color="knob.color" :size="knob.size ?? 64" :is-pan="knob.key === 'pan'"
                @update:model-value="v => emit('update:modelValue', { ...modelValue, [knob.key]: v })" />
        </div>

        <!-- Reset button -->
        <div class="flex justify-center" v-if="showReset">
            <button @click="resetKnobs"
                class="text-xs text-gray-400 hover:text-gray-600 transition-colors px-3 py-1 rounded-lg hover:bg-gray-100">
                Resetear
            </button>
        </div>
    </div>
</template>

<script lang="ts">
export type KnobKey = 'env' | 'pan' | 'freq' | 'pass' | 'amp' | 'gain'

export interface KnobConfig {
    key: KnobKey
    label: string
    color: string
    size?: number
}

export const KNOB_DEFAULTS: Record<KnobKey, number> = {
    env: 70, pan: 0, freq: 50, pass: 50, amp: 75, gain: 60,
}

export const KNOB_CONFIG: KnobConfig[] = [
    { key: 'env', label: 'ENV', color: '#8b5cf6' },
    { key: 'pan', label: 'PAN', color: '#06b6d4' },
    { key: 'freq', label: 'FREQ', color: '#f59e0b' },
    { key: 'pass', label: 'PASS', color: '#ef4444' },
    { key: 'amp', label: 'AMP', color: '#22c55e' },
    { key: 'gain', label: 'GAIN', color: '#ec4899' },
]
</script>

<script setup lang="ts">
import Knobcontrol from './Knobcontrol.vue';

const props = withDefaults(defineProps<{
    modelValue: Record<KnobKey, number>
    /** Override which knobs to show and in what order */
    knobConfig?: KnobConfig[]
    showReset?: boolean
}>(), {
    knobConfig: () => KNOB_CONFIG,
    showReset: true,
})

const emit = defineEmits<{
    (e: 'update:modelValue', v: Record<KnobKey, number>): void
}>()

function resetKnobs() {
    emit('update:modelValue', { ...KNOB_DEFAULTS })
}

</script>