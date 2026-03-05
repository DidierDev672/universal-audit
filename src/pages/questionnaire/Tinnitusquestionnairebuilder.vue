<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 rounded-3xl p-8 text-white shadow-2xl">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <div>
          <h2 class="text-3xl font-bold mb-1">Constructor de Cuestionario - Tinnitus</h2>
          <p class="text-white/90">Crea evaluaciones personalizadas para síntomas auditivos</p>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="bg-white rounded-2xl shadow-lg p-4 border border-purple-100">
      <div class="flex items-center justify-between text-sm mb-2">
        <span class="text-gray-600 font-medium">Progreso del cuestionario</span>
        <span class="text-purple-600 font-semibold">{{ questionsCount }} pregunta(s)</span>
      </div>
      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
          :style="{ width: formProgress + '%' }"
        ></div>
      </div>
    </div>

    <!-- Main Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      
      <!-- Basic Information -->
      <div class="bg-white rounded-3xl shadow-xl border border-purple-100 p-8">
        <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Información General
        </h3>

        <div class="space-y-6">
          <!-- Título -->
          <div>
            <label class="block text-sm font-semibold text-gray-800 mb-2">
              Título del Cuestionario <span class="text-red-500">*</span>
            </label>
            <input
              v-model="questionnaire.title"
              type="text"
              required
              placeholder="Ej: Evaluación de Severidad de Tinnitus"
              class="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all"
            />
          </div>

          <!-- Descripción -->
          <div>
            <label class="block text-sm font-semibold text-gray-800 mb-2">
              Descripción del Cuestionario <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="questionnaire.description"
              rows="3"
              required
              placeholder="Describe el propósito y alcance de este cuestionario..."
              class="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Questions Section -->
      <div class="bg-white rounded-3xl shadow-xl border border-purple-100 p-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Preguntas ({{ questions.length }})
          </h3>
          <button
            type="button"
            @click="addQuestion"
            class="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Agregar Pregunta
          </button>
        </div>

        <!-- Questions List -->
        <div class="space-y-6">
          <TransitionGroup name="list">
            <div
              v-for="(question, index) in questions"
              :key="question.id"
              class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200"
            >
              <!-- Question Header -->
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                    {{ index + 1 }}
                  </div>
                  <span class="text-sm font-semibold text-gray-700">
                    Pregunta {{ index + 1 }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    v-if="index > 0"
                    type="button"
                    @click="moveQuestion(index, 'up')"
                    class="p-2 text-gray-600 hover:bg-white rounded-lg transition-all"
                    title="Mover arriba"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                    </svg>
                  </button>
                  <button
                    v-if="index < questions.length - 1"
                    type="button"
                    @click="moveQuestion(index, 'down')"
                    class="p-2 text-gray-600 hover:bg-white rounded-lg transition-all"
                    title="Mover abajo"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    @click="removeQuestion(index)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Eliminar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Question Text -->
              <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Texto de la pregunta <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="question.text"
                  type="text"
                  required
                  placeholder="Ej: ¿Con qué frecuencia experimenta zumbidos en los oídos?"
                  class="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all"
                />
              </div>

              <!-- Question Type -->
              <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de pregunta <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label
                    v-for="type in questionTypes"
                    :key="type.value"
                    :class="[
                      'flex items-center gap-3 p-4 bg-white border-2 rounded-xl cursor-pointer transition-all',
                      question.type === type.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    ]"
                  >
                    <input
                      v-model="question.type"
                      type="radio"
                      :value="type.value"
                      class="w-4 h-4 text-purple-600"
                      @change="handleTypeChange(index)"
                    />
                    <div>
                      <component :is="type.icon" class="w-5 h-5 text-purple-600 mb-1" />
                      <p class="text-sm font-medium text-gray-800">{{ type.label }}</p>
                      <p class="text-xs text-gray-500">{{ type.description }}</p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Options (for multiple and single choice) -->
              <div v-if="question.type !== 'open'" class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Opciones de respuesta
                </label>
                <div class="space-y-2">
                  <div
                    v-for="(option, optIndex) in question.options"
                    :key="optIndex"
                    class="flex items-center gap-2"
                  >
                    <span class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-semibold text-sm flex-shrink-0">
                      {{ question.type === 'single' ? String.fromCharCode(65 + optIndex) : optIndex + 1 }}
                    </span>
                    <input
                      v-model="question.options[optIndex]"
                      type="text"
                      required
                      placeholder="Opción de respuesta"
                      class="flex-1 px-4 py-2 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all"
                    />
                    <button
                      v-if="question.options.length > 2"
                      type="button"
                      @click="removeOption(index, optIndex)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  @click="addOption(index)"
                  class="mt-3 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  Agregar opción
                </button>
              </div>

              <!-- Required Toggle -->
              <div class="flex items-center justify-between p-3 bg-white rounded-xl">
                <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  Pregunta obligatoria
                </label>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="question.required"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </TransitionGroup>

          <!-- Empty State -->
          <div v-if="questions.length === 0" class="text-center py-12">
            <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="text-gray-600 mb-4">No hay preguntas agregadas</p>
            <button
              type="button"
              @click="addQuestion"
              class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Agregar Primera Pregunta
            </button>
          </div>
        </div>
      </div>

      <!-- Preview Section -->
      <div v-if="questions.length > 0" class="bg-white rounded-3xl shadow-xl border border-purple-100 p-8">
        <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          Vista Previa del Cuestionario
        </h3>
        
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
          <h4 class="text-2xl font-bold text-gray-800 mb-2">{{ questionnaire.title || 'Título del cuestionario' }}</h4>
          <p class="text-gray-600 mb-6">{{ questionnaire.description || 'Descripción del cuestionario' }}</p>
          
          <div class="space-y-6">
            <div
              v-for="(question, index) in questions"
              :key="question.id"
              class="bg-white rounded-xl p-5"
            >
              <p class="font-semibold text-gray-800 mb-3">
                {{ index + 1 }}. {{ question.text }}
                <span v-if="question.required" class="text-red-500 text-sm">*</span>
              </p>
              
              <!-- Multiple Choice Preview -->
              <div v-if="question.type === 'multiple'" class="space-y-2">
                <label
                  v-for="(option, optIndex) in question.options"
                  :key="optIndex"
                  class="flex items-center gap-3 p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-all"
                >
                  <input type="checkbox" class="w-4 h-4 text-purple-600" disabled />
                  <span class="text-gray-700">{{ option }}</span>
                </label>
              </div>

              <!-- Single Choice Preview -->
              <div v-else-if="question.type === 'single'" class="space-y-2">
                <label
                  v-for="(option, optIndex) in question.options"
                  :key="optIndex"
                  class="flex items-center gap-3 p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-all"
                >
                  <input type="radio" :name="'question-' + index" class="w-4 h-4 text-purple-600" disabled />
                  <span class="font-medium text-purple-600 mr-2">{{ String.fromCharCode(65 + optIndex) }}.</span>
                  <span class="text-gray-700">{{ option }}</span>
                </label>
              </div>

              <!-- Open Answer Preview -->
              <div v-else-if="question.type === 'open'">
                <textarea
                  rows="3"
                  placeholder="El paciente escribirá su respuesta aquí..."
                  class="w-full px-4 py-3 border-2 border-purple-200 rounded-xl bg-gray-50"
                  disabled
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-between pt-6">
        <button
          type="button"
          @click="resetForm"
          class="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all"
        >
          Cancelar
        </button>

        <button
          type="submit"
          :disabled="!isFormValid || isSubmitting"
          :class="[
            'px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg',
            isFormValid && !isSubmitting
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          <svg v-if="!isSubmitting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ isSubmitting ? 'Guardando...' : 'Guardar Cuestionario' }}
        </button>
      </div>
    </form>

    <!-- Success Modal -->
    <transition name="modal">
      <div v-if="showSuccessModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="showSuccessModal = false">
        <div class="bg-white rounded-3xl p-8 max-w-md shadow-2xl" @click.stop>
          <div class="text-center">
            <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">¡Cuestionario Creado!</h3>
            <p class="text-gray-600 mb-6">El cuestionario de tinnitus ha sido guardado exitosamente.</p>
            <button
              @click="showSuccessModal = false"
              class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue';

