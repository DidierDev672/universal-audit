<template>
  <div
    class="max-w-4xl mx-auto bg-white rounded-2xl border border-black/[0.07] shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden"
  >
    <!-- Franja clínica superior -->
    <div
      class="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0d9e6e] to-[#0ea5e9]"
    />

    <div class="px-6 pt-7 pb-6">
      <!-- Header -->
      <header class="mb-5">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 class="text-[14px] font-semibold text-[#1d1d1f] tracking-tight">
            Documentos clínicos
          </h2>
        </div>
        <p class="text-[11.5px] text-[#86868b] leading-relaxed tracking-tight">
          Carga archivos PDF o Word para almacenarlos y procesarlos con análisis
          de IA.
        </p>
      </header>

      <div class="space-y-3">
        <!-- Zona de carga (clic, arrastrar o botón agregar más) -->
        <label
          class="flex flex-col items-center justify-center w-full min-h-[116px] border border-dashed rounded-xl cursor-pointer transition-all duration-150 bg-[#fafafa] gap-1.5"
          :class="
            arrastrando
              ? 'border-[#0d9e6e] bg-[#f0faf6]/80'
              : 'border-black/[0.10] hover:border-[#0d9e6e]/40 hover:bg-[#f0faf6]/60'
          "
          @dragenter.prevent="arrastrando = true"
          @dragover.prevent="arrastrando = true"
          @dragleave.prevent="arrastrando = false"
          @drop.prevent="onDrop"
        >
          <div
            class="w-8 h-8 bg-[#f0faf6] rounded-[8px] flex items-center justify-center mb-1"
          >
            <svg
              class="w-4 h-4 text-[#0d9e6e]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          </div>
          <span class="text-[12.5px] text-[#3a3a3c] tracking-tight">
            Arrastra o haz clic para elegir
          </span>
          <span class="text-[11px] text-[#aeaeb2] tracking-tight">
            PDF · DOC · DOCX — selección múltiple
          </span>
          <span
            v-if="files.length > 0"
            class="text-[11px] font-medium text-[#0d9e6e] mt-0.5"
          >
            {{ files.length }} archivo(s) en cola
          </span>
          <input
            ref="fileInputRef"
            type="file"
            class="sr-only"
            multiple
            :accept="ACCEPT_MIME"
            @change="onFilePick"
          />
        </label>

        <button
          v-if="files.length > 0"
          type="button"
          class="w-full py-2 text-[12px] text-[#0d9e6e] border border-[#0d9e6e]/25 rounded-[9px] hover:bg-[#f0faf6] transition-colors"
          @click="abrirSelectorDocumentos"
        >
          + Agregar más documentos
        </button>

        <!-- Lista de archivos -->
        <ul
          v-if="files.length > 0"
          class="border border-black/[0.07] rounded-[10px] overflow-hidden divide-y divide-black/[0.04] max-h-48 overflow-y-auto"
        >
          <li
            v-for="(f, i) in files"
            :key="claveArchivo(f)"
            class="flex items-center gap-2.5 px-3 py-2.5"
          >
            <div
              class="w-[26px] h-[26px] bg-[#f0faf6] rounded-[6px] flex items-center justify-center shrink-0"
            >
              <svg
                class="w-[13px] h-[13px] text-[#0d9e6e]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span
              class="flex-1 text-[12.5px] text-[#1d1d1f] truncate tracking-tight"
            >
              {{ f.name }}
            </span>
            <span class="text-[11px] text-[#aeaeb2] shrink-0">
              {{ (f.size / 1024).toFixed(1) }} KB
            </span>
            <button
              type="button"
              class="shrink-0 p-1 rounded-md text-[#aeaeb2] hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Quitar de la selección"
              @click="quitarDocumento(i)"
            >
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </li>
        </ul>

        <button
          v-if="files.length > 0"
          type="button"
          class="text-[11px] text-[#aeaeb2] hover:text-[#1d1d1f] underline-offset-2 hover:underline"
          @click="limpiarSeleccion"
        >
          Vaciar selección ({{ files.length }})
        </button>

        <!-- Badge documentos listos -->
        <div
          v-if="documentosListos.length > 0"
          class="inline-flex items-center gap-1.5 text-[11px] text-[#0d9e6e] bg-[#f0faf6] border border-[#0d9e6e]/[0.15] px-2.5 py-1 rounded-full"
        >
          <svg
            class="w-[11px] h-[11px]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ documentosListos.length }} documento(s) listos para analizar
        </div>

        <!-- Botones -->
        <div class="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            type="button"
            :disabled="files.length === 0"
            class="flex-1 py-[10px] bg-[#0d9e6e] hover:bg-[#0a8a5f] text-white text-[12.5px] font-medium rounded-[9px] tracking-tight transition-all duration-100 active:scale-[.98] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(13,158,110,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
            @click="almacenar"
          >
            {{ almacenando ? "Almacenando..." : "Almacenar" }}
          </button>

          <button
            type="button"
            :disabled="documentosListos.length === 0"
            class="flex-1 py-[10px] bg-[#1d1d1f] hover:bg-[#3a3a3c] text-white text-[12.5px] font-medium rounded-[9px] tracking-tight transition-all duration-100 active:scale-[.98] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
            @click="analizar"
          >
            {{ analizando ? "Encolando análisis..." : "Analizar con IA" }}
          </button>
        </div>

        <!-- Mensaje de estado -->
        <Transition name="fade">
          <div
            v-if="mensaje"
            class="flex items-start gap-2 p-3 rounded-[9px] text-[12px] tracking-tight"
            :class="
              mensajeTipo === 'error'
                ? 'bg-red-50/80 border border-red-200/60 text-red-700'
                : 'bg-[#f0faf6] border border-[#0d9e6e]/[0.18] text-[#0d9e6e]'
            "
          >
            <svg
              class="w-3.5 h-3.5 shrink-0 mt-px"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="
                  mensajeTipo === 'error'
                    ? 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    : 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                "
              />
            </svg>
            {{ mensaje }}
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/core/login/presentation/store/authStore";
import {
  inferDocumentFileType,
  queueAiAnalysisForDocuments,
  storeAiDocument,
} from "@/services/aiDocumentsService";
import type { AiDocumentUploadRow } from "@/services/aiDocumentsService";

