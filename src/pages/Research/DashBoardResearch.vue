<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden">
    <!-- Fondo con iconos animados estilo WhatsApp - Salud Auditiva -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <!-- Partículas suaves animadas -->
      <div class="absolute w-2 h-2 bg-blue-200/30 rounded-full animate-particle"
        style="top: 15%; left: 8%; animation-delay: 0s;"></div>
      <div class="absolute w-1.5 h-1.5 bg-slate-300/25 rounded-full animate-particle"
        style="top: 25%; left: 12%; animation-delay: 2s;"></div>
      <div class="absolute w-2.5 h-2.5 bg-blue-300/20 rounded-full animate-particle"
        style="top: 10%; left: 25%; animation-delay: 4s;"></div>
      <div class="absolute w-1 h-1 bg-slate-400/35 rounded-full animate-particle"
        style="top: 35%; left: 5%; animation-delay: 1s;"></div>
      <div class="absolute w-2 h-2 bg-blue-200/25 rounded-full animate-particle"
        style="top: 45%; left: 15%; animation-delay: 3s;"></div>
      <div class="absolute w-1.5 h-1.5 bg-slate-300/30 rounded-full animate-particle"
        style="top: 55%; left: 10%; animation-delay: 5s;"></div>
      <div class="absolute w-2 h-2 bg-blue-300/20 rounded-full animate-particle"
        style="top: 65%; left: 20%; animation-delay: 2.5s;"></div>
      <div class="absolute w-1 h-1 bg-slate-400/25 rounded-full animate-particle"
        style="top: 75%; left: 6%; animation-delay: 1.5s;"></div>
      <div class="absolute w-2.5 h-2.5 bg-blue-200/35 rounded-full animate-particle"
        style="top: 85%; left: 18%; animation-delay: 3.5s;"></div>
      <div class="absolute w-1.5 h-1.5 bg-slate-300/20 rounded-full animate-particle"
        style="top: 20%; left: 30%; animation-delay: 0.5s;"></div>

      <!-- Iconos de SALUD AUDITIVA -->
      <!-- Oído - posición superior izquierda -->
      <div class="absolute top-[8%] left-[3%] w-10 h-10 text-blue-300/40 animate-float-slow"
        style="animation-delay: 0s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      </div>
      <!-- Ondas sonoras - posición superior derecha -->
      <div class="absolute top-[12%] right-[5%] w-8 h-8 text-slate-400/35 animate-float-slow"
        style="animation-delay: 1.5s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      </div>
      <!-- Auriculares - centro izquierda -->
      <div class="absolute top-[30%] left-[2%] w-9 h-9 text-blue-300/30 animate-float-slow"
        style="animation-delay: 3s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </div>
      <!-- Volumen/Altavoz - inferior izquierda -->
      <div class="absolute bottom-[25%] left-[4%] w-7 h-7 text-slate-400/35 animate-float-slow"
        style="animation-delay: 2s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      </div>
      <!-- Frecuencia/Gráfico - medio derecha -->
      <div class="absolute top-[40%] right-[3%] w-8 h-8 text-blue-400/40 animate-float-slow"
        style="animation-delay: 4s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      </div>
      <!-- Micrófono - centro -->
      <div class="absolute top-[50%] left-[45%] w-7 h-7 text-slate-400/25 animate-float-slow"
        style="animation-delay: 2.5s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </div>
      <!-- Campana/Alerta - arriba centro -->
      <div class="absolute top-[5%] left-[50%] w-6 h-6 text-blue-300/30 animate-float-slow"
        style="animation-delay: 1.2s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <!-- Chat/Comunicación - inferior derecha -->
      <div class="absolute bottom-[15%] right-[8%] w-8 h-8 text-slate-400/30 animate-float-slow"
        style="animation-delay: 3.5s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <!-- Lupa/Búsqueda - arriba izquierda -->
      <div class="absolute top-[20%] left-[35%] w-6 h-6 text-blue-300/25 animate-float-slow"
        style="animation-delay: 0.8s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <!-- Corazón/Salud - centro izquierda -->
      <div class="absolute top-[60%] left-[8%] w-7 h-7 text-slate-400/25 animate-float-slow"
        style="animation-delay: 4.5s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <!-- Estrella/Destacado - arriba derecha -->
      <div class="absolute top-[3%] right-[25%] w-6 h-6 text-blue-300/30 animate-float-slow"
        style="animation-delay: 2.2s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </div>
      <!-- Calendario/Tiempo - inferior centro -->
      <div class="absolute bottom-[10%] left-[40%] w-7 h-7 text-slate-400/30 animate-float-slow"
        style="animation-delay: 5s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <!-- Usuarios/Pacientes - centro derecha -->
      <div class="absolute top-[70%] right-[12%] w-8 h-8 text-blue-300/35 animate-float-slow"
        style="animation-delay: 1.8s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
    </div>

    <!-- Header minimalista -->
    <header class="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-100">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
        <div class="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <h1 class="text-sm font-semibold text-slate-800 tracking-tight">
          Panel de Investigaciones
        </h1>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

      <!-- Encabezado de sección -->
      <div class="mb-10">
        <h2 class="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight leading-snug">
          Investigaciones
        </h2>
        <p class="mt-2 text-sm sm:text-base text-slate-500 max-w-lg leading-relaxed">
          Gestiona tus proyectos de investigación en salud auditiva y consulta análisis detallados.
        </p>
      </div>

      <!-- Grid de acciones -->
      <aside class="flex gap-2 justify-between">

        <!-- Card: Crear -->
        <div
          class="w-full bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 p-5 flex flex-col gap-4">
          <!-- Wave decorativa azul -->
          <div class="absolute bottom-0 left-0 w-full leading-none pointer-events-none select-none" aria-hidden="true">
            <svg class="w-full" viewBox="0 0 400 40" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path class="animate-wave-1"
                d="M0,20 C60,35 120,5 180,20 C240,35 300,5 360,20 C380,26 390,28 400,20 L400,40 L0,40 Z" fill="#eff6ff"
                fill-opacity="0.8" />
              <path class="animate-wave-2"
                d="M0,28 C50,15 110,38 170,25 C230,12 290,36 350,24 C370,19 385,21 400,26 L400,40 L0,40 Z"
                fill="#dbeafe" fill-opacity="0.6" />
            </svg>
          </div>

          <div class="flex items-center gap-3 relative z-10">
            <div class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 class="text-sm font-semibold text-slate-800 leading-tight">Crear</h2>
              <p class="text-xs text-slate-400 mt-0.5">Nueva investigación</p>
            </div>
          </div>
          <RouterLink to="/research-form"
            class="block w-full px-4 py-2.5 bg-blue-600 text-white text-center text-sm rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition-all duration-150">
            Crear
          </RouterLink>
        </div>

        <!-- Card: Listar -->
        <div
          class="w-full bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 p-5 flex flex-col gap-4">
          <!-- Wave decorativa esmeralda -->
          <div class="absolute bottom-0 left-0 w-full leading-none pointer-events-none select-none" aria-hidden="true">
            <svg class="w-full" viewBox="0 0 400 40" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path class="animate-wave-2"
                d="M0,20 C60,35 120,5 180,20 C240,35 300,5 360,20 C380,26 390,28 400,20 L400,40 L0,40 Z" fill="#ecfdf5"
                fill-opacity="0.8" />
              <path class="animate-wave-1"
                d="M0,28 C50,15 110,38 170,25 C230,12 290,36 350,24 C370,19 385,21 400,26 L400,40 L0,40 Z"
                fill="#d1fae5" fill-opacity="0.6" />
            </svg>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <div>
              <h2 class="text-sm font-semibold text-slate-800 leading-tight">Listar</h2>
              <p class="text-xs text-slate-400 mt-0.5">Ver todas las investigaciones</p>
            </div>
          </div>
          <RouterLink to="/research-list"
            class="block w-full px-4 py-2.5 bg-emerald-600 text-white text-center text-sm rounded-lg font-medium hover:bg-emerald-700 active:scale-95 transition-all duration-150">
            Listar
          </RouterLink>
        </div>

      </aside>
    </main>
  </div>
</template>
<script setup lang="ts">
</script>

<style scoped>
/* Animación de flotación suave estilo WhatsApp */
@keyframes float-slow {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }

  33% {
    transform: translateY(-15px) rotate(2deg) scale(1.02);
  }

  66% {
    transform: translateY(-8px) rotate(-1deg) scale(0.98);
  }
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

/* Animación de partículas suaves */
@keyframes particle {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }

  25% {
    transform: translate(10px, -20px) scale(1.2);
    opacity: 0.5;
  }

  50% {
    transform: translate(-5px, -40px) scale(0.8);
    opacity: 0.2;
  }

  75% {
    transform: translate(15px, -30px) scale(1.1);
    opacity: 0.4;
  }
}

.animate-particle {
  animation: particle 12s ease-in-out infinite;
}
</style>