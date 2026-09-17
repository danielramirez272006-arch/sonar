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

## 🧱 Estructura Modular (Feature-Sliced Design)

El proyecto sigue una arquitectura modular escalable que separa responsabilidades y simplifica la colaboración:

```text
src/
├── assets/                    # Recursos estáticos locales
├── features/                  # Módulos encapsulados por dominio de negocio
│   ├── admin/                 # Métricas KPI y cola de moderación IA
│   │   ├── dashboard/components/
│   │   └── moderation/components/
│   ├── albums/                # Reproductor Deezer y componentes de discos
│   ├── auth/                  # Formularios de inicio de sesión y registro
│   ├── home/                  # Hero con vinilo interactivo, trending y reviews
│   ├── profile/               # Encabezado de perfil y estadísticas de usuario
│   └── reviews/               # StarRating, formularios y feed comunitario
├── pages/                     # Vistas y orquestadores de ruta
│   ├── admin/                 # Panel de administración
│   ├── public/                # Inicio, login, comunidad, detalle de álbum, 404
│   └── user/                  # Dashboard y perfil de usuario
└── shared/                    # Recursos transversales y reutilizables
    ├── components/
    │   ├── layout/            # Navbar animada y Footer
    │   └── ui/                # Avatar, AnimatedLogo, Loader (Skeleton), StarRating, Toast
    └── context/               # ThemeContext (gestión global de tema)
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

© 2024 Sonar Audio Media Inc. Todos los derechos reservados.
