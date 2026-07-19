import apiClient from '../api/axios'
import { API_ENDPOINTS } from '../api/endpoints'

export async function getDashboardSummary() {
  const response = await apiClient.get(API_ENDPOINTS.admin.dashboard)
  return response.data
}
