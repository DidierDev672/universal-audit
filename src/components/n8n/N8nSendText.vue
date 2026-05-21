<template>
  <div
    class="max-w-4xl mx-auto p-6 bg-white rounded-2xl border border-black/[0.07] shadow-sm"
  >
    <header class="mb-5">
      <h2 class="text-[15px] font-semibold text-gray-900 tracking-tight">
        Gemini task — n8n
      </h2>
      <p class="mt-1 text-[12px] text-gray-500">
        POST /webhook-test/gemini-task
      </p>
    </header>

    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="text-[12px] text-gray-500 tracking-tight mb-1 block">
          Mensaje
        </label>
        <textarea
          v-model="mensaje"
          required
          rows="4"
          class="w-full text-[13px] border border-black/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 transition-colors resize-y min-h-[96px]"
          placeholder="Escribe la tarea o mensaje para Gemini..."
        />
      </div>

      <button
        type="submit"
        :disabled="cargando || !mensaje.trim()"
        class="w-full py-2.5 bg-[#0d9e6e] text-white text-[13px] font-medium rounded-lg transition-all hover:bg-[#0a8a5f] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[.98]"
      >
        {{ cargando ? "Enviando..." : "Enviar" }}
      </button>
    </form>

    <Transition name="fade">
      <div
        v-if="enviado"
        class="mt-4 p-3 rounded-lg text-[12px]"
        :class="
          error
            ? 'bg-red-50 border border-red-200 text-red-700'
            : 'bg-green-50 border border-green-200 text-green-700'
        "
      >
        <p class="font-medium">
          {{ error ? "Error" : "Enviado correctamente" }}
        </p>

        <p v-if="!error && resultado?.message" class="mt-2 break-words">
          {{ resultado.message }}
        </p>

        <p v-else-if="error" class="mt-0.5 opacity-80">{{ error }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useN8nSend } from "@/composables/useN8nSend";

const { enviar, cargando, error, enviado, resultado } = useN8nSend();

const mensaje = ref("");

async function onSubmit() {
  const message = mensaje.value.trim();
  if (!message) return;

  await enviar({ message });
  mensaje.value = "";
}
</script>

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
