<template>
  <!-- Modal Overlay -->
  <transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click="close">
      <!-- Modal Container -->
      <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        @click.stop>
        <!-- Modal Header -->
        <div
          class="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <!-- Waves   añadidas aqui, al final del div -->
            <div class="absolute bottom-0 left-0 rigth-0 overflow-hidden leading-none pointer-events-none">
              <svg class="relative block w-full" style="height: 18px;" viewBox="0 0 1200 18" preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg">
                <path class="wave wave-1" d="M0,8 C150,18 350,0 600,8 C850,16 1050,0 1200,8 L1200,18 L0,18 Z"
                  fill="rgba(255,255,255,0.15)" />
                <path class="wave wave-2" d="M0,12 C200,4 400,16 600,10 C800,4 1000,16 1200,10 L1200,18 L0,18 Z"
                  fill="rgba(255,255,255,0.1)" />
                <path class="wave wave-3" d="M0,6 C300,14 500,2 800,10 C950,14 1100,6 1200,10 L1200,18 L0,18 Z"
                  fill="rgba(255,255,255,0.07)" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-white">Investigación Guardada</h1>
              <p class="text-xs text-white/70">ID: {{ investigacion?.id_resource }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Botón Ver Notas -->
            <button @click="showNotesPanel = !showNotesPanel"
              class="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-white"
              :class="{ 'bg-white/40': showNotesPanel }" aria-label="Ver notas">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span class="text-sm">Notas ({{ MyNotes.length }})</span>
            </button>

            <!-- Botón Cerrar -->
            <button @click="close"
              class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-all text-white"
              aria-label="Cerrar modal">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content Area -->
        <div class="flex-1 overflow-hidden flex">
          <!-- Main Content -->
          <div ref="contentContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0 relative"
            @mouseup="handleTextSelection">
            <!-- Loading -->
            <div v-if="isLoading" class="flex items-center justify-center py-12">
              <div class="flex gap-1">
                <span class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0s"></span>
                <span class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
                <span class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
              </div>
              <span class="ml-2 text-sm text-gray-500">Cargando investigación...</span>
            </div>

            <!-- Contenido -->
            <div v-show="!isLoading" class="relative">
              <!-- Info de la investigación -->
              <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-4 mb-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h2 class="text-sm font-bold text-gray-800 mb-1">Investigación #{{ investigacion?.id_resource }}
                    </h2>
                    <p v-if="investigacion?.created_at" class="text-xs text-gray-500">
                      Creada el {{ new Date(investigacion.created_at).toLocaleDateString('es-ES') }}
                    </p>
                  </div>
                  <span class="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                    {{ MyNotes.length }} highlights
                  </span>
                </div>
              </div>

              <!-- Contenido con highlights -->
              <div ref="contentRef" v-html="renderedContent" class="font-inter text-lg leading-loose text-gray-800 max-w-[75ch] mx-auto px-6 py-8
                       prose prose-lg prose-slate
                       prose-headings:font-inter prose-headings:font-bold prose-headings:text-gray-900
                       prose-headings:mt-8 prose-headings:mb-4
                       prose-p:my-5 prose-p:text-justify
                       prose-ul:my-5 prose-ul:ml-6
                       prose-ol:my-5 prose-ol:ml-6
                       prose-li:my-2 prose-li:marker:text-gray-500
                       prose-strong:text-gray-900 prose-strong:font-semibold
                       prose-code:text-sm prose-code:font-mono prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                       prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg
                       prose-a:text-blue-700 prose-a:underline hover:prose-a:text-blue-900
                       prose-blockquote:border-l-4 prose-blockquote:border-gray-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700
                       select-text antialiased">
              </div>
            </div>
          </div>

          <!-- Panel de Notas (Sidebar) -->
          <div v-if="showNotesPanel"
            class="relative w-80 bg-white border-l border-gray-200 overflow-y-auto p-4 shrink-0">
            <!-- Iconos animados de fondo -->
            <div class="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
              <svg class="floating-icon" style="width:22px;top:8%;left:12%;animation-delay:0s;animation-duration:14s"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6m-6 4h4" />
              </svg>

              <svg class="floating-icon" style="width:16px;top:22%;left:78%;animation-delay:-4s;animation-duration:18s"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15H9V13z" />
              </svg>

              <svg class="floating-icon" style="width:20px;top:38%;left:6%;animation-delay:-7s;animation-duration:20s"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>

              <svg class="floating-icon" style="width:14px;top:55%;left:85%;animation-delay:-2s;animation-duration:16s"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
              </svg>

              <svg class="floating-icon" style="width:18px;top:68%;left:20%;animation-delay:-10s;animation-duration:22s"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>

              <svg class="floating-icon" style="width:13px;top:80%;left:65%;animation-delay:-5s;animation-duration:13s"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>

              <svg class="floating-icon" style="width:17px;top:90%;left:40%;animation-delay:-8s;animation-duration:17s"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 class="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Mis Notas
            </h3>

            <div v-if="MyNotes.length === 0" class="text-center py-8 text-gray-400">
              <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <p class="text-sm">Selecciona texto para crear notas</p>
            </div>

            <div v-else class="space-y-3">
              <div v-for="note in MyNotes" :key="note.id" @click="openNoteDetail(note)"
                class="border border-gray-200 rounded-xl p-3 hover:border-indigo-300 transition-colors cursor-pointer group"
                :class="getHighlightColor(note.color)">
                <p class="text-xs text-gray-500 mb-1 font-medium">Texto seleccionado:</p>
                <p class="text-sm text-gray-700 italic mb-2 line-clamp-2">"{{ note.text }}"</p>
                <div class="flex justify-between items-center mt-2">
                  <span class="text-xs text-gray-400">{{ new Date(note.startOffset).toLocaleDateString('es-ES')
                  }}</span>
                  <button @click.stop="deleteNote(note.id)"
                    class="text-xs text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botón flotante FAB para crear notas (siempre visible) -->
        <button v-if="selectedText" @click="openNoteModal" class="fixed bottom-20 right-8 z-40 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700
                 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
          title="Crear nota del texto seleccionado">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <!-- Modal para crear nota con color y texto -->
        <div v-if="showNoteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="closeNoteModal">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

          <!-- Modal Content -->
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-modal-in">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Crear Nota</h3>

            <!-- Texto seleccionado -->
            <div class="mb-4">
              <p class="text-xs text-gray-500 font-medium mb-1">Texto seleccionado:</p>
              <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg italic line-clamp-3">"{{ selectedText }}"</p>
            </div>

            <!-- Selección de color -->
            <div class="mb-4">
              <p class="text-xs text-gray-500 font-medium mb-2">Selecciona un color:</p>
              <div class="flex gap-2 justify-center flex-wrap">
                <button v-for="color in highlightColors" :key="color.name" @click="selectModalColor(color)"
                  class="w-10 h-10 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform shadow-sm flex items-center justify-center"
                  :class="[color.bgClass, { 'ring-2 ring-offset-2 ring-indigo-500 border-indigo-400': selectedModalColor?.name === color.name }]"
                  :title="color.name">
                  <svg v-if="selectedModalColor?.name === color.name" class="w-5 h-5 text-gray-700" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </div>
            <!-- Botones -->
            <div class="flex gap-2 justify-end">
              <button @click="closeNoteModal"
                class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                Cancelar
              </button>
              <button @click="createNoteFromModal" :disabled="!selectedModalColor"
                class="px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors">
                Crear Nota
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-3 bg-white border-t border-gray-200 shrink-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <span class="font-medium">Investigación ID:</span>
              <span class="text-gray-500">{{ investigacion?.id_resource }}</span>
            </div>
            <p class="text-xs text-gray-400">Selecciona texto para crear notas y highlights</p>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Modal para ver detalle de nota (outside transition - separate root element) -->
  <div v-if="showNoteDetailModal && selectedNoteForDetail"
    class="fixed inset-0 z-60 flex items-center justify-center p-4" @click.self="closeNoteDetail">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-modal-in">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
          <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Detalle de la Nota
        </h3>
        <button @click="closeNoteDetail" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Color indicator -->
      <div class="mb-4">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
          :class="getHighlightColor(selectedNoteForDetail.color)">
          <span class="w-3 h-3 rounded-full" :class="selectedNoteForDetail.color"></span>
          Color del resaltado
        </span>
      </div>

      <!-- Texto seleccionado -->
      <div class="mb-4">
        <p class="text-xs text-gray-500 font-medium mb-2">Texto seleccionado:</p>
        <div class="bg-gray-50 p-4 rounded-xl border-l-4 border-indigo-400">
          <p class="text-gray-700 italic">"{{ selectedNoteForDetail.text }}"</p>
        </div>
      </div>

      <!-- Detalles adicionales -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="bg-gray-50 p-3 rounded-lg">
          <p class="text-xs text-gray-500 mb-1">Posición inicio:</p>
          <p class="text-sm font-medium text-gray-700">{{ selectedNoteForDetail.startOffset }}</p>
        </div>
        <div class="bg-gray-50 p-3 rounded-lg">
          <p class="text-xs text-gray-500 mb-1">Posición fin:</p>
          <p class="text-sm font-medium text-gray-700">{{ selectedNoteForDetail.endOffset }}</p>
        </div>
      </div>

      <!-- ID de la nota -->
      <div class="text-center pt-4 border-t border-gray-100">
        <p class="text-xs text-gray-400">ID de la nota: <span class="font-mono">{{ selectedNoteForDetail.id }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch, h } from 'vue';
import MarkdownIt from 'markdown-it';
import { useHighlightsStore, type Note } from '../../core/research/presentation/store/highlightsStore';

interface HighlightColor {
  name: string;
  bgClass: string;
  borderClass: string;
}

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true
});

