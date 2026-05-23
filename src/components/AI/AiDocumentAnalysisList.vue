<template>
  <div
    class="ai-analysis-list-page relative z-10 min-h-[calc(100dvh-8rem)] px-4 sm:px-6 py-6 sm:py-8 bg-slate-50 rounded-2xl"
  >
    <div class="max-w-7xl mx-auto">
      <header
        class="mb-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6"
      >
        <div class="space-y-2 min-w-0">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0"
            >
              <svg
                class="w-5 h-5 text-emerald-600"
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
            </div>
            <h1 class="text-xl font-semibold text-slate-900 tracking-tight">
              Análisis generados por IA
            </h1>
          </div>
          <p class="text-sm text-slate-500 leading-6 max-w-2xl">
            Historial de análisis guardados. Busca por paciente, revisa el
            documento asociado y abre el detalle con un clic.
          </p>
        </div>

        <div
          class="flex flex-wrap items-center gap-2 shrink-0 lg:pt-0.5 lg:ml-auto"
        >
          <RouterLink
            to="/ai-documentos"
            class="inline-flex items-center gap-2 py-2.5 px-4 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all duration-200"
          >
            <svg
              class="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Ver documentos
          </RouterLink>
          <button
            type="button"
            :disabled="cargando"
            class="inline-flex items-center gap-2 py-2.5 px-4 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-50 shadow-sm transition-all duration-200"
            @click="cargar"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {{ cargando ? "Cargando..." : "Actualizar" }}
          </button>
        </div>
      </header>

      <div
        v-if="cargando && analisis.length === 0"
        class="py-20 text-center rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <p class="text-sm text-slate-500">Cargando análisis...</p>
      </div>

      <div
        v-else-if="error"
        class="p-5 rounded-2xl bg-red-50 border border-red-200 text-sm leading-6 text-red-700"
      >
        {{ error }}
      </div>

      <template v-else>
        <div v-if="analisis.length > 0" class="mb-6">
          <label class="block">
            <span class="sr-only">Buscar análisis por paciente</span>
            <div class="relative">
              <svg
                class="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
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
              <input
                v-model="busquedaPaciente"
                type="search"
                autocomplete="off"
                placeholder="Buscar por nombre del paciente, documento o archivo…"
                class="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
              <button
                v-if="busquedaPaciente.trim()"
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="Limpiar búsqueda"
                @click="busquedaPaciente = ''"
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
              </button>
            </div>
          </label>
        </div>

        <div
          v-if="analisis.length === 0"
          class="py-20 text-center rounded-2xl border border-dashed border-slate-200 bg-white shadow-sm"
        >
          <p class="text-sm text-slate-700 font-medium">
            No hay análisis guardados aún.
          </p>
          <RouterLink
            to="/ai-documentos"
            class="inline-flex items-center gap-2 mt-3 text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            Ir a documentos y generar un análisis
            <svg
              class="w-4 h-4"
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
          </RouterLink>
        </div>

        <div
          v-else-if="analisisVisibles.length === 0 && busquedaPaciente.trim()"
          class="py-16 text-center rounded-2xl border border-dashed border-sky-200 bg-sky-50/30 shadow-sm"
        >
          <p class="text-sm font-medium text-slate-700">
            Ningún análisis coincide con «{{ busquedaPaciente.trim() }}».
          </p>
          <button
            type="button"
            class="mt-3 text-sm font-medium text-sky-800 underline-offset-2 hover:underline"
            @click="busquedaPaciente = ''"
          >
            Limpiar búsqueda
          </button>
        </div>

        <div
          v-else
          class="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3"
        >
          <button
            v-for="item in analisisVisibles"
            :key="item.id"
            type="button"
            class="analysis-sheet-card group"
            @click="abrirDetalle(item)"
          >
            <span class="analysis-sheet-card__fold" aria-hidden="true" />

            <div class="analysis-sheet-card__inner">
              <header class="mb-4 flex items-start justify-between gap-2">
                <div class="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                  <time
                    v-if="item.created_at"
                    class="analysis-date-badge"
                    :datetime="item.created_at"
                    :title="formatearFecha(item.created_at)"
                  >
                    {{ formatearFechaBadge(item.created_at) }}
                  </time>
                  <span
                    v-if="item.model"
                    class="analysis-model-badge"
                    :title="item.model"
                  >
                    {{ etiquetaModelo(item.model) }}
                  </span>
                </div>
                <span
                  v-if="item.status"
                  class="shrink-0 inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium"
                  :class="claseEstado(item.status)"
                >
                  {{ etiquetaEstado(item.status) }}
                </span>
              </header>

              <div class="flex min-h-0 flex-1 gap-3.5">
                <div
                  class="analysis-sheet-icon"
                  :class="claseIconoHoja(item)"
                  aria-hidden="true"
                >
                  <span class="analysis-sheet-icon__fold" />
                  <span class="analysis-sheet-icon__line" />
                  <span
                    class="analysis-sheet-icon__line analysis-sheet-icon__line--short"
                  />
                  <span
                    class="analysis-sheet-icon__line analysis-sheet-icon__line--shorter"
                  />
                </div>

                <div class="flex min-w-0 flex-1 flex-col">
                  <div
                    class="analysis-patient-row"
                    :class="
                      tienePaciente(item)
                        ? 'analysis-patient-row--assigned'
                        : 'analysis-patient-row--empty'
                    "
                    :title="etiquetaPacienteCompleta(item)"
                  >
                    <svg
                      class="h-3.5 w-3.5 shrink-0 opacity-80"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.75"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span class="min-w-0 truncate font-medium">
                      {{ nombrePaciente(item) }}
                    </span>
                  </div>
                  <p
                    v-if="subtituloPaciente(item)"
                    class="mt-1 line-clamp-1 text-[11px] text-slate-500"
                  >
                    {{ subtituloPaciente(item) }}
                  </p>
                  <h2
                    class="mt-2 line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-slate-900"
                    :title="tituloCard(item)"
                  >
                    {{ tituloCard(item) }}
                  </h2>
                  <span
                    class="mt-2 inline-flex w-fit items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                    :class="claseTipoDocumento(item)"
                  >
                    {{ etiquetaTipoDocumento(item) }}
                  </span>
                  <p class="analysis-sheet-preview mt-3 flex-1">
                    {{ resumenCard(item.content) }}
                  </p>
                </div>
              </div>

              <footer class="analysis-sheet-footer">
                <span class="text-[11px] text-slate-400">Análisis con IA</span>
                <span class="analysis-sheet-cta">
                  Ver detalle
                  <svg
                    class="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </footer>
            </div>
          </button>
        </div>

        <p
          v-if="analisis.length > 0 && analisisVisibles.length > 0"
          class="mt-6 text-center text-xs text-slate-500"
        >
          <template v-if="busquedaPaciente.trim()">
            {{ analisisVisibles.length }} de
            {{ analisis.length }}
            {{ analisis.length === 1 ? "análisis" : "análisis" }}
            encontrados
          </template>
          <template v-else>
            {{ analisis.length }}
            {{ analisis.length === 1 ? "análisis" : "análisis" }}
          </template>
        </p>
      </template>
    </div>

    <Teleport to="body">
      <Transition name="app-modal">
        <div v-if="modalAbierto && seleccionado" class="app-modal-root">
          <div
            class="app-modal-backdrop"
            aria-hidden="true"
            @click="cerrarModal"
          />
          <div
            class="app-modal-scrim app-modal-scrim--sheet"
            :class="modalExpandido && modalPermiteExpandir ? 'p-2 sm:p-3' : ''"
            @click.self="cerrarModal"
          >
            <div
              class="app-modal-panel app-modal-panel--sheet flex w-full flex-col rounded-2xl border border-black/8 bg-white shadow-xl"
              :class="
                modalExpandido && modalPermiteExpandir
                  ? 'h-[calc(100vh-1rem)] max-h-none max-w-none sm:h-[calc(100vh-1.5rem)]'
                  : 'max-h-[90vh] max-w-3xl'
              "
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-analisis-titulo"
              @click.stop
            >
              <header
                class="app-modal-header flex shrink-0 items-start justify-between gap-3 border-b border-black/6 px-5 py-4"
              >
                <div class="min-w-0">
                  <h3
                    id="modal-analisis-titulo"
                    class="text-[14px] font-semibold text-[#1d1d1f]"
                  >
                    {{
                      vistaModal === "notas"
                        ? "Notas del análisis"
                        : vistaModal === "crear-nota"
                          ? "Nueva nota"
                          : vistaModal === "redaccion-ia"
                            ? "Redacción con IA"
                            : vistaModal === "lista-redacciones-notas"
                              ? "Análisis de notas guardados"
                              : vistaModal === "detalle-redaccion-nota"
                                ? "Detalle del análisis de notas"
                                : "Detalle del análisis"
                    }}
                  </h3>
                  <p class="text-[11px] text-[#86868b] mt-0.5 truncate">
                    {{ tituloCard(seleccionado) }}
                  </p>
                  <p
                    class="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-[#52525b]"
                  >
                    <span
                      class="inline-flex max-w-full items-center gap-1 rounded-md px-2 py-0.5"
                      :class="
                        tienePaciente(seleccionado)
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      "
                    >
                      <svg
                        class="h-3 w-3 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span class="truncate">{{
                        nombrePaciente(seleccionado)
                      }}</span>
                    </span>
                    <span
                      v-if="subtituloPaciente(seleccionado)"
                      class="text-[#86868b]"
                    >
                      · {{ subtituloPaciente(seleccionado) }}
                    </span>
                  </p>
                  <div class="flex flex-wrap gap-2 mt-2">
                    <time
                      v-if="
                        seleccionado.created_at && vistaModal === 'analisis'
                      "
                      class="analysis-date-badge"
                      :datetime="seleccionado.created_at"
                      :title="formatearFecha(seleccionado.created_at)"
                    >
                      {{ formatearFechaBadge(seleccionado.created_at) }}
                    </time>
                    <span
                      v-if="seleccionado.model && vistaModal === 'analisis'"
                      class="analysis-model-badge max-w-[220px]"
                      :title="seleccionado.model"
                    >
                      {{ etiquetaModelo(seleccionado.model) }}
                    </span>
                    <span
                      v-if="seleccionado.status && vistaModal === 'analisis'"
                      class="text-[10px] font-medium px-2 py-0.5 rounded-md"
                      :class="claseEstado(seleccionado.status)"
                    >
                      {{ etiquetaEstado(seleccionado.status) }}
                    </span>
                    <span
                      v-if="vistaModal !== 'analisis'"
                      class="text-[10px] px-2 py-0.5 rounded-full bg-[#f0faf6] text-[#0d9e6e]"
                    >
                      {{ notasDelAnalisis.length }} nota(s)
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                  <button
                    v-if="modalPermiteExpandir"
                    type="button"
                    class="text-[#aeaeb2] hover:text-[#1d1d1f] p-1.5 rounded-md hover:bg-slate-100 transition-colors"
                    :aria-label="
                      modalExpandido ? 'Contraer modal' : 'Expandir modal'
                    "
                    :title="modalExpandido ? 'Contraer' : 'Expandir'"
                    @click="toggleModalExpandido"
                  >
                    <svg
                      v-if="!modalExpandido"
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
                    <svg
                      v-else
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="text-[#aeaeb2] hover:text-[#1d1d1f] p-1 shrink-0 rounded-md hover:bg-slate-100"
                    aria-label="Cerrar"
                    @click="cerrarModal"
                  >
                    ✕
                  </button>
                </div>
              </header>

              <div
                class="app-modal-body relative flex min-h-0 flex-1 flex-col overflow-hidden"
              >
                <AppIconWallpaper variant="modal" :repeat="3" :veiled="true" />

                <div class="relative z-10 flex-1 min-h-0 flex flex-col">
                  <!-- Vista: análisis -->
                  <div
                    v-show="vistaModal === 'analisis'"
                    class="flex-1 min-h-0 flex flex-col"
                  >
                    <div
                      class="shrink-0 px-5 pt-4 pb-2 flex flex-wrap items-center gap-2"
                    >
                      <button
                        type="button"
                        class="py-2 px-3 text-[12px] font-medium rounded-[9px] border border-[#0ea5e9]/30 text-[#0ea5e9] hover:bg-sky-50 transition-colors disabled:opacity-50"
                        :disabled="cargandoRedaccionesNotas"
                        @click="abrirListaRedaccionesNotas"
                      >
                        {{
                          cargandoRedaccionesNotas
                            ? "Cargando análisis de notas…"
                            : redaccionesNotas.length > 0
                              ? `Ver análisis de notas (${redaccionesNotas.length})`
                              : "Ver análisis de notas guardados"
                        }}
                      </button>
                    </div>
                    <div
                      class="ai-clinical-scroll ai-clinical-typography ai-analysis-markdown px-5 py-6 overflow-y-auto flex-1 min-h-0 max-w-none"
                      v-html="detalleHtml"
                    />
                  </div>

                  <!-- Vista: lista de análisis generados desde notas (redacciones) -->
                  <div
                    v-show="vistaModal === 'lista-redacciones-notas'"
                    class="overflow-y-auto flex-1 px-5 py-4"
                  >
                    <p
                      v-if="errorRedaccionesNotas"
                      class="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3"
                    >
                      {{ errorRedaccionesNotas }}
                    </p>

                    <div
                      v-if="cargandoRedaccionesNotas"
                      class="py-12 text-center text-[12px] text-[#86868b]"
                    >
                      Cargando análisis de notas…
                    </div>

                    <div
                      v-else-if="redaccionesNotas.length === 0"
                      class="py-12 text-center border border-dashed border-black/10 rounded-xl"
                    >
                      <p class="text-[13px] text-[#3a3a3c]">
                        No hay análisis de notas guardados para este análisis.
                      </p>
                      <p class="text-[11px] text-[#86868b] mt-2">
                        Crea notas, redacta con IA y pulsa «Guardar redacción».
                      </p>
                    </div>

                    <ul v-else class="space-y-3">
                      <li v-for="item in redaccionesNotas" :key="item.id">
                        <button
                          type="button"
                          class="analysis-sheet-card analysis-sheet-card--compact group w-full"
                          @click="abrirDetalleRedaccionNota(item)"
                        >
                          <span
                            class="analysis-sheet-card__fold"
                            aria-hidden="true"
                          />
                          <div class="analysis-sheet-card__inner">
                            <div class="mb-2 flex flex-wrap items-center gap-2">
                              <time
                                v-if="item.created_at"
                                class="analysis-date-badge"
                                :datetime="item.created_at"
                                :title="formatearFecha(item.created_at)"
                              >
                                {{ formatearFechaBadge(item.created_at) }}
                              </time>
                              <span
                                v-if="item.model"
                                class="analysis-model-badge"
                                :title="item.model"
                              >
                                {{ etiquetaModelo(item.model) }}
                              </span>
                              <span
                                class="ml-auto shrink-0 rounded-md bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-700/90"
                              >
                                {{ item.notes_count }} nota(s)
                              </span>
                            </div>
                            <p
                              class="line-clamp-1 text-[13px] font-semibold text-slate-900"
                            >
                              {{
                                item.original_filename ||
                                `Redacción ${item.id.slice(0, 8)}…`
                              }}
                            </p>
                            <p
                              class="analysis-sheet-preview mt-2 line-clamp-2 text-[12px]"
                            >
                              {{ resumenCard(item.content) }}
                            </p>
                            <p class="analysis-sheet-cta mt-3 justify-end">
                              Ver detalle →
                            </p>
                          </div>
                        </button>
                      </li>
                    </ul>
                  </div>

                  <!-- Vista: detalle de un análisis de notas -->
                  <div
                    v-show="vistaModal === 'detalle-redaccion-nota'"
                    class="flex-1 min-h-0 flex flex-col overflow-y-auto px-5 py-4 space-y-3"
                  >
                    <dl
                      v-if="redaccionNotaSeleccionada"
                      class="flex flex-wrap gap-3 text-[10.5px] text-[#86868b]"
                    >
                      <div v-if="redaccionNotaSeleccionada.model">
                        <dt class="inline font-medium">Modelo:</dt>
                        <dd class="inline ml-1 text-[#52525b]">
                          {{ redaccionNotaSeleccionada.model }}
                        </dd>
                      </div>
                      <div>
                        <dt class="inline font-medium">Notas usadas:</dt>
                        <dd class="inline ml-1">
                          {{ redaccionNotaSeleccionada.notes_count }}
                        </dd>
                      </div>
                      <div>
                        <dt class="inline font-medium">Guardado:</dt>
                        <dd class="inline ml-1">
                          {{
                            formatearFecha(redaccionNotaSeleccionada.created_at)
                          }}
                        </dd>
                      </div>
                    </dl>
                    <div
                      class="ai-clinical-scroll ai-clinical-typography ai-analysis-markdown flex-1 min-h-0 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-4 max-w-none"
                      :class="modalExpandido ? 'min-h-[50vh]' : ''"
                      v-html="redaccionNotaDetalleHtml"
                    />
                  </div>

                  <!-- Vista: redacción IA (notas + análisis en markdown) -->
                  <div
                    v-show="vistaModal === 'redaccion-ia'"
                    class="overflow-y-auto flex-1 px-5 py-4 space-y-5"
                  >
                    <p
                      v-if="errorRedaccion"
                      class="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                    >
                      {{ errorRedaccion }}
                    </p>

                    <section>
                      <h4
                        class="text-[12px] font-semibold text-[#1d1d1f] mb-2 flex items-center gap-2"
                      >
                        <span class="w-1.5 h-1.5 rounded-full bg-[#0d9e6e]" />
                        Análisis del documento
                      </h4>
                      <div
                        class="ai-clinical-scroll ai-clinical-typography ai-analysis-markdown rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-4 max-w-none"
                        v-html="detalleHtml"
                      />
                    </section>

                    <section>
                      <h4
                        class="text-[12px] font-semibold text-[#1d1d1f] mb-2 flex items-center gap-2"
                      >
                        <span class="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]" />
                        Redacción a partir de tus notas
                      </h4>
                      <div
                        v-if="redactandoNotas"
                        class="rounded-xl border border-dashed border-[#0d9e6e]/40 bg-[#f0faf6]/50 px-4 py-8 text-center text-[12px] text-[#86868b]"
                      >
                        La inteligencia artificial está redactando…
                      </div>
                      <div
                        v-else-if="textoRedaccionNotas"
                        class="ai-clinical-scroll ai-clinical-typography ai-analysis-markdown rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-4 max-w-none"
                        v-html="redaccionHtml"
                      />
                      <p v-else class="text-[12px] text-[#86868b]">
                        Sin contenido generado.
                      </p>
                    </section>

                    <p
                      v-if="mensajeGuardadoRedaccion"
                      class="text-[11px] rounded-lg px-3 py-2"
                      :class="
                        errorGuardadoRedaccion
                          ? 'text-red-700 bg-red-50 border border-red-200/60'
                          : 'text-[#0d9e6e] bg-[#f0faf6] border border-[#0d9e6e]/20'
                      "
                    >
                      {{ mensajeGuardadoRedaccion }}
                    </p>
                  </div>

                  <!-- Vista: notas (Vue Flow) -->
                  <div
                    v-show="vistaModal === 'notas'"
                    class="flex-1 min-h-0 flex flex-col relative"
                  >
                    <div
                      class="shrink-0 px-4 pt-3 pb-2 flex flex-wrap items-center gap-2 border-b border-black/[0.06] bg-[#fafafa]/80"
                    >
                      <button
                        type="button"
                        :disabled="
                          notasDelAnalisis.length === 0 || redactandoNotas
                        "
                        class="py-2 px-3 text-[12px] font-medium text-white bg-gradient-to-r from-[#0d9e6e] to-[#0ea5e9] rounded-[9px] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        @click="redactarNotasConIA"
                      >
                        {{
                          redactandoNotas
                            ? "Redactando…"
                            : "Redactar por inteligencia artificial"
                        }}
                      </button>
                      <button
                        type="button"
                        class="py-2 px-3 text-[12px] font-medium rounded-[9px] border transition-colors"
                        :class="
                          panelAnalisisVisible
                            ? 'bg-[#0d9e6e] text-white border-[#0d9e6e]'
                            : 'text-[#0d9e6e] border-[#0d9e6e]/30 hover:bg-[#f0faf6]'
                        "
                        @click="panelAnalisisVisible = !panelAnalisisVisible"
                      >
                        {{
                          panelAnalisisVisible
                            ? "Ocultar análisis"
                            : "Ver análisis (markdown)"
                        }}
                      </button>
                    </div>

                    <div
                      v-if="panelAnalisisVisible"
                      class="shrink-0 mx-4 mt-3 max-h-[220px] overflow-y-auto rounded-xl border border-[#0d9e6e]/25 bg-white shadow-sm"
                    >
                      <div
                        class="sticky top-0 z-10 px-3 py-2 border-b border-black/[0.06] bg-[#f0faf6] text-[11px] font-medium text-[#0d9e6e]"
                      >
                        Análisis del documento
                      </div>
                      <div
                        class="ai-clinical-scroll ai-clinical-typography ai-analysis-markdown px-4 py-4 max-w-none"
                        v-html="detalleHtml"
                      />
                    </div>

                    <p
                      v-if="notasDelAnalisis.length === 0"
                      class="text-[12px] text-[#86868b] text-center py-8 px-5"
                    >
                      No hay notas. Usa el botón flotante + para crear una.
                    </p>
                    <div
                      v-else
                      class="flex-1 mx-4 my-3 border border-black/[0.08] rounded-xl overflow-hidden bg-[#fafafa]"
                      :class="modalExpandido ? 'min-h-0' : 'min-h-[360px]'"
                    >
                      <VueFlow
                        v-model:nodes="flowNodes"
                        v-model:edges="flowEdges"
                        :default-viewport="{ zoom: 1 }"
                        :min-zoom="0.25"
                        :max-zoom="2"
                        :nodes-draggable="true"
                        :nodes-connectable="false"
                        fit-view-on-init
                        class="ai-notes-flow h-full"
                        :class="modalExpandido ? 'min-h-0' : 'min-h-[360px]'"
                      >
                        <Background pattern-color="#E5E7EB" :gap="20" />
                        <MiniMap />
                        <Controls />

                        <template #node-ai-analysis-note="{ data }">
                          <AiAnalysisNoteNode
                            :data="notaDesdeNodo(data)"
                            @expand="abrirDetalleNotaFlow(notaDesdeNodo(data))"
                            @edit-context="
                              abrirDetalleNotaFlow(notaDesdeNodo(data), true)
                            "
                          />
                        </template>
                      </VueFlow>
                    </div>

                    <!-- Panel detalle / edición de contexto -->
                    <Transition name="fade">
                      <div
                        v-if="notaDetalleFlow"
                        class="shrink-0 border-t border-black/[0.06] bg-white px-5 py-4 max-h-[40%] overflow-y-auto"
                      >
                        <div
                          class="flex items-start justify-between gap-2 mb-2"
                        >
                          <span
                            class="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            :class="[
                              notaDetalleFlow.bgClass,
                              notaDetalleFlow.borderClass,
                              notaDetalleFlow.textClass,
                            ]"
                          >
                            {{ notaDetalleFlow.colorName }}
                          </span>
                          <button
                            type="button"
                            class="text-[#aeaeb2] hover:text-[#1d1d1f] text-sm"
                            aria-label="Cerrar detalle"
                            @click="cerrarDetalleNotaFlow"
                          >
                            ✕
                          </button>
                        </div>
                        <p
                          class="text-[13px] font-medium whitespace-pre-wrap"
                          :class="notaDetalleFlow.textClass"
                        >
                          {{ notaDetalleFlow.content }}
                        </p>
                        <div class="mt-3">
                          <label
                            class="text-[10px] font-medium text-[#86868b] block mb-1"
                          >
                            Contexto adicional
                          </label>
                          <textarea
                            v-if="notaEditandoId === notaDetalleFlow.id"
                            v-model="contextoEdicion"
                            rows="3"
                            class="w-full text-[12px] rounded-lg border border-black/10 px-2 py-1.5 focus:outline-none focus:border-[#0d9e6e]/50"
                            placeholder="Añade o edita el contexto..."
                          />
                          <p
                            v-else
                            class="text-[12px] text-[#52525b] whitespace-pre-wrap"
                          >
                            {{
                              notaDetalleFlow.context.trim()
                                ? notaDetalleFlow.context
                                : "Sin contexto adicional."
                            }}
                          </p>
                        </div>
                        <div class="flex flex-wrap gap-2 mt-3">
                          <button
                            v-if="notaEditandoId === notaDetalleFlow.id"
                            type="button"
                            class="text-[11px] text-white bg-[#0d9e6e] px-3 py-1.5 rounded-md"
                            @click="guardarContextoNota(notaDetalleFlow.id)"
                          >
                            Guardar contexto
                          </button>
                          <button
                            v-else
                            type="button"
                            class="text-[11px] text-[#0d9e6e] border border-[#0d9e6e]/30 px-3 py-1.5 rounded-md hover:bg-[#f0faf6]"
                            @click="iniciarEdicionContexto(notaDetalleFlow)"
                          >
                            Editar contexto
                          </button>
                          <button
                            type="button"
                            class="text-[11px] text-red-600 hover:underline ml-auto"
                            @click="eliminarNota(notaDetalleFlow.id)"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </Transition>
                  </div>

                  <!-- Vista: crear nota -->
                  <div
                    v-show="vistaModal === 'crear-nota'"
                    class="overflow-y-auto flex-1 px-5 py-4 space-y-4"
                  >
                    <div
                      v-if="colorNotaSeleccionado"
                      class="inline-flex items-center gap-2 text-[11px] px-2.5 py-1 rounded-full border"
                      :class="[
                        colorNotaSeleccionado.bgClass,
                        colorNotaSeleccionado.borderClass,
                        colorNotaSeleccionado.textClass,
                      ]"
                    >
                      <span
                        class="w-3 h-3 rounded-full border"
                        :class="colorNotaSeleccionado.borderClass"
                      />
                      Color: {{ colorNotaSeleccionado.name }}
                    </div>

                    <div>
                      <label
                        class="text-[12px] font-medium text-[#3a3a3c] block mb-1"
                      >
                        Contenido <span class="text-red-500">*</span>
                      </label>
                      <textarea
                        v-model="nuevaNotaContent"
                        rows="5"
                        required
                        class="w-full text-[13px] border border-black/10 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0d9e6e]/50 resize-y"
                        placeholder="Escribe el contenido de la nota..."
                      />
                    </div>

                    <div>
                      <label
                        class="text-[12px] font-medium text-[#3a3a3c] block mb-1"
                      >
                        Contexto adicional
                      </label>
                      <textarea
                        v-model="nuevaNotaContext"
                        rows="3"
                        class="w-full text-[13px] border border-black/10 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0d9e6e]/50 resize-y"
                        placeholder="Opcional: referencias, recordatorios, enlaces al análisis..."
                      />
                      <p class="text-[10px] text-[#aeaeb2] mt-1">
                        Puedes dejarlo vacío y completarlo después desde la
                        lista de notas.
                      </p>
                    </div>

                    <div class="flex gap-2 pt-1">
                      <button
                        type="button"
                        class="py-2 px-4 text-[12px] font-medium text-[#3a3a3c] border border-black/10 rounded-[9px] hover:bg-[#fafafa]"
                        @click="cancelarCrearNota"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        :disabled="
                          !nuevaNotaContent.trim() || !colorNotaSeleccionado
                        "
                        class="py-2 px-4 text-[12px] font-medium text-white bg-[#0d9e6e] rounded-[9px] hover:bg-[#0a8a5f] disabled:opacity-50"
                        @click="guardarNuevaNota"
                      >
                        Crear nota
                      </button>
                    </div>
                  </div>
                </div>

                <!-- FAB + menú de colores (vista análisis o notas) -->
                <div
                  v-if="vistaModal === 'analisis' || vistaModal === 'notas'"
                  class="absolute bottom-4 right-4 z-30 flex flex-col items-end gap-2"
                >
                  <Transition name="fade">
                    <div
                      v-if="menuFabAbierto"
                      class="bg-white rounded-xl border border-black/10 shadow-lg p-3 min-w-[200px]"
                    >
                      <p class="text-[11px] font-medium text-[#3a3a3c] mb-2">
                        Color de la nota
                      </p>
                      <div class="flex flex-wrap gap-2 justify-center mb-2">
                        <button
                          v-for="color in coloresNota"
                          :key="color.name"
                          type="button"
                          class="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                          :class="[
                            color.bgClass,
                            color.borderClass,
                            colorNotaSeleccionado?.name === color.name
                              ? 'ring-2 ring-offset-1 ring-[#0d9e6e] scale-110'
                              : '',
                          ]"
                          :title="color.name"
                          @click="seleccionarColorNota(color)"
                        />
                      </div>
                      <button
                        type="button"
                        :disabled="!colorNotaSeleccionado"
                        class="w-full py-2 text-[12px] font-medium text-white bg-[#0d9e6e] rounded-lg disabled:opacity-40"
                        @click="irACrearNota"
                      >
                        Continuar y escribir nota
                      </button>
                    </div>
                  </Transition>

                  <button
                    type="button"
                    class="w-12 h-12 rounded-full bg-[#0d9e6e] hover:bg-[#0a8a5f] text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105"
                    :class="menuFabAbierto ? 'rotate-45' : ''"
                    title="Crear nota"
                    aria-label="Crear nota"
                    @click="toggleMenuFab"
                  >
                    <svg
                      class="w-6 h-6"
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
                  </button>
                </div>
              </div>

              <footer
                class="app-modal-footer flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-black/6 px-5 py-3"
              >
                <div class="flex flex-wrap items-center gap-2">
                  <button
                    v-if="vistaModal === 'detalle-redaccion-nota'"
                    type="button"
                    class="py-2 px-3 text-[12px] font-medium text-[#0ea5e9] border border-[#0ea5e9]/30 rounded-[9px] hover:bg-sky-50"
                    @click="vistaModal = 'lista-redacciones-notas'"
                  >
                    Volver a la lista
                  </button>
                  <button
                    v-else-if="vistaModal === 'lista-redacciones-notas'"
                    type="button"
                    class="py-2 px-3 text-[12px] font-medium text-[#0d9e6e] border border-[#0d9e6e]/30 rounded-[9px] hover:bg-[#f0faf6]"
                    @click="volverDetalleAnalisis"
                  >
                    Volver al análisis
                  </button>
                  <button
                    v-else-if="vistaModal === 'redaccion-ia'"
                    type="button"
                    class="py-2 px-3 text-[12px] font-medium text-[#0d9e6e] border border-[#0d9e6e]/30 rounded-[9px] hover:bg-[#f0faf6]"
                    @click="vistaModal = 'notas'"
                  >
                    Volver a notas
                  </button>
                  <button
                    v-else-if="
                      vistaModal === 'analisis' ||
                      vistaModal === 'notas' ||
                      vistaModal === 'crear-nota'
                    "
                    type="button"
                    class="py-2 px-3 text-[12px] font-medium rounded-[9px] border transition-colors"
                    :class="
                      vistaModal === 'notas' || vistaModal === 'crear-nota'
                        ? 'bg-[#0d9e6e] text-white border-[#0d9e6e]'
                        : 'text-[#0d9e6e] border-[#0d9e6e]/30 hover:bg-[#f0faf6]'
                    "
                    @click="toggleListaNotas"
                  >
                    {{
                      vistaModal === "notas" || vistaModal === "crear-nota"
                        ? "Ver análisis"
                        : `Ver notas (${notasDelAnalisis.length})`
                    }}
                  </button>
                </div>
                <div class="flex flex-wrap items-center gap-2 ml-auto">
                  <button
                    v-if="vistaModal === 'redaccion-ia'"
                    type="button"
                    :disabled="!puedeGuardarRedaccion"
                    class="py-2 px-4 text-[12px] font-medium text-white bg-[#0d9e6e] rounded-[9px] hover:bg-[#0a8a5f] disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="guardarRedaccionModal"
                  >
                    {{
                      guardandoRedaccion
                        ? "Guardando…"
                        : redaccionGuardada
                          ? "Guardar de nuevo"
                          : "Guardar redacción"
                    }}
                  </button>
                  <button
                    type="button"
                    class="py-2 px-4 text-[12px] font-medium text-white bg-slate-700 rounded-[9px] hover:bg-slate-800"
                    @click="cerrarModal"
                  >
                    Cerrar
                  </button>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import MarkdownIt from "markdown-it";
