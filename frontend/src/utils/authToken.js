import { AUTH_STORAGE_KEY } from './constants'

export function saveToken(authData) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
}

export function getStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || 'null')
  } catch {
    removeToken()
    return null
  }
}

export function getToken() {
  return getStoredAuth()?.token || null
}

export function removeToken() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function isAuthenticated() {
  return Boolean(getToken())
}