const highlightColors: HighlightColor[] = [
  { name: 'Amarillo', bgClass: 'bg-yellow-200', borderClass: 'border-yellow-400' },
  { name: 'Verde', bgClass: 'bg-green-200', borderClass: 'border-green-400' },
  { name: 'Azul', bgClass: 'bg-blue-200', borderClass: 'border-blue-400' },
  { name: 'Rosa', bgClass: 'bg-pink-200', borderClass: 'border-pink-400' },
  { name: 'Púrpura', bgClass: 'bg-purple-200', borderClass: 'border-purple-400' },
  { name: 'Naranja', bgClass: 'bg-orange-200', borderClass: 'border-orange-400' }
];

const props = defineProps<{
  isOpen: boolean;
  investigacion: {
    id: number;
    id_resource: number;
    content_resource: string;
    created_at?: string;
  } | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

interface NoteHighlight {
  id: string;
  text: string;
  color: string;
  startOffset: number;
  endOffset: number;
}

// Store
const highlightsStore = useHighlightsStore();


// Refs
const contentRef = ref<HTMLDivElement | null>(null);
const isLoading = ref(false);
const showNotesPanel = ref(false);

// Selección de texto
const selectedText = ref('');
const selectedRange = ref<Range | null>(null);
const showFloatingToolbar = ref(false);
const toolbarPosition = ref({ x: 0, y: 0 });
const showColorMenu = ref(false);
const showNoteModal = ref(false);
const selectedModalColor = ref<HighlightColor | null>(null);
const modalNoteContent = ref('');

const MyNotes = ref<NoteHighlight[]>([]);

// Modal para ver detalle de nota
const showNoteDetailModal = ref(false);
const selectedNoteForDetail = ref<NoteHighlight | null>(null);

// Edición de notas
const noteEdits = ref<Record<string, string>>({});

// Computed
const renderedContent = computed(() => {
  if (!props.investigacion?.content_resource) return '';
  // Renderizar markdown a HTML para mostrar con formato y permitir highlights
  return md.render(props.investigacion.content_resource);
});

const currentHighlights = computed(() => {
  const highlights = highlightsStore.currentHighlights;
  console.log('[currentHighlights]', highlights.length, 'highlights for investigacion', props.investigacion?.id);
  return highlights;
});
const currentNotes = computed(() => {
  const notes = highlightsStore.currentNotes;
  console.log('[currentNotes]', notes.length, 'notes for investigacion', props.investigacion?.id, 'currentId in store:', highlightsStore.currentInvestigacionId);
  return notes;
});

// Watchers
watch(() => props.investigacion, (newInv) => {
  if (newInv?.id) {
    highlightsStore.setCurrentInvestigacion(newInv.id);
    initializeNoteEdits();
    nextTick(() => {
      applyHighlightsToDOM();
    });
  }
}, { immediate: true });

watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.investigacion?.id) {
    nextTick(() => {
      applyHighlightsToDOM();
    });
  }
});

