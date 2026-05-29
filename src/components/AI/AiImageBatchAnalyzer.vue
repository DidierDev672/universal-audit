<template>
  <section
    class="mx-auto w-full max-w-7xl space-y-6 rounded-2xl bg-slate-50 p-4 sm:p-6"
  >
    <header
      class="rounded-[14px] border border-black/[0.07] bg-white relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-2"
    >
      <div class="px-5 pt-6 pb-5 flex items-center justify-between">
        <!-- Z① LÍNEA SUPERIOR: marca (izq) · badge (der) -->
        <div class="flex items-center gap-2.5">
          <!-- Icono clinico -->
          <div
            class="w-9 h-9 bg-[#f0faf6] border border-[#0d9e6e]/[0.15] rounded-[10px] flex items-center justify-center shrink-0"
          >
            <svg
              class="w-[17px] h-[17px] text-[#0d9e6e]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h1
              class="text-[16px] font-semibold text-[#1d1d1f] tracking-tight leading-snug"
            >
              Analizador IA de imagenes
            </h1>
            <p class="text-[11px] text-[#86868b] mt-0.5 tracking-tight">
              Seleccione multiples imagenes, carguelas de forma segura al
              sistema y genere un analisis asistido por IA con registro
              individual para cada estudio.
            </p>
          </div>
        </div>
        <!-- Badge certificación — ancla derecha del Z -->
        <div
          class="inline-flex items-center gap-1.5 shrink-0 text-[10px] font-medium text-[#0d9e6e] bg-[#f0faf6] border border-[#0d9e6e]/[0.15] px-2.5 py-1 rounded-full"
        >
          <svg
            class="w-2.5 h-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          Certificado clínico
        </div>
      </div>

      <!-- Z② DIAGONAL: separador + descripción -->
      <div
        class="h-px bg-gradient-to-r from-black/[0.06] to-transparent mb-3"
      ></div>
      <p
        class="text-[12px] text-[#6e6e73] leading-relaxed tracking-tight max-w-xl"
      >
        Carga imágenes diagnósticas de forma segura, almacénalas en el sistema y
        genera un análisis asistido por IA con registro individual para cada
        estudio.
      </p>

      <!-- Z③ LÍNEA INFERIOR: pasos del flujo -->
    </header>

    <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <article
        class="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <label class="block">
          <span
            class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Paciente
          </span>
          <input
            v-model="patientName"
            type="text"
            placeholder="Nombre del paciente"
            class="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <div
          class="rounded-[14px] border border-black/[0.07] bg-white relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-3"
        >
          <button
            type="button"
            class="w-full inline-flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-[9px] bg-[#f0faf6] border border-[#0d9e6e]/[0.18] text-[12.5px] font-medium text-[#0d9e6e] hover:bg-[#e6f7f0] transition-colors duration-100"
            @click="togglePatientsPanel"
          >
            <span class="flex items-center gap-2">
              <svg
                class="w-[14px] h-[14px] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {{
                showPatientsPanel
                  ? "Ocultar pacientes"
                  : "Buscar pacientes registrados"
              }}
            </span>
            <svg
              class="w-3.5 h-3.5 shrink-0 transition-transform duration-150"
              :class="showPatientsPanel ? 'rotate-180' : ''"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div v-if="showPatientsPanel" class="mt-3 space-y-2.5">
            <!-- Busqueda -->
            <div class="relative">
              <svg
                class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#aeaeb2] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                v-model="patientSearch"
                type="search"
                placeholder="Buscar por nombre o documento..."
                class="h-9 w-full rounded-[9px] border border-black/[0.09] pl-8 pr-3 text-[12.5px] text-[#1d1d1f] placeholder-[#c7c7cc] bg-[#fafafa] focus:bg-white focus:border-[#0d9e6e] focus:outline-none focus:shadow-[0_0_0_3px_rgba(13,158,110,0.08)] transition-all duration-100"
              />
            </div>

            <!-- Lista de pacientes -->
            <div
              class="max-h-[180px] overflow-y-auto rounded-[10px] border border-black/[0.06] bg-white divide-y divide-black/[0.04]"
            >
              <label
                v-for="patient in filteredPatients"
                :key="patient.id"
                class="flex cursor-pointer items-center gap-2.5 px-3 py-2.5 hover:bg-[#f0faf6] transition-colors duration-100 last:rounded-b-[10px]"
              >
                <!-- Avatar con iniciales -->
                <div
                  class="w-7 h-7 rounded-full bg-[#f0faf6] flex items-center justify-content text-[11px] font-semibold text-[#0d9e6e] shrink-0 flex items-center justify-center"
                >
                  {{ patient.fullName?.slice(0, 2).toUpperCase() }}
                </div>
                <span class="min-w-0 flex justify-between items-center w-full">
                  <div class="flex flex-col gap-1">
                    <span
                      class="block text-[12.5px] font-medium text-[#1d1d1f] tracking-tight truncate"
                      >{{ patient.fullName }}</span
                    >
                    <span
                      class="block text-[11px] text-[#aeaeb2] tracking-tight"
                      >{{ patient.documentType }}
                      {{ patient.documentNumber }}</span
                    >
                  </div>
                </span>
                <input
                  type="checkbox"
                  class="w-4 h-4 rounded-[4px] border-black/[0.15] accent-[#0d9e6e] shrink-0 cursor-pointer"
                  :checked="selectedPatientIds.has(patient.id)"
                  @change="togglePatientSelection(patient.id)"
                />
              </label>
              <p
                v-if="!loadingPatients && filteredPatients.length === 0"
                class="px-3 py-5 text-center text-[12px] text-[#aeaeb2]"
              >
                No se encontraron pacientes.
              </p>
              <p
                v-if="loadingPatients"
                class="px-3 py-5 text-center text-[12px] text-[#aeaeb2] animate-pulse"
              >
                Cargando pacientes...
              </p>
            </div>

            <!-- Pacientes seleccionados -->
            <div
              v-if="selectedPatients.length > 0"
              class="flex items-start gap-2 rounded-[9px] bg-[#f0faf6] border border-[#0d9e6e]/[0.18] px-3 py-2.5 text-[11.5px] text-[#0d9e6e] leading-relaxed"
            >
              <svg
                class="w-3.5 h-3.5 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="flex-1 min-w-0 truncate">
                Seleccionados:
                <strong>{{
                  selectedPatients.map((p) => p.fullName).join(", ")
                }}</strong>
              </span>
              <span v-if="selectedPatients.length > 1" class="opacity-70">
                (se asignara el primero al guardar imagenes)
              </span>
            </div>

            <!-- Link creación manual -->
            <button
              type="button"
              class="text-[11.5px] text-[#aeaeb2] hover:text-[#0d9e6e] transition-colors duration-100 tracking-tight bg-none border-none p-0 cursor-pointer text-left w-full"
              @click="showManualCreate = !showManualCreate"
            >
              {{
                showManualCreate
                  ? "Cancelar creacion manual"
                  : "Paciente no registrado? Crear manualmente"
              }}
            </button>

            <!-- Formulario creación manual -->
            <div
              v-if="showManualCreate"
              class="grid gap-2 rounded-[10px] border border-black/[0.06] bg-[#fafafa] p-3"
            >
              <input
                v-model="manualPatient.fullName"
                type="text"
                placeholder="Nombre completo *"
                class="h-9 w-full rounded-[8px] border border-black/[0.09] px-3 text-[12.5px] text-[#1d1d1f] placeholder-[#c7c7cc] bg-white focus:border-[#0d9e6e] focus:outline-none focus:shadow-[0_0_0_3px_rgba(13,158,110,0.08)] transition-all duration-100"
              />
              <div class="grid gap-2 sm:grid-cols-2">
                <input
                  v-model="manualPatient.documentType"
                  type="text"
                  placeholder="Tipo documento"
                  class="h-9 w-full rounded-[8px] border border-black/[0.09] px-3 text-[12.5px] text-[#1d1d1f] placeholder-[#c7c7cc] bg-white focus:border-[#0d9e6e] focus:outline-none focus:shadow-[0_0_0_3px_rgba(13,158,110,0.08)] transition-all duration-100"
                />
                <input
                  v-model="manualPatient.documentNumber"
                  type="text"
                  placeholder="Numero documento"
                  class="h-9 w-full rounded-[8px] border border-black/[0.09] px-3 text-[12.5px] text-[#1d1d1f] placeholder-[#c7c7cc] bg-white focus:border-[#0d9e6e] focus:outline-none focus:shadow-[0_0_0_3px_rgba(13,158,110,0.08)] transition-all duration-100"
                />
              </div>
              <input
                v-model="manualPatient.birthDate"
                type="date"
                class="h-9 w-full rounded-[8px] border border-black/[0.09] px-3 text-[12.5px] text-[#1d1d1f] placeholder-[#c7c7cc] bg-white focus:border-[#0d9e6e] focus:outline-none focus:shadow-[0_0_0_3px_rgba(13,158,110,0.08)] transition-all duration-100"
              />
              <button
                type="button"
                :disabled="creatingPatient"
                class="h-9 inline-flex items-center justify-center rounded-[8px] bg-[#0d9e6e] hover:bg-[#0a8a5f] text-[12.5px] font-medium text-white tracking-tight hover:-translate-y-px hover:shadow-[0_4px_10px_rgba(13,158,110,0.2)] active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none transition-all duration-100"
                @click="createManualPatient"
              >
                {{
                  creatingPatient
                    ? "Creando..."
                    : "Crear paciente y seleccionarlo"
                }}
              </button>
            </div>
          </div>
        </div>

        <label
          class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-black/[0.10] bg-[#fafafa] py-7 text-center hover:border-[#0d9e6e]/40 hover:bg-[#f0faf6]/60 transition-all duration-150"
        >
          <!-- Icono clinico -->
          <div
            class="w-9 h-9 bg-[#f0faf6] border border-[#0d9e6e]/[0.12] rounded-[10px] flex items-center justify-center mb-1"
          >
            <svg
              class="w-[17px] h-[17px] text-[#0d9e6e]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          </div>
          <span class="text-[13px] font-medium text-[#1d1d1f] tracking-tight">
            Seleccionar multiples imagenes
          </span>
          <span class="text-[11px] text-[#aeaeb2] tracking-tight"
            >PNG, JPG, JPEG, WEBP, GIF, BMP</span
          >

          <!-- Badge -->
          <div
            class="inline-flex items-center gap-1 mt-0.5 text-[10px] text-[#0d9e6e] bg-[#f0faf6] border border-[#0d9e6e]/[0.15] px-2 py-0.5 rounded-full"
          >
            <svg
              class="w-2.5 h-2.5"
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
            Múltiples archivos
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            class="sr-only"
            @change="onPickFiles"
          />
        </label>

        <ul
          v-if="selectedImages.length"
          class="mt-2.5 max-h-[200px] overflow-y-auto rounded-[10px] border border-black/[0.06] bg-white divide-y divide-black/[0.04]"
        >
          <li
            v-for="(image, idx) in selectedImages"
            :key="fileKey(image)"
            class="flex items-center gap-2.5 px-3 py-2"
          >
            <!-- Thumbnail icono -->
            <div
              class="w-7 h-7 bg-[#f0faf6] border border-[#0d9e6e]/[0.12] rounded-[6px] flex items-center justify-center shrink-0"
            >
              <svg
                class="w-[13px] h-[13px] text-[#0d9e6e]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span
              class="min-w-0 flex-1 truncate text-[12px] text-[#1d1d1f] tracking-tight"
              >{{ image.name }}</span
            >
            <span class="text-[10.5px] text-[#aeaeb2] shrink-0 tabular-nums"
              >{{ (image.size / 1024).toFixed(1) }} KB</span
            >
            <button
              type="button"
              class="text-[11px] text-[#aeaeb2] hover:text-[#ff3b30] hover:bg-[#ff3b30]/[0.06] rounded-[5px] px-1.5 py-1 transition-all duration-100 shrink-0"
              @click="removeImage(idx)"
            >
              Quitar
            </button>
          </li>
        </ul>
      </article>

      <article
        class="rounded-[14px] border border-black/[0.07] bg-white relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4"
      >
        <div class="px-5 pt-6 pb-5 space-y-4">
          <!-- Z① LÍNEA SUPERIOR: título (izq) · badge estado (der) -->
          <h2 class="text-[13px] font-semibold text-[#1d1d1f] tracking-tight">
            Acciones
          </h2>
          <span
            class="text-[10px] font-medium text-[#0d9e6e] bg-[#f0faf6] border border-[#0d9e6e]/[0.15] px-2 py-0.5 rounded-full"
          >
            {{ savedAnalysisCount }} análisis
          </span>
        </div>
        <!-- Z② DIAGONAL: métricas de contexto en grid -->
        <div class="grid grid-cols-3 gap-1.5">
          <div
            class="bg-[#fafafa] border border-black/[0.05] rounded-[9px] px-2 py-2.5 text-cente"
          >
            <p
              class="text-[18px] font-semibold text-[#1d1d1f] leading-none tracking-tight tabular-nums"
            >
              {{ selectedImages.length }}
            </p>
            <p
              class="text-[10px] text-[#aeaeb2] mt-1 leading-tight tracking-tight"
            >
              Selec&shy;cionadas
            </p>
          </div>
          <div
            class="border border-black/[0.05] rounded-[9px] px-2 py-2.5 text-center"
            :class="storedUploads.length > 0 ? 'bg-[#f0faf6]' : 'bg-[#fafafa]'"
          >
            <p
              class="text-[18px] font-semibold leading-none tracking-tight tabular-nums"
              :class="
                storedUploads.length > 0 ? 'text-[#0d9e6e]' : 'text-[#1d1d1f]'
              "
            >
              {{ storedUploads.length }}
            </p>
            <p
              class="text-[10px] text-[#aeaeb2] mt-1 leading-tight tracking-tight"
            >
              Almace&shy;nadas
            </p>
          </div>

          <div
            class="bg-[#fafafa] border border-black/[0.05] rounded-[9px] px-2 py-2.5 text-center"
          >
            <p
              class="text-[18px] font-semibold text-[#1d1d1f] leading-none tracking-tight tabular-nums"
            >
              {{ savedAnalysisCount }}
            </p>
            <p
              class="text-[10px] text-[#aeaeb2] mt-1 leading-tight tracking-tight"
            >
              Análisis guardados
            </p>
          </div>
        </div>

        <!-- Z③ LÍNEA INFERIOR: acciones -->
        <div class="space-y-2 mt-2">
          <!-- Almacenar — acción secundaria -->
          <button
            type="button"
            :disabled="!canStore || storing"
            class="w-full inline-flex items-center justify-between px-3.5 py-[10px] rounded-[9px] bg-[#fafafa] border border-black/[0.08] text-[12.5px] font-medium text-[#3a3a3c] tracking-tight hover:bg-[#f0faf6] hover:border-[#0d9e6e]/[0.20] transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed group"
            @click="storeImages"
          >
            {{ storing ? "Almacenando..." : "Almacenar imagenes" }}
            <svg
              class="w-3.5 h-3.5 text-[#aeaeb2] group-hover:text-[#0d9e6e] shrink-0 transition-colors duration-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          </button>
          <!-- Analizar con IA — acción primaria -->
          <button
            type="button"
            :disabled="!canAnalyze || analyzing"
            class="w-full inline-flex items-center justify-between px-3.5 py-[10px] rounded-[9px] bg-[#0d9e6e] hover:bg-[#0a8a5f] text-white text-[12.5px] font-medium tracking-tight hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(13,158,110,0.25)] active:translate-y-0 active:shadow-none transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
            @click="analyzeStoredImages"
          >
            <span class="flex items-center gap-2">
              <!-- Mini icono IA -->
              <span
                class="w-[22px] h-[22px] bg-white/15 rounded-[6px] flex items-center justify-center shrink-0"
              >
                <svg
                  class="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </span>
              {{ analyzing ? "Analizando..." : "Analizar con IA" }}
            </span>
            <svg
              class="w-3.5 h-3.5 text-white/60 shrink-0"
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
          <!-- Hint contextual -->
          <p
            class="text-center text-[10.5px] text-[#aeaeb2] leading-relaxed tracking-tight pt-0.5"
          >
            Almacena primero las imágenes<br />para habilitar el análisis con IA
          </p>
        </div>
      </article>
    </div>

    <p
      v-if="message"
      class="rounded-xl border px-4 py-3 text-sm"
      :class="
        messageType === 'error'
          ? 'border-red-200 bg-red-50 text-red-700'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
      "
    >
      {{ message }}
    </p>

    <Teleport to="body">
      <Transition name="app-modal">
        <div v-if="analysisModalOpen" class="fixed inset-0 z-50">
          <div
            class="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            @click="closeAnalysisModal"
          ></div>
          <div class="absolute inset-0 p-4 sm:p-6" @click.self="closeAnalysisModal">
            <div
              class="mx-auto flex h-full max-h-[92vh] w-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl"
              :class="analysisModalExpanded ? 'max-w-[98vw]' : 'max-w-4xl'"
            >
              <!-- Z1: cabecera superior -->
              <header
                class="flex items-start justify-between gap-3 border-b border-black/[0.06] px-5 py-4"
              >
                <div class="min-w-0">
                  <p class="text-[11px] font-medium uppercase tracking-wide text-[#0d9e6e]">
                    Resultado IA
                  </p>
                  <h3 class="truncate text-[17px] font-semibold text-[#1d1d1f]">
                    {{ currentUploadForAnalysis?.original_filename || "Análisis clínico" }}
                  </h3>
                  <p class="text-[11px] text-[#86868b]">
                    Paciente: {{ currentUploadForAnalysis?.patient_name || patientName }}
                  </p>
                </div>
                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    class="rounded-md px-2 py-1 text-[11px] text-[#3a3a3c] hover:bg-black/[0.04]"
                    @click="toggleAnalysisModalExpand"
                  >
                    {{ analysisModalExpanded ? "Contraer" : "Expandir" }}
                  </button>
                  <button
                    type="button"
                    class="rounded-md px-2 py-1 text-[11px] text-[#3a3a3c] hover:bg-black/[0.04]"
                    @click="closeAnalysisModal"
                  >
                    Cerrar
                  </button>
                </div>
              </header>

              <!-- Z2: diagonal de lectura: contenido principal -->
              <section
                class="ai-analysis-markdown min-h-0 flex-1 overflow-y-auto px-5 py-4 text-[13px] leading-6 text-[#3a3a3c]"
                v-html="renderedAnalysisHtml"
              ></section>

              <!-- Z3: barra inferior de acciones -->
              <footer
                class="flex flex-col gap-2 border-t border-black/[0.06] px-5 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <p
                  v-if="modalMessage"
                  class="text-[11.5px]"
                  :class="modalMessageType === 'error' ? 'text-red-600' : 'text-[#0d9e6e]'"
                >
                  {{ modalMessage }}
                </p>
                <div class="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    :disabled="regeneratingAnalysis"
                    class="rounded-[9px] border border-black/[0.1] bg-white px-3 py-2 text-[12px] font-medium text-[#3a3a3c] hover:bg-[#fafafa] disabled:opacity-50"
                    @click="regenerateCurrentAnalysis"
                  >
                    {{ regeneratingAnalysis ? "Regenerando..." : "Regenerar análisis" }}
                  </button>
                  <button
                    type="button"
                    :disabled="savingAnalysis"
                    class="rounded-[9px] bg-[#0d9e6e] px-3 py-2 text-[12px] font-medium text-white hover:bg-[#0a8a5f] disabled:opacity-50"
                    @click="saveCurrentAnalysis"
                  >
                    {{ savingAnalysis ? "Guardando..." : "Guardar análisis" }}
                  </button>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import MarkdownIt from "markdown-it";
import { useAuthStore } from "@/core/login/presentation/store/authStore";
import {
  uploadAiImagesViaApi,
  type AiDocumentUploadApiRow,
} from "@/services/aiDocumentUploadsApi";
import {
  GEMINI_MODEL_NAME,
  saveAiDocumentAnalysis,
} from "@/services/aiDocumentAnalysesApi";
import { useGetGenerativeModelGP } from "@/shared/service/useGetGenerativeModelGP";
import {
  createPatientManual,
  listPatients,
  type PatientSummary,
} from "@/services/patientsApi";

const auth = useAuthStore();

const patientName = ref("");
const selectedImages = ref<File[]>([]);
const storedUploads = ref<AiDocumentUploadApiRow[]>([]);
const savedAnalysisCount = ref(0);
const storing = ref(false);
const analyzing = ref(false);
const message = ref("");
const messageType = ref<"ok" | "error">("ok");
const showPatientsPanel = ref(false);
const patients = ref<PatientSummary[]>([]);
const selectedPatientIds = ref<Set<string>>(new Set());
const patientSearch = ref("");
const loadingPatients = ref(false);
const showManualCreate = ref(false);
const creatingPatient = ref(false);
const manualPatient = ref({
  fullName: "",
  documentType: "",
  documentNumber: "",
  birthDate: "",
});

const filteredPatients = computed(() => {
  const q = patientSearch.value.trim().toLowerCase();
  if (!q) return patients.value;
  return patients.value.filter((p) =>
    `${p.fullName} ${p.documentType} ${p.documentNumber}`
      .toLowerCase()
      .includes(q),
  );
});

const selectedPatients = computed(() =>
  patients.value.filter((p) => selectedPatientIds.value.has(p.id)),
);

const primarySelectedPatient = computed(
  () => selectedPatients.value[0] ?? null,
);

const canStore = computed(
  () => selectedImages.value.length > 0 && patientName.value.trim().length >= 2,
);
const canAnalyze = computed(() => storedUploads.value.length > 0);
const analysisModalOpen = ref(false);
const analysisModalExpanded = ref(false);
const currentUploadForAnalysis = ref<AiDocumentUploadApiRow | null>(null);
const currentAnalysisText = ref("");
const regeneratingAnalysis = ref(false);
const savingAnalysis = ref(false);
const modalMessage = ref("");
const modalMessageType = ref<"ok" | "error">("ok");

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
});

