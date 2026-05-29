<template>
  <div class="max-w-5xl mx-auto">
    <div
      class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl mb-8"
    >
      <div class="flex items-center gap-4">
        <div
          class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
        >
          <svg
            class="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <div>
          <h2 class="text-3xl font-bold mb-1">Modelo generativo IA</h2>
          <p class="text-white/90">
            Proveedor y API key usados por
            <code class="text-sm bg-white/20 px-1.5 py-0.5 rounded"
              >para la plataforma Universal Audit</code
            >
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="feedback"
      :class="[
        'rounded-2xl p-4 mb-6 shadow-lg flex items-start gap-3',
        feedback.type === 'success'
          ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          : 'bg-red-50 border border-red-200 text-red-800',
      ]"
      role="alert"
    >
      <p class="font-medium">{{ feedback.message }}</p>
    </div>

    <div
      class="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden"
    >
      <form class="p-8 space-y-8" @submit.prevent="handleSave">
        <div class="space-y-2">
          <label
            for="model-provider"
            class="block text-sm font-semibold text-gray-800"
          >
            Tipo de modelo
          </label>
          <select
            id="model-provider"
            v-model="formProvider"
            class="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-4 focus:border-emerald-500 focus:ring-emerald-100 transition-all bg-white"
          >
            <option
              v-for="opt in providerOptions"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
          <p class="text-xs text-gray-500">
            Modelo por defecto:
            <span class="font-mono text-emerald-700">{{
              defaultModelForSelection
            }}</span>
          </p>
        </div>

        <div class="space-y-2">
          <label
            for="api-key"
            class="block text-sm font-semibold text-gray-800"
          >
            API key
            <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              id="api-key"
              v-model="formApiKey"
              :type="showKey ? 'text' : 'password'"
              required
              autocomplete="off"
              placeholder="Pega tu API key del proveedor seleccionado"
              :class="[
                'w-full px-4 py-3 pr-24 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all font-mono text-sm',
                apiKeyNeedsRenewal
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                  : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100',
              ]"
              @input="apiKeyNeedsRenewal = false"
            />
            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
              @click="showKey = !showKey"
            >
              {{ showKey ? "Ocultar" : "Mostrar" }}
            </button>
          </div>
          <p
            v-if="apiKeyNeedsRenewal"
            class="text-xs text-red-600 font-medium"
          >
            La prueba falló: ingresa una nueva API key y guarda de nuevo para
            volver a probar la conexión.
          </p>
          <p v-else class="text-xs text-gray-500">
            La clave se guarda en el navegador (localStorage) y la usa cada
            llamada a análisis IA del proyecto.
          </p>
        </div>

        <div
          v-if="configStore.isConfigured"
          class="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-800"
        >
          <svg
            class="w-5 h-5 shrink-0 text-emerald-600"
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
          <span>
            Activo:
            <strong>{{ providerLabel(configStore.provider) }}</strong>
            — key configurada ({{ maskedStoredKey }})
          </span>
        </div>

        <div class="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            class="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all hover:scale-[1.02]"
          >
            Guardar configuración
          </button>
          <button
            type="button"
            class="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
            @click="handleClear"
          >
            Borrar API key
          </button>
        </div>
      </form>
    </div>

    <AppModal
      v-model="showTestModal"
      title="Probar conexión con el modelo"
      :subtitle="testModalSubtitle"
      max-width="2xl"
      aria-labelledby="test-modal-title"
      @close="resetTestState"
    >
      <div class="px-5 py-5 space-y-5">
        <div
          class="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-800"
        >
          <svg
            class="w-5 h-5 shrink-0 text-emerald-600"
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
          <span>
            Configuración guardada. Envía una pregunta para verificar que la API
            key funciona.
          </span>
        </div>

        <div class="space-y-2">
          <label
            for="test-prompt"
            class="block text-sm font-semibold text-gray-800"
          >
            Pregunta de prueba
          </label>
          <textarea
            id="test-prompt"
            v-model="testPrompt"
            rows="4"
            placeholder="Ej: ¿Cuál es la capital de Colombia? Responde en una frase."
            class="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-4 focus:border-emerald-500 focus:ring-emerald-100 transition-all resize-y text-sm"
            :disabled="isTesting"
          />
        </div>

        <div
          v-if="testError && !testFailedKeyCleared"
          class="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          <p class="font-semibold mb-1">La API key no respondió correctamente</p>
          <p class="text-red-700/90 break-words">{{ testError }}</p>
        </div>

        <div
          v-if="testResponse"
          class="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm"
        >
          <p class="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
            <svg
              class="w-5 h-5 text-emerald-600"
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
            Conexión exitosa — respuesta del modelo
          </p>
          <div
            class="ai-test-prose text-gray-800"
            v-html="renderedTestResponse"
          />
        </div>

        <div
          v-if="isTesting"
          class="flex items-center gap-3 text-sm text-emerald-700"
        >
          <svg
            class="w-5 h-5 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Consultando al modelo, espera un momento…
        </div>
      </div>

      <template #footer>
        <div class="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            class="px-5 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
            :disabled="isTesting"
            @click="closeTestModal"
          >
            Cerrar
          </button>
          <button
            type="button"
            class="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-md hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isTesting || !testPrompt.trim()"
            @click="runApiTest"
          >
            {{ isTesting ? "Probando…" : "Enviar pregunta" }}
          </button>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import MarkdownIt from "markdown-it";
