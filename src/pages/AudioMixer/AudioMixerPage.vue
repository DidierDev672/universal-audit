<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6 relative overflow-hidden">

        <!-- ── Background floating icons ── -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <div v-for="icon in backgroundIcons" :key="icon.id" class="floating-icon absolute" :class="icon.colorClass"
                :style="{ top: icon.top, left: icon.left, animationDelay: icon.delay }" v-html="icon.svg" />
        </div>

        <!-- ── Main content ── -->
        <div class="relative z-10 space-y-6">

            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-semibold text-gray-800">Audio Mixer</h2>
                    <p class="text-sm text-gray-400 mt-0.5">{{ colors.length }} familias de colores</p>
                </div>

                <!-- Search -->
                <div class="relative">
                    <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <input v-model="search" type="text" placeholder="Buscar color..." class="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl
                   focus:ring-2 focus:ring-purple-400 focus:border-transparent
                   outline-none w-48 bg-white" />
                </div>
            </div>

            <!-- ── Panel de selecciones (solo si hay selecciones) ── -->
            <div v-if="colorStore.hasSelections" class="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">

                <div class="flex items-center justify-between">
                    <h4 class="text-sm font-medium text-gray-700">
                        Colores seleccionados ({{ colorStore.selectionCount }})
                    </h4>
                    <button @click="colorStore.clearSelections()"
                        class="text-xs text-red-500 hover:text-red-600 transition-colors">
                        Limpiar todo
                    </button>
                </div>

                <!-- Gradient visual -->
                <div v-if="colorStore.selectedColors.length > 0" class="h-4 rounded-full w-full"
                    :style="{ background: selectedColorsGradient }" />

                <!-- Chips de colores seleccionados -->
                <div class="flex flex-wrap gap-2">
                    <div v-for="color in colorStore.selectedColors" :key="color.id"
                        class="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <div class="w-4 h-4 rounded-full" :style="{ background: color.color[5] }" />
                        <span class="text-sm text-gray-700 capitalize">{{ color.id }}</span>
                        <button @click="removeFromSelection(color.id)"
                            class="text-gray-400 hover:text-red-500 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Controles de audio mixer -->
                <div v-if="selectedColorsWithSound.length > 0"
                    class="bg-white rounded-lg p-3 border border-gray-200 space-y-3">

                    <!-- Fila: Play + Volumen -->
                    <div class="flex items-center gap-3">
                        <button @click="toggleMixerPlayback"
                            class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 flex-shrink-0"
                            :class="isMixerPlaying
                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                : 'bg-purple-100 text-purple-600 hover:bg-purple-200'">
                            <svg v-if="!isMixerPlaying" class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                        </button>

                        <div class="flex-1">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-xs text-gray-600 font-medium">Mixer de Sonidos</span>
                                <span class="text-xs text-gray-400">{{ Math.round(mixerVolume * 100) }}%</span>
                            </div>
                            <input type="range" v-model.number="mixerVolume" min="0" max="1" step="0.01"
                                @input="updateMixerVolume"
                                class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                        </div>
                    </div>

                    <!-- Equalizador Principal (sección independiente) -->
                    <div class="pt-3 border-t border-gray-100">
                        <p class="text-xs text-gray-600 font-medium mb-2">Equalizador</p>
                        <div class="grid grid-cols-3 gap-2 mb-3">
                            <!-- Bass -->
                            <div class="bg-gray-50 rounded-lg p-2">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-xs text-gray-500">Bass</span>
                                    <span class="text-xs text-gray-400">{{ Math.round(equalizer.bass) }}%</span>
                                </div>
                                <input type="range" v-model.number="equalizer.bass" min="0" max="100" step="1"
                                    @input="updateEqualizer"
                                    class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                            </div>
                            <!-- Stereo -->
                            <div class="bg-gray-50 rounded-lg p-2">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-xs text-gray-500">Stereo</span>
                                    <span class="text-xs text-gray-400">{{ Math.round(equalizer.stereo) }}%</span>
                                </div>
                                <input type="range" v-model.number="equalizer.stereo" min="0" max="100" step="1"
                                    @input="updateEqualizer"
                                    class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500" />
                            </div>
                            <!-- Sound -->
                            <div class="bg-gray-50 rounded-lg p-2">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-xs text-gray-500">Sound</span>
                                    <span class="text-xs text-gray-400">{{ Math.round(equalizer.sound) }}%</span>
                                </div>
                                <input type="range" v-model.number="equalizer.sound" min="0" max="100" step="1"
                                    @input="updateEqualizer"
                                    class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                            </div>
                        </div>

                        <!-- Barras de frecuencia -->
                        <div class="flex items-end justify-center gap-4 h-32 bg-gray-50 rounded-lg p-3">
                            <div v-for="band in frequencyBands" :key="band.key"
                                class="flex flex-col items-center gap-1">
                                <div class="relative h-20 w-8 bg-gray-200 rounded-full overflow-hidden">
                                    <input type="range" v-model.number="frequencies[band.key]" min="-12" max="12"
                                        step="0.5" @input="updateFrequencies"
                                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        style="writing-mode: vertical-lr; direction: rtl;" />
                                    <div class="absolute bottom-0 left-0 right-0 transition-all duration-150"
                                        :class="band.barClass"
                                        :style="{ height: getFrequencyHeight(frequencies[band.key] || 0) }" />
                                </div>
                                <span class="text-xs text-gray-500">{{ band.label }}</span>
                                <span class="text-xs text-gray-400">{{ frequencies[band.key] }}dB</span>
                            </div>
                        </div>
                    </div>

                    <!-- Lista de sonidos incluidos -->
                    <div class="pt-3 border-t border-gray-100">
                        <p class="text-xs text-gray-500 mb-2">Sonidos incluidos:</p>
                        <div class="flex flex-wrap gap-1.5">
                            <span v-for="color in selectedColorsWithSound" :key="color.id"
                                class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                                <div class="w-2 h-2 rounded-full" :style="{ background: color.color[5] }" />
                                {{ color.id }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ── Color Grid (siempre visible) ── -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                <div v-for="item in filtered" :key="item.id" class="group bg-white border border-gray-100 rounded-2xl p-4
                 hover:border-gray-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
                    @click="selectColor(item)" :class="{ 'ring-2 ring-offset-1': selected?.id === item.id }"
                    :style="selected?.id === item.id ? { '--tw-ring-color': item.color[4] } : {}">
                    <!-- Nombre + botón de audio -->
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-sm font-medium text-gray-700 capitalize">{{ item.id }}</span>
                        <button v-if="item.sound && item.sound.length > 0" @click.stop="playSound(item)" class="w-7 h-7 rounded-full flex items-center justify-center
                     transition-all duration-150 hover:scale-110 active:scale-95"
                            :style="{ background: item.color[4] + '22', color: item.color[6] }"
                            title="Reproducir sonido">
                            <svg v-if="playing !== item.id" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <span v-else class="flex gap-px items-end h-3.5">
                                <span v-for="n in 3" :key="n" class="w-0.5 rounded-full animate-bounce"
                                    :style="{ background: item.color[6], animationDelay: (n * 80) + 'ms', height: (8 + n * 2) + 'px' }" />
                            </span>
                        </button>
                        <span v-else class="text-xs text-gray-300 italic">sin audio</span>
                    </div>

                    <!-- Swatches strip -->
                    <div class="flex rounded-xl overflow-hidden gap-px">
                        <div v-for="(hex, idx) in item.color" :key="idx"
                            class="flex-1 h-10 transition-transform duration-150 hover:scale-y-110 cursor-default"
                            :style="{ background: hex }" :title="hex" />
                    </div>

                    <!-- Hex del tono 500 en hover -->
                    <div class="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div class="w-4 h-4 rounded-full border border-gray-100"
                            :style="{ background: item.color[5] }" />
                        <span class="text-xs text-gray-400 font-mono">{{ item.color[5] }}</span>
                    </div>

                    <!-- Botón agregar / quitar de la selección -->
                    <button @click.stop="toggleColorSelection(item)"
                        class="mt-3 w-full px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        :class="colorStore.isColorSelected(item.id)
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-purple-50 text-purple-600 hover:bg-purple-100'">
                        <svg v-if="colorStore.isColorSelected(item.id)" class="w-4 h-4" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        {{ colorStore.isColorSelected(item.id) ? 'Quitar selección' : 'Agregar a selección' }}
                    </button>
                </div>
            </div>

            <!-- ── Panel de detalle del color seleccionado (fuera del v-for) ── -->
            <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0 translate-y-2"
                leave-active-class="transition-all duration-200" leave-to-class="opacity-0 translate-y-2">
                <div v-if="selected" class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div class="flex items-center justify-between mb-5">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg" :style="{ background: selected.color[5] }" />
                            <div>
                                <h3 class="font-semibold text-gray-800 capitalize">{{ selected.id }}</h3>
                                <p class="text-xs text-gray-400">{{ selected.color.length }} variantes</p>
                            </div>
                        </div>
                        <button @click="selected = null"
                            class="text-gray-300 hover:text-gray-500 transition-colors text-lg leading-none">✕</button>
                    </div>

                    <!-- Swatches detallados -->
                    <div class="grid grid-cols-11 gap-1.5">
                        <div v-for="(hex, idx) in selected.color" :key="idx" class="group/swatch relative">
                            <div class="h-12 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-150 border border-black/5"
                                :style="{ background: hex }" @click="copyHex(hex)" :title="'Copiar ' + hex" />
                            <div class="text-center mt-1">
                                <span class="text-xs text-gray-400">{{ shadeLabel(idx) }}</span>
                            </div>
                            <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white
                          text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none
                          opacity-0 group-hover/swatch:opacity-100 transition-opacity z-10">
                                {{ hex }}
                            </div>
                        </div>
                    </div>

                    <!-- Toast de copiado -->
                    <Transition enter-active-class="transition-all duration-200" enter-from-class="opacity-0 scale-95"
                        leave-to-class="opacity-0 scale-95">
                        <div v-if="copied" class="mt-4 text-sm text-center py-2 rounded-xl"
                            :style="{ background: selected.color[1], color: selected.color[7] }">
                            ✓ <strong>{{ copied }}</strong> copiado al portapapeles
                        </div>
                    </Transition>
                </div>
            </Transition>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useColorSelectionStore } from '../../core/audioMixer/presentation/store/colorSelectionStore'