const renderedAnalysisHtml = computed(() =>
  currentAnalysisText.value
    ? md.render(currentAnalysisText.value)
    : "<p>No hay análisis para mostrar.</p>",
);

function fileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function onPickFiles(event: Event) {
  const input = event.target as HTMLInputElement;
  const picked = input.files ? Array.from(input.files) : [];
  const valid = picked.filter((file) => file.type.startsWith("image/"));
  selectedImages.value = [...selectedImages.value, ...valid];
  message.value = "";
  input.value = "";
}

function removeImage(index: number) {
  selectedImages.value.splice(index, 1);
}

async function togglePatientsPanel() {
  showPatientsPanel.value = !showPatientsPanel.value;
  if (!showPatientsPanel.value || patients.value.length > 0) return;
  loadingPatients.value = true;
  try {
    patients.value = await listPatients();
  } catch (error) {
    messageType.value = "error";
    message.value =
      error instanceof Error
        ? error.message
        : "Error al cargar lista de pacientes";
  } finally {
    loadingPatients.value = false;
  }
}

function togglePatientSelection(patientId: string) {
  const next = new Set(selectedPatientIds.value);
  if (next.has(patientId)) next.delete(patientId);
  else next.add(patientId);
  selectedPatientIds.value = next;

  const first = patients.value.find((p) => next.has(p.id));
  if (first) {
    patientName.value = first.fullName;
  }
}

