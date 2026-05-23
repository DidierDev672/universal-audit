<template>
  <div
    class="ai-uploader-page mx-auto min-h-[calc(100dvh-8rem)] max-w-6xl px-4 py-6 sm:px-6 sm:py-8 bg-slate-50"
  >
    <header class="mb-8">
      <div class="flex items-start gap-4">
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div class="min-w-0">
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">
            Documentos clínicos
          </h1>
          <p class="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Sigue los tres pasos: elige el paciente, carga los archivos y confirma
            si deseas almacenar o analizar con IA.
          </p>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <!-- Paso 1: Paciente -->
        <section
          class="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
          aria-labelledby="paso-paciente-titulo"
        >
          <div class="flex items-start gap-4">
            <span
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              :class="
                pasoPacienteCompleto
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              "
            >
              1
            </span>
            <div class="min-w-0 flex-1">
              <h2
                id="paso-paciente-titulo"
                class="text-base font-semibold text-slate-900"
              >
                Seleccionar paciente
              </h2>
              <p class="mt-0.5 text-sm text-slate-500">
                Registrado en el sistema o captura manual de datos.
              </p>
            </div>
          </div>

          <div
            class="inline-flex rounded-xl bg-slate-100 p-1"
            role="tablist"
            aria-label="Tipo de paciente"
          >
            <button
              type="button"
              role="tab"
              :aria-selected="modoPaciente === 'registrado'"
              class="rounded-lg px-4 py-2 text-sm font-medium transition-all"
              :class="
                modoPaciente === 'registrado'
                  ? 'bg-white text-emerald-700 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
              "
              @click="cambiarModoPaciente('registrado')"
            >
              Registrado
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="modoPaciente === 'manual'"
              class="rounded-lg px-4 py-2 text-sm font-medium transition-all"
              :class="
                modoPaciente === 'manual'
                  ? 'bg-white text-emerald-700 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
              "
              @click="cambiarModoPaciente('manual')"
            >
              Manual
            </button>
          </div>

          <template v-if="modoPaciente === 'registrado'">
            <button
              type="button"
              class="flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-emerald-700 shadow-sm transition-all hover:border-emerald-400 hover:bg-emerald-50/50 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              @click="abrirModalPacientes"
            >
              <svg
                class="h-5 w-5 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Buscar paciente por nombre, documento o identificación
            </button>

            <div
              v-if="pacienteSeleccionado"
              class="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-5"
            >
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-slate-900">
                  {{ pacienteSeleccionado.fullName }}
                </p>
                <p class="mt-0.5 text-xs text-slate-500">
                  {{ pacienteSeleccionado.documentType }}
                  {{ pacienteSeleccionado.documentNumber }}
                  <template v-if="pacienteSeleccionado.birthDate">
                    · Nac. {{ pacienteSeleccionado.birthDate }}
                  </template>
                </p>
                <p
                  v-if="pacientesSeleccionados.length > 1"
                  class="mt-1 text-xs font-medium text-emerald-700"
                >
                  +{{ pacientesSeleccionados.length - 1 }} paciente(s) más
                  marcados (se usa el primero al subir)
                </p>
              </div>
            </div>

            <p v-else class="text-sm text-slate-500">
              Aún no hay paciente seleccionado.
            </p>

            <button
              v-if="pacientesSeleccionados.length > 0"
              type="button"
              class="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 transition-colors hover:text-rose-700"
              @click="limpiarPaciente"
            >
              <svg
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Quitar paciente
            </button>
          </template>

          <template v-else>
            <div class="space-y-4">
              <label class="block">
                <span class="mb-1.5 block text-xs font-medium text-slate-600">
                  Nombre completo <span class="text-rose-500">*</span>
                </span>
                <input
                  v-model="manualPaciente.fullName"
                  type="text"
                  placeholder="Ej: María López García"
                  class="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                />
              </label>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label class="block">
                  <span class="mb-1.5 block text-xs font-medium text-slate-600">
                    Tipo documento
                  </span>
                  <select
                    v-model="manualPaciente.documentType"
                    class="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value="">—</option>
                    <option value="CC">CC</option>
                    <option value="TI">TI</option>
                    <option value="PA">PA</option>
                    <option value="TE">TE</option>
                  </select>
                </label>
                <label class="block">
                  <span class="mb-1.5 block text-xs font-medium text-slate-600">
                    Número documento
                  </span>
                  <input
                    v-model="manualPaciente.documentNumber"
                    type="text"
                    class="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
              </div>
              <label class="block">
                <span class="mb-1.5 block text-xs font-medium text-slate-600">
                  Fecha de nacimiento
                </span>
                <input
                  v-model="manualPaciente.birthDate"
                  type="date"
                  class="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                />
              </label>
            </div>
          </template>
        </section>

        <!-- Paso 2: Documentos -->
        <section
          class="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
          :class="{ 'opacity-60 pointer-events-none': !pasoPacienteCompleto }"
          aria-labelledby="paso-documentos-titulo"
        >
          <div class="flex items-start gap-4">
            <span
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              :class="
                pasoDocumentosCompleto
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              "
            >
              2
            </span>
            <div>
              <h2
                id="paso-documentos-titulo"
                class="text-base font-semibold text-slate-900"
              >
                Cargar documentos
              </h2>
              <p class="mt-0.5 text-sm text-slate-500">
                Arrastra o selecciona PDF, DOC y DOCX (múltiples archivos).
              </p>
            </div>
          </div>

          <label
            class="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-14 transition-all"
            :class="
              arrastrando
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-slate-100'
            "
            @dragenter.prevent="arrastrando = true"
            @dragover.prevent="arrastrando = true"
            @dragleave.prevent="arrastrando = false"
            @drop.prevent="onDrop"
          >
            <svg
              class="h-10 w-10 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <span class="text-sm font-semibold text-slate-700">
              Arrastra archivos aquí o haz clic para subirlos
            </span>
            <span class="text-xs text-slate-500">
              PDF, DOC y DOCX — múltiples archivos permitidos
            </span>
            <input
              ref="fileInputRef"
              type="file"
              class="sr-only"
              multiple
              :accept="ACCEPT_MIME"
              :disabled="!pasoPacienteCompleto"
              @change="onFilePick"
            />
          </label>

          <button
            v-if="files.length > 0"
            type="button"
            class="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
            @click="abrirSelectorDocumentos"
          >
            + Agregar más documentos
          </button>

          <div
            v-if="files.length > 0"
            class="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Archivos en cola ({{ files.length }})
            </p>
            <ul class="max-h-48 space-y-2 overflow-y-auto">
              <li
                v-for="(f, i) in files"
                :key="claveArchivo(f)"
                class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
              >
                <svg
                  class="h-4 w-4 shrink-0 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span class="min-w-0 flex-1 truncate text-sm text-slate-800">
                  {{ f.name }}
                </span>
                <span class="shrink-0 text-xs text-slate-500">
                  {{ (f.size / 1024).toFixed(1) }} KB
                </span>
                <button
                  type="button"
                  class="shrink-0 rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  title="Quitar"
                  @click="quitarDocumento(i)"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            </ul>
            <button
              type="button"
              class="text-xs font-medium text-slate-500 hover:text-slate-700"
              @click="limpiarSeleccion"
            >
              Vaciar selección
            </button>
          </div>
        </section>

        <!-- Paso 3: Confirmar -->
        <section
          class="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
          :class="{ 'opacity-60': !pasoPacienteCompleto }"
          aria-labelledby="paso-confirmar-titulo"
        >
          <div class="flex items-start gap-4">
            <span
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              :class="
                listoParaAnalisis
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              "
            >
              3
            </span>
            <div>
              <h2
                id="paso-confirmar-titulo"
                class="text-base font-semibold text-slate-900"
              >
                Confirmar acción
              </h2>
              <p class="mt-0.5 text-sm text-slate-500">
                Almacena en Storage o encola el análisis con IA.
              </p>
            </div>
          </div>

          <div
            v-if="documentosListos.length > 0"
            class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            {{ documentosListos.length }} documento(s) almacenado(s) y listos
            para analizar.
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              :disabled="files.length === 0 || !pacienteValido || almacenando"
              class="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              @click="almacenar"
            >
              <svg
                class="h-4 w-4 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              {{ almacenando ? "Almacenando…" : "Almacenar" }}
            </button>
            <button
              type="button"
              :disabled="documentosListos.length === 0 || analizando"
              class="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              @click="analizar"
            >
              <svg
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              {{ analizando ? "Encolando análisis…" : "Analizar con IA" }}
            </button>
          </div>
        </section>

        <Transition name="fade">
          <div
            v-if="mensaje"
            class="flex items-start gap-2 rounded-xl border p-4 text-sm leading-6"
            :class="
              mensajeTipo === 'error'
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-emerald-200 bg-emerald-50 text-emerald-800'
            "
            role="status"
          >
            <svg
              class="mt-0.5 h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="
                  mensajeTipo === 'error'
                    ? 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    : 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                "
              />
            </svg>
            {{ mensaje }}
          </div>
        </Transition>
      </div>

      <!-- Checklist lateral -->
      <aside
        class="h-fit space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6"
        aria-label="Estado del flujo"
      >
        <h2 class="text-sm font-semibold text-slate-900">Estado del proceso</h2>
        <ul class="space-y-3">
          <li
            v-for="item in checklistFlujo"
            :key="item.id"
            class="flex items-start gap-2.5 text-sm font-medium"
            :class="item.done ? 'text-emerald-700' : 'text-slate-500'"
          >
            <span
              class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs"
              :class="
                item.done
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'border border-slate-300 text-slate-400'
              "
            >
              <template v-if="item.done">✓</template>
              <template v-else>○</template>
            </span>
            {{ item.label }}
          </li>
        </ul>
        <p
          v-if="pasoPacienteCompleto && !pasoDocumentosCompleto"
          class="text-xs leading-5 text-slate-500"
        >
          Completa el paso 2 para habilitar el almacenamiento.
        </p>
        <p
          v-else-if="documentosListos.length === 0 && files.length > 0"
          class="text-xs leading-5 text-slate-500"
        >
          Pulsa «Almacenar» antes de analizar con IA.
        </p>
      </aside>
    </div>

    <!-- Modal buscar pacientes -->
    <Teleport to="body">
      <Transition name="app-modal">
        <div
          v-if="modalPacientesAbierto"
          class="app-modal-root"
        >
          <div
            class="app-modal-backdrop"
            aria-hidden="true"
            @click="cerrarModalPacientes"
          />
          <div
            class="app-modal-scrim app-modal-scrim--sheet"
            @click.self="cerrarModalPacientes"
          >
            <div
              class="app-modal-panel app-modal-panel--sheet max-w-lg w-full max-h-[85vh] flex flex-col rounded-2xl border border-black/8 bg-white shadow-xl"
              role="dialog"
              aria-labelledby="modal-pacientes-titulo"
              aria-modal="true"
              @click.stop
            >
              <header
                class="app-modal-header px-5 py-4 border-b border-black/6 flex items-start justify-between gap-3"
              >
            <div class="min-w-0">
              <h3
                id="modal-pacientes-titulo"
                class="text-[14px] font-semibold text-[#1d1d1f]"
              >
                Pacientes registrados
              </h3>
              <p class="text-[11px] text-[#86868b] mt-0.5">
                Marca los pacientes que deseas asociar al documento
              </p>
            </div>
            <button
              type="button"
              class="text-[#aeaeb2] hover:text-[#1d1d1f] p-1 shrink-0"
              aria-label="Cerrar"
              @click="cerrarModalPacientes"
            >
              ✕
            </button>
              </header>

              <div class="app-modal-body flex min-h-0 flex-1 flex-col">
                <div class="space-y-2 border-b border-black/6 px-5 py-3">
                  <div class="relative">
                    <input
                      v-model="filtroModalPaciente"
                      type="text"
                      placeholder="Filtrar por nombre o documento..."
                      class="w-full rounded-[9px] border border-black/10 bg-[#fafafa] px-3 py-2.5 pl-9 text-[12px] focus:border-[#0d9e6e]/50 focus:outline-none focus:ring-2 focus:ring-[#0d9e6e]/10"
                    />
                    <svg
                      class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aeaeb2]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <div
                    v-if="pacientesModalFiltrados.length > 0"
                    class="flex items-center justify-between gap-2"
                  >
                    <span class="text-[11px] text-[#86868b]">
                      {{ idsPacientesMarcados.size }} de
                      {{ pacientesModalFiltrados.length }} marcados
                    </span>
                    <button
                      type="button"
                      class="text-[11px] text-[#0d9e6e] hover:underline"
                      @click="alternarTodosPacientesModal"
                    >
                      {{
                        todosMarcadosEnFiltro
                          ? "Desmarcar visibles"
                          : "Marcar visibles"
                      }}
                    </button>
                  </div>
                </div>

                <div class="min-h-0 flex-1 overflow-y-auto px-2 py-2">
            <p
              v-if="cargandoListaPacientes"
              class="px-3 py-6 text-center text-[12px] text-[#86868b]"
            >
              Cargando pacientes...
            </p>
            <p
              v-else-if="errorListaPacientes"
              class="px-3 py-6 text-center text-[12px] text-red-600"
            >
              {{ errorListaPacientes }}
            </p>
            <p
              v-else-if="listaModalPacientes.length === 0"
              class="px-3 py-6 text-center text-[12px] text-[#86868b]"
            >
              No hay pacientes registrados en el sistema.
            </p>
            <p
              v-else-if="pacientesModalFiltrados.length === 0"
              class="px-3 py-6 text-center text-[12px] text-[#86868b]"
            >
              Ningún paciente coincide con el filtro.
            </p>
            <ul
              v-else
              class="divide-y divide-black/[0.04]"
            >
              <li
                v-for="p in pacientesModalFiltrados"
                :key="p.id"
              >
                <label
                  class="flex items-start gap-3 px-3 py-2.5 cursor-pointer hover:bg-[#f0faf6] rounded-[9px] transition-colors"
                  :class="
                    idsPacientesMarcados.has(p.id) ? 'bg-[#f0faf6]' : ''
                  "
                >
                  <input
                    type="checkbox"
                    class="mt-0.5 w-4 h-4 shrink-0 rounded border-black/20 text-[#0d9e6e] focus:ring-[#0d9e6e]/30"
                    :checked="idsPacientesMarcados.has(p.id)"
                    @change="togglePacienteModal(p.id)"
                  />
                  <span class="min-w-0 flex-1">
                    <span class="text-[12px] font-medium text-[#1d1d1f] block">
                      {{ p.fullName }}
                    </span>
                    <span class="text-[10.5px] text-[#86868b]">
                      {{ p.documentType }} {{ p.documentNumber }}
                      <template v-if="p.birthDate"> · {{ p.birthDate }}</template>
                    </span>
                  </span>
                </label>
              </li>
            </ul>
                </div>
              </div>

              <footer
                class="app-modal-footer px-5 py-3 border-t border-black/6 flex items-center justify-end gap-2"
              >
                <button
                  type="button"
                  class="app-modal-btn py-2 px-4 text-[12px] font-medium text-[#3a3a3c] border border-black/10 rounded-[9px] hover:bg-[#fafafa]"
                  @click="cerrarModalPacientes"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  :disabled="idsPacientesMarcados.size === 0"
                  class="app-modal-btn py-2 px-4 text-[12px] font-medium text-white bg-[#0d9e6e] rounded-[9px] hover:bg-[#0a8a5f] disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="confirmarPacientesModal"
                >
              Confirmar
              <template v-if="idsPacientesMarcados.size > 0">
                ({{ idsPacientesMarcados.size }})
              </template>
                </button>
              </footer>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "@/core/login/presentation/store/authStore";
