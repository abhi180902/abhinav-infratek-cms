import apiClient from '../api/axios'
import { API_ENDPOINTS } from '../api/endpoints'

async function readPublicEndpoint(endpoint) {
  const response = await apiClient.get(endpoint)
  return response.data
}

export async function getPublicServices() {
  return readPublicEndpoint(API_ENDPOINTS.public.services)
}

export async function getPublicProjects() {
  return readPublicEndpoint(API_ENDPOINTS.public.projects)
}

export async function getPublicProject(slug) {
  return readPublicEndpoint(`${API_ENDPOINTS.public.projects}/${slug}`)
}

export async function getPublicLeadershipMembers() {
  return readPublicEndpoint(API_ENDPOINTS.public.leadershipTeam)
}

export async function getPublicClientReviews() {
  return readPublicEndpoint(API_ENDPOINTS.public.clientReviews)
}

export async function submitPublicEnquiry(payload) {
  const response = await apiClient.post(API_ENDPOINTS.public.enquiries, payload)
  return response.data
}

export async function getPublicWebsiteData() {
  const entries = await Promise.allSettled([
    getPublicServices(),
    getPublicProjects(),
    getPublicLeadershipMembers(),
    getPublicClientReviews(),
  ])

  const keys = ['services', 'projects', 'leadershipMembers', 'clientReviews']

  return entries.reduce(
    (result, entry, index) => {
      const key = keys[index]

      if (entry.status === 'fulfilled') {
        result.data[key] = entry.value
      } else {
        result.errors[key] = entry.reason
      }

      return result
    },
    { data: {}, errors: {} },
  )
}
