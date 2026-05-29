<template>
  <div
    class="relative z-10 min-h-[calc(100dvh-8rem)] px-4 sm:px-6 py-6 sm:py-8"
  >
    <div class="max-w-6xl mx-auto">
      <div
        class="bg-white rounded-2xl border border-black/[0.07] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden"
      >
        <div
          class="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0d9e6e] to-[#0ea5e9] z-20"
        />

        <div class="relative z-10 px-6 pt-7 pb-6">
          <header class="mb-6">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2
                class="text-[14px] font-semibold text-[#1d1d1f] tracking-tight"
              >
                Modelo 3D — Cuerpo humano y órganos
              </h2>
            </div>
            <p
              class="text-[11.5px] text-[#86868b] leading-relaxed tracking-tight max-w-2xl"
            >
              Explora el cuerpo completo o selecciona un sistema orgánico para
              visualizar sus estructuras en 3D (oído, cerebro, corazón, pulmón,
              aparatos reproductivos, etc.).
            </p>
          </header>

          <div class="flex gap-1 p-1 mb-4 rounded-xl bg-slate-100 w-fit">
            <button
              type="button"
              class="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
              :class="
                vistaActiva === 'cuerpo'
                  ? 'bg-white text-[#1d1d1f] shadow-sm'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              "
              @click="vistaActiva = 'cuerpo'"
            >
              Cuerpo completo
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
              :class="
                vistaActiva === 'sistemas'
                  ? 'bg-white text-[#1d1d1f] shadow-sm'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              "
              @click="vistaActiva = 'sistemas'"
            >
              Sistemas y partes
            </button>
          </div>

          <HumanBodyOrgans3D
            v-if="vistaActiva === 'cuerpo'"
            class="min-h-[560px]"
          />
          <OrganSystemViewer3D
            v-else
            class="min-h-[560px]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import HumanBodyOrgans3D from "@/components/anatomy/HumanBodyOrgans3D.vue";
import OrganSystemViewer3D from "@/components/anatomy/OrganSystemViewer3D.vue";

const vistaActiva = ref<"cuerpo" | "sistemas">("sistemas");
</script>
