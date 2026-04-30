<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-white text-gray-800 p-4 md:p-6 font-mono relative overflow-hidden">

    <!-- ── Background Icons (WhatsApp Style with specified colors) ──────────────── -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <!-- Row 1 -->
      <svg class="absolute top-[4%] left-[5%] w-6 h-6 text-gray-400 opacity-[0.08]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
      <svg class="absolute top-[4%] left-[20%] w-5 h-5 text-gray-700 opacity-[0.06]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M9 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3H9zm10 0v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-6z" />
      </svg>
      <svg class="absolute top-[4%] left-[35%] w-6 h-6 text-gray-900 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
      </svg>
      <svg class="absolute top-[4%] left-[50%] w-5 h-5 text-slate-500 opacity-[0.07]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M15 6H3v12h12l4 4V6zM7 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-4c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
      </svg>
      <svg class="absolute top-[4%] left-[65%] w-6 h-6 text-slate-800 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V3h-3z" />
      </svg>
      <svg class="absolute top-[4%] left-[80%] w-5 h-5 text-emerald-100 opacity-[0.12]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M3 17h2v4H3v-4zm4-8h2v12H7V9zm4-4h2v16h-2V5zm4 4h2v12h-2V9zm4-8h2v20h-2V1z" />
      </svg>
      <svg class="absolute top-[4%] left-[92%] w-6 h-6 text-emerald-400 opacity-[0.06]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
      </svg>

      <!-- Row 2 -->
      <svg class="absolute top-[14%] left-[12%] w-5 h-5 text-emerald-600 opacity-[0.06]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
        <path
          d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
      </svg>
      <svg class="absolute top-[14%] left-[28%] w-6 h-6 text-emerald-900 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
      </svg>
      <svg class="absolute top-[14%] left-[42%] w-5 h-5 text-sky-400 opacity-[0.08]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M3 12h4l2-8 4 16 2-8h4" />
      </svg>
      <svg class="absolute top-[14%] left-[58%] w-6 h-6 text-blue-600 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 2c-4.97 0-9 4.03-9 9 0 2.76 1.12 5.26 2.93 7.07l1.41-1.41C7.12 15.23 6.5 13.19 6.5 11c0-3.58 2.92-6.5 6.5-6.5s6.5 2.92 6.5 6.5c0 2.19-.62 4.23-1.84 5.66l1.41 1.41C19.88 16.26 21 13.76 21 11c0-4.97-4.03-9-9-9z" />
        <path
          d="M12 7c-2.21 0-4 1.79-4 4 0 1.1.45 2.1 1.17 2.83l1.06-1.06c-.45-.45-.73-1.08-.73-1.77 0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5c0 .69-.28 1.32-.73 1.77l1.06 1.06C15.55 13.1 16 12.1 16 11c0-2.21-1.79-4-4-4z" />
      </svg>
      <svg class="absolute top-[14%] left-[74%] w-5 h-5 text-blue-900 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
      </svg>
      <svg class="absolute top-[14%] left-[88%] w-6 h-6 text-rose-400 opacity-[0.07]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
      </svg>

      <!-- Row 3 -->
      <svg class="absolute top-[24%] left-[8%] w-6 h-6 text-rose-500 opacity-[0.06]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
      </svg>
      <svg class="absolute top-[24%] left-[25%] w-5 h-5 text-rose-800 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
      <svg class="absolute top-[24%] left-[40%] w-6 h-6 text-amber-400 opacity-[0.08]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
      </svg>
      <svg class="absolute top-[24%] left-[55%] w-5 h-5 text-amber-600 opacity-[0.06]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
      </svg>
      <svg class="absolute top-[24%] left-[72%] w-6 h-6 text-gray-400 opacity-[0.07]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
      <svg class="absolute top-[24%] left-[85%] w-5 h-5 text-gray-700 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M12 4L9.19 9.26 3.27 11.27l4.23 3.68L6.46 21 12 17.27 17.54 21l-1.04-6.05 4.23-3.68-5.92-2.01z" />
      </svg>

      <!-- Row 4 -->
      <svg class="absolute top-[34%] left-[3%] w-5 h-5 text-gray-900 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <svg class="absolute top-[34%] left-[18%] w-6 h-6 text-slate-500 opacity-[0.06]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M7 2v11h3v9l7-12h-4l4-8z" />
      </svg>
      <svg class="absolute top-[34%] left-[32%] w-5 h-5 text-slate-800 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
      <svg class="absolute top-[34%] left-[48%] w-6 h-6 text-emerald-100 opacity-[0.10]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M9 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3H9zm10 0v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-6z" />
      </svg>
      <svg class="absolute top-[34%] left-[64%] w-5 h-5 text-emerald-400 opacity-[0.06]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
      </svg>
      <svg class="absolute top-[34%] left-[80%] w-6 h-6 text-emerald-600 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M15 6H3v12h12l4 4V6zM7 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-4c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
      </svg>

      <!-- Row 5 -->
      <svg class="absolute top-[44%] left-[10%] w-6 h-6 text-emerald-900 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V3h-3z" />
      </svg>
      <svg class="absolute top-[44%] left-[26%] w-5 h-5 text-sky-400 opacity-[0.07]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M3 17h2v4H3v-4zm4-8h2v12H7V9zm4-4h2v16h-2V5zm4 4h2v12h-2V9zm4-8h2v20h-2V1z" />
      </svg>
      <svg class="absolute top-[44%] left-[42%] w-6 h-6 text-blue-600 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
      </svg>
      <svg class="absolute top-[44%] left-[58%] w-5 h-5 text-blue-900 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
        <path
          d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
      </svg>
      <svg class="absolute top-[44%] left-[75%] w-6 h-6 text-rose-400 opacity-[0.07]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
      </svg>
      <svg class="absolute top-[44%] left-[90%] w-5 h-5 text-rose-500 opacity-[0.06]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M3 12h4l2-8 4 16 2-8h4" />
      </svg>

      <!-- Row 6 -->
      <svg class="absolute top-[54%] left-[6%] w-5 h-5 text-rose-800 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 2c-4.97 0-9 4.03-9 9 0 2.76 1.12 5.26 2.93 7.07l1.41-1.41C7.12 15.23 6.5 13.19 6.5 11c0-3.58 2.92-6.5 6.5-6.5s6.5 2.92 6.5 6.5c0 2.19-.62 4.23-1.84 5.66l1.41 1.41C19.88 16.26 21 13.76 21 11c0-4.97-4.03-9-9-9z" />
        <path
          d="M12 7c-2.21 0-4 1.79-4 4 0 1.1.45 2.1 1.17 2.83l1.06-1.06c-.45-.45-.73-1.08-.73-1.77 0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5c0 .69-.28 1.32-.73 1.77l1.06 1.06C15.55 13.1 16 12.1 16 11c0-2.21-1.79-4-4-4z" />
      </svg>
      <svg class="absolute top-[54%] left-[22%] w-6 h-6 text-amber-400 opacity-[0.07]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
      </svg>
      <svg class="absolute top-[54%] left-[38%] w-5 h-5 text-amber-600 opacity-[0.06]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
      </svg>
      <svg class="absolute top-[54%] left-[52%] w-6 h-6 text-gray-400 opacity-[0.08]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
      </svg>
      <svg class="absolute top-[54%] left-[68%] w-5 h-5 text-gray-700 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
      <svg class="absolute top-[54%] left-[85%] w-6 h-6 text-gray-900 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
      </svg>

      <!-- Row 7 -->
      <svg class="absolute top-[64%] left-[15%] w-6 h-6 text-slate-500 opacity-[0.06]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
      </svg>
      <svg class="absolute top-[64%] left-[30%] w-5 h-5 text-slate-800 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
      <svg class="absolute top-[64%] left-[45%] w-6 h-6 text-emerald-100 opacity-[0.10]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M12 4L9.19 9.26 3.27 11.27l4.23 3.68L6.46 21 12 17.27 17.54 21l-1.04-6.05 4.23-3.68-5.92-2.01z" />
      </svg>
      <svg class="absolute top-[64%] left-[60%] w-5 h-5 text-emerald-400 opacity-[0.06]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <svg class="absolute top-[64%] left-[78%] w-6 h-6 text-emerald-600 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M7 2v11h3v9l7-12h-4l4-8z" />
      </svg>

      <!-- Row 8 -->
      <svg class="absolute top-[74%] left-[5%] w-5 h-5 text-emerald-900 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
      <svg class="absolute top-[74%] left-[20%] w-6 h-6 text-sky-400 opacity-[0.07]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M9 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3H9zm10 0v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-6z" />
      </svg>
      <svg class="absolute top-[74%] left-[35%] w-5 h-5 text-blue-600 opacity-[0.06]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
      </svg>
      <svg class="absolute top-[74%] left-[50%] w-6 h-6 text-blue-900 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M15 6H3v12h12l4 4V6zM7 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-4c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
      </svg>
      <svg class="absolute top-[74%] left-[66%] w-5 h-5 text-rose-400 opacity-[0.07]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V3h-3z" />
      </svg>
      <svg class="absolute top-[74%] left-[82%] w-6 h-6 text-rose-500 opacity-[0.06]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M3 17h2v4H3v-4zm4-8h2v12H7V9zm4-4h2v16h-2V5zm4 4h2v12h-2V9zm4-8h2v20h-2V1z" />
      </svg>

      <!-- Row 9 -->
      <svg class="absolute top-[84%] left-[12%] w-6 h-6 text-rose-800 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
      </svg>
      <svg class="absolute top-[84%] left-[28%] w-5 h-5 text-amber-400 opacity-[0.08]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
        <path
          d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
      </svg>
      <svg class="absolute top-[84%] left-[44%] w-6 h-6 text-amber-600 opacity-[0.06]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
      </svg>
      <svg class="absolute top-[84%] left-[60%] w-5 h-5 text-gray-400 opacity-[0.07]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M3 12h4l2-8 4 16 2-8h4" />
      </svg>
      <svg class="absolute top-[84%] left-[76%] w-6 h-6 text-gray-700 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 2c-4.97 0-9 4.03-9 9 0 2.76 1.12 5.26 2.93 7.07l1.41-1.41C7.12 15.23 6.5 13.19 6.5 11c0-3.58 2.92-6.5 6.5-6.5s6.5 2.92 6.5 6.5c0 2.19-.62 4.23-1.84 5.66l1.41 1.41C19.88 16.26 21 13.76 21 11c0-4.97-4.03-9-9-9z" />
        <path
          d="M12 7c-2.21 0-4 1.79-4 4 0 1.1.45 2.1 1.17 2.83l1.06-1.06c-.45-.45-.73-1.08-.73-1.77 0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5c0 .69-.28 1.32-.73 1.77l1.06 1.06C15.55 13.1 16 12.1 16 11c0-2.21-1.79-4-4-4z" />
      </svg>
      <svg class="absolute top-[84%] left-[92%] w-5 h-5 text-gray-900 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
      </svg>

      <!-- Row 10 -->
      <svg class="absolute top-[94%] left-[8%] w-5 h-5 text-slate-500 opacity-[0.06]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
      </svg>
      <svg class="absolute top-[94%] left-[25%] w-6 h-6 text-slate-800 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
      </svg>
      <svg class="absolute top-[94%] left-[40%] w-5 h-5 text-emerald-100 opacity-[0.10]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
      <svg class="absolute top-[94%] left-[55%] w-6 h-6 text-emerald-400 opacity-[0.06]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z" />
      </svg>
      <svg class="absolute top-[94%] left-[72%] w-5 h-5 text-emerald-600 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path
          d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
      </svg>
      <svg class="absolute top-[94%] left-[88%] w-6 h-6 text-emerald-900 opacity-[0.05]" viewBox="0 0 24 24"
        fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    </div>

    <!-- ── Top bar ── -->
    <header class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-3">
        <span class="w-3 h-3 rounded-full bg-gray-600 animate-pulse" />
        <span class="text-lg font-bold tracking-wider text-gray-900">CHROMADRUM</span>
        <span class="text-xs text-gray-500 border border-gray-300 px-2 py-0.5 rounded bg-white/50">MK-I</span>
      </div>

      <div class="flex gap-3 items-center">
        <!-- BPM -->
        <div class="flex flex-col">
          <span class="text-[10px] uppercase text-gray-500 tracking-wider">BPM</span>
          <div class="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <button class="px-3 py-2 hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
              @click="bpm = Math.max(40, bpm - 1)">−</button>
            <input v-model.number="bpm" type="number" min="40" max="240"
              class="w-14 text-center bg-transparent text-gray-800 text-sm outline-none" @change="restartIfPlaying" />
            <button class="px-3 py-2 hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
              @click="bpm = Math.min(240, bpm + 1)">+</button>
          </div>
        </div>

        <!-- Step indicator -->
        <div class="flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
          <div v-for="s in 16" :key="s" class="w-2 h-2 rounded-full transition-all duration-75" :class="[
            isPlaying && currentStep === s - 1 ? 'bg-gray-900 shadow-[0_0_8px_rgba(0,0,0,0.3)]' : 'bg-gray-300',
            (s - 1) % 4 === 0 ? 'w-2.5 h-2.5' : ''
          ]" />
        </div>

        <!-- Play / Stop -->
        <button
          class="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-all shadow-lg shadow-gray-900/20"
          :class="isPlaying ? 'bg-gray-900 hover:bg-black shadow-black/30' : ''" @click="toggleSequencer">
          <svg v-if="!isPlaying" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path d="M8 5v14l11-7z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path d="M6 6h12v12H6z" />
          </svg>
        </button>

        <!-- Clear -->
        <button
          class="px-4 py-3 rounded-lg bg-white border border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900 text-xs font-bold tracking-wider transition-all shadow-sm"
          @click="clearAll">CLR</button>
      </div>
    </header>

    <!-- ── Sequencer ── -->
    <section class="bg-white/80 border border-gray-300 rounded-xl p-4 space-y-2 shadow-sm">
      <div v-for="(c, rowIdx) in colors" :key="c.id" class="flex items-center gap-3">
        <!-- Track label -->
        <div class="flex items-center gap-2 w-20 shrink-0">
          <div class="w-4 h-4 rounded" :style="{ background: c.color[Math.min(3, c.color.length - 1)] }" />
          <span class="text-xs text-gray-600 uppercase truncate">{{ c.id }}</span>
          <button class="w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold transition-colors"
            :class="muted.has(rowIdx) ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500 hover:text-gray-700'"
            @click="toggleMute(rowIdx)">M</button>
        </div>

        <!-- Steps -->
        <div class="flex-1 flex gap-1">
          <button v-for="step in 16" :key="step" class="flex-1 h-8 rounded transition-all duration-75" :class="[
            sequence[rowIdx]?.[step - 1] ? 'shadow-[0_0_6px_rgba(0,0,0,0.2)]' : 'bg-gray-200 hover:bg-gray-300',
            isPlaying && currentStep === step - 1 ? 'brightness-125' : '',
            (step - 1) % 4 === 0 ? 'border-l border-gray-400' : ''
          ]" :style="sequence[rowIdx]?.[step - 1]
            ? { background: c.color[Math.min(3, c.color.length - 1)] }
            : {}" @click="toggleStep(rowIdx, step - 1)" />
        </div>
      </div>
    </section>

    <!-- ── Detail panel ── -->
    <Transition name="panel">
      <section v-if="focusIdx !== null"
        class="fixed right-4 top-20 w-80 bg-white/95 backdrop-blur-xl border border-gray-300 rounded-xl p-4 shadow-2xl z-50">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-lg"
            :style="{ background: `linear-gradient(135deg, ${colors[focusIdx]?.color.slice(0, 4).join(',')})` }" />
          <div class="flex-1">
            <p class="text-gray-900 font-bold uppercase">{{ colors[focusIdx]?.id }}</p>
            <p class="text-xs text-gray-500">{{ colors[focusIdx]?.sound?.length }} sound{{
              colors[focusIdx]?.sound?.length
                !== 1 ? 's' : '' }}</p>
          </div>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            @click="focusIdx = null">✕</button>
        </div>

        <!-- Swatches -->
        <div class="flex flex-wrap gap-2 mb-4">
          <div v-for="(hex, i) in colors[focusIdx]?.color" :key="i"
            class="w-8 h-8 rounded-lg cursor-pointer hover:scale-110 transition-transform shadow-lg"
            :style="{ background: hex }" :title="hex" @click="copyHex(hex)" />
        </div>

        <!-- Sounds -->
        <div class="space-y-2">
          <button v-for="(url, si) in colors[focusIdx]?.sound" :key="si"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-left transition-colors group"
            :class="playingUrl === url ? 'bg-gray-300 border border-gray-400' : ''" @click="previewUrl(url)">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-gray-600">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span class="flex-1 text-sm text-gray-700 truncate">{{ soundName(url) }}</span>
            <span v-if="playingUrl === url" class="flex gap-0.5">
              <span v-for="n in 3" :key="n" class="w-1 h-4 bg-gray-600 rounded-full animate-pulse"
                :style="{ animationDelay: n * 80 + 'ms', animationDuration: '0.6s' }" />
            </span>
          </button>
        </div>

        <p v-if="copiedHex" class="mt-3 text-xs text-gray-600 flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ copiedHex }} copied
        </p>
      </section>
    </Transition>

    <!-- Floating Record Button -->
    <button
      class="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gray-900 hover:bg-black text-white shadow-2xl shadow-gray-900/40 flex items-center justify-center transition-all hover:scale-110 z-50 border-4 border-white"
      :class="isRecording ? 'bg-rose-600 hover:bg-rose-700 animate-pulse' : ''" @click="toggleRecording"
      title="Grabar audio">
      <svg v-if="!isRecording" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7">
        <circle cx="12" cy="12" r="6" />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7">
        <rect x="6" y="6" width="12" height="12" rx="2" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

