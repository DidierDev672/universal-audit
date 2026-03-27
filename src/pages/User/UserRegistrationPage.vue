<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl mb-8">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <div>
          <h2 class="text-3xl font-bold mb-1">Registro de Usuario</h2>
          <p class="text-white/90">Sistema de gestión de accesos</p>
        </div>
      </div>
    </div>

    <!-- Alertas -->
    <transition-group name="alert">
      <div v-for="alert in alerts" :key="alert.id" :class="[
        'rounded-2xl p-4 mb-6 shadow-lg flex items-start gap-3',
        alert.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
          alert.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' :
            'bg-blue-50 border border-blue-200 text-blue-800'
      ]" role="alert" aria-live="polite">
        <svg :class="[
          'w-5 h-5 shrink-0 mt-0.5',
          alert.type === 'error' ? 'text-red-500' :
            alert.type === 'success' ? 'text-emerald-500' :
              'text-blue-500'
        ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="alert.type === 'error'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path v-else-if="alert.type === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="flex-1">
          <p class="font-medium">{{ alert.title }}</p>
          <p class="text-sm opacity-90">{{ alert.message }}</p>
        </div>
        <button @click="removeAlert(alert.id)"
          class="shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity" aria-label="Cerrar alerta">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </transition-group>

    <!-- Form Container -->
    <div class="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
      <!-- Progress Indicator -->
      <div class="bg-gradient-to-r from-emerald-50 to-teal-50 px-8 py-4 border-b border-emerald-100">
        <div class="flex items-center justify-between text-sm mb-3">
          <span class="text-gray-600 font-medium">Progreso del formulario</span>
          <span class="text-emerald-600 font-semibold">{{ formProgress }}%</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
            :style="{ width: formProgress + '%' }"></div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-8 space-y-8">
        <!-- SECCIÓN 1: DATOS DE IDENTIFICACIÓN -->
        <div class="space-y-6">
          <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2 pb-3 border-b border-gray-200">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3 3 0 00-3 3m0 0h12" />
            </svg>
            Datos de Identificación
          </h3>

          <!-- ID Paciente con botón de búsqueda -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-800" for="id_patient">
              ID Paciente <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2">
              <input id="id_patient" v-model="formData.id_patient" type="text" required placeholder="Ej: PAT-001-2024"
                :class="[
                  'flex-1 px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-4',
                  errors.id_patient
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                    : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100'
                ]" aria-describedby="id_patient-help" />
              <button type="button" @click="openPatientModal"
                class="px-4 py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl transition-all flex items-center gap-2 font-medium"
                aria-label="Buscar paciente">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span class="hidden sm:inline">Buscar</span>
              </button>
            </div>
            <p id="id_patient-help" class="text-xs text-gray-500">
              Identificador único del paciente (5-50 caracteres alfanuméricos)
            </p>
            <p v-if="errors.id_patient" class="text-sm text-red-600 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01" />
              </svg>
              {{ errors.id_patient }}
            </p>
          </div>
        </div>

        <!-- SECCIÓN 2: DATOS DE ACCESO -->
        <div class="space-y-6">
          <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2 pb-3 border-b border-gray-200">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Datos de Acceso
          </h3>

          <!-- Email -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-800" for="email">
              Correo Electrónico <span class="text-red-500">*</span>
            </label>
            <input id="email" v-model="formData.email" type="email" required placeholder="Ej: usuario@hospital.com"
              :class="[
                'w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-4',
                errors.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                  : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100'
              ]" aria-describedby="email-help" />
            <p id="email-help" class="text-xs text-gray-500">
              Correo válido para notificaciones y recuperación de contraseña
            </p>
            <p v-if="errors.email" class="text-sm text-red-600 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01" />
              </svg>
              {{ errors.email }}
            </p>
          </div>

          <!-- Username -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-800" for="username">
              Nombre de Usuario <span class="text-red-500">*</span>
            </label>
            <input id="username" v-model="formData.username" type="text" required placeholder="Ej: dr.juan.perez"
              :class="[
                'w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-4',
                errors.username
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                  : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100'
              ]" aria-describedby="username-help" />
            <p id="username-help" class="text-xs text-gray-500">
              3-30 caracteres, solo letras, números y puntos
            </p>
            <p v-if="errors.username" class="text-sm text-red-600 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01" />
              </svg>
              {{ errors.username }}
            </p>
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-800" for="password">
              Contraseña <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input id="password" v-model="formData.password" :type="showPassword ? 'text' : 'password'" required
                placeholder="Mínimo 8 caracteres" :class="[
                  'w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-4 pr-12',
                  errors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                    : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100'
                ]" aria-describedby="password-help" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p id="password-help" class="text-xs text-gray-500">
              Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
            </p>

            <!-- Password Strength Indicator -->
            <div class="mt-3">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-medium text-gray-600">Fortaleza:</span>
                <span :class="[
                  'text-xs font-semibold',
                  passwordStrength === 'weak' ? 'text-red-500' :
                    passwordStrength === 'medium' ? 'text-yellow-500' :
                      passwordStrength === 'strong' ? 'text-emerald-500' :
                        'text-gray-400'
                ]">
                  {{ passwordStrengthText }}
                </span>
              </div>
              <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div :class="[
                  'h-full rounded-full transition-all duration-300',
                  passwordStrength === 'weak' ? 'w-1/4 bg-red-500' :
                    passwordStrength === 'medium' ? 'w-2/4 bg-yellow-500' :
                      passwordStrength === 'strong' ? 'w-full bg-emerald-500' :
                        'w-0'
                ]"></div>
              </div>
            </div>

            <p v-if="errors.password" class="text-sm text-red-600 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01" />
              </svg>
              {{ errors.password }}
            </p>
          </div>

          <!-- Confirm Password -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-800" for="confirmPassword">
              Confirmar Contraseña <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input id="confirmPassword" v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'" required placeholder="Repite la contraseña" :class="[
                  'w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-4 pr-12',
                  errors.confirmPassword
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                    : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100'
                ]" />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                :aria-label="showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="text-sm text-red-600 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01" />
              </svg>
              {{ errors.confirmPassword }}
            </p>
          </div>
        </div>

        <!-- SECCIÓN 3: PERMISOS -->
        <div class="space-y-6">
          <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2 pb-3 border-b border-gray-200">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Permisos del Sistema
          </h3>

          <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
            <p class="text-sm text-gray-600 mb-4">
              Selecciona los roles que tendrá este usuario en el sistema. Cada rol otorga permisos específicos.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Patient -->
              <label
                class="flex items-start gap-3 p-4 bg-white rounded-xl border-2 cursor-pointer transition-all hover:border-emerald-300 hover:shadow-md"
                :class="formData.permits.patient ? 'border-emerald-500 shadow-md' : 'border-gray-200'">
                <input v-model="formData.permits.patient" type="checkbox"
                  class="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 mt-0.5" />
                <div>
                  <span class="font-semibold text-gray-800 block">Paciente</span>
                  <span class="text-xs text-gray-500">Acceso a sus propios registros y resultados</span>
                </div>
              </label>

              <!-- User -->
              <label
                class="flex items-start gap-3 p-4 bg-white rounded-xl border-2 cursor-pointer transition-all hover:border-emerald-300 hover:shadow-md"
                :class="formData.permits.user ? 'border-emerald-500 shadow-md' : 'border-gray-200'">
                <input v-model="formData.permits.user" type="checkbox"
                  class="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 mt-0.5" />
                <div>
                  <span class="font-semibold text-gray-800 block">Usuario</span>
                  <span class="text-xs text-gray-500">Acceso básico al sistema</span>
                </div>
              </label>

              <!-- Doctor -->
              <label
                class="flex items-start gap-3 p-4 bg-white rounded-xl border-2 cursor-pointer transition-all hover:border-emerald-300 hover:shadow-md"
                :class="formData.permits.doctor ? 'border-emerald-500 shadow-md' : 'border-gray-200'">
                <input v-model="formData.permits.doctor" type="checkbox"
                  class="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 mt-0.5" />
                <div>
                  <span class="font-semibold text-gray-800 block">Doctor</span>
                  <span class="text-xs text-gray-500">Puede crear y gestionar pacientes</span>
                </div>
              </label>

              <!-- Administrator -->
              <label
                class="flex items-start gap-3 p-4 bg-white rounded-xl border-2 cursor-pointer transition-all hover:border-emerald-300 hover:shadow-md"
                :class="formData.permits.administrator ? 'border-emerald-500 shadow-md' : 'border-gray-200'">
                <input v-model="formData.permits.administrator" type="checkbox"
                  class="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 mt-0.5" />
                <div>
                  <span class="font-semibold text-gray-800 block">Administrador</span>
                  <span class="text-xs text-gray-500">Gestión completa del sistema</span>
                </div>
              </label>

              <!-- Super Administrator -->
              <label
                class="flex items-start gap-3 p-4 bg-white rounded-xl border-2 cursor-pointer transition-all hover:border-purple-300 hover:shadow-md md:col-span-2"
                :class="formData.permits.superAdministrator ? 'border-purple-500 shadow-md bg-purple-50' : 'border-gray-200'">
                <input v-model="formData.permits.superAdministrator" type="checkbox"
                  class="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 mt-0.5" />
                <div>
                  <span class="font-semibold text-gray-800 block flex items-center gap-2">
                    Super Administrador
                    <span class="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-bold">ALTO
                      PRIVILEGIO</span>
                  </span>
                  <span class="text-xs text-gray-500">Control total del sistema, gestión de usuarios y
                    configuración</span>
                </div>
              </label>
            </div>

            <p v-if="errors.permits" class="text-sm text-red-600 flex items-center gap-1 mt-4">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01" />
              </svg>
              {{ errors.permits }}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-between pt-6 border-t border-gray-200">
          <button type="button" @click="resetForm"
            class="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancelar
          </button>

          <button type="submit" :disabled="!isFormValid || isSubmitting" :class="[
            'px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg',
            isFormValid && !isSubmitting
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]">
            <svg v-if="!isSubmitting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ isSubmitting ? 'Registrando...' : 'Registrar Usuario' }}
          </button>
        </div>
      </form>
    </div>
    <!-- Modal de Búsqueda de Pacientes -->
    <transition name="modal">
      <div v-if="showPatientModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="closePatientModal">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
          @click.stop>
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white">Buscar Paciente</h3>
                  <p class="text-white/80 text-sm">Selecciona un paciente de la lista</p>
                </div>
              </div>
              <button @click="closePatientModal"
                class="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                aria-label="Cerrar modal">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div class="relative">
              <input v-model="patientSearchQuery" type="text" placeholder="Buscar por nombre, documento o ID..."
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Patient List -->
          <div class="flex-1 overflow-y-auto p-6">
            <!-- Loading State -->
            <div v-if="isLoadingPatients" class="flex flex-col items-center justify-center py-12">
              <svg class="w-12 h-12 text-emerald-600 animate-spin mb-4" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <p class="text-gray-600">Cargando pacientes...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="patientsError" class="flex flex-col items-center justify-center py-12 text-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-800 mb-2">Error al cargar pacientes</h4>
              <p class="text-gray-600 mb-4">{{ patientsError }}</p>
              <button @click="loadPatients"
                class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reintentar
              </button>
            </div>

            <!-- Empty State -->
            <div v-else-if="filteredPatients.length === 0"
              class="flex flex-col items-center justify-center py-12 text-center">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-800 mb-2">No se encontraron pacientes</h4>
              <p class="text-gray-600">Intenta con otra búsqueda o verifica que hay pacientes registrados.</p>
            </div>

            <!-- Patient Cards Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="patient in filteredPatients" :key="patient.id" @click="selectPatient(patient)"
                class="p-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer transition-all hover:border-emerald-400 hover:shadow-lg hover:scale-[1.02] group"
                :class="{ 'border-emerald-500 ring-2 ring-emerald-100': selectedPatient?.id === patient.id }">
                <div class="flex items-start gap-4">
                  <!-- Avatar -->
                  <div
                    class="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold shrink-0">
                    {{ getPatientInitials(patient.fullName) }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-gray-800 truncate group-hover:text-emerald-700 transition-colors">
                      {{ patient.fullName }}
                    </h4>
                    <p class="text-sm text-gray-500">
                      {{ patient.documentType }}: {{ patient.documentNumber }}
                    </p>
                    <div class="flex items-center gap-3 mt-2 text-xs">
                      <span class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                        ID: {{ patient.id }}
                      </span>
                      <span v-if="patient.age" class="text-gray-500">
                        {{ patient.age }} años
                      </span>
                    </div>
                  </div>
                  <!-- Selection Indicator -->
                  <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                    :class="selectedPatient?.id === patient.id ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'">
                    <svg v-if="selectedPatient?.id === patient.id" class="w-4 h-4 text-white" fill="none"
                      stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <p class="text-sm text-gray-600">
              <span class="font-semibold">{{ filteredPatients.length }}</span> paciente(s) encontrado(s)
            </p>
            <div class="flex gap-3">
              <button @click="closePatientModal"
                class="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-all">
                Cancelar
              </button>
              <button @click="confirmPatientSelection" :disabled="!selectedPatient"
                class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Seleccionar
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import axios from 'axios';

// Types
interface Patient {
  id: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  age?: number;
}

interface Alert {
  id: string;
  type: 'error' | 'success' | 'info';
  title: string;
  message: string;
}

interface FormErrors {
  id_patient?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  permits?: string;
}

interface Permits {
  patient: boolean;
  user: boolean;
  doctor: boolean;
  administrator: boolean;
  superAdministrator: boolean;
}

// Patient Modal States
const showPatientModal = ref(false);
const isLoadingPatients = ref(false);
const patientsError = ref('');
const patientsList = ref<Patient[]>([]);
const selectedPatient = ref<Patient | null>(null);
const patientSearchQuery = ref('');
const formData = reactive({
  id_patient: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  permits: {
    patient: false,
    user: false,
    doctor: false,
    administrator: false,
    superAdministrator: false,
  } as Permits,
});

// States
const isSubmitting = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const alerts = ref<Alert[]>([]);
const errors = reactive<FormErrors>({});

// Alert Management
const addAlert = (type: Alert['type'], title: string, message: string) => {
  const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  alerts.value.push({ id, type, title, message });

  // Auto-remove after 8 seconds for success/info, keep errors until dismissed
  if (type !== 'error') {
    setTimeout(() => removeAlert(id), 8000);
  }
};

const removeAlert = (id: string) => {
  const index = alerts.value.findIndex(a => a.id === id);
  if (index > -1) {
    alerts.value.splice(index, 1);
  }
};

// Clear all errors
const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    delete (errors as Record<string, string | undefined>)[key];
  });
};

