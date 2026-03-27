<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
        <div class="max-w-7xl mx-auto space-y-6">

            <!-- Header -->
            <div class="bg-white rounded-3xl p-8 shadow-xl border border-purple-100">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                        </div>
                        <div>
                            <h1 class="text-3xl font-bold text-gray-800">Mezclador de Sonidos 🎚️</h1>
                            <p class="text-gray-600">Crea tus propias mezclas terapéuticas</p>
                        </div>
                    </div>

                    <!-- Controles Maestros -->
                    <div class="hidden md:flex items-center gap-3">
                        <button @click="playAll" :disabled="isRecording"
                            class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md disabled:opacity-50 flex items-center gap-2">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Reproducir Todo
                        </button>

                        <button @click="stopAll" :disabled="isRecording"
                            class="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-rose-700 transition-all shadow-md disabled:opacity-50 flex items-center gap-2">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 6h12v12H6z" />
                            </svg>
                            Detener Todo
                        </button>
                    </div>
                </div>
            </div>

            <!-- Mobile Master Controls -->
            <div class="md:hidden bg-white rounded-2xl p-4 shadow-md border border-purple-100">
                <div class="grid grid-cols-2 gap-3">
                    <button @click="playAll" :disabled="isRecording"
                        class="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        Reproducir
                    </button>

                    <button @click="stopAll" :disabled="isRecording"
                        class="px-4 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 6h12v12H6z" />
                        </svg>
                        Detener
                    </button>
                </div>
            </div>

            <!-- Grid de Sonidos -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <!-- Sonido Amarillo -->
                <div
                    class="bg-white rounded-3xl overflow-hidden shadow-xl border-4 border-yellow-200 transform hover:scale-105 transition-all duration-300">
                    <div
                        class="h-32 bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 relative overflow-hidden">
                        <div class="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                        <div class="relative h-full flex items-center justify-center">
                            <div class="text-center">
                                <div
                                    class="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h3 class="text-white font-bold text-lg">☀️ Sol</h3>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 space-y-4">
                        <button @click="toggleSound('yellow')" :disabled="isRecording"
                            class="w-full py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-amber-600 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
                            <svg v-if="!sounds.yellow.isPlaying" class="w-6 h-6" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                            {{ sounds.yellow.isPlaying ? 'Pausar' : 'Reproducir' }}
                        </button>

                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    </svg>
                                    Volumen
                                </label>
                                <span class="text-lg font-bold text-yellow-600">{{ Math.round(sounds.yellow.volume *
                                    100) }}%</span>
                            </div>
                            <input v-model.number="sounds.yellow.volume" type="range" min="0" max="1" step="0.01"
                                @input="updateVolume('yellow')"
                                class="w-full h-3 bg-yellow-100 rounded-full appearance-none cursor-pointer slider-yellow" />
                        </div>

                        <audio ref="audioYellow" :src="sounds.yellow.url" loop preload="auto"></audio>
                    </div>
                </div>

                <!-- Sonido Verde -->
                <div
                    class="bg-white rounded-3xl overflow-hidden shadow-xl border-4 border-green-200 transform hover:scale-105 transition-all duration-300">
                    <div
                        class="h-32 bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 relative overflow-hidden">
                        <div class="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                        <div class="relative h-full flex items-center justify-center">
                            <div class="text-center">
                                <div
                                    class="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 class="text-white font-bold text-lg">🌿 Naturaleza</h3>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 space-y-4">
                        <button @click="toggleSound('green')" :disabled="isRecording"
                            class="w-full py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-bold text-lg hover:from-green-500 hover:to-emerald-600 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
                            <svg v-if="!sounds.green.isPlaying" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                            {{ sounds.green.isPlaying ? 'Pausar' : 'Reproducir' }}
                        </button>

                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    </svg>
                                    Volumen
                                </label>
                                <span class="text-lg font-bold text-green-600">{{ Math.round(sounds.green.volume * 100)
                                }}%</span>
                            </div>
                            <input v-model.number="sounds.green.volume" type="range" min="0" max="1" step="0.01"
                                @input="updateVolume('green')"
                                class="w-full h-3 bg-green-100 rounded-full appearance-none cursor-pointer slider-green" />
                        </div>

                        <audio ref="audioGreen" :src="sounds.green.url" loop preload="auto"></audio>
                    </div>
                </div>

                <!-- Sonido Rojo -->
                <div
                    class="bg-white rounded-3xl overflow-hidden shadow-xl border-4 border-red-200 transform hover:scale-105 transition-all duration-300">
                    <div class="h-32 bg-gradient-to-br from-red-400 via-rose-400 to-pink-400 relative overflow-hidden">
                        <div class="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                        <div class="relative h-full flex items-center justify-center">
                            <div class="text-center">
                                <div
                                    class="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                    </svg>
                                </div>
                                <h3 class="text-white font-bold text-lg">🔥 Fuego</h3>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 space-y-4">
                        <button @click="toggleSound('red')" :disabled="isRecording"
                            class="w-full py-4 bg-gradient-to-r from-red-400 to-rose-500 text-white rounded-xl font-bold text-lg hover:from-red-500 hover:to-rose-600 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
                            <svg v-if="!sounds.red.isPlaying" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                            {{ sounds.red.isPlaying ? 'Pausar' : 'Reproducir' }}
                        </button>

                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    </svg>
                                    Volumen
                                </label>
                                <span class="text-lg font-bold text-red-600">{{ Math.round(sounds.red.volume * 100)
                                }}%</span>
                            </div>
                            <input v-model.number="sounds.red.volume" type="range" min="0" max="1" step="0.01"
                                @input="updateVolume('red')"
                                class="w-full h-3 bg-red-100 rounded-full appearance-none cursor-pointer slider-red" />
                        </div>

                        <audio ref="audioRed" :src="sounds.red.url" loop preload="auto"></audio>
                    </div>
                </div>

                <!-- Sonido Naranja -->
                <div
                    class="bg-white rounded-3xl overflow-hidden shadow-xl border-4 border-orange-200 transform hover:scale-105 transition-all duration-300">
                    <div
                        class="h-32 bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400 relative overflow-hidden">
                        <div class="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                        <div class="relative h-full flex items-center justify-center">
                            <div class="text-center">
                                <div
                                    class="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 class="text-white font-bold text-lg">⚡ Energía</h3>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 space-y-4">
                        <button @click="toggleSound('orange')" :disabled="isRecording"
                            class="w-full py-4 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-xl font-bold text-lg hover:from-orange-500 hover:to-amber-600 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
                            <svg v-if="!sounds.orange.isPlaying" class="w-6 h-6" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                            {{ sounds.orange.isPlaying ? 'Pausar' : 'Reproducir' }}
                        </button>

                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    </svg>
                                    Volumen
                                </label>
                                <span class="text-lg font-bold text-orange-600">{{ Math.round(sounds.orange.volume *
                                    100) }}%</span>
                            </div>
                            <input v-model.number="sounds.orange.volume" type="range" min="0" max="1" step="0.01"
                                @input="updateVolume('orange')"
                                class="w-full h-3 bg-orange-100 rounded-full appearance-none cursor-pointer slider-orange" />
                        </div>

                        <audio ref="audioOrange" :src="sounds.orange.url" loop preload="auto"></audio>
                    </div>
                </div>

                <!-- Sonido Azul -->
                <div
                    class="bg-white rounded-3xl overflow-hidden shadow-xl border-4 border-blue-200 transform hover:scale-105 transition-all duration-300">
                    <div class="h-32 bg-gradient-to-br from-blue-400 via-cyan-400 to-sky-400 relative overflow-hidden">
                        <div class="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                        <div class="relative h-full flex items-center justify-center">
                            <div class="text-center">
                                <div
                                    class="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                                    </svg>
                                </div>
                                <h3 class="text-white font-bold text-lg">💎 Cristal</h3>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 space-y-4">
                        <button @click="toggleSound('blue')" :disabled="isRecording"
                            class="w-full py-4 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-xl font-bold text-lg hover:from-blue-500 hover:to-cyan-600 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
                            <svg v-if="!sounds.blue.isPlaying" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                            {{ sounds.blue.isPlaying ? 'Pausar' : 'Reproducir' }}
                        </button>

                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    </svg>
                                    Volumen
                                </label>
                                <span class="text-lg font-bold text-blue-600">{{ Math.round(sounds.blue.volume * 100)
                                }}%</span>
                            </div>
                            <input v-model.number="sounds.blue.volume" type="range" min="0" max="1" step="0.01"
                                @input="updateVolume('blue')"
                                class="w-full h-3 bg-blue-100 rounded-full appearance-none cursor-pointer slider-blue" />
                        </div>

                        <audio ref="audioBlue" :src="sounds.blue.url" loop preload="auto"></audio>
                    </div>
                </div>

                <!-- Sonido Morado -->
                <div
                    class="bg-white rounded-3xl overflow-hidden shadow-xl border-4 border-purple-200 transform hover:scale-105 transition-all duration-300">
                    <div
                        class="h-32 bg-gradient-to-br from-purple-400 via-violet-400 to-fuchsia-400 relative overflow-hidden">
                        <div class="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                        <div class="relative h-full flex items-center justify-center">
                            <div class="text-center">
                                <div
                                    class="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                <h3 class="text-white font-bold text-lg">✨ Mágico</h3>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 space-y-4">
                        <button @click="toggleSound('purple')" :disabled="isRecording"
                            class="w-full py-4 bg-gradient-to-r from-purple-400 to-fuchsia-500 text-white rounded-xl font-bold text-lg hover:from-purple-500 hover:to-fuchsia-600 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
                            <svg v-if="!sounds.purple.isPlaying" class="w-6 h-6" fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                            {{ sounds.purple.isPlaying ? 'Pausar' : 'Reproducir' }}
                        </button>

                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    </svg>
                                    Volumen
                                </label>
                                <span class="text-lg font-bold text-purple-600">{{ Math.round(sounds.purple.volume *
                                    100) }}%</span>
                            </div>
                            <input v-model.number="sounds.purple.volume" type="range" min="0" max="1" step="0.01"
                                @input="updateVolume('purple')"
                                class="w-full h-3 bg-purple-100 rounded-full appearance-none cursor-pointer slider-purple" />
                        </div>

                        <audio ref="audioPurple" :src="sounds.purple.url" loop preload="auto"></audio>
                    </div>
                </div>

            </div>

            <!-- Controles de Grabación -->
            <div class="bg-white rounded-3xl p-8 shadow-xl border border-purple-100">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div
                        class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </div>
                    Grabar Mezcla
                </h2>

                <div class="space-y-4">
                    <div v-if="!isRecording" class="flex flex-col md:flex-row gap-4">
                        <button @click="startRecording" :disabled="!hasPlayingSounds"
                            class="flex-1 px-8 py-5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-bold text-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                            <div class="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                            Iniciar Grabación
                        </button>

                        <div v-if="!hasPlayingSounds" class="text-center md:hidden">
                            <p class="text-sm text-gray-500">⚠️ Reproduce al menos un sonido para grabar</p>
                        </div>
                    </div>

                    <div v-else class="space-y-4">
                        <div class="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-200">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <div
                                        class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                                        <div class="w-6 h-6 bg-white rounded-sm"></div>
                                    </div>
                                    <div>
                                        <p class="text-lg font-bold text-red-700">🔴 Grabando...</p>
                                        <p class="text-3xl font-bold text-gray-800">{{ recordingTime }}s</p>
                                    </div>
                                </div>

                                <button @click="stopRecording"
                                    class="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl font-bold hover:from-gray-800 hover:to-black transition-all shadow-md flex items-center gap-2">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 6h12v12H6z" />
                                    </svg>
                                    Detener
                                </button>
                            </div>
                        </div>

                        <p class="text-sm text-gray-600 text-center">⚠️ Los controles están deshabilitados durante la
                            grabación</p>
                    </div>

                    <!-- Vista Previa de Grabación -->
                    <div v-if="recordedAudioURL"
                        class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                        <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            ✅ Mezcla Grabada Exitosamente
                        </h3>

                        <audio :src="recordedAudioURL" controls class="w-full mb-4 rounded-xl"></audio>

                        <button @click="downloadRecording"
                            class="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all shadow-md flex items-center justify-center gap-2">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Descargar Mezcla
                        </button>
                    </div>

                    <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <p class="text-sm text-blue-800 flex items-start gap-2">
                            <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span><strong>Instrucciones:</strong> Reproduce los sonidos que desees mezclar, ajusta sus
                                volúmenes y haz clic en "Iniciar Grabación" para capturar tu mezcla
                                personalizada.</span>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';

