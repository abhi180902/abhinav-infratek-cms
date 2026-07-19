import apiClient from '../api/axios'
import { API_ENDPOINTS } from '../api/endpoints'

const servicesEndpoint = API_ENDPOINTS.admin.services

export async function getServices() {
  const response = await apiClient.get(servicesEndpoint)
  return response.data
}

export async function createService(payload) {
  const response = await apiClient.post(servicesEndpoint, payload)
  return response.data
}

export async function updateService(id, payload) {
  const response = await apiClient.put(`${servicesEndpoint}/${id}`, payload)
  return response.data
}

export async function deleteService(id) {
  await apiClient.delete(`${servicesEndpoint}/${id}`)
}
