# Servicios, Integraciones de API, n8n y Criptografía — SONAR

## 1. Cliente API y Persistencia ([api-client.js](../src/shared/services/api-client.js))

El cliente API interactúa con JSON Server en `http://localhost:3001` y mantiene sincronización reactiva con `localStorage`:

| Operación | Método & Endpoint | Descripción |
| --- | --- | --- |
| `getUsers()` | `GET /users` | Obtiene el listado completo de usuarios. |
| `getUserById(id)` | `GET /users/:id` | Consulta los detalles de un usuario específico. |
| `getUserByEmail(email)` | `GET /users?email=...` | Busca usuarios para autenticación y recuperación. |
| `createUser(user)` | `POST /users` | Registra nuevos usuarios con contraseña cifrada y fecha. |
| `updateUser(id, changes)` | `PATCH /users/:id` | Actualiza perfil, avatar, preferencias o contraseña. |
| `deleteUser(id)` | `DELETE /users/:id` | Elimina permanentemente al usuario (CRUD DELETE). |
| `getReviews()` | `GET /reviews` | Obtiene el catálogo de reseñas para el feed y comunidad. |
| `createReview(review)` | `POST /reviews` | Registra una nueva reseña con estado `pending_moderation`. |
| `updateReview(id, changes)` | `PATCH /reviews/:id` | Actualiza estado y decisiones de moderación. |

---

## 2. Integración Externa con Deezer API ([deezer-service.js](../src/shared/services/deezer-service.js))

- **Proxy de Desarrollo**: Peticiones redirigidas desde `/api/deezer` hacia `https://api.deezer.com`.
- **Endpoints Clave**:
  - `searchAlbums(query)`: Búsqueda de álbumes por título o artista.
  - `searchTracks(query)`: Búsqueda de canciones y preescuchas.
  - `getAlbumTracks(albumId)`: Obtención de la lista de reproducción de un disco.
  - `getTopTracks(artistId)`: Pistas destacadas de artistas.
- **Respaldo Offline**: Conjunto de datos de alta fidelidad precargados para asegurar funcionamiento ininterrumpido.

---

## 3. Automatización con n8n & Webhooks ([n8n-webhooks.js](../src/shared/services/n8n-webhooks.js))

- **Flujo 1: Recuperación de Contraseña con OTP**:
  - Endpoint de webhook: `http://localhost:5678/webhook-test/forgot-password` y `http://localhost:5678/webhook/forgot-password`.
  - Despacho seguro de código de 6 dígitos con expiración de 15 minutos.
  - Exportación del flujo: [sonar-recuperacion-contrasena.json](../n8n/sonar-recuperacion-contrasena.json).
- **Flujo 2: Notificaciones de Moderación**:
  - Webhook de alerta para moderación y eventos de conducta comunitaria.

---

## 4. Servicio Criptográfico SHA-256 ([crypto-service.js](../src/shared/services/crypto-service.js))

- **Web Crypto API**: Uso de `crypto.subtle.digest('SHA-256', ...)` nativo del navegador.
- **Salt Criptográfico**: Generación de salt aleatorio de 16 bytes en hexadecimal (`crypto.getRandomValues`).
- **Formato de Almacenamiento**: `sha256$<salt>$<hash_hex>`.
- **Verificación**: Comparación segura en tiempo constante del hash computado.