const ACCEPT_MIME =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const auth = useAuthStore();

const fileInputRef = ref<HTMLInputElement | null>(null);
const files = ref<File[]>([]);
const arrastrando = ref(false);
const almacenando = ref(false);
const analizando = ref(false);
const documentosListos = ref<AiDocumentUploadRow[]>([]);

const mensaje = ref("");
const mensajeTipo = ref<"ok" | "error">("ok");

function toast(text: string, tipo: "ok" | "error") {
  mensaje.value = text;
  mensajeTipo.value = tipo;
}

/** Clave estable para listar y evitar duplicados en la cola */
function claveArchivo(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

/**
 * Añade uno o varios PDF/Word a la cola sin reemplazar los ya elegidos.
 * Devuelve cuántos se agregaron y los nombres rechazados o duplicados.
 */
function seleccionarDocumentos(entrada: FileList | File[] | null | undefined): {
  agregados: number;
  rechazados: string[];
  duplicados: string[];
} {
  const lista = entrada ? Array.from(entrada) : [];
  const rechazados: string[] = [];
  const duplicados: string[] = [];
  const existentes = new Set(files.value.map(claveArchivo));
  let agregados = 0;

  for (const file of lista) {
    if (!inferDocumentFileType(file)) {
      rechazados.push(file.name);
      continue;
    }
    const clave = claveArchivo(file);
    if (existentes.has(clave)) {
      duplicados.push(file.name);
      continue;
    }
    existentes.add(clave);
    files.value.push(file);
    agregados++;
  }

  return { agregados, rechazados, duplicados };
}

/** Abre el diálogo del sistema para elegir varios archivos */
function abrirSelectorDocumentos() {
  fileInputRef.value?.click();
}

function notificarResultadoSeleccion(
  resultado: ReturnType<typeof seleccionarDocumentos>,
) {
  const { agregados, rechazados, duplicados } = resultado;
  const partes: string[] = [];

  if (agregados > 0) {
    partes.push(
      `${agregados} archivo(s) añadido(s). Total en cola: ${files.value.length}.`,
    );
  }
  if (rechazados.length > 0) {
    partes.push(`No válidos (solo PDF/Word): ${rechazados.join(", ")}`);
  }
  if (duplicados.length > 0) {
    partes.push(`Ya estaban en la lista: ${duplicados.join(", ")}`);
  }

  if (partes.length === 0 && files.value.length === 0) {
    return;
  }

  const esError = rechazados.length > 0 && agregados === 0;
  toast(partes.join(" "), esError ? "error" : "ok");
}

function onFilePick(ev: Event) {
  const input = ev.target as HTMLInputElement;
  const resultado = seleccionarDocumentos(input.files);
  notificarResultadoSeleccion(resultado);
  input.value = "";
}

function onDrop(ev: DragEvent) {
  arrastrando.value = false;
  const resultado = seleccionarDocumentos(ev.dataTransfer?.files);
  notificarResultadoSeleccion(resultado);
}

function quitarDocumento(indice: number) {
  files.value.splice(indice, 1);
}

function limpiarSeleccion() {
  files.value = [];
  if (fileInputRef.value) fileInputRef.value.value = "";
  mensaje.value = "";
}

defineExpose({
  seleccionarDocumentos,
  abrirSelectorDocumentos,
  limpiarSeleccion,
  files,
});

async function almacenar() {
  if (files.value.length === 0) return;
  almacenando.value = true;
  mensaje.value = "";

  const clientId = auth.currentUser?.id ?? null;
  const subidos: AiDocumentUploadRow[] = [];
  try {
    for (const file of files.value) {
      const row = await storeAiDocument(file, clientId);
      subidos.push(row);
    }
    documentosListos.value = subidos;
    toast(
      `${subidos.length} archivo(s) almacenado(s). Puedes encolar el análisis con IA.`,
      "ok",
    );
    limpiarSeleccion();
  } catch (e) {
    toast(e instanceof Error ? e.message : "Error al almacenar", "error");
  } finally {
    almacenando.value = false;
  }
}

async function analizar() {
  if (documentosListos.value.length === 0) return;
  analizando.value = true;
  mensaje.value = "";
  try {
    const ids = documentosListos.value.map((d) => d.id);
    const analyses = await queueAiAnalysisForDocuments(ids);
    toast(
      `Se crearon ${analyses.length} registro(s) de análisis (estado pendiente). Conecta un worker o webhook para generar la respuesta de IA en ai_document_analysis.`,
      "ok",
    );
  } catch (e) {
    toast(
      e instanceof Error ? e.message : "Error al encolar análisis",
      "error",
    );
  } finally {
    analizando.value = false;
  }
}
</script>
