<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Contenido principal -->
    <main class="w-full max-w-5xl mx-auto px-4 sm:px-6 py-11 sm:py-14">
      <!-- Encabezado de sección -->
      <div class="mb-7">
        <h2
          class="text-[26px] sm:text-[30px] font-semibold text-[#1d1d1f] tracking-tight leading-snug"
        >
          Tamizajes Auditivos
        </h2>
        <p
          class="mt-1.5 text-[13px] text-[#86866b] max-w-md leading-relaxed tracking-tight"
        >
          Gestiona evaluaciones auditivas, visualiza respuestas de pacientes y
          obtén análisis inteligentes.
        </p>
      </div>

      <!-- Separador diagonal del Z  -->
      <div
        class="h-px bg-gradient-to-r from-black/[0.06] to-transparent mb-7"
      />

      <!-- Grid de cards principales -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-5">
        <!-- Card 1: Gestión de Tamizajes -->
        <div
          class="bg-white rounded-[14px] border border-black/[0.07] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.07)] transition-all duration-150"
        >
          <!-- Header de card -->
          <div
            class="px-[18px] pt-4 pb-[14px] border-black/[0.05] flex items-center gap-2.5"
          >
            <div
              class="w-8 h-8 bg-[#f0faf6] rounded-[9px] flex items-center justify-center shrink-0"
            >
              <svg
                class="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            </div>
            <div>
              <h2
                class="text-[13px] font-semibold text-[#1d1d1f] leading-tight tracking-tight"
              >
                Gestión de Tamizajes
              </h2>
              <p class="text-[11px] text-[#86868b] mt-0.5 tracking-tight">
                Crear y administrar evaluaciones
              </p>
            </div>
          </div>

          <!-- Acciones -->
          <div class="p-3.5 space-y-2">
            <!-- Crear Tamizaje -->
            <button
              class="w-full group flex items-center justify-between px-3.5 py-[11px] bg-[#0d9e6e] hover:bg-[#0a8a5f] rounded-[9px] transition-all duration-100 active:scale-[.98] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(13,158,110,0.2)]"
              @click="goToHearingScreeningForm"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-7 h-7 bg-white/15 rounded-md flex items-center justify-center shrink-0"
                >
                  <svg
                    class="w-[11px] h-[11px] text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div class="text-left">
                  <p
                    class="text-[12.5px] font-medium text-white tracking-tight leading-tight"
                  >
                    Crear Tamizaje
                  </p>
                  <p class="text-[10px] text-white/60 tracking-tight">
                    Nueva evaluación auditiva
                  </p>
                </div>
              </div>
              <svg
                class="w-[13px] h-[13px] text-[#c9c9c9] group-hover:translate-x-0.5 transition-transform"
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
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
const goToHearingScreeningForm = () => {
  router.push("/hearing-screening-form");
};
</script>
<style scoped>
/* Animación suave para hover */
.group:hover {
  transform: translateY(-2px);
}

/* Transiciones suaves */
* {
  transition-property: background-color, border-color, color, transform, shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
