<template>
   <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-2xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-pulse">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-3xl font-bold mb-1">Sonidos de Ambiente 🎵</h2>
            <p class="text-white/90">Terapia sonora para tinnitus y relajación</p>
          </div>
        </div>
        <button
          @click="showForm = !showForm"
          class="hidden md:flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          {{ showForm ? 'Ver Biblioteca' : 'Agregar Sonido' }}
        </button>
      </div>
    </div>

    <!-- Mobile Toggle -->
    <button
      @click="showForm = !showForm"
      class="md:hidden w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
      </svg>
      {{ showForm ? 'Ver Biblioteca' : 'Agregar Sonido' }}
    </button>

    <!-- Content Toggle -->
    <transition name="fade" mode="out-in">
      <!-- Sound Form -->
      <div v-if="showForm" key="form">
        <AmbientSoundForm @sound-saved="handleSoundSaved" />
      </div>

      <!-- Sound Library -->
      <div v-else key="library" class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                </svg>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-1">Total Sonidos</p>
            <p class="text-3xl font-bold text-gray-800">{{ sounds.length }}</p>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-1">Reproducciones</p>
            <p class="text-3xl font-bold text-gray-800">1,234</p>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-1">Calificación</p>
            <p class="text-3xl font-bold text-gray-800">4.8</p>
          </div>
        </div>

        <!-- Search and Filter -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1 relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar sonidos de ambiente..."
                class="w-full pl-12 pr-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <select class="px-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all">
              <option>Todas las categorías</option>
              <option>Naturaleza</option>
              <option>Ruido Blanco</option>
              <option>Frecuencias</option>
              <option>ASMR</option>
            </select>
          </div>
        </div>

        <!-- Sound Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="sound in filteredSounds"
            :key="sound.id"
            class="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
          >
            <!-- Sound Cover -->
            <div :class="['h-40 bg-gradient-to-br p-6 flex items-center justify-center relative', sound.gradient]">
              <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
              <svg class="w-16 h-16 text-white relative z-10 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
              </svg>
            </div>

            <!-- Sound Info -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <h3 class="font-bold text-gray-800 text-lg group-hover:text-indigo-600 transition-colors">
                  {{ sound.name }}
                </h3>
                <span :class="['px-2 py-1 rounded-lg text-xs font-semibold', sound.categoryColor]">
                  {{ sound.category }}
                </span>
              </div>

              <p class="text-sm text-gray-600 mb-4 line-clamp-2">
                {{ sound.description }}
              </p>

              <div class="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ sound.duration }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  {{ sound.rating }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ sound.plays }}
                </span>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-2">
                <button class="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                  Reproducir
                </button>
                <button class="p-2 text-gray-600 hover:bg-indigo-50 rounded-lg transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredSounds.length === 0" class="bg-white rounded-2xl shadow-lg p-12 text-center border border-indigo-100">
          <div class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">No se encontraron sonidos</h3>
          <p class="text-gray-600 mb-6">Intenta con otros términos de búsqueda o agrega un nuevo sonido</p>
          <button
            @click="showForm = true"
            class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Agregar Sonido
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import AmbientSoundForm from './AmbientSoundForm.vue';

const showForm = ref(false);
const searchQuery = ref('');

const sounds = ref([
  {
    id: 1,
    name: 'Lluvia Suave en el Bosque',
    description: 'Sonido relajante de lluvia cayendo en un bosque frondoso. Ideal para concentración y manejo de tinnitus.',
    duration: '30:00',
    rating: '4.9',
    plays: '2.3K',
    category: 'Naturaleza',
    categoryColor: 'bg-green-100 text-green-700',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    id: 2,
    name: 'Ruido Blanco Puro',
    description: 'Ruido blanco continuo de alta calidad. Perfecto para enmascarar tinnitus y mejorar el sueño.',
    duration: '60:00',
    rating: '4.8',
    plays: '5.1K',
    category: 'Ruido Blanco',
    categoryColor: 'bg-gray-100 text-gray-700',
    gradient: 'from-gray-400 to-gray-600',
  },
  {
    id: 3,
    name: 'Olas del Océano',
    description: 'Sonido suave de olas rompiendo en la playa. Excelente para relajación profunda y meditación.',
    duration: '45:00',
    rating: '4.9',
    plays: '4.2K',
    category: 'Naturaleza',
    categoryColor: 'bg-blue-100 text-blue-700',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    id: 4,
    name: 'Frecuencias Binaurales 432Hz',
    description: 'Frecuencias binaurales calibradas en 432Hz. Ayuda a la relajación mental y reducción de estrés.',
    duration: '20:00',
    rating: '4.7',
    plays: '1.8K',
    category: 'Frecuencias',
    categoryColor: 'bg-purple-100 text-purple-700',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    id: 5,
    name: 'Fuego de Chimenea',
    description: 'Crepitar cálido y relajante de una chimenea. Perfecto para crear ambiente acogedor y reducir ansiedad.',
    duration: '40:00',
    rating: '4.8',
    plays: '3.5K',
    category: 'Ambiente',
    categoryColor: 'bg-orange-100 text-orange-700',
    gradient: 'from-orange-500 to-red-600',
  },
  {
    id: 6,
    name: 'Canto de Pájaros Matutinos',
    description: 'Sinfonía natural de pájaros al amanecer. Ideal para comenzar el día con energía positiva.',
    duration: '25:00',
    rating: '4.9',
    plays: '2.9K',
    category: 'Naturaleza',
    categoryColor: 'bg-green-100 text-green-700',
    gradient: 'from-yellow-500 to-green-600',
  },
]);

const filteredSounds = computed(() => {
  if (!searchQuery.value) return sounds.value;
  
  const query = searchQuery.value.toLowerCase();
  return sounds.value.filter(s =>
    s.name.toLowerCase().includes(query) ||
    s.description.toLowerCase().includes(query) ||
    s.category.toLowerCase().includes(query)
  );
});

const handleSoundSaved = () => {
  showForm.value = false;
  // Aquí podrías recargar la lista de sonidos
};
</script>


<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>