import apiClient from '../api/axios'
import { API_ENDPOINTS } from '../api/endpoints'

const projectsEndpoint = API_ENDPOINTS.admin.projects

function appendFormValue(formData, key, value) {
  if (value !== undefined && value !== null) {
    formData.append(key, value)
  }
}

function toProjectFormData(payload) {
  const formData = new FormData()

  appendFormValue(formData, 'title', payload.title)
  appendFormValue(formData, 'slug', payload.slug)
  appendFormValue(formData, 'description', payload.description)
  appendFormValue(formData, 'category', payload.category)
  appendFormValue(formData, 'location', payload.location)
  appendFormValue(formData, 'completionDate', payload.completionDate)
  appendFormValue(formData, 'displayOrder', payload.displayOrder)
  appendFormValue(formData, 'featured', payload.featured)
  appendFormValue(formData, 'active', payload.active)

  if (payload.image) {
    formData.append('image', payload.image)
  }

  return formData
}

export async function getProjects() {
  const response = await apiClient.get(projectsEndpoint)
  return response.data
}

export async function createProject(payload) {
  const response = await apiClient.post(projectsEndpoint, toProjectFormData(payload))
  return response.data
}

export async function updateProject(id, payload) {
  const response = await apiClient.put(`${projectsEndpoint}/${id}`, toProjectFormData(payload))
  return response.data
}

export async function deleteProject(id) {
  await apiClient.delete(`${projectsEndpoint}/${id}`)
}