import { VueFlow } from "@vue-flow/core";
import type { Edge, Node } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { MiniMap } from "@vue-flow/minimap";
import { Controls } from "@vue-flow/controls";
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import { useGetGenerativeModelGP } from "@/shared/service/useGetGenerativeModelGP";
import {
  GEMINI_MODEL_NAME,
  listAiDocumentAnalyses,
  listAiDocumentRedactionsByAnalysis,
  readAiAnalysesApiError,
  saveAiDocumentRedaction,
} from "@/services/aiDocumentAnalysesApi";
import { listAiDocuments } from "@/services/aiDocumentsService";
import type { AiDocumentUploadRow } from "@/services/aiDocumentsService";
import type {
  AiDocumentAnalysisListItem,
  AiDocumentRedactionListItem,
} from "@/services/aiDocumentAnalysesApi";
import type {
  AiAnalysisNote,
  AiAnalysisNoteColor,
} from "@/types/aiAnalysisNote";
import AiAnalysisNoteNode from "./AiAnalysisNoteNode.vue";
import AppIconWallpaper from "@/core/shared/wallpaper/AppIconWallpaper.vue";
import { renderClinicalMarkdown } from "./clinicalMarkdownCards";

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
});

const coloresNota: AiAnalysisNoteColor[] = [
  {
    name: "Amarillo",
    bgClass: "bg-yellow-50",
    borderClass: "border-yellow-300",
    textClass: "text-yellow-900",
  },
  {
    name: "Verde",
    bgClass: "bg-green-50",
    borderClass: "border-green-300",
    textClass: "text-green-900",
  },
  {
    name: "Azul",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-300",
    textClass: "text-blue-900",
  },
  {
    name: "Rosa",
    bgClass: "bg-pink-50",
    borderClass: "border-pink-300",
    textClass: "text-pink-900",
  },
  {
    name: "Púrpura",
    bgClass: "bg-purple-50",
    borderClass: "border-purple-300",
    textClass: "text-purple-900",
  },
  {
    name: "Naranja",
    bgClass: "bg-orange-50",
    borderClass: "border-orange-300",
    textClass: "text-orange-900",
  },
];

