# ⚡ 04. Servicios API y Motor de Inteligencia Artificial

Este documento describe la capa de servicios, la integración con la base de datos simulada y el motor de análisis automatizado con IA.

---

## 1. 🔌 Cliente de API (`api-client.js`)
**Archivo:** [`sonar/src/shared/services/api-client.js`](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/src/shared/services/api-client.js)

El cliente de API realiza peticiones HTTP REST a la API local (`JSON Server`) corriendo por defecto en `http://localhost:3001`:

| Función | Método HTTP | Endpoint | Descripción |
| :--- | :--- | :--- | :--- |
| `getReviews()` | `GET` | `/reviews` | Obtiene la lista completa de reseñas. |
| `getReviewById(id)` | `GET` | `/reviews/:id` | Obtiene una reseña específica. |
| `getUsers()` | `GET` | `/users` | Lista todos los usuarios registrados. |
| `getUserById(id)` | `GET` | `/users/:id` | Información de un usuario por su ID. |
| `getAlbums()` | `GET` | `/albums` | Catálogo de álbumes y metadatos físicos. |
| `updateReviewStatus(id, status)` | `PATCH` | `/reviews/:id` | Actualiza el estado (`approved`, `rejected`, etc.). |
| `setReviewAiFlagged(id, aiFlagged)` | `PATCH` | `/reviews/:id` | Marca o desmarca una reseña como observada por IA. |

---

## 2. 🧠 Motor de Análisis con IA (`ia-service.js`)
**Archivo:** [`sonar/src/shared/services/ia-service.js`](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/src/shared/services/ia-service.js)

El servicio de IA se encarga de analizar el texto de las reseñas antes o durante la moderación humana:

### Reglas de Análisis:
- **Detección de Lenguaje Ofensivo**: Evalúa el cuerpo de la reseña contra un diccionario de términos inapropiados o conductas tóxicas.
- **Marcado Automático (`aiFlagged: true`)**: Si se detecta una coincidencia, la reseña se categoriza para inspección obligatoria.
- **Simulación de Score de Confianza**: Devuelve métricas de confianza y sugerencia curatorial (ej. *Revisión humana recomendada* vs *Sin anomalías detectadas*).

```js
// Ejemplo de llamada al servicio de IA
import { analyzeReview } from './shared/services/ia-service.js';

const resultado = await analyzeReview(review);
console.log(resultado.aiFlagged); // true | false
console.log(resultado.reason);    // Detalle del análisis
```

---

## 3. 🔄 Webhooks con n8n (`n8n-webhooks.js`)
**Archivo:** [`sonar/src/shared/services/n8n-webhooks.js`](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/src/shared/services/n8n-webhooks.js)

Permite la integración con flujos de trabajo externos en **n8n**:
- Notificación automática a canales de Discord/Slack cuando una reseña es marcada por IA.
- Sincronización periódica de métricas hacia sistemas de reportería externa.
