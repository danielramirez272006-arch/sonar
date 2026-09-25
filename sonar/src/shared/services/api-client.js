import { userStatus } from './admin-data.js'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/catalog'

export async function apiRequest(endpoint, options = {}) {
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  let response
  try { response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  }) } catch (cause) { throw new Error('Se perdió la conexión con la API. Comprueba que npm run api esté activo y vuelve a intentar.', { cause }) }

  if (!response.ok) {
    throw new Error(
      `Error HTTP ${response.status}${response.statusText ? ` (${response.statusText})` : ''}: ${options.method || 'GET'} ${path}`,
    )
  }

  if (response.status === 204 || response.status === 205) return null

  const body = await response.text()
  return body.trim() ? JSON.parse(body) : null
}

const LOCAL_USERS_KEY = 'sonar_registered_users'

function getLocalRegisteredUsers() {
  try {
    if (typeof window === 'undefined') return []
    const raw = window.localStorage?.getItem(LOCAL_USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalRegisteredUser(user) {
  try {
    if (typeof window === 'undefined') return
    const current = getLocalRegisteredUsers()
    const index = current.findIndex(
      (u) => u.email?.toLowerCase() === user.email?.toLowerCase() || u.id === user.id,
    )
    if (index >= 0) {
      current[index] = { ...current[index], ...user }
    } else {
      current.push(user)
    }
    window.localStorage?.setItem(LOCAL_USERS_KEY, JSON.stringify(current))
  } catch { /* El almacenamiento local puede no estar disponible. */ }
}

export async function getUsers() {
  try {
    const apiUsers = ((await apiRequest('/users')) || []).filter(user => user && typeof user === 'object')
    const localUsers = getLocalRegisteredUsers()
    const merged = [...apiUsers]
    for (const u of localUsers) {
      if (!merged.some((m) => m.email?.toLowerCase() === u.email?.toLowerCase())) {
        merged.push(u)
      }
    }
    return merged
  } catch {
    return getLocalRegisteredUsers()
  }
}

export async function getUserById(userId) {
  try {
    return await apiRequest(`/users/${encodeURIComponent(userId)}`)
  } catch {
    const local = getLocalRegisteredUsers().find((u) => String(u.id) === String(userId))
    return local ?? null
  }
}

export async function updateUser(userId, changes) {
  try {
    const currentLocal = getLocalRegisteredUsers()
    const idx = currentLocal.findIndex((u) => String(u.id) === String(userId))
    if (idx >= 0) {
      currentLocal[idx] = { ...currentLocal[idx], ...changes }
      if (typeof window !== 'undefined') {
        window.localStorage?.setItem(LOCAL_USERS_KEY, JSON.stringify(currentLocal))
      }
    }
    return await apiRequest(`/users/${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      body: JSON.stringify(changes),
    })
  } catch {
    return { id: userId, ...changes }
  }
}

export async function getUserByEmail(email) {
  const normEmail = String(email || '').trim().toLowerCase()
  try {
    const users = await apiRequest(`/users?${new URLSearchParams({ email: normEmail })}`)
    if (users && users.length > 0) return users[0]
  } catch {
    // Continúa a buscar en el almacén local
  }

  const local = getLocalRegisteredUsers().find(
    (u) => String(u.email || '').trim().toLowerCase() === normEmail,
  )
  return local ?? null
}

export async function createUser(user) {
  user = { ...user, createdAt: user.createdAt || new Date().toISOString() }
  saveLocalRegisteredUser(user)
  try {
    return await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    })
  } catch {
    return user
  }
}

export async function deleteUser(userId) {
  try {
    const currentLocal = getLocalRegisteredUsers()
    const updated = currentLocal.filter((u) => String(u.id) !== String(userId))
    if (typeof window !== 'undefined') {
      window.localStorage?.setItem(LOCAL_USERS_KEY, JSON.stringify(updated))
    }
    return await apiRequest(`/users/${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    })
  } catch {
    return true
  }
}

export function getReviews() {
  return apiRequest('/reviews')
}

export function getReviewsByUser(userId) {
  return apiRequest(`/reviews?${new URLSearchParams({ userId })}`)
}

export function getPendingReviews() {
  return apiRequest('/reviews?status=pending_moderation')
}

export async function createReview(review) {
  const author = await apiRequest(`/users/${encodeURIComponent(review.userId)}`)
  if (userStatus(author) !== 'active') throw new Error('Tu cuenta tiene una sanción activa y no puede publicar reseñas.')
  return apiRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify({ ...review, userName: author.username, status: 'pending_moderation', createdAt: review.createdAt || new Date().toISOString() }),
  })
}

export async function updateReview(reviewId, changes) {
  if (changes.status || changes.aiFlagged !== undefined) {
    const current = await apiRequest(`/reviews/${encodeURIComponent(reviewId)}`)
    let admin = null
    try { admin = JSON.parse(window.localStorage.getItem('sonar_auth_user')) } catch { /* No session */ }
    changes = { ...changes, moderationHistory: [...(current.moderationHistory || []), { id: crypto.randomUUID(), createdAt: new Date().toISOString(), adminId: admin?.id, ...changes }] }
  }
  return apiRequest(`/reviews/${encodeURIComponent(reviewId)}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  })
}

export class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  async request(endpoint, options = {}) {
    return apiRequest(endpoint, options)
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
export default apiClient