type VistaModal =
  | "analisis"
  | "notas"
  | "crear-nota"
  | "redaccion-ia"
  | "lista-redacciones-notas"
  | "detalle-redaccion-nota";

const analisis = ref<AiDocumentAnalysisListItem[]>([]);
const busquedaPaciente = ref("");
const cargando = ref(false);
const error = ref<string | null>(null);
const modalAbierto = ref(false);
const modalExpandido = ref(false);
const seleccionado = ref<AiDocumentAnalysisListItem | null>(null);

const vistaModal = ref<VistaModal>("analisis");

const vistaModalEsNotas = computed(
  () => vistaModal.value === "notas" || vistaModal.value === "crear-nota",
);

/** Vistas del modal que permiten pantalla completa (expandir / contraer) */
const VISTAS_MODAL_EXPANDIBLE: VistaModal[] = [
  "analisis",
  "notas",
  "crear-nota",
  "lista-redacciones-notas",
  "detalle-redaccion-nota",
  "redaccion-ia",
];

const modalPermiteExpandir = computed(() =>
  VISTAS_MODAL_EXPANDIBLE.includes(vistaModal.value),
);
const notasPorAnalisis = ref<Record<string, AiAnalysisNote[]>>({});
const menuFabAbierto = ref(false);
const colorNotaSeleccionado = ref<AiAnalysisNoteColor | null>(null);
const nuevaNotaContent = ref("");
const nuevaNotaContext = ref("");
const notaEditandoId = ref<string | null>(null);
const contextoEdicion = ref("");
const notaDetalleFlow = ref<AiAnalysisNote | null>(null);
const flowNodes = ref<Node[]>([]);
const flowEdges = ref<Edge[]>([]);
const panelAnalisisVisible = ref(false);
const redactandoNotas = ref(false);
const textoRedaccionNotas = ref("");
const errorRedaccion = ref<string | null>(null);
const guardandoRedaccion = ref(false);
const redaccionGuardada = ref(false);
const redaccionIdGuardado = ref<string | null>(null);
const mensajeGuardadoRedaccion = ref("");
const errorGuardadoRedaccion = ref(false);
const redaccionesNotas = ref<AiDocumentRedactionListItem[]>([]);
const cargandoRedaccionesNotas = ref(false);
const errorRedaccionesNotas = ref<string | null>(null);
const redaccionNotaSeleccionada = ref<AiDocumentRedactionListItem | null>(null);

