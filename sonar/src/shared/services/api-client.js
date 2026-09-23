const API_BASE_URL = 'http://localhost:3001'

export async function apiRequest(endpoint, options = {}) {
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(
      `Error HTTP ${response.status}${response.statusText ? ` (${response.statusText})` : ''}: ${options.method || 'GET'} ${path}`,
    )
  }

  if (response.status === 204 || response.status === 205) return null

  const body = await response.text()
  return body.trim() ? JSON.parse(body) : null
}

export function getUsers() {
  return apiRequest('/users')
}

export function getUserById(userId) {
  return apiRequest(`/users/${encodeURIComponent(userId)}`)
}

export function updateUser(userId, changes) {
  return apiRequest(`/users/${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  })
}

export async function getUserByEmail(email) {
  const users = await apiRequest(`/users?${new URLSearchParams({ email })}`)
  return users[0] ?? null
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

export function createReview(review) {
  return apiRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify(review),
  })
}

export function updateReview(reviewId, changes) {
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