type SoundColor = 'yellow' | 'green' | 'red' | 'orange' | 'blue' | 'purple';

interface Sound {
    url: string;
    volume: number;
    isPlaying: boolean;
}

// Audio Elements Refs
const audioYellow = ref<HTMLAudioElement | null>(null);
const audioGreen = ref<HTMLAudioElement | null>(null);
const audioRed = ref<HTMLAudioElement | null>(null);
const audioOrange = ref<HTMLAudioElement | null>(null);
const audioBlue = ref<HTMLAudioElement | null>(null);
const audioPurple = ref<HTMLAudioElement | null>(null);

// Sounds State
const sounds = ref<Record<SoundColor, Sound>>({
    yellow: { url: '/sounds/yellow.mp3', volume: 0.5, isPlaying: false },
    green: { url: '/sounds/green.mp3', volume: 0.5, isPlaying: false },
    red: { url: '/sounds/red.mp3', volume: 0.5, isPlaying: false },
    orange: { url: '/sounds/orange.mp3', volume: 0.5, isPlaying: false },
    blue: { url: '/sounds/blue.mp3', volume: 0.5, isPlaying: false },
    purple: { url: '/sounds/purple.mp3', volume: 0.5, isPlaying: false },
});

// Recording State
const isRecording = ref(false);
const recordingTime = ref(0);
const recordedAudioURL = ref<string>('');
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);
const recordingInterval = ref<number | null>(null);