const notasDelAnalisis = computed(() => {
  const id = seleccionado.value?.id;
  if (!id) return [];
  return notasPorAnalisis.value[id] ?? [];
});

const analisisVisibles = computed(() => {
  const q = busquedaPaciente.value.trim().toLowerCase();
  if (!q) return analisis.value;

  return analisis.value.filter((item) => {
    if (nombrePaciente(item).toLowerCase().includes(q)) return true;
    if (subtituloPaciente(item)?.toLowerCase().includes(q)) return true;
    if (tituloCard(item).toLowerCase().includes(q)) return true;
    if (item.patient_document_number?.toLowerCase().includes(q)) return true;
    if (item.patient_document_type?.toLowerCase().includes(q)) return true;
    return false;
  });
});

function enriquecerAnalisisConPaciente(
  items: AiDocumentAnalysisListItem[],
  documentos: AiDocumentUploadRow[],
): AiDocumentAnalysisListItem[] {
  const porUploadId = new Map(documentos.map((d) => [d.id, d]));

  return items.map((item) => {
    const doc = porUploadId.get(item.document_upload_id);
    if (!doc) return item;

    return {
      ...item,
      patient_id: item.patient_id ?? doc.patient_id ?? null,
      patient_name: item.patient_name?.trim()
        ? item.patient_name
        : (doc.patient_name ?? null),
      patient_document_type:
        item.patient_document_type ?? doc.patient_document_type ?? null,
      patient_document_number:
        item.patient_document_number ?? doc.patient_document_number ?? null,
      original_filename:
        item.original_filename ?? doc.original_filename ?? null,
    };
  });
}

