<script setup lang="ts">
import { computed } from "vue";
import { themeByBackground } from "@/shared/constants/noteColorThemes";

export interface FolderNotePeek {
  subject: string;
  color: string;
}

const props = defineProps<{
  title: string;
  description?: string | null;
  noteCount: number;
  notePeeks: FolderNotePeek[];
  index?: number;
}>();

const emit = defineEmits<{ open: []; delete: [] }>();

const visiblePeeks = computed(() => props.notePeeks.slice(0, 5));

const overflowCount = computed(() =>
  Math.max(0, props.noteCount - visiblePeeks.value.length),
);

function peekTextColor(color: string): string {
  return themeByBackground(color)?.contentText ?? "#475569";
}

/** Abanico tipo poker — reposo (solo franja superior) y hover (fan completo). */
function peekStyle(color: string, noteIndex: number, total: number) {
  const count = Math.max(total, 1);
  const mid = (count - 1) / 2;
  const offset = noteIndex - mid;

  const restRot = offset * 4;
  const hoverRot = offset * 8;
  const hoverX = offset * 18;
  const hoverY = -1 - Math.abs(offset) * 2.5;
  const restY = 26 + Math.abs(offset) * 1.2;

  return {
    backgroundColor: color,
    color: peekTextColor(color),
    "--note-rest-y": `${restY}px`,
    "--note-rest-rot": `${restRot}deg`,
    "--note-hover-x": `${hoverX}px`,
    "--note-hover-y": `${hoverY}px`,
    "--note-hover-rot": `${hoverRot}deg`,
    "--note-stagger": `${noteIndex * 52}ms`,
    zIndex: noteIndex + 2,
  } as Record<string, string | number>;
}
</script>

<template>
  <div
    class="folder-card group relative mx-auto w-full max-w-xl"
    :style="{ '--stagger': `${(index ?? 0) * 70}ms` }"
  >
    <button
      type="button"
      class="folder-card__open w-full text-left"
      @click="emit('open')"
    >
      <div
        class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-[border-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] group-hover:border-slate-300 group-hover:shadow-md focus-visible:border-blue-200/80 focus-visible:shadow-md"
      >
      <div
        class="folder-visual relative mx-auto w-full max-w-[168px]"
        aria-hidden="true"
      >
        <div class="folder-shadow" />
        <div class="folder-back" />
        <div class="folder-tab" />
        <div class="folder-label-stripe" />

        <!-- Notas en abanico (poker hand) -->
        <div class="folder-notes-stack">
          <div
            v-for="(note, noteIndex) in visiblePeeks"
            :key="`${note.subject}-${noteIndex}`"
            class="folder-note"
            :style="peekStyle(note.color, noteIndex, visiblePeeks.length)"
          >
            <span class="folder-note__subject">{{ note.subject }}</span>
            <span class="folder-note__line" />
            <span class="folder-note__line folder-note__line--short" />
          </div>
          <div
            v-if="visiblePeeks.length === 0"
            class="folder-note folder-note--empty"
            :style="{ zIndex: 2 }"
          >
            <span class="folder-note__subject">Sin notas</span>
          </div>
        </div>

        <!-- Solapa frontal — se abre por completo al hover -->
        <div class="folder-flap">
          <div class="folder-flap__shine" />
          <div class="folder-flap__crease" />
        </div>

        <div v-if="overflowCount > 0" class="folder-overflow">
          +{{ overflowCount }}
        </div>
      </div>

      <div class="mt-3 flex items-start justify-between gap-2.5">
        <div class="min-w-0 flex-1">
          <h2
            class="text-sm font-semibold leading-snug text-slate-900 transition-colors duration-300 ease-[var(--ease-out-expo)] group-hover:text-blue-900 line-clamp-2"
          >
            {{ title }}
          </h2>
          <p
            v-if="description"
            class="mt-0.5 text-xs font-medium leading-snug text-slate-500 line-clamp-2"
          >
            {{ description }}
          </p>
          <p v-else class="mt-0.5 text-xs font-medium italic text-slate-400">
            Sin descripción
          </p>
        </div>

        <div
          class="folder-count-badge shrink-0"
          :aria-label="`${noteCount} ${noteCount === 1 ? 'nota' : 'notas'}`"
        >
          <span class="folder-count-badge__value">{{ noteCount }}</span>
        </div>
      </div>
      </div>
    </button>

    <button
      type="button"
      class="folder-card__delete absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent bg-white/90 text-rose-600 opacity-0 shadow-sm ring-1 ring-slate-200/80 transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 hover:ring-rose-200/70 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60 focus-visible:ring-offset-2 group-hover:opacity-100"
      title="Eliminar paquete"
      aria-label="Eliminar paquete de notas"
      @click.stop="emit('delete')"
    >
      <svg
        class="h-4 w-4 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
