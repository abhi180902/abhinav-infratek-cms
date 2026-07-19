import apiClient from '../api/axios'
import { API_ENDPOINTS } from '../api/endpoints'

export async function getAdminAccount() {
  const response = await apiClient.get(API_ENDPOINTS.admin.account)
  return response.data
}

export async function updateAdminAccount(payload) {
  const response = await apiClient.put(API_ENDPOINTS.admin.account, payload)
  return response.data
}

export async function changeAdminPassword(payload) {
  const response = await apiClient.put(API_ENDPOINTS.admin.changePassword, payload)
  return response.data
}