// Validation Functions
const validateIdPatient = (): boolean => {
  const value = formData.id_patient.trim();
  if (!value) {
    errors.id_patient = 'El ID de paciente es obligatorio';
    return false;
  }
  if (value.length < 5 || value.length > 50) {
    errors.id_patient = 'El ID debe tener entre 5 y 50 caracteres';
    return false;
  }
  if (!/^[a-zA-Z0-9-_\.]+$/.test(value)) {
    errors.id_patient = 'Solo se permiten letras, números, guiones, guiones bajos y puntos';
    return false;
  }
  return true;
};

const validateEmail = (): boolean => {
  const value = formData.email.trim();
  if (!value) {
    errors.email = 'El correo electrónico es obligatorio';
    return false;
  }
  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(value)) {
    errors.email = 'Ingresa un correo electrónico válido';
    return false;
  }
  if (value.length > 254) {
    errors.email = 'El correo es demasiado largo';
    return false;
  }
  return true;
};

const validateUsername = (): boolean => {
  const value = formData.username.trim();
  if (!value) {
    errors.username = 'El nombre de usuario es obligatorio';
    return false;
  }
  if (value.length < 3 || value.length > 30) {
    errors.username = 'El nombre de usuario debe tener entre 3 y 30 caracteres';
    return false;
  }
  if (!/^[a-zA-Z0-9\.]+$/.test(value)) {
    errors.username = 'Solo se permiten letras, números y puntos';
    return false;
  }
  if (/^\.|\.$/.test(value)) {
    errors.username = 'El nombre no puede comenzar ni terminar con punto';
    return false;
  }
  if (/\.\./.test(value)) {
    errors.username = 'No se permiten puntos consecutivos';
    return false;
  }
  return true;
};

