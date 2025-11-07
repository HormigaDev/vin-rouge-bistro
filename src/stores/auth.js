// Store de autenticação usando Pinia
import { defineStore } from 'pinia'
import { mockLogin, mockLogout } from './mock'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await mockLogin(credentials)
        if (response && response.token) {
          this.token = response.token
          this.user = response.user
          this.isAuthenticated = true
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
          return true
        }
        return false
      } catch (error) {
        console.error('Login error:', error)
        return false
      }
    },

    logout() {
      // Resetear datos mock al estado inicial
      mockLogout()

      // Limpiar autenticación
      this.token = null
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    checkAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        this.isAuthenticated = true
      }
    },
  },
})
