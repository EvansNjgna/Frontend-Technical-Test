<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useProductsStore } from '../stores/products'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorMessage from '../components/ErrorMessage.vue'
import TopBar from '../components/TopBar.vue'
import IconEdit from '../components/icons/IconEdit.vue'
import IconStar from '../components/icons/IconStar.vue'

const router = useRouter()
const route = useRoute()
const productsStore = useProductsStore()

const isDeleting = ref(false)
const deleteError = ref('')
const isEditing = ref(false)
const form = ref({
  title: '',
  description: '',
  price: '',
  stock: '',
})

const productId = computed(() => Number(route.params.id))

const product = computed(() => productsStore.currentProduct)

const canShowContent = computed(
  () => !productsStore.isLoading && Boolean(product.value),
)

const syncForm = () => {
  if (!product.value) return

  form.value = {
    title: product.value.title ?? '',
    description: product.value.description ?? '',
    price: String(product.value.price ?? ''),
    stock: String(product.value.stock ?? ''),
  }
}

onMounted(async () => {
  if (!Number.isNaN(productId.value)) {
    await productsStore.fetchProductById(productId.value)
    syncForm()
  }
})

const handleDelete = async () => {
  deleteError.value = ''

  const confirmed = window.confirm(
    'Are you sure you want to delete this product?',
  )
  if (!confirmed) return

  isDeleting.value = true

  try {
    await productsStore.deleteExistingProduct(productId.value)
    router.push({ name: 'products' })
  } catch (error) {
    deleteError.value =
      error?.message || 'Unable to delete product. Please try again.'
  } finally {
    isDeleting.value = false
  }
}

const handleToggleEdit = () => {
  if (!isEditing.value) {
    syncForm()
  }

  isEditing.value = !isEditing.value
}

const handleSave = async () => {
  deleteError.value = ''

  if (!form.value.title.trim()) {
    deleteError.value = 'Title is required'
    return
  }

  const priceNumber = Number(form.value.price)
  const stockNumber = Number(form.value.stock)

  if (form.value.price && Number.isNaN(priceNumber)) {
    deleteError.value = 'Price must be a valid number'
    return
  }

  if (form.value.stock && Number.isNaN(stockNumber)) {
    deleteError.value = 'Stock must be a valid number'
    return
  }

  try {
    await productsStore.updateExistingProduct(productId.value, {
      title: form.value.title,
      description: form.value.description,
      price: priceNumber || 0,
      stock: stockNumber || 0,
    })
    isEditing.value = false
  } catch (error) {
    deleteError.value =
      error?.message || 'Unable to update product. Please try again.'
  }
}
</script>

