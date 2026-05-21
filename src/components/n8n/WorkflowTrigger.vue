<template>
  <div
    class="max-w-md mx-auto p-6 bg-white rounded-2xl border border-black/[0.07]"
  >
    <!-- Formulario -->
    <form @submit.prevent="enviar" class="space-y-4">
      <div>
        <label class="text-[12px] text-gray-500 tracking-tight mb-1 block"
          >Nombre</label
        >
        <input
          v-model="form.nombre"
          required
          class="w-full text-[13px] border border-black/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 transition-colors"
          placeholder="Ej: Juan Pérez"
        />
      </div>
      <div>
        <label class="text-[12px] text-gray-500 tracking-tight mb-1 block"
          >Mensaje</label
        >
        <textarea
          v-model="form.mensaje"
          required
          class="w-full text-[13px] border border-black/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 transition-colors"
          placeholder="Ej: Hola, ¿cómo estás?"
        ></textarea>
      </div>
      <button
        type="submit"
        :disabled="cargando"
        class="w-full py-2.5 bg-[#0d9e6e] text-white text-[13px] font-medium rounded-lg transition-all hover:bg-[#0a8a5f] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[.98]"
      >
        {{ cargando ? "Enviando..." : "Enviar" }}
      </button>
    </form>

    <!-- Estado de respuesta -->
    <Transition name="fade">
      <div
        v-if="ejecutado"
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
        <p class="mt-0.5 opacity-80">
          {{ error ?? JSON.stringify(resultado) }}
        </p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useN8n } from "../../composables/useN8n";

const { ejecutar, cargando, error, ejecutado, resultado } = useN8n<unknown>(
  "formulario-contacto",
);

const form = reactive({
  nombre: "",
  email: "",
  mensaje: "",
});

async function enviar() {
  await ejecutar({ ...form });
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
