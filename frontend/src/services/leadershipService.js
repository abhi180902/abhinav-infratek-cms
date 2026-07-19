import apiClient from '../api/axios'
import { API_ENDPOINTS } from '../api/endpoints'

const leadershipEndpoint = API_ENDPOINTS.admin.leadershipTeam

function appendFormValue(formData, key, value) {
  if (value !== undefined && value !== null) {
    formData.append(key, value)
  }
}

function toLeadershipFormData(payload) {
  const formData = new FormData()

  appendFormValue(formData, 'name', payload.name)
  appendFormValue(formData, 'designation', payload.designation)
  appendFormValue(formData, 'bio', payload.bio)
  appendFormValue(formData, 'displayOrder', payload.displayOrder)
  appendFormValue(formData, 'active', payload.active)

  if (payload.image) {
    formData.append('image', payload.image)
  }

  return formData
}

export async function getLeadershipMembers() {
  const response = await apiClient.get(leadershipEndpoint)
  return response.data
}

export async function createLeadershipMember(payload) {
  const response = await apiClient.post(leadershipEndpoint, toLeadershipFormData(payload))
  return response.data
}

export async function updateLeadershipMember(id, payload) {
  const response = await apiClient.put(`${leadershipEndpoint}/${id}`, toLeadershipFormData(payload))
  return response.data
}

export async function deleteLeadershipMember(id) {
  await apiClient.delete(`${leadershipEndpoint}/${id}`)
}
