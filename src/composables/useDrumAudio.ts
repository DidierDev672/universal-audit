import { ref, computed } from 'vue'
import type { Color } from '@/data/colors'

const audioContext = ref<AudioContext | null>(null)
const masterGain = ref<GainNode | null>(null)
const buffers = ref<Map<string, AudioBuffer[]>>(new Map())
const loadedCount = ref(0)
const totalCount = ref(0)

export function useDrumAudio(colors: Color[]) {
  const isReady = computed(() => loadedCount.value === totalCount.value && totalCount.value > 0)
  const progress = computed(() => totalCount.value === 0 ? 0 : Math.round((loadedCount.value / totalCount.value) * 100))

  function initAudioContext() {
    if (!audioContext.value) {
      audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)()
      masterGain.value = audioContext.value.createGain()
      masterGain.value.connect(audioContext.value.destination)
      masterGain.value.gain.value = 0.8
    }
    if (audioContext.value?.state === 'suspended') {
      audioContext.value.resume()
    }
  }

  async function loadAllSounds() {
    initAudioContext()
    if (!audioContext.value) return

    const allSounds: { colorId: string; url: string; index: number }[] = []
    
    colors.forEach((color: Color) => {
      color.sound.forEach((url: string, index: number) => {
        allSounds.push({ colorId: color.id, url, index })
      })
    })

    totalCount.value = allSounds.length
    loadedCount.value = 0
    buffers.value.clear()

    await Promise.all(allSounds.map(async ({ colorId, url, index }) => {
      try {
        const response = await fetch(url)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await audioContext.value!.decodeAudioData(arrayBuffer)
        
        if (!buffers.value.has(colorId)) {
          buffers.value.set(colorId, [])
        }
        const colorBuffers = buffers.value.get(colorId)!
        colorBuffers[index] = audioBuffer
        loadedCount.value++
      } catch (error) {
        console.error(`Failed to load sound: ${url}`, error)
      }
    }))
  }

  function playSound(colorId: string, soundIndex: number) {
    if (!audioContext.value || !masterGain.value) return

    const colorBuffers = buffers.value.get(colorId)
    if (!colorBuffers || !colorBuffers[soundIndex]) return

    const source = audioContext.value.createBufferSource()
    source.buffer = colorBuffers[soundIndex]
    source.connect(masterGain.value)
    source.start(0)
    
    return source
  }

  function setVolume(volume: number) {
    if (masterGain.value) {
      masterGain.value.gain.value = Math.max(0, Math.min(1, volume / 100))
    }
  }

  function getSoundIndexForPad(color: Color, padIndex: number): number {
    const soundCount = color.sound.length
    if (soundCount === 1) return 0
    if (soundCount === 2) return padIndex % 2
    return padIndex % soundCount
  }

  return {
    isReady,
    progress,
    loadAllSounds,
    playSound,
    setVolume,
    getSoundIndexForPad
  }
}