async function createManualPatient() {
  if (!manualPatient.value.fullName.trim()) {
    messageType.value = "error";
    message.value = "El nombre es obligatorio para crear el paciente.";
    return;
  }
  creatingPatient.value = true;
  try {
    const created = await createPatientManual({
      fullName: manualPatient.value.fullName,
      documentType: manualPatient.value.documentType,
      documentNumber: manualPatient.value.documentNumber,
      birthDate: manualPatient.value.birthDate,
    });
    patients.value = [created, ...patients.value];
    selectedPatientIds.value = new Set([created.id]);
    patientName.value = created.fullName;
    manualPatient.value = {
      fullName: "",
      documentType: "",
      documentNumber: "",
      birthDate: "",
    };
    showManualCreate.value = false;
    messageType.value = "ok";
    message.value = `Paciente creado y seleccionado: ${created.fullName}.`;
  } catch (error) {
    messageType.value = "error";
    message.value =
      error instanceof Error
        ? error.message
        : "Error al crear el paciente manualmente";
  } finally {
    creatingPatient.value = false;
  }
}

async function storeImages() {
  if (!canStore.value) return;
  storing.value = true;
  message.value = "";
  try {
    const uploads = await uploadAiImagesViaApi({
      files: selectedImages.value,
      patientName: patientName.value,
      patientId: primarySelectedPatient.value?.id ?? null,
      clientUserId: auth.currentUser?.id ?? null,
    });
    storedUploads.value = uploads;
    messageType.value = "ok";
    message.value = `${uploads.length} imagen(es) almacenada(s) correctamente.`;
  } catch (error) {
    messageType.value = "error";
    message.value =
      error instanceof Error ? error.message : "Error al almacenar imagenes";
  } finally {
    storing.value = false;
  }
}

