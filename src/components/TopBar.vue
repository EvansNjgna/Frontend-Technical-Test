<script setup>
import { computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import IconSearch from './icons/IconSearch.vue'

const router = useRouter()
const authStore = useAuthStore()

const displayName = computed(() => {
  if (!authStore.user) return 'Admin'
  if (authStore.user.firstName || authStore.user.lastName) {
    return `${authStore.user.firstName ?? ''} ${authStore.user.lastName ?? ''}`.trim()
  }
  return authStore.user.username
})

const avatarInitials = computed(() => {
  const name = displayName.value
  if (!name) return 'A'
  const parts = name.split(' ').filter(Boolean)
  if (!parts.length) return name[0]?.toUpperCase() ?? 'A'
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? 'A'
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
})

const handleAddProduct = () => {
  router.push({ name: 'product-new' })
}
</script>

<template>
  <header class="mb-6 flex items-center justify-between gap-4 rounded-xl bg-white px-6 py-4 shadow-sm">
    <RouterLink
      :to="{ name: 'products' }"
      class="flex items-center gap-2 text-sm font-semibold text-slate-900"
    >
      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#000080] text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
      </div>
      <span class="text-sm font-semibold">Product Management</span>
    </RouterLink>

    <div class="hidden flex-1 items-center justify-center md:flex">
      <div class="relative w-full max-w-md">
        <IconSearch class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search"
          class="block w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-[#000080] focus:bg-white focus:ring-1 focus:ring-[#000080]"
        />
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button
        type="button"
        class="hidden items-center gap-2 rounded-lg bg-[#000080] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#000080]/90 sm:inline-flex"
        @click="handleAddProduct"
      >
        Add Product
      </button>

      <button
        type="button"
        class="hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 md:flex"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-2 9-2 9h16s-2-2-2-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </button>

      <div class="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
        <div class="flex h-7 w-7 items-center justify-center rounded-full bg-[#000080] text-xs font-semibold text-white">
          {{ avatarInitials }}
        </div>
        <span class="hidden text-xs font-medium text-slate-700 sm:inline">
          {{ displayName }}
        </span>
      </div>
    </div>
  </header>
</template>


