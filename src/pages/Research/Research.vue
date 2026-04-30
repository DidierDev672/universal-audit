<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- Fondo con iconos animados estilo WhatsApp - 24 iconos temáticos -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <!-- SALUD AUDITIVA -->
      <!-- 1. Oído - bg-emerald-600 -->
      <div class="absolute top-[5%] left-[3%] w-10 h-10 text-emerald-600/40 animate-float-slow"
        style="animation-delay: 0s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      </div>

      <!-- 2. Audigrama - bg-blue-500 -->
      <div class="absolute top-[8%] right-[5%] w-9 h-9 text-blue-500/35 animate-float-slow"
        style="animation-delay: 1s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      </div>

      <!-- 3. Microfono - bg-rose-500 -->
      <div class="absolute top-[15%] left-[8%] w-8 h-8 text-rose-500/40 animate-float-slow"
        style="animation-delay: 2s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </div>

      <!-- 4. Sonido - bg-sky-400 -->
      <div class="absolute top-[12%] left-[25%] w-10 h-10 text-sky-400/30 animate-float-slow"
        style="animation-delay: 3s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      </div>

      <!-- 5. Frecuencia - bg-amber-600 -->
      <div class="absolute top-[20%] right-[12%] w-9 h-9 text-amber-600/35 animate-float-slow"
        style="animation-delay: 4s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>

      <!-- 6. Evaluacion - bg-gray-700 -->
      <div class="absolute top-[25%] left-[15%] w-8 h-8 text-gray-700/30 animate-float-slow"
        style="animation-delay: 0.5s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <!-- 7. Diagnostico - bg-emerald-900 -->
      <div class="absolute top-[30%] right-[8%] w-10 h-10 text-emerald-900/25 animate-float-slow"
        style="animation-delay: 1.5s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>

      <!-- 8. Audifono - bg-slate-500 -->
      <div class="absolute top-[35%] left-[5%] w-9 h-9 text-slate-500/35 animate-float-slow"
        style="animation-delay: 2.5s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </div>

      <!-- LITERATURA -->
      <!-- 9. Libro - bg-blue-900 -->
      <div class="absolute top-[40%] left-[20%] w-10 h-10 text-blue-900/30 animate-float-slow"
        style="animation-delay: 3.5s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>

      <!-- 10. Pluma - bg-amber-400 -->
      <div class="absolute top-[45%] right-[15%] w-8 h-8 text-amber-400/40 animate-float-slow"
        style="animation-delay: 4.5s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </div>

      <!-- 11. Manuscrito - bg-gray-400 -->
      <div class="absolute top-[50%] left-[10%] w-9 h-9 text-gray-400/35 animate-float-slow"
        style="animation-delay: 0.8s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>

      <!-- 12. Investigar - bg-rose-800 -->
      <div class="absolute top-[55%] right-[10%] w-10 h-10 text-rose-800/30 animate-float-slow"
        style="animation-delay: 1.8s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- 13. Biblioteca - bg-slate-800 -->
      <div class="absolute top-[60%] left-[25%] w-11 h-11 text-slate-800/25 animate-float-slow"
        style="animation-delay: 2.8s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      </div>

      <!-- 14. Cita - bg-emerald-400 -->
      <div class="absolute top-[65%] right-[20%] w-8 h-8 text-emerald-400/35 animate-float-slow"
        style="animation-delay: 3.8s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </div>

      <!-- 15. Clasico - bg-gray-900 -->
      <div class="absolute top-[70%] left-[3%] w-9 h-9 text-gray-900/20 animate-float-slow"
        style="animation-delay: 4.8s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>

      <!-- 16. Redaccion - bg-sky-400 -->
      <div class="absolute top-[75%] right-[5%] w-8 h-8 text-sky-400/40 animate-float-slow"
        style="animation-delay: 0.3s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      </div>

      <!-- CIENCIAS -->
      <!-- 17. Tubo en ensayo - bg-rose-400 -->
      <div class="absolute top-[80%] left-[15%] w-8 h-8 text-rose-400/35 animate-float-slow"
        style="animation-delay: 1.3s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>

      <!-- 18. Atomo - bg-blue-500 -->
      <div class="absolute top-[85%] right-[25%] w-10 h-10 text-blue-500/30 animate-float-slow"
        style="animation-delay: 2.3s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>

      <!-- 19. Microscopio - bg-emerald-600 -->
      <div class="absolute top-[88%] left-[30%] w-9 h-9 text-emerald-600/35 animate-float-slow"
        style="animation-delay: 3.3s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>

      <!-- 20. Molecula - bg-purple-500 -->
      <div class="absolute top-[82%] right-[8%] w-10 h-10 text-purple-500/30 animate-float-slow"
        style="animation-delay: 4.3s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>

      <!-- 21. Datos - bg-amber-600 -->
      <div class="absolute top-[90%] left-[5%] w-9 h-9 text-amber-600/35 animate-float-slow"
        style="animation-delay: 0.6s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      </div>

      <!-- 22. Global - bg-indigo-600 -->
      <div class="absolute top-[92%] right-[15%] w-10 h-10 text-indigo-600/25 animate-float-slow"
        style="animation-delay: 1.6s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <!-- 23. Hipotesis - bg-yellow-500 -->
      <div class="absolute top-[3%] left-[45%] w-9 h-9 text-yellow-500/40 animate-float-slow"
        style="animation-delay: 2.6s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>

      <!-- 24. Analisis - bg-teal-600 -->
      <div class="absolute top-[7%] right-[35%] w-10 h-10 text-teal-600/30 animate-float-slow"
        style="animation-delay: 3.6s;">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      </div>

      <!-- Partículas decorativas adicionales -->
      <div class="absolute w-2 h-2 bg-emerald-400/30 rounded-full animate-particle"
        style="top: 10%; left: 50%; animation-delay: 0s;"></div>
      <div class="absolute w-1.5 h-1.5 bg-blue-500/25 rounded-full animate-particle"
        style="top: 30%; left: 60%; animation-delay: 2s;"></div>
      <div class="absolute w-2 h-2 bg-rose-400/20 rounded-full animate-particle"
        style="top: 50%; left: 70%; animation-delay: 4s;"></div>
      <div class="absolute w-1 h-1 bg-amber-400/35 rounded-full animate-particle"
        style="top: 70%; left: 40%; animation-delay: 1s;"></div>
      <div class="absolute w-2.5 h-2.5 bg-slate-500/25 rounded-full animate-particle"
        style="top: 85%; left: 55%; animation-delay: 3s;"></div>
    </div>

    <!-- Contenido principal -->
    <div class="relative z-10 space-y-6">
      <!-- Header -->
      <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 class="text-3xl font-bold mb-1">Investigaciones en Salud Auditiva 📚</h2>
              <p class="text-white/90">Gestiona y consulta estudios científicos</p>
            </div>
          </div>
          <button @click="showForm = !showForm"
            class="hidden md:flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ showForm ? 'Ver Lista' : 'Nueva Investigación' }}
          </button>
        </div>
      </div>

      <!-- Mobile Toggle Button -->
      <button @click="showForm = !showForm"
        class="md:hidden w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ showForm ? 'Ver Lista' : 'Nueva Investigación' }}
      </button>

      <!-- Content Toggle -->
      <transition name="fade" mode="out-in">
        <!-- Research Form -->
        <div v-if="showForm" key="form">
          <ResearchForm @research-saved="handleResearchSaved" />
        </div>

        <!-- Research List -->
        <div v-else key="list" class="space-y-6">
          <!-- Search and Filters -->
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100">
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex-1 relative">
                <input v-model="searchQuery" type="text" placeholder="Buscar investigaciones..."
                  class="w-full pl-12 pr-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all" />
                <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Research Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="research in filteredResearches" :key="research.id"
              class="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-start gap-3">
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                      {{ research.name }}
                    </h3>
                  </div>
                </div>
              </div>

              <p class="text-sm text-gray-600 mb-4 line-clamp-3">
                {{ research.description }}
              </p>

              <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                <RouterLink :to="`/research-detail/${research.id}`"
                  class="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1">
                  Ver detalles
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredResearches.length === 0"
            class="bg-white rounded-2xl shadow-lg p-12 text-center border border-indigo-100">
            <div
              class="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">No se encontraron investigaciones</h3>
            <p class="text-gray-600 mb-6">Intenta con otros términos de búsqueda o crea una nueva investigación</p>
            <button @click="showForm = true"
              class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
              Nueva Investigación
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Researchform from './Researchform.vue';


