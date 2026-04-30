import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// ── Interfaces ─────────────────────────────────────────────────────────────
export interface Highlight {
  id: string
  investigacionId: number
  text: string
  color: string
  startOffset: number
  endOffset: number
  createdAt: string
}

export interface Note {
  id: string
  investigacionId: number
  highlightId?: string
  text: string
  createdAt: string
  updatedAt?: string
}

// ── Highlights Store ────────────────────────────────────────────────────────
export const useHighlightsStore = defineStore('highlights', () => {
  // ── State ─────────────────────────────────────────────────────────────────
  const highlights = ref<Highlight[]>([])
  const notes = ref<Note[]>([])
  const currentInvestigacionId = ref<number | null>(null)

  // ── Getters ─────────────────────────────────────────────────────────────────
  const currentHighlights = computed(() => {
    if (!currentInvestigacionId.value) return []
    return highlights.value.filter(h => h.investigacionId === currentInvestigacionId.value)
  })

  const currentNotes = computed(() => {
    if (!currentInvestigacionId.value) return []
    return notes.value.filter(n => n.investigacionId === currentInvestigacionId.value)
  })

  const getNotesForHighlight = computed(() => (highlightId: string) => {
    return notes.value.filter(n => n.highlightId === highlightId)
  })

  // ── Actions ─────────────────────────────────────────────────────────────────
  function setCurrentInvestigacion(id: number) {
    currentInvestigacionId.value = id
    loadFromStorage(id)
  }

  function addHighlight(highlight: Omit<Highlight, 'id' | 'createdAt'>) {
    const newHighlight: Highlight = {
      ...highlight,
      id: generateId(),
      createdAt: new Date().toISOString()
    }
    highlights.value.push(newHighlight)
    saveToStorage()
    return newHighlight
  }

  function removeHighlight(id: string) {
    const index = highlights.value.findIndex(h => h.id === id)
    if (index > -1) {
      highlights.value.splice(index, 1)
      // Remove associated notes
      notes.value = notes.value.filter(n => n.highlightId !== id)
      saveToStorage()
    }
  }

  function addNote(note: Omit<Note, 'id' | 'createdAt'>) {
    const newNote: Note = {
      ...note,
      id: generateId(),
      createdAt: new Date().toISOString()
    }
    notes.value.push(newNote)
    saveToStorage()
    return newNote
  }

  function updateNote(id: string) {
    const note = notes.value.find(n => n.id === id)
    if (note) {
      note.updatedAt = new Date().toISOString()
      saveToStorage()
    }
  }

  function removeNote(id: string) {
    const index = notes.value.findIndex(n => n.id === id)
    if (index > -1) {
      notes.value.splice(index, 1)
      saveToStorage()
    }
  }

  function clearCurrentInvestigacion() {
    currentInvestigacionId.value = null
  }

  // ── Persistence ────────────────────────────────────────────────────────────
  function saveToStorage() {
    if (currentInvestigacionId.value) {
      const storageKey = `highlights_inv_${currentInvestigacionId.value}`
      const data = {
        highlights: highlights.value.filter(h => h.investigacionId === currentInvestigacionId.value),
        notes: notes.value.filter(n => n.investigacionId === currentInvestigacionId.value)
      }
      localStorage.setItem(storageKey, JSON.stringify(data))
    }
  }

  function loadFromStorage(investigacionId: number) {
    const storageKey = `highlights_inv_${investigacionId}`
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      const data = JSON.parse(stored)
      // Merge with existing data for other investigaciones
      const otherHighlights = highlights.value.filter(h => h.investigacionId !== investigacionId)
      const otherNotes = notes.value.filter(n => n.investigacionId !== investigacionId)
      highlights.value = [...otherHighlights, ...(data.highlights || [])]
      notes.value = [...otherNotes, ...(data.notes || [])]
    }
  }

  function generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  return {
    // State
    highlights,
    notes,
    currentInvestigacionId,
    // Getters
    currentHighlights,
    currentNotes,
    getNotesForHighlight,
    // Actions
    setCurrentInvestigacion,
    addHighlight,
    removeHighlight,
    addNote,
    updateNote,
    removeNote,
    clearCurrentInvestigacion,
    saveToStorage,
    loadFromStorage
  }
})
