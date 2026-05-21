<template>
  <!-- Wallpaper WhatsApp: fixed en toda la pantalla, fuera de la card -->
  <AiAnalysisIconBackground variant="page" :repeat="3" :veiled="false" />

  <div class="relative z-10 min-h-[calc(100dvh-8rem)] px-4 sm:px-6 py-6 sm:py-8">
    <!-- Card principal -->
    <div class="max-w-6xl mx-auto">
      <div
        class="bg-white rounded-2xl border border-black/[0.07] shadow-[0_4px_24px_rgba(0,0,0,0.06)] relative overflow-hidden"
      >
        <div
          class="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0d9e6e] to-[#0ea5e9] z-20"
        />

        <div class="relative z-10 px-6 pt-7 pb-6">
      <header
        class="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
      >
        <div>
          <div class="flex items-center gap-2.5 mb-1.5">
            <div
              class="w-8 h-8 bg-[#f0faf6] border border-[#0d9e6e]/[0.12] rounded-[9px] flex items-center justify-center shrink-0"
            >
              <svg
                class="w-[15px] h-[15px] text-[#0d9e6e]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h2 class="text-[14px] font-semibold text-[#1d1d1f] tracking-tight">
              Análisis generados por IA
            </h2>
          </div>
          <p class="text-[11.5px] text-[#86868b] leading-relaxed tracking-tight">
            Historial de análisis guardados. Haz clic en una tarjeta para ver el
            detalle completo.
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <RouterLink
            to="/ai-documentos"
            class="py-2 px-3 text-[12px] font-medium text-[#0d9e6e] border border-[#0d9e6e]/25 rounded-[9px] hover:bg-[#f0faf6] transition-colors"
          >
            Ver documentos
          </RouterLink>
          <button
            type="button"
            :disabled="cargando"
            class="py-2 px-3 text-[12px] font-medium text-white bg-[#0d9e6e] rounded-[9px] hover:bg-[#0a8a5f] disabled:opacity-50 transition-colors"
            @click="cargar"
          >
            {{ cargando ? "Cargando..." : "Actualizar" }}
          </button>
        </div>
      </header>

      <div v-if="cargando && analisis.length === 0" class="py-16 text-center">
        <p class="text-[13px] text-[#86868b]">Cargando análisis...</p>
      </div>

      <div
        v-else-if="error"
        class="p-4 rounded-[9px] bg-red-50/80 border border-red-200/60 text-[12px] text-red-700"
      >
        {{ error }}
      </div>

      <div
        v-else-if="analisis.length === 0"
        class="py-16 text-center border border-dashed border-black/10 rounded-xl bg-white/70 backdrop-blur-sm"
      >
        <p class="text-[13px] text-[#3a3a3c]">No hay análisis guardados aún.</p>
        <RouterLink
          to="/ai-documentos"
          class="inline-block mt-2 text-[12px] text-[#0d9e6e] hover:underline"
        >
          Ir a documentos y generar un análisis
        </RouterLink>
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <button
          v-for="item in analisis"
          :key="item.id"
          type="button"
          class="text-left rounded-xl border border-black/[0.08] bg-white p-4 shadow-sm hover:border-[#0d9e6e]/40 hover:shadow-md hover:bg-[#f0faf6]/30 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#0d9e6e]/30"
          @click="abrirDetalle(item)"
        >
          <div class="flex items-start justify-between gap-2 mb-2">
            <h3
              class="text-[13px] font-semibold text-[#1d1d1f] line-clamp-2 leading-snug"
            >
              {{ tituloCard(item) }}
            </h3>
            <span
              v-if="item.status"
              class="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full"
              :class="claseEstado(item.status)"
            >
              {{ etiquetaEstado(item.status) }}
            </span>
          </div>

          <p class="text-[11.5px] text-[#86868b] line-clamp-3 leading-relaxed mb-3">
            {{ resumenCard(item.content) }}
          </p>

          <dl class="space-y-1 text-[10.5px] text-[#aeaeb2]">
            <div v-if="item.model" class="flex gap-1.5">
              <dt class="shrink-0">Modelo:</dt>
              <dd class="truncate text-[#52525b]">{{ item.model }}</dd>
            </div>
            <div class="flex gap-1.5">
              <dt class="shrink-0">Fecha:</dt>
              <dd>{{ formatearFecha(item.created_at) }}</dd>
            </div>
          </dl>

          <p class="mt-3 text-[10px] text-[#0d9e6e] font-medium">
            Ver detalle →
          </p>
        </button>
      </div>

      <p
        v-if="analisis.length > 0"
        class="mt-4 text-[11px] text-[#aeaeb2] text-center"
      >
        {{ analisis.length }} análisis
      </p>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div
        v-if="modalAbierto && seleccionado"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
        @click.self="cerrarModal"
      >
        <div
          class="bg-white rounded-2xl border border-black/[0.08] shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-analisis-titulo"
        >
          <header
            class="px-5 py-4 border-b border-black/[0.06] flex items-start justify-between gap-3 shrink-0"
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
                        : "Detalle del análisis"
                }}
              </h3>
              <p class="text-[11px] text-[#86868b] mt-0.5 truncate">
                {{ tituloCard(seleccionado) }}
              </p>
              <div class="flex flex-wrap gap-2 mt-2">
                <span
                  v-if="seleccionado.status && vistaModal === 'analisis'"
                  class="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  :class="claseEstado(seleccionado.status)"
                >
                  {{ etiquetaEstado(seleccionado.status) }}
                </span>
                <span
                  v-if="seleccionado.model && vistaModal === 'analisis'"
                  class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600"
                >
                  {{ seleccionado.model }}
                </span>
                <span
                  v-if="vistaModal !== 'analisis'"
                  class="text-[10px] px-2 py-0.5 rounded-full bg-[#f0faf6] text-[#0d9e6e]"
                >
                  {{ notasDelAnalisis.length }} nota(s)
                </span>
              </div>
            </div>
            <button
              type="button"
              class="text-[#aeaeb2] hover:text-[#1d1d1f] p-1 shrink-0 rounded-md hover:bg-slate-100"
              aria-label="Cerrar"
              @click="cerrarModal"
            >
              ✕
            </button>
          </header>

          <div class="relative flex-1 min-h-0 flex flex-col overflow-hidden">
            <AiAnalysisIconBackground variant="modal" :repeat="4" :veiled="true" />

            <div class="relative z-10 flex-1 min-h-0 flex flex-col">
            <!-- Vista: análisis -->
            <div
              v-show="vistaModal === 'analisis'"
              class="ai-analysis-markdown px-5 py-4 overflow-y-auto flex-1 text-[12.5px] text-[#3a3a3c] leading-relaxed prose prose-sm prose-slate max-w-none"
              v-html="detalleHtml"
            />

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
                  <span
                    class="w-1.5 h-1.5 rounded-full bg-[#0d9e6e]"
                  />
                  Análisis del documento
                </h4>
                <div
                  class="ai-analysis-markdown rounded-xl border border-black/[0.08] bg-[#fafafa] px-4 py-3 text-[12.5px] prose prose-sm prose-slate max-w-none"
                  v-html="detalleHtml"
                />
              </section>

              <section>
                <h4
                  class="text-[12px] font-semibold text-[#1d1d1f] mb-2 flex items-center gap-2"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]"
                  />
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
                  class="ai-analysis-markdown rounded-xl border border-[#0d9e6e]/20 bg-white px-4 py-3 text-[12.5px] prose prose-sm prose-slate max-w-none shadow-sm"
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
                  :disabled="notasDelAnalisis.length === 0 || redactandoNotas"
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
                  class="ai-analysis-markdown px-4 py-3 text-[12px] prose prose-sm prose-slate max-w-none"
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
                class="flex-1 min-h-[360px] mx-4 my-3 border border-black/[0.08] rounded-xl overflow-hidden bg-[#fafafa]"
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
                  class="ai-notes-flow h-full min-h-[360px]"
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
                  <div class="flex items-start justify-between gap-2 mb-2">
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
                  Puedes dejarlo vacío y completarlo después desde la lista de
                  notas.
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
                  :disabled="!nuevaNotaContent.trim() || !colorNotaSeleccionado"
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
              v-if="
                vistaModal === 'analisis' ||
                vistaModal === 'notas'
              "
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
            class="px-5 py-3 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-2 shrink-0"
          >
            <div class="flex flex-wrap items-center gap-2">
              <button
                v-if="vistaModal === 'redaccion-ia'"
                type="button"
                class="py-2 px-3 text-[12px] font-medium text-[#0d9e6e] border border-[#0d9e6e]/30 rounded-[9px] hover:bg-[#f0faf6]"
                @click="vistaModal = 'notas'"
              >
                Volver a notas
              </button>
              <button
                v-else
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
    </Transition>
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
  readAiAnalysesApiError,
  saveAiDocumentRedaction,
} from "@/services/aiDocumentAnalysesApi";
import type { AiDocumentAnalysisListItem } from "@/services/aiDocumentAnalysesApi";
import type {
  AiAnalysisNote,
  AiAnalysisNoteColor,
} from "@/types/aiAnalysisNote";
import AiAnalysisNoteNode from "./AiAnalysisNoteNode.vue";
import AiAnalysisIconBackground from "./AiAnalysisIconBackground.vue";

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

