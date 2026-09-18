import { useCallback, useEffect, useState } from 'react'
import { getPendingReviews, updateReview } from '../../../shared/services/api-client.js'

export function useModeration() {
  const [reviews, setReviews] = useState([])
  const [pendingOperations, setPendingOperations] = useState(0)
  const [error, setError] = useState(null)

  // Mantiene la carga activa hasta terminar todas las operaciones en curso.
  const runOperation = useCallback(async operation => {
    setError(null)
    setPendingOperations(count => count + 1)

    try {
      return await operation()
    } catch (cause) {
      const operationError = cause instanceof Error
        ? cause
        : new Error('No se pudo completar la operación de moderación.')
      setError(operationError.message)
      throw operationError
    } finally {
      setPendingOperations(count => count - 1)
    }
  }, [])

  const fetchPendingReviews = useCallback(async () => {
    const pendingReviews = await getPendingReviews()
    if (!Array.isArray(pendingReviews)) {
      throw new Error('La API no devolvió una lista válida de reseñas pendientes.')
    }
    setReviews(pendingReviews)
    return pendingReviews
  }, [])

  const loadPendingReviews = useCallback(() => {
    return runOperation(fetchPendingReviews)
  }, [runOperation, fetchPendingReviews])

  const updateAndReload = useCallback((reviewId, changes) => {
    return runOperation(async () => {
      if (
        reviewId === null ||
        reviewId === undefined ||
        (typeof reviewId === 'string' && reviewId.trim() === '')
      ) {
        throw new Error('El ID de la reseña es obligatorio.')
      }

      const updatedReview = await updateReview(reviewId, changes)
      // La actualización y la recarga comparten un solo ciclo de carga.
      await fetchPendingReviews()
      return updatedReview
    })
  }, [runOperation, fetchPendingReviews])

  const approveReview = useCallback(reviewId => {
    return updateAndReload(reviewId, { status: 'approved' })
  }, [updateAndReload])

  const rejectReview = useCallback(reviewId => {
    return updateAndReload(reviewId, { status: 'rejected' })
  }, [updateAndReload])

  const flagReview = useCallback(reviewId => {
    return updateAndReload(reviewId, {
      aiFlagged: true,
      status: 'pending_moderation',
    })
  }, [updateAndReload])

  useEffect(() => {
    let cancelled = false

    // Inicia la carga de forma asíncrona y evita arrancarla tras la limpieza.
    Promise.resolve().then(() => {
      if (!cancelled) return loadPendingReviews()
    }).catch(() => {
      // runOperation ya expone el error al consumidor mediante el estado.
    })

    return () => {
      cancelled = true
    }
  }, [loadPendingReviews])

  return {
    reviews,
    isLoading: pendingOperations > 0,
    error,
    loadPendingReviews,
    approveReview,
    rejectReview,
    flagReview,
    refresh: loadPendingReviews,
  }
}
