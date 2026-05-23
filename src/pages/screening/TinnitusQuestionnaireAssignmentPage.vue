<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

enum QuestionnaireStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Discontinued = 'Discontinued'
}

const statusLabels: Record<QuestionnaireStatus, string> = {
  [QuestionnaireStatus.Active]: 'Activo',
  [QuestionnaireStatus.Inactive]: 'Inactivo',
  [QuestionnaireStatus.Discontinued]: 'Descontinuado'
};

interface Questionnaire {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: QuestionnaireStatus;
  createdAt?: string;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  documentNumber?: string;
  phone?: string;
}

// Estado
const questionnaires = ref<Questionnaire[]>([]);
const patients = ref<Patient[]>([]);
const selectedQuestionnaires = ref<Set<string>>(new Set());
const selectedPatients = ref<Set<string>>(new Set());
const isLoadingQuestionnaires = ref(false);
const isLoadingPatients = ref(false);
const isAssigning = ref(false);
const showPatientModal = ref(false);
const searchQuery = ref('');
const patientSearchQuery = ref('');
const statusFilter = ref<'all' | QuestionnaireStatus>('all');
const isUpdatingStatus = ref(false);
const statusMenuOpen = ref<string | null>(null);

// Computed
const filteredQuestionnaires = computed(() => {
  let result = questionnaires.value;

  if (statusFilter.value !== 'all') {
    result = result.filter(q => q.status === statusFilter.value);
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (q) =>
        q.title.toLowerCase().includes(query) ||
        (q.description && q.description.toLowerCase().includes(query))
    );
  }

  return result;
});

const activeCount = computed(() => questionnaires.value.filter(q => q.status === QuestionnaireStatus.Active).length);
const inactiveCount = computed(() => questionnaires.value.filter(q => q.status === QuestionnaireStatus.Inactive).length);
const discontinuedCount = computed(() => questionnaires.value.filter(q => q.status === QuestionnaireStatus.Discontinued).length);

const isQuestionnaireSelectable = (status: QuestionnaireStatus) => {
  return status === QuestionnaireStatus.Active;
};

const getStatusLabel = (status: QuestionnaireStatus) => statusLabels[status];

const filteredPatients = computed(() => {
  if (!patientSearchQuery.value.trim()) return patients.value;
  const query = patientSearchQuery.value.toLowerCase();
  return patients.value.filter(
    (p) =>
      p.firstName.toLowerCase().includes(query) ||
      p.lastName.toLowerCase().includes(query) ||
      (p.email && p.email.toLowerCase().includes(query)) ||
      (p.documentNumber && p.documentNumber.toLowerCase().includes(query))
  );
});

const hasSelectedQuestionnaires = computed(() => selectedQuestionnaires.value.size > 0);
const hasSelectedPatients = computed(() => selectedPatients.value.size > 0);

const selectedCountText = computed(() => {
  const count = selectedQuestionnaires.value.size;
  return count === 1 ? '1 cuestionario seleccionado' : `${count} cuestionarios seleccionados`;
});

// Cargar cuestionarios
const loadQuestionnaires = async () => {
  isLoadingQuestionnaires.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/v1/questionnaires', {
      timeout: 30000,
    });
    questionnaires.value = response.data || [];
  } catch (error) {
    console.error('❌ Error al cargar cuestionarios:', error);
    showAlert('Error al cargar los cuestionarios. Intente nuevamente.', 'error');
  } finally {
    isLoadingQuestionnaires.value = false;
  }
};

// Cargar pacientes
const loadPatients = async () => {
  isLoadingPatients.value = true;
  try {
    const response = await axios.get('http://localhost:3000/api/v1/patients', {
      timeout: 30000
    });
    const data = response.data;
    patients.value = Array.isArray(data) ? data : (data?.data || []);
    console.log(`✅ ${patients.value.length} pacientes cargados`);
  } catch (error) {
    console.error('❌ Error al cargar pacientes:', error);
    showAlert('Error al cargar los pacientes. Intente nuevamente.', 'error');
  } finally {
    isLoadingPatients.value = false;
  }
};

