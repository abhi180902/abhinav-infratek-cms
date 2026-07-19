import apiClient from '../api/axios'
import { API_ENDPOINTS } from '../api/endpoints'

const enquiriesEndpoint = API_ENDPOINTS.admin.enquiries

export async function getEnquiries() {
  const response = await apiClient.get(enquiriesEndpoint)
  return response.data
}

export async function getEnquiry(id) {
  const response = await apiClient.get(`${enquiriesEndpoint}/${id}`)
  return response.data
}

export async function updateEnquiryStatus(id, status) {
  const response = await apiClient.patch(`${enquiriesEndpoint}/${id}/status`, { status })
  return response.data
}

export async function deleteEnquiry(id) {
  await apiClient.delete(`${enquiriesEndpoint}/${id}`)
}