import {
  inferDocumentFileType,
  queueAiAnalysisForDocuments,
  storeAiDocument,
} from "@/services/aiDocumentsService";
import type {
  AiDocumentPatientInfo,
  AiDocumentUploadRow,
} from "@/services/aiDocumentsService";
import {
  listPatients,
  type PatientSummary,
} from "@/services/patientsApi";

const ACCEPT_MIME =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const auth = useAuthStore();

const fileInputRef = ref<HTMLInputElement | null>(null);
const files = ref<File[]>([]);
const arrastrando = ref(false);
const almacenando = ref(false);
const analizando = ref(false);
const documentosListos = ref<AiDocumentUploadRow[]>([]);

const mensaje = ref("");
const mensajeTipo = ref<"ok" | "error">("ok");

type ModoPaciente = "registrado" | "manual";
const modoPaciente = ref<ModoPaciente>("registrado");
const pacientesSeleccionados = ref<PatientSummary[]>([]);

const modalPacientesAbierto = ref(false);
const listaModalPacientes = ref<PatientSummary[]>([]);
const filtroModalPaciente = ref("");
const idsPacientesMarcados = ref<Set<string>>(new Set());
const cargandoListaPacientes = ref(false);
const errorListaPacientes = ref("");

const pacienteSeleccionado = computed(
  () => pacientesSeleccionados.value[0] ?? null,
);

