import apiClient from '../api/axios'
import { API_ENDPOINTS } from '../api/endpoints'

const clientReviewsEndpoint = API_ENDPOINTS.admin.clientReviews

function appendFormValue(formData, key, value) {
  if (value !== undefined && value !== null) {
    formData.append(key, value)
  }
}

function toClientReviewFormData(payload) {
  const formData = new FormData()

  appendFormValue(formData, 'clientName', payload.clientName)
  appendFormValue(formData, 'companyName', payload.companyName)
  appendFormValue(formData, 'designation', payload.designation)
  appendFormValue(formData, 'review', payload.review)
  appendFormValue(formData, 'rating', payload.rating)
  appendFormValue(formData, 'displayOrder', payload.displayOrder)
  appendFormValue(formData, 'active', payload.active)

  if (payload.image) {
    formData.append('image', payload.image)
  }

  return formData
}

export async function getClientReviews() {
  const response = await apiClient.get(clientReviewsEndpoint)
  return response.data
}

export async function createClientReview(payload) {
  const response = await apiClient.post(clientReviewsEndpoint, toClientReviewFormData(payload))
  return response.data
}

export async function updateClientReview(id, payload) {
  const response = await apiClient.put(`${clientReviewsEndpoint}/${id}`, toClientReviewFormData(payload))
  return response.data
}

export async function deleteClientReview(id) {
  await apiClient.delete(`${clientReviewsEndpoint}/${id}`)
}
