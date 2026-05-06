<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import { useGetGenerativeModelGP } from '../../shared/service/useGetGenerativeModelGP';

// Interfaces
interface AnswerOption {
  text: string;
  value: number;
}

interface Answer {
  title: string;
  description: string;
  optionsAnswer: AnswerOption[];
}

interface TinnitusResponse {
  id: string;
  idPatient: string;
  idTinnitusQuestionnaires: string;
  answer: Answer[];
  patientName?: string;
  questionnaireTitle?: string;
}

interface Patient {
  id: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  height: number;
  weight: number;
  isAllergic: boolean;
  email?: string;
}

interface Questionnaire {
  id: string;
  title: string;
  description?: string;
}

interface ClinicalNote {
  id: string;
  idPatient: string;
  idTinnitusQuestionnaires: string;
  idTinnitusResponse: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface AIAnalysis {
  id: string;
  idPatient: string;
  idTinnitusQuestionnaires: string;
  idTinnitusResponse: string;
  analysis: string;
  model: string;
  createdAt: string;
}

// Estado
const responses = ref<TinnitusResponse[]>([]);
const patients = ref<Map<string, Patient>>(new Map());
const questionnaires = ref<Map<string, Questionnaire>>(new Map());
const isLoading = ref(false);
const searchQuery = ref('');
const selectedResponse = ref<TinnitusResponse | null>(null);
const showDetailModal = ref(false);

// Estado para notas clínicas
const showClinicalNoteModal = ref(false);
const clinicalNoteForm = ref({
  description: ''
});
const isSavingNote = ref(false);
const selectedResponseForNote = ref<TinnitusResponse | null>(null);

// Estado para visualizar notas clínicas
const showViewNotesModal = ref(false);
const clinicalNotes = ref<ClinicalNote[]>([]);
const isLoadingNotes = ref(false);
const selectedResponseForView = ref<TinnitusResponse | null>(null);

// Toggle para modal de Notas Clínicas ('notes' | 'analysis')
const clinicalNotesModalView = ref<'notes' | 'analysis'>('notes');
const savedNotesAnalysis = ref<string | null>(null);
const isLoadingNotesAnalysis = ref(false);

// Estado para análisis IA
const showAIAnalysisModal = ref(false);
const aiAnalysisResult = ref<string>('');
const isAnalyzing = ref(false);
const selectedResponseForAI = ref<TinnitusResponse | null>(null);
const isSavingAnalysis = ref(false);
const savedAnalysis = ref<string | null>(null);
const analysisError = ref<string | null>(null);
const isDeletingAnalysis = ref(false);
const isExpanded = ref(false);

// Estado para expandir modal de Notas Clínicas
const isClinicalNotesModalExpanded = ref(false);

// Estado para visualizar análisis guardado
const showViewAnalysisModal = ref(false);
const selectedResponseForViewAnalysis = ref<TinnitusResponse | null>(null);
const isLoadingAnalysis = ref(false);

// Estado para análisis de notas por IA
const showNotesAnalysisModal = ref(false);
const notesAnalysisResult = ref<string | null>(null);
const isAnalyzingNotes = ref(false);
const notesAnalysisError = ref<string | null>(null);
const isSavingNotesAnalysis = ref(false);
const savedNotesAnalysisId = ref<string | null>(null);
const isNotesAnalysisModalExpanded = ref(false);

// Toggle entre vistas del modal de análisis
// 'analysis' = vista por defecto (muestra el análisis)
// 'notes'    = vista alternativa (muestra las notas)
type ModalView = 'analysis' | 'notes';
const activeModalView = ref<ModalView>('analysis');

// Interfaz y estado para notas del análisis
interface NoteContext {
  id: string | number
  content: string
  createdAt: string
}

interface NoteTinnitusAnalysis {
  id: string | number
  title: string
  content: string
  createdAt: string
  color?: string
  source?: string
  context?: NoteContext[]
}
const analysisNotes = ref<NoteTinnitusAnalysis[]>([])
const isLoadingAnalysisNotes = ref<boolean>(false)
const analysisNotesError = ref<string | null>(null)

// Estado para edición de notas
const editingNoteId = ref<string | number | null>(null)
const editingNoteContent = ref<string>('')
const isEditingNote = ref<boolean>(false)
const isDeletingNote = ref<string | number | null>(null)

// Estado para agregar contexto a notas
const addingContextToNoteId = ref<string | number | null>(null)
const contextContent = ref<string>('')
const isSavingContext = ref<boolean>(false)

// Estado para crear notas desde selección de texto
const selectedText = ref<string>('');
const showColorMenu = ref(false);
const isCreatingNoteFromSelection = ref(false);
const colorMenuPosition = ref({ x: 0, y: 0 });

// Colores disponibles para notas
const noteColors = [
  { name: 'Amarillo', value: 'bg-yellow-100 border-yellow-300 text-yellow-800', color: '#FEF3C7' },
  { name: 'Verde', value: 'bg-green-100 border-green-300 text-green-800', color: '#D1FAE5' },
  { name: 'Azul', value: 'bg-blue-100 border-blue-300 text-blue-800', color: '#DBEAFE' },
  { name: 'Rosa', value: 'bg-pink-100 border-pink-300 text-pink-800', color: '#FCE7F3' },
  { name: 'Púrpura', value: 'bg-purple-100 border-purple-300 text-purple-800', color: '#E9D5FF' },
  { name: 'Naranja', value: 'bg-orange-100 border-orange-300 text-orange-800', color: '#FFEDD5' }
];

// Instancia de MarkdownIt para renderizar análisis
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

// Función para renderizar markdown
const renderMarkdown = (content: string): string => {
  return md.render(content || '');
};

// Computed
const filteredResponses = computed(() => {
  if (!searchQuery.value.trim()) return responses.value;
  const query = searchQuery.value.toLowerCase();
  return responses.value.filter(
    (r) =>
      r.patientName?.toLowerCase().includes(query) ||
      r.questionnaireTitle?.toLowerCase().includes(query)
  );
});

// Cargar respuestas
const loadResponses = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/v1/tinnitus-responses', {
      timeout: 30000
    });
    const data = response.data;
    responses.value = Array.isArray(data) ? data : (data?.data || []);
    console.log(`✅ ${responses.value.length} respuestas cargadas`);

    // Cargar información de pacientes y cuestionarios
    await enrichResponseData();
  } catch (error) {
    console.error('❌ Error al cargar respuestas:', error);
    showAlert('Error al cargar las respuestas. Intente nuevamente.', 'error');
  } finally {
    isLoading.value = false;
  }
};

// Enriquecer datos con pacientes y cuestionarios
const enrichResponseData = async () => {
  const patientIds = [...new Set(responses.value.map((r) => r.idPatient))];
  const questionnaireIds = [...new Set(responses.value.map((r) => r.idTinnitusQuestionnaires))];

  // Cargar pacientes
  for (const patientId of patientIds) {
    if (!patients.value.has(patientId)) {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/patients/${patientId}`, {
          timeout: 10000
        });
        patients.value.set(patientId, response.data);
      } catch (error) {
        console.error(`❌ Error al cargar paciente ${patientId}:`, error);
      }
    }
  }

  // Cargar cuestionarios
  for (const questionnaireId of questionnaireIds) {
    if (!questionnaires.value.has(questionnaireId)) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/questionnaires/${questionnaireId}`,
          { timeout: 10000 }
        );
        questionnaires.value.set(questionnaireId, response.data);
      } catch (error) {
        console.error(`❌ Error al cargar cuestionario ${questionnaireId}:`, error);
      }
    }
  }

  // Actualizar respuestas con nombres
  responses.value = responses.value.map((r) => ({
    ...r,
    patientName: getPatientName(r.idPatient),
    questionnaireTitle: getQuestionnaireTitle(r.idTinnitusQuestionnaires)
  }));
};