const validatePassword = (): boolean => {
  const value = formData.password;
  if (!value) {
    errors.password = 'La contraseña es obligatoria';
    return false;
  }
  if (value.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
    return false;
  }
  if (!/[a-z]/.test(value)) {
    errors.password = 'Debe contener al menos una letra minúscula';
    return false;
  }
  if (!/[A-Z]/.test(value)) {
    errors.password = 'Debe contener al menos una letra mayúscula';
    return false;
  }
  if (!/[0-9]/.test(value)) {
    errors.password = 'Debe contener al menos un número';
    return false;
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
    errors.password = 'Debe contener al menos un carácter especial (!@#$%^&*...)';
    return false;
  }
  return true;
};

const validateConfirmPassword = (): boolean => {
  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Debes confirmar la contraseña';
    return false;
  }
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
    return false;
  }
  return true;
};

const validatePermits = (): boolean => {
  const hasPermit = Object.values(formData.permits).some(p => p);
  if (!hasPermit) {
    errors.permits = 'Debes seleccionar al menos un permiso';
    return false;
  }
  return true;
};

// Computed
const passwordStrength = computed(() => {
  const pwd = formData.password;
  if (!pwd) return 'none';
  if (pwd.length < 8) return 'weak';

  let score = 0;
  if (/[a-z]/.test(pwd)) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  if (pwd.length >= 12) score++;

  if (score <= 2) return 'weak';
  if (score <= 3) return 'medium';
  return 'strong';
});

