<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6 relative overflow-hidden">
        <!-- Background Pattern - Estilo WhatsApp (iconos pequeños 24px) -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <!-- Fila 1 -->
            <div class="floating-icon absolute top-[5%] left-[5%] text-purple-200" style="animation-delay: 0s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[8%] left-[15%] text-pink-200" style="animation-delay: 1s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[3%] left-[25%] text-indigo-200" style="animation-delay: 2s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path
                        d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[6%] left-[35%] text-rose-200" style="animation-delay: 3s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3H9z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[4%] left-[45%] text-violet-200" style="animation-delay: 4s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[7%] left-[55%] text-purple-200" style="animation-delay: 5s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path
                        d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[5%] left-[65%] text-fuchsia-200" style="animation-delay: 6s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    <path
                        d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[8%] left-[75%] text-pink-200" style="animation-delay: 7s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[3%] left-[85%] text-indigo-200" style="animation-delay: 8s;">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[6%] left-[95%] text-rose-200" style="animation-delay: 9s;">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
            </div>

            <!-- Fila 2 -->
            <div class="floating-icon absolute top-[20%] left-[10%] text-violet-200" style="animation-delay: 1.5s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[22%] left-[20%] text-purple-200" style="animation-delay: 2.5s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[18%] left-[30%] text-pink-200" style="animation-delay: 3.5s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path
                        d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[21%] left-[40%] text-indigo-200" style="animation-delay: 4.5s;">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[19%] left-[50%] text-fuchsia-200" style="animation-delay: 5.5s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3H9z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[23%] left-[60%] text-rose-200" style="animation-delay: 6.5s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[17%] left-[70%] text-violet-200" style="animation-delay: 7.5s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[20%] left-[80%] text-purple-200" style="animation-delay: 8.5s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    <path
                        d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[24%] left-[90%] text-pink-200" style="animation-delay: 0.5s;">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
            </div>

            <!-- Fila 3 -->
            <div class="floating-icon absolute top-[35%] left-[5%] text-indigo-200" style="animation-delay: 2s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[38%] left-[15%] text-fuchsia-200" style="animation-delay: 3s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[33%] left-[25%] text-violet-200" style="animation-delay: 4s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    <path
                        d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[36%] left-[35%] text-purple-200" style="animation-delay: 5s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3H9z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[32%] left-[45%] text-rose-200" style="animation-delay: 6s;">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[39%] left-[55%] text-fuchsia-200" style="animation-delay: 7s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[31%] left-[65%] text-violet-200" style="animation-delay: 8s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[36%] left-[75%] text-purple-200" style="animation-delay: 9s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path
                        d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[34%] left-[85%] text-pink-200" style="animation-delay: 1s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[38%] left-[95%] text-indigo-200" style="animation-delay: 2s;">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
            </div>

            <!-- Fila 4 -->
            <div class="floating-icon absolute top-[50%] left-[8%] text-pink-200" style="animation-delay: 3.5s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path
                        d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[53%] left-[18%] text-rose-200" style="animation-delay: 4.5s;">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[48%] left-[28%] text-indigo-200" style="animation-delay: 5.5s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[52%] left-[38%] text-violet-200" style="animation-delay: 6.5s;">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[47%] left-[48%] text-purple-200" style="animation-delay: 7.5s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3H9z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[54%] left-[58%] text-fuchsia-200" style="animation-delay: 8.5s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[49%] left-[68%] text-pink-200" style="animation-delay: 0.8s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[55%] left-[78%] text-rose-200" style="animation-delay: 1.8s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[51%] left-[88%] text-indigo-200" style="animation-delay: 2.8s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    <path
                        d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
            </div>

            <!-- Fila 5 -->
            <div class="floating-icon absolute top-[65%] left-[12%] text-violet-200" style="animation-delay: 3s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    <path
                        d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[68%] left-[22%] text-purple-200" style="animation-delay: 4s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[62%] left-[32%] text-pink-200" style="animation-delay: 5s;">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[70%] left-[42%] text-fuchsia-200" style="animation-delay: 6s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[64%] left-[52%] text-rose-200" style="animation-delay: 7s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[71%] left-[62%] text-indigo-200" style="animation-delay: 8s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[66%] left-[72%] text-violet-200" style="animation-delay: 0.3s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3H9z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[73%] left-[82%] text-purple-200" style="animation-delay: 1.3s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path
                        d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[68%] left-[92%] text-pink-200" style="animation-delay: 2.3s;">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
            </div>

            <!-- Fila 6 -->
            <div class="floating-icon absolute top-[80%] left-[7%] text-fuchsia-200" style="animation-delay: 4.2s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 2C8.5 2 6 4.5 6 8c0 2.5 1.5 4 3 5.5S11 16 11 18c0 1.5-.5 2-1.5 2S8 19.5 8 18c0-.5.2-1 .5-1.3.3-.3.5-.7.5-1.2 0-1-.8-1.5-1.5-1.5S6 14.5 6 15.5c0 1.3.5 2.5 1.5 3.3.8.7 1.5 1.7 1.5 2.7 0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5c0-2-1-3.5-2.5-5C13.5 11.5 13 10.5 13 9c0-1.5 1-2.5 2-2.5s2 1 2 2.5c0 .5-.2 1-.5 1.3-.3.3-.5.7-.5 1.2 0 1 .8 1.5 1.5 1.5s1.5-.5 1.5-1.5c0-1.3-.5-2.5-1.5-3.3-.8-.7-1.5-1.7-1.5-2.7C17 4.5 14.5 2 12 2z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[83%] left-[17%] text-rose-200" style="animation-delay: 5.2s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[78%] left-[27%] text-violet-200" style="animation-delay: 6.2s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[85%] left-[37%] text-indigo-200" style="animation-delay: 7.2s;">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[81%] left-[47%] text-purple-200" style="animation-delay: 8.2s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[87%] left-[57%] text-pink-200" style="animation-delay: 0.6s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[82%] left-[67%] text-fuchsia-200" style="animation-delay: 1.6s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3H9z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[88%] left-[77%] text-rose-200" style="animation-delay: 2.6s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    <path
                        d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[84%] left-[87%] text-violet-200" style="animation-delay: 3.6s;">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path
                        d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
            </div>
            <div class="floating-icon absolute top-[90%] left-[95%] text-indigo-200" style="animation-delay: 4.6s;">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
            </div>
        </div>
        <div class="p-6 space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-800">Audio Mixer</h2>
                <p class="text-sm text-gray-400 mt-0.5">{{ colors.length }} familias de colores</p>
            </div>

            <!-- Search -->
            <div class="relative">
                <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input v-model="search" type="text" placeholder="Buscar color..." class="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl
                 focus:ring-2 focus:ring-purple-400 focus:border-transparent
                 outline-none w-48 bg-white" />
            </div>
        </div>

        <!-- Color Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <div v-for="item in filtered" :key="item.id" class="group bg-white border border-gray-100 rounded-2xl p-4
               hover:border-gray-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
                @click="selectColor(item)" :class="{ 'ring-2 ring-offset-1': selected?.id === item.id }" :style="selected?.id === item.id
                    ? { '--tw-ring-color': item.color[4] }
                    : {}">
                <!-- Color name + play button -->
                <div class="flex items-center justify-betweenmb-3">
                    <span class="text-sm font-medium text-gray-700 capitalize">{{ item.id }} </span>
                    <button v-if="item.sound" @click.stop="playSound(item)" class="w-7 h-7 rounded-full flex items-center justify-center
                   transition-all duration-150 hover:scale-110 active:scale-95"
                        :style="{ background: item.color[4] + '22', color: item.color[6] }" title="Reproducir sonido">
                        <svg v-if="playing !== item.id" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        <!-- Animación de audio -->
                        <span v-else class="flex gap-px items-end h-3.5">
                            <span v-for="n in 3" :key="n" class="w-0.5 rounded-full animate-bounce"
                                :style="{ background: item.color[6], animationDelay: (n * 80) + 'ms', height: (8 + n * 2) + 'px' }" />
                        </span>
                    </button>
                    <span v-else class="text-xs text-gray-300 italic">sin audio</span>
                </div>
                <!-- Swatches strip -->
                <div class="flex rounded-xl overflow-hidden gap-px">
                    <div v-for="(hex, idx) in item.color" :key="idx"
                        class="flex-1 h-10 transition-transform duration-150 hover:scale-y-110 cursor-default"
                        :style="{ background: hex }" :title="hex"></div>

                    <!--  Hex previw on hover -->
                    <div class="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div class="w-4 h-4 rounded-full border border-gray-100 flex-shrink-0"
                            :style="{ background: item.color[5] }"></div>
                    </div>
                </div>
            </div>

            <!-- Panel de detalle -->
            <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0 translate-y-2"
                leave-active-class="transition-all duration-200" leave-to-class="opacity-0 translate-y-2">
                <div v-if="selected" class="bg-white w-full border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div class="flex items-center justify-between mb-5">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg" :style="{ background: selected.color[5] }" />
                            <div>
                                <h3 class="font-semibold text-gray-800 capitalize">{{ selected.id }}</h3>
                                <p class="text-xs text-gray-400">{{ selected.color.length }} variantes</p>
                            </div>
                        </div>
                        <button @click="selected = null"
                            class="text-gray-300 hover:text-gray-500 transition-colors text-lg leading-none">✕</button>
                    </div>

                    <!-- Swatches detallados -->
                    <div class="grid grid-cols-11 gap-1.5">
                        <div v-for="(hex, idx) in selected.color" :key="idx" class="group/swatch relative">
                            <div class="h-12 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-150 border border-black/5"
                                :style="{ background: hex }" @click="copyHex(hex)" :title="'Copiar ' + hex" />
                            <div class="text-center mt-1">
                                <span class="text-xs text-gray-400">{{ shadeLabel(idx) }}</span>
                            </div>
                            <!-- Tooltip de hex -->
                            <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white
                     text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none
                     opacity-0 group-hover/swatch:opacity-100 transition-opacity z-10">
                                {{ hex }}
                            </div>
                        </div>
                    </div>

                    <!-- Toast de copiado -->
                    <Transition enter-active-class="transition-all duration-200" enter-from-class="opacity-0 scale-95"
                        leave-to-class="opacity-0 scale-95">
                        <div v-if="copied" class="mt-4 text-sm text-center py-2 rounded-xl"
                            :style="{ background: selected.color[1], color: selected.color[7] }">
                            ✓ <strong>{{ copied }}</strong> copiado al portapapeles
                        </div>
                    </Transition>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Color {
    id: string;
    color: string[];
    sound?: string[];
}

