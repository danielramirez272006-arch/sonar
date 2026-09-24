# Portal público y cuentas

## Música y búsqueda

La portada combina contenido editorial y búsqueda mediante [deezer-service.js](../src/shared/services/deezer-service.js). El servicio consulta álbumes, artistas, pistas y preescuchas. También contiene datos de respaldo; ver una portada o una tarjeta no demuestra que una petición externa haya funcionado.

[AlbumDetailPage](../src/pages/public/album-detail-page.jsx) mantiene una ficha de ejemplo de In Rainbows con datos y pistas definidos en código. No debe describirse como una ficha dinámica completa para cualquier ID.

El reproductor usa PlayerContext. La reproducción depende de la disponibilidad de las muestras de audio y de las restricciones del navegador.

## Comunidad y reseñas

[CommunityPage](../src/pages/public/community-page.jsx) combina reseñas aprobadas de la API con contenido de ejemplo. Ofrece filtros, publicación e interacciones.

Los formularios envían las reseñas a `createReview`, que consulta el estado del autor y fuerza `pending_moderation`. Enviar una reseña no equivale a aprobarla.

Las tarjetas permiten reportar reseñas con autor identificable. Los reportes de reseñas se guardan en `users[].conductReports` para su revisión administrativa. Comentarios, favoritos y otras interacciones también utilizan servicios con almacenamiento local; no todos estos registros están en JSON Server.

## Login, registro y perfil

[LoginForm](../src/features/auth/components/login-form.jsx) valida credenciales y redirige según rol. Los botones sociales visibles no acreditan OAuth conectado.

El registro público crea un usuario con rol `user`. La sesión persiste en localStorage y el logout la elimina. El perfil incluye preferencias y opciones de avatar; algunas funciones tienen datos iniciales de demostración.

## Recuperación de contraseña

[ForgotPasswordForm](../src/features/auth/components/forgot-password-form.jsx) presenta correo, código OTP, contraseña nueva y confirmación. El código se genera o recibe en el navegador y se compara en el cliente.

El servicio intenta enviar el código a n8n, pero puede devolver éxito simulado si falla. La pantalla anuncia una duración de 15 minutos sin una comprobación temporal equivalente en la validación revisada. Tampoco se ha implementado invalidación persistente de uso único.

La actualización de contraseña depende de que exista un usuario y de la persistencia efectiva en la API. La alternativa local puede ocultar fallos de guardado. Este flujo no debe darse por validado de extremo a extremo.

## Verificaciones pendientes

Comprobar las vistas principales a 375, 768 y 1280 px o más, navegación por teclado, zoom, etiquetas de campos, audio y errores de conexión. La existencia de estilos responsive no sustituye esa comprobación.
