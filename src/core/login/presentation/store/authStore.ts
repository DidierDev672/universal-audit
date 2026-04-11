import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// ── Interfaces ─────────────────────────────────────────────────────────────
export interface PatientLogin {
  id: string
  idPatient: string
  email: string
  username: string
  permits: string[]
  token: string
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  status: number
  body: {
    patientLogin: PatientLogin
    token: string
  }
}

export interface User {
  id: string
  idPatient: string
  email: string
  username: string
  permits: string[]
  token: string
}

// ── Auth Store ──────────────────────────────────────────────────────────────
export const useAuthStore = defineStore('auth', () => {
  // ── State ─────────────────────────────────────────────────────────────────
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // ── Getters ───────────────────────────────────────────────────────────────
  const currentUser = computed(() => user.value)
  const authToken = computed(() => token.value)

  // ── Actions ───────────────────────────────────────────────────────────────
  function setUser(userData: User) {
    user.value = userData
  }

  function setToken(authToken: string) {
    token.value = authToken
    localStorage.setItem('auth_token', authToken)
  }

  function clearAuth() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }

  function logout() {
    clearAuth()
  }

  return {
    // State
    user,
    token,
    // Getters
    isAuthenticated,
    currentUser,
    authToken,
    // Actions
    setUser,
    setToken,
    clearAuth,
    logout
  }
})
