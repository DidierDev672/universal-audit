<script setup lang="ts">
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { deleteScreeningResponse } from '../../services/screeningResponsesApi';
import { useGenAI } from '../../shared/service/useGenAi';

const isAnalyzing = ref(false);
const showAnalysisModal = ref(false);
const showClinicalNoteModal = ref(false);
const currentClinicalNote = ref<{
  responseId: string;
  id_patient: string;
  id_screening: string;
  patientName: string;
  screeningTitle: string;
  title: string;
  description: string;
} | null>(null);
const isSavingNote = ref(false);
const showViewNotesModal = ref(false);
const patientNotes = ref<ClinicalNote[]>([]);
const currentViewingPatient = ref<{ id: string; name: string } | null>(null);
const isLoadingNotes = ref(false);
const showEditNoteModal = ref(false);
const currentEditingNote = ref<ClinicalNote | null>(null);
const isUpdatingNote = ref(false);
const isDeletingNote = ref(false);
const showDeleteNoteModal = ref(false);
const notePendingDelete = ref<ClinicalNote | null>(null);
const deleteNoteConfirmText = ref('');
const showDeleteResponseModal = ref(false);
const responsePendingDelete = ref<ScreeningResponse | null>(null);
const deleteConfirmText = ref('');
const isDeletingResponse = ref(false);
const currentAnalysis = ref<{
  patientName: string;
  screeningTitle: string;
  analysis: string;
  positiveCount: number;
  negativeCount: number;
  totalQuestions: number;
  recommendations: string[];
} | null>(null);
const screeningResponses = ref<ScreeningResponse[]>([]);
const patients = ref<Patient[]>([]);
const screenings = ref<Screening[]>([]);
const isLoading = ref(false);
const error = ref('');
const searchQuery = ref('');

// Mapas de lookup
const patientsMap = computed(() => {
  const map = new Map<string, Patient>();
  patients.value.forEach(p => map.set(p.id, p));
  return map;
});

const screeningsMap = computed(() => {
  const map = new Map<string, Screening>();
  screenings.value.forEach(s => map.set(s.id, s));
  return map;
});

// Obtener nombre del paciente
const getPatientName = (id: string) => {
  return patientsMap.value.get(id)?.fullName || 'Paciente desconocido';
};

// Obtener nombre del tamizaje
const getScreeningTitle = (id: string) => {
  return screeningsMap.value.get(id)?.title || 'Tamizaje desconocido';
};

// Interfaces
interface ScreeningOption {
  id: string;
  text: string;
  value: number;
}

interface ScreeningResponse {
  id: string;
  id_patient: string;
  id_screening: string;
  options_answer: ScreeningOption[];
  created_at: string;
  updated_at: string;
}

interface Patient {
  id: string;
  fullName: string;
  documentNumber?: string;
  email?: string;
  phone?: string;
}

interface Screening {
  id: string;
  title: string;
  description?: string;
}

interface ClinicalNote {
  id: string;
  idPatient: string;
  idScreening: string;
  idDoctor: string;
  titleNote: string;
  descriptionNote: string;
  createdAt: string;
  updatedAt: string;
}

// Cargar pacientes
const loadPatients = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/v1/patients', { timeout: 30000 });
    const data = response.data;
    patients.value = Array.isArray(data) ? data : (data?.data || []);
    console.log(`✅ ${patients.value.length} pacientes cargados`);
  } catch (err) {
    console.error('Error loading patients:', err);
  }
};

// Cargar tamizajes
const loadScreenings = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/v1/screenings', { timeout: 30000 });
    const data = response.data;
    screenings.value = Array.isArray(data) ? data : (data?.data || []);
    console.log(`✅ ${screenings.value.length} tamizajes cargados`);
  } catch (err) {
    console.error('Error loading screenings:', err);
  }
};
const loadScreeningResponses = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    const response = await axios.get('http://localhost:3000/api/v1/screening-responses/all', {
      timeout: 30000,
    });
    // Handle both array response and wrapped response formats
    const data = response.data;
    screeningResponses.value = Array.isArray(data) ? data : (data?.data || []);
    console.log(`✅ ${screeningResponses.value.length} respuestas de tamizaje cargadas`);
  } catch (err: any) {
    let message = 'No se pudo cargar la lista de respuestas de tamizaje.';
    if (axios.isAxiosError(err)) {
      if (err.response) {
        message = 'Error del servidor al obtener respuestas.';
      } else if (err.request) {
        message = 'No se pudo conectar con el servidor.';
      }
    }
    error.value = message;
    console.error('Error loading screening responses:', err);
  } finally {
    isLoading.value = false;
  }
};

// Filtrar respuestas
const filteredResponses = computed(() => {
  let filtered = screeningResponses.value;

  // Filtrar por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(response =>
      response.id.toLowerCase().includes(query) ||
      getPatientName(response.id_patient).toLowerCase().includes(query) ||
      getScreeningTitle(response.id_screening).toLowerCase().includes(query)
    );
  }

  return filtered.sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
});

