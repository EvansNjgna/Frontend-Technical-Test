<script setup>
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import Sidebar from './components/Sidebar.vue'

const route = useRoute()

const isLogin = computed(() => route.name === 'login')
const showSidebar = computed(
  () => !isLogin.value && route.name !== 'product-detail',
)
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <Sidebar v-if="showSidebar" />

    <main
      :class="[
        'min-h-screen transition-all duration-300',
        showSidebar ? 'ml-64 p-8' : isLogin ? 'flex items-center justify-center p-4' : 'p-8'
      ]"
    >
      <RouterView />
    </main>
  </div>
</template>
