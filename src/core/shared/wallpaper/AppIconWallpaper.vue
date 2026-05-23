<template>
  <div
    class="pointer-events-none overflow-hidden select-none"
    :class="rootClass"
    aria-hidden="true"
  >
    <div class="absolute inset-0" :class="baseClass" />
    <div
      v-if="variant === 'content'"
      class="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_10%_8%,#d9fdd3_0%,transparent_42%),radial-gradient(circle_at_80%_90%,#e8f5e9_0%,transparent_38%)]"
    />

    <div
      class="absolute inset-0"
      :class="variant === 'modal' ? 'opacity-[0.45]' : 'opacity-[0.62]'"
    >
      <div
        v-for="icon in wallpaperIcons"
        :key="icon.id"
        class="absolute"
        :style="iconStyle(icon)"
        :title="icon.label"
      >
        <div
          class="w-6 h-6 rounded-[8px] flex items-center justify-center border border-white/80 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
          :class="icon.bg"
        >
          <svg
            class="w-4 h-4 shrink-0"
            :class="icon.text"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path v-for="(p, pi) in pathsFor(icon)" :key="pi" :d="p" />
          </svg>
        </div>
      </div>
    </div>

    <div
      v-if="veiled"
      class="absolute inset-0"
      :class="variant === 'modal' ? 'bg-white/55' : 'bg-white/30'"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import {
  buildIconWallpaper,
  type IconPatternItem,
} from "./iconWallpaperPattern";

const route = useRoute();

const props = withDefaults(
  defineProps<{
    /** content = área principal (Layout); modal = diálogos */
    variant?: "content" | "modal";
    /** Repeticiones del set completo (×3 = 120 iconos) */
    repeat?: number;
    veiled?: boolean;
  }>(),
  {
    variant: "content",
    repeat: 3,
    veiled: false,
  },
);

function newLayoutSeed(): number {
  return Math.floor(Math.random() * 1_000_000_000);
}

const layoutSeed = ref(newLayoutSeed());

watch(
  () => route.fullPath,
  () => {
    layoutSeed.value = newLayoutSeed();
  },
);

const wallpaperIcons = computed(() =>
  buildIconWallpaper(props.repeat, layoutSeed.value),
);

const rootClass = computed(() =>
  props.variant === "modal"
    ? "absolute inset-0 z-0 h-full w-full rounded-b-2xl"
    : "absolute inset-0 z-0 h-full w-full",
);

const baseClass = computed(() =>
  props.variant === "modal" ? "bg-[#e8ebe9]" : "bg-[#e5ddd5]",
);

function iconStyle(icon: IconPatternItem): Record<string, string> {
  const left = icon.left ?? 50;
  const top = icon.top ?? 50;
  const opacity = icon.opacity ?? 0.7;
  return {
    left: `${left}%`,
    top: `${top}%`,
    opacity: String(opacity),
    transform: "translate(-50%, -50%)",
  };
}

function pathsFor(icon: IconPatternItem): string[] {
  if (icon.paths?.length) return icon.paths;
  if (icon.path) return [icon.path];
  return ["M12 12h.01"];
}
</script>