function storageKey(analysisId: string) {
  return `ai-analysis-notes-${analysisId}`;
}

function cargarNotas(analysisId: string) {
  try {
    const raw = localStorage.getItem(storageKey(analysisId));
    notasPorAnalisis.value[analysisId] = raw
      ? (JSON.parse(raw) as AiAnalysisNote[])
      : [];
  } catch {
    notasPorAnalisis.value[analysisId] = [];
  }
}

function persistirNotas(analysisId: string) {
  const list = notasPorAnalisis.value[analysisId] ?? [];
  localStorage.setItem(storageKey(analysisId), JSON.stringify(list));
}

function toggleModalExpandido() {
  modalExpandido.value = !modalExpandido.value;
}

function resetEstadoNotas() {
  modalExpandido.value = false;
  vistaModal.value = "analisis";
  menuFabAbierto.value = false;
  colorNotaSeleccionado.value = null;
  nuevaNotaContent.value = "";
  nuevaNotaContext.value = "";
  notaEditandoId.value = null;
  contextoEdicion.value = "";
  notaDetalleFlow.value = null;
  flowNodes.value = [];
  flowEdges.value = [];
  panelAnalisisVisible.value = false;
  redactandoNotas.value = false;
  textoRedaccionNotas.value = "";
  errorRedaccion.value = null;
  guardandoRedaccion.value = false;
  redaccionGuardada.value = false;
  redaccionIdGuardado.value = null;
  mensajeGuardadoRedaccion.value = "";
  errorGuardadoRedaccion.value = false;
  redaccionesNotas.value = [];
  cargandoRedaccionesNotas.value = false;
  errorRedaccionesNotas.value = null;
  redaccionNotaSeleccionada.value = null;
}

async function cargarRedaccionesNotas() {
  const analysis = seleccionado.value;
  if (!analysis?.document_upload_id) {
    errorRedaccionesNotas.value = "No se encontró el documento asociado.";
    return;
  }

  cargandoRedaccionesNotas.value = true;
  errorRedaccionesNotas.value = null;

  try {
    redaccionesNotas.value = await listAiDocumentRedactionsByAnalysis(
      analysis.id,
      analysis.document_upload_id,
    );
  } catch (e) {
    errorRedaccionesNotas.value = readAiAnalysesApiError(e);
    redaccionesNotas.value = [];
  } finally {
    cargandoRedaccionesNotas.value = false;
  }
}

async function abrirListaRedaccionesNotas() {
  menuFabAbierto.value = false;
  vistaModal.value = "lista-redacciones-notas";
  redaccionNotaSeleccionada.value = null;
  await cargarRedaccionesNotas();
}

