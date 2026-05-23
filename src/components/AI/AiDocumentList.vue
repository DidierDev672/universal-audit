<template>
  <div
    class="ai-document-list-page relative z-10 min-h-[calc(100dvh-8rem)] px-4 sm:px-6 py-6 sm:py-8 bg-slate-50"
  >
    <div class="max-w-7xl mx-auto">
      <header
        class="mb-6 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6"
      >
        <div class="space-y-2 min-w-0">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0"
            >
              <svg
                class="w-5 h-5 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h1 class="text-3xl font-bold tracking-tight text-slate-900">
              Documentos almacenados
            </h1>
          </div>
          <p class="text-sm leading-6 text-slate-500 max-w-2xl">
            Busca pacientes por nombre o documento, filtra por tipo y abre cada
            carpeta para ver sus archivos y lanzar el análisis con IA.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 shrink-0 lg:pt-1">
          <RouterLink
            to="/ai-document-uploader"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
          >
            <svg
              class="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Subir nuevo
          </RouterLink>
          <button
            type="button"
            :disabled="cargando"
            class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 disabled:opacity-50"
            @click="cargar"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {{ cargando ? "Cargando..." : "Actualizar" }}
          </button>
        </div>
      </header>

      <div class="mb-6 space-y-4">
        <label class="block">
          <span class="sr-only">Buscar paciente con documentos</span>
          <div class="relative">
            <svg
              class="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              v-model="busquedaPaciente"
              type="search"
              autocomplete="off"
              placeholder="Buscar paciente por nombre, documento o archivo…"
              class="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
            <button
              v-if="busquedaPaciente.trim()"
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label="Limpiar búsqueda"
              @click="busquedaPaciente = ''"
            >
              <svg
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </label>

        <div
          class="flex flex-wrap items-center gap-2"
          role="tablist"
          aria-label="Filtrar por tipo de archivo"
        >
        <button
          v-for="opt in filtrosTipo"
          :key="opt.value"
          type="button"
          role="tab"
          :aria-selected="filtroTipo === opt.value"
          class="rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200"
          :class="
            filtroTipo === opt.value
              ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
          "
          @click="filtroTipo = opt.value"
        >
          {{ opt.label }}
        </button>
        </div>
      </div>

      <div
        v-if="cargando && documentos.length === 0"
        class="rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm"
      >
        <p class="text-sm text-slate-500">Cargando documentos...</p>
      </div>

      <div
        v-else-if="error"
        class="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-700"
      >
        {{ error }}
      </div>

      <div
        v-else-if="gruposPorPaciente.length === 0"
        class="rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center shadow-sm"
      >
        <p class="text-sm font-medium text-slate-700">
          No hay pacientes con documentos en este filtro.
        </p>
        <RouterLink
          to="/ai-document-uploader"
          class="mt-3 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition-colors hover:text-emerald-800"
        >
          Subir el primero
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </RouterLink>
      </div>

      <div
        v-else-if="gruposPacienteVisibles.length === 0"
        class="rounded-2xl border border-dashed border-amber-200 bg-amber-50/40 py-16 text-center shadow-sm"
      >
        <p class="text-sm font-medium text-slate-700">
          Ningún paciente coincide con «{{ busquedaPaciente.trim() }}».
        </p>
        <button
          type="button"
          class="mt-3 text-sm font-medium text-amber-800 underline-offset-2 hover:underline"
          @click="busquedaPaciente = ''"
        >
          Limpiar búsqueda
        </button>
      </div>

      <div v-else class="space-y-6">
        <div
          class="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5"
          role="list"
          aria-label="Carpetas de pacientes"
        >
          <article
            v-for="grupo in gruposPacienteVisibles"
            :key="grupo.key"
            role="listitem"
            class="flex flex-col"
          >
            <button
              type="button"
              class="group flex flex-col items-center rounded-2xl border border-transparent p-3 text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
              :class="
                pacienteExpandidoKey === grupo.key
                  ? 'border-amber-300 bg-amber-50/80 shadow-md'
                  : 'hover:border-amber-200/80 hover:bg-white hover:shadow-sm'
              "
              :aria-expanded="pacienteExpandidoKey === grupo.key"
              :aria-label="`${grupo.nombre}, ${etiquetaConteoDocumentos(grupo.documentos.length)}`"
              @click="alternarPaciente(grupo.key)"
            >
              <div
                class="office-folder-scene mb-3"
                :aria-hidden="true"
              >
                <div
                  v-for="capa in capasCarpetaDocumento(grupo.documentos.length)"
                  :key="`doc-${grupo.key}-${capa}`"
                  class="office-folder office-folder--doc"
                  :class="`office-folder--doc-${capa}`"
                  :style="{ zIndex: capa }"
                />
                <div
                  class="office-folder office-folder--patient"
                  :class="{
                    'office-folder--patient-open':
                      pacienteExpandidoKey === grupo.key,
                  }"
                >
                  <span class="office-folder__tab" />
                  <span
                    class="office-folder__badge"
                    :title="etiquetaConteoDocumentos(grupo.documentos.length)"
                  >
                    {{ grupo.documentos.length }}
                  </span>
                </div>
              </div>

              <h2
                class="line-clamp-2 w-full text-sm font-semibold leading-snug text-slate-900 group-hover:text-amber-950"
                :title="grupo.nombre"
              >
                {{ grupo.nombre }}
              </h2>
              <p
                v-if="grupo.documentNumber && !grupo.sinPaciente"
                class="mt-1 line-clamp-1 w-full text-[11px] text-slate-500"
              >
                {{ grupo.documentType }} {{ grupo.documentNumber }}
              </p>
              <p
                v-else-if="grupo.sinPaciente"
                class="mt-1 text-[11px] text-slate-500"
              >
                Sin paciente asignado
              </p>

              <p
                class="mt-2 text-[11px] font-medium text-amber-800/90"
                :title="etiquetaConteoDocumentos(grupo.documentos.length)"
              >
                {{
                  grupo.documentos.length === 1
                    ? "1 documento"
                    : `${grupo.documentos.length} documentos`
                }}
              </p>
              <span
                v-if="grupo.documentos.length > 1"
                class="mt-1.5 inline-flex items-center gap-1 rounded-md border border-amber-300/60 bg-amber-100/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-900"
              >
                Varios archivos
              </span>
            </button>
          </article>
        </div>

        <section
          v-if="grupoPacienteExpandido"
          class="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white shadow-md"
          aria-label="Contenido de la carpeta abierta"
        >
          <header
            class="flex flex-col gap-2 border-b border-amber-200/80 bg-amber-100/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex min-w-0 items-center gap-3">
              <div
                class="office-folder office-folder--patient office-folder--patient-mini shrink-0"
                aria-hidden="true"
              >
                <span class="office-folder__tab" />
              </div>
              <div class="min-w-0">
                <h2 class="truncate text-base font-semibold text-slate-900">
                  {{ grupoPacienteExpandido.nombre }}
                </h2>
                <p class="text-xs text-slate-600">
                  {{ resumenGrupoPaciente(grupoPacienteExpandido) }}
                </p>
              </div>
            </div>
            <button
              type="button"
              class="shrink-0 self-start rounded-lg border border-amber-300/70 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 transition-colors hover:bg-amber-50 sm:self-center"
              @click="pacienteExpandidoKey = null"
            >
              Cerrar carpeta
            </button>
          </header>

          <ul class="divide-y divide-amber-100/80">
            <li
              v-for="doc in grupoPacienteExpandido.documentos"
              :key="doc.id"
              class="flex flex-col gap-4 bg-white/90 p-5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div class="flex min-w-0 flex-1 gap-3">
                <div
                  class="office-paper shrink-0"
                  :class="clasePapelDocumento(doc.file_type)"
                  aria-hidden="true"
                >
                  <span class="office-paper__corner" />
                  <span class="office-paper__label">{{
                    etiquetaTipoArchivo(doc.file_type).slice(0, 3)
                  }}</span>
                </div>
                <div class="min-w-0 space-y-2">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3
                      class="line-clamp-1 text-sm font-semibold text-slate-900"
                      :title="tituloPrincipal(doc)"
                    >
                      {{ tituloPrincipal(doc) }}
                    </h3>
                    <span
                      class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase"
                      :class="claseTipoArchivo(doc.file_type)"
                    >
                      {{ etiquetaTipoArchivo(doc.file_type) }}
                    </span>
                    <span
                      class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                      :class="claseEstado(doc.status)"
                    >
                      {{ etiquetaEstado(doc.status) }}
                    </span>
                  </div>
                  <p
                    class="line-clamp-1 text-xs text-slate-500"
                    :title="subtituloDocumento(doc)"
                  >
                    {{ subtituloDocumento(doc) }}
                  </p>
                  <p class="text-sm leading-6 text-slate-600">
                    {{ resumenAnalisis(doc) }}
                  </p>
                  <div
                    class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500"
                  >
                    <span>{{ formatearTamano(doc.file_size_bytes) }}</span>
                    <span>{{ formatearFecha(doc.created_at) }}</span>
                  </div>
                </div>
              </div>

              <div class="flex shrink-0 flex-wrap items-center gap-2">
                <button
                  type="button"
                  :disabled="descargandoId === doc.id || analizandoId === doc.id"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                  @click="abrirDocumento(doc)"
                >
                  {{ descargandoId === doc.id ? "Abriendo…" : "Abrir" }}
                </button>
                <button
                  type="button"
                  :disabled="analizandoId === doc.id || descargandoId === doc.id"
                  class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-50"
                  @click="analizarConIA(doc)"
                >
                  {{
                    analizandoId === doc.id ? "Analizando…" : "Analizar con IA"
                  }}
                </button>
              </div>
            </li>
          </ul>
        </section>
      </div>

      <p
        v-if="gruposPorPaciente.length > 0"
        class="mt-6 text-center text-xs text-slate-500"
      >
        <template v-if="busquedaPaciente.trim()">
          {{ gruposPacienteVisibles.length }} de
          {{ gruposPorPaciente.length }}
          {{ gruposPorPaciente.length === 1 ? "paciente" : "pacientes" }}
          encontrados ·
        </template>
        <template v-else>
          {{ gruposPorPaciente.length }}
          {{ gruposPorPaciente.length === 1 ? "paciente" : "pacientes" }} ·
        </template>
        {{ documentosFiltrados.length }} de
        {{ documentos.length }} documento(s)
      </p>
    </div>

    <Teleport to="body">
      <Transition name="app-modal">
        <div
          v-if="modalAnalisisAbierto"
          class="app-modal-root"
        >
          <div
            class="app-modal-backdrop"
            aria-hidden="true"
            @click="cerrarModalAnalisis"
          />
          <div
            class="app-modal-scrim app-modal-scrim--sheet"
            :class="modalAnalisisExpandido ? 'p-2 sm:p-3' : ''"
            @click.self="cerrarModalAnalisis"
          >
            <div
              class="app-modal-panel app-modal-panel--sheet flex w-full flex-col rounded-2xl border border-slate-200 bg-white shadow-xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-analisis-ia-titulo"
              :class="
                modalAnalisisExpandido
                  ? 'h-[calc(100vh-1rem)] max-h-none max-w-none sm:h-[calc(100vh-1.5rem)]'
                  : 'max-h-[85vh] max-w-3xl'
              "
              @click.stop
            >
              <header
                class="app-modal-header flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-5 py-4"
              >
            <div class="min-w-0">
              <p
                id="modal-analisis-ia-titulo"
                class="text-[13px] font-medium text-slate-500 tracking-[-0.01em]"
              >
                Análisis con IA
              </p>
              <h2
                class="mt-0.5 truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
              >
                {{
                  documentoAnalizado
                    ? tituloPrincipal(documentoAnalizado)
                    : "Documento"
                }}
              </h2>
              <p
                v-if="documentoAnalizado?.patient_name"
                class="mt-1 truncate text-[13px] text-slate-500"
              >
                Paciente: {{ documentoAnalizado.patient_name }}
              </p>
            </div>
            <div class="flex shrink-0 items-center gap-1">
              <button
                type="button"
                class="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-800"
                :aria-label="
                  modalAnalisisExpandido ? 'Contraer modal' : 'Expandir modal'
                "
                :title="modalAnalisisExpandido ? 'Contraer' : 'Expandir'"
                @click="toggleModalAnalisisExpandido"
              >
                <svg
                  v-if="!modalAnalisisExpandido"
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
                <svg
                  v-else
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
                  />
                </svg>
              </button>
              <button
                type="button"
                class="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-800"
                aria-label="Cerrar"
                @click="cerrarModalAnalisis"
              >
                ✕
              </button>
            </div>
          </header>
              <div
                class="app-modal-body ai-clinical-scroll ai-analysis-markdown ai-clinical-typography max-w-none flex-1 min-h-0 overflow-y-auto px-5 py-6"
                v-html="analisisHtml"
              />
              <footer
                class="app-modal-footer flex flex-col gap-2 border-t border-black/6 px-5 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
            <p
              v-if="mensajeGuardadoModal"
              class="text-[13px] leading-8"
              :class="errorGuardadoModal ? 'text-red-600' : 'text-[#0d9e6e]'"
            >
              {{ mensajeGuardadoModal }}
            </p>
            <div class="flex items-center justify-end gap-2 ml-auto">
              <button
                type="button"
                class="app-modal-btn rounded-[9px] border border-black/10 px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-[#fafafa]"
                @click="cerrarModalAnalisis"
              >
                Cerrar
              </button>
              <button
                type="button"
                :disabled="!puedeGuardarAnalisis"
                class="app-modal-btn rounded-[9px] bg-[#0d9e6e] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#0a8a5f] disabled:cursor-not-allowed disabled:opacity-50"
                @click="guardarAnalisisModal"
              >
                {{
                  guardandoAnalisis
                    ? "Guardando…"
                    : analisisGuardado
                      ? "Guardar de nuevo"
                      : "Guardar"
                }}
              </button>
            </div>
              </footer>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import axios from "axios";
