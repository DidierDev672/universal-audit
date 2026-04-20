<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
        <div class="max-w-4xl mx-auto space-y-6">

            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-semibold text-gray-800">Drum Controller</h2>
                    <p class="text-sm text-gray-400 mt-0.5">{{ colors.length }} pads · {{ totalSounds }} sonidos</p>
                </div>

                <div class="flex items-center gap-2">
                    <!-- BPM -->
                    <div class="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
                        <span class="text-xs text-gray-500">BPM</span>
                        <input v-model.number="bpm" type="number" min="40" max="240"
                            class="w-12 text-sm font-semibold text-gray-800 text-center bg-transparent outline-none"
                            @change="restartIfPlaying" />
                    </div>

                    <!-- Play / Stop -->
                    <button @click="toggleSequencer"
                        class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 flex items-center gap-2"
                        :class="isPlaying
                            ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                            : 'bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100'">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path v-if="isPlaying" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            <path v-else d="M8 5v14l11-7z" />
                        </svg>
                        {{ isPlaying ? 'Detener' : 'Reproducir' }}
                    </button>

                    <!-- Clear -->
                    <button @click="clearAll"
                        class="px-3 py-2 rounded-xl text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors">
                        Limpiar
                    </button>
                </div>
            </div>

            <!-- Pad Grid -->
            <div class="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                <button v-for="(colorItem, index) in colors" :key="colorItem.id" @click="triggerPad(index)"
                    class="relative aspect-square rounded-md overflow-hidden border transition-all duration-100" :class="[
                        activePads.includes(index)
                            ? 'scale-95 border-gray-400'
                            : 'border-gray-100 hover:border-gray-300 hover:opacity-90',
                        isPlaying && currentStep % colors.length === index
                            ? 'ring-2 ring-white ring-offset-1'
                            : ''
                    ]" :style="{ background: `linear-gradient(135deg, ${colorItem.color.slice(0, 4).join(', ')})` }"
                    :title="colorItem.id">
                    <!-- Label -->
                    <span
                        class="absolute bottom-1 left-1.5 text-[9px] font-medium text-white/75 uppercase tracking-wide truncate">
                        {{ colorItem.id }}
                    </span>

                    <!-- Sound count badge -->
                    <span v-if="colorItem.sound.length > 1"
                        class="absolute top-1 left-1 text-[8px] font-semibold text-white/60">
                        ×{{ colorItem.sound.length }}
                    </span>

                    <!-- Selected dot -->
                    <span v-if="selectedPads.includes(index)"
                        class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white/90" />

                    <!-- Active flash -->
                    <span v-if="activePads.includes(index)" class="absolute inset-0 bg-white/20 pointer-events-none" />
                </button>
            </div>

            <!-- Sequencer -->
            <div class="bg-white border border-gray-100 rounded-2xl p-4 space-y-2">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-medium text-gray-600">Secuenciador · 16 pasos</span>
                    <div class="flex gap-1">
                        <button v-for="p in presets" :key="p.name" @click="applyPreset(p)"
                            class="px-2 py-1 text-[10px] rounded-md border transition-colors" :class="currentPreset === p.name
                                ? 'bg-purple-50 border-purple-200 text-purple-700'
                                : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'">
                            {{ p.name }}
                        </button>
                    </div>
                </div>

                <!-- Beat position bar -->
                <div class="flex gap-px pl-16 mb-1">
                    <div v-for="s in 16" :key="s" class="flex-1 h-0.5 rounded-full transition-all duration-75"
                        :class="isPlaying && currentStep === s - 1 ? 'bg-purple-400' : 'bg-gray-100'" />
                </div>

                <!-- One row per color track -->
                <div v-for="(colorItem, rowIdx) in colors" :key="colorItem.id" class="flex items-center gap-2">
                    <!-- Track label -->
                    <div class="flex items-center gap-1.5 w-14 flex-shrink-0">
                        <div class="w-3 h-3 rounded-sm flex-shrink-0"
                            :style="{ background: colorItem.color[Math.min(3, colorItem.color.length - 1)] }" />
                        <span class="text-[9px] font-medium text-gray-500 uppercase truncate">{{ colorItem.id }}</span>
                    </div>

                    <!-- 16 step buttons -->
                    <div class="flex gap-px flex-1">
                        <button v-for="step in 16" :key="step" @click="toggleStep(rowIdx, step - 1)"
                            class="flex-1 h-5 rounded-sm transition-all duration-75" :class="[
                                sequence[rowIdx][step - 1] ? 'opacity-100' : 'bg-gray-100 hover:bg-gray-200',
                                isPlaying && currentStep === step - 1 ? 'brightness-110' : ''
                            ]" :style="sequence[rowIdx][step - 1]
                                ? { background: colorItem.color[Math.min(3, colorItem.color.length - 1)] }
                                : {}" />
                    </div>
                </div>
            </div>

            <!-- Selected pad detail panel -->
            <Transition enter-active-class="transition-all duration-200" enter-from-class="opacity-0 translate-y-1"
                leave-active-class="transition-all duration-150" leave-to-class="opacity-0">
                <div v-if="focusedPad !== null" class="bg-white border border-gray-100 rounded-2xl p-4">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2">
                            <div class="w-6 h-6 rounded"
                                :style="{ background: `linear-gradient(135deg, ${colors[focusedPad].color.slice(0, 3).join(', ')})` }" />
                            <span class="text-sm font-medium text-gray-800 capitalize">{{ colors[focusedPad].id
                            }}</span>
                            <span class="text-xs text-gray-400">
                                {{ colors[focusedPad].sound.length }} sonido{{ colors[focusedPad].sound.length !== 1 ?
                                    's' : '' }}
                            </span>
                        </div>
                        <button @click="focusedPad = null"
                            class="text-gray-300 hover:text-gray-500 text-lg leading-none">✕</button>
                    </div>

                    <!-- Color swatches -->
                    <div class="flex gap-px mb-3 rounded-lg overflow-hidden">
                        <div v-for="(hex, i) in colors[focusedPad].color" :key="i"
                            class="flex-1 h-8 cursor-pointer hover:scale-y-110 transition-transform origin-bottom"
                            :style="{ background: hex }" :title="hex" @click="copyHex(hex)" />
                    </div>

                    <!-- Sound list -->
                    <div class="space-y-1">
                        <button v-for="(url, si) in colors[focusedPad].sound" :key="si" @click="playSoundUrl(url)"
                            class="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-left group">
                            <svg class="w-3.5 h-3.5 flex-shrink-0 transition-colors"
                                :class="playingUrl === url ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-600'"
                                fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <span class="text-xs text-gray-600 truncate flex-1">{{ soundName(url) }}</span>
                            <!-- Playing animation -->
                            <span v-if="playingUrl === url" class="flex gap-px items-end h-3">
                                <span v-for="n in 3" :key="n" class="w-0.5 rounded-full animate-bounce" :style="{
                                    background: colors[focusedPad].color[Math.min(3, colors[focusedPad].color.length - 1)],
                                    animationDelay: n * 80 + 'ms',
                                    height: (5 + n * 2) + 'px'
                                }" />
                            </span>
                        </button>
                    </div>

                    <!-- Hex copied toast -->
                    <Transition enter-active-class="transition-opacity duration-150" enter-from-class="opacity-0"
                        leave-to-class="opacity-0">
                        <p v-if="copiedHex" class="mt-2 text-xs text-center text-gray-400">
                            ✓ {{ copiedHex }} copiado
                        </p>
                    </Transition>
                </div>
            </Transition>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue'