// Toggle selección de cuestionario
const toggleQuestionnaire = (id: string) => {
  if (selectedQuestionnaires.value.has(id)) {
    selectedQuestionnaires.value.delete(id);
  } else {
    selectedQuestionnaires.value.add(id);
  }
};

// Seleccionar/deseleccionar todos
const selectAllQuestionnaires = () => {
  if (selectedQuestionnaires.value.size === filteredQuestionnaires.value.length) {
    selectedQuestionnaires.value.clear();
  } else {
    filteredQuestionnaires.value.forEach((q) => selectedQuestionnaires.value.add(q.id));
  }
};

// Toggle selección de paciente
const togglePatient = (id: string) => {
  if (selectedPatients.value.has(id)) {
    selectedPatients.value.delete(id);
  } else {
    selectedPatients.value.add(id);
  }
};

// Abrir modal de pacientes
const openPatientModal = () => {
  if (!hasSelectedQuestionnaires.value) {
    showAlert('Por favor seleccione al menos un cuestionario', 'warning');
    return;
  }
  selectedPatients.value.clear();
  patientSearchQuery.value = '';
  showPatientModal.value = true;
  loadPatients();
};

// Cerrar modal de pacientes
const closePatientModal = () => {
  showPatientModal.value = false;
  selectedPatients.value.clear();
  patientSearchQuery.value = '';
};

// Asignar cuestionarios a pacientes
const assignQuestionnaires = async () => {
  if (!hasSelectedQuestionnaires.value || !hasSelectedPatients.value) {
    showAlert('Debe seleccionar cuestionarios y pacientes', 'warning');
    return;
  }

  isAssigning.value = true;

  try {
    const questionnaireIds = Array.from(selectedQuestionnaires.value);
    const patientIds = Array.from(selectedPatients.value);

    console.log('📤 Asignando cuestionarios:', { questionnaireIds, patientIds });

    // Asignar cada cuestionario a cada paciente
    const promises: Promise<any>[] = [];

    for (const patientId of patientIds) {
      for (const questionnaireId of questionnaireIds) {
        const assignmentData = {
          idPatient: patientId,
          idTinnitusQuestionnaires: questionnaireId
        };

        console.log('📤 Enviando asignación:', assignmentData);

        promises.push(
          axios.post(
            'http://localhost:3000/api/v1/tinnitus-assignments',
            assignmentData,
            { timeout: 30000 }
          )
        );
      }
    }

    await Promise.all(promises);

    console.log('✅ Cuestionarios asignados exitosamente');

    showAlert(
      `Cuestionarios asignados a ${patientIds.length} paciente(s) exitosamente`,
      'success'
    );

    closePatientModal();
    selectedQuestionnaires.value.clear();
  } catch (error: any) {
    console.error('❌ Error al asignar cuestionarios:', error);
    showAlert(
      error.response?.data?.message || 'Error al asignar los cuestionarios. Intente nuevamente.',
      'error'
    );
  } finally {
    isAssigning.value = false;
  }
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
  alertDiv.innerHTML = `
    <span class="font-medium">${message}</span>
  `;
  document.body.appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 4000);
};

const getPatientFullName = (patient: Patient) => {
  return `${patient?.fullName || ''}`;
};

const updateQuestionnaireStatus = async (questionnaireId: string, newStatus: QuestionnaireStatus) => {
  isUpdatingStatus.value = true;
  try {
    await axios.patch(
      `http://localhost:3000/api/v1/tinnitus-assignments/${questionnaireId}`,
      { status: newStatus },
      { timeout: 30000 }
    );

    const index = questionnaires.value.findIndex(q => q.id === questionnaireId);
    if (index !== -1) {
      questionnaires.value[index].status = newStatus;
    }

    showAlert(`Cuestionario marcado como "${statusLabels[newStatus]}"`, 'success');
    statusMenuOpen.value = null;
  } catch (error) {
    console.error('❌ Error al actualizar estado:', error);
    showAlert('Error al actualizar el estado del cuestionario.', 'error');
  } finally {
    isUpdatingStatus.value = false;
  }
};

