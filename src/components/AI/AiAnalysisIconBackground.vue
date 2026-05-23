<template>
  <AppIconWallpaper
    :variant="variant === 'page' ? 'content' : 'modal'"
    :repeat="repeat"
    :veiled="veiled"
  />
</template>

<script setup lang="ts">
import AppIconWallpaper from "@/core/shared/wallpaper/AppIconWallpaper.vue";

withDefaults(
  defineProps<{
    variant?: "page" | "modal";
    repeat?: number;
    veiled?: boolean;
  }>(),
  {
    variant: "page",
    repeat: 3,
    veiled: false,
  },
);
</script>