import { AppModal } from "@/core/shared/modal";
import { useGenerativeModelConfigStore } from "@/stores/generativeModelConfig";
import { useGetGenerativeModelGP } from "@/shared/service/useGetGenerativeModelGP";
import {
  DEFAULT_MODEL_BY_PROVIDER,
  GENERATIVE_MODEL_PROVIDER_LABELS,
  type GenerativeModelProvider,
} from "@/shared/types/generativeModel";

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
});

const configStore = useGenerativeModelConfigStore();

const formProvider = ref<GenerativeModelProvider>(configStore.provider);
const formApiKey = ref(configStore.apiKey);
const showKey = ref(false);

const feedback = ref<{ type: "success" | "error"; message: string } | null>(
  null,
);

const showTestModal = ref(false);
const testPrompt = ref("");
const testResponse = ref("");
const testError = ref("");
const isTesting = ref(false);
const testFailedKeyCleared = ref(false);
const apiKeyNeedsRenewal = ref(false);

const testModalSubtitle = computed(() => {
  const label = providerLabel(formProvider.value);
  const model = DEFAULT_MODEL_BY_PROVIDER[formProvider.value];
  return `${label} · ${model}`;
});

const renderedTestResponse = computed(() => {
  const content = testResponse.value.trim();
  if (!content) return "";
  return md.render(content);
});

const providerOptions = (
  Object.entries(GENERATIVE_MODEL_PROVIDER_LABELS) as [
    GenerativeModelProvider,
    string,
  ][]
).map(([value, label]) => ({ value, label }));

const defaultModelForSelection = computed(
  () => DEFAULT_MODEL_BY_PROVIDER[formProvider.value],
);

const maskedStoredKey = computed(() => {
  const k = configStore.apiKey;
  if (!k) return "—";
  if (k.length <= 8) return "••••••••";
  return `${k.slice(0, 4)}••••${k.slice(-4)}`;
});

watch(
  () => configStore.provider,
  (p) => {
    formProvider.value = p;
  },
);

watch(
  () => configStore.apiKey,
  (k) => {
    if (!formApiKey.value && k) formApiKey.value = k;
  },
);

function providerLabel(p: GenerativeModelProvider) {
  return GENERATIVE_MODEL_PROVIDER_LABELS[p];
}

function clearApiKeyFromSystem() {
  configStore.clearApiKey();
  formApiKey.value = "";
}

