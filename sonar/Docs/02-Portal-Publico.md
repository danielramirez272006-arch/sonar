# Portal Público, Experiencia Musical y Perfil de Usuario — SONAR

## 1. Experiencia Musical y Conexión con Deezer

El portal integra búsqueda y reproducción directa a través de [deezer-service.js](../src/shared/services/deezer-service.js):
- **Búsqueda Dinámica**: Búsqueda en tiempo real desde el Navbar y la página de catálogo con debounce para optimizar peticiones.
- **Streaming de Muestras**: Reproducción en alta fidelidad (muestras de 30 segundos) controladas por [global-audio-player.jsx](../src/shared/components/layout/global-audio-player.jsx).
- **Modo Vinilo Inmersivo ([VinylModePage](../src/pages/public/vinyl-mode-page.jsx))**: Interfaz con animación giratoria de disco de vinilo, control de velocidad (33⅓ / 45 RPM) y selección de pistas.

---

## 2. Comunidad, Críticas y Ensayos

- **Feed de Críticas del Mes ([ReviewsFeedPage](../src/pages/public/reviews-feed-page.jsx))**: Espacio editorial donde los críticos y usuarios publican ensayos sonoros.
  - Botón **«Publicar Mi Crítica»** conectado al modal centralizado [ReviewModal](../src/shared/components/layout/review-modal.jsx).
  - Botón **«Criticar»** directo en cada tarjeta de reseña para calificar cualquier disco inmediatamente.
  - Integración de Text-to-Speech (`TTSButton`) para escuchar los ensayos mediante síntesis de voz.
- **Interacciones Comunitarias**: Likes con criterio audiófilo, comentarios con respuestas anidadas e hilos de debate gestionados por [interactions-service.js](../src/shared/services/interactions-service.js).
- **Radar Musical & Lanzamientos Destacados ([NewsPage](../src/pages/public/news-page.jsx))**:
  - Sección conectada en tiempo real al endpoint `/releases` filtrado por estado `published`.
  - Tarjetas interactivas con badges de tipo (*Álbum, Sencillo, EP, Vinilo*), género y fecha.
  - **Modal de Detalle & Descripción Completa**: Al hacer clic en cualquier lanzamiento destacado, se abre un modal con la portada en alta resolución, la reseña editorial completa, reproductor/enlace a streaming y lectura por voz TTS.


---

## 3. Biblioteca Personal y Colecciones Guardadas

En [SavedAlbumsPage](../src/pages/user/saved-albums-page.jsx) y [UserDashboardPage](../src/pages/user/user-dashboard-page.jsx):
- Guardado instantáneo con feedback visual inmediato (`bookmark_add` a `bookmark_added`).
- Filtros por categoría: `Todos`, `🎵 Canciones`, `💿 Álbumes`, `Favoritos`, `Colección Vinilo`, `Por Escuchar`.
- Gestión reactiva del estado sincronizada mediante el evento global `sonar:collection-changed`.

---

## 4. Avatar Studio y Personalización de Perfil

En [EditProfileForm](../src/features/profile/components/edit-profile-form.jsx):
- **Avatar Studio**:
  - Subida de imágenes locales mediante **Drag & Drop** o selección de archivo (PNG, JPG, WEBP, GIF hasta 8MB) convertidas a Data URL.
  - 11 Arquetipos Blobatar SVG musicales (Vinilófilo, Synth Master, Jazzista, etc.).
  - 24 Colores sólidos curados y 10 Degradados modernos de alta resolución.
- **Equipamiento Audiófilo**: Registro de auriculares de referencia, tocadiscos y amplificadores DAC.
- **Preferencias Musicales**: Selección dinámica de géneros para alimentar recomendaciones personalizadas.
- **Seguridad**: Cambio de contraseña cifrada con SHA-256 + salt criptográfico.
- **Zona de Peligro (Eliminación de Cuenta)**: Modal de confirmación explícita para borrar la cuenta permanentemente cumpliendo con el ciclo completo de CRUD.
