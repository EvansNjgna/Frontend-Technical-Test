<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorMessage from '../components/ErrorMessage.vue'
import ProductTable from '../components/ProductTable.vue'
import IconSearch from '../components/icons/IconSearch.vue'

const router = useRouter()
const productsStore = useProductsStore()

const searchTerm = ref('')
const selectedCategory = ref('')
const stockStatus = ref('')

onMounted(async () => {
  if (!productsStore.hasProducts) {
    await productsStore.fetchProducts()
  }

  await productsStore.fetchCategories()
})

const filteredProducts = computed(() => {
  let items = productsStore.products

  if (searchTerm.value.trim()) {
    const query = searchTerm.value.trim().toLowerCase()
    items = items.filter((product) => product.title.toLowerCase().includes(query))
  }

  if (selectedCategory.value) {
    items = items.filter((product) => product.category === selectedCategory.value)
  }

  if (stockStatus.value) {
    if (stockStatus.value === 'in_stock') {
      items = items.filter((product) => product.stock > 10)
    } else if (stockStatus.value === 'low_stock') {
      items = items.filter((product) => product.stock > 0 && product.stock <= 10)
    } else if (stockStatus.value === 'out_of_stock') {
      items = items.filter((product) => product.stock === 0)
    }
  }

  return items
})

const handleRowClick = (product) => {
  router.push({ name: 'product-detail', params: { id: product.id } })
}

const handleAddNew = () => {
  router.push({ name: 'product-new' })
}
</script>

<template>
  <section class="space-y-6">
    <!-- Header -->
    <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
          Products
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          Manage your inventory and view product performance.
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#000080] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#000080]/90"
        @click="handleAddNew"
      >
        <span class="text-lg leading-none">+</span>
        Add New Product
      </button>
    </header>

    <!-- Filter Bar -->
    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div class="flex flex-col gap-4 md:flex-row md:items-center">
        <!-- Search -->
        <div class="relative flex-1">
          <IconSearch class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search by product name..."
            class="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-500 outline-none transition focus:border-[#000080] focus:ring-1 focus:ring-[#000080]"
          />
        </div>

        <!-- Filters -->
        <div class="flex gap-3">
          <select
            v-model="selectedCategory"
            class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-[#000080] focus:ring-1 focus:ring-[#000080]"
          >
            <option value="">Category</option>
            <option v-for="category in productsStore.categories" :key="category.slug ?? category" :value="category.slug ?? category">
              {{ category.name ?? category }}
            </option>
          </select>

          <select
            v-model="stockStatus"
            class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-[#000080] focus:ring-1 focus:ring-[#000080]"
          >
            <option value="">Stock Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>
    </div>

    <ErrorMessage v-if="productsStore.error" :message="productsStore.error" />

    <LoadingSpinner v-if="productsStore.isLoading" />

    <div v-else>
      <ProductTable
        :products="filteredProducts"
        @rowClick="handleRowClick"
      />
      
      <!-- Pagination (Visual Only) -->
      <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <p class="text-sm text-slate-500">
          Showing <span class="font-medium text-slate-900">1</span> to <span class="font-medium text-slate-900">{{ filteredProducts.length > 10 ? 10 : filteredProducts.length }}</span> of <span class="font-medium text-slate-900">{{ filteredProducts.length }}</span> results
        </p>
        <div class="flex gap-2">
          <button class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50" disabled>
            &lt;
          </button>
          <button class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50" disabled>
            &gt;
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
