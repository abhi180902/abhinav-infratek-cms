import axios from 'axios'
import { getToken, removeToken } from '../utils/authToken'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAdminPage = window.location.pathname.startsWith('/admin')
    const isAdminRequest = error.config?.url?.startsWith('/api/admin')

    if (error.response?.status === 401 && (isAdminPage || isAdminRequest) && window.location.pathname !== '/admin/login') {
      removeToken()
      window.dispatchEvent(new Event('auth:logout'))
      window.location.replace('/admin/login')
    }

    return Promise.reject(error)
  },
)

export default apiClient
