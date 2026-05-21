import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { n8nService } from "../services/n8n";

export interface EjecucionLog {
  id: string;
  workflow: string;
  estado: "pendiente" | "ejecutando" | "completado" | "error";
  fechaInicio: string;
  resultado: unknown;
}

export const useWorkflowsStore = defineStore("workflows", () => {
  const historial = ref<EjecucionLog[]>([]);
  const activos = ref(0);

  const exitosos = computed(
    () => historial.value.filter((e) => e.estado === "completado").length,
  );

  const fallidos = computed(
    () => historial.value.filter((e) => e.estado === "error").length,
  );

  async function ejecutarWorkflow(
    workflow: string,
    payload: Record<string, unknown>,
  ) {
    activos.value++;
    const log: EjecucionLog = {
      id: crypto.randomUUID(),
      workflow,
      estado: "pendiente",
      fechaInicio: new Date().toISOString(),
      resultado: null,
    };
    historial.value.unshift(log);

    const res = await n8nService.ejecutar(workflow, payload);

    const entrada = historial.value.find((e) => e.id === log.id);
    if (entrada) {
      entrada.estado = res.ok ? "completado" : "error";
      entrada.resultado = res.ok ? res.data : res.error;
    }
    activos.value--;
    return res;
  }

  return {
    historial,
    activos,
    exitosos,
    fallidos,
    ejecutarWorkflow,
  };
});
