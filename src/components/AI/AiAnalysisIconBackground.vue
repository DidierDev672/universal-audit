<template>
  <div
    class="pointer-events-none overflow-hidden select-none"
    :class="rootClass"
    aria-hidden="true"
  >
    <div class="absolute inset-0" :class="baseClass" />
    <div
      v-if="variant === 'page'"
      class="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_15%_8%,#d9fdd3_0%,transparent_42%),radial-gradient(circle_at_85%_92%,#e8f5e9_0%,transparent_38%)]"
    />

    <div
      class="absolute inset-0"
      :class="variant === 'modal' ? 'opacity-[0.45]' : 'opacity-[0.65]'"
    >
      <div
        v-for="icon in wallpaperIcons"
        :key="icon.id"
        class="absolute"
        :style="iconStyle(icon)"
        :title="icon.label"
      >
        <div
          class="w-8 h-8 rounded-[10px] flex items-center justify-center border border-white/80 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          :class="icon.bg"
        >
          <svg
            class="w-5 h-5 shrink-0"
            :class="icon.text"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              v-for="(p, pi) in pathsFor(icon)"
              :key="pi"
              :d="p"
            />
          </svg>
        </div>
      </div>
    </div>

    <div
      v-if="veiled"
      class="absolute inset-0"
      :class="variant === 'modal' ? 'bg-white/55' : 'bg-white/35'"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import {
  buildIconWallpaper,
  type IconPatternItem,
} from "./aiAnalysisIconPattern";

const route = useRoute();

const props = withDefaults(
  defineProps<{
    variant?: "page" | "modal";
    /** Cuántas veces repetir el set de 30 iconos (×3 = 90) */
    repeat?: number;
    veiled?: boolean;
  }>(),
  {
    variant: "page",
    repeat: 3,
    veiled: true,
  },
);

function newLayoutSeed(): number {
  return Math.floor(Math.random() * 1_000_000_000);
}

/** Nueva semilla al montar, recargar o cambiar de ruta */
const layoutSeed = ref(newLayoutSeed());

watch(
  () => route.fullPath,
  () => {
    layoutSeed.value = newLayoutSeed();
  },
);

onMounted(() => {
  layoutSeed.value = newLayoutSeed();
});

const wallpaperIcons = computed(() =>
  buildIconWallpaper(props.repeat, layoutSeed.value),
);

const rootClass = computed(() =>
  props.variant === "page"
    ? "fixed inset-0 z-0"
    : "absolute inset-0 z-0 rounded-b-2xl",
);

const baseClass = computed(() =>
  props.variant === "page" ? "bg-[#e5ddd5]" : "bg-[#e8ebe9]",
);

function iconStyle(icon: IconPatternItem): Record<string, string> {
  const left = icon.left ?? 50;
  const top = icon.top ?? 50;
  const scale = icon.scale ?? 1;
  const skewX = icon.skewX ?? 0;
  const skewY = icon.skewY ?? 0;
  const opacity = icon.opacity ?? 0.72;
  return {
    left: `${left}%`,
    top: `${top}%`,
    opacity: String(opacity),
    transform: `translate(-50%, -50%) rotate(${icon.rotate}deg) skewX(${skewX}deg) skewY(${skewY}deg) scale(${scale})`,
  };
}

function pathsFor(icon: IconPatternItem): string[] {
  if (icon.paths?.length) return icon.paths;
  if (icon.path) return [icon.path];
  return ["M12 12h.01"];
}
</script>
