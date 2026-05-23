<template>
  <Teleport to="body">
  <Transition name="app-modal">
    <div v-if="isOpen" class="app-modal-root">
      <div class="app-modal-backdrop" aria-hidden="true" @click="close" />
      <div class="app-modal-scrim app-modal-scrim--sheet" @click.self="close">
        <div class="app-modal-panel app-modal-panel--sheet relative bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      style="width: 90vw; height: 85vh"
     role="dialog" aria-modal="true" @click.stop>
      <header
        class="app-modal-header flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600"
      >
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Notas de la investigación
        </h2>
        <button
          @click="close"
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-all text-white"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </header>

      <div class="app-modal-body flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Loading State -->
        <div
          v-if="loading"
          class="flex flex-col items-center justify-center py-12"
        >
          <div
            class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"
          ></div>
          <p class="mt-4 text-gray-600">Cargando notas...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div
            class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p class="text-gray-700 mb-4">{{ error }}</p>
          <button
            @click="fetchNotes"
            class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="notes.length === 0" class="text-center py-12">
          <div
            class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p class="text-gray-500">
            Esta investigación no tiene notas registradas.
          </p>
        </div>

        <!-- Vue Flow Graph -->
        <div v-else>
          <div
            style="height: 420px"
            class="border border-gray-200 rounded-xl overflow-hidden"
          >
            <VueFlow
              v-model="elements"
              :default-zoom="1"
              :min-zoom="0.2"
              :max-zoom="4"
              :nodes-draggable="true"
              :nodes-connectable="false"
              class="vue-flow-container"
            >
              <Background pattern-color="#E5E7EB" :gap="20" />
              <MiniMap />
              <Controls />

              <template #node-note="props">
                <NoteNode
                  :data="props.data"
                  @expand="openNoteDetail(props.data)"
                  @addContext="openAddContextModal(props.data)"
                />
              </template>
            </VueFlow>
          </div>

          <!-- AI Analysis Button -->
          <div class="mt-6 text-center">
            <button
              v-if="
                notes.length > 0 &&
                !aiAnalysis &&
                analysis &&
                analysis.notesCount <= 0
              "
              @click="analyzeNotes"
              :disabled="analyzing"
              class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all shadow-md"
            >
              <svg
                v-if="!analyzing"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              <svg
                v-else
                class="w-5 h-5 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {{ analyzing ? "Analizando..." : "Analizar notas con IA" }}
            </button>
          </div>

          <!-- AI Analysis Error -->
          <div v-if="aiError" class="mt-4 text-center">
            <div
              class="inline-flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl"
            >
              <svg
                class="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span class="text-red-700">{{ aiError }}</span>
              <button
                @click="analyzeNotes"
                class="ml-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>

          <!-- AI Analysis Section -->
          <div
            class="mt-6 rounded-xl border border-indigo-100 bg-white shadow-sm overflow-hidden"
          >
            <!-- Estado: Cargando -->
            <div
              v-if="isLoading"
              class="flex flex-col items-center justify-center py-8 px-4"
            >
              <div
                class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"
              ></div>
              <p class="mt-3 text-sm text-gray-600">Cargando análisis...</p>
            </div>

            <!-- Estado: Sin análisis disponible (404) -->
            <div
              v-else-if="analysisError === 'no_data'"
              class="py-6 px-4 text-center"
            >
              <div
                class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3"
              >
                <svg
                  class="w-6 h-6 text-gray-400"
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
              </div>
              <p class="text-sm text-gray-600">
                Aún no hay análisis generado para esta investigación. Puedes
                generarlo usando el botón <strong>"Analizar con IA"</strong>.
              </p>
            </div>

            <!-- Estado: Error de servidor -->
            <div
              v-else-if="analysisError === 'server_error'"
              class="py-6 px-4 text-center"
            >
              <div
                class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"
              >
                <svg
                  class="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p class="text-sm text-gray-600 mb-3">
                No se pudo cargar el análisis. Verifica tu conexión e intenta de
                nuevo.
              </p>
              <button
                @click="fetchAnalysis"
                class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-lg transition-colors"
              >
                Reintentar
              </button>
            </div>

            <!-- Estado: Datos cargados -->
            <div v-else-if="analysis" class="divide-y divide-gray-100">
              <!-- Header con badge -->
              <div class="flex items-center gap-2 px-5 py-3 bg-slate-50">
                <svg
                  class="w-4 h-4 text-white/80"
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
                <div v-if="analysis.analysis == null">
                  <span class="text-white text-sm"
                    >No se encuentran análisis, puede seguir analisis sus notas
                    tranquilamente.</span
                  >
                </div>
                <div v-else>
                  Análisis IA
                  <span class="ml-auto text-xs text-white/70"
                    >{{ analysis.notesCount }} notas</span
                  >
                  <div class="px-5 py-4">
                    <h4
                      class="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2"
                    >
                      Resumen
                    </h4>
                    <span
                      class="text-sm text-gray-700 leading-relaxed px-3 py-0.5 font-medium"
                    >
                      <div
                        class="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
                        v-html="
                          renderMarkdown(analysis?.analysis?.summary ?? '') ??
                          '<p>Sin resumen disponible</p>'
                        "
                      ></div>
                    </span>
                  </div>

                  <!-- Botón Guardar Análisis -->
                  <div class="px-5 py-4 bg-gray-50 border-t border-gray-100">
                    <button
                      @click="saveAIAnalysis"
                      :disabled="savingAnalysis"
                      class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <svg
                        v-if="!savingAnalysis"
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                      </svg>
                      <svg
                        v-else
                        class="w-4 h-4 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      {{ savingAnalysis ? "Guardando..." : "Guardar análisis" }}
                    </button>
                    <!-- Mensaje de Error -->
                    <div
                      v-if="saveAnalysisError"
                      class="mt-3 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <svg
                        class="w-4 h-4 text-red-500 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span class="text-xs text-red-700 font-medium">{{
                        saveAnalysisError
                      }}</span>
                    </div>

                    <!-- Mensaje de Éxito -->
                    <div
                      v-if="saveAnalysisSuccess"
                      class="mt-3 flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg"
                    >
                      <svg
                        class="w-4 h-4 text-emerald-500 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span class="text-xs text-emerald-700 font-medium"
                        >Análisis guardado correctamente</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- AI Analysis Result (análisis recién generado) -->
            <div v-else-if="aiAnalysis" class="bg-slate-50 py-6 space-y-5">
              <!-- ── Encabezado principal ────────────────────────────────── -->
              <div class="max-w-4xl mx-auto px-6">
                <div class="flex items-start gap-4">
                  <div
                    class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <svg
                      class="w-5 h-5 text-indigo-600"
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
                  </div>
                  <div class="flex-1 min-w-0">
                    <h2 class="text-3xl font-bold text-slate-800 leading-tight">
                      Análisis IA
                    </h2>
                    <p class="text-sm text-slate-500 mt-1">
                      Análisis generado automáticamente a partir de tus notas de
                      investigación
                    </p>
                    <div class="flex items-center gap-2 mt-3">
                      <span
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full"
                      >
                        <span
                          class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"
                        ></span>
                        Nuevo
                      </span>
                      <span class="text-xs text-slate-400">
                        {{ parsedSections.length }} sección{{
                          parsedSections.length !== 1 ? "es" : ""
                        }}
                        detectada{{ parsedSections.length !== 1 ? "s" : "" }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Divisor -->
              <div class="h-px bg-slate-200 mx-6"></div>

              <!-- ── Tarjeta por sección parseada ───────────────────────── -->
              <template v-if="parsedSections.length > 0">
                <div
                  v-for="section in parsedSections"
                  :key="section.id"
                  class="max-w-4xl mx-auto px-6"
                >
                  <div
                    class="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
                  >
                    <!-- Cabecera de sección con acento de color -->
                    <div
                      :class="[
                        'flex items-center gap-3 px-6 py-4 border-b',
                        section.meta.bg,
                        section.meta.border,
                      ]"
                    >
                      <span
                        :class="[
                          'inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0',
                          section.meta.numberBg,
                        ]"
                      >
                        {{ section.number }}
                      </span>
                      <h3
                        class="text-xl font-semibold text-slate-800 flex-1 min-w-0 truncate"
                      >
                        {{ section.label }}
                      </h3>
                      <span
                        :class="[
                          'hidden sm:inline text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0',
                          section.meta.badge,
                        ]"
                      >
                        {{ section.rawTitle }}
                      </span>
                    </div>
                    <!-- Contenido HTML renderizado desde markdown -->
                    <div class="px-6 py-6">
                      <div
                        class="max-w-3xl ai-prose"
                        v-html="section.html"
                      ></div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Fallback: si no hay secciones detectadas renderizar todo -->
              <div v-else class="max-w-4xl mx-auto px-6">
                <div
                  class="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
                >
                  <div
                    class="flex items-center gap-3 px-6 py-4 border-b border-slate-100"
                  >
                    <h3 class="text-xl font-semibold text-slate-800">
                      Resumen ejecutivo
                    </h3>
                  </div>
                  <div class="px-6 py-6">
                    <div
                      class="max-w-3xl ai-prose"
                      v-html="summaryAI.render(aiAnalysis || '')"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- ── Acciones ───────────────────────────────────────────── -->
              <div class="max-w-4xl mx-auto px-6 pb-2">
                <div
                  class="bg-white border border-slate-200 rounded-3xl shadow-sm p-5"
                >
                  <h3
                    class="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2"
                  >
                    <svg
                      class="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Acciones
                  </h3>

                  <button
                    @click="saveAIAnalysis"
                    :disabled="savingAnalysis"
                    class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                  >
                    <svg
                      v-if="!savingAnalysis"
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                    <svg
                      v-else
                      class="w-4 h-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    {{ savingAnalysis ? "Guardando..." : "Guardar análisis" }}
                  </button>

                  <!-- Mensaje de Error -->
                  <div
                    v-if="saveAnalysisError"
                    class="mt-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <svg
                      class="w-4 h-4 text-red-500 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span class="text-sm text-red-700 font-medium">{{
                      saveAnalysisError
                    }}</span>
                  </div>

                  <!-- Mensaje de Éxito -->
                  <div
                    v-if="saveAnalysisSuccess"
                    class="mt-4 flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl"
                  >
                    <svg
                      class="w-4 h-4 text-emerald-500 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="text-sm text-emerald-700 font-medium"
                      >Análisis guardado correctamente</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Teleport to="body">
        <Transition name="app-modal">
          <div
            v-if="showContextModal && noteToAddContext"
            class="app-modal-root"
            style="z-index: 55"
          >
            <div class="app-modal-backdrop" aria-hidden="true" @click="closeContextModal" />
            <div class="app-modal-scrim app-modal-scrim--sheet" @click.self="closeContextModal">
              <div
                class="app-modal-panel app-modal-panel--sheet relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
                role="dialog"
                aria-modal="true"
                @click.stop
              >
          <header
            class="app-modal-header flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-emerald-50"
          >
            <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
              <svg
                class="w-5 h-5 text-emerald-600"
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
              Agregar Contexto
            </h3>
            <button
              @click="closeContextModal"
              class="p-2 hover:bg-black/10 rounded-lg transition-colors"
            >
              <svg
                class="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </header>
          <div class="app-modal-body p-6">
            <p class="text-sm text-gray-600 mb-4">
              Agrega contexto adicional a
              <strong>{{ noteToAddContext.title }}</strong
              >:
            </p>
            <textarea
              v-model="contextText"
              rows="4"
              placeholder="Escribe el contexto adicional para esta nota..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-gray-700"
            ></textarea>
          </div>
          <footer
            class="app-modal-footer px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3"
          >
            <button
              @click="closeContextModal"
              class="app-modal-btn px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="saveContext"
              class="app-modal-btn px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Guardar
            </button>
          </footer>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <Teleport to="body">
        <Transition name="app-modal">
          <div
            v-if="showNoteModal && selectedNote"
            class="app-modal-root"
            style="z-index: 55"
          >
            <div class="app-modal-backdrop" aria-hidden="true" @click="closeNoteModal" />
            <div class="app-modal-scrim app-modal-scrim--sheet" @click.self="closeNoteModal">
              <div
                class="app-modal-panel app-modal-panel--sheet relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                role="dialog"
                aria-modal="true"
                @click.stop
              >
          <header
            class="app-modal-header flex items-center justify-between px-6 py-4 border-b border-gray-200"
            :class="selectedNote.color || 'bg-gray-50'"
          >
            <h3 class="text-lg font-bold text-gray-800">
              {{ selectedNote.title || "Nota" }}
            </h3>
            <button
              @click="closeNoteModal"
              class="p-2 hover:bg-black/10 rounded-lg transition-colors"
            >
              <svg
                class="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </header>
          <div class="app-modal-body p-6 overflow-y-auto max-h-[60vh]">
            <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {{ selectedNote.content }}
            </p>
          </div>
          <footer
            class="app-modal-footer px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between"
          >
            <span class="text-sm text-gray-500">{{
              formatDate(selectedNote.createdAt)
            }}</span>
            <button
              @click="closeNoteModal"
              class="app-modal-btn px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </footer>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import axios from "axios";