import MarkdownIt from "markdown-it";
import { useAuthStore } from "@/core/login/presentation/store/authStore";
import { useGetGenerativeModelGP } from "@/shared/service/useGetGenerativeModelGP";
import { contentExtractor } from "@/services/contentExtractor";
import {
  downloadDocumentFile,
  GEMINI_MODEL_NAME,
  getDocumentDownloadUrl,
  listAiDocuments,
  saveFailedAiAnalysis,
} from "@/services/aiDocumentsService";
import type { AiDocumentUploadWithAnalysis } from "@/services/aiDocumentsService";
import { renderClinicalMarkdown } from "./clinicalMarkdownCards";

const AI_DOCUMENT_ANALYSES_API =
  "http://localhost:3000/api/v1/ai-document-analyses";

/** Cuerpo esperado por POST /api/v1/ai-document-analyses */
interface AiDocumentAnalysisSavePayload {
  document_upload_id: string;
  content: string;
  model: string;
  analysis_id?: string | null;
  original_filename?: string;
}

interface AiDocumentAnalysisSaveResponse {
  id?: string;
  document_upload_id?: string;
  status?: string;
}

const authStore = useAuthStore();

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
});

type FiltroTipo = "todos" | "pdf" | "word";

interface GrupoPacienteDocumentos {
  key: string;
  patientId: string | null;
  nombre: string;
  documentType: string | null;
  documentNumber: string | null;
  sinPaciente: boolean;
  documentos: AiDocumentUploadWithAnalysis[];
}