// Computed
const hasPlayingSounds = computed(() => {
    return Object.values(sounds.value).some(sound => sound.isPlaying);
});

// Audio Element Mapping
const getAudioElement = (color: SoundColor): HTMLAudioElement | null => {
    const map = {
        yellow: audioYellow.value,
        green: audioGreen.value,
        red: audioRed.value,
        orange: audioOrange.value,
        blue: audioBlue.value,
        purple: audioPurple.value,
    };
    return map[color];
};

// Methods
const toggleSound = (color: SoundColor) => {
    const audio = getAudioElement(color);
    if (!audio) return;

    if (sounds.value[color].isPlaying) {
        audio.pause();
        sounds.value[color].isPlaying = false;
    } else {
        audio.volume = sounds.value[color].volume;
        audio.play();
        sounds.value[color].isPlaying = true;
    }
};

const updateVolume = (color: SoundColor) => {
    const audio = getAudioElement(color);
    if (!audio) return;
    audio.volume = sounds.value[color].volume;
};

const playAll = () => {
    const colors: SoundColor[] = ['yellow', 'green', 'red', 'orange', 'blue', 'purple'];
    colors.forEach(color => {
        const audio = getAudioElement(color);
        if (audio && !sounds.value[color].isPlaying) {
            audio.volume = sounds.value[color].volume;
            audio.play();
            sounds.value[color].isPlaying = true;
        }
    });
};