function abrirDetalleRedaccionNota(item: AiDocumentRedactionListItem) {
  redaccionNotaSeleccionada.value = item;
  vistaModal.value = "detalle-redaccion-nota";
}

function volverDetalleAnalisis() {
  redaccionNotaSeleccionada.value = null;
  vistaModal.value = "analisis";
}

function notaDesdeNodo(data: Record<string, unknown>): AiAnalysisNote {
  return data as AiAnalysisNote;
}

function sincronizarFlowNotas() {
  const notas = notasDelAnalisis.value;
  const posiciones = new Map(flowNodes.value.map((n) => [n.id, n.position]));

  const nodes: Node[] = notas.map((nota, index) => ({
    id: nota.id,
    type: "ai-analysis-note",
    position: posiciones.get(nota.id) ?? {
      x: 40 + (index % 3) * 270,
      y: 40 + Math.floor(index / 3) * 190,
    },
    data: { ...nota },
  }));
  flowNodes.value = nodes;

  const edges: Edge[] = [];
  for (let i = 0; i < notas.length - 1; i++) {
    const nota = notas[i];
    const siguiente = notas[i + 1];
    if (!nota || !siguiente) continue;
    edges.push({
      id: `edge-${nota.id}-${siguiente.id}`,
      source: nota.id,
      target: siguiente.id,
      type: "smoothstep",
      animated: true,
      style: { stroke: "#0d9e6e", strokeWidth: 2 },
    });
  }
  flowEdges.value = edges;

  if (notaDetalleFlow.value) {
    const actualizada = notas.find((n) => n.id === notaDetalleFlow.value?.id);
    notaDetalleFlow.value = actualizada ?? null;
    if (!actualizada) {
      notaEditandoId.value = null;
      contextoEdicion.value = "";
    }
  }
}

function abrirDetalleNotaFlow(nota: AiAnalysisNote, editarContexto = false) {
  notaDetalleFlow.value = nota;
  if (editarContexto) {
    iniciarEdicionContexto(nota);
  }
}

function cerrarDetalleNotaFlow() {
  notaDetalleFlow.value = null;
  notaEditandoId.value = null;
  contextoEdicion.value = "";
}

const detalleHtml = computed(() =>
  renderClinicalMarkdown(md, seleccionado.value?.content),
);

const redaccionHtml = computed(() => {
  const raw = textoRedaccionNotas.value?.trim();
  if (!raw) return "";
  return renderClinicalMarkdown(md, raw, "");
});

const redaccionNotaDetalleHtml = computed(() =>
  renderClinicalMarkdown(md, redaccionNotaSeleccionada.value?.content),
);

const puedeGuardarRedaccion = computed(
  () =>
    !!textoRedaccionNotas.value?.trim() &&
    !!seleccionado.value &&
    !guardandoRedaccion.value &&
    !redactandoNotas.value,
);

function construirPromptRedaccionNotas(
  analysis: AiDocumentAnalysisListItem,
  notas: AiAnalysisNote[],
): string {
  const bloquesNotas = notas
    .map(
      (n, i) =>
        `#### Nota ${i + 1} (${n.colorName})\n- **Contenido:** ${n.content}\n- **Contexto adicional:** ${n.context?.trim() || "—"}`,
    )
    .join("\n\n");

  const extractoAnalisis =
    analysis.content.length > 6000
      ? `${analysis.content.slice(0, 6000)}\n\n[… análisis truncado …]`
      : analysis.content;

  return `Actúa como redactor clínico especializado en documentación de salud.

Tienes el **análisis previo del documento** y un conjunto de **notas** tomadas por el usuario. Redacta un texto único, coherente y profesional en español que:

1. Integre y sintetice las ideas de todas las notas.
2. Se alinee con el análisis del documento sin contradecirlo.
3. Organice la información con títulos markdown (##, ###) y listas cuando ayude.
4. Destaque conclusiones, hallazgos clave y recomendaciones prácticas.
5. No inventes datos clínicos que no estén en las notas ni en el análisis.

---

**Análisis del documento (${analysis.original_filename ?? "sin nombre"}):**

${extractoAnalisis}

---

**Notas del usuario:**

${bloquesNotas}

---

Entrega solo el texto redactado en markdown, sin preámbulos meta.`;
}

async function redactarNotasConIA() {
  const analysis = seleccionado.value;
  const notas = notasDelAnalisis.value;
  if (!analysis || notas.length === 0) {
    alert("Crea al menos una nota antes de redactar con IA.");
    return;
  }

  redactandoNotas.value = true;
  errorRedaccion.value = null;
  menuFabAbierto.value = false;

  try {
    const prompt = construirPromptRedaccionNotas(analysis, notas);
    const respuesta = await useGetGenerativeModelGP(prompt);
    textoRedaccionNotas.value = respuesta?.trim() ?? "";
    if (!textoRedaccionNotas.value) {
      throw new Error("La IA no devolvió contenido para la redacción.");
    }
    vistaModal.value = "redaccion-ia";
    redaccionGuardada.value = false;
    redaccionIdGuardado.value = null;
    mensajeGuardadoRedaccion.value = "";
    errorGuardadoRedaccion.value = false;
  } catch (e) {
    errorRedaccion.value =
      e instanceof Error ? e.message : "Error al redactar con IA";
    alert(`Error al redactar: ${errorRedaccion.value}`);
  } finally {
    redactandoNotas.value = false;
  }
}

async function guardarRedaccionModal() {
  const analysis = seleccionado.value;
  const texto = textoRedaccionNotas.value?.trim();
  if (!analysis || !texto) return;

  const token = localStorage.getItem("auth_token");
  if (!token) {
    const msg = "Debes iniciar sesión para guardar la redacción. Ve a /login.";
    alert(msg);
    return;
  }

  guardandoRedaccion.value = true;
  mensajeGuardadoRedaccion.value = "";
  errorGuardadoRedaccion.value = false;

  const payload = {
    document_upload_id: analysis.document_upload_id,
    analysis_id: analysis.id,
    content: texto,
    model: GEMINI_MODEL_NAME,
    notes_count: notasDelAnalisis.value.length,
    original_filename: analysis.original_filename ?? tituloCard(analysis),
    ...(redaccionIdGuardado.value
      ? { redaction_id: redaccionIdGuardado.value }
      : {}),
  };

  try {
    const data = await saveAiDocumentRedaction(payload);
    if (data?.id) redaccionIdGuardado.value = data.id;
    redaccionGuardada.value = true;
    mensajeGuardadoRedaccion.value = "Redacción guardada correctamente.";
    alert("La redacción con IA se guardó correctamente.");
    await cargarRedaccionesNotas();
  } catch (err) {
    const msg = readAiAnalysesApiError(err);
    errorGuardadoRedaccion.value = true;
    mensajeGuardadoRedaccion.value = msg;
    alert(`Error al guardar: ${msg}`);
  } finally {
    guardandoRedaccion.value = false;
  }
}

function tienePaciente(item: AiDocumentAnalysisListItem): boolean {
  return Boolean(item.patient_name?.trim());
}

function nombrePaciente(item: AiDocumentAnalysisListItem): string {
  const nombre = item.patient_name?.trim();
  if (nombre) return nombre;
  return "Paciente no asignado";
}

function subtituloPaciente(item: AiDocumentAnalysisListItem): string | null {
  const tipo = item.patient_document_type?.trim();
  const numero = item.patient_document_number?.trim();
  if (tipo && numero) return `${tipo} ${numero}`;
  if (numero) return numero;
  if (tipo) return tipo;
  return null;
}

function etiquetaPacienteCompleta(item: AiDocumentAnalysisListItem): string {
  const partes = [nombrePaciente(item)];
  const sub = subtituloPaciente(item);
  if (sub) partes.push(sub);
  return partes.join(" · ");
}

function tituloCard(item: AiDocumentAnalysisListItem): string {
  if (item.original_filename) return item.original_filename;
  if (item.document_upload_id) {
    return `Documento ${item.document_upload_id.slice(0, 8)}…`;
  }
  return `Análisis ${item.id.slice(0, 8)}…`;
}

function resumenCard(content: string): string {
  const plain = content
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*|__/g, "")
    .replace(/\n+/g, " ")
    .trim();
  if (plain.length <= 160) return plain || "Sin vista previa.";
  return `${plain.slice(0, 160)}…`;
}

