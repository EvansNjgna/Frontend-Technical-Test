<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import IconDashboard from './icons/IconDashboard.vue'
import IconBox from './icons/IconBox.vue'
import IconCart from './icons/IconCart.vue'
import IconUsers from './icons/IconUsers.vue'
import IconSettings from './icons/IconSettings.vue'
import IconLogout from './icons/IconLogout.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}

const menuItems = [
  { name: 'Dashboard', icon: IconDashboard, route: 'products', disabled: true },
  { name: 'Products', icon: IconBox, route: 'products', disabled: false },
  { name: 'Orders', icon: IconCart, route: 'products', disabled: true },
  { name: 'Customers', icon: IconUsers, route: 'products', disabled: true },
]

const isProductsRoute = computed(() => {
  if (!route.name) return false
  return String(route.name).startsWith('product')
})
</script>

<template>
  <aside class="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-100 bg-white">
    <!-- Brand -->
    <div class="flex h-20 items-center gap-3 px-6">
      <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#C3B091] text-white text-xs font-bold">
        LOGO
      </div>
      <div>
        <h1 class="text-base font-bold text-slate-900">E-Commerce</h1>
        <p class="text-xs text-slate-500">Admin Panel</p>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-1 px-4 py-6">
      <template v-for="item in menuItems" :key="item.name">
        <RouterLink
          v-if="!item.disabled"
          :to="{ name: item.route }"
          class="group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors"
          :class="isProductsRoute ? 'bg-[#EFF4FF] text-[#000080]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'"
        >
          <component :is="item.icon" class="h-5 w-5" />
          {{ item.name }}
        </RouterLink>
        <div
          v-else
          class="group flex cursor-not-allowed items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 hover:bg-slate-50/50"
        >
          <component :is="item.icon" class="h-5 w-5" />
          {{ item.name }}
        </div>
      </template>
    </nav>

    <!-- Bottom Actions -->
    <div class="border-t border-slate-100 p-4 space-y-1">
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      >
        <IconSettings class="h-5 w-5" />
        Settings
      </button>

      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-lg bg-[#000080] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#000080]/90"
        @click="handleLogout"
      >
        <IconLogout class="h-5 w-5" />
        Logout
      </button>
    </div>
  </aside>
</template>