const pacientesModalFiltrados = computed(() => {
  const q = filtroModalPaciente.value.trim().toLowerCase();
  if (!q) return listaModalPacientes.value;
  return listaModalPacientes.value.filter((p) => {
    const texto = [
      p.fullName,
      p.documentType,
      p.documentNumber,
      p.birthDate,
    ]
      .join(" ")
      .toLowerCase();
    return texto.includes(q);
  });
});

const todosMarcadosEnFiltro = computed(() => {
  const visibles = pacientesModalFiltrados.value;
  if (visibles.length === 0) return false;
  return visibles.every((p) => idsPacientesMarcados.value.has(p.id));
});

const manualPaciente = ref({
  fullName: "",
  documentType: "",
  documentNumber: "",
  birthDate: "",
});

const pacienteValido = computed(() => {
  if (modoPaciente.value === "registrado") {
    return pacientesSeleccionados.value.length > 0;
  }
  return manualPaciente.value.fullName.trim().length >= 2;
});

const pasoPacienteCompleto = computed(() => pacienteValido.value);

const pasoDocumentosCompleto = computed(
  () => files.value.length > 0 || documentosListos.value.length > 0,
);

const listoParaAnalisis = computed(() => documentosListos.value.length > 0);

const checklistFlujo = computed(() => [
  {
    id: "paciente",
    label: "Paciente seleccionado",
    done: pasoPacienteCompleto.value,
  },
  {
    id: "documentos",
    label: "Documento cargado",
    done: pasoDocumentosCompleto.value,
  },
  {
    id: "analisis",
    label: "Listo para análisis",
    done: listoParaAnalisis.value,
  },
]);

