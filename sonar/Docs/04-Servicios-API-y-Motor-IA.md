# Servicios, APIs, IA y n8n

## API local

[api-client.js](../src/shared/services/api-client.js) utiliza `http://localhost:3001`.

| Función | Petición | Uso |
| --- | --- | --- |
| getUsers | GET /users | Usuarios, perfiles y métricas. |
| getUserById | GET /users/:id | Consulta de usuario. |
| getUserByEmail | GET /users?email=... | Autenticación y recuperación. |
| createUser | POST /users | Registro. |
| updateUser | PATCH /users/:id | Perfil, reportes, sanciones y contraseña. |
| getReviews | GET /reviews | Archivo y comunidad. |
| getReviewsByUser | GET /reviews?userId=... | Reseñas de un autor. |
| getPendingReviews | GET /reviews?status=pending_moderation | Cola. |
| createReview | GET del autor y POST /reviews | Comprueba sanción y guarda pendiente. |
| updateReview | GET y PATCH /reviews/:id cuando hay moderación | Conserva historial de decisiones. |

El cliente genérico también implementa PUT y DELETE. Su existencia no acredita un CRUD completo en la interfaz. No se identificó un flujo de eliminación administrativa de usuarios.

Algunos servicios de usuarios devuelven datos locales o un objeto de resultado si la API falla. Por ello, una confirmación visual no siempre demuestra persistencia en db.json.

## Deezer

[deezer-service.js](../src/shared/services/deezer-service.js) consulta rutas bajo `/api/deezer`. [vite.config.js](../vite.config.js) las dirige a `https://api.deezer.com` durante desarrollo.

Incluye búsqueda, detalle de álbum, pistas, artistas y muestras. Los consumidores usan sus resultados en buscadores, tarjetas y reproductor. Hay información de respaldo y manejo de fallos.

El proxy de desarrollo no configura automáticamente el servidor de producción.

## Inteligencia Artificial

[ia-service.js](../src/shared/services/ia-service.js) contiene:

- Recomendaciones fijas con espera simulada.
- Contexto lírico de demostración.
- Marcado de reseñas mediante palabras de un diccionario.

[community-opinions.js](../src/shared/services/community-opinions.js) usa reglas de similitud textual. Ninguno de estos servicios acredita una integración real con un modelo de IA.

## n8n y Gmail

Existe una exportación: [SONAR - Código de Recuperación OTP](../n8n/sonar-recuperacion-contrasena.json).

| Elemento | Implementación |
| --- | --- |
| Trigger | Webhook de recuperación. |
| Objetivo | Entregar un código OTP por correo. |
| Nodos | Webhook, validación de email, preparación de código, Gmail y respuestas HTTP. |
| Destinatario | Se obtiene de los datos de la solicitud. |
| Estado del archivo | active: false; no demuestra el estado de una instancia externa. |

Para utilizarlo es necesario importarlo en n8n, configurar Gmail y el webhook y comprobar una entrega real. El cliente permite configurar `VITE_N8N_FORGOT_PASSWORD_WEBHOOK_URL`; si no se define, intenta localhost:5678 con `/webhook-test/forgot-password` y `/webhook/forgot-password`.

La URL del webhook es configuración visible del frontend; no colocar secretos en variables VITE.

[requestPasswordResetWebhook](../src/shared/services/n8n-webhooks.js) puede devolver `simulated: true` y un mensaje de éxito ante fallos. Esto no demuestra que Gmail envió un correo. Además, el código OTP aparece en el flujo del cliente y sus registros de consola.

Los webhooks de moderación del mismo archivo son simulados. Falta un segundo workflow real y su comprobación.

## Seguridad y pruebas

JSON Server no impone autorización por rol. La recuperación no incorpora expiración efectiva ni invalidación persistente del OTP. El almacenamiento de contraseñas incluye compatibilidad con valores de demostración.

Las pruebas de n8n usan fetch simulado. Validan lógica de solicitudes, no credenciales, activación del workflow o entrega del correo.
