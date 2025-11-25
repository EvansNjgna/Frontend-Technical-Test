import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth.token')

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

const getErrorMessage = (error) => {
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.response?.data?.error) return error.response.data.error
  return error?.message || 'Something went wrong'
}

export const login = async ({ username, password, expiresInMins = 60 }) => {
  try {
    const response = await apiClient.post('/auth/login', {
      username,
      password,
      expiresInMins,
    })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const getProducts = async (params = {}) => {
  try {
    const response = await apiClient.get('/products', { params })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const searchProducts = async (query) => {
  try {
    const response = await apiClient.get('/products/search', {
      params: { q: query },
    })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const getCategories = async () => {
  try {
    const response = await apiClient.get('/products/categories')
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const addProduct = async (payload) => {
  try {
    const response = await apiClient.post('/products/add', payload)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const updateProduct = async (id, payload) => {
  try {
    const response = await apiClient.put(`/products/${id}`, payload)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const deleteProduct = async (id) => {
  try {
    const response = await apiClient.delete(`/products/${id}`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}


