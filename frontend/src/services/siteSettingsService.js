import apiClient from '../api/axios'
import { API_ENDPOINTS } from '../api/endpoints'

const siteSettingsEndpoint = API_ENDPOINTS.admin.siteSettings

function appendFormValue(formData, key, value) {
  if (value !== undefined && value !== null) {
    formData.append(key, value)
  }
}

function toSiteSettingsFormData(payload) {
  const formData = new FormData()

  appendFormValue(formData, 'companyName', payload.companyName)
  appendFormValue(formData, 'tagline', payload.tagline)
  appendFormValue(formData, 'phone', payload.phone)
  appendFormValue(formData, 'alternatePhone', payload.alternatePhone)
  appendFormValue(formData, 'email', payload.email)
  appendFormValue(formData, 'address', payload.address)
  appendFormValue(formData, 'heroTitle', payload.heroTitle)
  appendFormValue(formData, 'heroSubtitle', payload.heroSubtitle)
  appendFormValue(formData, 'aboutCompany', payload.aboutCompany)
  appendFormValue(formData, 'facebookUrl', payload.facebookUrl)
  appendFormValue(formData, 'instagramUrl', payload.instagramUrl)
  appendFormValue(formData, 'linkedinUrl', payload.linkedinUrl)
  appendFormValue(formData, 'youtubeUrl', payload.youtubeUrl)
  appendFormValue(formData, 'googleMapsEmbedUrl', payload.googleMapsEmbedUrl)

  if (payload.logo) {
    formData.append('logo', payload.logo)
  }

  return formData
}

export async function getSiteSettings() {
  const response = await apiClient.get(siteSettingsEndpoint)
  return response.data
}

export async function updateSiteSettings(payload) {
  const response = await apiClient.put(siteSettingsEndpoint, toSiteSettingsFormData(payload))
  return response.data
}