interface Color {
    id: string
    color: string[]
    sound?: string[]
}

// ── Data ──────────────────────────────────────────────────────────────────────
const colors = ref<Color[]>([
    { id: 'yellow', color: ['#FEFCE8', '#FEF9C3', '#FEF08A', '#FDE047', '#FACC15', '#EAB308', '#CA8A04', '#A16207', '#854D0E', '#713F12', '#422006'], sound: ['/sounds/yellow.mp3'] },
    { id: 'amber', color: ['#FFFBEB', '#FEF3C7', '#FDE68A', '#FCD34D', '#FBBF24', '#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F', '#451A03'], sound: ['/sounds/amber.mp3'] },
    { id: 'green', color: ['#F0FDF4', '#DCFCE7', '#BBF7D0', '#86EFAC', '#4ADE80', '#22C55E', '#16A34A', '#15803D', '#166534', '#14532D', '#052E16'], sound: ['/sounds/green.mp3'] },
    { id: 'emerald', color: ['#ECFDF5', '#D1FAE5', '#A7F3D0', '#6EE7B7', '#34D399', '#10B981', '#059669', '#047857', '#065F46', '#064E3B', '#022C22'], sound: ['/sounds/emerald.mp3'] },
    { id: 'lime', color: ['#F7FEE7', '#ECFCCB', '#D9F99D', '#BEF264', '#A3E635', '#84CC16', '#65A30D', '#4D7C0F', '#7F6212', '#365314', '#1A2E05'], sound: [] },
    { id: 'red', color: ['#FEF2F2', '#FEE2E2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D', '#450A0A'], sound: ['/sounds/red.mp3'] },
    { id: 'orange', color: ['#FFF7ED', '#FFEDD5', '#FED7AA', '#FDBA74', '#FB923C', '#F97316', '#EA580C', '#C2410C', '#9A3412', '#7C2D12', '#431407'], sound: ['/sounds/orange.mp3'] },
    { id: 'pink', color: ['#FDF2F8', '#FCE7F3', '#FBCFE8', '#F9A8D4', '#F472B6', '#EC4899', '#DB2777', '#BE185D', '#9D174D', '#831843', '#500724'], sound: ['/sounds/pink.mp3'] },
    { id: 'rose', color: ['#FFF1F2', '#FFE4E6', '#FECDD3', '#FDA4AF', '#FB7185', '#F43F5E', '#E11D48', '#BE123C', '#9F1239', '#881337', '#4C0519'], sound: ['/sounds/rose.mp3'] },
    { id: 'blue', color: ['#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A', '#172554'], sound: ['/sounds/blue.mp3'] },
    { id: 'sky', color: ['#F0F9FF', '#E0F2FE', '#BAE6FD', '#7DD3FC', '#38BDF8', '#0EA5E9', '#0284C7', '#0369A1', '#075985', '#0C4A6E', '#082F49'], sound: ['/sounds/sky.mp3'] },
    { id: 'cyan', color: ['#ECFEFF', '#CFFAFE', '#A5F3FC', '#67E8F9', '#22D3EE', '#06B6D4', '#0891B2', '#0E7490', '#155E75', '#164E63', '#083344'], sound: ['/sounds/cyan.mp3'] },
    { id: 'fuchsia', color: ['#FDF4FF', '#FAE8FF', '#F5D0FE', '#F0ABFC', '#E879F9', '#D946EF', '#C026D3', '#A21CAF', '#86198F', '#701A75', '#4A044E'], sound: ['/sounds/fuchsia.mp3'] },
    { id: 'purple', color: ['#F5F3FF', '#EDE9FE', '#DDD6FE', '#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#370764'], sound: ['/sounds/purple.mp3'] },
    { id: 'indigo', color: ['#EEF2FF', '#E0E7FF', '#C7D2FE', '#A5B4FC', '#818CF8', '#6366F1', '#4F46E5', '#4338CA', '#3730A3', '#312E81', '#1E1B4B'], sound: ['/sounds/indigo.mp3'] },
    { id: 'violet', color: ['#F5F3FF', '#EDE9FE', '#DDD6FE', '#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#2E1065'], sound: ['/sounds/violet.mp3'] },
])

