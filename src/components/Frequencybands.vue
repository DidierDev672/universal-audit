<template>
    <div class="bg-gray-50 rounded-xl p-4 space-y-3">

        <!-- Header -->
        <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-600">Bandas de frecuencia</span>
            <slot name="header" />
        </div>

        <!-- Vertical sliders -->
        <div class="flex items-end justify-center gap-3" :style="{ height: barHeight + 40 + 'px' }">
            <div v-for="band in modelValue" :key="band.key" class="flex flex-col items-center gap-1">
                <!-- Bar + invisible range input on top -->
                <div class="relative rounded-full overflow-hidden bg-gray-200"
                    :style="{ width: barWidth + 'px', height: barHeight + 'px' }">
                    <input type="range" :value="band.level" min="0" max="100" step="1"
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        style="writing-mode: vertical-lr; direction: rtl;"
                        @input="onInput(band.key, ($event.target as HTMLInputElement).value)" />
                    <div class="absolute bottom-0 left-0 right-0 transition-all duration-100 rounded-full" :style="{
                        height: band.level + '%',
                        background: band.color
                    }" />
                </div>

                <!-- Label -->
                <span class="text-[9px] text-gray-500 font-medium whitespace-nowrap">
                    {{ band.label }}
                </span>
                <span class="text-[9px] font-semibold text-gray-600 tabular-nums">
                    {{ Math.round(band.level) }}
                </span>
            </div>
        </div>

        <!-- Range labels -->
        <div v-if="showRanges" class="space-y-0.5 pt-2 border-t border-gray-200">
            <div v-for="band in modelValue" :key="band.key" class="flex items-center gap-2 text-[9px]">
                <div class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: band.color }" />
                <span class="text-gray-400">{{ band.range }}</span>
                <span class="ml-auto font-medium text-gray-500 tabular-nums">{{ Math.round(band.level) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface FrequencyBand {
    key: string
    label: string
    range: string
    level: number
    color: string
}


const props = withDefaults(defineProps<{
    modelValue: FrequencyBand[]
    barHeight?: number
    barWidth?: number
    showRanges?: boolean
}>(), {
    barHeight: 80,
    barWidth: 28,
    showRanges: false,
})

const emit = defineEmits<{
    (e: 'update:modelValue', v: FrequencyBand[]): void
}>()

function onInput(key: string, raw: string) {
    const level = Math.max(0, Math.min(100, Number(raw)))
    emit('update:modelValue',
        props.modelValue.map(b => b.key === key ? { ...b, level } : b)
    )
}
</script>