function cambiarModoPaciente(modo: ModoPaciente) {
  modoPaciente.value = modo;
  if (modo === "registrado") {
    manualPaciente.value = {
      fullName: "",
      documentType: "",
      documentNumber: "",
      birthDate: "",
    };
  } else {
    pacientesSeleccionados.value = [];
  }
}

function limpiarPaciente() {
  pacientesSeleccionados.value = [];
  idsPacientesMarcados.value = new Set();
}

async function abrirModalPacientes() {
  modalPacientesAbierto.value = true;
  filtroModalPaciente.value = "";
  errorListaPacientes.value = "";
  idsPacientesMarcados.value = new Set(
    pacientesSeleccionados.value.map((p) => p.id),
  );

  if (listaModalPacientes.value.length === 0) {
    cargandoListaPacientes.value = true;
    try {
      listaModalPacientes.value = await listPatients();
    } catch (e) {
      errorListaPacientes.value =
        e instanceof Error ? e.message : "Error al cargar pacientes";
      listaModalPacientes.value = [];
    } finally {
      cargandoListaPacientes.value = false;
    }
  }
}

function cerrarModalPacientes() {
  modalPacientesAbierto.value = false;
  filtroModalPaciente.value = "";
}

function togglePacienteModal(id: string) {
  const next = new Set(idsPacientesMarcados.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  idsPacientesMarcados.value = next;
}

function alternarTodosPacientesModal() {
  const visibles = pacientesModalFiltrados.value;
  const next = new Set(idsPacientesMarcados.value);
  if (todosMarcadosEnFiltro.value) {
    for (const p of visibles) next.delete(p.id);
  } else {
    for (const p of visibles) next.add(p.id);
  }
  idsPacientesMarcados.value = next;
}

function confirmarPacientesModal() {
  const mapa = new Map(listaModalPacientes.value.map((p) => [p.id, p]));
  pacientesSeleccionados.value = [...idsPacientesMarcados.value]
    .map((id) => mapa.get(id))
    .filter((p): p is PatientSummary => !!p);
  cerrarModalPacientes();
  const seleccionados = pacientesSeleccionados.value;
  if (seleccionados.length > 0) {
    const primero = seleccionados[0]!;
    const n = seleccionados.length;
    toast(
      n === 1
        ? `Paciente seleccionado: ${primero.fullName}`
        : `${n} pacientes seleccionados. El documento se asociará a ${primero.fullName}.`,
      "ok",
    );
  }
}

function obtenerContextoPaciente(): AiDocumentPatientInfo {
  if (modoPaciente.value === "registrado" && pacienteSeleccionado.value) {
    const p = pacienteSeleccionado.value;
    return {
      patientId: p.id,
      patientName: p.fullName,
      patientDocumentType: p.documentType || null,
      patientDocumentNumber: p.documentNumber || null,
      patientBirthDate: p.birthDate || null,
    };
  }
  const m = manualPaciente.value;
  return {
    patientId: null,
    patientName: m.fullName.trim(),
    patientDocumentType: m.documentType || null,
    patientDocumentNumber: m.documentNumber.trim() || null,
    patientBirthDate: m.birthDate || null,
  };
}

function toast(text: string, tipo: "ok" | "error") {
  mensaje.value = text;
  mensajeTipo.value = tipo;
}

/** Clave estable para listar y evitar duplicados en la cola */
function claveArchivo(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

/**
 * Añade uno o varios PDF/Word a la cola sin reemplazar los ya elegidos.
 * Devuelve cuántos se agregaron y los nombres rechazados o duplicados.
 */
function seleccionarDocumentos(entrada: FileList | File[] | null | undefined): {
  agregados: number;
  rechazados: string[];
  duplicados: string[];
} {
  const lista = entrada ? Array.from(entrada) : [];
  const rechazados: string[] = [];
  const duplicados: string[] = [];
  const existentes = new Set(files.value.map(claveArchivo));
  let agregados = 0;

  for (const file of lista) {
    if (!inferDocumentFileType(file)) {
      rechazados.push(file.name);
      continue;
    }
    const clave = claveArchivo(file);
    if (existentes.has(clave)) {
      duplicados.push(file.name);
      continue;
    }
    existentes.add(clave);
    files.value.push(file);
    agregados++;
  }

  return { agregados, rechazados, duplicados };
}

/** Abre el diálogo del sistema para elegir varios archivos */
function abrirSelectorDocumentos() {
  fileInputRef.value?.click();
}

function notificarResultadoSeleccion(
  resultado: ReturnType<typeof seleccionarDocumentos>,
) {
  const { agregados, rechazados, duplicados } = resultado;
  const partes: string[] = [];

  if (agregados > 0) {
    partes.push(
      `${agregados} archivo(s) añadido(s). Total en cola: ${files.value.length}.`,
    );
  }
  if (rechazados.length > 0) {
    partes.push(`No válidos (solo PDF/Word): ${rechazados.join(", ")}`);
  }
  if (duplicados.length > 0) {
    partes.push(`Ya estaban en la lista: ${duplicados.join(", ")}`);
  }

  if (partes.length === 0 && files.value.length === 0) {
    return;
  }

  const esError = rechazados.length > 0 && agregados === 0;
  toast(partes.join(" "), esError ? "error" : "ok");
}

function onFilePick(ev: Event) {
  const input = ev.target as HTMLInputElement;
  const resultado = seleccionarDocumentos(input.files);
  notificarResultadoSeleccion(resultado);
  input.value = "";
}

function onDrop(ev: DragEvent) {
  arrastrando.value = false;
  const resultado = seleccionarDocumentos(ev.dataTransfer?.files);
  notificarResultadoSeleccion(resultado);
}

function quitarDocumento(indice: number) {
  files.value.splice(indice, 1);
}

function limpiarSeleccion() {
  files.value = [];
  if (fileInputRef.value) fileInputRef.value.value = "";
  mensaje.value = "";
}

defineExpose({
  seleccionarDocumentos,
  abrirSelectorDocumentos,
  limpiarSeleccion,
  files,
});

async function almacenar() {
  if (files.value.length === 0 || !pacienteValido.value) return;
  almacenando.value = true;
  mensaje.value = "";

  const clientId = auth.currentUser?.id ?? null;
  const paciente = obtenerContextoPaciente();
  const subidos: AiDocumentUploadRow[] = [];
  try {
    for (const file of files.value) {
      const row = await storeAiDocument(file, clientId, paciente);
      subidos.push(row);
    }
    documentosListos.value = subidos;
    toast(
      `${subidos.length} archivo(s) de ${paciente.patientName} almacenado(s). Puedes encolar el análisis con IA.`,
      "ok",
    );
    limpiarSeleccion();
  } catch (e) {
    toast(e instanceof Error ? e.message : "Error al almacenar", "error");
  } finally {
    almacenando.value = false;
  }
}

async function analizar() {
  if (documentosListos.value.length === 0) return;
  analizando.value = true;
  mensaje.value = "";
  try {
    const ids = documentosListos.value.map((d) => d.id);
    const analyses = await queueAiAnalysisForDocuments(ids);
    toast(
      `Se crearon ${analyses.length} registro(s) de análisis (estado pendiente). Conecta un worker o webhook para generar la respuesta de IA en ai_document_analysis.`,
      "ok",
    );
  } catch (e) {
    toast(
      e instanceof Error ? e.message : "Error al encolar análisis",
      "error",
    );
  } finally {
    analizando.value = false;
  }
}
</script>