// ── Background icons (generados en script, sin hardcodear 60 divs en el template) ──
const ICON_SVGS = [
    `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`,
    `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
    `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>`,
    `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`,
    `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>`,
]
const ICON_COLORS = ['text-purple-200', 'text-pink-200', 'text-indigo-200', 'text-violet-200', 'text-fuchsia-200', 'text-rose-200']

const backgroundIcons = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    svg: ICON_SVGS[i % ICON_SVGS.length],
    colorClass: ICON_COLORS[i % ICON_COLORS.length],
    top: `${5 + (Math.floor(i / 10) * 15 + (i % 3) * 2)}%`,
    left: `${(i % 10) * 10 + (i % 3)}%`,
    delay: `${(i * 0.9) % 10}s`,
}))

// ── Frequency bands config ────────────────────────────────────────────────────
const frequencyBands = [
    { key: 'hz60', label: '60Hz', barClass: 'bg-gradient-to-t from-blue-600 to-blue-400' },
    { key: 'hz230', label: '230Hz', barClass: 'bg-gradient-to-t from-green-600 to-green-400' },
    { key: 'hz910', label: '910Hz', barClass: 'bg-gradient-to-t from-yellow-600 to-yellow-400' },
    { key: 'hz3600', label: '3.6k', barClass: 'bg-gradient-to-t from-orange-600 to-orange-400' },
    { key: 'hz14000', label: '14k', barClass: 'bg-gradient-to-t from-purple-600 to-purple-400' },
] as const

// ── State ─────────────────────────────────────────────────────────────────────
const SHADE_LABELS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
const shadeLabel = (idx: number) => SHADE_LABELS[idx] ?? String(idx)

const search = ref('')
const selected = ref<Color | null>(null)
const playing = ref<string | null>(null)
const copied = ref<string | null>(null)

const colorStore = useColorSelectionStore()

const isMixerPlaying = ref(false)
const mixerVolume = ref(0.5)
const activeAudioElements = ref<HTMLAudioElement[]>([])
const audioContext = ref<AudioContext | null>(null)
const audioSources = ref<MediaElementAudioSourceNode[]>([])
const equalizerFilters = ref<BiquadFilterNode[]>([])

const equalizer = ref({ bass: 50, stereo: 50, sound: 50 })
const frequencies = ref<Record<string, number>>({
    hz60: 0, hz230: 0, hz910: 0, hz3600: 0, hz14000: 0,
})

// ── Computed ──────────────────────────────────────────────────────────────────
const filtered = computed(() =>
    search.value.trim()
        ? colors.value.filter(c => c.id.includes(search.value.toLowerCase()))
        : colors.value
)

const selectedColorsWithSound = computed(() =>
    colorStore.selectedColors.filter(c => c.sound && c.sound.length > 0)
)

const selectedColorsGradient = computed(() => {
    const selected = colorStore.selectedColors
    if (selected.length === 0) return ''
    const stops = selected.map(c => c.color[5])
    return stops.length === 1 ? stops[0] : `linear-gradient(to right, ${stops.join(', ')})`
})

// ── Methods ───────────────────────────────────────────────────────────────────
function selectColor(item: Color) {
    selected.value = selected.value?.id === item.id ? null : item
    copied.value = null
}

function toggleColorSelection(item: Color) {
    colorStore.toggleColor(item)
}

function removeFromSelection(colorId: string) {
    colorStore.removeColor(colorId)
}

function playSound(item: Color) {
    if (!item.sound || item.sound.length === 0) return
    playing.value = item.id
    const audio = new Audio(item.sound[0])
    audio.play().catch(() => { })
    audio.onended = () => { playing.value = null }
    setTimeout(() => { playing.value = null }, 4000)
}

async function copyHex(hex: string) {
    try { await navigator.clipboard.writeText(hex) } catch { /* fallback silent */ }
    copied.value = hex
    setTimeout(() => { copied.value = null }, 2000)
}

function toggleMixerPlayback() {
    isMixerPlaying.value ? pauseMixer() : playMixer()
}

function playMixer() {
    pauseMixer()
    const sounds = selectedColorsWithSound.value
    if (sounds.length === 0) return

    isMixerPlaying.value = true

    if (!audioContext.value) {
        audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    createEqualizerFilters()

    sounds.forEach(color => {
        const audio = new Audio(color.sound![0])
        audio.volume = mixerVolume.value
        audio.loop = true
        activeAudioElements.value.push(audio)

        if (audioContext.value) {
            const source = audioContext.value.createMediaElementSource(audio)
            audioSources.value.push(source)
            connectEqualizerChain(source)
        }

        audio.play().catch(() => { })
    })
}

function pauseMixer() {
    activeAudioElements.value.forEach(a => { a.pause(); a.currentTime = 0 })
    activeAudioElements.value = []
    audioSources.value = []
    equalizerFilters.value = []
    isMixerPlaying.value = false
}

function createEqualizerFilters() {
    if (!audioContext.value) return
    equalizerFilters.value = [60, 230, 910, 3600, 14000].map(freq => {
        const f = audioContext.value!.createBiquadFilter()
        f.type = 'peaking'
        f.frequency.value = freq
        f.Q.value = 1
        f.gain.value = 0
        return f
    })
}

function connectEqualizerChain(source: MediaElementAudioSourceNode) {
    if (!audioContext.value) return
    if (equalizerFilters.value.length === 0) {
        source.connect(audioContext.value.destination)
        return
    }
    let prev: AudioNode = source
    equalizerFilters.value.forEach(f => { prev.connect(f); prev = f })
    prev.connect(audioContext.value.destination)
}

function updateMixerVolume() {
    activeAudioElements.value.forEach(a => { a.volume = mixerVolume.value })
}

function updateEqualizer() {
    const f = equalizerFilters.value
    if (f.length < 5) return
    f[0]!.gain.value = (equalizer.value?.bass || 50 - 50) / 5
    f[1]!.gain.value = (equalizer.value?.bass || 50 - 50) / 8
    f[2]!.gain.value = (equalizer.value?.stereo || 50 - 50) / 5
    f[3]!.gain.value = (equalizer.value?.stereo || 50 - 50) / 8
    f[4]!.gain.value = (equalizer.value?.sound || 50 - 50) / 5
}

function updateFrequencies() {
    const f = equalizerFilters.value
    if (f.length < 5) return
    f[0]!.gain.value = frequencies.value?.hz60 || 0
    f[1]!.gain.value = frequencies.value?.hz230 || 0
    f[2]!.gain.value = frequencies.value?.hz910 || 0
    f[3]!.gain.value = frequencies.value?.hz3600 || 0
    f[4]!.gain.value = frequencies.value?.hz14000 || 0
}

function getFrequencyHeight(value: number): string {
    const pct = ((value + 12) / 24) * 100
    return `${Math.max(5, Math.min(95, pct))}%`
}
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