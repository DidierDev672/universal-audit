<template>
  <div
    class="max-w-5xl mx-auto bg-white rounded-2xl border border-black/[0.07] shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden"
  >
    <div
      class="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0d9e6e] to-[#0ea5e9]"
    />

    <div class="px-6 pt-7 pb-6">
      <header
        class="mb-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
      >
        <div>
          <div class="flex items-center gap-2.5 mb-1.5">
            <div
              class="w-8 h-8 bg-[#f0faf6] border border-[#0d9e6e]/[0.12] rounded-[9px] flex items-center justify-center shrink-0"
            >
              <svg
                class="w-[15px] h-[15px] text-[#0d9e6e]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h2 class="text-[14px] font-semibold text-[#1d1d1f] tracking-tight">
              Documentos almacenados
            </h2>
          </div>
          <p
            class="text-[11.5px] text-[#86868b] leading-relaxed tracking-tight"
          >
            Todos los PDF y Word guardados en Supabase Storage.
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <RouterLink
            to="/ai-document-uploader"
            class="py-2 px-3 text-[12px] font-medium text-[#0d9e6e] border border-[#0d9e6e]/25 rounded-[9px] hover:bg-[#f0faf6] transition-colors"
          >
            Subir nuevo
          </RouterLink>
          <button
            type="button"
            :disabled="cargando"
            class="py-2 px-3 text-[12px] font-medium text-white bg-[#0d9e6e] rounded-[9px] hover:bg-[#0a8a5f] disabled:opacity-50 transition-colors"
            @click="cargar"
          >
            {{ cargando ? "Cargando..." : "Actualizar" }}
          </button>
        </div>
      </header>

      <div class="flex flex-wrap gap-2 mb-4">
        <button
          v-for="opt in filtrosTipo"
          :key="opt.value"
          type="button"
          class="text-[11px] px-2.5 py-1 rounded-full border transition-colors"
          :class="
            filtroTipo === opt.value
              ? 'bg-[#0d9e6e] text-white border-[#0d9e6e]'
              : 'bg-white text-[#3a3a3c] border-black/10 hover:border-[#0d9e6e]/40'
          "
          @click="filtroTipo = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>

      <div v-if="cargando && documentos.length === 0" class="py-12 text-center">
        <p class="text-[12px] text-[#86868b]">Cargando documentos...</p>
      </div>

      <div
        v-else-if="error"
        class="p-4 rounded-[9px] bg-red-50/80 border border-red-200/60 text-[12px] text-red-700"
      >
        {{ error }}
      </div>

      <div
        v-else-if="documentosFiltrados.length === 0"
        class="py-12 text-center border border-dashed border-black/10 rounded-xl bg-[#fafafa]"
      >
        <p class="text-[13px] text-[#3a3a3c]">No hay documentos almacenados.</p>
        <RouterLink
          to="/ai-document-uploader"
          class="inline-block mt-2 text-[12px] text-[#0d9e6e] hover:underline"
        >
          Subir el primero
        </RouterLink>
      </div>

      <div
        v-else
        class="border border-black/[0.07] rounded-[10px] overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-left text-[12px]">
            <thead class="bg-[#fafafa] border-b border-black/[0.06]">
              <tr>
                <th class="px-3 py-2.5 font-medium text-[#86868b]">Archivo</th>
                <th
                  class="px-3 py-2.5 font-medium text-[#86868b] hidden sm:table-cell"
                >
                  Tipo
                </th>
                <th
                  class="px-3 py-2.5 font-medium text-[#86868b] hidden md:table-cell"
                >
                  Tamaño
                </th>
                <th class="px-3 py-2.5 font-medium text-[#86868b]">Estado</th>
                <th
                  class="px-3 py-2.5 font-medium text-[#86868b] hidden lg:table-cell"
                >
                  Análisis IA
                </th>
                <th
                  class="px-3 py-2.5 font-medium text-[#86868b] hidden md:table-cell"
                >
                  Fecha
                </th>
                <th
                  class="px-3 py-2.5 font-medium text-[#86868b] min-w-[140px]"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-black/[0.04]">
              <tr
                v-for="doc in documentosFiltrados"
                :key="doc.id"
                class="hover:bg-[#f0faf6]/40 transition-colors"
              >
                <td class="px-3 py-3 max-w-[200px]">
                  <span class="font-medium text-[#1d1d1f] truncate block">
                    {{ doc.original_filename }}
                  </span>
                  <span
                    class="text-[10px] text-[#aeaeb2] font-mono truncate block mt-0.5"
                  >
                    {{ doc.id.slice(0, 8) }}…
                  </span>
                </td>
                <td class="px-3 py-3 hidden sm:table-cell">
                  <span
                    class="inline-flex uppercase text-[10px] font-semibold px-1.5 py-0.5 rounded"
                    :class="
                      doc.file_type === 'pdf'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-blue-50 text-blue-700'
                    "
                  >
                    {{ doc.file_type }}
                  </span>
                </td>
                <td
                  class="px-3 py-3 text-[#86868b] hidden md:table-cell whitespace-nowrap"
                >
                  {{ formatearTamano(doc.file_size_bytes) }}
                </td>
                <td class="px-3 py-3">
                  <span
                    class="inline-flex text-[10px] font-medium px-2 py-0.5 rounded-full"
                    :class="claseEstado(doc.status)"
                  >
                    {{ etiquetaEstado(doc.status) }}
                  </span>
                </td>
                <td class="px-3 py-3 hidden lg:table-cell">
                  <span class="text-[#86868b]">
                    {{ resumenAnalisis(doc) }}
                  </span>
                </td>
                <td
                  class="px-3 py-3 text-[#86868b] hidden md:table-cell whitespace-nowrap"
                >
                  {{ formatearFecha(doc.created_at) }}
                </td>
                <td class="px-3 py-3">
                  <div class="flex flex-col gap-1.5 items-start">
                    <button
                      type="button"
                      :disabled="
                        descargandoId === doc.id || analizandoId === doc.id
                      "
                      class="text-[11px] text-[#0d9e6e] hover:underline disabled:opacity-50"
                      @click="abrirDocumento(doc)"
                    >
                      {{ descargandoId === doc.id ? "Abriendo…" : "Abrir" }}
                    </button>
                    <button
                      type="button"
                      :disabled="
                        analizandoId === doc.id || descargandoId === doc.id
                      "
                      class="text-[11px] font-medium text-slate-800 hover:text-[#0d9e6e] disabled:opacity-50 text-left"
                      @click="analizarConIA(doc)"
                    >
                      {{
                        analizandoId === doc.id
                          ? "Analizando…"
                          : "Analizar por inteligencia artificial"
                      }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p
          class="px-3 py-2 text-[11px] text-[#aeaeb2] bg-[#fafafa] border-t border-black/[0.04]"
        >
          {{ documentosFiltrados.length }} de
          {{ documentos.length }} documento(s)
        </p>
      </div>
    </div>

    <Transition name="fade">
      <div
        v-if="modalAnalisisAbierto"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
        @click.self="cerrarModalAnalisis"
      >
        <div
          class="bg-white rounded-2xl border border-black/[0.08] shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col"
        >
          <header
            class="px-5 py-4 border-b border-black/[0.06] flex items-start justify-between gap-3"
          >
            <div class="min-w-0">
              <h3 class="text-[14px] font-semibold text-[#1d1d1f]">
                Análisis con IA
              </h3>
              <p class="text-[11px] text-[#86868b] mt-0.5 truncate">
                {{ documentoAnalizado?.original_filename }}
              </p>
            </div>
            <button
              type="button"
              class="text-[#aeaeb2] hover:text-[#1d1d1f] p-1 shrink-0"
              @click="cerrarModalAnalisis"
            >
              ✕
            </button>
          </header>
          <div
            class="ai-analysis-markdown px-5 py-4 overflow-y-auto flex-1 text-[12.5px] text-[#3a3a3c] leading-relaxed prose prose-sm prose-slate max-w-none"
            v-html="analisisHtml"
          ></div>
          <footer
            class="px-5 py-3 border-t border-black/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
          >
            <p
              v-if="mensajeGuardadoModal"
              class="text-[11px]"
              :class="errorGuardadoModal ? 'text-red-600' : 'text-[#0d9e6e]'"
            >
              {{ mensajeGuardadoModal }}
            </p>
            <div class="flex items-center justify-end gap-2 ml-auto">
              <button
                type="button"
                class="py-2 px-4 text-[12px] font-medium text-[#3a3a3c] border border-black/10 rounded-[9px] hover:bg-[#fafafa]"
                @click="cerrarModalAnalisis"
              >
                Cerrar
              </button>
              <button
                type="button"
                :disabled="!puedeGuardarAnalisis"
                class="py-2 px-4 text-[12px] font-medium text-white bg-[#0d9e6e] rounded-[9px] hover:bg-[#0a8a5f] disabled:opacity-50 disabled:cursor-not-allowed"
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
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
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
const modalAnalisisAbierto = ref(false);
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

const analisisHtml = computed(() => {
  const raw = textoAnalisisModal.value?.trim();
  if (!raw) return "";
  return md.render(raw);
});

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

function etiquetaEstado(status: string): string {
  const map: Record<string, string> = {
    uploaded: "Subido",
    processing: "Procesando",
    analyzed: "Analizado",
    error: "Error",
  };
  return map[status] ?? status;
}

function claseEstado(status: string): string {
  const map: Record<string, string> = {
    uploaded: "bg-slate-100 text-slate-700",
    processing: "bg-amber-50 text-amber-800",
    analyzed: "bg-[#f0faf6] text-[#0d9e6e]",
    error: "bg-red-50 text-red-700",
  };
  return map[status] ?? "bg-slate-100 text-slate-600";
}

function resumenAnalisis(doc: AiDocumentUploadWithAnalysis): string {
  const n = doc.ai_document_analysis?.length ?? 0;
  if (n === 0) return "Sin análisis";
  const ultimo = doc.ai_document_analysis[0];
  return `${n} registro(s) · ${ultimo?.status ?? "—"}`;
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

Proporciona un análisis profesional en español que incluya:
1. **Resumen ejecutivo** del documento
2. **Datos clínicos o administrativos relevantes** identificados
3. **Hallazgos principales** y puntos de atención
4. **Recomendaciones** para el equipo clínico
5. **Observaciones** sobre la calidad o completitud del documento

Usa markdown con títulos y listas cuando sea útil. Sé objetivo y preciso.`;
}

function cerrarModalAnalisis() {
  modalAnalisisAbierto.value = false;
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

.ai-analysis-markdown :deep(h1),
.ai-analysis-markdown :deep(h2),
.ai-analysis-markdown :deep(h3) {
  color: #1d1d1f;
  font-weight: 600;
  margin-top: 1.25em;
  margin-bottom: 0.5em;
}

.ai-analysis-markdown :deep(h1) {
  font-size: 1.15em;
}
.ai-analysis-markdown :deep(h2) {
  font-size: 1.05em;
}
.ai-analysis-markdown :deep(h3) {
  font-size: 1em;
}

.ai-analysis-markdown :deep(p) {
  margin: 0.65em 0;
}

.ai-analysis-markdown :deep(ul),
.ai-analysis-markdown :deep(ol) {
  margin: 0.65em 0;
  padding-left: 1.25em;
}

.ai-analysis-markdown :deep(li) {
  margin: 0.25em 0;
}

.ai-analysis-markdown :deep(strong) {
  color: #1d1d1f;
  font-weight: 600;
}

.ai-analysis-markdown :deep(code) {
  font-size: 0.9em;
  background: #f4f4f5;
  padding: 0.1em 0.35em;
  border-radius: 4px;
}

.ai-analysis-markdown :deep(pre) {
  background: #1d1d1f;
  color: #f4f4f5;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0.75em 0;
}

.ai-analysis-markdown :deep(pre code) {
  background: transparent;
  padding: 0;
}

.ai-analysis-markdown :deep(blockquote) {
  border-left: 3px solid #0d9e6e;
  padding-left: 0.75rem;
  margin: 0.75em 0;
  color: #52525b;
  font-style: italic;
}

.ai-analysis-markdown :deep(a) {
  color: #0d9e6e;
  text-decoration: underline;
}
</style>
