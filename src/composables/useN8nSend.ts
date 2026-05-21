import { readonly, ref } from "vue";
import { n8nService } from "@/services/n8n";
import type { N8nGeminiTaskRequest, N8nGeminiTaskResponse } from "@/types/n8n";

export function useN8nSend() {
  const resultado = ref<N8nGeminiTaskResponse | null>(null);
  const cargando = ref(false);
  const error = ref<string | null>(null);
  const enviado = ref(false);

  async function enviar(payload: N8nGeminiTaskRequest) {
    cargando.value = true;
    error.value = null;

    const res = await n8nService.geminiTask(payload);

    if (res.ok) {
      resultado.value = res.data;
    } else {
      error.value = res.error;
    }

    cargando.value = false;
    enviado.value = true;

    return res;
  }

  function resetear() {
    resultado.value = null;
    cargando.value = false;
    error.value = null;
    enviado.value = false;
  }

  return {
    resultado: readonly(resultado),
    cargando: readonly(cargando),
    error: readonly(error),
    enviado: readonly(enviado),
    enviar,
    resetear,
  };
}