// Formatear fecha
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getPatientInitials = (patientId: string) => {
  const name = getPatientName(patientId);
  const parts = name.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const getAnswerSummary = (response: ScreeningResponse) => {
  const positive = response.options_answer.filter((opt) => opt.value === 1).length;
  const negative = response.options_answer.filter((opt) => opt.value === 0).length;
  return { positive, negative, total: response.options_answer.length };
};

// Analizar respuestas con IA (Gemini)
const analyzeResponses = async (response: ScreeningResponse) => {
  try {
    isAnalyzing.value = true;

    // Contar respuestas positivas (1) y negativas (0)
    const positiveCount = response.options_answer.filter(opt => opt.value === 1).length;
    const negativeCount = response.options_answer.filter(opt => opt.value === 0).length;
    const totalQuestions = response.options_answer.length;

    // Preparar datos para el prompt
    const patientName = getPatientName(response.id_patient);
    const screeningTitle = getScreeningTitle(response.id_screening);

    // Crear lista de respuestas con su interpretación
    const answersList = response.options_answer.map(opt =>
      `- "${opt.text}": ${opt.value === 1 ? 'SÍ (1/True) - Positivo para indicador de riesgo' : 'NO (0/False) - Negativo para indicador de riesgo'}`
    ).join('\n');

    // Construir prompt para Gemini
    const prompt = `Actúa como un especialista médico en audiología.Analiza las siguientes respuestas de un tamizaje auditivo y proporciona un análisis clínico profesional.

** CONTEXTO IMPORTANTE:**
    - Valor "1" = "SÍ"(respuesta positiva al síntoma / pregunta)
    - Valor "0" = "NO"(respuesta negativa al síntoma / pregunta)
    - Una respuesta con valor 1 indica la PRESENCIA de un indicador de riesgo auditivo
    - Una respuesta con valor 0 indica la AUSENCIA de ese indicador de riesgo

    ** DATOS DEL PACIENTE:**
    - Nombre: ${patientName}
    - Tamizaje: ${screeningTitle}
    - Total de preguntas: ${totalQuestions}
    - Respuestas con valor 1(indicadores positivos): ${positiveCount}
    - Respuestas con valor 0(indicadores negativos): ${negativeCount}

    ** RESPUESTAS DEL PACIENTE:**
    ${answersList}

Por favor, proporciona tu análisis en el siguiente formato JSON(responde ÚNICAMENTE con el JSON, sin markdown ni explicaciones adicionales):

      {
        "interpretacion": "Análisis clínico detallado del significado de estas respuestas para la salud auditiva del paciente. Explica qué significan los indicadores positivos encontrados.",
        "nivelRiesgo": "ALTO|MEDIO|BAJO",
        "recomendaciones": [
          "Recomendación médica específica 1",
          "Recomendación médica específica 2",
          "Recomendación médica específica 3",
          "Recomendación médica específica 4"
        ]
      }`;

    // Llamar a Gemini
    const model = useGenAI();
    const result = await model.generateContent(prompt);
    const geminiResponse = result.response.text();

    // Parsear la respuesta JSON
    let analysisData;
    try {
      // Intentar extraer JSON de la respuesta
      const jsonMatch = geminiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No se encontró JSON en la respuesta');
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      // Fallback a análisis local si Gemini no responde correctamente
      analysisData = generateFallbackAnalysis(positiveCount, negativeCount, totalQuestions);
    }

    currentAnalysis.value = {
      patientName,
      screeningTitle,
      analysis: analysisData.interpretacion || analysisData.analysis || 'Análisis no disponible',
      positiveCount,
      negativeCount,
      totalQuestions,
      recommendations: analysisData.recomendaciones || analysisData.recommendations || []
    };

    showAnalysisModal.value = true;
  } catch (err) {
    console.error('Error analyzing responses with Gemini:', err);
    alert('Error al analizar las respuestas con IA. Por favor intente nuevamente.');
  } finally {
    isAnalyzing.value = false;
  }
};

// Análisis de respaldo en caso de error con Gemini
const generateFallbackAnalysis = (positiveCount: number, negativeCount: number, totalQuestions: number) => {
  const positivePercentage = totalQuestions > 0 ? (positiveCount / totalQuestions) * 100 : 0;

  if (positivePercentage >= 70) {
    return {
      interpretacion: `El paciente presenta ${positiveCount} de ${totalQuestions} indicadores positivos(${Math.round(positivePercentage)} %).Esto sugiere una alta probabilidad de condiciones auditivas que requieren atención especializada.`,
      nivelRiesgo: 'ALTO',
      recomendaciones: [
        'Programar evaluación auditiva completa',
        'Considerar derivación a otorrinolaringología',
        'Realizar seguimiento periódico de la condición',
        'Documentar antecedentes familiares relacionados'
      ]
    };
  } else if (positivePercentage >= 40) {
    return {
      interpretacion: `El paciente presenta ${positiveCount} de ${totalQuestions} indicadores positivos(${Math.round(positivePercentage)} %).Se observan señales mixtas que podrían indicar condiciones auditivas en desarrollo.`,
      nivelRiesgo: 'MEDIO',
      recomendaciones: [
        'Realizar evaluación auditiva de seguimiento',
        'Monitorear cambios en la audición',
        'Educar al paciente sobre signos de alerta',
        'Programar revisión en 3-6 meses'
      ]
    };
  } else {
    return {
      interpretacion: `El paciente presenta ${positiveCount} de ${totalQuestions} indicadores positivos(${Math.round(positivePercentage)} %).La mayoría de las respuestas son negativas, lo que sugiere bajo riesgo auditivo actual.`,
      nivelRiesgo: 'BAJO',
      recomendaciones: [
        'Continuar con chequeos auditivos de rutina',
        'Mantener hábitos de protección auditiva',
        'Programar revisión anual preventiva',
        'Educar sobre prevención de daño auditivo'
      ]
    };
  }
};

const closeAnalysisModal = () => {
  showAnalysisModal.value = false;
  currentAnalysis.value = null;
};

// Funciones para crear notas clínicas
const openClinicalNoteModal = (response: ScreeningResponse) => {
  currentClinicalNote.value = {
    responseId: response.id,
    id_patient: response.id_patient,
    id_screening: response.id_screening,
    patientName: getPatientName(response.id_patient),
    screeningTitle: getScreeningTitle(response.id_screening),
    title: '',
    description: ''
  };
  showClinicalNoteModal.value = true;
};

const closeClinicalNoteModal = () => {
  showClinicalNoteModal.value = false;
  currentClinicalNote.value = null;
};

// Función para mostrar alertas UX
const showValidationAlert = (message: string, type: 'error' | 'warning' = 'error') => {
  const alertDiv = document.createElement('div');
  alertDiv.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    }`;
  alertDiv.innerHTML = `
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
        d="${type === 'error' ? 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' : 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'}" />
    </svg>
    <span class="font-medium">${message}</span>
  `;
  document.body.appendChild(alertDiv);
  setTimeout(() => {
    alertDiv.remove();
  }, 4000);
};

const saveClinicalNote = async () => {
  if (!currentClinicalNote.value) return;

  // Validación de campos obligatorios
  if (!currentClinicalNote.value.title.trim()) {
    showValidationAlert('El título de la nota es obligatorio');
    return;
  }

  if (!currentClinicalNote.value.description.trim()) {
    showValidationAlert('La descripción de la nota es obligatoria');
    return;
  }

  isSavingNote.value = true;

  try {
    const { id_patient, id_screening, title, description } = currentClinicalNote.value;

    // Validar que el paciente existe
    console.log(`🔍 Validando paciente: ${id_patient}`);
    try {
      const patientResponse = await axios.get(`http://localhost:3000/api/v1/patients/${id_patient}`, {
        timeout: 10000
      });
      if (!patientResponse.data) {
        showValidationAlert(`El paciente no existe en el sistema.`, 'error');
        isSavingNote.value = false;
        return;
      }
      console.log('✅ Paciente verificado');
    } catch (patientError: any) {
      if (patientError.response?.status === 404) {
        showValidationAlert('El paciente no existe en el sistema. No se puede crear la nota.', 'error');
      } else {
        showValidationAlert('Error al verificar el paciente. Intente nuevamente.', 'error');
      }
      console.error('❌ Error validando paciente:', patientError);
      isSavingNote.value = false;
      return;
    }

    // Validar que el tamizaje existe
    console.log(`🔍 Validando tamizaje: ${id_screening}`);
    try {
      const screeningResponse = await axios.get(`http://localhost:3000/api/v1/screenings/${id_screening}`, {
        timeout: 10000
      });
      if (!screeningResponse.data) {
        showValidationAlert('El tamizaje no existe en el sistema. No se puede crear la nota.', 'error');
        isSavingNote.value = false;
        return;
      }
      console.log('✅ Tamizaje verificado');
    } catch (screeningError: any) {
      if (screeningError.response?.status === 404) {
        showValidationAlert('El tamizaje no existe en el sistema. No se puede crear la nota.', 'error');
      } else {
        showValidationAlert('Error al verificar el tamizaje. Intente nuevamente.', 'error');
      }
      console.error('❌ Error validando tamizaje:', screeningError);
      isSavingNote.value = false;
      return;
    }

    // TODO: Obtener el ID del doctor del sistema de autenticación
    // Por ahora, usar un valor placeholder que debe ser reemplazado
    const id_doctor = id_patient; // Reemplazar con el ID real del doctor logueado
    const note_type = 'CLINICAL_NOTE';
    // Estructura esperada por el endpoint
    const noteData = {
      id_patient,
      id_screening,
      id_doctor,
      note_type,
      title_note: title.trim(),
      description_note: description.trim()
    };

    console.log('📤 Enviando nota clínica al servidor:', noteData);

    // Consumir el endpoint
    const response = await axios.post('http://localhost:3000/api/v1/screening-notes', noteData, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Nota clínica guardada exitosamente:', response.data);

    // Mostrar mensaje de éxito
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 bg-emerald-100 text-emerald-800 border border-emerald-200';
    successDiv.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span class="font-medium">Nota clínica creada exitosamente</span>
    `;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);

    closeClinicalNoteModal();
  } catch (error: any) {
    console.error('❌ Error al guardar nota clínica:', error);
    showValidationAlert(
      error.response?.data?.message || 'Error al guardar la nota clínica. Intente nuevamente.',
      'error'
    );
  } finally {
    isSavingNote.value = false;
  }
};

// Funciones para ver notas clínicas del paciente
const openViewNotesModal = async (response: ScreeningResponse) => {
  currentViewingPatient.value = {
    id: response.id_patient,
    name: getPatientName(response.id_patient)
  };
  showViewNotesModal.value = true;
  await loadPatientNotes(response.id_patient);
};

const closeViewNotesModal = () => {
  showViewNotesModal.value = false;
  patientNotes.value = [];
  currentViewingPatient.value = null;
};

const loadPatientNotes = async (patientId: string) => {
  isLoadingNotes.value = true;
  try {
    console.log(`🔍 Cargando notas del paciente: ${patientId}`);
    const response = await axios.get(`http://localhost:3000/api/v1/screening-notes/patient/${patientId}`, {
      timeout: 30000
    });

    // Handle both array response and wrapped response formats
    const data = response.data;
    patientNotes.value = Array.isArray(data) ? data : (data?.data || []);
    console.log(`✅ ${patientNotes.value.length} notas cargadas para el paciente ${patientId}`);
  } catch (error: any) {
    console.error('❌ Error cargando notas del paciente:', error);
    showValidationAlert(
      error.response?.data?.message || 'Error al cargar las notas clínicas del paciente.',
      'error'
    );
    patientNotes.value = [];
  } finally {
    isLoadingNotes.value = false;
  }
};

const formatNoteDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Funciones para editar notas clínicas
const openEditNoteModal = (note: ClinicalNote) => {
  currentEditingNote.value = { ...note }; // Copia para no mutar la original
  showEditNoteModal.value = true;
};

const closeEditNoteModal = () => {
  showEditNoteModal.value = false;
  currentEditingNote.value = null;
};

const updateClinicalNote = async () => {
  if (!currentEditingNote.value) return;

  // Validación de campos obligatorios
  if (!currentEditingNote.value.titleNote.trim()) {
    showValidationAlert('El título de la nota es obligatorio');
    return;
  }

  if (!currentEditingNote.value.descriptionNote.trim()) {
    showValidationAlert('La descripción de la nota es obligatoria');
    return;
  }

  isUpdatingNote.value = true;

  try {
    const { id, titleNote, descriptionNote } = currentEditingNote.value;

    // Estructura esperada por el endpoint
    const noteData = {
      titleNote: titleNote.trim(),
      descriptionNote: descriptionNote.trim()
    };

    console.log('📤 Actualizando nota clínica:', noteData);

    // Consumir el endpoint PUT
    const response = await axios.put(`http://localhost:3000/api/v1/screening-notes/${id}`, noteData, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Nota clínica actualizada exitosamente:', response.data);

    // Actualizar la lista de notas
    if (currentViewingPatient.value) {
      await loadPatientNotes(currentViewingPatient.value.id);
    }

    // Mostrar mensaje de éxito
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 bg-emerald-100 text-emerald-800 border border-emerald-200';
    successDiv.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span class="font-medium">Nota clínica actualizada exitosamente</span>
    `;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);

    closeEditNoteModal();
  } catch (error: any) {
    console.error('❌ Error al actualizar nota clínica:', error);
    showValidationAlert(
      error.response?.data?.message || 'Error al actualizar la nota clínica. Intente nuevamente.',
      'error'
    );
  } finally {
    isUpdatingNote.value = false;
  }
};

const canConfirmResponseDeletion = computed(
  () => deleteConfirmText.value.trim().toUpperCase() === 'ELIMINAR',
);

const openDeleteResponseModal = (response: ScreeningResponse) => {
  responsePendingDelete.value = response;
  deleteConfirmText.value = '';
  showDeleteResponseModal.value = true;
};

const closeDeleteResponseModal = () => {
  showDeleteResponseModal.value = false;
  responsePendingDelete.value = null;
  deleteConfirmText.value = '';
};

const confirmDeleteResponse = async () => {
  if (!responsePendingDelete.value || !canConfirmResponseDeletion.value) return;

  const id = responsePendingDelete.value.id;
  isDeletingResponse.value = true;

  try {
    await deleteScreeningResponse(id);
    screeningResponses.value = screeningResponses.value.filter((r) => r.id !== id);
    closeDeleteResponseModal();

    const successDiv = document.createElement('div');
    successDiv.className =
      'fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 bg-emerald-100 text-emerald-800 border border-emerald-200';
    successDiv.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span class="font-medium">Respuesta de tamizaje eliminada</span>
    `;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
  } catch (error: any) {
    console.error('Error al eliminar respuesta de tamizaje:', error);
    showValidationAlert(
      error.response?.data?.error ||
      error.response?.data?.message ||
      'No se pudo eliminar la respuesta. Intente nuevamente.',
      'error',
    );
  } finally {
    isDeletingResponse.value = false;
  }
};

const canConfirmNoteDeletion = computed(
  () => deleteNoteConfirmText.value.trim().toUpperCase() === 'ELIMINAR',
);

const openDeleteNoteModal = (note: ClinicalNote) => {
  notePendingDelete.value = note;
  deleteNoteConfirmText.value = '';
  showDeleteNoteModal.value = true;
};

const closeDeleteNoteModal = () => {
  showDeleteNoteModal.value = false;
  notePendingDelete.value = null;
  deleteNoteConfirmText.value = '';
};

const confirmDeleteClinicalNote = async () => {
  if (!notePendingDelete.value || !canConfirmNoteDeletion.value) return;

  const noteId = notePendingDelete.value.id;
  isDeletingNote.value = true;

  try {
    await axios.delete(`http://localhost:3000/api/v1/screening-notes/${noteId}`, {
      timeout: 30000,
    });

    if (currentViewingPatient.value) {
      await loadPatientNotes(currentViewingPatient.value.id);
    }

    closeDeleteNoteModal();

    const successDiv = document.createElement('div');
    successDiv.className =
      'fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 bg-emerald-100 text-emerald-800 border border-emerald-200';
    successDiv.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span class="font-medium">Nota clínica eliminada</span>
    `;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
  } catch (error: any) {
    console.error('Error al eliminar nota clínica:', error);
    showValidationAlert(
      error.response?.data?.message || 'Error al eliminar la nota clínica. Intente nuevamente.',
      'error',
    );
  } finally {
    isDeletingNote.value = false;
  }
};

onMounted(() => {
  loadPatients();
  loadScreenings();
  loadScreeningResponses();
});
</script>

<template>
  <div class="sr-page min-h-screen bg-[#f4f8f7]">
    <!-- Z-1: Identidad clínica (arriba-izq) → métrica (arriba-der) -->
    <header class="sr-hero relative overflow-hidden border-b border-[#0d9e6e]/10">
      <div class="absolute inset-0 bg-linear-to-br from-[#ecfdf5] via-[#f0f9ff] to-white" />
      <div class="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-[#0ea5e9]/10 blur-3xl" />
      <div class="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-[#0d9e6e]/10 blur-3xl" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-start gap-4">
            <div
              class="w-14 h-14 rounded-2xl bg-white border border-[#0d9e6e]/15 shadow-[0_8px_24px_rgba(13,158,110,0.12)] flex items-center justify-center shrink-0">
              <svg class="w-7 h-7 text-[#0d9e6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0d9e6e] mb-1">
                Registro clínico
              </p>
              <h1 class="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                Respuestas de tamizaje
              </h1>
              <p class="text-sm text-[#64748b] mt-1 max-w-xl leading-relaxed">
                Historial de evaluaciones por paciente. Escanea de izquierda a derecha: persona, tamizaje y resultados.
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 lg:justify-end">
            <div class="sr-stat-pill px-4 py-3 rounded-2xl bg-white/80 border border-[#0d9e6e]/12 backdrop-blur-sm">
              <p class="text-[10px] uppercase tracking-wider text-[#64748b] font-medium">En vista</p>
              <p class="text-2xl font-semibold text-[#0d9e6e] tabular-nums">{{ filteredResponses.length }}</p>
            </div>
            <div class="sr-stat-pill px-4 py-3 rounded-2xl bg-white/80 border border-[#0ea5e9]/12 backdrop-blur-sm">
              <p class="text-[10px] uppercase tracking-wider text-[#64748b] font-medium">Total</p>
              <p class="text-2xl font-semibold text-[#0ea5e9] tabular-nums">{{ screeningResponses.length }}</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- Z-2: Barra de búsqueda horizontal -->
      <section
        class="sr-panel rounded-2xl border border-black/[0.06] bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <label for="sr-search" class="sr-only">Buscar respuestas</label>
        <div class="relative">
          <svg class="w-5 h-5 text-[#94a3b8] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input id="sr-search" v-model="searchQuery" type="search"
            placeholder="Buscar por paciente, tamizaje o ID de respuesta..."
            class="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0d9e6e] focus:ring-2 focus:ring-[#0d9e6e]/15 transition-all" />
        </div>
      </section>

      <!-- Loading -->
      <div v-if="isLoading"
        class="sr-panel flex flex-col items-center justify-center py-16 rounded-2xl bg-white border border-black/[0.06]">
        <svg class="w-11 h-11 text-[#0d9e6e] animate-spin mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <p class="text-[#64748b] text-sm">Cargando respuestas de tamizaje...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error"
        class="sr-panel flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-white border border-red-100">
        <div class="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-lg font-semibold text-[#1e293b] mb-2">Error al cargar</h2>
        <p class="text-[#64748b] text-sm mb-5 max-w-md">{{ error }}</p>
        <button @click="loadScreeningResponses"
          class="px-5 py-2.5 bg-[#0d9e6e] text-white rounded-xl text-sm font-medium hover:bg-[#0b8a61] transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reintentar
        </button>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredResponses.length === 0"
        class="sr-panel flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-white border border-black/[0.06]">
        <div class="w-14 h-14 bg-[#f1f5f9] rounded-2xl flex items-center justify-center mb-4">
          <svg class="w-7 h-7 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 class="text-lg font-semibold text-[#1e293b] mb-2">No se encontraron respuestas</h2>
        <p class="text-[#64748b] text-sm">
          {{ searchQuery ? 'Prueba con otro término de búsqueda.' : 'Aún no hay respuestas de tamizaje registradas.' }}
        </p>
      </div>

      <!-- Z-3: Listado en tarjetas con patrón Z interno -->
      <section v-else class="space-y-4" aria-label="Lista de respuestas de tamizaje">
        <article v-for="response in filteredResponses" :key="response.id"
          class="sr-card group rounded-2xl border border-black/[0.06] bg-white overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(13,158,110,0.08)] transition-shadow">

          <!-- Z interno 1: Paciente (izq) → Acciones primarias (der) -->
          <header
            class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between px-5 sm:px-6 pt-5 pb-4 border-b border-[#f1f5f9]">
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-12 h-12 rounded-xl bg-linear-to-br from-[#0d9e6e] to-[#0ea5e9] text-white font-semibold text-sm flex items-center justify-center shrink-0 shadow-sm"
                :aria-label="`Iniciales de ${getPatientName(response.id_patient)}`">
                {{ getPatientInitials(response.id_patient) }}
              </div>
              <div class="min-w-0">
                <h2 class="text-base font-semibold text-[#1e293b] truncate">
                  {{ getPatientName(response.id_patient) }}
                </h2>
                <p class="text-xs text-[#64748b] mt-0.5 truncate">
                  {{ getScreeningTitle(response.id_screening) }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 sm:shrink-0 sm:justify-end">
              <button @click.stop="analyzeResponses(response)" :disabled="isAnalyzing"
                class="px-3.5 py-2 rounded-xl text-sm font-medium text-white bg-linear-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#4f46e5] hover:to-[#4338ca] shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <svg v-if="isAnalyzing" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {{ isAnalyzing ? 'Analizando...' : 'Analizar con IA' }}
              </button>
              <button @click.stop="openDeleteResponseModal(response)" :disabled="isDeletingResponse"
                class="p-2 rounded-xl text-[#94a3b8] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all disabled:opacity-50"
                title="Eliminar respuesta">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </header>

          <!-- Z interno 2: Franja de métricas escaneable -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#f1f5f9]">
            <div class="bg-white px-5 py-3.5">
              <p class="text-[10px] uppercase tracking-wider text-[#94a3b8] font-medium mb-1">Ítems</p>
              <p class="text-lg font-semibold text-[#1e293b] tabular-nums">{{ getAnswerSummary(response).total }}</p>
            </div>
            <div class="bg-white px-5 py-3.5">
              <p class="text-[10px] uppercase tracking-wider text-[#94a3b8] font-medium mb-1">Positivos</p>
              <p class="text-lg font-semibold text-[#0d9e6e] tabular-nums">{{ getAnswerSummary(response).positive }}</p>
            </div>
            <div class="bg-white px-5 py-3.5">
              <p class="text-[10px] uppercase tracking-wider text-[#94a3b8] font-medium mb-1">Negativos</p>
              <p class="text-lg font-semibold text-[#e11d48] tabular-nums">{{ getAnswerSummary(response).negative }}</p>
            </div>
            <div class="bg-white px-5 py-3.5 col-span-2 lg:col-span-1">
              <p class="text-[10px] uppercase tracking-wider text-[#94a3b8] font-medium mb-1">Registrado</p>
              <p class="text-sm font-medium text-[#475569] leading-snug">{{ formatDate(response.created_at) }}</p>
            </div>
          </div>

          <!-- Z interno 3: Acciones secundarias (izq) → Detalle de respuestas (der) -->
          <footer class="flex flex-col lg:flex-row lg:items-end gap-4 px-5 sm:px-6 py-4">
            <div class="flex flex-wrap gap-2 lg:w-56 shrink-0">
              <button @click.stop="openClinicalNoteModal(response)"
                class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-[#0d9e6e] bg-[#ecfdf5] hover:bg-[#d1fae5] border border-[#0d9e6e]/15 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Nueva nota
              </button>
              <button @click.stop="openViewNotesModal(response)"
                class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-[#0369a1] bg-[#f0f9ff] hover:bg-[#e0f2fe] border border-[#0ea5e9]/15 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Ver notas
              </button>
            </div>

            <div v-if="response.options_answer.length > 0" class="flex-1 min-w-0">
              <p class="text-[10px] uppercase tracking-wider text-[#94a3b8] font-medium mb-2">Resultados del tamizaje
              </p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="opt in response.options_answer" :key="opt.id"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border" :class="opt.value === 1
                    ? 'bg-[#ecfdf5] text-[#047857] border-[#0d9e6e]/20'
                    : 'bg-[#fff1f2] text-[#be123c] border-[#fda4af]/40'">
                  <span class="font-medium truncate max-w-[140px] sm:max-w-[200px]">{{ opt.text }}</span>
                  <span class="font-semibold tabular-nums px-1.5 py-0.5 rounded-md text-[10px]"
                    :class="opt.value === 1 ? 'bg-[#0d9e6e]/15' : 'bg-[#fecdd3]/60'">
                    {{ opt.value }}
                  </span>
                </span>
              </div>
            </div>
          </footer>
        </article>
      </section>
    </main>

    <!-- Modal de confirmación para eliminar respuesta -->
    <Teleport to="body">
      <Transition name="app-modal">
        <div v-if="showDeleteResponseModal && responsePendingDelete" class="app-modal-root" style="z-index: 60">
          <div class="app-modal-backdrop" aria-hidden="true" @click="closeDeleteResponseModal" />
          <div class="app-modal-scrim app-modal-scrim--sheet" @click.self="closeDeleteResponseModal">
            <div
              class="app-modal-panel app-modal-panel--sheet bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              role="dialog" aria-modal="true" aria-labelledby="delete-response-title" @click.stop>
              <div class="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 id="delete-response-title" class="text-xl font-bold text-white">
                      Vas a perder un registro clínico
                    </h2>
                    <p class="text-white/85 text-sm">
                      Esta decisión no se puede deshacer
                    </p>
                  </div>
                </div>
              </div>

              <div class="p-6 space-y-5">
                <p class="text-gray-800 leading-relaxed">
                  Estás a punto de borrar la <strong>única copia registrada</strong> de las respuestas de
                  <strong>{{ getPatientName(responsePendingDelete.id_patient) }}</strong>
                  al tamizaje
                  <strong>"{{ getScreeningTitle(responsePendingDelete.id_screening) }}"</strong>.
                </p>

                <div class="rounded-xl border border-red-100 bg-red-50/70 p-4 space-y-2 text-sm text-red-900">
                  <p class="font-medium">Si eliminas ahora, perderás de forma permanente:</p>
                  <ul class="list-disc pl-5 space-y-1">
                    <li>
                      Las <strong>{{ responsePendingDelete.options_answer.length }} respuestas</strong>
                      capturadas el {{ formatDate(responsePendingDelete.created_at) }}
                    </li>
                    <li>El historial que respalda el seguimiento clínico de este paciente</li>
                    <li>Cualquier análisis o nota que dependa de este tamizaje como referencia</li>
                  </ul>
                </div>

                <p class="text-sm text-gray-600 italic">
                  Conservar el registro no tiene costo. Eliminarlo sí: después no podrás recuperar esta información.
                </p>

                <div>
                  <label for="delete-confirm-input" class="block text-sm font-medium text-gray-700 mb-1.5">
                    Para confirmar que comprendes las consecuencias, escribe <span
                      class="font-mono text-red-700">ELIMINAR</span>
                  </label>
                  <input id="delete-confirm-input" v-model="deleteConfirmText" type="text" autocomplete="off"
                    placeholder="Escribe ELIMINAR"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none font-mono uppercase tracking-wide" />
                </div>
              </div>

              <div class="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button @click="confirmDeleteResponse" :disabled="!canConfirmResponseDeletion || isDeletingResponse"
                  class="px-4 py-2.5 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  <svg v-if="isDeletingResponse" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {{ isDeletingResponse ? 'Eliminando...' : 'Sí, eliminar permanentemente' }}
                </button>
                <button @click="closeDeleteResponseModal"
                  class="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all shadow-sm">
                  Conservar este registro
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal de Análisis con IA -->
    <Teleport to="body">
      <Transition name="app-modal">
        <div v-if="showAnalysisModal && currentAnalysis" class="app-modal-root" style="z-index: 50">
          <div class="app-modal-backdrop" aria-hidden="true" @click="closeAnalysisModal" />
          <div class="app-modal-scrim app-modal-scrim--sheet" @click.self="closeAnalysisModal">
            <div
              class="app-modal-panel app-modal-panel--sheet bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              role="dialog" aria-modal="true" @click.stop>
              <!-- Header -->
              <div class="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 rounded-t-2xl">
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
                      <p class="text-white/80 text-sm">Resultados del tamizaje auditivo</p>
                    </div>
                  </div>
                  <button @click="closeAnalysisModal" class="text-white/80 hover:text-white transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Body -->
              <div class="p-6">
                <!-- Patient & Screening Info -->
                <div class="bg-gray-50 rounded-xl p-4 mb-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide">Paciente</p>
                      <p class="text-lg font-semibold text-gray-900">{{ currentAnalysis.patientName }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide">Tamizaje</p>
                      <p class="text-lg font-semibold text-gray-900">{{ currentAnalysis.screeningTitle }}</p>
                    </div>
                  </div>
                </div>

                <!-- Statistics -->
                <div class="grid grid-cols-3 gap-4 mb-6">
                  <div class="bg-emerald-50 rounded-xl p-4 text-center">
                    <p class="text-2xl font-bold text-emerald-600">{{ currentAnalysis.positiveCount }}</p>
                    <p class="text-xs text-emerald-700 uppercase tracking-wide">Positivas (1)</p>
                  </div>
                  <div class="bg-red-50 rounded-xl p-4 text-center">
                    <p class="text-2xl font-bold text-red-600">{{ currentAnalysis.negativeCount }}</p>
                    <p class="text-xs text-red-700 uppercase tracking-wide">Negativas (0)</p>
                  </div>
                  <div class="bg-blue-50 rounded-xl p-4 text-center">
                    <p class="text-2xl font-bold text-blue-600">{{ currentAnalysis.totalQuestions }}</p>
                    <p class="text-xs text-blue-700 uppercase tracking-wide">Total</p>
                  </div>
                </div>

                <!-- Analysis Text -->
                <div class="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl p-4 mb-6">
                  <h3 class="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Interpretación
                  </h3>
                  <p class="text-indigo-800 leading-relaxed">{{ currentAnalysis.analysis }}</p>
                </div>

                <!-- Recommendations -->
                <div>
                  <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Recomendaciones
                  </h3>
                  <ul class="space-y-2">
                    <li v-for="(rec, index) in currentAnalysis.recommendations" :key="index"
                      class="flex items-start gap-2">
                      <span
                        class="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">{{
                          index + 1 }}</span>
                      <span class="text-gray-700">{{ rec }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Footer -->
              <div class="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end">
                <button @click="closeAnalysisModal"
                  class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-all">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal de Crear Nota Clínica -->
    <Teleport to="body">
      <Transition name="app-modal">
        <div v-if="showClinicalNoteModal && currentClinicalNote" class="app-modal-root" style="z-index: 50">
          <div class="app-modal-backdrop" aria-hidden="true" @click="closeClinicalNoteModal" />
          <div class="app-modal-scrim app-modal-scrim--sheet" @click.self="closeClinicalNoteModal">
            <div
              class="app-modal-panel app-modal-panel--sheet bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              role="dialog" aria-modal="true" @click.stop>
              <!-- Header -->
              <div class="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 rounded-t-2xl">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h2 class="text-xl font-bold text-white">Crear Nota Clínica</h2>
                      <p class="text-white/80 text-sm">Documenta información relevante del paciente</p>
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
              <div class="p-6">
                <!-- Patient & Screening Info -->
                <div class="bg-gray-50 rounded-xl p-4 mb-6">
                  <div class="grid grid-cols-1 gap-3">
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide">Paciente</p>
                      <p class="text-base font-semibold text-gray-900">{{ currentClinicalNote.patientName }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide">Tamizaje</p>
                      <p class="text-base font-semibold text-gray-900">{{ currentClinicalNote.screeningTitle }}</p>
                    </div>
                  </div>
                </div>

                <!-- Form -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Título de la Nota <span class="text-red-500">*</span>
                    </label>
                    <input v-model="currentClinicalNote.title" type="text"
                      placeholder="Ej: Síntomas destacados, Recomendaciones, etc."
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      required />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Descripción <span class="text-red-500">*</span>
                    </label>
                    <textarea v-model="currentClinicalNote.description" rows="4"
                      placeholder="Escribe aquí los detalles clínicos, observaciones o recomendaciones..."
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                      required></textarea>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                <button @click="closeClinicalNoteModal"
                  class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-all">
                  Cancelar
                </button>
                <button @click="saveClinicalNote" :disabled="isSavingNote"
                  class="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg v-if="isSavingNote" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ isSavingNote ? 'Guardando...' : 'Guardar Nota' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    <!-- Modal de confirmación para eliminar nota clínica -->
    <Teleport to="body">
      <Transition name="app-modal">
        <div v-if="showDeleteNoteModal && notePendingDelete" class="app-modal-root" style="z-index: 70">
          <div class="app-modal-backdrop" aria-hidden="true" @click="closeDeleteNoteModal" />
          <div class="app-modal-scrim app-modal-scrim--sheet" @click.self="closeDeleteNoteModal">
            <div
              class="app-modal-panel app-modal-panel--sheet bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              role="dialog" aria-modal="true" aria-labelledby="delete-note-title" @click.stop>
              <div class="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 id="delete-note-title" class="text-xl font-bold text-white">
                      Vas a borrar documentación clínica
                    </h2>
                    <p class="text-white/85 text-sm">
                      Lo que elimines aquí no podrá reconstruirse
                    </p>
                  </div>
                </div>
              </div>

              <div class="p-6 space-y-5">
                <p class="text-gray-800 leading-relaxed">
                  Estás a punto de eliminar la nota
                  <strong>"{{ notePendingDelete.titleNote }}"</strong>
                  de <strong>{{ getPatientName(notePendingDelete.idPatient) }}</strong>,
                  vinculada al tamizaje
                  <strong>"{{ getScreeningTitle(notePendingDelete.idScreening) }}"</strong>.
                </p>

                <div class="rounded-xl border border-red-100 bg-red-50/70 p-4 space-y-2 text-sm text-red-900">
                  <p class="font-medium">Al confirmar, desaparecerá de forma permanente:</p>
                  <ul class="list-disc pl-5 space-y-1">
                    <li>
                      El criterio clínico registrado el
                      {{ formatNoteDate(notePendingDelete.createdAt) }}
                    </li>
                    <li>La trazabilidad de tu observación profesional sobre este paciente</li>
                    <li>Cualquier referencia futura que dependa de esta nota en el seguimiento</li>
                  </ul>
                </div>

                <p class="text-sm text-gray-600 italic">
                  Las notas clínicas existen para proteger al paciente y a tu criterio médico.
                  Conservarlas no ocupa espacio; perderlas sí puede costarte contexto valioso.
                </p>

                <div>
                  <label for="delete-note-confirm-input" class="block text-sm font-medium text-gray-700 mb-1.5">
                    Para confirmar que entiendes las consecuencias, escribe
                    <span class="font-mono text-red-700">ELIMINAR</span>
                  </label>
                  <input id="delete-note-confirm-input" v-model="deleteNoteConfirmText" type="text" autocomplete="off"
                    placeholder="Escribe ELIMINAR"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none font-mono uppercase tracking-wide" />
                </div>
              </div>

              <div class="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button @click="confirmDeleteClinicalNote" :disabled="!canConfirmNoteDeletion || isDeletingNote"
                  class="px-4 py-2.5 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  <svg v-if="isDeletingNote" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {{ isDeletingNote ? 'Eliminando...' : 'Sí, eliminar esta nota' }}
                </button>
                <button @click="closeDeleteNoteModal"
                  class="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-sm">
                  Conservar esta nota
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal de Ver Notas Clínicas del Paciente -->
    <Teleport to="body">
      <Transition name="app-modal">
        <div v-if="showViewNotesModal && currentViewingPatient" class="app-modal-root" style="z-index: 50">
          <div class="app-modal-backdrop" aria-hidden="true" @click="closeViewNotesModal" />
          <div class="app-modal-scrim app-modal-scrim--sheet" @click.self="closeViewNotesModal">
            <div
              class="app-modal-panel app-modal-panel--sheet bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              role="dialog" aria-modal="true" @click.stop>
              <!-- Header -->
              <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-2xl">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 class="text-xl font-bold text-white">Notas Clínicas del Paciente</h2>
                      <p class="text-white/80 text-sm">{{ currentViewingPatient.name }}</p>
                    </div>
                  </div>
                  <button @click="closeViewNotesModal" class="text-white/80 hover:text-white transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Body -->
              <div class="p-6">
                <!-- Loading State -->
                <div v-if="isLoadingNotes" class="flex flex-col items-center justify-center py-12">
                  <svg class="w-10 h-10 text-blue-600 animate-spin mb-4" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <p class="text-gray-600">Cargando notas clínicas...</p>
                </div>

                <!-- Empty State -->
                <div v-else-if="patientNotes.length === 0"
                  class="flex flex-col items-center justify-center py-12 text-center">
                  <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 class="text-lg font-semibold text-gray-800 mb-2">No hay notas clínicas</h4>
                  <p class="text-gray-600">Este paciente no tiene notas clínicas registradas.</p>
                </div>

                <!-- Notes List -->
                <div v-else class="space-y-4">
                  <div class="flex items-center justify-between mb-4">
                    <p class="text-sm text-gray-600">
                      Total de notas: <span class="font-semibold text-gray-900">{{ patientNotes.length }}</span>
                    </p>
                  </div>

                  <div v-for="note in patientNotes" :key="note.id"
                    class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex items-center gap-2">
                        <span class="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium uppercase">
                          Nota Clínica
                        </span>
                        <span class="text-xs text-gray-500">
                          {{ formatNoteDate(note.createdAt) }}
                        </span>
                      </div>
                      <!-- Botones Editar y Eliminar -->
                      <div class="flex items-center gap-2">
                        <button @click="openEditNoteModal(note)" :disabled="isDeletingNote"
                          class="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-600 rounded-lg transition-all disabled:opacity-50"
                          title="Editar Nota">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button @click="openDeleteNoteModal(note)" :disabled="isDeletingNote"
                          class="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all disabled:opacity-50"
                          title="Eliminar Nota">
                          <svg v-if="isDeletingNote" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <h3 class="font-semibold text-gray-900 mb-2">{{ note.titleNote }}</h3>
                    <p class="text-gray-700 text-sm leading-relaxed">{{ note.descriptionNote }}</p>

                    <div class="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
                      <div class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Paciente: {{ getPatientName(note.idPatient) }}</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>Tamizaje: {{ getScreeningTitle(note.idScreening) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end">
                <button @click="closeViewNotesModal"
                  class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-all">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    <!-- Modal de Editar Nota Clínica -->
    <Teleport to="body">
      <Transition name="app-modal">
        <div v-if="showEditNoteModal && currentEditingNote" class="app-modal-root" style="z-index: 50">
          <div class="app-modal-backdrop" aria-hidden="true" @click="closeEditNoteModal" />
          <div class="app-modal-scrim app-modal-scrim--sheet" @click.self="closeEditNoteModal">
            <div
              class="app-modal-panel app-modal-panel--sheet bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              role="dialog" aria-modal="true" @click.stop>
              <!-- Header -->
              <div class="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 rounded-t-2xl">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h2 class="text-xl font-bold text-white">Editar Nota Clínica</h2>
                      <p class="text-white/80 text-sm">Modifica la información de la nota</p>
                    </div>
                  </div>
                  <button @click="closeEditNoteModal" class="text-white/80 hover:text-white transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Body -->
              <div class="p-6">
                <!-- Form -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Título de la Nota <span class="text-red-500">*</span>
                    </label>
                    <input v-model="currentEditingNote.titleNote" type="text"
                      placeholder="Ej: Síntomas destacados, Recomendaciones, etc."
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                      required />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Descripción <span class="text-red-500">*</span>
                    </label>
                    <textarea v-model="currentEditingNote.descriptionNote" rows="4"
                      placeholder="Escribe aquí los detalles clínicos, observaciones o recomendaciones..."
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none"
                      required></textarea>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                <button @click="closeEditNoteModal"
                  class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-all">
                  Cancelar
                </button>
                <button @click="updateClinicalNote" :disabled="isUpdatingNote"
                  class="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg v-if="isUpdatingNote" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ isUpdatingNote ? 'Actualizando...' : 'Actualizar Nota' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.sr-page {
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
}

.sr-card {
  contain: layout style;
}

.sr-stat-pill {
  min-width: 5.5rem;
}

@media (prefers-reduced-motion: reduce) {

  .sr-card,
  .sr-panel {
    transition: none;
  }
}
</style>