// Watcher para actualizar noteEdits cuando cambian las notas
watch(currentNotes, (notes) => {
  notes.forEach(note => {
    if (!(note.id in noteEdits.value)) {
      noteEdits.value[note.id] = note.text || '';
    }
  });
}, { deep: true, immediate: true });

// Funciones
const initializeNoteEdits = () => {
  noteEdits.value = {};
  currentNotes.value.forEach(note => {
    noteEdits.value[note.id] = note.text || '';
  });
};

const getHighlightColor = (highlightId?: string) => {
  if (highlightId == '' || highlightId == null) return '';
  const highlight = highlightsStore.highlights.find(h => h.color === highlightId);
  if (!highlight) return '';

  const colorMap: Record<string, string> = {
    'bg-yellow-200': 'bg-yellow-50 border-yellow-300',
    'bg-green-200': 'bg-green-50 border-green-300',
    'bg-blue-200': 'bg-blue-50 border-blue-300',
    'bg-pink-200': 'bg-pink-50 border-pink-300',
    'bg-purple-200': 'bg-purple-50 border-purple-300',
    'bg-orange-200': 'bg-orange-50 border-orange-300'
  };

  return colorMap[highlight.color] || 'bg-gray-50 border-gray-300';
};

const handleTextSelection = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    showFloatingToolbar.value = false;
    return;
  }


  const range = selection.getRangeAt(0);
  const text = selection.toString().trim();

  if (text.length < 3) {
    showFloatingToolbar.value = false;
    return;
  }

  const container = contentRef.value;
  if (!container || !container.contains(range.commonAncestorContainer)) {
    showFloatingToolbar.value = false;
    return;
  }

  selectedText.value = text;
  selectedRange.value = range.cloneRange();

  const rect = range.getBoundingClientRect();
  const toolbarWidth = 200;

  // Incluye scroll y clamp para evitar salirse del viewport
  toolbarPosition.value = {
    x: Math.max(0, Math.min(window.innerWidth - toolbarWidth, rect.left + (rect.width / 2) - (toolbarWidth / 2))),
    y: rect.top + window.scrollY - 80
  };

  showFloatingToolbar.value = true;
};