function obtenerTokenAuth(): string | null {
  return authStore.authToken ?? localStorage.getItem("auth_token");
}

function headersConAuth(): Record<string, string> {
  const token = obtenerTokenAuth();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

const documentos = ref<AiDocumentUploadWithAnalysis[]>([]);
const cargando = ref(false);
const error = ref<string | null>(null);
const descargandoId = ref<string | null>(null);
const analizandoId = ref<string | null>(null);
const filtroTipo = ref<FiltroTipo>("todos");
const busquedaPaciente = ref("");
const pacienteExpandidoKey = ref<string | null>(null);
const modalAnalisisAbierto = ref(false);
const modalAnalisisExpandido = ref(false);
const textoAnalisisModal = ref("");
const documentoAnalizado = ref<AiDocumentUploadWithAnalysis | null>(null);
const analisisIdEnModal = ref<string | null>(null);
const analisisGuardado = ref(false);
const guardandoAnalisis = ref(false);
const mensajeGuardadoModal = ref("");
const errorGuardadoModal = ref(false);

const MAX_TEXTO_DOCUMENTO = 28_000;

const filtrosTipo = [
  { value: "todos" as const, label: "Todos" },
  { value: "pdf" as const, label: "PDF" },
  { value: "word" as const, label: "Word" },
];

const documentosFiltrados = computed(() => {
  if (filtroTipo.value === "todos") return documentos.value;
  return documentos.value.filter((d) => d.file_type === filtroTipo.value);
});

function clavePaciente(doc: AiDocumentUploadWithAnalysis): string {
  if (doc.patient_id) return `id:${doc.patient_id}`;
  const nombre = doc.patient_name?.trim() ?? "";
  const numero = doc.patient_document_number?.trim() ?? "";
  const tipo = doc.patient_document_type?.trim() ?? "";
  if (nombre || numero) {
    return `perfil:${nombre.toLowerCase()}|${tipo}|${numero}`;
  }
  return "sin-paciente";
}

function crearGrupoDesdeDocumento(
  doc: AiDocumentUploadWithAnalysis,
  key: string,
): GrupoPacienteDocumentos {
  const sinPaciente = !doc.patient_id && !doc.patient_name?.trim();
  return {
    key,
    patientId: doc.patient_id ?? null,
    nombre: sinPaciente ? "Sin paciente asignado" : (doc.patient_name?.trim() ?? "Paciente"),
    documentType: doc.patient_document_type ?? null,
    documentNumber: doc.patient_document_number ?? null,
    sinPaciente,
    documentos: [],
  };
}

const gruposPorPaciente = computed(() => {
  const map = new Map<string, GrupoPacienteDocumentos>();

  for (const doc of documentosFiltrados.value) {
    const key = clavePaciente(doc);
    if (!map.has(key)) {
      map.set(key, crearGrupoDesdeDocumento(doc, key));
    }
    map.get(key)!.documentos.push(doc);
  }

  for (const grupo of map.values()) {
    grupo.documentos.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }

  return [...map.values()].sort((a, b) => {
    if (a.sinPaciente !== b.sinPaciente) return a.sinPaciente ? 1 : -1;
    return a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" });
  });
});

const gruposPacienteVisibles = computed(() => {
  const q = busquedaPaciente.value.trim().toLowerCase();
  if (!q) return gruposPorPaciente.value;

  return gruposPorPaciente.value.filter((grupo) => {
    if (grupo.nombre.toLowerCase().includes(q)) return true;
    if (grupo.documentNumber?.toLowerCase().includes(q)) return true;
    if (grupo.documentType?.toLowerCase().includes(q)) return true;
    return grupo.documentos.some((doc) => {
      const titulo = tituloPrincipal(doc).toLowerCase();
      const nombreArchivo = doc.original_filename?.toLowerCase() ?? "";
      return titulo.includes(q) || nombreArchivo.includes(q);
    });
  });
});

const grupoPacienteExpandido = computed(() =>
  gruposPacienteVisibles.value.find(
    (g) => g.key === pacienteExpandidoKey.value,
  ) ?? null,
);

function capasCarpetaDocumento(cantidad: number): number[] {
  const capas = Math.min(Math.max(cantidad, 1), 3);
  return Array.from({ length: capas }, (_, i) => i + 1);
}

function clasePapelDocumento(
  tipo: AiDocumentUploadWithAnalysis["file_type"],
): string {
  if (tipo === "pdf") return "office-paper--pdf";
  if (tipo === "word") return "office-paper--word";
  return "office-paper--default";
}

watch(filtroTipo, () => {
  pacienteExpandidoKey.value = null;
});

watch([gruposPacienteVisibles, busquedaPaciente], ([grupos]) => {
  if (
    pacienteExpandidoKey.value &&
    !grupos.some((g) => g.key === pacienteExpandidoKey.value)
  ) {
    pacienteExpandidoKey.value = null;
  }
});

function alternarPaciente(key: string) {
  pacienteExpandidoKey.value =
    pacienteExpandidoKey.value === key ? null : key;
}

function etiquetaConteoDocumentos(cantidad: number): string {
  return cantidad === 1
    ? "Este paciente tiene 1 documento almacenado"
    : `Este paciente tiene ${cantidad} documentos almacenados`;
}

function resumenGrupoPaciente(grupo: GrupoPacienteDocumentos): string {
  const tipos = new Set(
    grupo.documentos.map((d) => etiquetaTipoArchivo(d.file_type)),
  );
  const analizados = grupo.documentos.filter(
    (d) => (d.ai_document_analysis?.length ?? 0) > 0,
  ).length;
  const ultimo = grupo.documentos[0];
  const partes = [
    `Tipos: ${[...tipos].join(", ")}`,
    `${analizados} con análisis de IA`,
  ];
  if (ultimo) {
    partes.push(`Última carga: ${formatearFecha(ultimo.created_at)}`);
  }
  return partes.join(" · ");
}

const analisisHtml = computed(() =>
  renderClinicalMarkdown(md, textoAnalisisModal.value, ""),
);

const puedeGuardarAnalisis = computed(
  () =>
    !!textoAnalisisModal.value?.trim() &&
    !!documentoAnalizado.value &&
    !guardandoAnalisis.value &&
    analizandoId.value === null,
);

function formatearTamano(bytes: number | null): string {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleString("es", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function nombrePareceUuid(nombre: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(nombre.trim());
}

function tituloPrincipal(doc: AiDocumentUploadWithAnalysis): string {
  const archivo = doc.original_filename?.trim() ?? "";
  if (archivo && !nombrePareceUuid(archivo)) return archivo;
  if (doc.patient_name?.trim()) return doc.patient_name.trim();
  if (archivo) return archivo;
  return `Documento ${doc.id.slice(0, 8)}…`;
}

function subtituloDocumento(doc: AiDocumentUploadWithAnalysis): string {
  const archivo = doc.original_filename?.trim();
  if (archivo && nombrePareceUuid(archivo) && doc.patient_name) {
    return archivo;
  }
  return `ID ${doc.id.slice(0, 8)}…`;
}

function etiquetaTipoArchivo(fileType: string): string {
  if (fileType === "pdf") return "PDF";
  if (fileType === "word") return "Word";
  return fileType.toUpperCase();
}

function claseTipoArchivo(fileType: string): string {
  if (fileType === "pdf") return "bg-red-50 text-red-700";
  if (fileType === "word") return "bg-blue-50 text-blue-700";
  return "bg-slate-100 text-slate-600";
}

function etiquetaEstado(status: string): string {
  const map: Record<string, string> = {
    uploaded: "Subido",
    processing: "Procesando",
    analyzed: "Analizado",
    error: "Error",
    failed: "Error",
  };
  return map[status] ?? status;
}

function claseEstado(status: string): string {
  const map: Record<string, string> = {
    uploaded: "bg-slate-100 text-slate-700",
    processing: "bg-blue-50 text-blue-700",
    analyzed: "bg-emerald-50 text-emerald-700",
    error: "bg-red-50 text-red-700",
    failed: "bg-red-50 text-red-700",
  };
  return map[status] ?? "bg-slate-100 text-slate-600";
}

function etiquetaEstadoAnalisis(status: string | undefined): string {
  const map: Record<string, string> = {
    pending: "pendiente",
    processing: "en proceso",
    completed: "completado",
    failed: "fallido",
    analyzed: "analizado",
  };
  return map[status ?? ""] ?? status ?? "—";
}

function resumenAnalisis(doc: AiDocumentUploadWithAnalysis): string {
  const n = doc.ai_document_analysis?.length ?? 0;
  if (n === 0) {
    return "Sin análisis de IA. Usa «Analizar con IA» para generar uno.";
  }
  const ultimo = doc.ai_document_analysis[0];
  const estado = etiquetaEstadoAnalisis(ultimo?.status);
  return `${n} análisis guardado${n === 1 ? "" : "s"} · último: ${estado}`;
}

async function cargar() {
  cargando.value = true;
  error.value = null;
  try {
    documentos.value = await listAiDocuments();
    documentos.value.forEach((doc) => {
      doc.ai_document_analysis.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    });
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Error al cargar documentos";
  } finally {
    cargando.value = false;
  }
}

async function abrirDocumento(doc: AiDocumentUploadWithAnalysis) {
  descargandoId.value = doc.id;
  try {
    const url = await getDocumentDownloadUrl(doc);
    window.open(url, "_blank", "noopener,noreferrer");
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "No se pudo abrir el archivo";
  } finally {
    descargandoId.value = null;
  }
}

function construirPromptAnalisis(
  doc: AiDocumentUploadWithAnalysis,
  contenido: string,
): string {
  const texto =
    contenido.length > MAX_TEXTO_DOCUMENTO
      ? `${contenido.slice(0, MAX_TEXTO_DOCUMENTO)}\n\n[… contenido truncado por límite de tokens …]`
      : contenido;

  return `Actúa como un especialista en documentación clínica y análisis de expedientes.

Analiza el siguiente documento (${doc.file_type.toUpperCase()}, archivo: "${doc.original_filename}").

**Contenido extraído del documento:**
---
${texto}
---

Proporciona un análisis profesional en español con esta estructura obligatoria en markdown:

# Título del análisis clínico

## 1. Resumen ejecutivo
(párrafos de texto clínico, 16px equivalente en lectura)

## 2. Datos clínicos o administrativos relevantes
Usa ### para cada subcategoría (ej. Identificación del paciente, Diagnósticos, Antecedentes).

## 3. Hallazgos principales y puntos de atención
### para cada hallazgo; párrafos para el detalle clínico.

## 4. Recomendaciones para el equipo clínico
### por cada recomendación.

## 5. Observaciones sobre la calidad del documento
### por cada observación.

Reglas de formato:
- Usa # solo para el título principal, ## para secciones numeradas, ### para subcategorías.
- El texto clínico va en párrafos normales, no todo en negrita.
- Reserva **negrita** solo para etiquetas cortas dentro de un párrafo (ej. **Nombre:** valor).
- Usa listas con viñetas cuando enumeres ítems.

Sé objetivo y preciso.`;
}

function toggleModalAnalisisExpandido() {
  modalAnalisisExpandido.value = !modalAnalisisExpandido.value;
}

function cerrarModalAnalisis() {
  modalAnalisisAbierto.value = false;
  modalAnalisisExpandido.value = false;
  textoAnalisisModal.value = "";
  documentoAnalizado.value = null;
  analisisIdEnModal.value = null;
  analisisGuardado.value = false;
  mensajeGuardadoModal.value = "";
  errorGuardadoModal.value = false;
}

function readAxiosErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const d = err.response?.data;
    if (d && typeof d === "object") {
      const body = d as {
        message?: string;
        error?: string;
        code?: string;
        details?: { field?: string };
      };
      if (body.code === "UNAUTHORIZED" || err.response?.status === 401) {
        return (
          body.message ||
          "Sesión no válida. Inicia sesión de nuevo e intenta guardar otra vez."
        );
      }
      if (body.code === "VALIDATION_ERROR") {
        const field = body.details?.field;
        const base = body.message || "Error de validación";
        return field ? `${base} (campo: ${field})` : base;
      }
      if (body.message) return String(body.message);
      if (body.error) return String(body.error);
    }
    return err.message;
  }
  return err instanceof Error ? err.message : "Error al guardar el análisis";
}

async function guardarAnalisisModal() {
  const doc = documentoAnalizado.value;
  const texto = textoAnalisisModal.value?.trim();
  if (!doc || !texto) return;

  guardandoAnalisis.value = true;
  mensajeGuardadoModal.value = "";
  errorGuardadoModal.value = false;

  const token = obtenerTokenAuth();
  if (!token) {
    const msg =
      "Debes iniciar sesión para guardar el análisis. Ve a /login e ingresa de nuevo.";
    errorGuardadoModal.value = true;
    mensajeGuardadoModal.value = msg;
    alert(msg);
    guardandoAnalisis.value = false;
    return;
  }

  const payload: AiDocumentAnalysisSavePayload = {
    document_upload_id: doc.id,
    content: texto,
    model: GEMINI_MODEL_NAME,
    original_filename: doc.original_filename,
  };
  if (analisisIdEnModal.value) {
    payload.analysis_id = analisisIdEnModal.value;
  }

  try {
    const { data } = await axios.post<AiDocumentAnalysisSaveResponse>(
      AI_DOCUMENT_ANALYSES_API,
      payload,
      { headers: headersConAuth() },
    );

    if (data?.id) {
      analisisIdEnModal.value = data.id;
    }
    analisisGuardado.value = true;
    mensajeGuardadoModal.value = "Análisis guardado correctamente.";
    alert("El análisis se guardó correctamente.");
    await cargar();
  } catch (err) {
    const msg =
      readAxiosErrorMessage(err) ||
      "No se pudo guardar el análisis. Intenta de nuevo.";
    errorGuardadoModal.value = true;
    mensajeGuardadoModal.value = msg;
    alert(`Error al guardar: ${msg}`);
  } finally {
    guardandoAnalisis.value = false;
  }
}

async function analizarConIA(doc: AiDocumentUploadWithAnalysis) {
  analizandoId.value = doc.id;
  error.value = null;

  try {
    const file = await downloadDocumentFile(doc);
    const contenido = await contentExtractor.extractContent(
      file,
      undefined,
      doc.original_filename,
    );

    if (!contenido.trim() || contenido.startsWith("Error al extraer")) {
      throw new Error(
        contenido.trim() ||
          "No se pudo extraer texto del documento para el análisis",
      );
    }

    const prompt = construirPromptAnalisis(doc, contenido);
    const respuesta = await useGetGenerativeModelGP(prompt);

    if (!respuesta?.trim()) {
      throw new Error("La IA no devolvió una respuesta válida");
    }

    documentoAnalizado.value = doc;
    textoAnalisisModal.value = respuesta;
    analisisIdEnModal.value = null;
    analisisGuardado.value = false;
    mensajeGuardadoModal.value =
      "Revisa el análisis y pulsa Guardar para persistirlo en Supabase.";
    errorGuardadoModal.value = false;
    modalAnalisisExpandido.value = false;
    modalAnalisisAbierto.value = true;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al analizar con IA";
    error.value = msg;
    await saveFailedAiAnalysis(doc.id, msg).catch(() => undefined);
    await cargar();
  } finally {
    analizandoId.value = null;
  }
}

onMounted(() => {
  cargar();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@import "./aiClinicalTypography.css";

.ai-clinical-typography :deep(.ai-clinical-cards) {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.ai-clinical-typography :deep(.ai-clinical-card) {
  background-color: #fff;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.ai-clinical-typography :deep(.ai-clinical-card > h2) {
  font-size: 22px;
  line-height: 1.4;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem !important;
  padding-bottom: 0.65rem;
  border-bottom: 1px solid #f1f5f9;
}

.ai-clinical-typography :deep(.ai-clinical-card > h1) {
  font-size: 28px;
  line-height: 1.35;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.ai-clinical-typography :deep(.ai-clinical-card-body) {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ai-clinical-typography :deep(h1) {
  font-size: 28px;
  line-height: 1.35;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
  margin: 0 0 0.85em;
  padding-bottom: 0.35em;
  border-bottom: 1px solid #e2e8f0;
}

.ai-clinical-typography :deep(h2) {
  font-size: 22px;
  line-height: 1.4;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: -0.01em;
  margin: 1.75em 0 0.55em;
}

.ai-clinical-typography :deep(h2:first-child) {
  margin-top: 0;
}

.ai-clinical-typography :deep(h3) {
  font-size: 18px;
  line-height: 1.45;
  font-weight: 600;
  color: #334155;
  letter-spacing: -0.01em;
  margin: 1.35em 0 0.45em;
}

.ai-clinical-typography :deep(h4) {
  font-size: 16px;
  line-height: 1.5;
  font-weight: 600;
  color: #334155;
  margin: 1em 0 0.35em;
}

.ai-clinical-typography :deep(p) {
  font-size: 16px;
  line-height: 1.9;
  letter-spacing: -0.01em;
  color: #475569;
  margin: 0;
}

.ai-clinical-typography :deep(ul),
.ai-clinical-typography :deep(ol) {
  font-size: 16px;
  line-height: 1.9;
  letter-spacing: -0.01em;
  color: #475569;
  margin: 0;
  padding-left: 1.35em;
}

.ai-clinical-typography :deep(li) {
  margin: 0.4em 0;
}

.ai-clinical-typography :deep(li > p) {
  margin: 0.2em 0;
}

.ai-clinical-typography :deep(p strong),
.ai-clinical-typography :deep(li strong) {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  letter-spacing: 0.01em;
}

.ai-clinical-typography :deep(h1 strong),
.ai-clinical-typography :deep(h2 strong),
.ai-clinical-typography :deep(h3 strong),
.ai-clinical-typography :deep(h4 strong) {
  font-size: inherit;
  color: inherit;
  letter-spacing: inherit;
}

.ai-clinical-typography :deep(hr) {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 1.5em 0;
}

.ai-clinical-typography :deep(code) {
  font-size: 0.9em;
  background: #f4f4f5;
  padding: 0.1em 0.35em;
  border-radius: 4px;
  color: #334155;
}

.ai-clinical-typography :deep(pre) {
  background: #1e293b;
  color: #f8fafc;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0.85em 0;
  font-size: 14px;
  line-height: 1.6;
}

.ai-clinical-typography :deep(pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
}

.ai-clinical-typography :deep(blockquote) {
  border-left: 3px solid #0d9e6e;
  padding-left: 0.85rem;
  margin: 0;
  font-size: 16px;
  line-height: 1.9;
  letter-spacing: -0.01em;
  color: #64748b;
  font-style: italic;
}

.ai-clinical-typography :deep(a) {
  color: #0d9e6e;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.ai-clinical-typography :deep(table) {
  width: 100%;
  font-size: 13px;
  line-height: 1.6;
  border-collapse: collapse;
  margin: 0.85em 0;
}

.ai-clinical-typography :deep(th) {
  font-weight: 600;
  color: #334155;
  text-align: left;
  padding: 0.5em 0.65em;
  border-bottom: 1px solid #e2e8f0;
}

.ai-clinical-typography :deep(td) {
  padding: 0.45em 0.65em;
  border-bottom: 1px solid #f1f5f9;
  color: #475569;
}

/* —— Carpetas de oficina (explorador) —— */
.office-folder-scene {
  position: relative;
  width: 5.5rem;
  height: 4.5rem;
  margin-inline: auto;
}

.office-folder {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  border-radius: 0 6px 8px 8px;
  box-shadow:
    0 1px 2px rgb(120 53 15 / 12%),
    0 4px 10px rgb(120 53 15 / 10%);
}

.office-folder__tab {
  position: absolute;
  top: -7px;
  left: 0;
  width: 52%;
  height: 9px;
  border-radius: 5px 5px 0 0;
  background: inherit;
  filter: brightness(1.04);
}

.office-folder--patient {
  z-index: 10;
  width: 5rem;
  height: 3.65rem;
  background: linear-gradient(165deg, #fde68a 0%, #f59e0b 55%, #d97706 100%);
  border: 1px solid rgb(180 83 9 / 35%);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.office-folder--patient-open {
  transform: translateX(-50%) translateY(-2px) scale(1.03);
  box-shadow:
    0 2px 4px rgb(120 53 15 / 18%),
    0 8px 16px rgb(120 53 15 / 14%);
}

.office-folder--patient-mini {
  position: relative;
  left: auto;
  bottom: auto;
  transform: none;
  width: 2.5rem;
  height: 1.85rem;
  border-radius: 0 4px 5px 5px;
}

.office-folder--patient-mini .office-folder__tab {
  top: -5px;
  height: 6px;
  border-radius: 3px 3px 0 0;
}

.office-folder--doc {
  width: 3.35rem;
  height: 2.55rem;
  background: linear-gradient(165deg, #fef3c7 0%, #fbbf24 70%, #f59e0b 100%);
  border: 1px solid rgb(217 119 6 / 30%);
}

.office-folder--doc-1 {
  transform: translateX(calc(-50% - 10px)) rotate(-6deg);
}

.office-folder--doc-2 {
  transform: translateX(calc(-50% + 8px)) rotate(5deg);
  background: linear-gradient(165deg, #fff7ed 0%, #fcd34d 65%, #f59e0b 100%);
}

.office-folder--doc-3 {
  transform: translateX(-50%) translateY(-4px);
  background: linear-gradient(165deg, #fffbeb 0%, #fde68a 60%, #fbbf24 100%);
}

.office-folder__badge {
  position: absolute;
  right: -6px;
  top: -6px;
  z-index: 20;
  display: flex;
  min-width: 1.35rem;
  height: 1.35rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 2px solid #fffbeb;
  background: #b45309;
  padding: 0 0.25rem;
  font-size: 10px;
  font-weight: 700;
  color: #fffbeb;
  box-shadow: 0 2px 6px rgb(120 53 15 / 25%);
}

.group:hover .office-folder--patient {
  transform: translateX(-50%) translateY(-3px);
}

.group:hover .office-folder--patient-open {
  transform: translateX(-50%) translateY(-4px) scale(1.03);
}

/* Hoja de documento dentro de carpeta abierta */
.office-paper {
  position: relative;
  width: 2.25rem;
  height: 2.85rem;
  border-radius: 2px 6px 2px 2px;
  border: 1px solid #e2e8f0;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  box-shadow:
    0 1px 2px rgb(15 23 42 / 6%),
    2px 3px 0 #e2e8f0;
}

.office-paper__corner {
  position: absolute;
  top: 0;
  right: 0;
  width: 0.65rem;
  height: 0.65rem;
  background: linear-gradient(135deg, #f1f5f9 50%, #e2e8f0 50%);
  border-bottom-left-radius: 2px;
}

.office-paper__label {
  position: absolute;
  bottom: 0.35rem;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #64748b;
}

.office-paper--pdf {
  border-color: #fecaca;
  box-shadow:
    0 1px 2px rgb(185 28 28 / 8%),
    2px 3px 0 #fecaca;
}

.office-paper--pdf .office-paper__label {
  color: #b91c1c;
}

.office-paper--word {
  border-color: #bfdbfe;
  box-shadow:
    0 1px 2px rgb(29 78 216 / 8%),
    2px 3px 0 #bfdbfe;
}

.office-paper--word .office-paper__label {
  color: #1d4ed8;
}
</style>