const stopAll = () => {
    const colors: SoundColor[] = ['yellow', 'green', 'red', 'orange', 'blue', 'purple'];
    colors.forEach(color => {
        const audio = getAudioElement(color);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            sounds.value[color].isPlaying = false;
        }
    });
};

const startRecording = async () => {
    try {
        const audioContext = new AudioContext();
        const destination = audioContext.createMediaStreamDestination();

        const colors: SoundColor[] = ['yellow', 'green', 'red', 'orange', 'blue', 'purple'];
        colors.forEach(color => {
            const audio = getAudioElement(color);
            if (audio && sounds.value[color].isPlaying) {
                const source = audioContext.createMediaElementSource(audio);
                const gainNode = audioContext.createGain();
                gainNode.gain.value = sounds.value[color].volume;

                source.connect(gainNode);
                gainNode.connect(destination);
                gainNode.connect(audioContext.destination);
            }
        });

        mediaRecorder.value = new MediaRecorder(destination.stream);
        audioChunks.value = [];

        mediaRecorder.value.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.value.push(event.data);
            }
        };

        mediaRecorder.value.onstop = () => {
            const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' });
            recordedAudioURL.value = URL.createObjectURL(audioBlob);
        };

        mediaRecorder.value.start();
        isRecording.value = true;
        recordingTime.value = 0;

        recordingInterval.value = window.setInterval(() => {
            recordingTime.value++;
        }, 1000);

    } catch (error) {
        console.error('Error al iniciar grabación:', error);
        alert('Error al iniciar la grabación. Asegúrate de que al menos un sonido esté reproduciéndose.');
    }
};

const stopRecording = () => {
    if (mediaRecorder.value && isRecording.value) {
        mediaRecorder.value.stop();
        isRecording.value = false;

        if (recordingInterval.value) {
            clearInterval(recordingInterval.value);
            recordingInterval.value = null;
        }
    }
};

const downloadRecording = () => {
    if (!recordedAudioURL.value) return;

    const link = document.createElement('a');
    link.href = recordedAudioURL.value;
    link.download = `mezcla-${Date.now()}.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Cleanup
onUnmounted(() => {
    if (recordingInterval.value) {
        clearInterval(recordingInterval.value);
    }
    if (recordedAudioURL.value) {
        URL.revokeObjectURL(recordedAudioURL.value);
    }
});
</script>

<style scoped>
/* Custom range sliders */
.slider-yellow::-webkit-slider-thumb {
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(251, 191, 36, 0.5);
}

.slider-green::-webkit-slider-thumb {
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #34d399, #10b981);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(52, 211, 153, 0.5);
}

.slider-red::-webkit-slider-thumb {
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f87171, #ef4444);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(248, 113, 113, 0.5);
}

.slider-orange::-webkit-slider-thumb {
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fb923c, #f97316);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(251, 146, 60, 0.5);
}

.slider-blue::-webkit-slider-thumb {
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #60a5fa, #3b82f6);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(96, 165, 250, 0.5);
}

.slider-purple::-webkit-slider-thumb {
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #a78bfa, #8b5cf6);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(167, 139, 250, 0.5);
}
</style>