const passwordStrengthText = computed(() => {
  const map: Record<string, string> = {
    none: 'No ingresada',
    weak: 'Débil',
    medium: 'Media',
    strong: 'Fuerte',
  };
  return map[passwordStrength.value];
});

const formProgress = computed(() => {
  let completed = 0;
  const total = 6; // id_patient, email, username, password, confirmPassword, at least one permit

  if (formData.id_patient.trim()) completed++;
  if (formData.email.trim()) completed++;
  if (formData.username.trim()) completed++;
  if (formData.password) completed++;
  if (formData.confirmPassword) completed++;
  if (Object.values(formData.permits).some(p => p)) completed++;

  return Math.round((completed / total) * 100);
});

const isFormValid = computed(() => {
  return (
    formData.id_patient.trim() &&
    formData.email.trim() &&
    formData.username.trim() &&
    formData.password &&
    formData.confirmPassword &&
    Object.values(formData.permits).some(p => p) &&
    formData.password === formData.confirmPassword &&
    formData.password.length >= 8
  );
});

// Patient Search Filter
const filteredPatients = computed(() => {
  if (!patientSearchQuery.value.trim()) {
    return patientsList.value;
  }
  const query = patientSearchQuery.value.toLowerCase();
  return patientsList.value.filter(patient =>
    patient.fullName.toLowerCase().includes(query) ||
    patient.documentNumber.toLowerCase().includes(query) ||
    patient.id.toLowerCase().includes(query)
  );
});