function buildImageAnalysisPrompt(upload: AiDocumentUploadApiRow): string {
  return `Actua como un especialista clinico y analiza una imagen medica.

Datos de contexto:
- Nombre archivo: ${upload.original_filename}
- Tipo MIME: ${upload.mime_type}
- Paciente: ${upload.patient_name || "No especificado"}

Genera un analisis preliminar en espanol, estructurado con:
1) Observaciones visuales posibles
2) Hallazgos potenciales relevantes
3) Limitaciones del analisis (si no hay contexto clinico)
4) Recomendaciones de validacion profesional

El resultado debe ser claro, breve y util para historia clinica.`;
}

async function generateAnalysisForUpload(upload: AiDocumentUploadApiRow): Promise<string> {
  const prompt = buildImageAnalysisPrompt(upload);
  const content = String(await useGetGenerativeModelGP(prompt)).trim();
  if (!content) {
    throw new Error(`La IA no devolvio analisis para ${upload.original_filename}`);
  }
  return content;
}

function openAnalysisModal() {
  analysisModalOpen.value = true;
}

function closeAnalysisModal() {
  analysisModalOpen.value = false;
  analysisModalExpanded.value = false;
  modalMessage.value = "";
}

function toggleAnalysisModalExpand() {
  analysisModalExpanded.value = !analysisModalExpanded.value;
}