interface Question {
  id: string;
  text: string;
  type: 'multiple' | 'single' | 'open';
  options: string[];
  required: boolean;
}

interface Questionnaire {
  title: string;
  description: string;
}

// Icons as components
const MultipleIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' })
  ])
};

const SingleIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
  ])
};

const OpenIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' })
  ])
};

// State
const questionnaire = ref<Questionnaire>({
  title: '',
  description: '',
});

const questions = ref<Question[]>([]);
const isSubmitting = ref(false);
const showSuccessModal = ref(false);

// Question Types
const questionTypes = [
  {
    value: 'multiple',
    label: 'Selección Múltiple',
    description: 'Varias opciones',
    icon: MultipleIcon,
  },
  {
    value: 'single',
    label: 'Selección Única',
    description: 'A, B, C',
    icon: SingleIcon,
  },
  {
    value: 'open',
    label: 'Respuesta Abierta',
    description: 'Texto libre',
    icon: OpenIcon,
  },
];

// Computed
const questionsCount = computed(() => questions.value.length);

const formProgress = computed(() => {
  let progress = 0;
  if (questionnaire.value.title) progress += 30;
  if (questionnaire.value.description) progress += 20;
  if (questions.value.length > 0) progress += 50;
  return Math.min(progress, 100);
});

const isFormValid = computed(() => {
  return questionnaire.value.title.length > 0
    && questionnaire.value.description.length > 0
    && questions.value.length > 0
    && questions.value.every(q =>
      q.text.length > 0 &&
      (q.type === 'open' || q.options.every(opt => opt.length > 0))
    );
});

// Methods
let questionIdCounter = 0;

const addQuestion = () => {
  questions.value.push({
    id: `question-${questionIdCounter++}`,
    text: '',
    type: 'single',
    options: ['', ''],
    required: true,
  });
};

const removeQuestion = (index: number) => {
  questions.value.splice(index, 1);
};

const moveQuestion = (index: number, direction: 'up' | 'down') => {
  const newIndex = direction === 'up' ? index - 1 : index + 1;
  const temp = questions.value[index];
  questions.value[index] = questions.value[newIndex];
  questions.value[newIndex] = temp;
};

const addOption = (questionIndex: number) => {
  questions.value[questionIndex].options.push('');
};

const removeOption = (questionIndex: number, optionIndex: number) => {
  questions.value[questionIndex].options.splice(optionIndex, 1);
};

const handleTypeChange = (questionIndex: number) => {
  const question = questions.value[questionIndex];
  if (question.type === 'open') {
    question.options = [];
  } else if (question.options.length === 0) {
    question.options = ['', ''];
  }
};

const handleSubmit = async () => {
  if (!isFormValid.value) return;
  
  isSubmitting.value = true;
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const data = {
    ...questionnaire.value,
    questions: questions.value,
    createdAt: new Date(),
  };
  
  console.log('Cuestionario guardado:', data);
  
  isSubmitting.value = false;
  showSuccessModal.value = true;
};

const resetForm = () => {
  questionnaire.value = {
    title: '',
    description: '',
  };
  questions.value = [];
  questionIdCounter = 0;
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>