type VistaModal = "analisis" | "notas" | "crear-nota" | "redaccion-ia";

const analisis = ref<AiDocumentAnalysisListItem[]>([]);
const cargando = ref(false);
const error = ref<string | null>(null);
const modalAbierto = ref(false);
const seleccionado = ref<AiDocumentAnalysisListItem | null>(null);

const vistaModal = ref<VistaModal>("analisis");
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

const notasDelAnalisis = computed(() => {
  const id = seleccionado.value?.id;
  if (!id) return [];
  return notasPorAnalisis.value[id] ?? [];
});

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

function resetEstadoNotas() {
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
}

function notaDesdeNodo(data: Record<string, unknown>): AiAnalysisNote {
  return data as AiAnalysisNote;
}

function sincronizarFlowNotas() {
  const notas = notasDelAnalisis.value;
  const posiciones = new Map(
    flowNodes.value.map((n) => [n.id, n.position]),
  );

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

const detalleHtml = computed(() => {
  const raw = seleccionado.value?.content?.trim();
  if (!raw) return "<p>Sin contenido.</p>";
  return md.render(raw);
});

const redaccionHtml = computed(() => {
  const raw = textoRedaccionNotas.value?.trim();
  if (!raw) return "";
  return md.render(raw);
});

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

  const token =
    localStorage.getItem("auth_token");
  if (!token) {
    const msg =
      "Debes iniciar sesión para guardar la redacción. Ve a /login.";
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
    original_filename:
      analysis.original_filename ?? tituloCard(analysis),
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
  } catch (err) {
    const msg = readAiAnalysesApiError(err);
    errorGuardadoRedaccion.value = true;
    mensajeGuardadoRedaccion.value = msg;
    alert(`Error al guardar: ${msg}`);
  } finally {
    guardandoRedaccion.value = false;
  }
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

function etiquetaEstado(status: string): string {
  const map: Record<string, string> = {
    pending: "Pendiente",
    processing: "Procesando",
    completed: "Completado",
    failed: "Error",
    analyzed: "Analizado",
  };
  return map[status] ?? status;
}

function claseEstado(status: string): string {
  const map: Record<string, string> = {
    pending: "bg-amber-50 text-amber-800",
    processing: "bg-blue-50 text-blue-700",
    completed: "bg-[#f0faf6] text-[#0d9e6e]",
    analyzed: "bg-[#f0faf6] text-[#0d9e6e]",
    failed: "bg-red-50 text-red-700",
  };
  return map[status] ?? "bg-slate-100 text-slate-600";
}

function abrirDetalle(item: AiDocumentAnalysisListItem) {
  seleccionado.value = item;
  cargarNotas(item.id);
  resetEstadoNotas();
  modalAbierto.value = true;
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
  } else {
    cerrarDetalleNotaFlow();
  }
});