async function regenerateCurrentAnalysis() {
  const upload = currentUploadForAnalysis.value;
  if (!upload) return;
  regeneratingAnalysis.value = true;
  modalMessage.value = "";
  try {
    currentAnalysisText.value = await generateAnalysisForUpload(upload);
    modalMessageType.value = "ok";
    modalMessage.value = "Análisis regenerado correctamente.";
  } catch (error) {
    modalMessageType.value = "error";
    modalMessage.value =
      error instanceof Error ? error.message : "Error al regenerar el análisis.";
  } finally {
    regeneratingAnalysis.value = false;
  }
}

async function saveCurrentAnalysis() {
  const upload = currentUploadForAnalysis.value;
  const content = currentAnalysisText.value.trim();
  if (!upload || !content) return;

  savingAnalysis.value = true;
  modalMessage.value = "";
  try {
    await saveAiDocumentAnalysis({
      document_upload_id: upload.id,
      content,
      model: GEMINI_MODEL_NAME,
    });
    savedAnalysisCount.value += 1;
    modalMessageType.value = "ok";
    modalMessage.value = "Análisis guardado correctamente.";
    messageType.value = "ok";
    message.value = "Se guardó el análisis de imagen.";
  } catch (error) {
    modalMessageType.value = "error";
    modalMessage.value =
      error instanceof Error ? error.message : "Error al guardar el análisis.";
  } finally {
    savingAnalysis.value = false;
  }
}