const cancelSelection = () => {
  showFloatingToolbar.value = false;
  window.getSelection()?.removeAllRanges();
  selectedText.value = '';
  selectedRange.value = null;
};

const calculateOffset = (range: Range): number => {
  let offset = 0;
  const container = contentRef.value;
  if (!container) return 0;

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null
  );

  let node;
  while (node = walker.nextNode()) {
    if (node === range.startContainer) {
      return offset + range.startOffset;
    }
    offset += node.textContent?.length || 0;
  }

  return offset;
};

const applyHighlightToDOM = (range: Range, colorClass: string, highlightId: string) => {
  try {
    const span = document.createElement('span');
    const borderClass = colorClass.replace(/^bg-/, 'border-').replace(/-200$/, '-400');
    span.className = `${colorClass} ${borderClass} border-b-2 cursor-pointer transition-all hover:opacity-80`;
    span.dataset.highlightId = highlightId;
    span.title = 'Click para ver nota';

    // Sin memory leak
    const handleClick = (e: MouseEvent) => {
      e.stopPropagation();
      scrollToNote(highlightId);
    }
    span.addEventListener('click', handleClick);

    // Usar ectractContact para soportar rangos que cruzan elementos
    const fragment = range.extractContents();
    span.appendChild(fragment);
    range.insertNode(span);
  } catch (e) {
    console.error('Error aplicando highlight:', e);
    throw e;
  }
};