interface Color { id: string; color: string[]; sound: string[] }

// ── Data ──────────────────────────────────────────────────────────────────────
const colors = ref<Color[]>([
  { id: 'yellow', color: ['#FEFCE8', '#FEF9C3', '#FEF08A', '#FDE047', '#FACC15', '#EAB308'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/yellow-chime.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/yellow-chimeII.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/CelebrationPartyBlowerHappy.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/AcousticGuitarGhordGranular.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/ShortMelodyMixedFeelings.mp3'] },
  { id: 'amber', color: ['#FFFBEB', '#FEF3C7', '#FDE68A', '#FCD34D', '#FBBF24', '#F59E0B'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/amber_tree.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/amber_treeII.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/LoopJazzSoftPiano.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/NostalgicEtherealStinger.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/VictoryFolkVideoGame.mp3'] },
  { id: 'green', color: ['#BBF7D0', '#86EFAC', '#4ADE80', '#22C55E', '#16A34A', '#15803D', '#166534', '#14532D', '#052E16'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Nature_Crickets.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Nature_Birds.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Nature_%20Mosquitos.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/ScifiOrganicEnginePass.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/SwellPeacefulShimmerChime.mp3'] },
  { id: 'emerald', color: ['#A7F3D0', '#6EE7B7', '#34D399', '#10B981', '#059669', '#047857', '#065F46', '#064E3B', '#022C22'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Cartoon_Pop_Pull.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Food_Drink_Bottle.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Food_Drink_Tableware_Spoon.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/ElectricCinematic.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/DescendOrchestral.mp3'] },
  { id: 'lime', color: ['#D9F99D', '#BEF264', '#A3E635', '#84CC16', '#65A30D', '#4D7C0F', '#7F6212', '#365314', '#1A2E05'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Food_Glass.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Glass_Break_Dry_Variation.mp3', ''] },
  { id: 'red', color: ['#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D', '#450A0A'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/PadSwellSpacecraft.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Pop_Various.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Retro_Beeps_Success.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/CartoonMusicalQuirkyFunnyClarinet.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/CatWildLionGrowlingPlayful.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/PopPop.mp3'] },
  { id: 'orange', color: ['#FED7AA', '#FDBA74', '#FB923C', '#F97316', '#EA580C', '#C2410C', '#9A3412', '#7C2D12', '#431407'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/RumbleDrone.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/SwellMysticPad.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/FastIntense,AggressiveEpicBig.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/ImpactRockSurface.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/VegetationTreeOntoGround.mp3'] },
  { id: 'pink', color: ['#FECDD3', '#FDA4AF', '#FB7185', '#F43F5E', '#E11D48', '#BE123C', '#9F1239', '#881337', '#4C0519'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Vehicles_Misc_Tap_Rhythmic.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/HumanMetalRunIsolatedSteps.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/BeaFunkyIntroLogo.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/DogGrowl.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/FrictionVibrant.mp3'] },
  { id: 'blue', color: ['#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A', '#172554'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Synthetic_Bubble.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/WinterSubwayPassingTraffic.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/CartoonMusical.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/PopVarious.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/CashRegister.mp3'] },
  { id: 'sky', color: ['#BAE6FD', '#7DD3FC', '#38BDF8', '#0EA5E9', '#0284C7', '#0369A1', '#075985', '#0C4A6E', '#082F49'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Water_Splash.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Water_Sound.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Arpeggio.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/CryingSad.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/RobotsSci-FiEmote.mp3'] },
  { id: 'cyan', color: ['#A5F3FC', '#67E8F9', '#22D3EE', '#06B6D4', '#0891B2', '#0E7490', '#155E75', '#164E63', '#083344'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/WaterBubblesBubbleSplash.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Water_Splash_Splat.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/BulletsRicochetAiry.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/DoorsOpen.mp3'] },
  { id: 'fuchsia', color: ['#F5D0FE', '#F0ABFC', '#E879F9', '#D946EF', '#C026D3', '#A21CAF', '#86198F', '#701A75', '#4A044E'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/WinterSubwayPassingTraffic.mp3'] },
  { id: 'purple', color: ['#DDD6FE', '#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#370764'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/BicycleBell.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Cartoon_Pop_Pull.mp3'] },
  { id: 'indigo', color: ['#C7D2FE', '#A5B4FC', '#818CF8', '#6366F1', '#4F46E5', '#4338CA', '#3730A3', '#312E81', '#1E1B4B'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/DarkSyntn.mp3'] },
  { id: 'violet', color: ['#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#2E1065'], sound: ['https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/MediumLargeBells.mp3', 'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/MorphingSynthDowner.mp3'] },
])

// ── State ─────────────────────────────────────────────────────────────────────
const bpm = ref(120)
const isPlaying = ref(false)
const currentStep = ref(-1)
const activePads = ref(new Set<number>())
const muted = ref(new Set<number>())
const focusIdx = ref<number | null>(null)
const activePattern = ref('')
const playingUrl = ref<string | null>(null)
const copiedHex = ref<string | null>(null)

const STEPS = 16
const sequence = ref<boolean[][]>(
  colors.value.map(() => Array<boolean>(STEPS).fill(false))
)

// ── Sequencer ─────────────────────────────────────────────────────────────────
let timer: ReturnType<typeof setInterval> | null = null

function toggleSequencer() { isPlaying.value ? stop() : start() }

function start() {
  if (timer) clearInterval(timer)
  isPlaying.value = true
  currentStep.value = -1
  timer = setInterval(tick, Math.round(60000 / bpm.value / 4))
}

function stop() {
  if (timer) { clearInterval(timer); timer = null }
  isPlaying.value = false
  currentStep.value = -1
}

function restartIfPlaying() { if (isPlaying.value) start() }

function tick() {
  currentStep.value = (currentStep.value + 1) % STEPS
  sequence.value.forEach((track, rowIdx) => {
    if (track[currentStep.value] && !muted.value.has(rowIdx)) {
      fire(rowIdx); flash(rowIdx)
    }
  })
}

function toggleMute(idx: number) {
  const s = new Set(muted.value)
  s.has(idx) ? s.delete(idx) : s.add(idx)
  muted.value = s
}

function toggleStep(row: number, step: number) {
  const next = sequence.value.map((t, r) =>
    r === row ? t?.map((v, s) => s === step ? !v : v) ?? [] : [...(t ?? [])]
  )
  sequence.value = next
  if (next[row]?.[step] && !muted.value.has(row)) fire(row)
}

function flash(idx: number) {
  activePads.value = new Set([...activePads.value, idx])
  setTimeout(() => {
    const s = new Set(activePads.value); s.delete(idx); activePads.value = s
  }, 130)
}

function fire(rowIdx: number) {
  const c = colors.value[rowIdx]
  if (!c || !c.sound.length) return
  new Audio(c.sound[Math.floor(Math.random() * c.sound.length)]).play().catch(() => { })
}

function clearAll() {
  stop()
  sequence.value = colors.value.map(() => Array<boolean>(STEPS).fill(false))
  muted.value = new Set()
  activePattern.value = ''
}

// ── Detail panel ──────────────────────────────────────────────────────────────
function previewUrl(url: string) {
  playingUrl.value = url
  const a = new Audio(url)
  a.play().catch(() => { })
  const clear = () => { if (playingUrl.value === url) playingUrl.value = null }
  a.onended = clear; setTimeout(clear, 10000)
}

function soundName(url: string) {
  return decodeURIComponent(url.split('/').pop() ?? url).replace(/\.mp3$/i, '').replace(/[_-]/g, ' ')
}

async function copyHex(hex: string) {
  try { await navigator.clipboard.writeText(hex) } catch { /* silent */ }
  copiedHex.value = hex
  setTimeout(() => { copiedHex.value = null }, 1800)
}

// ── Audio Recording ──────────────────────────────────────────────────────────
const isRecording = ref(false)
let mediaRecorder: MediaRecorder | null = null
let recordedChunks: Blob[] = []

async function toggleRecording() {
  if (!isRecording.value) {
    // Start recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder = new MediaRecorder(stream)
      recordedChunks = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `chromadrum-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`
        a.click()
        URL.revokeObjectURL(url)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      isRecording.value = true
    } catch (err) {
      console.error('Error accessing microphone:', err)
      alert('No se pudo acceder al micrófono. Verifica los permisos.')
    }
  } else {
    // Stop recording
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }
    isRecording.value = false
  }
}

onUnmounted(() => {
  stop()
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
  }
})
</script>

<style scoped>
/* ── Design tokens ── */
:root {
  --bg: #0d0d0f;
  --panel: #141417;
  --surface: #1c1c21;
  --border: #2a2a31;
  --border2: #38383f;
  --text: #e8e8f0;
  --muted: #6b6b7a;
  --accent: #7c5cfc;
}

.drum-root {
  font-family: ui-monospace, monospace;
  background: #0d0d0f;
  color: #e8e8f0;
  min-height: 100vh;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ── Top bar ── */
.top-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  background: #141417;
  border: 1px solid #2a2a31;
  border-radius: 14px;
  padding: .75rem 1.25rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: .5rem;
  margin-right: auto;
}

.brand-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #7c5cfc;
  box-shadow: 0 0 8px #7c5cfc;
}

.brand-name {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .12em;
  color: #e8e8f0;
}

.brand-sub {
  font-size: 10px;
  color: #6b6b7a;
  letter-spacing: .08em;
}

.transport {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ctrl-label {
  font-size: 9px;
  color: #6b6b7a;
  letter-spacing: .1em;
  display: block;
  margin-bottom: 3px;
}

.clear-btn:hover {
  border-color: #6b6b7a;
  color: #e8e8f0;
}

.pattern-row {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.pattern-btn {
  font-size: 9px;
  letter-spacing: .1em;
  padding: 4px 9px;
  border-radius: 5px;
  border: 1px solid #2a2a31;
  background: transparent;
  color: #6b6b7a;
  cursor: pointer;
  font-family: inherit;
  transition: all .1s;
}

.pattern-btn:hover {
  border-color: #38383f;
  color: #c8c8d8;
}

.pattern-btn--active {
  border-color: #7c5cfc;
  color: #7c5cfc;
  background: #7c5cfc18;
}

/* ── Pads ── */
.pads-section {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
}

.pad {
  position: relative;
  aspect-ratio: 1;
  border-radius: 10px;
  border: 1px solid #2a2a31;
  background: linear-gradient(145deg, var(--pad-dark, #1c1c21), #0d0d0f);
  cursor: pointer;
  overflow: hidden;
  transition: transform .09s, border-color .09s;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 6px 7px;
}

.pad:hover {
  border-color: var(--pad-mid, #38383f);
  transform: scale(1.02);
}

.pad--active {
  transform: scale(.93) !important;
  border-color: var(--pad-mid) !important;
}

.pad--selected {
  border-color: var(--pad-mid) !important;
  border-width: 1.5px;
}

.pad--muted {
  opacity: .35;
}

.pad-glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 40% 35%, var(--pad-mid, transparent) 0%, transparent 65%);
  opacity: .18;
  transition: opacity .09s;
}

.pad--active .pad-glow {
  opacity: .45;
}

.pad-name {
  position: relative;
  z-index: 1;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--pad-mid, #6b6b7a);
  text-shadow: 0 0 8px var(--pad-mid, transparent);
}

.pad-count {
  position: absolute;
  top: 5px;
  left: 6px;
  font-size: 8px;
  color: rgba(255, 255, 255, .3);
}

.pad-mute-badge {
  position: absolute;
  top: 5px;
  right: 6px;
  font-size: 8px;
  color: #ef4444;
  letter-spacing: .06em;
}

/* ── Sequencer ── */
.seq-section {
  background: #141417;
  border: 1px solid #2a2a31;
  border-radius: 14px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.seq-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.seq-label {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 76px;
  flex-shrink: 0;
}

.seq-swatch {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex-shrink: 0;
}

.seq-id {
  font-size: 9px;
  color: #6b6b7a;
  text-transform: uppercase;
  letter-spacing: .06em;
  flex: 1;
}

.seq-mute {
  font-size: 8px;
  padding: 1px 4px;
  border-radius: 3px;
  border: 1px solid #2a2a31;
  background: transparent;
  color: #6b6b7a;
  cursor: pointer;
  font-family: inherit;
  transition: all .1s;
  letter-spacing: .06em;
}

.seq-mute--on {
  border-color: #ef4444;
  color: #ef4444;
  background: #ef444415;
}

.seq-steps {
  display: flex;
  gap: 2px;
  flex: 1;
}

.seq-step {
  flex: 1;
  height: 18px;
  border-radius: 3px;
  border: none;
  background: #1c1c21;
  cursor: pointer;
  transition: background .08s, box-shadow .08s, transform .06s;
}

.seq-step--bar {
  margin-left: 3px;
}

.seq-step:hover:not(.seq-step--on) {
  background: #2a2a31;
}

.seq-step--on:hover {
  filter: brightness(1.15);
}

.seq-step--beat {
  outline: 1.5px solid rgba(255, 255, 255, .25);
  outline-offset: -1px;
}

.seq-step:active {
  transform: scaleY(.85);
}

/* ── Detail panel ── */
.detail-panel {
  background: #141417;
  border: 1px solid #2a2a31;
  border-radius: 14px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: .75rem;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: .75rem;
}

.detail-swatch {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  flex-shrink: 0;
}

.detail-name {
  font-size: 13px;
  font-weight: 700;
  text-transform: capitalize;
  color: #e8e8f0;
}

.detail-meta {
  font-size: 10px;
  color: #6b6b7a;
}

.detail-close {
  margin-left: auto;
  color: #6b6b7a;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: color .1s;
}

.detail-close:hover {
  color: #e8e8f0;
}

.detail-swatches {
  display: flex;
  gap: 3px;
  border-radius: 8px;
  overflow: hidden;
}

.detail-chip {
  flex: 1;
  height: 28px;
  cursor: pointer;
  transition: transform .1s;
}

.detail-chip:hover {
  transform: scaleY(1.15);
}

.detail-sounds {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-sound {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 8px;
  background: #1c1c21;
  border: 1px solid #2a2a31;
  cursor: pointer;
  text-align: left;
  color: #c8c8d8;
  font-family: inherit;
  font-size: 11px;
  transition: border-color .1s, background .1s;
}

.detail-sound svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  color: #6b6b7a;
}

.detail-sound span {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-sound:hover {
  background: #232328;
  border-color: #38383f;
}

.detail-sound--playing {
  border-color: #7c5cfc;
}

.detail-sound--playing svg {
  color: #7c5cfc;
}

.eq-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 12px;
}

.eq-bars i {
  display: block;
  width: 2px;
  border-radius: 1px;
  background: #7c5cfc;
  animation: eq .5s ease-in-out infinite alternate;
}

.eq-bars i:nth-child(1) {
  height: 5px;
}

.eq-bars i:nth-child(2) {
  height: 9px;
}

.eq-bars i:nth-child(3) {
  height: 6px;
}

@keyframes eq {
  from {
    transform: scaleY(.4);
  }

  to {
    transform: scaleY(1);
  }
}

.detail-copied {
  font-size: 10px;
  color: #6b6b7a;
  text-align: center;
}

/* ── Transitions ── */
.panel-enter-active,
.panel-leave-active {
  transition: opacity .2s, transform .2s;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>