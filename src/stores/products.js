import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from '../api'

const getErrorMessage = (error) => {
  if (error instanceof Error) return error.message
  return 'Something went wrong while communicating with the server'
}

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const currentProduct = ref(null)
  const categories = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const hasProducts = computed(() => products.value.length > 0)

  const setError = (value) => {
    error.value = value
  }

  const clearError = () => {
    error.value = null
  }

  const fetchProducts = async () => {
    isLoading.value = true
    clearError()

    try {
      const data = await getProducts({ limit: 0 })
      products.value = (data.products ?? []).map(product => ({
        ...product,
        // Add random discounts to some products for demonstration
        discountPercentage: product.discountPercentage || (Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 5 : 0)
      }))
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      isLoading.value = false
    }
  }

  const fetchProductById = async (id) => {
    if (!id) return

    clearError()
    isLoading.value = true

    try {
      const numericId = Number(id)

      if (Number.isNaN(numericId)) {
        throw new Error('Invalid product id')
      }

      const existing = products.value.find((item) => item.id === numericId)
      if (existing) {
        currentProduct.value = existing
        return existing
      }

      const data = await getProductById(numericId)
      currentProduct.value = data

      const index = products.value.findIndex((item) => item.id === data.id)
      if (index === -1) {
        products.value = [...products.value, data]
      } else {
        products.value.splice(index, 1, data)
      }

      return data
    } catch (err) {
      setError(getErrorMessage(err))
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchCategories = async () => {
    if (categories.value.length) return

    try {
      const data = await getCategories()
      categories.value = data ?? []
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const addProductToStore = (product) => {
    if (!product?.id) return

    const exists = products.value.some((item) => item.id === product.id)
    if (exists) return

    products.value = [product, ...products.value]
  }

  const addNewProduct = async (payload) => {
    clearError()
    isLoading.value = true

    try {
      const created = await addProduct(payload)
      addProductToStore(created)
      return created
    } catch (err) {
      setError(getErrorMessage(err))
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateExistingProduct = async (id, payload) => {
    clearError()
    isLoading.value = true

    try {
      const numericId = Number(id)

      if (Number.isNaN(numericId)) {
        throw new Error('Invalid product id')
      }

      const updated = await updateProduct(numericId, payload)

      const index = products.value.findIndex((item) => item.id === updated.id)
      if (index !== -1) {
        products.value.splice(index, 1, updated)
      }

      if (currentProduct.value?.id === updated.id) {
        currentProduct.value = updated
      }

      return updated
    } catch (err) {
      setError(getErrorMessage(err))
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteExistingProduct = async (id) => {
    clearError()
    isLoading.value = true

    try {
      const numericId = Number(id)

      if (Number.isNaN(numericId)) {
        throw new Error('Invalid product id')
      }

      await deleteProduct(numericId)

      products.value = products.value.filter((item) => item.id !== numericId)

      if (currentProduct.value?.id === numericId) {
        currentProduct.value = null
      }
    } catch (err) {
      setError(getErrorMessage(err))
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    products,
    currentProduct,
    categories,
    isLoading,
    error,
    hasProducts,
    fetchProducts,
    fetchProductById,
    fetchCategories,
    addNewProduct,
    updateExistingProduct,
    deleteExistingProduct,
  }
})


