import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login as loginRequest } from '../api'

const TOKEN_KEY = 'auth.token'
const REFRESH_TOKEN_KEY = 'auth.refreshToken'
const USER_KEY = 'auth.user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null)
  const refreshToken = ref(null)
  const user = ref(null)

  const isAuthenticated = computed(() => Boolean(token.value))

  const setSession = (payload) => {
    token.value = payload.accessToken || null
    refreshToken.value = payload.refreshToken || null
    user.value = {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      image: payload.image,
    }

    if (token.value) {
      localStorage.setItem(TOKEN_KEY, token.value)
    }

    if (refreshToken.value) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken.value)
    }

    if (user.value) {
      localStorage.setItem(USER_KEY, JSON.stringify(user.value))
    }
  }

  const clearSession = () => {
    token.value = null
    refreshToken.value = null
    user.value = null

    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  const login = async ({ username, password }) => {
    const trimmedUsername = username?.trim()
    const trimmedPassword = password?.trim()

    if (!trimmedUsername || !trimmedPassword) {
      throw new Error('Username and password are required')
    }

    try {
      const data = await loginRequest({
        username: trimmedUsername,
        password: trimmedPassword,
        expiresInMins: 60,
      })

      setSession(data)

      return data
    } catch (error) {
      clearSession()
      throw error
    }
  }

  const logout = () => {
    clearSession()
  }

  const restoreSession = () => {
    const storedToken = localStorage.getItem(TOKEN_KEY)

    if (!storedToken) {
      clearSession()
      return
    }

    token.value = storedToken

    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    refreshToken.value = storedRefreshToken || null

    const storedUser = localStorage.getItem(USER_KEY)
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch {
        user.value = null
      }
    }
  }

  return {
    token,
    refreshToken,
    user,
    isAuthenticated,
    login,
    logout,
    restoreSession,
  }
})