const applyHighlightsToDOM = () => {
  console.log('[ApplyHighlights] Starting... Highlights count:', currentHighlights.value.length);

  if (!contentRef.value) {
    console.log('[ApplyHighlights] No contentRef');
    return;
  }

  // Limpiar highlights existentes manteniendo el texto
  const existingHighlights = contentRef.value.querySelectorAll('[data-highlight-id]');
  console.log('[ApplyHighlights] Clearing existing highlights:', existingHighlights.length);
  existingHighlights.forEach(el => {
    const parent = el.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(el.textContent || ''), el);
      parent.normalize();
    }
  });

  // Re-aplicar highlights del store usando extractContents (más robusto que surroundContents)
  console.log('[ApplyHighlights] Re-applying', currentHighlights.value.length, 'highlights');
  currentHighlights.value.forEach((highlight, index) => {
    console.log(`[ApplyHighlights] Processing highlight ${index + 1}/${currentHighlights.value.length}:`, highlight.text.substring(0, 30));
    const range = findTextRange(highlight.text);
    if (range) {
      try {
        const span = document.createElement('span');
        const borderClass = highlight.color.replace(/^bg-/, 'border-').replace(/-200$/, '-400');
        span.className = `${highlight.color} ${borderClass} border-b-2 cursor-pointer transition-all hover:opacity-80`;
        span.dataset.highlightId = highlight.id;
        span.title = 'Click para ver nota';

        // Usar extractContents + insertNode en lugar de surroundContents
        const fragment = range.extractContents();
        span.appendChild(fragment);
        range.insertNode(span);

        // Agregar click handler
        span.addEventListener('click', (e) => {
          e.stopPropagation();
          scrollToNote(highlight.id);
        });
        console.log(`[ApplyHighlights] Highlight ${highlight.id} applied successfully`);
      } catch (e) {
        console.error('[ApplyHighlights] Error reaplicando highlight:', highlight.text.substring(0, 30), e);
      }
    } else {
      console.log('[ApplyHighlights] Range not found for text:', highlight.text.substring(0, 30));
    }
  });
  console.log('[ApplyHighlights] Done');
};

