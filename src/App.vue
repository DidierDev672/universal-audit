<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// ── Interfaces ───────────────────────────────────────────────────────────────
interface HealthIcon {
  id: string;
  color: string;
  svg: string;
}

interface FloatingParticle {
  id: number;
  icon: HealthIcon;
  size: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
  opacity: number;
  glow: boolean;
}

// ── Íconos de Salud Auditiva y Salud Humana ─────────────────────────────────
const HEALTH_ICONS: HealthIcon[] = [
  // Oído / Audición
  {
    id: "ear",
    color: "#60a5fa",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 8a6 6 0 0 1 12 0c0 2.5-1.5 4-3 5.5S13 15 13 17a2 2 0 0 1-4 0c0-3 2-4 3.5-5.5S14 9 12 8a4 4 0 0 0-4 4v1a1 1 0 0 1-2 0v-1c0-2.5 2-5 5-5z"/><path d="M12 19v2"/></svg>`
  },
  // Ondas de sonido
  {
    id: "sound-waves",
    color: "#34d399",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`
  },
  // Corazón
  {
    id: "heart",
    color: "#f472b6",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
  },
  // Pulso/Actividad cardíaca
  {
    id: "heart-pulse",
    color: "#f87171",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.78 7.65 7.65 7.65-7.65.77-.78a5.4 5.4 0 0 0 0-7.65z"/><path d="M3.5 12h2.5l2-6 4 12 3-8 2 2h2.5"/></svg>`
  },
  // Estetoscopio
  {
    id: "stethoscope",
    color: "#a78bfa",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 0 0-.2.3"/><path d="M8 15v4"/><path d="M16 4v4a4 4 0 0 0 4 4v0a4 4 0 0 0 4-4V4"/><path d="M20 15v3a3 3 0 0 1-3 3v0a3 3 0 0 1-3-3v-3"/></svg>`
  },
  // Cerebro
  {
    id: "brain",
    color: "#fbbf24",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.37 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.37 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`
  },
  // Cruz médica
  {
    id: "medical-cross",
    color: "#fb7185",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 2v20"/><path d="M2 8h20"/><rect x="6" y="6" width="12" height="12" rx="2"/></svg>`
  },
  // Frecuencia/ECG
  {
    id: "activity",
    color: "#22d3ee",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`
  },
  // Usuario salud
  {
    id: "user-health",
    color: "#a3e635",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 3v4"/><path d="M10 5h4"/></svg>`
  },
  // Pastilla/Medicina
  {
    id: "pill",
    color: "#f472b6",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`
  },
  // Escudo/Salud protegida
  {
    id: "shield",
    color: "#2dd4bf",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`
  },
  // Ojo (salud visual conexión)
  {
    id: "eye",
    color: "#818cf8",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`
  }
];

// ── Generar partículas flotantes ────────────────────────────────────────────
function createParticle(id: number): FloatingParticle {
  const icon = HEALTH_ICONS[Math.floor(Math.random() * HEALTH_ICONS.length)]!;
  return {
    id,
    icon,
    size: 28 + Math.random() * 36,
    left: Math.random() * 95,
    top: Math.random() * 95,
    duration: 20 + Math.random() * 25,
    delay: Math.random() * 15,
    opacity: 0.1 + Math.random() * 0.25,
    glow: Math.random() > 0.75
  };
}

const floatingIcons = ref<FloatingParticle[]>(
  Array.from({ length: 15 }, (_, i) => createParticle(i))
);

// ── Recrear partículas periódicamente ───────────────────────────────────────
let particleInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  particleInterval = setInterval(() => {
    const idx = Math.floor(Math.random() * floatingIcons.value.length);
    floatingIcons.value[idx] = createParticle(idx);
  }, 10000);
});

onUnmounted(() => {
  if (particleInterval) clearInterval(particleInterval);
});
</script>

<template>
  <div class="app-container">
    <!-- Íconos flotantes de salud auditiva y salud humana -->
    <div class="floating-icons-layer">
      <div v-for="(particle, idx) in floatingIcons" :key="idx" class="floating-icon" :style="{
        left: particle.left + '%',
        top: particle.top + '%',
        animationDuration: particle.duration + 's',
        animationDelay: particle.delay + 's',
        opacity: particle.opacity
      }">
        <div class="icon-wrapper" :style="{
          width: particle.size + 'px',
          height: particle.size + 'px',
          color: particle.icon.color,
          filter: particle.glow ? `drop-shadow(0 0 12px ${particle.icon.color})` : 'none'
        }" v-html="particle.icon.svg" />
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="main-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.floating-icons-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background: linear-gradient(135deg, #f0f9ff 0%, #f5f3ff 50%, #fdf2f8 100%);
}

.main-content {
  position: relative;
  z-index: 1;
}

/* ── Animación flotante suave ──────────────────────────────────────────────── */
.floating-icon {
  position: absolute;
  will-change: transform, opacity;
  animation: gentleFloat linear infinite;
}

@keyframes gentleFloat {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0;
  }

  8% {
    opacity: var(--final-opacity, 0.2);
  }

  25% {
    transform: translateY(-30px) translateX(15px) rotate(8deg);
  }

  50% {
    transform: translateY(-60px) translateX(-10px) rotate(-5deg);
  }

  75% {
    transform: translateY(-90px) translateX(20px) rotate(10deg);
  }

  92% {
    opacity: var(--final-opacity, 0.2);
  }

  100% {
    transform: translateY(-120px) translateX(5px) rotate(0deg);
    opacity: 0;
  }
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.floating-icon:hover .icon-wrapper {
  transform: scale(1.15);
}
</style>