const colors = ref<Color[]>([
    { id: 'yellow', color: ['#FEFCE8', '#FEF9C3', '#FEF08A', '#FDE047', '#FACC15', '#EAB308', '#CA8A04', '#A16207', '#854D0E', '#713F12', '#422006'], sound: ['/sounds/yellow.mp3'] },
    { id: 'amber', color: ['#FFFBEB', '#FEF3C7', '#FDE68A', '#FCD34D', '#FBBF24', '#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F', '#451A03'], sound: ['/sounds/amber.mp3'] },
    { id: 'green', color: ['#F0FDF4', '#DCFCE7', '#BBF7D0', '#86EFAC', '#4ADE80', '#22C55E', '#16A34A', '#15803D', '#166534', '#14532D', '#052E16'], sound: ['/sounds/green.mp3'] },
    { id: 'emeral   d', color: ['#ECFDF5', '#D1FAE5', '#A7F3D0', '#6EE7B7', '#34D399', '#10B981', '#059669', '#047857', '#065F46', '#064E3B', '#022C22'], sound: ['/sounds/emerald.mp3'] },
    { id: 'lime', color: ['#F7FEE7', '#ECFCCB', '#D9F99D', '#BEF264', '#A3E635', '#84CC16', '#65A30D', '#4D7C0F', '#7F6212', '#365314', '#1A2E05'], sound: [] },
    { id: 'red', color: ['#FEF2F2', '#FEE2E2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D', '#450A0A'], sound: ['/sounds/red.mp3'] },
    { id: 'orange', color: ['#FFF7ED', '#FFEDD5', '#FED7AA', '#FDBA74', '#FB923C', '#F97316', '#EA580C', '#C2410C', '#9A3412', '#7C2D12', '#431407'], sound: ['/sounds/orange.mp3'] },
    { id: 'pink', color: ['#FDF2F8', '#FCE7F3', '#FBCFE8', '#F9A8D4', '#F472B6', '#EC4899', '#DB2777', '#BE185D', '#9D174D', '#831843', '#500724'], sound: ['/sounds/pink.mp3'] },
    { id: 'rose', color: ['#FFF1F2', '#FFE4E6', '#FECDD3', '#FDA4AF', '#FB7185', '#F43F5E', '#E11D48', '#BE123C', '#9F1239', '#881337', '#4C0519'], sound: ['/sounds/rose.mp3'] },
    { id: 'blue', color: ['#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A', '#172554'], sound: ['/sounds/blue.mp3'] },
    { id: 'sky', color: ['#F0F9FF', '#E0F2FE', '#BAE6FD', '#7DD3FC', '#38BDF8', '#0EA5E9', '#0284C7', '#0369A1', '#075985', '#0C4A6E', '#082F49'], sound: ['/sounds/sky.mp3'] },
    { id: 'cyan', color: ['#ECFEFF', '#CFFAFE', '#A5F3FC', '#67E8F9', '#22D3EE', '#06B6D4', '#0891B2', '#0E7490', '#155E75', '#164E63', '#083344'], sound: ['/sounds/cyan.mp3'] },
    { id: 'fuchsia', color: ['#FDF4FF', '#FAE8FF', '#F5D0FE', '#F0ABFC', '#E879F9', '#D946EF', '#C026D3', '#A21CAF', '#86198F', '#701A75', '#4A044E'], sound: ['/sounds/fuchsia.mp3'] },
    { id: 'purple', color: ['#F5F3FF', '#EDE9FE', '#DDD6FE', '#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#370764'], sound: ['/sounds/purple.mp3'] },
    { id: 'indigo', color: ['#EEF2FF', '#E0E7FF', '#C7D2FE', '#A5B4FC', '#818CF8', '#6366F1', '#4F46E5', '#4338CA', '#3730A3', '#312E81', '#1E1B4B'], sound: ['/sounds/indigo.mp3'] },
    { id: 'violet', color: ['#F5F3FF', '#EDE9FE', '#DDD6FE', '#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#2E1065'], sound: ['/sounds/violet.mp3'] }
]);
const SHADE_LABELS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
const shadeLabel = (idx: number) => SHADE_LABELS[idx] ?? idx