// State
const showForm = ref(false);
const searchQuery = ref('');

// Mock data
const researches = ref([
  {
    id: 1,
    name: 'Efectos de la terapia de sonido en pacientes con tinnitus crónico',
    description: 'Estudio longitudinal de 12 meses evaluando la eficacia de diferentes frecuencias de sonido blanco en la reducción de síntomas de tinnitus en pacientes con pérdida auditiva neurosensorial.',
    author: 'Dr. Carlos Mendoza',
    date: '15 Feb 2024',
    status: 'Activo',
    category: 'Tinnitus'
  },
  {
    id: 2,
    name: 'Implantes cocleares en adultos mayores: Calidad de vida post-intervención',
    description: 'Análisis comparativo de mejoras en comprensión del habla y calidad de vida en pacientes mayores de 65 años con implantes cocleares versus audífonos convencionales.',
    author: 'Dra. María González',
    date: '10 Feb 2024',
    status: 'Activo',
    category: 'Implantes'
  },
  {
    id: 3,
    name: 'Prevención de pérdida auditiva inducida por ruido en trabajadores industriales',
    description: 'Programa de intervención y educación para reducir la incidencia de pérdida auditiva en entornos laborales de alta exposición a ruido.',
    author: 'Dr. Juan Pérez',
    date: '05 Feb 2024',
    status: 'Finalizado',
    category: 'Prevención'
  },
]);

// API call
const getResearches = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/v1/research');
    researches.value = response.data;
  } catch (error) {
    console.error('Error fetching researches:', error);
  }
};

// Call API on mount
onMounted(() => {
  getResearches();
});

// Computed
const filteredResearches = computed(() => {
  if (!searchQuery.value) return researches.value;

  const query = searchQuery.value.toLowerCase();
  return researches.value.filter(r =>
    r.name.toLowerCase().includes(query) ||
    r.description.toLowerCase().includes(query) ||
    r.author.toLowerCase().includes(query)
  );
});

// Methods
const handleResearchSaved = () => {
  showForm.value = false;
  // Aquí podrías recargar la lista de investigaciones
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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