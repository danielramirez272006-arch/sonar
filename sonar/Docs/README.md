# 📚 Índice de Documentación — Plataforma SONAR

Bienvenido a la documentación técnica y funcional de **SONAR: Audiophile Curation Hub**, una plataforma social y editorial dedicada a la crítica musical inmersiva, coleccionismo de vinilos y curaduría asistida por Inteligencia Artificial.

---

## 🗂️ Estructura de Documentos

1. **[01. Arquitectura y Enrutamiento](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/Docs/01-Arquitectura-y-Enrutamiento.md)**
   - Sistema de rutas SPA (`AppRouter`).
   - Gestión de temas Claro/Oscuro (`ThemeProvider`).
   - Estructura modular del proyecto y diseño atómico.

2. **[02. Portal Público y Experiencia de Usuario](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/Docs/02-Portal-Publico.md)**
   - Home y Álbum de la semana con disco de vinilo interactivo.
   - Buscador global y filtros por género.
   - Detalle de Álbum, Comunidad y Reproductor.
   - Páginas de Autenticación, Acerca de, Términos y Error 404.

3. **[03. Consola de Administración y Moderación](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/Docs/03-Consola-Administracion-y-Moderacion.md)**
   - Dashboard administrativo y métricas KPI.
   - Cola de moderación en vivo y acciones (Aprobar / Rechazar / Analizar).
   - Feed de actividad reciente y exportación CSV.

4. **[04. Servicios API y Motor de Inteligencia Artificial](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/Docs/04-Servicios-API-y-Motor-IA.md)**
   - Integración con API REST local (JSON Server).
   - Servicio de auditoría lírica y detección de contenido con IA.
   - Webhooks de automatización con n8n.

5. **[Diseño Editorial y Estética Audiófila](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/Docs/Design.md)**
   - Guía de estilos, paleta de colores cromática y tokens de diseño.

---

## 🚀 Guía Rápida de Ejecución Local

### Requisitos Previos
- Node.js v18+ y npm instalados.

### Comandos de Arranque

```bash
# 1. Instalar dependencias
cd sonar
npm install

# 2. Iniciar la API Mock local (JSON Server en puerto 3001)
npm run api

# 3. Iniciar el servidor de desarrollo frontend (Vite en puerto 5173)
npm run dev

# 4. Ejecutar pruebas unitarias automatizadas (Vitest)
npm test
```

---

## 🗺️ Mapa de Rutas de la Aplicación

| Ruta Hash | Vista | Descripción |
| :--- | :--- | :--- |
| `/#explore` / `/` | **Home / Explorar** | Portada con vinilo animado, tendencias y reseñas destacadas. |
| `/#community` | **Comunidad** | Feed social de melómanos y debates musicales. |
| `/#album` | **Detalle de Álbum** | Ficha técnica de disco, tracklist y calificaciones. |
| `/#login` | **Iniciar Sesión** | Acceso para usuarios y curadores. |
| `/#register` | **Registro** | Creación de cuenta en Sonar. |
| `/#profile` | **Perfil de Usuario** | Dashboard personal, reseñas publicadas y discos guardados. |
| `/#dashboard` | **Admin Dashboard** | Métricas operativas, distribución de ratings y exportación. |
| `/#moderacion` | **Moderación** | Cola de auditoría de reseñas asistida por IA. |
| `/#about` | **Acerca de** | Manifiesto y propósito del proyecto. |
| `/#terms` | **Términos** | Términos y condiciones de uso. |
