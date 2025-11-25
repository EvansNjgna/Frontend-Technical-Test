<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import ErrorMessage from '../components/ErrorMessage.vue'
import IconCloudUpload from '../components/icons/IconCloudUpload.vue'

const router = useRouter()
const productsStore = useProductsStore()

const title = ref('')
const description = ref('')
const category = ref('')
const price = ref('')
const stock = ref('')
const thumbnail = ref('')

const isSubmitting = ref(false)
const formError = ref('')

onMounted(async () => {
  await productsStore.fetchCategories()
})

const handleSubmit = async () => {
  formError.value = ''

  if (!title.value.trim()) {
    formError.value = 'Title is required'
    return
  }

  const priceNumber = Number(price.value)
  const stockNumber = Number(stock.value)

  if (price.value && Number.isNaN(priceNumber)) {
    formError.value = 'Price must be a valid number'
    return
  }

  if (stock.value && Number.isNaN(stockNumber)) {
    formError.value = 'Stock must be a valid number'
    return
  }

  isSubmitting.value = true

  try {
    const created = await productsStore.addNewProduct({
      title: title.value.trim(),
      description: description.value.trim(),
      category: category.value || undefined,
      price: priceNumber || 0,
      stock: stockNumber || 0,
      thumbnail: thumbnail.value || undefined,
    })

    if (created?.id) {
      router.push({ name: 'product-detail', params: { id: created.id } })
    } else {
      router.push({ name: 'products' })
    }
  } catch (error) {
    formError.value =
      error?.message || 'Unable to create product. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>

<template>
  <section class="mx-auto max-w-3xl space-y-8">
    <header>
      <h1 class="text-2xl font-bold tracking-tight text-slate-900">
        Add New Product
      </h1>
      <p class="mt-1 text-sm text-slate-500">
        Enter the details below to add a new item to your inventory.
      </p>
    </header>

    <form @submit.prevent="handleSubmit">
      <div class="space-y-8 rounded-xl bg-white p-8 shadow-sm border border-slate-200">
        <ErrorMessage v-if="formError" :message="formError" />
        <ErrorMessage v-if="productsStore.error && !formError" :message="productsStore.error" />

        <!-- Product Information -->
        <div class="space-y-6">
          <h2 class="text-base font-semibold text-slate-900">Product Information</h2>
          
          <div class="space-y-4">
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700">Product Title</label>
              <input
                v-model="title"
                type="text"
                placeholder="Enter product title"
                class="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#000080] focus:ring-1 focus:ring-[#000080]"
              />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700">Product Description</label>
              <textarea
                v-model="description"
                rows="4"
                placeholder="Provide a detailed description of the product"
                class="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#000080] focus:ring-1 focus:ring-[#000080]"
              />
            </div>
          </div>
        </div>

        <hr class="border-slate-100" />

        <!-- Pricing & Inventory -->
        <div class="space-y-6">
          <h2 class="text-base font-semibold text-slate-900">Pricing & Inventory</h2>
          
          <div class="grid gap-6 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700">Price</label>
              <input
                v-model="price"
                type="number"
                min="0"
                placeholder="$ 0.00"
                class="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#000080] focus:ring-1 focus:ring-[#000080]"
              />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700">Stock Quantity</label>
              <input
                v-model="stock"
                type="number"
                min="0"
                placeholder="Enter stock quantity"
                class="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#000080] focus:ring-1 focus:ring-[#000080]"
              />
            </div>

            <div class="space-y-1.5 sm:col-span-2">
              <label class="block text-sm font-medium text-slate-700">Category</label>
              <select
                v-model="category"
                class="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-[#000080] focus:ring-1 focus:ring-[#000080]"
              >
                <option value="">Select a category</option>
                <option
                  v-for="item in productsStore.categories"
                  :key="item.slug ?? item"
                  :value="item.slug ?? item"
                >
                  {{ item.name ?? item }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <hr class="border-slate-100" />

        <!-- Media -->
        <div class="space-y-6">
          <h2 class="text-base font-semibold text-slate-900">Media</h2>
          
          <div class="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF4FF] text-[#000080]">
              <IconCloudUpload class="h-6 w-6" />
            </div>
            <div class="mt-4 text-sm">
              <span class="font-semibold text-[#000080]">Click to upload</span> or drag and drop
            </div>
            <p class="mt-1 text-xs text-slate-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            
            <!-- Hidden actual input, using text input below for URL simulation as per requirements -->
            <div class="mt-4">
              <label class="block text-xs font-medium text-slate-700 mb-1">Or enter image URL</label>
              <input
                v-model="thumbnail"
                type="url"
                placeholder="https://..."
                class="block w-full max-w-sm mx-auto rounded-lg border border-slate-300 px-3 py-1.5 text-sm shadow-sm outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080]"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          class="rounded-lg bg-slate-100 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          @click="handleCancel"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-lg bg-[#000080] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#000080]/90 disabled:opacity-50"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Saving...' : 'Save Product' }}
        </button>
      </div>
    </form>
  </section>
</template>
