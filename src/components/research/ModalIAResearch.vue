<template>
  <!-- Modal Overlay -->
  <transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click="close">
      <!-- Modal Container -->
      <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        @click.stop>
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-white">Investigación</h1>
              <p class="text-xs text-white/70">Generada automáticamente con IA</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Botón Guardar Investigación -->
            <button @click="saveResearch" :disabled="isSavingResearch"
              class="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all text-white"
              aria-label="Guardar investigación">
              <svg v-if="!isSavingResearch" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="text-sm">{{ isSavingResearch ? 'Guardando...' : 'Guardar' }}</span>
            </button>

            <!-- Botón Regenerar -->
            <button @click="regenerateResearch"
              class="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-white"
              aria-label="Regenerar investigación">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <!-- Botón Cerrar -->
            <button @click="close"
              class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-all text-white"
              aria-label="Cerrar investigación">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Research Content Area -->
        <div ref="researchContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0 relative">
          <!-- Fondo con iconos animados -->
          <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-10 left-10 w-8 h-8 text-gray-300/40 animate-float" style="animation-delay: 0s;">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div class="absolute top-16 right-16 w-6 h-6 text-gray-300/30 animate-float" style="animation-delay: 1s;">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Loading -->
          <div v-show="isLoading" class="flex items-center justify-center py-12">
            <div class="flex gap-1">
              <span class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0s"></span>
              <span class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
              <span class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
            </div>
            <span class="ml-2 text-sm text-gray-500">Generando investigación...</span>
          </div>

          <!-- Contenido principal -->
          <div v-show="!isLoading" @mouseup="handleTextSelection" class="relative">
            <!-- Mensaje inicial de contexto -->
            <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-4 mb-4">
              <h2 class="text-sm font-bold text-gray-800 mb-1">{{ props.title }}</h2>
              <p class="text-xs text-gray-600 leading-relaxed">{{ props.description }}</p>
            </div>

            <!-- Contenido de investigación con highlights -->
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

          <!-- Toolbar flotante para crear notas -->
          <div v-if="showFloatingToolbar"
            class="fixed z-100 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 flex flex-col gap-2 min-w-[200px]"
            :style="{ left: toolbarPosition.x + 'px', top: toolbarPosition.y + 'px' }" @mousedown.prevent
            @click.prevent>
            <p class="text-xs text-gray-500 font-medium">Crear nota del texto seleccionado:</p>
            <p class="text-xs text-gray-700 truncate max-w-[180px] italic">"{{ selectedText }}"</p>
            <div class="flex gap-1 justify-center">
              <button v-for="color in noteColors" :key="color.name" @click.stop="createNoteWithColor(color)"
                :class="[color.class, 'w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform']"
                :title="color.name">
              </button>
            </div>
            <div class="flex gap-2 justify-end mt-1">
              <button @click.stop="cancelSelection" class="text-xs px-2 py-1 text-gray-500 hover:text-gray-700">
                Cancelar
              </button>
            </div>
          </div>

          <!-- Footer de investigación -->
          <div class="p-4 bg-white border-t border-gray-200 shrink-0 mt-auto">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <span class="font-medium">Prompt:</span>
                <span class="text-gray-500 truncate max-w-md">{{ props.title }}</span>
              </div>
              <p class="text-xs text-gray-400">Selecciona texto para crear notas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import MarkdownIt from 'markdown-it'
import axios from 'axios'
import { useGetGenerativeModelGP } from '../../shared/service/useGetGenerativeModelGP';

interface NoteColor {
  name: string;
  class: string;
  textClass: string;
}

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true
});

// Colores disponibles para notas
const noteColors: NoteColor[] = [
  { name: 'Amarillo', class: 'bg-yellow-100 border-yellow-300', textClass: 'text-yellow-900' },
  { name: 'Verde', class: 'bg-green-100 border-green-300', textClass: 'text-green-900' },
  { name: 'Azul', class: 'bg-blue-100 border-blue-300', textClass: 'text-blue-900' },
  { name: 'Rosa', class: 'bg-pink-100 border-pink-300', textClass: 'text-pink-900' },
  { name: 'Púrpura', class: 'bg-purple-100 border-purple-300', textClass: 'text-purple-900' },
  { name: 'Naranja', class: 'bg-orange-100 border-orange-300', textClass: 'text-orange-900' }
];

const props = defineProps<{
  isOpen: boolean;
  onClose: () => void;
  idResearch: number;
  title: string;
  description: string;
}>();

// Estado
const isLoading = ref(false);
const isSavingResearch = ref(false);
const contentRef = ref<HTMLDivElement | null>(null);
const researchContent = ref<string>('');
const researchGeneratedAt = ref<Date | null>(null);

// Estado para selección de texto y notas
const selectedText = ref('');
const selectedRange = ref<Range | null>(null);
const showFloatingToolbar = ref(false);
const toolbarPosition = ref({ x: 0, y: 0 });
const notes = ref<Array<{
  id: string;
  text: string;
  color: NoteColor;
  createdAt: Date;
}>>([]);
// Highlights: array de textos resaltados con su color
const highlights = ref<Array<{ id: string; text: string; colorClass: string }>>([]);

