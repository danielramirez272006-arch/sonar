# 🌐 02. Portal Público y Experiencia de Usuario

Este documento describe todas las secciones, componentes y funcionalidades interactivas disponibles para los visitantes y miembros de la comunidad en el portal público de **SONAR**.

---

## 1. 🎵 Portada Principal (`HomePage`)
**Rutas:** `/#explore`, `/`, `/#home`  
**Archivo:** [`sonar/src/pages/public/home-page.jsx`](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/src/pages/public/home-page.jsx)

### Módulos Destacados:
1. **Álbum de la Semana (`AlbumOfTheWeek`)**:
   - Hero editorial con arte de portada y disco de vinilo físico en rotación continua (*spinning vinyl*).
   - Datos de masterización (ej. *Direct Metal Mastering*, 180 gramos, master 24-bit/96kHz).
   - Botón interactivo de preescucha analógica y enlace al detalle del álbum.
2. **Buscador Principal (`HeroSearch`)**:
   - Barra de búsqueda con autocompletado en tiempo real.
   - Filtros rápidos por géneros (Art Pop, IDM, Jazz Fusión, Post-Rock, Ambient).
3. **Reseñas Destacadas (`FeaturedReviews`)**:
   - Tarjetas de crítica con calificación en estrellas, citas destacadas y badge de oyente verificado.
4. **Cuadrícula de Tendencias (`TrendingGrid`)**:
   - Los lanzamientos y reediciones más comentados de la semana por la comunidad.

---

## 2. 💿 Detalle de Álbum (`AlbumDetailPage`)
**Rutas:** `/#album`, `/#album/:id`  
**Archivo:** [`sonar/src/pages/public/album-detail-page.jsx`](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/src/pages/public/album-detail-page.jsx)

### Características:
- **Ficha Técnica**: Sello discográfico, año de prensado, formato y duración total.
- **Tracklist Interactivo**: Lista de pistas con duración, botón de reproducción de muestras y marcador de temas favoritos.
- **Sección de Críticas y Puntuación**: Desglose de calificaciones de los usuarios y formulario para publicar una nueva reseña.

---

## 3. 👥 Comunidad Audiófila (`CommunityPage`)
**Rutas:** `/#community`  
**Archivo:** [`sonar/src/pages/public/community-page.jsx`](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/src/pages/public/community-page.jsx)

### Características:
- **Feed Social**: Actividad reciente de melómanos, reseñas recién publicadas y debates en curso.
- **Filtros por Temática**: Hilos de discusión sobre equipos de audio Hi-Fi, cuidado de agujas y coleccionismo.

---

## 4. 🔑 Autenticación y Cuentas
- **Inicio de Sesión (`LoginPage`)**: [`sonar/src/pages/public/login-page.jsx`](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/src/pages/public/login-page.jsx)  
  Formulario de credenciales con validación, recuperación de contraseña y soporte de acceso para curadores.
- **Registro de Usuario (`RegisterPage`)**: [`sonar/src/pages/public/register-page.jsx`](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/src/pages/public/register-page.jsx)  
  Creación de perfil audiófilo seleccionando géneros de interés.
- **Perfil y Guardados (`UserDashboardPage`)**: [`sonar/src/pages/user/user-dashboard-page.jsx`](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/src/pages/user/user-dashboard-page.jsx)  
  Colección personal de vinilos guardados, historial de reseñas y configuración de perfil.

---

## 5. 📜 Páginas Institucionales y Soporte
- **Acerca de Sonar (`AboutPage`)**: [`sonar/src/pages/public/about-page.jsx`](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/src/pages/public/about-page.jsx)  
  El manifiesto de escucha atenta y crítica musical con criterio.
- **Términos y Condiciones (`TermsPage`)**: [`sonar/src/pages/public/terms-page.jsx`](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/src/pages/public/terms-page.jsx)  
  Lineamientos de convivencia y moderación comunitaria.
- **Error 404 Disco Rayado (`NotFoundPage`)**: [`sonar/src/pages/public/not-found-page.jsx`](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/src/pages/public/not-found-page.jsx)  
  Pantalla de página no encontrada con animación de disco rayado y botón de retorno al inicio.