/*
  Micro-interacciones al estilo animations.dev / Emil Kowalski:
  expo-out para desplazamientos, spring suave con overshoot ligero en el abanico.
*/
.folder-card {
  --ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-spring: cubic-bezier(0.34, 1.28, 0.64, 1);
  --ease-folder: cubic-bezier(0.33, 1, 0.68, 1);
  --folder-antique-light: #faf3dc;
  --folder-antique-mid: #ead9a0;
  --folder-antique-deep: #d4b878;
  --folder-antique-edge: #b8985a;
  --folder-antique-shadow: rgba(96, 72, 32, 0.18);
  animation: folder-card-enter 0.65s var(--ease-out-expo) both;
  animation-delay: var(--stagger, 0ms);
}

.folder-card__open {
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.folder-card__open:focus-visible {
  outline: none;
}

.folder-card__open:focus-visible .rounded-xl {
  box-shadow:
    0 0 0 3px #ffffff,
    0 0 0 5px rgba(59, 130, 246, 0.38);
}

/* Altura compacta en reposo; se expande al abrir para las notas */
.folder-visual {
  height: 118px;
  transition:
    height 0.58s var(--ease-folder),
    transform 0.48s var(--ease-spring);
}

.folder-shadow {
  position: absolute;
  left: 6%;
  right: 6%;
  bottom: -3px;
  height: 8px;
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    rgba(96, 72, 32, 0.2) 0%,
    transparent 72%
  );
  z-index: 0;
  transition:
    transform 0.52s var(--ease-folder),
    opacity 0.4s var(--ease-out-expo);
}

.folder-back {
  position: absolute;
  inset: 19px 0 0;
  border-radius: 0 9px 9px 9px;
  background: linear-gradient(
    168deg,
    var(--folder-antique-light) 0%,
    var(--folder-antique-mid) 42%,
    var(--folder-antique-deep) 100%
  );
  border: 1px solid rgba(184, 152, 90, 0.5);
  box-shadow:
    inset 0 2px 10px rgba(255, 255, 255, 0.58),
    inset 0 -4px 8px rgba(96, 72, 32, 0.07),
    0 5px 12px var(--folder-antique-shadow);
  z-index: 1;
  transition:
    transform 0.55s var(--ease-folder),
    box-shadow 0.48s var(--ease-out-expo);
}

.folder-tab {
  position: absolute;
  top: 0;
  left: 0;
  width: 70px;
  height: 19px;
  border-radius: 8px 9px 0 0;
  background: linear-gradient(
    180deg,
    #fcf8ee 0%,
    var(--folder-antique-mid) 100%
  );
  border: 1px solid rgba(184, 152, 90, 0.45);
  border-bottom: none;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.82);
  z-index: 4;
  transform-origin: left bottom;
  transition: transform 0.58s var(--ease-spring);
}

.folder-label-stripe {
  position: absolute;
  top: 36px;
  left: 11px;
  right: 11px;
  height: 2px;
  border-radius: 999px;
  background: rgba(184, 152, 90, 0.24);
  z-index: 2;
  opacity: 0.75;
  transition: opacity 0.4s var(--ease-out-expo);
}

/* Abanico — en reposo solo se ve una franja horizontal superior */
.folder-notes-stack {
  position: absolute;
  left: 50%;
  top: 24px;
  width: 142px;
  height: 38px;
  transform: translateX(-50%);
  overflow: hidden;
  z-index: 3;
  pointer-events: none;
  clip-path: inset(0 0 calc(100% - 9px) 0);
  transition: clip-path 0.58s var(--ease-folder);
}

.folder-note {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 48px;
  height: 38px;
  margin-left: -24px;
  padding: 4px 6px 0;
  border-radius: 5px 5px 4px 4px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  box-shadow:
    0 2px 8px rgba(15, 23, 42, 0.09),
    inset 0 1px 0 rgba(255, 255, 255, 0.38);
  transform-origin: bottom center;
  transform: translateY(var(--note-rest-y, 38px))
    rotate(var(--note-rest-rot, 0deg));
  transition:
    transform 0.62s var(--ease-spring),
    box-shadow 0.45s var(--ease-out-expo),
    opacity 0.38s var(--ease-out-expo);
  transition-delay: var(--note-stagger, 0ms);
  will-change: transform;
}

.folder-note__subject {
  display: block;
  font-size: 6.5px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.folder-note__line {
  display: block;
  height: 1px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.22;
  margin-bottom: 1px;
}

.folder-note__line--short {
  width: 54%;
}

.folder-note--empty {
  background: rgba(255, 255, 255, 0.88);
  color: #64748b;
  transform: translateY(23px) rotate(0deg);
}

.folder-flap {
  position: absolute;
  left: 0;
  right: 0;
  top: 30px;
  bottom: 0;
  border-radius: 0 9px 9px 9px;
  background: linear-gradient(
    180deg,
    rgba(252, 248, 238, 0.42) 0%,
    var(--folder-antique-mid) 16%,
    var(--folder-antique-deep) 100%
  );
  border: 1px solid rgba(184, 152, 90, 0.44);
  border-top: 1px solid rgba(184, 152, 90, 0.3);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    0 6px 11px rgba(96, 72, 32, 0.12);
  z-index: 5;
  transform-origin: center top;
  transition:
    transform 0.62s var(--ease-folder),
    box-shadow 0.48s var(--ease-out-expo);
  backface-visibility: hidden;
}

.folder-flap__shine {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    128deg,
    rgba(255, 255, 255, 0.32) 0%,
    transparent 48%
  );
  pointer-events: none;
}