function formatearFecha(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("es", { dateStyle: "short", timeStyle: "short" });
}

function formatearFechaBadge(iso: string | null): string {
  if (!iso) return "Sin fecha";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function etiquetaModelo(model: string | null | undefined): string {
  if (!model?.trim()) return "";
  const limpio = model.trim();
  if (limpio.length <= 32) return limpio;
  return `${limpio.slice(0, 30)}…`;
}

function claseIconoHoja(item: AiDocumentAnalysisListItem): string {
  const ext = extensionDocumento(item);
  if (ext === "pdf") return "analysis-sheet-icon--pdf";
  if (ext === "doc" || ext === "docx") return "analysis-sheet-icon--word";
  return "analysis-sheet-icon--default";
}

function extensionDocumento(item: AiDocumentAnalysisListItem): string {
  const name = item.original_filename?.toLowerCase() ?? "";
  if (name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".docx")) return "docx";
  if (name.endsWith(".doc")) return "doc";
  return "";
}

function etiquetaTipoDocumento(item: AiDocumentAnalysisListItem): string {
  const ext = extensionDocumento(item);
  if (ext === "pdf") return "PDF";
  if (ext === "doc" || ext === "docx") return "Word";
  return "Documento";
}

function claseTipoDocumento(item: AiDocumentAnalysisListItem): string {
  const ext = extensionDocumento(item);
  if (ext === "pdf") return "bg-red-50 text-red-700";
  if (ext === "doc" || ext === "docx") return "bg-blue-50 text-blue-700";
  return "bg-emerald-50 text-emerald-700";
}

function etiquetaEstado(status: string): string {
  const map: Record<string, string> = {
    pending: "Pendiente",
    processing: "Procesando",
    completed: "Generado",
    analyzed: "Revisado",
    uploaded: "Generado",
    failed: "Error",
    error: "Error",
  };
  return map[status] ?? status;
}

function claseEstado(status: string): string {
  const map: Record<string, string> = {
    pending: "bg-amber-50 text-amber-800",
    processing: "bg-blue-50 text-blue-700",
    completed: "bg-blue-50 text-blue-700",
    uploaded: "bg-blue-50 text-blue-700",
    analyzed: "bg-emerald-50 text-emerald-700",
    failed: "bg-red-50 text-red-700",
    error: "bg-red-50 text-red-700",
  };
  return map[status] ?? "bg-slate-100 text-slate-600";
}

function abrirDetalle(item: AiDocumentAnalysisListItem) {
  seleccionado.value = item;
  cargarNotas(item.id);
  resetEstadoNotas();
  modalAbierto.value = true;
  void cargarRedaccionesNotas();
}

function cerrarModal() {
  modalAbierto.value = false;
  seleccionado.value = null;
  resetEstadoNotas();
}

function toggleMenuFab() {
  menuFabAbierto.value = !menuFabAbierto.value;
}

function seleccionarColorNota(color: AiAnalysisNoteColor) {
  colorNotaSeleccionado.value = color;
}

function irACrearNota() {
  if (!colorNotaSeleccionado.value) return;
  menuFabAbierto.value = false;
  vistaModal.value = "crear-nota";
}

function cancelarCrearNota() {
  nuevaNotaContent.value = "";
  nuevaNotaContext.value = "";
  vistaModal.value = notasDelAnalisis.value.length > 0 ? "notas" : "analisis";
}

function guardarNuevaNota() {
  const analysis = seleccionado.value;
  const color = colorNotaSeleccionado.value;
  const content = nuevaNotaContent.value.trim();
  if (!analysis || !color || !content) return;

  const now = new Date().toISOString();
  const nota: AiAnalysisNote = {
    id: crypto.randomUUID(),
    analysisId: analysis.id,
    content,
    context: nuevaNotaContext.value.trim(),
    colorName: color.name,
    bgClass: color.bgClass,
    borderClass: color.borderClass,
    textClass: color.textClass,
    createdAt: now,
    updatedAt: now,
  };

  const list = [...(notasPorAnalisis.value[analysis.id] ?? []), nota];
  notasPorAnalisis.value[analysis.id] = list;
  persistirNotas(analysis.id);

  nuevaNotaContent.value = "";
  nuevaNotaContext.value = "";
  colorNotaSeleccionado.value = null;
  vistaModal.value = "notas";
  sincronizarFlowNotas();
}

function toggleListaNotas() {
  if (vistaModal.value === "notas" || vistaModal.value === "crear-nota") {
    vistaModal.value = "analisis";
    panelAnalisisVisible.value = false;
    cerrarDetalleNotaFlow();
  } else {
    menuFabAbierto.value = false;
    vistaModal.value = "notas";
    sincronizarFlowNotas();
  }
}

function iniciarEdicionContexto(nota: AiAnalysisNote) {
  notaEditandoId.value = nota.id;
  contextoEdicion.value = nota.context;
}

function guardarContextoNota(notaId: string) {
  const analysisId = seleccionado.value?.id;
  if (!analysisId) return;

  const list = notasPorAnalisis.value[analysisId];
  if (!list) return;

  const idx = list.findIndex((n) => n.id === notaId);
  const item = list[idx];
  if (idx === -1 || !item) return;

  list[idx] = {
    ...item,
    context: contextoEdicion.value.trim(),
    updatedAt: new Date().toISOString(),
  };
  persistirNotas(analysisId);
  notaEditandoId.value = null;
  contextoEdicion.value = "";
  sincronizarFlowNotas();
}

function eliminarNota(notaId: string) {
  const analysisId = seleccionado.value?.id;
  if (!analysisId) return;
  if (!confirm("¿Eliminar esta nota?")) return;

  notasPorAnalisis.value[analysisId] = (
    notasPorAnalisis.value[analysisId] ?? []
  ).filter((n) => n.id !== notaId);
  persistirNotas(analysisId);
  if (notaDetalleFlow.value?.id === notaId) {
    cerrarDetalleNotaFlow();
  }
  sincronizarFlowNotas();
}

watch(notasDelAnalisis, () => {
  if (vistaModal.value === "notas") {
    sincronizarFlowNotas();
  }
});

watch(vistaModal, (vista) => {
  if (vista === "notas") {
    sincronizarFlowNotas();
    return;
  }
  cerrarDetalleNotaFlow();
  if (!VISTAS_MODAL_EXPANDIBLE.includes(vista)) {
    modalExpandido.value = false;
  }
});

watch(modalAbierto, (abierto) => {
  if (!abierto) resetEstadoNotas();
});

async function cargar() {
  cargando.value = true;
  error.value = null;
  try {
    const [items, documentos] = await Promise.all([
      listAiDocumentAnalyses(),
      listAiDocuments().catch(() => [] as AiDocumentUploadRow[]),
    ]);
    analisis.value = enriquecerAnalisisConPaciente(items, documentos);
  } catch (e) {
    error.value = readAiAnalysesApiError(e);
  } finally {
    cargando.value = false;
  }
}

