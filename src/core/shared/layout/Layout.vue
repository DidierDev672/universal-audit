<template>
   <div class="flex h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-purple-50 overflow-hidden">
    <!-- Sidebar -->
    <Sidebar
      :is-open="isSidebarOpen"
      @toggle="toggleSidebar"
      @navigate="handleNavigate"
    />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Bar -->
      <header class="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 z-10">
        <div class="px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <!-- Mobile menu button -->
            <button
              @click="toggleSidebar"
              class="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>

            <!-- Page Title -->
            <div class="flex items-center gap-3">
              <div class="hidden lg:block">
                <h1 class="text-2xl font-bold text-gray-800">{{ currentPageTitle }}</h1>
                <p class="text-sm text-gray-500">{{ currentPageSubtitle }}</p>
              </div>
            </div>

            <!-- User Menu -->
            <div class="flex items-center gap-4">
              <!-- Notifications -->
              <button class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <!-- User Avatar -->
              <div class="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                  {{ userInitials }}
                </div>
                <div class="hidden sm:block text-left">
                  <p class="text-sm font-medium text-gray-700">{{ userName }}</p>
                  <p class="text-xs text-gray-500">{{ userRole }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div class="px-4 sm:px-6 lg:px-8 py-8">
          <nav class="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-sm p-6">
            <div class="flex flex-col sm:flex-row gap-3">
              <RouterLink to="/research" class="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md">
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              <span>Investigaciones sobre la salud auditiva</span>
              </RouterLink>
              <RouterLink to="/questionnaire" class="flex items-center gap-2 px-4 py-3 bg-white border-2 border-blue-200 text-gray-700 rounded-xl font-medium hover:bg-blue-50 hover:border-blue-300 transition-all">
                 <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span>Cuestionarios sobre Tinnitus</span>
              </RouterLink>
            <RouterLink to="/hearing" class="flex items-center gap-2 px-4 py-3 bg-white border-2 border-blue-200 text-gray-700 rounded-xl font-medium hover:bg-blue-50 hover:border-blue-300 transition-all">
               <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
          </svg>
          <span>Evaluación de la Audición</span>
            </RouterLink>
            </div>
          </nav>
          <RouterView></RouterView>
        </div>
      </main>

      <!-- Footer -->
      <Footer />
    </div>
    <div
      v-if="isSidebarOpen"
      @click="toggleSidebar"
      class="lg:hidden fixed inset-0 bg-black/50 z-30"
    ></div>
  </div>
</template>

<script  setup lang="ts">
  import { ref, computed } from 'vue';
  import Sidebar from '../sidebar/Sidebar.vue';
  import Footer from '../footer/Footer.vue';

  interface Props {
  userName?: string;
  userRole?: string;
  pageTitle?: string;
  pageSubtitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  userName: 'Dr. Juan Pérez',
  userRole: 'Audiólogo',
  pageTitle: 'Dashboard',
  pageSubtitle: 'Resumen de actividades',
});

const isSidebarOpen = ref(false);
const currentPage = ref('dashboard');

// Computed
const userInitials = computed(() => {
  const names = props.userName.split(' ');
  return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
});

const currentPageTitle = computed(() => props.pageTitle);
const currentPageSubtitle = computed(() => props.pageSubtitle);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const handleNavigate = (page: string) => {
  currentPage.value = page;
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false;
  }
};
</script>