import MarkdownIt from "markdown-it";
import { useGetGenerativeModelGP } from "../../shared/service/useGetGenerativeModelGP";
import { VueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { MiniMap } from "@vue-flow/minimap";
import { Controls } from "@vue-flow/controls";
import "@vue-flow/core/dist/style.css";
import NoteNode from "./NoteNode.vue";

interface Note {
  id?: string;
  id_note?: string;
  idNote?: string;
  text?: string;
  content?: string;
  color: string;
  startOffset?: number;
  endOffset?: number;
  createdAt?: string;
  created_at?: string;
  title?: string;
  context?: string;
}

const props = defineProps<{
  isOpen: boolean;
  researchId: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const summaryAI = new MarkdownIt();

const md = new MarkdownIt();

const renderMarkdown = (content: string): string => {
  return md.render(content);
};

const notes = ref<Note[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const analyzing = ref(false);
const aiAnalysis = ref<string | undefined>(undefined);
const aiError = ref<string | null>(null);
const selectedNote = ref<(Note & { title: string }) | null>(null);
const showNoteModal = ref(false);
const noteToAddContext = ref<(Note & { title: string }) | null>(null);
const showContextModal = ref(false);
const contextText = ref("");
const savingAnalysis = ref(false);
const saveAnalysisError = ref<string | null>(null);
const saveAnalysisSuccess = ref(false);

// Variables para carga de análisis existente
const analysis = ref<{
  researchId: string;
  analysis: {
    summary: string;
    generatedAt: string;
    model: string;
  };
  notesCount: number;
  notesReferences: Array<{
    id: string;
    createdAt: string;
    updatedAt: string;
  }>;
} | null>(null);
const isLoading = ref(false);
const analysisError = ref<"no_data" | "server_error" | null>(null);

const fetchAnalysis = async () => {
  if (!props.researchId) return;

  isLoading.value = true;
  analysisError.value = null;

  try {
    const response = await axios.get(
      `http://localhost:3000/api/v1/research-analysis/research/${props.researchId}`,
    );
    analysis.value = response.data[0];
  } catch (error: any) {
    if (error.response?.status === 404) {
      analysisError.value = "no_data";
    } else {
      analysisError.value = "server_error";
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchAnalysis();
});

// ── Sección parser: divide el string de IA en tarjetas por ### ──────────────
const SECTION_META: Record<
  string,
  {
    label: string;
    bg: string;
    border: string;
    iconColor: string;
    badge: string;
    numberBg: string;
  }
> = {
  RESUMEN: {
    label: "Resumen ejecutivo",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    iconColor: "text-indigo-600",
    badge: "bg-indigo-100 text-indigo-700",
    numberBg: "bg-indigo-600 text-white",
  },
  ANÁLISIS: {
    label: "Análisis",
    bg: "bg-violet-50",
    border: "border-violet-100",
    iconColor: "text-violet-600",
    badge: "bg-violet-100 text-violet-700",
    numberBg: "bg-violet-600 text-white",
  },
  "TEMAS CLAVE": {
    label: "Temas clave",
    bg: "bg-sky-50",
    border: "border-sky-100",
    iconColor: "text-sky-600",
    badge: "bg-sky-100 text-sky-700",
    numberBg: "bg-sky-600 text-white",
  },
  CONEXIONES: {
    label: "Conexiones y patrones",
    bg: "bg-teal-50",
    border: "border-teal-100",
    iconColor: "text-teal-600",
    badge: "bg-teal-100 text-teal-700",
    numberBg: "bg-teal-600 text-white",
  },
  INVESTIGACI: {
    label: "Investigaciones externas",
    bg: "bg-amber-50",
    border: "border-amber-100",
    iconColor: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
    numberBg: "bg-amber-500 text-white",
  },
  RECOMENDACIONES: {
    label: "Recomendaciones IA",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    iconColor: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
    numberBg: "bg-emerald-600 text-white",
  },
};

const parsedSections = computed(() => {
  if (!aiAnalysis.value) return [];

  const chunks = aiAnalysis.value.split(/(?=###\s)/);
  const sections: {
    id: number;
    rawTitle: string;
    label: string;
    html: string;
    meta: (typeof SECTION_META)[string];
    number: number;
  }[] = [];
  let sectionIndex = 0;

  for (const chunk of chunks) {
    const headerMatch = chunk.match(
      /^###\s+(?:TAREA\s+\d+\s*[-–]\s*)?(.+?)(?:\n|$)/i,
    );
    if (headerMatch) {
      const rawTitle = (headerMatch[1] ?? "").trim();
      const body = chunk.replace(/^###\s+.+?(?:\n|$)/, "").trim();
      if (!body) continue;

      const titleUpper = rawTitle.toUpperCase();
      const metaEntry = Object.entries(SECTION_META).find(([key]) =>
        titleUpper.includes(key),
      );
      const meta = metaEntry?.[1] ?? {
        label: rawTitle,
        bg: "bg-slate-50",
        border: "border-slate-100",
        iconColor: "text-slate-600",
        badge: "bg-slate-100 text-slate-700",
        numberBg: "bg-slate-600 text-white",
      };

      sectionIndex++;
      sections.push({
        id: sectionIndex,
        rawTitle,
        label: metaEntry ? meta.label : rawTitle,
        html: summaryAI.render(body),
        meta,
        number: sectionIndex,
      });
    } else if (chunk.trim()) {
      // Texto introductorio antes del primer ###
      sectionIndex++;
      sections.push({
        id: 0,
        rawTitle: "Introducción",
        label: "Introducción",
        html: summaryAI.render(chunk.trim()),
        meta: SECTION_META["RESUMEN"]!,
        number: sectionIndex,
      });
    }
  }

  return sections;
});

const elements = computed(() => {
  const nodes = notes.value.map((note, index) => ({
    id: String(note.id_note || note.id || note.idNote || `note-${index}`),
    type: "note",
    position: {
      x: 50 + (index % 3) * 280,
      y: 50 + Math.floor(index / 3) * 160,
    },
    data: {
      id: String(note.id_note || note.id || note.idNote || `note-${index}`),
      title: `Nota ${index + 1}`,
      content: note.content || note.text || "",
      createdAt: note.createdAt || note.created_at || new Date().toISOString(),
      color: note.color,
      context: note.context,
    },
  }));

  const edges = notes.value.slice(0, -1).map((note, index) => {
    const nextNote = notes.value[index + 1];
    const sourceId = String(note.id_note || note.id || `note-${index}`);
    const targetId = nextNote
      ? String(nextNote.id_note || nextNote.id || `note-${index + 1}`)
      : "";
    return {
      id: `edge-${index}`,
      source: sourceId,
      target: targetId,
      type: "smoothstep",
      animated: true,
      style: { stroke: "#6366F1", strokeWidth: 2 },
    };
  });

  return [...nodes, ...edges];
});

const fetchNotes = async () => {
  if (!props.researchId) {
    error.value = "ID de investigación no válido";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get(
      `http://localhost:3000/api/v1/research-notes/research/${props.researchId}`,
    );
    if (Array.isArray(response.data)) {
      notes.value = response.data
        .map((item: any) => ({
          id: item.idNote || item.id_note || item.id,
          id_note: item.idNote || item.id_note || item.id,
          text: item.text,
          content: item.text,
          color: item.color,
          createdAt: item.createdAt || item.created_at,
        }))
        .sort((a: Note, b: Note) => {
          const dateA = new Date(a.createdAt || a.created_at || 0);
          const dateB = new Date(b.createdAt || b.created_at || 0);
          return dateA.getTime() - dateB.getTime();
        });
    } else {
      notes.value = [];
    }
  } catch (err: any) {
    console.error("[NotesModal] Error fetching notes:", err);
    error.value = "No se pudieron cargar las notas. Intenta de nuevo.";
  } finally {
    loading.value = false;
  }
};

const analyzeNotes = async () => {
  if (notes.value.length === 0) return;

  analyzing.value = true;
  aiError.value = null;

  try {
    const notesContent = notes.value
      .map(
        (note, index) =>
          `Nota ${index + 1} (${new Date(note.createdAt || note.created_at || 0).toLocaleDateString("es-ES")}): ${note.content || note.text}`,
      )
      .join("\n\n");

    const prompt = `Realiza las siguientes tareas sobre las notas de investigación que se
proporcionan al final de este mensaje::
- TAREA 1 - RESUMEN
  Escribe un resumen fiel y conciso del contenido de las notas.
  El resumen debe capturar los principales sin interpretación adicional.
  Extensión: Máximo 4 oraciones.
- TAREA 2 ANÁLISIS
  Escribe un resumén fiel y conciso del contenido de las notas.
  El resumen debe capturar los puntos principales sin interpretación adicional.
  Extensión: Máximo 4 oraciones.
- TAREA 3 TEMAS CLAVE
  Extrae entre 3 y 5 temas clave presentes en las notas.
  Cada tema debe ser una frase corta (máximo 10 palabras).
- TAREA 4 - CONEXIONES Y PATRONES
  Describe las relaciones, patrones o tensiones más relevantes que existen entre los temas identificados.

- TAREA 5 - INVESTIGACIÓN EXTERNA
  Amplia el análisis buscando información adicional sobre los temas clave.
  Para cada tema, identifica al menos una fuente confiable (articulo acádemicos, publicacion institucional, libro o sitio especializado)
  que respalde o profundice el contenido de las notas.

  Las fuentes debe cumplir estas condiciones:
  - Ser verificables y de origen confiable (universidades, organismom editoriales, journales)
  - Incluir: Titulo, Autor, Publicación, Año, URL
  - No inventes fuentes. Si no puedes verificar una fuente, indícalo con
    "fuentes no verificada - búsqueda sugerida: [término no búsqueda]"

- TAREA 6 - RECOMENDACIONES
  Proporciona una recomendación concreta y accionable basada en el análisis y en la investigación externa realizada.
${notesContent}

`;

    const responseText = await useGetGenerativeModelGP(prompt);

    try {
      // La respuesta ahora es texto libre, no JSON
      aiAnalysis.value = responseText as string;
    } catch (parseError) {
      console.error("[NotesModal] Analysis error:", parseError);
      aiError.value = "La respuesta del análisis tiene un formato inesperado.";
    }
  } catch (err: any) {
    console.error("[NotesModal] AI analysis error:", err);
    aiError.value =
      err.response?.data?.message ||
      "El análisis no pudo completarse. Intenta de nuevo.";
  } finally {
    analyzing.value = false;
  }
};

const close = () => {
  emit("close");
};

const openNoteDetail = (noteData: any) => {
  selectedNote.value = {
    ...noteData,
    title: noteData.title,
  };
  showNoteModal.value = true;
};

const closeNoteModal = () => {
  showNoteModal.value = false;
  selectedNote.value = null;
};

const openAddContextModal = (noteData: any) => {
  const note = notes.value.find(
    (n) =>
      n.id === noteData.id ||
      n.id_note === noteData.id ||
      n.idNote === noteData.id,
  );
  if (note) {
    noteToAddContext.value = {
      ...note,
      title: noteData.title,
    };
    contextText.value = note.context || "";
    showContextModal.value = true;
  }
};

const saveContext = () => {
  if (noteToAddContext.value) {
    const noteIndex = notes.value.findIndex(
      (n) =>
        n.id === noteToAddContext.value?.id ||
        n.id_note === noteToAddContext.value?.id ||
        n.idNote === noteToAddContext.value?.id,
    );
    if (noteIndex !== -1) {
      notes.value[noteIndex] = {
        ...notes.value[noteIndex],
        context: contextText.value,
      };
    }
    showContextModal.value = false;
    noteToAddContext.value = null;
    contextText.value = "";
  }
};

const closeContextModal = () => {
  showContextModal.value = false;
  noteToAddContext.value = null;
  contextText.value = "";
};

const saveAIAnalysis = async () => {
  if (!aiAnalysis.value || !props.researchId) return;

  savingAnalysis.value = true;
  saveAnalysisError.value = null;
  saveAnalysisSuccess.value = false;

  try {
    // Estructura JSON del análisis según especificación
    const analysisPayload = {
      researchId: props.researchId,
      analysis: {
        summary: aiAnalysis.value || "",
        generatedAt: new Date().toISOString(),
        model: "gemini-3-flash-preview",
      },
      notesCount: notes.value.length,
      notesReferences: notes.value.map((n) => ({
        id: n.id || n.id_note || n.idNote || "",
        createdAt: n.createdAt || n.created_at || new Date().toISOString(),
        updatedAt: n.createdAt || n.created_at || new Date().toISOString(),
      })),
    };

    const response = await axios.post(
      "http://localhost:3000/api/v1/research-analysis",
      analysisPayload,
    );

    if (response.status === 201 || response.status === 200) {
      saveAnalysisSuccess.value = true;
      setTimeout(() => {
        saveAnalysisSuccess.value = false;
      }, 3000);
    }
  } catch (err: any) {
    console.error("[NotesModal] Error saving analysis:", err);
    saveAnalysisError.value =
      err.response?.data?.message ||
      "Error al guardar el análisis. Intenta de nuevo.";
  } finally {
    savingAnalysis.value = false;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

watch(
  () => props.isOpen,
  (isOpen: boolean) => {
    if (isOpen) fetchNotes();
  },
  { immediate: true },
);
</script>

<style scoped>
.vue-flow-container {
  background-color: #fafafa;
}

/* ── Estilos para el markdown renderizado con v-html ───────── */
.ai-prose :deep(h1) {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin: 1.5rem 0 0.75rem;
  line-height: 1.3;
}
.ai-prose :deep(h2) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 1.25rem 0 0.6rem;
  line-height: 1.4;
}
.ai-prose :deep(h3) {
  font-size: 1.125rem;
  font-weight: 600;
  color: #334155;
  margin: 1rem 0 0.5rem;
  line-height: 1.4;
}
.ai-prose :deep(p) {
  font-size: 1rem;
  color: #475569;
  line-height: 1.8;
  margin: 0.75rem 0;
}
.ai-prose :deep(strong) {
  font-weight: 600;
  color: #1e293b;
}
.ai-prose :deep(em) {
  font-style: italic;
  color: #64748b;
}
.ai-prose :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}
.ai-prose :deep(ol) {
  list-style: decimal;
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}
.ai-prose :deep(li) {
  font-size: 1rem;
  color: #475569;
  line-height: 1.75;
  margin: 0.35rem 0;
}
.ai-prose :deep(a) {
  color: #4f46e5;
  text-decoration: underline;
  word-break: break-word;
}
.ai-prose :deep(a:hover) {
  color: #3730a3;
}
.ai-prose :deep(code) {
  font-size: 0.875rem;
  font-family: ui-monospace, monospace;
  background: #f1f5f9;
  color: #475569;
  padding: 0.125rem 0.375rem;
  border-radius: 0.375rem;
}
.ai-prose :deep(pre) {
  background: #0f172a;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  margin: 1rem 0;
}
.ai-prose :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}
.ai-prose :deep(blockquote) {
  border-left: 4px solid #a5b4fc;
  background: #eef2ff;
  padding: 0.75rem 1.25rem;
  border-radius: 0 0.75rem 0.75rem 0;
  margin: 1rem 0;
  color: #4338ca;
}
.ai-prose :deep(hr) {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 1.5rem 0;
}
.ai-prose :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 0.9rem;
}
.ai-prose :deep(th) {
  background: #f8fafc;
  font-weight: 600;
  color: #1e293b;
  padding: 0.6rem 1rem;
  border: 1px solid #e2e8f0;
  text-align: left;
}
.ai-prose :deep(td) {
  padding: 0.6rem 1rem;
  border: 1px solid #e2e8f0;
  color: #475569;
  vertical-align: top;
}
.ai-prose :deep(tr:nth-child(even) td) {
  background: #f8fafc;
}
</style>
