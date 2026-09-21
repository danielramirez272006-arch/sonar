import { useCallback, useEffect, useRef, useState } from 'react'
import { getUsers, getReviews } from '../../../shared/services/api-client.js'

export function useAdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalReviews: 0,
    pendingReviews: 0,
    approvedReviews: 0,
    rejectedReviews: 0,
    flaggedReviews: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const latestRequest = useRef(0)
  const pendingRequests = useRef(0)

  const loadMetrics = useCallback(async () => {
    const requestId = ++latestRequest.current
    pendingRequests.current += 1
    setError(null)
    setIsLoading(true)

    try {
      const [usersResult, reviewsResult] = await Promise.all([getUsers(), getReviews()])
      const users = Array.isArray(usersResult) ? usersResult : []
      const reviews = Array.isArray(reviewsResult) ? reviewsResult : []
      const updatedMetrics = {
        totalUsers: users.length,
        totalReviews: reviews.length,
        pendingReviews: reviews.filter(review => review?.status === 'pending_moderation').length,
        approvedReviews: reviews.filter(review => review?.status === 'approved').length,
        rejectedReviews: reviews.filter(review => review?.status === 'rejected').length,
        flaggedReviews: reviews.filter(review => review?.aiFlagged === true).length,
      }

      // Una respuesta antigua no debe reemplazar la carga más reciente.
      if (requestId === latestRequest.current) setMetrics(updatedMetrics)
      return updatedMetrics
    } catch (cause) {
      const metricsError = cause instanceof Error
        ? cause
        : new Error('No se pudieron cargar las métricas del panel administrativo.')
      if (requestId === latestRequest.current) setError(metricsError.message)
      throw metricsError
    } finally {
      pendingRequests.current -= 1
      setIsLoading(pendingRequests.current > 0)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    // Carga asíncrona inicial; la limpieza evita iniciarla tras desmontar.
    Promise.resolve().then(() => {
      if (!cancelled) return loadMetrics()
    }).catch(() => {
      // loadMetrics ya expone el mensaje mediante el estado error.
    })

    return () => {
      cancelled = true
    }
  }, [loadMetrics])

  return {
    metrics,
    isLoading,
    error,
    loadMetrics,
    refresh: loadMetrics,
  }
}