async function analyzeStoredImages() {
  if (!canAnalyze.value) return;
  analyzing.value = true;
  message.value = "";

  try {
    const upload = storedUploads.value[0];
    if (!upload) {
      throw new Error("No hay imágenes almacenadas para analizar.");
    }
    currentUploadForAnalysis.value = upload;
    currentAnalysisText.value = await generateAnalysisForUpload(upload);
    openAnalysisModal();
    messageType.value = "ok";
    message.value =
      storedUploads.value.length > 1
        ? "Análisis generado para la primera imagen almacenada. Puedes guardarlo o regenerarlo en el modal."
        : "Análisis generado. Revísalo y guárdalo desde el modal.";
  } catch (error) {
    messageType.value = "error";
    message.value =
      error instanceof Error
        ? error.message
        : "Error al analizar y guardar resultados";
  } finally {
    analyzing.value = false;
  }
}
</script>

<style scoped>
.ai-analysis-markdown :deep(h1),
.ai-analysis-markdown :deep(h2),
.ai-analysis-markdown :deep(h3) {
  color: #1d1d1f;
  margin: 0.7em 0 0.4em;
}

.ai-analysis-markdown :deep(p),
.ai-analysis-markdown :deep(ul),
.ai-analysis-markdown :deep(ol) {
  margin: 0.45em 0;
}

.ai-analysis-markdown :deep(ul),
.ai-analysis-markdown :deep(ol) {
  padding-left: 1.15rem;
}
</style>