// Obtener nombre del paciente
const getPatientName = (patientId: string): string => {
  const patient = patients.value.get(patientId);
  if (patient) {
    return patient.fullName;
  }
  return 'Paciente desconocido';
};

// Obtener título del cuestionario
const getQuestionnaireTitle = (questionnaireId: string): string => {
  const questionnaire = questionnaires.value.get(questionnaireId);
  return questionnaire?.title || 'Cuestionario desconocido';
};

// Ver detalle de respuesta
const viewResponseDetail = (response: TinnitusResponse) => {
  selectedResponse.value = response;
  showDetailModal.value = true;
};

// Cerrar modal
const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedResponse.value = null;
};

// Funciones para notas clínicas
const openClinicalNoteModal = (response: TinnitusResponse) => {
  selectedResponseForNote.value = response;
  clinicalNoteForm.value.description = '';
  showClinicalNoteModal.value = true;
};

const closeClinicalNoteModal = () => {
  showClinicalNoteModal.value = false;
  selectedResponseForNote.value = null;
  clinicalNoteForm.value.description = '';
};

const saveClinicalNote = async () => {
  if (!clinicalNoteForm.value.description.trim()) {
    showAlert('La descripción de la nota es requerida', 'error');
    return;
  }

  if (!selectedResponseForNote.value) {
    showAlert('No se ha seleccionado una respuesta válida', 'error');
    return;
  }

  isSavingNote.value = true;
  try {
    const noteData = {
      id_patient: selectedResponseForNote.value.idPatient,
      id_tinnitus_questionnaires: selectedResponseForNote.value.idTinnitusQuestionnaires,
      id_tinnitus_response: selectedResponseForNote.value.id,
      description: clinicalNoteForm.value.description
    };

    await axios.post(`http://localhost:3000/api/v1/tinnitus-notes/${noteData.id_patient}`, noteData, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    showAlert('Nota clínica guardada exitosamente', 'success');
    closeClinicalNoteModal();
  } catch (error) {
    console.error('Error al guardar nota clínica:', error);
    showAlert('Error al guardar la nota clínica', 'error');
  } finally {
    isSavingNote.value = false;
  }
};

// Funciones para visualizar notas clínicas
const openViewNotesModal = async (response: TinnitusResponse) => {
  selectedResponseForView.value = response;
  showViewNotesModal.value = true;
  await loadClinicalNotes(response.id);
};

const closeViewNotesModal = () => {
  showViewNotesModal.value = false;
  selectedResponseForView.value = null;
  clinicalNotes.value = [];
  clinicalNotesModalView.value = 'notes'; // Reset a vista de notas
  savedNotesAnalysis.value = null;
};

const loadClinicalNotes = async (responseId: string) => {
  isLoadingNotes.value = true;
  try {
    const response = await axios.get(`http://localhost:3000/api/v1/tinnitus-notes/response/${responseId}`, {
      timeout: 30000
    });
    clinicalNotes.value = response.data || [];
  } catch (error: any) {
    if (error.response?.status === 404) {
      clinicalNotes.value = [];
    } else {
      console.error('Error al cargar notas clínicas:', error);
      showAlert('Error al cargar las notas clínicas', 'error');
    }
  } finally {
    isLoadingNotes.value = false;
  }
};

// Toggle entre notas y análisis en modal de Notas Clínicas
const toggleClinicalNotesModalView = () => {
  if (clinicalNotesModalView.value === 'notes') {
    clinicalNotesModalView.value = 'analysis';
    if (selectedResponseForView.value && !savedNotesAnalysis.value) {
      loadSavedNotesAnalysis(selectedResponseForView.value.id);
    }
  } else {
    clinicalNotesModalView.value = 'notes';
  }
};

// Cargar análisis guardado de notas
const loadSavedNotesAnalysis = async (responseId: string) => {
  isLoadingNotesAnalysis.value = true;
  try {
    const response = await axios.get(`http://localhost:3000/api/v1/tinnitus-notes-analysis/response/${responseId}`, {
      timeout: 30000
    });
    if (response.data && response.data.length > 0) {
      savedNotesAnalysis.value = response.data[0].analysis;
    } else {
      savedNotesAnalysis.value = null;
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      savedNotesAnalysis.value = null;
    } else {
      console.error('Error al cargar análisis de notas:', error);
    }
  } finally {
    isLoadingNotesAnalysis.value = false;
  }
};

// Funciones para análisis IA
const openAIAnalysisModal = (response: TinnitusResponse) => {
  selectedResponseForAI.value = response;
  aiAnalysisResult.value = '';
  showAIAnalysisModal.value = true;
  analyzeWithAI(response);
};

const closeAIAnalysisModal = () => {
  showAIAnalysisModal.value = false;
  selectedResponseForAI.value = null;
  aiAnalysisResult.value = '';
};

const analyzeWithAI = async (response: TinnitusResponse) => {
  isAnalyzing.value = true;
  try {
    const prompt = buildAnalysisPrompt(response);
    const result = await useGetGenerativeModelGP(prompt);
    aiAnalysisResult.value = result || 'No se pudo generar el análisis.';
  } catch (error) {
    console.error('Error al analizar con IA:', error);
    showAlert('Error al generar el análisis con IA', 'error');
    aiAnalysisResult.value = 'Error al generar el análisis. Por favor intente nuevamente.';
  } finally {
    isAnalyzing.value = false;
  }
};

const buildAnalysisPrompt = (response: TinnitusResponse): string => {
  const patientName = response.patientName || 'Paciente';
  const questionnaireTitle = response.questionnaireTitle || 'Cuestionario';
  const totalScore = calculateTotalScore(response.answer);
  const severity = getSeverityLevel(totalScore);

  let answersText = '';
  response.answer.forEach((ans, idx) => {
    const answerText = ans.optionsAnswer?.[0]?.text || 'Sin respuesta';
    const answerValue = ans.optionsAnswer?.[0]?.value || 0;
    answersText += `${idx + 1}. ${ans.title}\n   Respuesta: ${answerText} (Valor: ${answerValue})\n`;
  });

  return `Actúa como un especialista en audiología y análisis clínico. 

Analiza las siguientes respuestas del cuestionario de tinnitus:

**Información del Paciente:**
- Nombre: ${patientName}
- Cuestionario: ${questionnaireTitle}
- Puntuación Total: ${totalScore}/24
- Nivel de Severidad: ${severity.label}

**Respuestas Detalladas:**
${answersText}

Por favor proporciona un análisis clínico profesional que incluya:
1. **Interpretación de la puntuación total** y su significado clínico
2. **Identificación de áreas problemáticas** basadas en las respuestas individuales
3. **Recomendaciones de tratamiento** específicas para este nivel de severidad
4. **Consideraciones adicionales** que el especialista debe tener en cuenta
5. **Sugerencias de seguimiento** para próximas consultas

El análisis debe ser profesional, objetivo y útil para la toma de decisiones clínicas.`;
};

const saveAIAnalysis = async () => {
  if (!aiAnalysisResult.value.trim() || !selectedResponseForAI.value) {
    showAlert('No hay análisis para guardar', 'warning');
    return;
  }

  isSavingAnalysis.value = true;
  try {
    const analysisData = {
      id_patient: selectedResponseForAI.value.idPatient,
      id_tinnitus_questionnaires: selectedResponseForAI.value.idTinnitusQuestionnaires,
      id_tinnitus_response: selectedResponseForAI.value.id,
      analysis: aiAnalysisResult.value,
      model: 'gemini-3-flash-preview'
    };

    await axios.post('http://localhost:3000/api/v1/tinnitus-analysis', analysisData, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    showAlert('Análisis IA guardado exitosamente', 'success');
    closeAIAnalysisModal();
  } catch (error) {
    console.error('Error al guardar análisis:', error);
    showAlert('Error al guardar el análisis', 'error');
  } finally {
    isSavingAnalysis.value = false;
  }
};

// Funciones para visualizar análisis guardado
const openViewAnalysisModal = async (response: TinnitusResponse) => {
  selectedResponseForViewAnalysis.value = response;
  savedAnalysis.value = null;
  isExpanded.value = false;
  showViewAnalysisModal.value = true;
  await loadSavedAnalysis(response.idTinnitusQuestionnaires);
};

const closeViewAnalysisModal = () => {
  showViewAnalysisModal.value = false;
  selectedResponseForViewAnalysis.value = null;
  savedAnalysis.value = null;
  isExpanded.value = false;
  activeModalView.value = 'analysis'; // Reset a vista de análisis
  analysisNotes.value = [];
  analysisNotesError.value = null;
};

const loadSavedAnalysis = async (questionnaireId: string) => {
  isLoadingAnalysis.value = true;
  try {
    const response = await axios.get(`http://localhost:3000/api/v1/tinnitus-analysis/questionnaire/${questionnaireId}`, {
      timeout: 30000
    });
    // El endpoint retorna un array, tomamos el primer elemento
    const data = Array.isArray(response.data) ? response.data[0] : response.data;
    savedAnalysis.value = data || null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      savedAnalysis.value = null;
    } else {
      console.error('Error al cargar análisis:', error);
      showAlert('Error al cargar el análisis', 'error');
    }
  } finally {
    isLoadingAnalysis.value = false;
  }
};

const deleteSavedAnalysis = async () => {
  if (!savedAnalysis.value?.id) {
    showAlert('No hay análisis para eliminar', 'warning');
    return;
  }

  if (!confirm('¿Está seguro de que desea eliminar este análisis? Esta acción no se puede deshacer.')) {
    return;
  }

  isDeletingAnalysis.value = true;
  try {
    await axios.delete(`http://localhost:3000/api/v1/tinnitus-analysis/${savedAnalysis.value.id}`, {
      timeout: 30000
    });

    showAlert('Análisis eliminado exitosamente', 'success');
    closeViewAnalysisModal();
  } catch (error) {
    console.error('Error al eliminar análisis:', error);
    showAlert('Error al eliminar el análisis', 'error');
  } finally {
    isDeletingAnalysis.value = false;
  }
};

const toggleExpandModal = () => {
  isExpanded.value = !isExpanded.value;
};

const toggleExpandClinicalNotesModal = () => {
  isClinicalNotesModalExpanded.value = !isClinicalNotesModalExpanded.value;
};

// Función para alternar entre vistas del modal (análisis / notas)
const toggleModalView = async () => {
  activeModalView.value = activeModalView.value === 'analysis' ? 'notes' : 'analysis'
  // Si cambiamos a notas, cargarlas si no están cargadas aún
  if (activeModalView.value === 'notes' && analysisNotes.value.length === 0 && !analysisNotesError.value) {
    await fetchAnalysisNotes()
  }
}

// Función para cargar notas del análisis desde el endpoint
// Incluye notas creadas por selección de texto (source: 'analysis-selection')
const fetchAnalysisNotes = async () => {
  if (!selectedResponseForViewAnalysis.value) return

  isLoadingAnalysisNotes.value = true
  analysisNotesError.value = null

  try {
    // Usar el mismo endpoint que loadClinicalNotes para obtener todas las notas de la respuesta
    // Esto incluye notas creadas por selección de texto
    const responseId = selectedResponseForViewAnalysis.value.id
    const response = await axios.get(
      `http://localhost:3000/api/v1/tinnitus-notes/response/${responseId}`,
      { timeout: 30000 }
    )

    // Mapear las notas al formato esperado
    const notesData = response.data || []
    analysisNotes.value = notesData.map((note: any) => ({
      id: note.id,
      title: note.source === 'analysis-selection' ? 'Nota destacada del análisis' : (note.title || 'Nota clínica'),
      content: note.description || note.content || '',
      createdAt: note.createdAt || note.created_at || new Date().toISOString(),
      color: note.color || 'bg-yellow-100 border-yellow-300 text-yellow-800',
      source: note.source || 'clinical'
    }))
  } catch (error: any) {
    console.error('Error al cargar notas:', error)
    analysisNotesError.value = 'No se pudieron cargar las notas'
  } finally {
    isLoadingAnalysisNotes.value = false
  }
}

// Función para formatear fechas en la lista de notas
const formatDateShort = (isoString: string): string => {
  return new Date(isoString).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Funciones para analizar notas por IA
const analyzeNotesByAI = async () => {
  if (analysisNotes.value.length === 0) {
    showAlert('No hay notas para analizar', 'warning')
    return
  }

  isAnalyzingNotes.value = true
  notesAnalysisError.value = null
  notesAnalysisResult.value = null

  try {
    // Construir el prompt con todas las notas
    const notesContent = analysisNotes.value.map((note, index) => {
      let content = `Nota ${index + 1}: ${note.title}\nContenido: ${note.content}`
      if (note.context && note.context.length > 0) {
        content += '\nContextos:'
        note.context.forEach((ctx, ctxIndex) => {
          content += `\n  - Contexto ${ctxIndex + 1}: ${ctx.content}`
        })
      }
      return content
    }).join('\n\n---\n\n')

    const prompt = `Eres un especialista médico en tinnitus. Analiza las siguientes notas clínicas y proporciona un resumen profesional, identificando patrones, observaciones importantes y recomendaciones para el tratamiento. Responde en español.\n\nNOTAS DEL PACIENTE:\n\n${notesContent}\n\nPor favor, proporciona:\n1. Resumen ejecutivo de las notas\n2. Patrones identificados\n3. Observaciones críticas\n4. Recomendaciones basadas en las notas\n5. Preguntas de seguimiento sugeridas`

    const response = await useGetGenerativeModelGP(prompt)
    notesAnalysisResult.value = response
    showNotesAnalysisModal.value = true
  } catch (error) {
    console.error('Error al analizar notas:', error)
    notesAnalysisError.value = 'Error al analizar las notas. Por favor, intente nuevamente.'
    showAlert('Error al analizar las notas', 'error')
  } finally {
    isAnalyzingNotes.value = false
  }
}

const closeNotesAnalysisModal = () => {
  showNotesAnalysisModal.value = false
  notesAnalysisResult.value = null
  notesAnalysisError.value = null
  savedNotesAnalysisId.value = null
  isNotesAnalysisModalExpanded.value = false
}

const toggleNotesAnalysisModalSize = () => {
  isNotesAnalysisModalExpanded.value = !isNotesAnalysisModalExpanded.value
}

const saveNotesAnalysis = async () => {
  if (!notesAnalysisResult.value || !selectedResponseForViewAnalysis.value) return

  isSavingNotesAnalysis.value = true
  try {
    const payload = {
      id_patient: selectedResponseForViewAnalysis.value.idPatient,
      id_tinnitus_questionnaires: selectedResponseForViewAnalysis.value.idTinnitusQuestionnaires,
      id_tinnitus_response: selectedResponseForViewAnalysis.value.id,
      analysis: notesAnalysisResult.value,
      note_count: analysisNotes.value.length,
      analyzed_at: new Date().toISOString()
    }

    const response = await axios.post('http://localhost:3000/api/v1/tinnitus-notes-analysis', payload, {
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' }
    })

    savedNotesAnalysisId.value = response.data?.id
    showAlert('Análisis de notas guardado exitosamente', 'success')
    closeNotesAnalysisModal()
  } catch (error) {
    console.error('Error al guardar análisis de notas:', error)
    showAlert('Error al guardar el análisis', 'error')
  } finally {
    isSavingNotesAnalysis.value = false
  }
}

// Funciones para crear notas desde selección de texto
const handleTextSelection = () => {
  const selection = window.getSelection();
  const text = selection?.toString().trim() || '';
  selectedText.value = text;
};

const openColorMenu = (event: MouseEvent) => {
  if (!selectedText.value) {
    showAlert('Por favor seleccione texto del análisis primero', 'warning');
    return;
  }
  colorMenuPosition.value = { x: event.clientX, y: event.clientY };
  showColorMenu.value = true;
};

const closeColorMenu = () => {
  showColorMenu.value = false;
};

const createNoteFromSelection = async (colorClass: string) => {
  if (!selectedText.value || !selectedResponseForViewAnalysis.value) {
    showAlert('No hay texto seleccionado', 'warning');
    return;
  }

  isCreatingNoteFromSelection.value = true;
  showColorMenu.value = false;

  try {
    const noteData = {
      id_patient: selectedResponseForViewAnalysis.value.idPatient,
      id_tinnitus_questionnaires: selectedResponseForViewAnalysis.value.idTinnitusQuestionnaires,
      id_tinnitus_response: selectedResponseForViewAnalysis.value.id,
      description: selectedText.value,
      color: colorClass,
      source: 'analysis-selection'
    };

    await axios.post(`http://localhost:3000/api/v1/tinnitus-notes/${noteData.id_patient}`, noteData, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    showAlert('Nota creada exitosamente', 'success');
    selectedText.value = '';
    window.getSelection()?.removeAllRanges();
  } catch (error) {
    console.error('Error al crear nota:', error);
    showAlert('Error al crear la nota', 'error');
  } finally {
    isCreatingNoteFromSelection.value = false;
  }
};

// Funciones para editar y eliminar notas
const startEditingNote = (note: NoteTinnitusAnalysis) => {
  editingNoteId.value = note.id
  editingNoteContent.value = note.content
}

const cancelEditingNote = () => {
  editingNoteId.value = null
  editingNoteContent.value = ''
}

const saveNote = async (noteId: string | number) => {
  if (!editingNoteContent.value.trim()) {
    showAlert('El contenido de la nota no puede estar vacío', 'warning')
    return
  }

  isEditingNote.value = true
  try {
    await axios.put(`http://localhost:3000/api/v1/tinnitus-notes/${noteId}`, {
      description: editingNoteContent.value.trim()
    }, {
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' }
    })

    showAlert('Nota actualizada exitosamente', 'success')
    // Actualizar la nota en la lista local
    const noteIndex = analysisNotes.value.findIndex(n => n.id === noteId)
    if (noteIndex !== -1) {
      analysisNotes.value[noteIndex].content = editingNoteContent.value.trim()
    }
    cancelEditingNote()
  } catch (error) {
    console.error('Error al actualizar nota:', error)
    showAlert('Error al actualizar la nota', 'error')
  } finally {
    isEditingNote.value = false
  }
}

const deleteNote = async (noteId: string | number) => {
  if (!confirm('¿Está seguro de que desea eliminar esta nota? Esta acción no se puede deshacer.')) {
    return
  }

  isDeletingNote.value = noteId
  try {
    await axios.delete(`http://localhost:3000/api/v1/tinnitus-notes/${noteId}`, {
      timeout: 30000
    })

    showAlert('Nota eliminada exitosamente', 'success')
    // Remover la nota de la lista local
    analysisNotes.value = analysisNotes.value.filter(n => n.id !== noteId)
  } catch (error) {
    console.error('Error al eliminar nota:', error)
    showAlert('Error al eliminar la nota', 'error')
  } finally {
    isDeletingNote.value = null
  }
}

// Funciones para agregar contexto a notas
const startAddingContext = (noteId: string | number) => {
  addingContextToNoteId.value = noteId
  contextContent.value = ''
}

const cancelAddingContext = () => {
  addingContextToNoteId.value = null
  contextContent.value = ''
}

const saveContext = async (noteId: string | number) => {
  if (!contextContent.value.trim()) {
    showAlert('El contexto no puede estar vacío', 'warning')
    return
  }

  isSavingContext.value = true
  try {
    const response = await axios.post(`http://localhost:3000/api/v1/tinnitus-notes/${noteId}/context`, {
      description: contextContent.value.trim()
    }, {
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' }
    })

    showAlert('Contexto agregado exitosamente', 'success')

    // Actualizar la nota en la lista local con el nuevo contexto
    const noteIndex = analysisNotes.value.findIndex(n => n.id === noteId)
    if (noteIndex !== -1) {
      const newContext = {
        id: response.data?.id || Date.now(),
        content: contextContent.value.trim(),
        createdAt: new Date().toISOString()
      }
      if (!analysisNotes.value[noteIndex].context) {
        analysisNotes.value[noteIndex].context = []
      }
      analysisNotes.value[noteIndex].context?.push(newContext)
    }
    cancelAddingContext()
  } catch (error) {
    console.error('Error al agregar contexto:', error)
    showAlert('Error al agregar el contexto', 'error')
  } finally {
    isSavingContext.value = false
  }
}

// Formatear fecha
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Mostrar alerta
const showAlert = (message: string, type: 'success' | 'error' | 'warning' = 'warning') => {
  const colors = {
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200'
  };

  const alertDiv = document.createElement('div');
  alertDiv.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${colors[type]}`;
  alertDiv.innerHTML = `<span class="font-medium">${message}</span>`;
  document.body.appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 4000);
};

// Calcular puntuación total
const calculateTotalScore = (answers: Answer[]): number => {
  return answers.reduce((total, answer) => {
    const answerValue = answer.optionsAnswer?.[0]?.value || 0;
    return total + answerValue;
  }, 0);
};

// Obtener nivel de severidad basado en puntuación
const getSeverityLevel = (score: number): { label: string; color: string } => {
  if (score <= 5) return { label: 'Leve', color: 'bg-green-100 text-green-700' };
  if (score <= 10) return { label: 'Moderado', color: 'bg-yellow-100 text-yellow-700' };
  if (score <= 15) return { label: 'Severo', color: 'bg-orange-100 text-orange-700' };
  return { label: 'Muy Severo', color: 'bg-red-100 text-red-700' };
};

onMounted(() => {
  loadResponses();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold">Respuestas de Cuestionarios de Tinnitus</h1>
            <p class="text-teal-100">Visualización de respuestas de pacientes</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search Bar -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div class="relative max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input v-model="searchQuery" type="text" placeholder="Buscar por paciente o cuestionario..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <span class="ml-4 text-gray-600 font-medium">Cargando respuestas...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="responses.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">No hay respuestas disponibles</h3>
        <p class="text-gray-500 mt-2">No se encontraron respuestas de cuestionarios de tinnitus.</p>
      </div>

      <!-- Responses Grid -->
      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="response in filteredResponses" :key="response.id"
          class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all cursor-pointer"
          @click="viewResponseDetail(response)">
          <!-- Card Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ response.patientName }}</h3>
                <p class="text-sm text-gray-500">{{ response.questionnaireTitle }}</p>
              </div>
            </div>
          </div>

          <!-- Score Badge -->
          <div class="flex items-center gap-2 mb-4">
            <span :class="getSeverityLevel(calculateTotalScore(response.answer)).color"
              class="px-3 py-1 rounded-full text-xs font-medium">
              {{ getSeverityLevel(calculateTotalScore(response.answer)).label }}
            </span>
            <span class="text-sm text-gray-600">
              Puntuación: {{ calculateTotalScore(response.answer) }}
            </span>
          </div>

          <!-- Summary -->
          <div class="border-t border-gray-100 pt-4">
            <p class="text-sm text-gray-600 mb-2">
              <span class="font-medium">{{ response.answer?.length || 0 }}</span> preguntas respondidas
            </p>
            <div class="flex flex-wrap gap-2">
              <span v-for="(ans, idx) in response.answer?.slice(0, 2)" :key="idx"
                class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {{ ans.title?.substring(0, 30) }}...
              </span>
              <span v-if="(response.answer?.length || 0) > 2" class="text-xs text-gray-500">
                +{{ response.answer.length - 2 }} más
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-4 pt-4 border-t border-gray-100 space-y-2">
            <button
              class="w-full py-2 bg-teal-50 text-teal-700 rounded-lg font-medium hover:bg-teal-100 transition-all flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c8.837 0 8.837 0 8.837 0m-8.837 14c-4.477 0-8.268-2.943-9.542-7 0 0 0 0 0 0m0 0c1.274-4.057 5.065-7 9.542-7 8.837 0 8.837 0 8.837 0" />
              </svg>
              Ver Detalle
            </button>
            <button @click.stop="openClinicalNoteModal(response)"
              class="w-full py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Agregar Nota Clínica
            </button>
            <button @click.stop="openAIAnalysisModal(response)"
              class="w-full py-2 bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 rounded-lg font-medium hover:from-violet-100 hover:to-purple-100 transition-all flex items-center justify-center gap-2 border border-violet-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Analizar con IA
            </button>
            <button @click.stop="openViewAnalysisModal(response)"
              class="w-full py-2 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-lg font-medium hover:from-amber-100 hover:to-orange-100 transition-all flex items-center justify-center gap-2 border border-amber-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Ver Análisis IA
            </button>
            <button @click.stop="openViewNotesModal(response)"
              class="w-full py-2 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition-all flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Ver Notas
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDetailModal && selectedResponse" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeDetailModal"></div>

          <!-- Modal Content -->
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-white">Detalle de Respuesta</h2>
                    <p class="text-teal-100 text-sm">{{ selectedResponse.patientName }}</p>
                  </div>
                </div>
                <button @click="closeDetailModal" class="text-white/80 hover:text-white transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <!-- Info Cards -->
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500 uppercase font-medium mb-1">Paciente</p>
                  <p class="font-semibold text-gray-900">{{ selectedResponse.patientName }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500 uppercase font-medium mb-1">Cuestionario</p>
                  <p class="font-semibold text-gray-900">{{ selectedResponse.questionnaireTitle }}</p>
                </div>
              </div>

              <!-- Total Score -->
              <div class="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-teal-700 font-medium">Puntuación Total</p>
                    <p class="text-3xl font-bold text-teal-800">
                      {{ calculateTotalScore(selectedResponse.answer) }}
                    </p>
                  </div>
                  <span :class="getSeverityLevel(calculateTotalScore(selectedResponse.answer)).color"
                    class="px-4 py-2 rounded-full text-sm font-bold">
                    {{ getSeverityLevel(calculateTotalScore(selectedResponse.answer)).label }}
                  </span>
                </div>
              </div>

              <!-- Answers List -->
              <div class="space-y-4">
                <h3 class="font-semibold text-gray-900 text-lg">Respuestas</h3>

                <div v-for="(answer, idx) in selectedResponse.answer" :key="idx"
                  class="bg-white border border-gray-200 rounded-xl p-4">
                  <div class="flex items-start gap-3">
                    <div
                      class="w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                      {{ idx + 1 }}
                    </div>
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-900 mb-1">{{ answer.title }}</h4>
                      <p class="text-sm text-gray-500 mb-3">{{ answer.description }}</p>

                      <div class="flex items-center gap-2">
                        <span class="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-sm font-medium">
                          {{ answer.optionsAnswer?.[0]?.text }}
                        </span>
                        <span class="text-sm text-gray-500">
                          (Valor: {{ answer.optionsAnswer?.[0]?.value }})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 px-6 py-4 flex justify-between">
              <button @click="openClinicalNoteModal(selectedResponse)"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Agregar Nota Clínica
              </button>
              <button @click="closeDetailModal"
                class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-all">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Clinical Note Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showClinicalNoteModal && selectedResponseForNote"
          class="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeClinicalNoteModal"></div>

          <!-- Modal Content -->
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-white">Nueva Nota Clínica</h2>
                    <p class="text-blue-100 text-sm">{{ selectedResponseForNote.questionnaireTitle }}</p>
                  </div>
                </div>
                <button @click="closeClinicalNoteModal" class="text-white/80 hover:text-white transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <!-- Patient Info -->
              <div class="bg-gray-50 rounded-lg p-4 mb-6">
                <p class="text-xs text-gray-500 uppercase font-medium mb-1">Paciente</p>
                <p class="font-semibold text-gray-900">{{ selectedResponseForNote.patientName }}</p>
              </div>

              <!-- Description Field -->
              <div class="space-y-2">
                <label for="clinicalNoteDescription" class="block text-sm font-medium text-gray-700">
                  Descripción de la Nota Clínica <span class="text-red-500">*</span>
                </label>
                <textarea id="clinicalNoteDescription" v-model="clinicalNoteForm.description" rows="6"
                  placeholder="Ingrese la descripción de la nota clínica..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"></textarea>
                <p class="text-xs text-gray-500">
                  {{ clinicalNoteForm.description.length }} caracteres
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button @click="closeClinicalNoteModal"
                class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-all">
                Cancelar
              </button>
              <button @click="saveClinicalNote" :disabled="isSavingNote || !clinicalNoteForm.description.trim()"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="isSavingNote" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                <span>{{ isSavingNote ? 'Guardando...' : 'Guardar Nota' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- View Notes Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showViewNotesModal && selectedResponseForView"
          class="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeViewNotesModal"></div>

      <!-- Modal Content -->
      <div :class="[
        'relative bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300',
        isClinicalNotesModalExpanded ? 'w-full max-w-[95vw] max-h-[95vh]' : 'w-full max-w-lg max-h-[90vh]'
      ]">

        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-white">
                      {{ clinicalNotesModalView === 'notes' ? 'Notas Clínicas' : 'Análisis de Notas' }}
                    </h2>
                    <p class="text-purple-100 text-sm">{{ selectedResponseForView.questionnaireTitle }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <!-- Toggle View Button -->
                  <button @click="toggleClinicalNotesModalView" :disabled="isLoadingNotesAnalysis"
                    class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-white/40 bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg v-if="clinicalNotesModalView === 'notes'" class="w-4 h-4" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{{ clinicalNotesModalView === 'notes' ? 'Ver Análisis' : 'Ver Notas' }}</span>
                  </button>

                  <!-- Expand/Collapse Button -->
                  <button @click="toggleExpandClinicalNotesModal"
                    class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-white/40 bg-white/10 text-white hover:bg-white/20 transition-colors">
                    <svg v-if="!isClinicalNotesModalExpanded" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 9V4.5M9 4.5a2.25 2.25 0 10-2.5-2.25M9 4.5c0 .515-.044 1.02-.132 1.5m5.625 4.5a2.25 2.25 0 10-2.25-2.25M15.375 12c0 .516-.044 1.02-.132 1.5m-5.625-4.5a2.25 2.25 0 10-2.25-2.25M9.75 12c0 .516.044 1.02.132 1.5m0 0c.288.404.614.785.956 1.14m-.956-1.14L4.5 16.5m11.25-4.5c.288.404.614.785.956 1.14m0 0L19.5 16.5" />
                    </svg>
                    <span>{{ isClinicalNotesModalExpanded ? 'Contraer' : 'Expandir' }}</span>
                  </button>

                  <button @click="closeViewNotesModal" class="text-white/80 hover:text-white transition-colors p-1">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <!-- Patient Info -->
              <div class="bg-gray-50 rounded-lg p-4 mb-4">
                <p class="text-xs text-gray-500 uppercase font-medium mb-1">Paciente</p>
                <p class="font-semibold text-gray-900">{{ selectedResponseForView.patientName }}</p>
              </div>

              <!-- ─── VISTA: NOTAS ─── -->
              <template v-if="clinicalNotesModalView === 'notes'">
                <!-- Loading State -->
                <div v-if="isLoadingNotes" class="flex items-center justify-center py-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span class="ml-3 text-gray-600">Cargando notas...</span>
                </div>

                <!-- Empty State -->
                <div v-else-if="clinicalNotes.length === 0" class="text-center py-8">
                  <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p class="text-gray-500">No hay notas clínicas registradas</p>
                </div>

                <!-- Notes List -->
                <div v-else class="space-y-4">
                  <div v-for="note in clinicalNotes" :key="note.id"
                    class="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <p class="text-gray-800 text-sm leading-relaxed">{{ note.description }}</p>
                    <div class="mt-3 pt-3 border-t border-purple-200 flex items-center justify-between">
                      <span class="text-xs text-purple-600 font-medium">
                        {{ formatDate(note.createdAt) }}
                      </span>
                      <span class="text-xs text-gray-500">
                        ID: {{ note.id.substring(0, 8) }}...
                      </span>
                    </div>
                  </div>
                </div>
              </template>

              <!-- ─── VISTA: ANÁLISIS ─── -->
              <template v-else>
                <!-- Loading State -->
                <div v-if="isLoadingNotesAnalysis" class="flex flex-col items-center justify-center py-12">
                  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mb-4"></div>
                  <p class="text-gray-600 font-medium">Cargando análisis...</p>
                </div>

                <!-- Error State -->
                <div v-else-if="!savedNotesAnalysis && !isLoadingNotesAnalysis" class="text-center py-12">
                  <div class="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-medium text-gray-900">No hay análisis guardado</h3>
                  <p class="text-gray-500 mt-2">Aún no se ha generado un análisis de IA para estas notas.</p>
                  <button @click="clinicalNotesModalView = 'notes'; openAIAnalysisModal(selectedResponseForView)"
                    class="mt-4 px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all">
                    Crear Análisis con IA
                  </button>
                </div>

                <!-- Analysis Result -->
                <div v-else class="bg-white rounded-lg">
                  <div class="prose prose-purple max-w-none" v-html="renderMarkdown(savedNotesAnalysis || '')"></div>
                </div>
              </template>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 px-6 py-4 flex justify-between">
              <!-- Botón Ver Análisis (solo en vista de notas y si hay notas) -->
              <button v-if="clinicalNotesModalView === 'notes' && clinicalNotes.length > 0"
                @click="toggleClinicalNotesModalView"
                class="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all inline-flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Ver Análisis
              </button>
              <div v-else class="flex-1"></div>

              <button @click="closeViewNotesModal"
                class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-all">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- AI Analysis Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showAIAnalysisModal && selectedResponseForAI"
          class="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeAIAnalysisModal"></div>

          <!-- Modal Content -->
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-white">Análisis con IA</h2>
                    <p class="text-violet-100 text-sm">{{ selectedResponseForAI.questionnaireTitle }}</p>
                  </div>
                </div>
                <button @click="closeAIAnalysisModal" class="text-white/80 hover:text-white transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <!-- Patient Info -->
              <div class="bg-gray-50 rounded-lg p-4 mb-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs text-gray-500 uppercase font-medium mb-1">Paciente</p>
                    <p class="font-semibold text-gray-900">{{ selectedResponseForAI.patientName }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-gray-500 uppercase font-medium mb-1">Puntuación</p>
                    <span :class="getSeverityLevel(calculateTotalScore(selectedResponseForAI.answer)).color"
                      class="px-3 py-1 rounded-full text-sm font-bold">
                      {{ calculateTotalScore(selectedResponseForAI.answer) }}/24 - {{
                        getSeverityLevel(calculateTotalScore(selectedResponseForAI.answer)).label }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="isAnalyzing" class="flex flex-col items-center justify-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mb-4"></div>
                <p class="text-gray-600 font-medium">Analizando respuestas con IA...</p>
                <p class="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</p>
              </div>

              <!-- Analysis Result -->
              <div v-else class="space-y-4">
                <div class="bg-violet-50 rounded-lg p-4 border border-violet-200">
                  <h4 class="text-sm font-semibold text-violet-800 mb-3 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Resultado del Análisis
                  </h4>
                  <div class="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                    v-html="aiAnalysisResult ? md.render(aiAnalysisResult) : '<p>Sin análisis disponible</p>'">
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 px-6 py-4 flex justify-between">
              <button @click="closeAIAnalysisModal"
                class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-all">
                Cerrar
              </button>
              <button @click="saveAIAnalysis" :disabled="isAnalyzing || !aiAnalysisResult || isSavingAnalysis"
                class="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="isSavingAnalysis" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>{{ isSavingAnalysis ? 'Guardando...' : 'Guardar Análisis' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- View Saved Analysis Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showViewAnalysisModal && selectedResponseForViewAnalysis"
          class="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeViewAnalysisModal"></div>

          <!-- Modal Content -->
          <div :class="[
            'relative bg-white rounded-2xl shadow-2xl w-full overflow-hidden transition-all duration-300',
            isExpanded ? 'max-w-6xl max-h-[95vh]' : 'max-w-3xl max-h-[90vh]'
          ]">
            <!-- Header -->
            <div class="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-white">Análisis de la respuesta del cuestionario</h2>
                    <p class="text-amber-100 text-sm">{{ selectedResponseForViewAnalysis.questionnaireTitle }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <!-- Toggle View Button -->
                  <button v-if="savedAnalysis" @click="toggleModalView" :disabled="isLoadingAnalysisNotes"
                    class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-white/40 bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <!-- Icono: libreta para notas, gráfico para análisis -->
                    <svg v-if="activeModalView === 'analysis'" class="w-4 h-4" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>{{ activeModalView === 'analysis' ? 'Mis notas' : 'Análisis' }}</span>
                  </button>

                  <!-- Expand Button -->
                  <button @click="toggleExpandModal" class="text-white/80 hover:text-white transition-colors p-1"
                    :title="isExpanded ? 'Reducir' : 'Expandir'">
                    <svg v-if="!isExpanded" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 9L4 4m0 0l5 5M4 4h5m6 5l5-5m0 0l-5 5m5-5v5m-5 6l5 5m0 0l-5-5m5 5v-5" />
                    </svg>
                  </button>
                  <!-- Close Button -->
                  <button @click="closeViewAnalysisModal" class="text-white/80 hover:text-white transition-colors p-1">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto"
              :class="isExpanded ? 'max-h-[calc(95vh-180px)]' : 'max-h-[calc(90vh-180px)]'">

              <!-- ─── VISTA: ANÁLISIS ─── -->
              <template v-if="activeModalView === 'analysis'">
                <!-- Loading State -->
                <div v-if="isLoadingAnalysis" class="flex flex-col items-center justify-center py-12">
                  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
                  <p class="text-gray-600 font-medium">Cargando análisis...</p>
                </div>

                <!-- No Analysis Found -->
                <div v-else-if="!savedAnalysis" class="text-center py-12">
                  <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-medium text-gray-900">No hay análisis guardado</h3>
                  <p class="text-gray-500 mt-2">Este cuestionario aún no tiene un análisis de IA guardado.</p>
                  <button @click="closeViewAnalysisModal; openAIAnalysisModal(selectedResponseForViewAnalysis)"
                    class="mt-4 px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all">
                    Crear Análisis con IA
                  </button>
                </div>

                <!-- Analysis Content -->
                <div v-else class="space-y-4">
                  <!-- Patient Info Card -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-xs text-gray-500 uppercase font-medium mb-1">Paciente</p>
                        <p class="font-semibold text-gray-900">{{ selectedResponseForViewAnalysis.patientName }}</p>
                      </div>
                      <div class="text-right">
                        <p class="text-xs text-gray-500 uppercase font-medium mb-1">Fecha del Análisis</p>
                        <p class="font-medium text-gray-700">{{ formatDate(savedAnalysis.createdAt) }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Analysis Result -->
                  <div class="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <div class="flex items-center justify-between mb-3">
                      <h4 class="text-sm font-semibold text-amber-800 flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Análisis Generado
                      </h4>
                      <span class="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                        {{ savedAnalysis.model }}
                      </span>
                    </div>
                    <div class="prose prose-sm max-w-none text-gray-700 leading-relaxed select-text"
                      @mouseup="handleTextSelection"
                      v-html="savedAnalysis.analysis ? md.render(savedAnalysis.analysis) : '<p>Sin análisis disponible</p>'">
                    </div>
                    <!-- Selected Text Preview -->
                    <div v-if="selectedText" class="mt-4 p-3 bg-white rounded border border-amber-300">
                      <p class="text-xs text-amber-600 font-medium mb-1">Texto seleccionado:</p>
                      <p class="text-sm text-gray-700 italic">"{{ selectedText.substring(0, 100) }}{{
                        selectedText.length
                          > 100 ? '...' : '' }}"</p>
                    </div>
                  </div>
                </div>
              </template>

              <!-- ─── VISTA: NOTAS ─── -->
              <template v-else-if="activeModalView === 'notes'">

                <!-- Estado 1: Cargando notas -->
                <div v-if="isLoadingAnalysisNotes"
                  class="flex flex-col items-center justify-center py-12 text-gray-400">
                  <svg class="animate-spin w-8 h-8 mb-3" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p class="text-sm">Cargando notas...</p>
                </div>

                <!-- Estado 2: Error al cargar -->
                <div v-else-if="analysisNotesError"
                  class="flex flex-col items-center justify-center py-12 text-red-500">
                  <p class="text-sm mb-3">{{ analysisNotesError }}</p>
                  <button @click="fetchAnalysisNotes" class="text-sm text-indigo-600 underline hover:text-indigo-800">
                    Reintentar
                  </button>
                </div>

                <!-- Estado 3: Sin notas -->
                <div v-else-if="analysisNotes.length === 0"
                  class="flex flex-col items-center justify-center py-12 text-gray-400">
                  <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
                             M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p class="text-sm font-medium text-gray-500">Sin notas aún</p>
                  <p class="text-xs text-gray-400 mt-1">
                    Las notas que crees aparecerán aquí.
                  </p>
                </div>

                <!-- Estado 4: Lista de notas -->
                <ul v-else class="divide-y divide-gray-100 space-y-0 max-h-96 overflow-y-auto">
                  <li v-for="note in analysisNotes" :key="note.id" class="py-4" :class="note.color || 'bg-gray-50'">
                    <div class="flex items-start justify-between gap-3 p-3 rounded-lg" :class="note.color || ''">
                      <div class="flex-1 min-w-0">
                        <!-- Título con indicador de color -->
                        <div class="flex items-center gap-2 mb-2">
                          <div v-if="note.color" class="w-3 h-3 rounded-md shadow-sm"
                            :class="note.color.split(' ')[0].replace('bg-', 'bg-')"
                            :style="{ backgroundColor: noteColors.find(c => c.value === note.color)?.color || '#FEF3C7' }">
                          </div>
                          <p class="text-sm font-semibold text-gray-800 truncate">
                            {{ note.title }}
                          </p>
                        </div>

                        <!-- Contenido de la nota (vista o edición) -->
                        <div v-if="editingNoteId === note.id">
                          <textarea v-model="editingNoteContent" rows="3"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                            placeholder="Editar nota..."></textarea>
                          <div class="flex gap-2 mt-2">
                            <button @click="saveNote(note.id)" :disabled="isEditingNote"
                              class="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1">
                              <svg v-if="isEditingNote" class="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                  stroke-width="4" />
                                <path class="opacity-75" fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M5 13l4 4L19 7" />
                              </svg>
                              Guardar
                            </button>
                            <button @click="cancelEditingNote" :disabled="isEditingNote"
                              class="px-3 py-1.5 text-xs font-medium bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50">
                              Cancelar
                            </button>
                          </div>
                        </div>
                        <div v-else>
                          <!-- Contenido principal de la nota -->
                          <p class="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                            {{ note.content }}
                          </p>

                          <!-- Contextos de la nota - Estructura de árbol con lectura en Z -->
                          <div v-if="note.context && note.context.length > 0" class="mt-3 ml-2">
                            <div class="flex items-center gap-1 mb-2">
                              <div class="w-4 h-px bg-gray-300"></div>
                              <span class="text-xs text-gray-500 font-medium">Contextos ({{ note.context.length
                                }})</span>
                            </div>
                            <div class="relative pl-3 border-l-2 border-gray-200 space-y-2">
                              <div v-for="(ctx, ctxIndex) in note.context" :key="ctx.id"
                                class="relative p-2 rounded-lg transition-all duration-200 hover:bg-white/50" :class="[
                                  ctxIndex % 2 === 0 ? 'bg-white/30 ml-0' : 'bg-white/10 ml-3',
                                  'border-l-2',
                                  ctxIndex % 2 === 0 ? 'border-indigo-300' : 'border-emerald-300'
                                ]">
                                <!-- Indicador visual para patrón Z -->
                                <div class="flex items-start gap-2">
                                  <div
                                    class="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                                    :class="ctxIndex % 2 === 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'">
                                    {{ ctxIndex + 1 }}
                                  </div>
                                  <div class="flex-1 min-w-0">
                                    <p class="text-xs text-gray-600 whitespace-pre-line leading-relaxed"
                                      :class="ctxIndex % 2 === 0 ? 'text-left' : 'text-right'">
                                      {{ ctx.content }}
                                    </p>
                                    <span class="text-[10px] text-gray-400 block mt-1"
                                      :class="ctxIndex % 2 === 0 ? 'text-left' : 'text-right'">
                                      {{ formatDateShort(ctx.createdAt) }}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Formulario para agregar contexto -->
                          <div v-if="addingContextToNoteId === note.id"
                            class="w-full mt-3 ml-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p class="text-xs font-medium text-gray-600 mb-2">Agregar contexto a esta nota:</p>
                            <textarea v-model="contextContent" rows="2"
                              class="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                              placeholder="Escribe el contexto adicional..."></textarea>
                            <div class="flex gap-2 mt-2 justify-end">
                              <button @click="cancelAddingContext" :disabled="isSavingContext"
                                class="px-3 py-1.5 text-xs font-medium bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50">
                                Cancelar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Acciones y fecha -->
                      <div class="flex flex-col items-end gap-2 flex-shrink-0">
                        <span class="text-xs text-gray-400 whitespace-nowrap">
                          {{ formatDateShort(note.createdAt) }}
                        </span>
                        <div class="flex items-center gap-1">
                          <!-- Botón Agregar Contexto -->
                          <button @click="startAddingContext(note.id)"
                            :disabled="addingContextToNoteId !== null || editingNoteId !== null"
                            class="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50"
                            title="Agregar contexto">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none" />
                            </svg>
                          </button>
                          <button @click="startEditingNote(note)"
                            :disabled="editingNoteId !== null || addingContextToNoteId !== null"
                            class="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors disabled:opacity-50"
                            title="Editar nota">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button @click="deleteNote(note.id)"
                            :disabled="isDeletingNote === note.id || editingNoteId !== null || addingContextToNoteId !== null"
                            class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                            title="Eliminar nota">
                            <svg v-if="isDeletingNote === note.id" class="animate-spin w-4 h-4" fill="none"
                              viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                stroke-width="4" />
                              <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>

              </template>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 px-6 py-4 flex justify-between items-center">
              <div class="flex items-center gap-3">
                <!-- Close Button -->
                <button @click="closeViewAnalysisModal"
                  class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-all">
                  Cerrar
                </button>
                <!-- Create Note Button -->
                <button v-if="savedAnalysis" @click="openColorMenu($event)"
                  :disabled="!selectedText || isCreatingNoteFromSelection"
                  class="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg v-if="isCreatingNoteFromSelection" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>{{ isCreatingNoteFromSelection ? 'Creando...' : 'Crear Nota' }}</span>
                </button>
                <!-- Analyze Notes Button -->
                <button v-if="activeModalView === 'notes' && analysisNotes.length > 0" @click="analyzeNotesByAI"
                  :disabled="isAnalyzingNotes"
                  class="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg v-if="isAnalyzingNotes" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>{{ isAnalyzingNotes ? 'Analizando...' : 'Analizar Notas por IA' }}</span>
                </button>
              </div>
              <!-- Delete Button (only if analysis exists) -->
              <button v-if="savedAnalysis" @click="deleteSavedAnalysis" :disabled="isDeletingAnalysis"
                class="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="isDeletingAnalysis" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>{{ isDeletingAnalysis ? 'Eliminando...' : 'Eliminar' }}</span>
              </button>
            </div>

            <!-- Color Selection Menu -->
            <div v-if="showColorMenu"
              class="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-2 px-3 z-[70] min-w-[200px]"
              :style="{ left: colorMenuPosition.x + 'px', top: colorMenuPosition.y - 120 + 'px' }" @click.stop>
              <p class="text-xs text-gray-500 font-medium mb-2 px-2">Seleccione color para la nota:</p>
              <div class="space-y-1">
                <button v-for="color in noteColors" :key="color.name" @click="createNoteFromSelection(color.value)"
                  class="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all text-left">
                  <div class="w-6 h-6 rounded-full border-2"
                    :class="color.value.split(' ')[0].replace('bg-', 'border-').replace('100', '300')"
                    :style="{ backgroundColor: color.color }"></div>
                  <span class="text-sm text-gray-700">{{ color.name }}</span>
                </button>
              </div>
              <button @click="closeColorMenu"
                class="w-full mt-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
                Cancelar
              </button>
            </div>
            <!-- Click outside to close color menu -->
            <div v-if="showColorMenu" class="fixed inset-0 z-[65]" @click="closeColorMenu"></div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal para Análisis de Notas por IA -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showNotesAnalysisModal"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]"
          @click.self="closeNotesAnalysisModal">
          <div :class="[
            'bg-white rounded-2xl shadow-2xl w-full overflow-hidden flex flex-col transition-all duration-300',
            isNotesAnalysisModalExpanded ? 'max-w-[95vw] max-h-[95vh]' : 'max-w-4xl max-h-[90vh]'
          ]">
            <!-- Header -->
            <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex justify-between items-center">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-white">Análisis de Notas por IA</h3>
                  <p class="text-xs text-purple-100">Análisis generado por inteligencia artificial</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <!-- Botón Expandir/Contraer -->
                <button @click="toggleNotesAnalysisModalSize"
                  class="text-white/80 hover:text-white transition-colors p-1"
                  :title="isNotesAnalysisModalExpanded ? 'Contraer' : 'Expandir'">
                  <svg v-if="isNotesAnalysisModalExpanded" class="w-5 h-5" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
                <button @click="closeNotesAnalysisModal" class="text-white/80 hover:text-white transition-colors p-1">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-6">
              <!-- Loading -->
              <div v-if="isAnalyzingNotes" class="flex flex-col items-center justify-center py-12">
                <svg class="animate-spin h-10 w-10 text-purple-600 mb-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                <p class="text-gray-600 font-medium">Analizando notas...</p>
                <p class="text-sm text-gray-400 mt-1">Esto puede tomar unos segundos</p>
              </div>

              <!-- Error -->
              <div v-else-if="notesAnalysisError" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-red-800 mb-2">Error al analizar</h4>
                <p class="text-sm text-red-600">{{ notesAnalysisError }}</p>
                <button @click="analyzeNotesByAI"
                  class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                  Reintentar
                </button>
              </div>

              <!-- Resultado -->
              <div v-else-if="notesAnalysisResult" class="space-y-6">
                <div class="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-4">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-medium text-purple-800">Análisis completado</span>
                  </div>
                  <p class="text-sm text-purple-600">
                    Se analizaron {{ analysisNotes.length }} notas. Este análisis fue generado por IA y debe ser
                    revisado
                    por un profesional médico.
                  </p>
                </div>

                <div class="prose prose-purple max-w-none">
                  <div v-html="md.render(notesAnalysisResult)" class="markdown-content text-gray-700 leading-relaxed">
                  </div>
                </div>
              </div>

              <!-- Sin resultado -->
              <div v-else class="text-center py-12 text-gray-400">
                <p>No hay resultado de análisis disponible</p>
              </div>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
              <button @click="closeNotesAnalysisModal"
                class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-all">
                Cerrar
              </button>
              <button v-if="notesAnalysisResult && !savedNotesAnalysisId" @click="saveNotesAnalysis"
                :disabled="isSavingNotesAnalysis"
                class="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="isSavingNotesAnalysis" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{{ isSavingNotesAnalysis ? 'Guardando...' : 'Guardar Análisis' }}</span>
              </button>
              <div v-if="savedNotesAnalysisId" class="flex items-center gap-2 text-emerald-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-sm font-medium">Análisis guardado</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
