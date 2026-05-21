import { readonly, ref } from "vue";
import { n8nService } from "../services/n8n";

export function useN8n<T = unknown>(workflowPath: string) {
  const resultado = ref<T | null>(null);
  const cargando = ref(false);
  const error = ref<string | null>(null);
  const ejecutado = ref(false);

  async function ejecutar(payload: Record<string, unknown> = {}) {
    cargando.value = true;
    error.value = null;

    const res = await n8nService.ejecutar<T>(workflowPath, payload);

    if (res.ok) {
      resultado.value = res.data;
    } else {
      error.value = res.error;
    }

    cargando.value = false;
    ejecutado.value = true;

    return res;
  }

  function resetear() {
    resultado.value = null;
    cargando.value = false;
    error.value = null;
    ejecutado.value = false;
  }

  return {
    resultado: readonly(resultado),
    cargando: readonly(cargando),
    error: readonly(error),
    ejecutado: readonly(ejecutado),
    ejecutar,
    resetear,
  };
}