function resetTestState() {
  testPrompt.value = "";
  testResponse.value = "";
  testError.value = "";
  testFailedKeyCleared.value = false;
  isTesting.value = false;
}

function closeTestModal() {
  showTestModal.value = false;
  resetTestState();
}

function handleTestFailure(errorMessage: string) {
  testFailedKeyCleared.value = true;
  clearApiKeyFromSystem();
  apiKeyNeedsRenewal.value = true;
  closeTestModal();
  feedback.value = {
    type: "error",
    message: `La prueba falló y la API key fue eliminada. Registra una nueva clave y pulsa «Guardar configuración». Detalle: ${errorMessage}`,
  };
}

async function runApiTest() {
  const question = testPrompt.value.trim();
  if (!question || isTesting.value) return;

  isTesting.value = true;
  testResponse.value = "";
  testError.value = "";
  testFailedKeyCleared.value = false;

  try {
    const answer = await useGetGenerativeModelGP(question);
    testResponse.value = answer ?? "";
    if (!testResponse.value) {
      handleTestFailure("El modelo respondió vacío. Revisa la configuración.");
      return;
    }
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Error desconocido al probar la API.";
    handleTestFailure(msg);
    return;
  } finally {
    isTesting.value = false;
  }
}

function handleSave() {
  const key = formApiKey.value.trim();
  if (!key) {
    feedback.value = {
      type: "error",
      message: "Ingresa una API key válida antes de guardar.",
    };
    return;
  }
  configStore.saveConfig(formProvider.value, key);
  apiKeyNeedsRenewal.value = false;
  feedback.value = {
    type: "success",
    message: `Configuración guardada para ${providerLabel(formProvider.value)}.`,
  };
  resetTestState();
  showTestModal.value = true;
}

function handleClear() {
  clearApiKeyFromSystem();
  apiKeyNeedsRenewal.value = false;
  feedback.value = {
    type: "success",
    message: "API key eliminada del almacenamiento local.",
  };
}
</script>

<style scoped>
.ai-test-prose :deep(h1),
.ai-test-prose :deep(h2),
.ai-test-prose :deep(h3),
.ai-test-prose :deep(h4) {
  color: #065f46;
  font-weight: 600;
  line-height: 1.35;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.ai-test-prose :deep(h1) {
  font-size: 1.25rem;
}

.ai-test-prose :deep(h2) {
  font-size: 1.125rem;
}

.ai-test-prose :deep(h3),
.ai-test-prose :deep(h4) {
  font-size: 1rem;
}

.ai-test-prose :deep(p) {
  color: #1f2937;
  font-size: 0.875rem;
  line-height: 1.75;
  margin: 0.5rem 0;
}

.ai-test-prose :deep(ul),
.ai-test-prose :deep(ol) {
  margin: 0.5rem 0;
  padding-left: 1.25rem;
  font-size: 0.875rem;
  line-height: 1.65;
}

.ai-test-prose :deep(li) {
  margin: 0.25rem 0;
}

.ai-test-prose :deep(li::marker) {
  color: #059669;
}

.ai-test-prose :deep(strong) {
  color: #064e3b;
  font-weight: 600;
}

.ai-test-prose :deep(code) {
  font-size: 0.8125rem;
  font-family: ui-monospace, monospace;
  background: #ecfdf5;
  color: #047857;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.ai-test-prose :deep(pre) {
  background: #1e293b;
  color: #f1f5f9;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 0.75rem 0;
  font-size: 0.8125rem;
}

.ai-test-prose :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}

.ai-test-prose :deep(blockquote) {
  border-left: 4px solid #10b981;
  background: #ecfdf5;
  padding: 0.75rem 1rem;
  margin: 0.75rem 0;
  border-radius: 0 0.5rem 0.5rem 0;
  color: #047857;
}

.ai-test-prose :deep(a) {
  color: #0d9488;
  text-decoration: underline;
}

.ai-test-prose :deep(hr) {
  border: none;
  border-top: 1px solid #d1fae5;
  margin: 1rem 0;
}
</style>
