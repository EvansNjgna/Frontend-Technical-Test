<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import ErrorMessage from '../components/ErrorMessage.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

const handleSubmit = async () => {
  errorMessage.value = ''

  if (!username.value.trim() || !password.value.trim()) {
    errorMessage.value = 'Please enter both username and password'
    return
  }

  isSubmitting.value = true

  try {
    await authStore.login({
      username: username.value,
      password: password.value,
    })

    const redirect = route.query.redirect ?? '/products'
    router.push(String(redirect))
  } catch (error) {
    errorMessage.value = error?.message || 'Invalid credentials. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center bg-[#F6F7FB] py-12 md:py-16 min-h-screen">
    <div class="mb-10 flex items-center gap-3">
      <div class="flex h-11 w-11 items-center justify-center rounded-full bg-[#000080] text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
      </div>
      <h1 class="text-lg font-semibold text-[#000080] tracking-tight">Platform Logo</h1>
    </div>

    <div class="w-full max-w-lg rounded-2xl border border-slate-100 bg-white px-10 py-10 shadow-md">
      <div class="mb-8 text-center">
        <h2 class="text-2xl font-bold text-slate-900">Welcome Back</h2>
        <p class="mt-2 text-sm text-slate-500">
          Sign in to manage your products.
        </p>
      </div>

      <ErrorMessage v-if="errorMessage" :message="errorMessage" />

      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div class="space-y-1.5">
          <label for="username" class="block text-sm font-medium text-slate-700">
            Email or Username
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            autocomplete="username"
            class="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#000080] focus:ring-1 focus:ring-[#000080]"
            placeholder="you@example.com"
          />
        </div>

        <div class="space-y-1.5">
          <label for="password" class="block text-sm font-medium text-slate-700">
            Password
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              class="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#000080] focus:ring-1 focus:ring-[#000080]"
              placeholder="Enter your password"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              @click="showPassword = !showPassword"
            >
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              class="h-4 w-4 rounded border-slate-300 text-[#000080] focus:ring-[#000080]"
            />
            <label for="remember" class="text-sm text-slate-600">Remember me</label>
          </div>
          <button type="button" class="text-sm font-medium text-[#000080] hover:underline">
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          class="flex w-full items-center justify-center rounded-lg bg-[#000080] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#000080]/90 disabled:cursor-not-allowed disabled:bg-[#000080]/60"
          :disabled="isSubmitting"
        >
          <span v-if="!isSubmitting">Login</span>
          <span v-else>Signing in...</span>
        </button>
      </form>
    </div>

    <p class="mt-8 text-sm text-slate-500">
      &copy; 2024 Platform Inc. All Rights Reserved.
    </p>
  </div>
</template>