const toggleStatusMenu = (questionnaireId: string) => {
  statusMenuOpen.value = statusMenuOpen.value === questionnaireId ? null : questionnaireId;
};

const closeStatusMenu = () => {
  statusMenuOpen.value = null;
};

const formatRelativeDate = (dateString?: string) => {
  if (!dateString) return 'Fecha desconocida';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semana(s)`;
  if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} mes(es)`;
  return `Hace ${Math.floor(diffDays / 365)} año(s)`;
};

const setStatusFilter = (status: 'all' | QuestionnaireStatus) => {
  statusFilter.value = status;
};

onMounted(() => {
  loadQuestionnaires();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 relative overflow-hidden">
    <!-- Background con iconos de salud auditiva - Sutiles y pequeños -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <!-- Nota Musical -->
      <svg class="absolute top-16 left-8 w-7 h-7 text-slate-200 opacity-40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>

      <!-- Corchetes -->
      <svg class="absolute top-24 right-16 w-7 h-7 text-emerald-200 opacity-35" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z" />
      </svg>

      <!-- Auriculares -->
      <svg class="absolute top-40 left-20 w-7 h-7 text-rose-300 opacity-40" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
      </svg>

      <!-- Parlantes -->
      <svg class="absolute top-32 right-32 w-7 h-7 text-slate-300 opacity-35" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
      </svg>

      <!-- Clave de sol -->
      <svg class="absolute bottom-40 left-12 w-7 h-7 text-amber-300 opacity-40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        <circle cx="12" cy="17" r="2" />
      </svg>

      <!-- Ecualizador -->
      <svg class="absolute top-48 right-24 w-7 h-7 text-sky-300 opacity-35" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
      </svg>

      <!-- Disco de vinilo -->
      <svg class="absolute bottom-32 right-20 w-7 h-7 text-rose-400 opacity-30" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="1" />
      </svg>

      <!-- Microfono -->
      <svg class="absolute top-20 left-1/3 w-7 h-7 text-emerald-300 opacity-35" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
      </svg>

      <!-- Pentagrama -->
      <svg class="absolute bottom-20 left-1/4 w-7 h-7 text-slate-400 opacity-30" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M2 4h20v2H2V4zm0 4h20v2H2V8zm0 4h20v2H2v-2zm0 4h20v2H2v-2z" />
      </svg>

      <!-- Pulso musical -->
      <svg class="absolute top-60 left-16 w-7 h-7 text-amber-400 opacity-35" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 12h2v4H3v-4zm4-3h2v15H7V9zm4-4h2v19h-2V5zm4 6h2v13h-2V11zm4-5h2v18h-2V6z" />
      </svg>

      <!-- Oido -->
      <svg class="absolute top-36 left-1/2 w-7 h-7 text-slate-200 opacity-40" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 2C9.24 2 7 4.24 7 7v7c0 2.76 2.24 5 5 5s5-2.24 5-5V7c0-2.76-2.24-5-5-5zm0 16c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3s3 1.34 3 3v8c0 1.66-1.34 3-3 3z" />
      </svg>

      <!-- Percepcion -->
      <svg class="absolute bottom-48 right-12 w-7 h-7 text-emerald-400 opacity-30" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
      </svg>

      <!-- Audicion Sana -->
      <svg class="absolute top-16 right-8 w-7 h-7 text-rose-200 opacity-35" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>

      <!-- Protecion -->
      <svg class="absolute bottom-16 left-8 w-7 h-7 text-amber-200 opacity-35" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
      </svg>

      <!-- Audiograma -->
      <svg class="absolute top-1/2 left-8 w-7 h-7 text-sky-400 opacity-30" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
      </svg>

      <!-- Alerta auditiva -->
      <svg class="absolute bottom-24 right-8 w-7 h-7 text-rose-300 opacity-35" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>

      <!-- Audifono -->
      <svg class="absolute top-44 left-1/3 w-7 h-7 text-emerald-200 opacity-35" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
      </svg>

      <!-- Volumen seguro -->
      <svg class="absolute bottom-36 left-1/3 w-7 h-7 text-slate-300 opacity-30" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
      </svg>

      <!-- Test Auditivo -->
      <svg class="absolute top-28 right-1/4 w-7 h-7 text-amber-300 opacity-35" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>

      <!-- Sin ruido -->
      <svg class="absolute bottom-12 right-1/3 w-7 h-7 text-sky-200 opacity-35" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
      </svg>

      <!-- Bienestar -->
      <svg class="absolute top-52 right-16 w-7 h-7 text-emerald-300 opacity-30" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>

      <!-- Frecuencia -->
      <svg class="absolute bottom-8 left-16 w-7 h-7 text-rose-400 opacity-30" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 13h2v8H3v-8zm4-6h2v14H7V7zm4-4h2v18h-2V3zm4 8h2v10h-2V11zm4-3h2v13h-2V8z" />
      </svg>
    </div>

    <!-- Header - Z Pattern: Start point (Logo + Title + Quick Actions) -->
    <header
      class="relative z-10 max-w-7xl mx-auto bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg rounded-3xl"
      role="banner">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center" aria-hidden="true">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold">Asignación de Cuestionarios</h1>
              <p class="text-teal-100 text-sm">Seleccione cuestionarios y asígnelos a pacientes</p>
            </div>
          </div>
          <div class="hidden sm:flex items-center gap-2 text-sm text-teal-100" aria-label="Estadísticas">
            <span class="bg-white/20 px-3 py-1 rounded-full">{{ activeCount }} activos</span>
            <span class="bg-white/10 px-3 py-1 rounded-full">{{ inactiveCount }} inactivos</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Z Pattern: First horizontal line - Filters -->
      <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4" aria-label="Filtros y búsqueda">
        <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <!-- Status Filters -->
          <div class="flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
            <button @click="setStatusFilter('all')" :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              statusFilter === 'all'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]" :aria-pressed="statusFilter === 'all'">
              Todos ({{ questionnaires.length }})
            </button>
            <button @click="setStatusFilter(QuestionnaireStatus.Active)" :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5',
              statusFilter === QuestionnaireStatus.Active
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]" :aria-pressed="statusFilter === QuestionnaireStatus.Active">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="4" />
              </svg>
              Activos ({{ activeCount }})
            </button>
            <button @click="setStatusFilter(QuestionnaireStatus.Inactive)" :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5',
              statusFilter === QuestionnaireStatus.Inactive
                ? 'bg-gray-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]" :aria-pressed="statusFilter === QuestionnaireStatus.Inactive">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="4" />
              </svg>
              Inactivos ({{ inactiveCount }})
            </button>
            <button @click="setStatusFilter(QuestionnaireStatus.Discontinued)" :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5',
              statusFilter === QuestionnaireStatus.Discontinued
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]" :aria-pressed="statusFilter === QuestionnaireStatus.Discontinued">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="4" />
              </svg>
              Descontinuados ({{ discontinuedCount }})
            </button>
          </div>

          <!-- Search -->
          <div class="relative w-full lg:w-80">
            <label for="search-questionnaires" class="sr-only">Buscar cuestionarios</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input id="search-questionnaires" v-model="searchQuery" type="text" placeholder="Buscar..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
          </div>
        </div>
      </section>

      <!-- Z Pattern: Second horizontal line - Sticky Action Bar -->
      <div class="sticky top-0 z-30 bg-gray-50 py-3 -mt-3">
        <div class="bg-white rounded-xl shadow-md border border-gray-200 px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <input type="checkbox" id="select-all"
              :checked="selectedQuestionnaires.size === filteredQuestionnaires.length && filteredQuestionnaires.length > 0"
              @change="selectAllQuestionnaires"
              class="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer" />
            <label for="select-all" class="text-sm font-medium text-gray-700 cursor-pointer">
              Seleccionar visible{{ filteredQuestionnaires.length > 0 ? `s (${filteredQuestionnaires.length})` : '' }}
            </label>
            <span v-if="hasSelectedQuestionnaires"
              class="text-sm text-teal-700 font-semibold bg-teal-50 px-3 py-1 rounded-full">
              {{ selectedCountText }}
            </span>
          </div>
          <button @click="openPatientModal" :disabled="!hasSelectedQuestionnaires"
            class="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            :aria-describedby="!hasSelectedQuestionnaires ? 'select-hint' : undefined">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Asignar a Pacientes
          </button>
        </div>
        <p v-if="!hasSelectedQuestionnaires" id="select-hint" class="sr-only">Seleccione al menos un cuestionario para
          habilitar la asignación</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingQuestionnaires" class="flex items-center justify-center py-16" role="status"
        aria-live="polite">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <span class="ml-4 text-gray-600 font-medium">Cargando cuestionarios...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="questionnaires.length === 0" class="text-center py-16" role="status">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">No hay cuestionarios disponibles</h3>
        <p class="text-gray-500 mt-2">No se encontraron cuestionarios de tinnitus en el sistema.</p>
      </div>

      <!-- No Results after Filter -->
      <div v-else-if="filteredQuestionnaires.length === 0" class="text-center py-16" role="status">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">Sin resultados</h3>
        <p class="text-gray-500 mt-2">No hay cuestionarios que coincidan con los filtros seleccionados.</p>
        <button @click="setStatusFilter('all')" class="mt-4 px-4 py-2 text-teal-600 hover:text-teal-700 font-medium">
          Ver todos los cuestionarios
        </button>
      </div>

      <!-- Questionnaire Items - Z Pattern: Content cards -->
      <div v-else class="space-y-3" role="list" aria-label="Lista de cuestionarios">
        <article v-for="questionnaire in filteredQuestionnaires" :key="questionnaire.id" role="listitem"
          class="bg-white rounded-xl border-2 p-4 transition-all cursor-pointer" :class="[
            selectedQuestionnaires.has(questionnaire.id)
              ? 'border-teal-500 bg-teal-50/50 shadow-md'
              : questionnaire.status === QuestionnaireStatus.Active
                ? 'border-gray-200 hover:border-teal-300 hover:shadow-md'
                : questionnaire.status === QuestionnaireStatus.Discontinued
                  ? 'border-red-200 opacity-60'
                  : 'border-gray-100 opacity-70 hover:opacity-90'
          ]" @click="isQuestionnaireSelectable(questionnaire.status) && toggleQuestionnaire(questionnaire.id)"
          @keydown.enter="isQuestionnaireSelectable(questionnaire.status) && toggleQuestionnaire(questionnaire.id)"
          tabindex="0" :aria-selected="selectedQuestionnaires.has(questionnaire.id)"
          :aria-disabled="!isQuestionnaireSelectable(questionnaire.status)">
          <div class="flex items-start gap-4">
            <input type="checkbox" :checked="selectedQuestionnaires.has(questionnaire.id)" @click.stop
              @change="toggleQuestionnaire(questionnaire.id)"
              class="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer mt-1"
              :aria-label="`Seleccionar ${questionnaire.title}`"
              :disabled="!isQuestionnaireSelectable(questionnaire.status)" />

            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-3">
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-semibold text-gray-900 truncate">{{ questionnaire.title }}</h3>
                  <p v-if="questionnaire.description" class="text-gray-600 mt-1 text-sm line-clamp-2">
                    {{ questionnaire.description }}
                  </p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium uppercase">
                    {{ questionnaire.type }}
                  </span>

                  <!-- Botón de cambio de estado -->
                  <div class="relative">
                    <button @click.stop="toggleStatusMenu(questionnaire.id)"
                      class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      :aria-label="`Cambiar estado de ${questionnaire.title}`" aria-haspopup="true"
                      :aria-expanded="statusMenuOpen === questionnaire.id">
                      <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>

                    <!-- Menú desplegable de estados -->
                    <div v-if="statusMenuOpen === questionnaire.id"
                      class="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20"
                      role="menu">
                      <button v-for="status in Object.values(QuestionnaireStatus)" :key="status"
                        @click.stop="updateQuestionnaireStatus(questionnaire.id, status)"
                        class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        :class="questionnaire.status === status ? 'bg-teal-50 text-teal-700' : 'text-gray-700'"
                        role="menuitem" :disabled="isUpdatingStatus">
                        <span class="w-2 h-2 rounded-full" :class="{
                          'bg-emerald-500': status === QuestionnaireStatus.Active,
                          'bg-gray-400': status === QuestionnaireStatus.Inactive,
                          'bg-red-500': status === QuestionnaireStatus.Discontinued
                        }"></span>
                        {{ statusLabels[status] }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                <div class="flex items-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ formatRelativeDate(questionnaire.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Z Pattern: Footer -->
      <footer class="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500" role="contentinfo">
        <p>Plataforma de Diagnóstico Anticipado - Universal Audit</p>
      </footer>
    </main>

    <!-- Modal de Selección de Pacientes -->
    <Teleport to="body">
      <Transition name="app-modal">
        <div v-if="showPatientModal" class="app-modal-root" style="z-index: 50">
          <div class="app-modal-backdrop" aria-hidden="true" @click="closePatientModal" />
          <div class="app-modal-scrim app-modal-scrim--sheet" @click.self="closePatientModal">
          <div class="app-modal-panel app-modal-panel--sheet bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden" role="dialog" aria-modal="true" @click.stop>
            <!-- Header -->
            <div class="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center" aria-hidden="true">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 id="modal-title" class="text-xl font-bold text-white">Seleccionar Pacientes</h2>
                    <p class="text-teal-100 text-sm">Seleccione los pacientes para asignar los cuestionarios</p>
                  </div>
                </div>
                <button @click="closePatientModal" class="text-white/80 hover:text-white transition-colors"
                  aria-label="Cerrar modal">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <!-- Search -->
              <div class="relative mb-4">
                <label for="patient-search" class="sr-only">Buscar pacientes</label>
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input id="patient-search" v-model="patientSearchQuery" type="text"
                  placeholder="Buscar pacientes por nombre, email o documento..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
              </div>

              <!-- Loading -->
              <div v-if="isLoadingPatients" class="flex items-center justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <span class="ml-3 text-gray-600">Cargando pacientes...</span>
              </div>

              <!-- Empty -->
              <div v-else-if="patients.length === 0" class="text-center py-8">
                <p class="text-gray-500">No hay pacientes disponibles</p>
              </div>

              <!-- Patients List -->
              <div v-else class="space-y-2" role="list" aria-label="Lista de pacientes">
                <div v-for="patient in filteredPatients" :key="patient.id" role="listitem"
                  class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
                  @click="togglePatient(patient.id)" @keydown.enter="togglePatient(patient.id)" tabindex="0">
                  <input type="checkbox" :checked="selectedPatients.has(patient.id)" @click.stop
                    @change="togglePatient(patient.id)"
                    class="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
                    :aria-label="`Seleccionar ${getPatientFullName(patient)}`" />

                  <div class="flex-1">
                    <p class="font-medium text-gray-900">{{ getPatientFullName(patient) }}</p>
                    <div class="flex items-center gap-3 text-sm text-gray-500">
                      <span v-if="patient.email" class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {{ patient.email }}
                      </span>
                      <span v-if="patient.documentNumber" class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3 3 0 00-3 3m3-3a3 3 0 013 3m-3 0h3" />
                        </svg>
                        {{ patient.documentNumber }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Selected Count -->
              <div v-if="hasSelectedPatients" class="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
                <p class="text-sm text-teal-800 font-medium">
                  {{ selectedPatients.size }} paciente(s) seleccionado(s)
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button @click="closePatientModal"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-all">
                Cancelar
              </button>
              <button @click="assignQuestionnaires" :disabled="!hasSelectedPatients || isAssigning"
                class="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-medium hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="isAssigning" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ isAssigning ? 'Asignando...' : 'Asignar Cuestionarios' }}
              </button>
            </div>
          </div>
        </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

