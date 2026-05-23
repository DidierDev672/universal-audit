<script setup lang="ts">
import { computed, onUnmounted, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    subtitle?: string;
    /** Ancho máximo del panel */
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
    zIndex?: number;
    closeOnBackdrop?: boolean;
    /** En móvil abre como bottom-sheet */
    mobileSheet?: boolean;
    panelClass?: string;
    scrimClass?: string;
    ariaLabelledby?: string;
    ariaLabel?: string;
  }>(),
  {
    maxWidth: "lg",
    zIndex: 50,
    closeOnBackdrop: true,
    mobileSheet: true,
    panelClass: "",
    scrimClass: "",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
}>();

const maxWidthClass = computed(
  () =>
    ({
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
      full: "max-w-full",
    })[props.maxWidth],
);

function close() {
  emit("update:modelValue", false);
  emit("close");
}

function onBackdrop() {
  if (props.closeOnBackdrop) close();
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && props.modelValue) close();
}

watch(
  () => props.modelValue,
  (open) => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
  },
  { immediate: true },
);

onUnmounted(() => {
  if (typeof document !== "undefined") document.body.style.overflow = "";
});
</script>

<template>
  <Teleport to="body">
    <Transition name="app-modal">
      <div
        v-if="modelValue"
        class="app-modal-root"
        :style="{ zIndex }"
        role="presentation"
        @keydown="onKeydown"
      >
        <div
          class="app-modal-backdrop"
          aria-hidden="true"
          @click="onBackdrop"
        />
        <div
          class="app-modal-scrim"
          :class="[
            mobileSheet ? 'app-modal-scrim--sheet' : '',
            scrimClass,
          ]"
          @click.self="onBackdrop"
        >
          <div
            class="app-modal-panel w-full rounded-2xl border border-slate-200 bg-white shadow-2xl"
            :class="[
              maxWidthClass,
              mobileSheet ? 'app-modal-panel--sheet' : '',
              panelClass,
            ]"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="ariaLabelledby"
            :aria-label="ariaLabel"
            @click.stop
          >
            <header
              v-if="$slots.header || title"
              class="app-modal-header shrink-0 border-b border-slate-100 px-5 py-4"
            >
              <slot name="header">
                <h3
                  v-if="title"
                  :id="ariaLabelledby"
                  class="text-sm font-semibold text-slate-900"
                >
                  {{ title }}
                </h3>
                <p
                  v-if="subtitle"
                  class="mt-0.5 text-xs text-slate-500"
                >
                  {{ subtitle }}
                </p>
              </slot>
              <slot name="header-actions" />
            </header>

            <div class="app-modal-body min-h-0 flex-1 overflow-y-auto">
              <slot />
            </div>

            <footer
              v-if="$slots.footer"
              class="app-modal-footer shrink-0 border-t border-slate-100 px-5 py-3"
            >
              <slot name="footer" />
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