const findTextRange = (text: string): Range | null => {
  if (!contentRef.value || !text) return null;

  // Normalizar el texto buscado (quitar espacios extra)
  const normalizedSearchText = text.replace(/\s+/g, ' ').trim();

  const walker = document.createTreeWalker(
    contentRef.value,
    NodeFilter.SHOW_TEXT,
    null
  );

  const textNodes: Text[] = [];
  let node;
  while (node = walker.nextNode()) {
    textNodes.push(node as Text);
  }

  // Buscar en nodos individuales primero
  for (let i = 0; i < textNodes.length; i++) {
    const node = textNodes[i];
    if (!node) continue;
    const nodeText = node.textContent || '';
    const index = nodeText.indexOf(text);

    if (index !== -1) {
      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + text.length);
      console.log('[Highlight] Found in single node:', text.substring(0, 30));
      return range;
    }
  }

  // Buscar en texto concatenado de múltiples nodos
  let combinedText = '';
  let startNodeIndex = -1;
  let startOffset = 0;

  for (let i = 0; i < textNodes.length; i++) {
    const node = textNodes[i];
    if (!node) continue;
    const nodeText = node.textContent || '';

    for (let charIndex = 0; charIndex < nodeText.length; charIndex++) {
      if (startNodeIndex === -1) {
        startNodeIndex = i;
        startOffset = charIndex;
        combinedText = '';
      }

      combinedText += nodeText[charIndex];

      // Verificar si el texto combinado contiene el texto buscado
      if (combinedText.replace(/\s+/g, ' ').includes(normalizedSearchText)) {
        // Encontrar la posición exacta del texto
        const searchIndex = combinedText.indexOf(text);
        if (searchIndex !== -1) {
          const range = document.createRange();
          let charsRemaining = searchIndex;
          let currentNodeIndex = startNodeIndex;
          let currentOffset = startOffset;

          // Avanzar hasta el inicio del texto buscado
          while (charsRemaining > 0 && currentNodeIndex < textNodes.length) {
            const currentNode = textNodes[currentNodeIndex];
            if (!currentNode) break;
            const currentNodeText = currentNode.textContent || '';
            const available = currentNodeText.length - currentOffset;

            if (charsRemaining <= available) {
              currentOffset += charsRemaining;
              charsRemaining = 0;
            } else {
              charsRemaining -= available;
              currentNodeIndex++;
              currentOffset = 0;
            }
          }

          const startNode = textNodes[currentNodeIndex];
          if (!startNode) return null;
          range.setStart(startNode, currentOffset);

          // Avanzar hasta el final del texto buscado
          let endCharsRemaining = text.length;
          let endNodeIndex = currentNodeIndex;
          let endOffset = currentOffset;

          while (endCharsRemaining > 0 && endNodeIndex < textNodes.length) {
            const endNode = textNodes[endNodeIndex];
            if (!endNode) break;
            const endNodeText = endNode.textContent || '';
            const available = endNodeText.length - endOffset;

            if (endCharsRemaining <= available) {
              endOffset += endCharsRemaining;
              endCharsRemaining = 0;
            } else {
              endCharsRemaining -= available;
              endNodeIndex++;
              endOffset = 0;
            }
          }

          const finalEndNode = textNodes[Math.min(endNodeIndex, textNodes.length - 1)];
          if (!finalEndNode) return null;
          range.setEnd(finalEndNode, Math.min(endOffset, (finalEndNode.textContent || '').length));
          console.log('[Highlight] Found across nodes:', text.substring(0, 30));
          return range;
        }
      }

      // Resetear si el texto es muy largo
      if (combinedText.length > text.length * 2) {
        startNodeIndex = -1;
      }
    }
  }

  console.log('[Highlight] Not found:', text.substring(0, 30), 'Nodes:', textNodes.length);
  return null;
};

