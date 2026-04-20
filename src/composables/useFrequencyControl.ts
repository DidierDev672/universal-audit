import { ref, computed, type Ref } from 'vue'

export interface FrequencyBand {
  label: string
  minFreq: number
  maxFreq: number
  defaultGain: number
}

export interface FilterSettings {
  lowCutoff: number
  midLowCutoff: number
  midHighCutoff: number
  highCutoff: number
}

export function useFrequencyControl(audioContext: Ref<AudioContext | null>) {
  // Frecuencias predefinidas según requerimiento
  const frequencyRanges = {
    fullRange: { min: 20, max: 20000, label: '20Hz - 20kHz' },
    midRange: { min: 500, max: 5000, label: '500Hz - 5kHz' },
    highRange: { min: 8000, max: 8000, label: '8kHz' }
  } as const

  // Estado de ganancia para cada banda (-12dB a +12dB)
  const gains = ref({
    low: 0,
    midLow: 0,
    midHigh: 0,
    high: 0
  })

  // Filtros de audio
  const lowFilter = ref<BiquadFilterNode | null>(null)
  const midLowFilter = ref<BiquadFilterNode | null>(null)
  const midHighFilter = ref<BiquadFilterNode | null>(null)
  const highFilter = ref<BiquadFilterNode | null>(null)

  // Frecuencias de corte actuales
  const cutoffFrequencies = ref<FilterSettings>({
    lowCutoff: 500,
    midLowCutoff: 500,
    midHighCutoff: 5000,
    highCutoff: 8000
  })

  const isInitialized = computed(() => 
    lowFilter.value !== null && 
    midLowFilter.value !== null &&
    midHighFilter.value !== null &&
    highFilter.value !== null
  )

  function initializeFilters() {
    if (!audioContext.value) return

    const ctx = audioContext.value

    // Filtro de graves (Low shelf) - 20Hz a 500Hz
    lowFilter.value = ctx.createBiquadFilter()
    lowFilter.value.type = 'lowshelf'
    lowFilter.value.frequency.value = cutoffFrequencies.value.lowCutoff
    lowFilter.value.gain.value = gains.value.low

    // Filtro de medios-bajos (Peaking) - 500Hz
    midLowFilter.value = ctx.createBiquadFilter()
    midLowFilter.value.type = 'peaking'
    midLowFilter.value.frequency.value = cutoffFrequencies.value.midLowCutoff
    midLowFilter.value.Q.value = 1
    midLowFilter.value.gain.value = gains.value.midLow

    // Filtro de medios-altos (Peaking) - 5kHz
    midHighFilter.value = ctx.createBiquadFilter()
    midHighFilter.value.type = 'peaking'
    midHighFilter.value.frequency.value = cutoffFrequencies.value.midHighCutoff
    midHighFilter.value.Q.value = 1
    midHighFilter.value.gain.value = gains.value.midHigh

    // Filtro de agudos (High shelf) - 8kHz+
    highFilter.value = ctx.createBiquadFilter()
    highFilter.value.type = 'highshelf'
    highFilter.value.frequency.value = cutoffFrequencies.value.highCutoff
    highFilter.value.gain.value = gains.value.high

    return {
      low: lowFilter.value,
      midLow: midLowFilter.value,
      midHigh: midHighFilter.value,
      high: highFilter.value
    }
  }

  function connectFilters(sourceNode: AudioNode, destinationNode: AudioNode) {
    if (!isInitialized.value) {
      initializeFilters()
    }

    if (!lowFilter.value || !midLowFilter.value || !midHighFilter.value || !highFilter.value) {
      return null
    }

    // Chain: source -> low -> midLow -> midHigh -> high -> destination
    try {
      sourceNode.connect(lowFilter.value)
      lowFilter.value.connect(midLowFilter.value)
      midLowFilter.value.connect(midHighFilter.value)
      midHighFilter.value.connect(highFilter.value)
      highFilter.value.connect(destinationNode)
      return true
    } catch (err) {
      console.error('Error connecting filters:', err)
      return false
    }
  }

  function updateGain(band: keyof typeof gains.value, value: number) {
    gains.value[band] = value

    const filterMap = {
      low: lowFilter,
      midLow: midLowFilter,
      midHigh: midHighFilter,
      high: highFilter
    }

    const filter = filterMap[band].value
    if (filter) {
      filter.gain.value = value
    }
  }

  function updateCutoffFrequency(setting: keyof FilterSettings, frequency: number) {
    cutoffFrequencies.value[setting] = frequency

    const filterMap: Record<keyof FilterSettings, Ref<BiquadFilterNode | null>> = {
      lowCutoff: lowFilter,
      midLowCutoff: midLowFilter,
      midHighCutoff: midHighFilter,
      highCutoff: highFilter
    }

    const filter = filterMap[setting].value
    if (filter) {
      filter.frequency.value = frequency
    }
  }

  function resetFilters() {
    gains.value = { low: 0, midLow: 0, midHigh: 0, high: 0 }
    Object.keys(gains.value).forEach((band) => {
      updateGain(band as keyof typeof gains.value, 0)
    })
  }

  function disposeFilters() {
    lowFilter.value = null
    midLowFilter.value = null
    midHighFilter.value = null
    highFilter.value = null
  }

  return {
    frequencyRanges,
    gains,
    cutoffFrequencies,
    isInitialized,
    initializeFilters,
    connectFilters,
    updateGain,
    updateCutoffFrequency,
    resetFilters,
    disposeFilters
  }
}