watch(modalAbierto, (abierto) => {
  if (!abierto) resetEstadoNotas();
});

async function cargar() {
  cargando.value = true;
  error.value = null;
  try {
    analisis.value = await listAiDocumentAnalyses();
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

.ai-analysis-markdown :deep(h1),
.ai-analysis-markdown :deep(h2),
.ai-analysis-markdown :deep(h3) {
  color: #1d1d1f;
  font-weight: 600;
  margin-top: 1.25em;
  margin-bottom: 0.5em;
}

.ai-analysis-markdown :deep(h1) {
  font-size: 1.15em;
}
.ai-analysis-markdown :deep(h2) {
  font-size: 1.05em;
}
.ai-analysis-markdown :deep(h3) {
  font-size: 1em;
}

.ai-analysis-markdown :deep(p) {
  margin: 0.65em 0;
}

.ai-analysis-markdown :deep(ul),
.ai-analysis-markdown :deep(ol) {
  margin: 0.65em 0;
  padding-left: 1.25em;
}

.ai-analysis-markdown :deep(li) {
  margin: 0.25em 0;
}

.ai-analysis-markdown :deep(strong) {
  color: #1d1d1f;
  font-weight: 600;
}

.ai-analysis-markdown :deep(code) {
  font-size: 0.9em;
  background: #f4f4f5;
  padding: 0.1em 0.35em;
  border-radius: 4px;
}

.ai-analysis-markdown :deep(pre) {
  background: #1d1d1f;
  color: #f4f4f5;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0.75em 0;
}

.ai-analysis-markdown :deep(pre code) {
  background: transparent;
  padding: 0;
}

.ai-analysis-markdown :deep(blockquote) {
  border-left: 3px solid #0d9e6e;
  padding-left: 0.75rem;
  margin: 0.75em 0;
  color: #52525b;
  font-style: italic;
}

.ai-analysis-markdown :deep(a) {
  color: #0d9e6e;
  text-decoration: underline;
}

.ai-notes-flow :deep(.vue-flow__node) {
  cursor: grab;
}

.ai-notes-flow :deep(.vue-flow__node:active) {
  cursor: grabbing;
}
</style>
