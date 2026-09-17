/**
 * n8n Webhooks Service - Sonar (Mock / Pre-integración)
 * 
 * Orquestador de disparadores automáticos hacia flujos de trabajo en n8n
 * (ej. alertas de moderación, sincronización en Discord o newsletters).
 */

const N8N_WEBHOOK_URL =
  import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://n8n.example.com/webhook/new-review';

/**
 * Dispara un webhook hacia n8n cuando un usuario publica una nueva reseña.
 * Actualmente funciona en modo simulado para facilitar el testeo en el frontend.
 * 
 * @param {Object} reviewData - Datos completos de la reseña
 * @returns {Promise<Object>} Confirmación del evento
 */
export const triggerNewReviewWebhook = async (reviewData = {}) => {
  console.log(
    '%c[n8n Webhook] Disparo simulado hacia n8n workflow:',
    'color: #B80C09; font-weight: bold;',
    {
      targetUrl: N8N_WEBHOOK_URL,
      payload: reviewData,
      timestamp: new Date().toISOString(),
    }
  );

  // Espacio reservado para el POST real:
  /*
  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
  });
  return await response.json();
  */

  return {
    success: true,
    message: 'Webhook recibido y encolado en n8n.',
    simulated: true,
  };
};

export default {
  triggerNewReviewWebhook,
};
