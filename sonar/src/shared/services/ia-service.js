/**
 * IA Service - Sonar (Mock / Pre-integración)
 * 
 * Servicio para análisis de reseñas y generación de contexto acústico-lírico
 * utilizando modelos de procesamiento de lenguaje natural.
 */

/**
 * Analiza el texto de una reseña para detectar spoilers, spam o sentimiento.
 * Simula 1 segundo de procesamiento de inferencia del modelo.
 * 
 * @param {string} text - Contenido de la reseña a evaluar
 * @returns {Promise<Object>} Diagnóstico de la IA
 */
export const analyzeReview = async (text = '') => {
  // Simulación de inferencia del modelo (1000ms)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const lowerText = text.toLowerCase();
  const containsSpoilerKeywords =
    lowerText.includes('final') ||
    lowerText.includes('spoiler') ||
    lowerText.includes('clímax') ||
    lowerText.includes('muere');

  return {
    isApproved: true,
    hasSpoilers: containsSpoilerKeywords,
    sentiment: 'positive',
    confidenceScore: 0.96,
    summary: 'Análisis textual procesado correctamente por Sonar AI Core.',
    processedAt: new Date().toISOString(),
  };
};

export default {
  analyzeReview,
};
