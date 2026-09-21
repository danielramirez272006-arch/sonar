# 🎵 Sonar — Plataforma Social de Reseñas Musicales Inmersiva

**Sonar** es una experiencia web frontend de alta resolución diseñada para audiófilos, melómanos y coleccionistas de vinilo. La plataforma combina crítica musical, análisis lírico contextual impulsado por IA, bitácora de escucha y un feed comunitario interactivo.

---

## 🛠️ Stack Tecnológico

El proyecto está desarrollado bajo una arquitectura frontend moderna y desacoplada, con enfoque exclusivo en **UI/UX**, rendimiento y accesibilidad:

- **Core:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) (Entorno ultrarrápido con Hot Module Replacement).
- **Estilos & Diseño:** [Tailwind CSS v4](https://tailwindcss.com/) con soporte de variantes nativas `@variant dark`.
- **Orquestación de Animaciones:** [Framer Motion](https://www.framer.com/motion/) para transiciones de página, rebotes de calificación, menús interactivos y físicas con *staggerChildren*.
- **Iconografía & Tipografía:** Google Material Symbols Outlined, fuentes Google Fonts (*Syne* y *Plus Jakarta Sans*).
- **Preparación para Integración:** Componentes diseñados para fácil conexión con APIs RESTful, servicios de autenticación, streaming y modelos de lenguaje (IA).

---

## 🎨 Sistema de Diseño (Dual Theme)

Sonar implementa un sistema de temas dual armonizado que conmuta dinámicamente entre **Modo Claro (Blanco Editorial)** y **Modo Oscuro (Corporate Dark)**:

| Token / Elemento | Modo Claro (Editorial) | Modo Oscuro (Corporate) |
| :--- | :--- | :--- |
| **Fondo Principal** | `#fff7fa` / `#f9fafb` | `#231123` (Ciruela oscuro profundo) |
| **Superficies & Tarjetas** | `#ffffff` con borde `#e6d5e2` | `#4B2840` con borde `rgba(255,255,255,0.1)` |
| **Acento de Marca** | `#B80C09` (Rojo Sonar) | `#B80C09` (Rojo Sonar) |
| **Texto Primario** | `#231123` | `#FAF5F8` / `#FFFFFF` |
| **Texto Secundario** | `#5c435a` | `#B89CB0` |
| **Pills & Badges** | `#f8e9f6` (texto `#5c1d5e`) | `#4B2840` (texto `#FAF5F8`) |

---

## 🧱 Estructura del Proyecto

El proyecto sigue una arquitectura modular y escalable organizada por características de negocio y componentes compartidos:

```text
├── db.json
├── jsconfig.json
├── public/
│   ├── logo-sonar.svg
│   └── avatars/
│       ├── default-teal.png
│       ├── default-violet.png
│       └── default-crimson.png
└── src/
    ├── shared/
    │   ├── components/
    │   │   ├── ui/
    │   │   │   ├── button.jsx
    │   │   │   ├── card.jsx
    │   │   │   ├── modal.jsx
    │   │   │   ├── input.jsx
    │   │   │   ├── star-rating.jsx
    │   │   │   ├── badge.jsx
    │   │   │   ├── loader.jsx
    │   │   │   └── avatar.jsx
    │   │   └── layout/
    │   │       ├── navbar.jsx
    │   │       ├── footer.jsx
    │   │       └── admin-sidebar.jsx
    │   ├── context/
    │   │   ├── auth-context.jsx
    │   │   └── theme-context.jsx
    │   ├── services/
    │   │   ├── api-client.js
    │   │   ├── deezer-service.js
    │   │   ├── ia-service.js
    │   │   └── n8n-webhooks.js
    │   ├── routing/
    │   │   ├── app-router.jsx
    │   │   ├── private-route.jsx
    │   │   └── admin-route.jsx
    │   └── index.js
    ├── pages/
    │   ├── public/
    │   │   ├── home-page.jsx
    │   │   ├── login-page.jsx
    │   │   ├── register-page.jsx
    │   │   ├── album-detail-page.jsx
    │   │   ├── about-page.jsx
    │   │   └── terms-page.jsx
    │   ├── user/
    │   │   ├── user-dashboard-page.jsx
    │   │   ├── my-reviews-page.jsx
    │   │   ├── saved-albums-page.jsx
    │   │   └── profile-settings-page.jsx
    │   └── admin/
    │       ├── admin-dashboard-page.jsx
    │       ├── moderation-page.jsx
    │       ├── users-page.jsx
    │       └── settings-page.jsx
    └── features/
        ├── profile/
        │   ├── index.js
        │   ├── use-profile.js
        │   └── components/
        │       ├── profile-header.jsx
        │       └── edit-profile-form.jsx
        ├── home/
        │   ├── index.js
        │   └── components/
        │       ├── hero-search.jsx
        │       ├── album-of-the-week.jsx
        │       ├── featured-reviews.jsx
        │       └── trending-grid.jsx
        ├── auth/
        │   ├── index.js
        │   ├── use-auth.js
        │   └── components/
        │       ├── login-form.jsx
        │       └── register-form.jsx
        ├── albums/
        │   ├── index.js
        │   ├── use-album-details.js
        │   └── components/
        │       ├── album-cover-large.jsx
        │       ├── deezer-player.jsx
        │       ├── lyrical-context.jsx
        │       └── favorite-button.jsx
        ├── reviews/
        │   ├── index.js
        │   ├── use-reviews.js
        │   └── components/
        │       ├── review-form.jsx
        │       ├── review-list.jsx
        │       └── review-card.jsx
        └── admin/
            ├── dashboard/
            │   ├── index.js
            │   └── components/
            │       ├── kpi-cards.jsx
            │       └── activity-chart.jsx
            └── moderation/
                ├── index.js
                ├── use-moderation.js
                └── components/
                    ├── moderation-table.jsx
                    ├── explicit-content-flag.jsx
                    └── approve-reject-buttons.jsx
```

---

## 🚀 Inicio Rápido

### Instalación de dependencias
```bash
npm install
```

### Ejecutar servidor de desarrollo
```bash
npm run dev
```

### Compilar para producción
```bash
npm run build
```

---

© 2026 Sonar Audio Media Inc. Todos los derechos reservados.
