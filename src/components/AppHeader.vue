<script setup>
import { computed } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isOnProducts = computed(() => route.name === 'products')

const displayName = computed(() => {
  if (!authStore.user) return ''
  if (authStore.user.firstName || authStore.user.lastName) {
    return `${authStore.user.firstName ?? ''} ${authStore.user.lastName ?? ''}`.trim()
  }
  return authStore.user.username
})

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="border-b border-slate-200 bg-white/80 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      <RouterLink
        :to="{ name: 'products' }"
        class="flex items-center gap-2 text-lg font-semibold tracking-tight text-primary"
      >
        <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
          AP
        </span>
        <span>AlienSoft Products</span>
      </RouterLink>

      <div class="flex items-center gap-4">
        <nav class="hidden items-center gap-3 text-sm font-medium text-slate-600 md:flex">
          <RouterLink
            :to="{ name: 'products' }"
            class="rounded-full px-3 py-1 transition-colors"
            :class="isOnProducts ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100'"
          >
            Products
          </RouterLink>
          <RouterLink
            :to="{ name: 'product-new' }"
            class="rounded-full px-3 py-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Add product
          </RouterLink>
        </nav>

        <div v-if="authStore.user" class="flex items-center gap-3">
          <div class="hidden text-right text-xs leading-tight sm:block">
            <p class="font-medium text-slate-900">
              {{ displayName }}
            </p>
            <p class="text-slate-500">
              {{ authStore.user.email }}
            </p>
          </div>
          <img
            v-if="authStore.user.image"
            :src="authStore.user.image"
            alt="User avatar"
            class="h-8 w-8 rounded-full border border-slate-200 object-cover"
          />
        </div>

        <button
          type="button"
          class="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
          @click="handleLogout"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>


