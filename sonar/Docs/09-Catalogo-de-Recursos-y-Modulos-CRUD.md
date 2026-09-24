# Catálogo de Recursos y Módulos CRUD — SONAR

Este documento formaliza la estructura de los recursos administrables y su integración entre la experiencia de usuario y la administración.

---

## Matriz de Recursos y Operaciones CRUD

| Recurso | Entidad & Datos | Alcance del Usuario | Alcance del Administrador |
| --- | --- | --- | --- |
| **Usuarios** | `id`, `username`, `email`, `password` (SHA-256), `avatarUrl`, `avatarBg`, `bio`, `preferences`, `gear`, `stats`, `conductReports` | **CREATE**: Registro público.<br>**READ**: Perfil y colecciones.<br>**UPDATE**: Editar avatar, gustos y contraseña.<br>**DELETE**: Eliminación definitiva en Zona de Peligro. | **READ**: Exploración de usuarios.<br>**UPDATE**: Sanciones (silencio, suspensión, baneo).<br>**AUDIT**: Historial de conducta. |
| **Reseñas & Críticas** | `id`, `userId`, `albumId`, `albumTitle`, `artist`, `cover`, `rating`, `content`, `status`, `aiFlagged`, `likesCount` | **CREATE**: Publicar críticas con calificación.<br>**READ**: Feed de reseñas y comunidad.<br>**UPDATE**: Reaccionar y comentar.<br>**DELETE**: Quitar interacción. | **READ**: Cola de moderación.<br>**UPDATE**: Aprobar o rechazar reseñas.<br>**AUDIT**: Historial de moderación. |
| **Colecciones & Guardados** | `id`, `userId`, `trackId`, `title`, `album`, `artist`, `cover`, `type`, `collectionTag`, `addedAt` | **CREATE**: Guardar canciones y álbumes.<br>**READ**: Biblioteca de guardados filtrable.<br>**UPDATE**: Cambiar etiqueta (`Favoritos`, etc.).<br>**DELETE**: Quitar de la colección personal. | **READ**: Métricas de guardados agregadas en el dashboard. |
| **Géneros Musicales** | Nombre, descripción, icono y metadatos | **READ**: Filtro de catálogo y selección de preferencias musicales en el perfil. | **READ / MANAGE**: Organización de categorías para recomendaciones. |
| **Listas Editoriales** | Título, descripción, portada y álbumes | **READ / LISTEN**: Exploración temática (`#curated-lists`), reproducción de canciones y guardado. | **MANAGE**: Selección y publicación de vitrinas audiófilas. |
| **Criterios de Moderación** | Regla, motivo, severidad y ejemplos | **READ**: Consulta de pautas editoriales y términos de uso (`#guidelines`). | **MANAGE / AUDIT**: Criterios de resolución de reportes y sanciones de usuarios. |