const search = ref('')
const selected = ref<Color | null>(null)
const playing = ref<string | null>(null)
const copied = ref<string | null>(null)

const filtered = computed(() =>
    search.value.trim()
        ? colors.value.filter(c => c.id.includes(search.value.toLowerCase()))
        : colors.value
)

function selectColor(item: Color) {
    selected.value = selected.value?.id === item.id ? null : item
    copied.value = null
}

function playSound(item: Color) {
    if (!item.sound) return
    playing.value = item.id
    const audio = new Audio(item.sound)
    audio.play().catch(() => { })
    audio.onended = () => { playing.value = null }
    setTimeout(() => { playing.value = null }, 4000)
}

async function copyHex(hex: string) {
    try {
        await navigator.clipboard.writeText(hex)
        copied.value = hex
        setTimeout(() => { copied.value = null }, 2000)
    } catch {
        copied.value = hex
        setTimeout(() => { copied.value = null }, 2000)
    }
}
</script>

<style scoped>
/* Animación de flotación suave para los íconos de fondo */
.floating-icon {
    animation: float 20s ease-in-out infinite;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    25% {
        transform: translateY(-20px) rotate(2deg);
    }

    50% {
        transform: translateY(-10px) rotate(-1deg);
    }

    75% {
        transform: translateY(-30px) rotate(1deg);
    }
}
</style>