.folder-flap__crease {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 1px;
  background: rgba(184, 152, 90, 0.35);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.25);
}

.folder-overflow {
  position: absolute;
  right: 5px;
  bottom: 7px;
  z-index: 6;
  padding: 2px 5px;
  border-radius: 999px;
  font-size: 6px;
  font-weight: 700;
  color: #5c4a28;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(184, 152, 90, 0.4);
  box-shadow: 0 2px 6px rgba(96, 72, 32, 0.12);
  transition:
    transform 0.5s var(--ease-spring),
    opacity 0.35s var(--ease-out-expo);
}

/* ── Hover: carpeta se abre por completo + abanico de notas ── */
.group:hover .folder-visual,
.group:focus-within .folder-visual {
  height: 158px;
  transform: translateY(-3px);
}

.group:hover .folder-shadow,
.group:focus-within .folder-shadow {
  transform: scaleX(1.1);
  opacity: 0.9;
}

.group:hover .folder-tab,
.group:focus-within .folder-tab {
  transform: translateY(-4px) rotate(-6deg);
}

.group:hover .folder-back,
.group:focus-within .folder-back {
  transform: translateY(-3px) scale(1.015);
  box-shadow:
    inset 0 2px 10px rgba(255, 255, 255, 0.58),
    inset 0 -4px 8px rgba(96, 72, 32, 0.07),
    0 8px 16px var(--folder-antique-shadow);
}

.group:hover .folder-label-stripe,
.group:focus-within .folder-label-stripe {
  opacity: 0.35;
}

.group:hover .folder-flap,
.group:focus-within .folder-flap {
  transform: perspective(400px) rotateX(68deg) translateY(7px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    0 9px 14px rgba(96, 72, 32, 0.18);
}

.group:hover .folder-notes-stack,
.group:focus-within .folder-notes-stack {
  clip-path: inset(0 0 0 0);
  overflow: visible;
  top: 6px;
  height: 48px;
  transition:
    clip-path 0.58s var(--ease-folder),
    top 0.58s var(--ease-folder),
    height 0.58s var(--ease-folder);
}

.group:hover .folder-note,
.group:focus-within .folder-note {
  transform: translateX(var(--note-hover-x, 0))
    translateY(var(--note-hover-y, -12px)) rotate(var(--note-hover-rot, 0deg));
  box-shadow:
    0 7px 12px rgba(15, 23, 42, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.42);
}

.group:hover .folder-note--empty,
.group:focus-within .folder-note--empty {
  transform: translateY(2px) rotate(0deg);
}

.group:hover .folder-overflow,
.group:focus-within .folder-overflow {
  transform: translateY(-6px) scale(1.06);
}

/* Badge cromático azul → verde — solo número */
.folder-count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  min-height: 2.5rem;
  padding: 6px 10px;
  border-radius: 10px;
  background: linear-gradient(135deg, #2563eb 0%, #0891b2 42%, #059669 100%);
  box-shadow:
    0 2px 16px rgba(37, 99, 235, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.32),
    0 0 0 1px rgba(255, 255, 255, 0.16);
  transition:
    transform 0.5s var(--ease-spring),
    box-shadow 0.42s var(--ease-out-expo);
}

.folder-count-badge__value {
  font-size: 0.9375rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: #ffffff;
  transition: transform 0.52s var(--ease-spring);
}

.group:hover .folder-count-badge {
  transform: scale(1.08);
  box-shadow:
    0 4px 22px rgba(13, 148, 136, 0.36),
    inset 0 1px 0 rgba(255, 255, 255, 0.36);
}

.group:hover .folder-count-badge__value {
  transform: scale(1.06);
}

.folder-card:active .folder-visual {
  transform: scale(0.985);
  transition-duration: 0.12s;
}

@keyframes folder-card-enter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .folder-card,
  .folder-visual,
  .folder-tab,
  .folder-back,
  .folder-flap,
  .folder-note,
  .folder-count-badge,
  .folder-count-badge__value,
  .folder-overflow,
  .folder-shadow,
  .folder-notes-stack {
    animation: none;
    transition: none;
  }

  .group:hover .folder-visual,
  .group:focus-within .folder-visual {
    height: 118px;
    transform: none;
  }

  .group:hover .folder-flap,
  .group:focus-within .folder-flap {
    transform: none;
  }

  .group:hover .folder-notes-stack,
  .group:focus-within .folder-notes-stack {
    clip-path: inset(0 0 calc(100% - 9px) 0);
    top: 24px;
    height: 38px;
  }

  .group:hover .folder-note,
  .group:focus-within .folder-note {
    transform: translateY(-5px);
  }
}
</style>
