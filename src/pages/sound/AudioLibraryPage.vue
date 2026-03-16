<template>
   <div class="space-y-6">
    <!-- Header con estadísticas -->
    <div class="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold mb-1">Biblioteca de Sonidos 🎵</h1>
            <p class="text-white/90">Sonidos terapéuticos para salud auditiva</p>
          </div>
        </div>
        
        <RouterLink
          to="/add-sound"
          class="hidden md:flex items-center gap-2 px-6 py-3 bg-white text-cyan-600 rounded-xl font-semibold hover:bg-cyan-50 transition-all shadow-lg"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Agregar Sonido
        </RouterLink>
      </div>
 
      <!-- Estadísticas -->
    </div>
 
    <!-- Mobile Add Button -->
    <RouterLink
      to="/add-sound"
      class="md:hidden w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl font-semibold shadow-lg"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
      </svg>
      Agregar Sonido
    </RouterLink>
 
    <!-- Filtros y Búsqueda -->
    <div class="bg-white rounded-2xl border border-cyan-100 shadow-sm p-6">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Buscador -->
        <div class="flex-1">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar sonidos..."
              class="w-full pl-12 pr-4 py-3 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
 
    <!-- Loading State -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="n in 6" :key="n" class="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
        <div class="h-32 bg-gray-200 rounded-xl mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
 
    <!-- Grid de Sonidos -->
    <div v-else-if="filteredSounds.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="sound in filteredSounds"
        :key="sound.id"
        class="group bg-white rounded-2xl border border-cyan-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
      >
        <!-- Cover Image -->
        <div class="relative h-40 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 overflow-hidden">
          <!-- Wave Pattern -->
          <div class="absolute inset-0 opacity-20">
            <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="white" opacity="0.3"/>
            </svg>
          </div>
          
          <!-- Icon -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
              </svg>
            </div>
          </div>
 
          <!-- Play Button -->
          <button
            @click="togglePlay(sound)"
            class="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
          >
            <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
              <svg v-if="currentPlayingId !== sound.id" class="w-6 h-6 text-cyan-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <svg v-else class="w-6 h-6 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            </div>
          </button>
 
          <!-- Category Badge -->
          <div class="absolute top-3 left-3">
            <span class="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-cyan-700 rounded-full">
              {{ sound.category || 'General' }}
            </span>
          </div>
        </div>
 
        <!-- Content -->
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-2 group-hover:text-cyan-600 transition-colors">
            {{ sound.title }}
          </h3>
          <p class="text-sm text-gray-600 line-clamp-2 mb-4">
            {{ sound.description }}
          </p>
 
          <!-- Meta Info -->
          <div class="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ sound.duration || '3:45' }}
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ sound.plays || 0 }} reproducciones
            </span>
          </div>
 
          <!-- Audio Player -->
          <div v-if="currentPlayingId === sound.id" class="mb-4">
            <audio
              :ref="el => { if (el) audioPlayer = el as HTMLAudioElement }"
              :src="sound.sound"
              controls
              class="w-full"
              @ended="currentPlayingId = null"
            ></audio>
          </div>
 
          <!-- Actions -->
          <div class="flex items-center gap-2 pt-4 border-t border-gray-100">
            <button
              @click="$emit('edit-sound', sound)"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-all text-sm font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Editar
            </button>
            <button
              @click="deleteSound(sound)"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all text-sm font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
 
    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl border border-cyan-100 shadow-sm p-12 text-center">
      <div class="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">No se encontraron sonidos</h3>
      <p class="text-gray-600 mb-6">{{ searchQuery ? 'Intenta con otros términos de búsqueda' : 'Agrega tu primer sonido terapéutico' }}</p>
      <RouterLink
        to="/add-sound"
        class="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
      >
        Agregar Sonido
      </RouterLink>
    </div>
 
    <!-- Delete Confirmation Modal -->
    <transition name="modal">
      <div v-if="soundToDelete"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="soundToDelete = null">
        <div class="bg-white rounded-3xl p-8 max-w-md shadow-2xl" @click.stop>
          <div class="text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">¿Eliminar Sonido?</h3>
            <p class="text-gray-600 mb-6">Esta acción no se puede deshacer.</p>
            <div class="flex gap-3">
              <button
                @click="soundToDelete = null"
                class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
              <button
                @click="confirmDelete"
                class="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { defineEmits } from 'vue';

import axios from 'axios';
import { RouterLink } from 'vue-router';

interface Sound {
  id: string;
  title: string;
  description: string;
  sound: string;
  duration: string;
  plays: number;
  category: string;
}


const isLoading = ref(false);
const sounds = ref<Sound[]>([]);

const emit = defineEmits<{
  'add-sound': [];
  'edit-sound': [sound: Sound];
  'delete-sound': [sound: Sound];
}>();

// State
const searchQuery = ref('');
const selectedCategory = ref('');
const currentPlayingId = ref<string | null>(null);
const soundToDelete = ref<Sound | null>(null);
const audioPlayer = ref<HTMLAudioElement | null>(null);

// Computed
const filteredSounds = computed(() => {
  let filtered = sounds.value || [];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((sound: any) =>
      sound.title.toLowerCase().includes(query) ||
      sound.description.toLowerCase().includes(query)
    );
  }

  // Filtrar por categoría
  if (selectedCategory.value) {
    filtered = filtered.filter((sound: any) => sound.category === selectedCategory.value);
  }

  return filtered;
});

const togglePlay = (sound: Sound) => {
  if (currentPlayingId.value === sound.id) {
    currentPlayingId.value = null;
    if (audioPlayer.value) {
      audioPlayer.value.pause();
    }
  } else {
    currentPlayingId.value = sound.id;
  }
};

const deleteSound = (sound: Sound) => {
  soundToDelete.value = sound;
}

const confirmDelete = () => {
  if(soundToDelete.value){
    emit('delete-sound', soundToDelete.value);
    soundToDelete.value = null;
  }
}

const fetchSounds = async () => {
  await axios.get('http://localhost:3000/api/v1/sounds')
    .then(response => {
      console.log('Sonidos obtenidos:', response.data);
      sounds.value = response.data;
    })
    .catch(error => {
      console.error('Error al obtener sonidos:', error);
    });
}

fetchSounds();

</script>
 
<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
 
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
 
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>