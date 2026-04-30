<template>
    <div class="flex flex-col items-center gap-2">
        <div class="relative select-none cursor-pointer" :style="{ width: size + 'px', height: size + 'px' }"
            @mousedown.prevent="onDragStart" @touchstart.prevent="onDragStart">
            <!-- Track ring -->
            <svg class="w-full h-full -rotate-90" :viewBox="`0 0 ${size} ${size}`">
                <circle :cx="size / 2" :cy="size / 2" :r="radius" fill="none" stroke="#e5e7eb"
                    :stroke-width="trackWidth" />
                <circle :cx="size / 2" :cy="size / 2" :r="radius" fill="none" :stroke="color" :stroke-width="trackWidth"
                    stroke-linecap="round" :stroke-dasharray="`${arc} ${circumference}`"
                    :stroke-dashoffset="isPan ? panOffset : 0" />
            </svg>

            <!-- Knob dial -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="rounded-full bg-white shadow-md flex items-center justify-center relative" :style="{
                    width: dialSize + 'px',
                    height: dialSize + 'px',
                    transform: `rotate(${rotation}deg)`
                }">
                    <div class="rounded-full absolute" :style="{
                        width: '3px',
                        height: Math.round(dialSize * 0.28) + 'px',
                        background: color,
                        top: '3px'
                    }" />
                </div>
            </div>

            <!-- Value label -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span class="font-semibold text-gray-700 tabular-nums"
                    :style="{ fontSize: Math.round(size * 0.19) + 'px' }">
                    {{ displayValue }}
                </span>
            </div>
        </div>

        <span class="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
            {{ label }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'


const props = withDefaults(defineProps<{
    modelValue: number
    label: string
    color?: string
    size?: number
    /** If true, range is -50..50 (pan), otherwise 0..100 */
    isPan?: boolean
}>(), {
    color: '#8b5cf6',
    size: 64,
    isPan: false,
})


const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>()

// ── Geometry ──────────────────────────────────────────────────────────────────

const trackWidth = computed(() => Math.max(3, Math.round(props.size * 0.063)))
const radius = computed(() => props.size / 2 - trackWidth.value / 2 - 1)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dialSize = computed(() => Math.round(props.size * 0.625))

/** Arc length for the colored portion (0..100 or -50..50) */
const arc = computed(() => {
    if (props.isPan) {
        // half of circumference = center; extra on each side
        return (Math.abs(props.modelValue) / 50) * (circumference.value * 0.5)
    }
    return (props.modelValue / 100) * circumference.value
})


/** For pan: shift dashoffset so arc starts at center (top after -rotate-90) */
const panOffset = computed(() =>
    props.modelValue >= 0 ? 0 : -circumference.value * 0.5
)

/** Rotation of the dial indicator: -135° = min, +135° = max */
const rotation = computed(() =>
    props.isPan
        ? (props.modelValue / 50) * 135
        : (props.modelValue / 100) * 270 - 135
)

const displayValue = computed(() => {
    if (!props.isPan) return Math.round(props.modelValue)
    const v = props.modelValue
    if (v === 0) return 'C'
    return v > 0 ? `R${Math.round(v)}` : `L${Math.round(Math.abs(v))}`
})

// ── Drag ──────────────────────────────────────────────────────────────────────
let startY = 0
let startValue = 0


function onDragStart(e: MouseEvent | TouchEvent) {
    startY = 'touches' in e ? e.touches[0]!.clientY : e.clientY
    startValue = props.modelValue
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', onDragEnd)
    document.addEventListener('touchmove', onDrag, { passive: false })
    document.addEventListener('touchend', onDragEnd)
}

function onDrag(e: MouseEvent | TouchEvent) {
    if (e.cancelable) e.preventDefault()
    const clientY = 'touches' in e ? e.touches[0]!.clientY : e.clientY
    const delta = (startY - clientY) * 1.5
    const raw = startValue + delta
    const clamped = props.isPan
        ? Math.max(-50, Math.min(50, raw))
        : Math.max(0, Math.min(100, raw))
    emit('update:modelValue', clamped)
}

function onDragEnd() {
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', onDragEnd)
    document.removeEventListener('touchmove', onDrag)
    document.removeEventListener('touchend', onDragEnd)
}
</script>