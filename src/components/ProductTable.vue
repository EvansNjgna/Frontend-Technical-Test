<script setup>
import IconMoreVertical from './icons/IconMoreVertical.vue'

const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['rowClick'])

const handleRowClick = (product) => {
  emit('rowClick', product)
}

const truncate = (value, length = 100) => {
  if (!value) return ''
  if (value.length <= length) return value
  return `${value.slice(0, length)}…`
}

const getStockStatus = (stock) => {
  if (stock > 10) return { label: 'In Stock', class: 'text-green-600', dot: 'bg-green-500' }
  if (stock > 0) return { label: 'Low Stock', class: 'text-orange-600', dot: 'bg-orange-500' }
  return { label: 'Out of Stock', class: 'text-red-600', dot: 'bg-red-500' }
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <table class="min-w-full divide-y divide-slate-100">
      <thead class="bg-slate-50/50">
        <tr>
          <th scope="col" class="px-6 py-4 text-left text-sm font-medium text-slate-900">
            Product
          </th>
          <th scope="col" class="px-6 py-4 text-left text-sm font-medium text-slate-900">
            Category
          </th>
          <th scope="col" class="px-6 py-4 text-left text-sm font-medium text-slate-900">
            Price
          </th>
          <th scope="col" class="px-6 py-4 text-left text-sm font-medium text-slate-900">
            Stock
          </th>
          <th scope="col" class="px-6 py-4 text-right text-sm font-medium text-slate-900">
            
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 bg-white">
        <tr
          v-for="product in props.products"
          :key="product.id"
          class="cursor-pointer transition hover:bg-slate-50"
          @click="handleRowClick(product)"
        >
          <td class="px-6 py-4">
            <div class="flex items-center gap-4">
              <img
                :src="product.thumbnail"
                alt=""
                class="h-10 w-10 flex-shrink-0 rounded-full bg-slate-100 object-cover"
              />
              <div>
                <p class="text-sm font-semibold text-slate-900">
                  {{ product.title }}
                </p>
                <p class="max-w-xs truncate text-xs text-slate-500">
                  {{ product.description }}
                </p>
              </div>
            </div>
          </td>

          <td class="px-6 py-4">
            <span class="inline-flex items-center rounded-md bg-[#EFF4FF] px-2.5 py-1 text-xs font-medium text-[#000080] capitalize">
              {{ product.category }}
            </span>
          </td>

          <td class="px-6 py-4">
            <span class="text-sm font-medium text-slate-600">
              ${{ Number(product.price).toFixed(2) }}
            </span>
          </td>

          <td class="px-6 py-4">
            <div class="flex items-center gap-2">
              <span
                class="h-2 w-2 rounded-full"
                :class="getStockStatus(product.stock).dot"
              />
              <span
                class="text-sm font-medium"
                :class="getStockStatus(product.stock).class"
              >
                {{ product.stock }} {{ getStockStatus(product.stock).label }}
              </span>
            </div>
          </td>

          <td class="px-6 py-4 text-right">
            <button class="text-slate-400 hover:text-slate-600">
              <IconMoreVertical class="h-5 w-5" />
            </button>
          </td>
        </tr>
        <tr v-if="!props.products.length">
          <td colspan="5" class="px-6 py-12 text-center text-sm text-slate-500">
            No products found.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