import FrequencySlider from '@/components/audio/FrequencySlider.vue'
import { useFrequencyControl } from '@/composables/useFrequencyControl'


// ... (rest of the code remains the same)
// ── Types ─────────────────────────────────────────────────────────────────────
interface Color {
    id: string
    color: string[]
    sound?: string[]
}

type KnobKey = 'env' | 'pan' | 'freq' | 'pass' | 'amp' | 'gain'
type InstrumentKey = 'snare' | 'kick' | 'hat' | 'violin' | 'guitar' | 'bass' |
    'claps' | 'flute' | 'chorus' | 'kick2' | 'drum'

// ── Data ──────────────────────────────────────────────────────────────────────
const colors = ref<Color[]>([
    { id: 'yellow', color: ['#FEFCE8', '#FEF9C3', '#FEF08A', '#FDE047', '#FACC15', '#EAB308'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/yellow-chime.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/yellow-chimeII.mp3'] },
    { id: 'amber', color: ['#FFFBEB', '#FEF3C7', '#FDE68A', '#FCD34D', '#FBBF24', '#F59E0B'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/amber_tree.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/amber_treeII.mp3'] },
    { id: 'green', color: ['#BBF7D0', '#86EFAC', '#4ADE80', '#22C55E', '#16A34A', '#15803D', '#166534', '#14532D', '#052E16'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Nature_Crickets.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Nature_Birds.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Nature_%20Mosquitos.mp3'] },
    { id: 'emerald', color: ['#A7F3D0', '#6EE7B7', '#34D399', '#10B981', '#059669', '#047857', '#065F46', '#064E3B', '#022C22'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Cartoon_Pop_Pull.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Food_Drink_Bottle.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Food_Drink_Tableware_Spoon.mp3'] },
    { id: 'lime', color: ['#D9F99D', '#BEF264', '#A3E635', '#84CC16', '#65A30D', '#4D7C0F', '#7F6212', '#365314', '#1A2E05'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Food_Glass.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Glass_Break_Dry_Variation.mp3'] },
    { id: 'red', color: ['#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D', '#450A0A'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/PadSwellSpacecraft.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Pop_Various.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Retro_Beeps_Success.mp3'] },
    { id: 'orange', color: ['#FED7AA', '#FDBA74', '#FB923C', '#F97316', '#EA580C', '#C2410C', '#9A3412', '#7C2D12', '#431407'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/RumbleDrone.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/SwellMysticPad.mp3'] },
    { id: 'pink', color: ['#FECDD3', '#FDA4AF', '#FB7185', '#F43F5E', '#E11D48', '#BE123C', '#9F1239', '#881337', '#4C0519'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Vehicles_Misc_Tap_Rhythmic.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/HumanMetalRunIsolatedSteps.mp3'] },
    { id: 'blue', color: ['#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A', '#172554'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Synthetic_Bubble.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/WinterSubwayPassingTraffic.mp3'] },
    { id: 'sky', color: ['#BAE6FD', '#7DD3FC', '#38BDF8', '#0EA5E9', '#0284C7', '#0369A1', '#075985', '#0C4A6E', '#082F49'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Water_Splash.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Water_Sound.mp3'] },
    { id: 'cyan', color: ['#A5F3FC', '#67E8F9', '#22D3EE', '#06B6D4', '#0891B2', '#0E7490', '#155E75', '#164E63', '#083344'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/WaterBubblesBubbleSplash.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Water_Splash_Splat.mp3'] },
    { id: 'fuchsia', color: ['#F5D0FE', '#F0ABFC', '#E879F9', '#D946EF', '#C026D3', '#A21CAF', '#86198F', '#701A75', '#4A044E'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/WinterSubwayPassingTraffic.mp3'] },
    { id: 'purple', color: ['#DDD6FE', '#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#370764'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/BicycleBell.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Cartoon_Pop_Pull.mp3'] },
    { id: 'indigo', color: ['#C7D2FE', '#A5B4FC', '#818CF8', '#6366F1', '#4F46E5', '#4338CA', '#3730A3', '#312E81', '#1E1B4B'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/DarkSyntn.mp3'] },
    { id: 'violet', color: ['#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#2E1065'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/MediumLargeBells.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/MorphingSynthDowner.mp3'] },
])

// ── Equalizer knobs ───────────────────────────────────────────────────────────
const equalizerKnobs = ref<Record<KnobKey, number>>({
    env: 70, pan: 0, freq: 50, pass: 50, amp: 75, gain: 60,
})


// ── Instrument levels ─────────────────────────────────────────────────────────
const instrumentLevels = ref<Record<InstrumentKey, number>>({
    snare: 65, kick: 80, hat: 45, violin: 55, guitar: 70,
    bass: 75, claps: 50, flute: 40, chorus: 60, kick2: 70, drum: 85,
})

// ── Frequency bands ───────────────────────────────────────────────────────────
const frequencyBands = ref([
    { key: '4k', label: '4KHz', range: '4KHz', level: 65, color: '#ef4444' },
    { key: '10k', label: '10KHz', range: '10KHz', level: 50, color: '#f97316' },
    { key: '3.5-4.4k', label: '3.5-4.4K', range: '3.5 KHz – 4.4 KHz', level: 55, color: '#eab308' },
    { key: '10-20k', label: '10-20K', range: '10 KHz – 20 KHz', level: 40, color: '#22c55e' },
    { key: '2-5k', label: '2-5K', range: '2000 – 5000 Hz', level: 70, color: '#06b6d4' },
    { key: '250-8k', label: '250-8K', range: '250 – 8000 Hz', level: 60, color: '#3b82f6' },
    { key: '20-250', label: '20-250Hz', range: '20 Hz – 250 Hz', level: 75, color: '#8b5cf6' },
    { key: '5-20k', label: '5-20K', range: '5000 Hz – 20000 Hz', level: 45, color: '#ec4899' },
])

const drumPatterns = [
    { name: 'House', pattern: [[0, 4], [8, 12], [2, 6, 10, 14], [0, 4, 8, 12]] as number[][] },
    { name: 'Techno', pattern: [[0, 2, 4, 6, 8, 10, 12, 14], [], [1, 3, 5, 7, 9, 11, 13, 15], [4, 12]] as number[][] },
    { name: 'Hip Hop', pattern: [[0, 5, 8, 13], [10], [4, 12], [2, 6, 10, 14]] as number[][] },
    {
        name: 'Random', pattern: Array.from({ length: 16 }, () =>
            Math.random() > 0.5 ? [Math.floor(Math.random() * 4)] : []) as number[][]
    },
]

const bpm = ref(120)
const isPlaying = ref(false)
const currentStep = ref(-1)
const activePads = ref<number[]>([])
const selectedPads = ref<number[]>([])
const focusedPad = ref<number | null>(null)
const playingUrl = ref<string | null>(null)
const copiedHex = ref<string | null>(null)
const currentPreset = ref('')

// 15 rows × 16 steps
const sequence = ref<boolean[][]>(
    colors.value.map(() => Array<boolean>(16).fill(false))
)

// ── Computed ──────────────────────────────────────────────────────────────────
const totalSounds = computed(() =>
    colors.value.reduce((sum, c) => sum + c.sound.length, 0)
)

// ── Presets ───────────────────────────────────────────────────────────────────
type PresetFn = (rows: number) => boolean[][]

const presets: { name: string; fn: PresetFn }[] = [
    {
        name: 'House',
        fn: (rows) => Array.from({ length: rows }, (_, r) =>
            Array.from({ length: 16 }, (_, s) => [0, 4, 8, 12].includes(s) && r < 4)
        ),
    },
    {
        name: 'Techno',
        fn: (rows) => Array.from({ length: rows }, (_, r) =>
            Array.from({ length: 16 }, (_, s) => s % 2 === 0 && r % 3 === 0)
        ),
    },
    {
        name: 'Random',
        fn: (rows) => Array.from({ length: rows }, () =>
            Array.from({ length: 16 }, () => Math.random() > 0.8)
        ),
    },
]

function applyPreset(p: { name: string; fn: PresetFn }) {
    sequence.value = p.fn(colors.value.length)
    currentPreset.value = p.name
}

// ── Sequencer ─────────────────────────────────────────────────────────────────
let timer: ReturnType<typeof setInterval> | null = null

function toggleSequencer() {
    isPlaying.value ? stopSequencer() : startSequencer()
}

function startSequencer() {
    if (timer) clearInterval(timer)
    isPlaying.value = true
    currentStep.value = -1
    const interval = Math.round(60000 / bpm.value / 4)
    timer = setInterval(() => {
        currentStep.value = (currentStep.value + 1) % 16
        sequence.value.forEach((track, rowIdx) => {
            if (track[currentStep.value]) {
                triggerSound(rowIdx)
                flashPad(rowIdx)
            }
        })
    }, interval)
}

function stopSequencer() {
    if (timer) { clearInterval(timer); timer = null }
    isPlaying.value = false
    currentStep.value = -1
}

function restartIfPlaying() {
    if (isPlaying.value) startSequencer()
}

// ── Pad interaction ────────────────────────────────────────────────────────────
function triggerPad(index: number) {
    flashPad(index)
    triggerSound(index)
    focusedPad.value = focusedPad.value === index ? null : index
    const si = selectedPads.value.indexOf(index)
    si > -1 ? selectedPads.value.splice(si, 1) : selectedPads.value.push(index)
}

function toggleStep(row: number, step: number) {
    sequence.value[row][step] = !sequence.value[row][step]
    if (sequence.value[row][step]) triggerSound(row)
}

function flashPad(index: number) {
    activePads.value.push(index)
    setTimeout(() => {
        activePads.value = activePads.value.filter(i => i !== index)
    }, 140)
}

// Picks a random sound from the color's array and plays it
function triggerSound(rowIdx: number) {
    const c = colors.value[rowIdx]
    if (!c.sound.length) return
    const url = c.sound[Math.floor(Math.random() * c.sound.length)]
    new Audio(url).play().catch(() => { })
}

function clearAll() {
    stopSequencer()
    sequence.value = colors.value.map(() => Array<boolean>(16).fill(false))
    selectedPads.value = []
    focusedPad.value = null
    currentPreset.value = ''
}

// ── Sound preview (detail panel) ──────────────────────────────────────────────
function playSoundUrl(url: string) {
    playingUrl.value = url
    const audio = new Audio(url)
    audio.play().catch(() => { })
    const clear = () => { if (playingUrl.value === url) playingUrl.value = null }
    audio.onended = clear
    setTimeout(clear, 10000)
}

function soundName(url: string): string {
    return decodeURIComponent(url.split('/').pop() ?? url)
        .replace(/\.mp3$/i, '')
        .replace(/[_-]/g, ' ')
}

// ── Hex copy ──────────────────────────────────────────────────────────────────
async function copyHex(hex: string) {
    try { await navigator.clipboard.writeText(hex) } catch { /* silent */ }
    copiedHex.value = hex
    setTimeout(() => { copiedHex.value = null }, 1800)
}

// ── Cleanup ───────────────────────────────────────────────────────────────────
onUnmounted(() => stopSequencer())
</script>

<style scoped>
.floating-icon {
    animation: float 20s ease-in-out infinite;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    25% {
        transform: translateY(-20px) rotate(2deg);
    }

    50% {
        transform: translateY(-10px) rotate(-1deg);
    }

    75% {
        transform: translateY(-30px) rotate(1deg);
    }
}
</style>