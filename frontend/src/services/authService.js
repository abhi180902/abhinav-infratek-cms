import apiClient from '../api/axios'
import { API_ENDPOINTS } from '../api/endpoints'

export async function loginAdmin(credentials) {
  const response = await apiClient.post(API_ENDPOINTS.auth.login, credentials)
  return response.data
}