onMounted(() => {
  cargar();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@import "./aiClinicalTypography.css";

/* v-html: estilos en contenido generado */
.ai-clinical-typography :deep(.ai-clinical-cards) {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.ai-clinical-typography :deep(.ai-clinical-card) {
  background-color: #fff;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.ai-clinical-typography :deep(.ai-clinical-card > h2) {
  font-size: 22px;
  line-height: 1.4;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem !important;
  padding-bottom: 0.65rem;
  border-bottom: 1px solid #f1f5f9;
}

.ai-clinical-typography :deep(.ai-clinical-card > h1) {
  font-size: 28px;
  line-height: 1.35;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.ai-clinical-typography :deep(.ai-clinical-card-body) {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ai-clinical-typography :deep(h1) {
  font-size: 28px;
  line-height: 1.35;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
  margin: 0 0 0.85em;
  padding-bottom: 0.35em;
  border-bottom: 1px solid #e2e8f0;
}

.ai-clinical-typography :deep(h2) {
  font-size: 22px;
  line-height: 1.4;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: -0.01em;
  margin: 1.75em 0 0.55em;
}

.ai-clinical-typography :deep(h2:first-child) {
  margin-top: 0;
}

.ai-clinical-typography :deep(h3) {
  font-size: 18px;
  line-height: 1.45;
  font-weight: 600;
  color: #334155;
  letter-spacing: -0.01em;
  margin: 0 0 0.35em;
}

.ai-clinical-typography :deep(h4) {
  font-size: 16px;
  line-height: 1.5;
  font-weight: 600;
  color: #334155;
  margin: 0 0 0.25em;
}

.ai-clinical-typography :deep(p) {
  font-size: 16px;
  line-height: 1.9;
  letter-spacing: -0.01em;
  color: #475569;
  margin: 0;
}

.ai-clinical-typography :deep(ul),
.ai-clinical-typography :deep(ol) {
  font-size: 16px;
  line-height: 1.9;
  letter-spacing: -0.01em;
  color: #475569;
  margin: 0;
  padding-left: 1.35em;
}

.ai-clinical-typography :deep(li) {
  margin: 0.35em 0;
}

.ai-clinical-typography :deep(li > p) {
  margin: 0.25em 0;
}

.ai-clinical-typography :deep(p strong),
.ai-clinical-typography :deep(li strong) {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  letter-spacing: 0.01em;
}

.ai-clinical-typography :deep(h1 strong),
.ai-clinical-typography :deep(h2 strong),
.ai-clinical-typography :deep(h3 strong),
.ai-clinical-typography :deep(h4 strong) {
  font-size: inherit;
  color: inherit;
  letter-spacing: inherit;
}

.ai-clinical-typography :deep(hr) {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 0.5em 0;
}

.ai-clinical-typography :deep(code) {
  font-size: 0.9em;
  background: #f4f4f5;
  padding: 0.1em 0.35em;
  border-radius: 4px;
  color: #334155;
}

.ai-clinical-typography :deep(pre) {
  background: #1e293b;
  color: #f8fafc;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

.ai-clinical-typography :deep(pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
}

.ai-clinical-typography :deep(blockquote) {
  border-left: 3px solid #0d9e6e;
  padding-left: 0.85rem;
  margin: 0;
  font-size: 16px;
  line-height: 1.9;
  letter-spacing: -0.01em;
  color: #64748b;
  font-style: italic;
}

.ai-clinical-typography :deep(a) {
  color: #0d9e6e;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.ai-clinical-typography :deep(table) {
  width: 100%;
  font-size: 13px;
  line-height: 1.6;
  border-collapse: collapse;
  margin: 0;
}

.ai-clinical-typography :deep(th) {
  font-weight: 600;
  color: #334155;
  text-align: left;
  padding: 0.5em 0.65em;
  border-bottom: 1px solid #e2e8f0;
}

.ai-clinical-typography :deep(td) {
  padding: 0.45em 0.65em;
  border-bottom: 1px solid #f1f5f9;
  color: #475569;
}

.ai-notes-flow :deep(.vue-flow__node) {
  cursor: grab;
}

.ai-notes-flow :deep(.vue-flow__node:active) {
  cursor: grabbing;
}

/* —— Tarjetas tipo hoja (estilo documento minimalista) —— */
.analysis-sheet-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  text-align: left;
  border: 1px solid #e4e9ef;
  border-radius: 10px 12px 12px 10px;
  background: linear-gradient(168deg, #ffffff 0%, #fbfcfd 55%, #f6f8fa 100%);
  box-shadow:
    0 1px 2px rgb(15 23 42 / 4%),
    0 10px 28px rgb(15 23 42 / 5%),
    2px 4px 0 #e8ecf1;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;
  cursor: pointer;
}

.analysis-sheet-card:focus {
  outline: none;
}

.analysis-sheet-card:focus-visible {
  box-shadow:
    0 0 0 2px #fff,
    0 0 0 4px rgb(13 158 110 / 35%),
    0 10px 28px rgb(15 23 42 / 6%),
    2px 4px 0 #e8ecf1;
}

.analysis-sheet-card:hover {
  transform: translateY(-3px);
  border-color: #d8e0e9;
  box-shadow:
    0 2px 4px rgb(15 23 42 / 5%),
    0 16px 36px rgb(15 23 42 / 8%),
    3px 5px 0 #e2e8f0;
}

.analysis-sheet-card--compact {
  height: auto;
  border-radius: 8px 10px 10px 8px;
  box-shadow:
    0 1px 2px rgb(15 23 42 / 4%),
    0 6px 16px rgb(15 23 42 / 4%),
    1px 3px 0 #e8ecf1;
}

.analysis-sheet-card--compact:hover {
  transform: translateY(-2px);
}

.analysis-sheet-card__fold {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  width: 2rem;
  height: 2rem;
  pointer-events: none;
  border-bottom-left-radius: 4px;
  background: linear-gradient(
    135deg,
    transparent 48%,
    #f1f5f9 48%,
    #e8edf3 100%
  );
}

.analysis-sheet-card__inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.25rem 1.35rem 1.15rem;
}

.analysis-sheet-card--compact .analysis-sheet-card__inner {
  padding: 1rem 1.1rem 0.95rem;
}

.analysis-date-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 6px;
  border: 1px solid #d4e3f2;
  background: #e9f2fa;
  padding: 0.2rem 0.55rem;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: #5a7d96;
  line-height: 1.35;
}

.analysis-model-badge {
  display: inline-flex;
  max-width: 100%;
  align-items: center;
  border-radius: 6px;
  border: 1px solid #e8eaee;
  background: #f3f4f6;
  padding: 0.2rem 0.55rem;
  font-size: 11px;
  font-weight: 500;
  color: #6b7280;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.analysis-sheet-icon {
  position: relative;
  flex-shrink: 0;
  width: 2.75rem;
  height: 3.5rem;
  border-radius: 7px;
  border: 1px solid #e8ecf0;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  box-shadow:
    0 1px 2px rgb(15 23 42 / 5%),
    1px 2px 0 #e8ecf0;
}

.analysis-sheet-icon__fold {
  position: absolute;
  top: 0;
  right: 0;
  width: 0.85rem;
  height: 0.85rem;
  border-bottom-left-radius: 3px;
  background: linear-gradient(135deg, transparent 50%, #eef2f6 50%);
}

.analysis-sheet-icon__line {
  position: absolute;
  left: 0.45rem;
  right: 0.55rem;
  top: 0.95rem;
  height: 2px;
  border-radius: 9999px;
  background: #e2e8f0;
}

.analysis-sheet-icon__line--short {
  top: 1.35rem;
  right: 1rem;
}

.analysis-sheet-icon__line--shorter {
  top: 1.75rem;
  right: 1.35rem;
}

.analysis-sheet-icon__type {
  position: absolute;
  bottom: 0.3rem;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 7px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
}

.analysis-sheet-icon--pdf {
  border-color: #f5d0d0;
  background: linear-gradient(180deg, #fff 0%, #fff8f8 100%);
}

.analysis-sheet-icon--pdf .analysis-sheet-icon__line {
  background: #fecaca;
}

.analysis-sheet-icon--pdf .analysis-sheet-icon__type {
  color: #c45c5c;
}

.analysis-sheet-icon--word {
  border-color: #cfe0f5;
  background: linear-gradient(180deg, #fff 0%, #f5f9ff 100%);
}

.analysis-sheet-icon--word .analysis-sheet-icon__line {
  background: #bfdbfe;
}

.analysis-sheet-icon--word .analysis-sheet-icon__type {
  color: #4a7ab8;
}

.analysis-sheet-icon--default .analysis-sheet-icon__type {
  color: #64748b;
}

.analysis-sheet-preview {
  font-size: 13px;
  line-height: 1.65;
  color: #64748b;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.analysis-sheet-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.1rem;
  padding-top: 0.85rem;
  border-top: 1px solid #eef2f6;
}

.analysis-sheet-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 12px;
  font-weight: 600;
  color: #0d9e6e;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.analysis-sheet-card:hover .analysis-sheet-cta {
  color: #0a7d58;
  transform: translateX(2px);
}

.analysis-patient-row {
  display: inline-flex;
  max-width: 100%;
  align-items: center;
  gap: 0.35rem;
  border-radius: 6px;
  border: 1px solid transparent;
  padding: 0.2rem 0.45rem;
  font-size: 11px;
  line-height: 1.35;
}

.analysis-patient-row--assigned {
  border-color: #d1fae5;
  background: #f0fdf8;
  color: #3d6b58;
}

.analysis-patient-row--empty {
  border-color: #e8ecf0;
  background: #f8fafc;
  color: #94a3b8;
  font-style: italic;
}
</style>
