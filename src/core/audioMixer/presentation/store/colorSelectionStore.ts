import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// ── Interface ──────────────────────────────────────────────────────────────
export interface SelectedColor {
  id: string
  color: string[]
  sound?: string[]
  selectedAt: string
}

// ── Color Selection Store ───────────────────────────────────────────────────
export const useColorSelectionStore = defineStore('colorSelection', () => {
  // ── State ─────────────────────────────────────────────────────────────────
  const selectedColors = ref<SelectedColor[]>([])

  // ── Getters ───────────────────────────────────────────────────────────────
  const selectionCount = computed(() => selectedColors.value.length)
  const hasSelections = computed(() => selectedColors.value.length > 0)
  const allSelectedIds = computed(() => selectedColors.value.map(c => c.id))

  // ── Actions ───────────────────────────────────────────────────────────────
  function addColor(color: { id: string; color: string[]; sound?: string[] }) {
    if (!isColorSelected(color.id)) {
      selectedColors.value.push({
        ...color,
        selectedAt: new Date().toISOString()
      })
    }
  }

  function removeColor(colorId: string) {
    const index = selectedColors.value.findIndex(c => c.id === colorId)
    if (index > -1) {
      selectedColors.value.splice(index, 1)
    }
  }

  function toggleColor(color: { id: string; color: string[]; sound?: string[] }) {
    if (isColorSelected(color.id)) {
      removeColor(color.id)
    } else {
      addColor(color)
    }
  }

  function isColorSelected(colorId: string): boolean {
    return selectedColors.value.some(c => c.id === colorId)
  }

  function clearSelections() {
    selectedColors.value = []
  }

  function removeLastSelection() {
    selectedColors.value.pop()
  }

  return {
    // State
    selectedColors,
    // Getters
    selectionCount,
    hasSelections,
    allSelectedIds,
    // Actions
    addColor,
    removeColor,
    toggleColor,
    isColorSelected,
    clearSelections,
    removeLastSelection
  }
})