// Submit Handler
const handleSubmit = async () => {
  clearErrors();
  alerts.value = [];

  // Run all validations
  const validations = [
    validateIdPatient(),
    validateEmail(),
    validateUsername(),
    validatePassword(),
    validateConfirmPassword(),
    validatePermits(),
  ];

  if (!validations.every(v => v)) {
    addAlert('error', 'Error de validación', 'Por favor corrige los errores marcados en el formulario');
    return;
  }

  isSubmitting.value = true;

  try {
    // Build permits array from selected permissions
    const permitsArray: string[] = [];
    if (formData.permits.patient) permitsArray.push('patient');
    if (formData.permits.user) permitsArray.push('user');
    if (formData.permits.doctor) permitsArray.push('doctor');
    if (formData.permits.administrator) permitsArray.push('administrator');
    if (formData.permits.superAdministrator) permitsArray.push('super_administrator');

    // Prepare payload with correct structure
    const payload = {
      idPatient: formData.id_patient.trim(),
      email: formData.email.trim().toLowerCase(),
      username: formData.username.trim(),
      password: formData.password,
      permits: permitsArray,
    };

    // API Call
    await axios.post('http://localhost:3000/api/v1/auth/register', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Success
    addAlert('success', '¡Registro exitoso!', 'El usuario ha sido registrado correctamente en el sistema.');

    // Reset form
    resetForm();

    // Log success (without sensitive data)
    console.log('User registered successfully:', {
      idPatient: payload.idPatient,
      email: payload.email,
      username: payload.username,
    });

  } catch (error: any) {
    let title = 'Error al registrar';
    let message = 'Ocurrió un error inesperado. Por favor intenta nuevamente.';

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;

        if (status === 400) {
          title = 'Datos inválidos';
          message = data?.message || 'Los datos proporcionados no son válidos. Verifica la información.';
        } else if (status === 409) {
          title = 'Usuario existente';
          message = data?.message || 'El correo, username o ID de paciente ya está registrado.';
        } else if (status === 422) {
          title = 'Error de validación';
          message = data?.message || 'Hay campos que no cumplen con los requisitos.';
          // Handle specific field errors from server
          if (data?.errors) {
            Object.assign(errors, data.errors);
          }
        } else if (status >= 500) {
          title = 'Error del servidor';
          message = 'El servidor está experimentando problemas. Por favor intenta más tarde.';
        }
      } else if (error.request) {
        // Request made but no response received
        title = 'Error de conexión';
        message = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      }
    }

    addAlert('error', title, message);
    console.error('Registration error:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  formData.id_patient = '';
  formData.email = '';
  formData.username = '';
  formData.password = '';
  formData.confirmPassword = '';
  formData.permits.patient = false;
  formData.permits.user = false;
  formData.permits.doctor = false;
  formData.permits.administrator = false;
  formData.permits.superAdministrator = false;

  clearErrors();
  alerts.value = [];
  showPassword.value = false;
  showConfirmPassword.value = false;
  selectedPatient.value = null;
};

// Patient Modal Functions
const openPatientModal = async () => {
  showPatientModal.value = true;
  patientSearchQuery.value = '';
  selectedPatient.value = null;
  await loadPatients();
};

const closePatientModal = () => {
  showPatientModal.value = false;
  selectedPatient.value = null;
};

const loadPatients = async () => {
  isLoadingPatients.value = true;
  patientsError.value = '';

  try {
    const response = await axios.get('http://localhost:3000/api/v1/patients', {
      timeout: 30000,
    });
    patientsList.value = response.data || [];
  } catch (error: any) {
    let message = 'No se pudo cargar la lista de pacientes.';
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message = 'Error del servidor al obtener pacientes.';
      } else if (error.request) {
        message = 'No se pudo conectar con el servidor.';
      }
    }
    patientsError.value = message;
    console.error('Error loading patients:', error);
  } finally {
    isLoadingPatients.value = false;
  }
};

const getPatientInitials = (fullName: string): string => {
  if (!fullName) return '??';
  const names = fullName.trim().split(' ').filter(n => n.length > 0);
  if (names.length === 0) return '??';
  if (names.length === 1) return names[0].slice(0, 2).toUpperCase();
  const firstInitial = names[0][0] ?? '?';
  const lastInitial = names[names.length - 1]?.[0] ?? '?';
  return (firstInitial + lastInitial).toUpperCase();
};

const selectPatient = (patient: Patient) => {
  selectedPatient.value = patient;
};

const confirmPatientSelection = () => {
  if (selectedPatient.value) {
    formData.id_patient = selectedPatient.value.id;
    closePatientModal();
  }
};
</script>

<style scoped>
.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s ease;
}

.alert-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.alert-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