// Generar investigación automática - Usa el título como prompt
const generateResearch = async () => {
  console.log('Generando investigación con prompt:', props.title);
  isLoading.value = true;
  try {
    // Usar el título como prompt principal
    const prompt = `Realiza una investigación completa sobre:\n\n"${props.title}"\n\nContexto: ${props.description}\n\nProporciona:\n1. Resumen ejecutivo\n2. Análisis detallado\n3. Hallazgos clave\n4. Recomendaciones\n5. Conclusiones\n\nUsa markdown con títulos, listas y énfasis.`;

    const result = await useGetGenerativeModelGP(prompt);

    researchContent.value = result || 'No se pudo generar la investigación.';
    researchGeneratedAt.value = new Date();
  } catch (error) {
    console.error('Error generando investigación:', error);
    researchContent.value = 'Error al generar la investigación. Intenta nuevamente.';
  } finally {
    isLoading.value = false;
  }
};

// Regenerar investigación
const regenerateResearch = async () => {
  if (confirm('¿Regenerar investigación? Se perderá el contenido actual.')) {
    await generateResearch();
  }
};

// Guardar investigación en el servidor
const saveResearch = async () => {
  // Validaciones
  if (!props.idResearch || props.idResearch === 0) {
    alert('Error: El ID de investigación no es válido.');
    return;
  }

  if (!renderedContent.value || renderedContent.value.trim() === '') {
    alert('Error: No hay contenido de investigación para guardar.');
    return;
  }

  isSavingResearch.value = true;

  try {
    console.log('Guardando investigación:', researchContent.value);
    const payload = {
      id_resource: props.idResearch,
      content_resource: researchContent.value
    };

    const response = await axios.post('http://localhost:3000/api/v1/investigaciones', payload);

    if (response.status === 200 || response.status === 201) {
      alert('Investigación guardada exitosamente.');
    } else {
      alert('Error al guardar la investigación. Intenta nuevamente.');
    }
  } catch (error) {
    console.error('Error guardando investigación:', error);
    alert('Error al guardar la investigación. Verifica tu conexión e intenta nuevamente.');
  } finally {
    isSavingResearch.value = false;
  }
};

// Formatear hora
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};

// Computed para contenido renderizado (sin highlights, se aplican después vía DOM)
const renderedContent = computed(() => {
  let content = researchContent.value || '';
  if (!content) return '';
  return md.render(content);
});


// Manejar selección de texto
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

  // Verificar que la selección está dentro del contenido
  const container = contentRef.value;
  if (!container || !container.contains(range.commonAncestorContainer)) {
    showFloatingToolbar.value = false;
    return;
  }

  selectedText.value = text;
  selectedRange.value = range.cloneRange();

  // Calcular posición del toolbar
  const rect = range.getBoundingClientRect();
  toolbarPosition.value = {
    x: rect.left + (rect.width / 2) - 100,
    y: rect.top - 80
  };

  showFloatingToolbar.value = true;
};

// Cancelar selección
const cancelSelection = () => {
  showFloatingToolbar.value = false;
  window.getSelection()?.removeAllRanges();
  selectedText.value = '';
  selectedRange.value = null;
};

// Crear nota con color seleccionado
const createNoteWithColor = (color: NoteColor) => {
  if (!selectedText.value) return;

  const noteId = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    const selectedContent = selectedText.value;

    // Agregar highlight al estado reactivo
    const highlight = {
      id: noteId,
      text: selectedContent,
      colorClass: color.class
    };
    highlights.value.push(highlight);

    // Guardar nota
    const note = {
      id: noteId,
      text: selectedContent,
      color: color,
      createdAt: new Date()
    };
    notes.value.unshift(note);

    // Guardar en localStorage
    saveNotes();

    // Aplicar highlight al DOM inmediatamente
    nextTick(() => {
      reapplyHighlights();
    });

    // Limpiar selección
    showFloatingToolbar.value = false;
    window.getSelection()?.removeAllRanges();
    selectedText.value = '';
    selectedRange.value = null;
    console.log('Nota creada:', note, 'Highlight:', highlight);
  } catch (e) {
    console.error('Error aplicando highlight:', e);
    alert('No se pudo crear la nota. Intenta seleccionar un texto más simple.');
  }
};

// Guardar notas en localStorage
const saveNotes = () => {
  try {
    const notesData = {
      researchId: props.idResearch,
      notes: notes.value,
      highlights: highlights.value,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(`research_notes_${props.idResearch}`, JSON.stringify(notesData));
  } catch (e) {
    console.error('Error guardando notas:', e);
  }
};

// Cargar notas desde localStorage
const loadNotes = () => {
  try {
    const saved = localStorage.getItem(`research_notes_${props.idResearch}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      notes.value = parsed.notes || [];
      highlights.value = parsed.highlights || [];
    }
  } catch (e) {
    console.error('Error cargando notas:', e);
  }
};

// Reaplicar highlights al contenido
const reapplyHighlights = () => {
  // Esta función se ejecutaría después de renderizar el contenido
  // Para reaplicar los highlights guardados
  console.log('Reaplicando highlights:', highlights.value);
};

// Cerrar modal
const close = () => {
  props.onClose();
};

onMounted(() => {
  loadNotes();
  generateResearch();
});

// Click fuera del toolbar para cerrarlo
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target?.closest('.fixed.z-100') && showFloatingToolbar.value) {
    cancelSelection();
  }
};

// Agregar listener de click global
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

// Limpiar listeners
const cleanup = () => {
  document.removeEventListener('click', handleClickOutside);
};
</script>

<style scoped>
/* Animación de flotación suave estilo WhatsApp */
@keyframes float {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  25% {
    transform: translateY(-10px) rotate(2deg);
  }

  50% {
    transform: translateY(-5px) rotate(-1deg);
  }

  75% {
    transform: translateY(-15px) rotate(1deg);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

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
</style>