const scrollToNote = (highlightId: string) => {
  showNotesPanel.value = true;
  const note = currentNotes.value.find(n => n.highlightId === highlightId);
  if (note) {
    nextTick(() => {
      const noteEl = document.querySelector(`[data-note-id="${note.id}"]`);
      noteEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
};

const deleteNote = (noteId: string) => {
  const note = MyNotes.value.find((n: NoteHighlight) => n.id === noteId);
  if (note?.id) {
    MyNotes.value = MyNotes.value.filter((n: NoteHighlight) => n.id !== noteId);
  }

  nextTick(() => {
    applyHighlightsToDOM();
  });
};

const openNoteDetail = (note: NoteHighlight) => {
  selectedNoteForDetail.value = note;
  showNoteDetailModal.value = true;
};

const closeNoteDetail = () => {
  showNoteDetailModal.value = false;
  selectedNoteForDetail.value = null;
};

const close = () => {
  highlightsStore.clearCurrentInvestigacion();
  showFloatingToolbar.value = false;
  showColorMenu.value = false;
  showNoteModal.value = false;
  showNotesPanel.value = false;
  emit('close');
};

const openNoteModal = () => {
  showNoteModal.value = true;
  selectedModalColor.value = null;
  modalNoteContent.value = '';
};

const closeNoteModal = () => {
  showNoteModal.value = false;
  selectedModalColor.value = null;
  modalNoteContent.value = '';
};

const selectModalColor = (color: HighlightColor) => {
  selectedModalColor.value = color;
};

const createNoteFromModal = () => {
  if (!selectedModalColor.value || !selectedText.value || !selectedRange.value) return;

  try {
    const range = selectedRange.value;
    const color = selectedModalColor.value;

    // Crear highlight en el store
    const highlight = highlightsStore.addHighlight({
      investigacionId: props.investigacion!.id,
      text: selectedText.value,
      color: color.bgClass,
      startOffset: calculateOffset(range),
      endOffset: calculateOffset(range) + selectedText.value.length
    });

    MyNotes.value.push({
      id: highlight.id,
      text: selectedText.value,
      startOffset: highlight.startOffset,
      endOffset: highlight.endOffset,
      color: color.bgClass
    });

    // Cerrar modal y limpiar
    closeNoteModal();
    showFloatingToolbar.value = false;
    window.getSelection()?.removeAllRanges();
    selectedText.value = '';
    selectedRange.value = null;
    showNotesPanel.value = true;
  } catch (e) {
    console.error('[CreateNoteFromModal] Error:', e);
    alert('No se pudo crear la nota. Intenta nuevamente.');
  }
};

// Click fuera del toolbar
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target?.closest('.fixed.z-50') && showFloatingToolbar.value) {
    cancelSelection();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  if (props.investigacion?.id) {
    highlightsStore.setCurrentInvestigacion(props.investigacion.id);
    initializeNoteEdits();
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<script lang="ts">
export default {
  name: 'ViewInvestigacionModal'
}
</script>

<style scoped>
/* Transiciones del modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Personalización de scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Utilidades para highlights */
:deep(.highlight-yellow) {
  background-color: rgb(254, 240, 138);
  border-bottom: 2px solid rgb(250, 204, 21);
}

:deep(.highlight-green) {
  background-color: rgb(187, 247, 208);
  border-bottom: 2px solid rgb(74, 222, 128);
}

:deep(.highlight-blue) {
  background-color: rgb(191, 219, 254);
  border-bottom: 2px solid rgb(96, 165, 250);
}

:deep(.highlight-pink) {
  background-color: rgb(251, 207, 232);
  border-bottom: 2px solid rgb(244, 114, 182);
}

:deep(.highlight-purple) {
  background-color: rgb(233, 213, 255);
  border-bottom: 2px solid rgb(168, 85, 247);
}

:deep(.highlight-orange) {
  background-color: rgb(254, 215, 170);
  border-bottom: 2px solid rgb(251, 146, 60);
}

@keyframes wave-move {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-40%);
  }
}

.wave {
  transform-origin: left center;
}

.wave-1 {
  animation: wave-move 6s linear infinite;
}

.wave-2 {
  animation: wave-move 9s linear infinite;
}

.wave-3 {
  animation: wave-move 12s linear infinite;
}

@keyframes float-drift {
  0% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.06;
  }

  25% {
    transform: translateY(-12px) rotate(5deg);
    opacity: 0.10;
  }

  50% {
    transform: translateY(-6px) rotate(-3deg);
    opacity: 0.07;
  }

  75% {
    transform: translateY(-16px) rotate(4deg);
    opacity: 0.11;
  }

  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.06;
  }
}

.floating-icon {
  position: absolute;
  color: #6366f1;
  animation: float-drift 8s ease-in-out infinite;
  opacity: 0.07;
}
</style>