<template>
  <section class="space-y-6">
    <TopBar />

    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-sm text-slate-500">
      <RouterLink :to="{ name: 'products' }" class="hover:text-slate-900">Products</RouterLink>
      <span>/</span>
      <span class="text-slate-900">{{ product?.title || 'Loading...' }}</span>
    </nav>

    <ErrorMessage v-if="productsStore.error" :message="productsStore.error" />
    <ErrorMessage v-if="deleteError" :message="deleteError" />

    <LoadingSpinner v-if="productsStore.isLoading && !product" />

    <div v-if="canShowContent" class="grid gap-8 lg:grid-cols-2">
      <!-- Left Column: Image -->
      <div class="overflow-hidden rounded-2xl bg-white">
        <img
          :src="product.thumbnail"
          alt=""
          class="h-full w-full object-cover"
        />
      </div>

      <!-- Right Column: Details -->
      <div class="space-y-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">{{ product.title }}</h1>
          <p class="mt-2 text-lg text-slate-600">{{ product.description }}</p>
          
          <div class="mt-4">
             <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg bg-[#EFF4FF] px-4 py-2 text-sm font-medium text-[#000080] transition hover:bg-[#EFF4FF]/80"
              @click="handleToggleEdit"
            >
              <IconEdit class="h-4 w-4" />
              {{ isEditing ? 'Cancel Edit' : 'Edit Product' }}
            </button>
          </div>
        </div>

        <!-- Edit Form -->
        <div v-if="isEditing" class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
           <form class="space-y-4" @submit.prevent="handleSave">
              <div>
                <label class="block text-sm font-medium text-slate-700">Title</label>
                <input v-model="form.title" type="text" class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080]" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700">Description</label>
                <textarea v-model="form.description" rows="3" class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080]" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700">Price</label>
                  <input v-model="form.price" type="number" class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080]" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700">Stock</label>
                  <input v-model="form.stock" type="number" class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080]" />
                </div>
              </div>
              <div class="flex justify-end gap-2">
                 <button type="button" class="text-sm text-slate-500 hover:text-slate-700" @click="handleToggleEdit">Cancel</button>
                 <button type="submit" class="rounded-lg bg-[#000080] px-4 py-2 text-sm font-medium text-white hover:bg-[#000080]/90">Save Changes</button>
              </div>
           </form>
        </div>

        <div class="grid grid-cols-2 gap-8 rounded-xl bg-white p-6 shadow-sm border border-slate-100">
          <div>
            <p class="text-sm font-medium text-slate-500">Price</p>
            <div class="mt-1 flex items-center gap-3">
              <p class="text-2xl font-bold text-slate-900">${{ Number(product.price).toFixed(2) }}</p>
              <span v-if="product.discountPercentage" class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">
                -{{ product.discountPercentage }}%
              </span>
            </div>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Category</p>
            <span class="mt-1 inline-flex items-center rounded-md bg-[#EFF4FF] px-3 py-1 text-sm font-medium text-[#000080] capitalize">
              {{ product.category }}
            </span>
          </div>
          <div v-if="product.discountPercentage" class="col-span-2">
            <p class="text-sm font-medium text-slate-500">Discount</p>
            <div class="mt-1 flex items-center gap-3">
              <span class="inline-flex items-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
                {{ product.discountPercentage }}% Off
              </span>
              <p class="text-sm text-slate-600">
                You save: ${{ (Number(product.price) * product.discountPercentage / 100).toFixed(2) }}
              </p>
            </div>
          </div>
          <div class="col-span-2">
             <p class="text-sm font-medium text-slate-500">Stock</p>
             <div class="mt-1 flex items-center gap-2">
               <span class="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                 <span class="h-2 w-2 rounded-full bg-green-500" />
                 In Stock
               </span>
               <span class="text-slate-600">{{ product.stock }} units</span>
             </div>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="pt-4">
          <button
            type="button"
            class="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
            :disabled="isDeleting"
            @click="handleDelete"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete Product' }}
          </button>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <h3 class="text-lg font-bold text-slate-900">Description</h3>
          <p class="leading-relaxed text-slate-600">
            {{ product.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Reviews Section (Bonus/Mockup Matching) -->
    <div v-if="canShowContent" class="mt-12">
      <h2 class="mb-6 text-xl font-bold text-slate-900">Customer Reviews</h2>
      <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div class="flex items-center gap-4 mb-8">
           <div class="text-5xl font-bold text-slate-900">{{ product.rating }}</div>
           <div class="space-y-1">
             <div class="flex gap-1">
               <IconStar class="h-5 w-5 fill-yellow-400 text-yellow-400" v-for="i in 4" :key="i" />
               <IconStar class="h-5 w-5 fill-yellow-400 text-yellow-400" style="clip-path: inset(0 50% 0 0)" />
             </div>
             <p class="text-sm text-slate-500">Based on {{ Math.floor(Math.random() * 200) + 50 }} reviews</p>
           </div>
        </div>
        
        <div class="space-y-3">
          <div class="flex items-center gap-4" v-for="rating in [5,4,3,2,1]" :key="rating">
             <span class="w-3 text-sm font-medium text-slate-600">{{ rating }}</span>
             <div class="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
               <div class="h-full bg-yellow-400" :style="{ width: rating === 5 ? '75%' : rating === 4 ? '15%' : '5%' }"></div>
             </div>
             <span class="w-8 text-right text-sm text-slate-500">{{ rating === 5 ? '75%' : rating === 4 ? '15%' : '5%' }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
