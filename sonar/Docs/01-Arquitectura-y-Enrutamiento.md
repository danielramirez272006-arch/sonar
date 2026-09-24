# Arquitectura y Enrutamiento — SONAR

## 1. Organización del Código

El proyecto está estructurado de manera modular y escalable bajo una arquitectura basada en dominios y componentes reutilizables:

```text
src/
├── features/               # Módulos encapsulados por dominio
│   ├── admin/             # Consola de administración, métricas y moderación
│   ├── albums/            # Vistas de álbumes y reproductores
│   ├── auth/              # Formularios de Login, Registro y Recuperación OTP
│   ├── home/              # Vitrinas editoriales, destacados y trending grid
│   ├── profile/           # Avatar Studio, especificaciones de audio y perfil
│   └── reviews/           # Tarjetas de críticas, modales y comentarios
├── pages/                 # Páginas principales de la aplicación
│   ├── admin/             # Páginas de administración y moderación
│   ├── public/            # Portales públicos (Home, Explorar, Vinilos, etc.)
│   └── user/              # Dashboard de usuario y colecciones guardadas
├── shared/                # Recursos compartidos transversales
│   ├── components/        # Componentes UI (Botones, Inputs, Avatares, A11y)
│   ├── context/           # Proveedores de estado global (Auth, Theme, Player, A11y)
│   ├── routing/           # Enrutador dinámico y guardias de seguridad (RBAC)
│   └── services/          # Clientes API, Deezer, IA, Criptografía y n8n
├── Styles/                # Hojas de estilo CSS (Accesibilidad, Consola, Temas)
├── App.jsx                # Componente raíz y contenedor principal
└── main.jsx               # Punto de entrada y montaje de Providers
```

---

## 2. Sistema de Enrutamiento y Navegación

El enrutamiento se gestiona a través de [AppRouter](../src/shared/routing/app-router.jsx), el cual escucha los eventos de `hashchange` y `popstate`, sincronizando la URL con las vistas de la aplicación:

### Rutas Públicas
- `#home` / `#` / vacía: [HomePage](../src/pages/public/home-page.jsx) — Portada editorial y buscador principal.
- `#explore`: [CatalogPage](../src/pages/public/catalog-page.jsx) — Catálogo musical interactivo con Deezer.
- `#community`: [CommunityPage](../src/pages/public/community-page.jsx) — Comunidad y reseñas en tiempo real.
- `#curated-lists`: [CuratedListsPage](../src/pages/public/curated-lists-page.jsx) — Selecciones editoriales temáticas.
- `#vinyl-mode`: [VinylModePage](../src/pages/public/vinyl-mode-page.jsx) — Experiencia inmersiva para tornamesas.
- `#reviews`: [ReviewsFeedPage](../src/pages/public/reviews-feed-page.jsx) — Ensayos y críticas del mes.
- `#album/:id`: [AlbumDetailPage](../src/pages/public/album-detail-page.jsx) — Ficha detallada de álbum y canciones.
- `#login`: [LoginPage](../src/pages/auth/login-page.jsx) — Inicio de sesión seguro.
- `#register`: [RegisterPage](../src/pages/auth/register-page.jsx) — Registro público de melómanos.
- `#forgot-password`: [ForgotPasswordPage](../src/pages/auth/forgot-password-page.jsx) — Recuperación de contraseña con OTP.
- `#guidelines`: [EditorialGuidelinesPage](../src/pages/public/editorial-guidelines-page.jsx) — Pautas y normas de conducta.
- `#terms`: [TermsPage](../src/pages/public/terms-page.jsx) — Términos y privacidad.

### Rutas Privadas (Requieren Inicio de Sesión)
- `#usuario`: [UserDashboardPage](../src/pages/user/user-dashboard-page.jsx) — Perfil de usuario, recomendaciones y personalización.
- `#saved-albums`: [SavedAlbumsPage](../src/pages/user/saved-albums-page.jsx) — Biblioteca personal de música guardada.

### Rutas Protegidas de Administración (Requieren Rol `admin`)
- `#admin`: [AdminDashboardPage](../src/pages/admin/admin-dashboard-page.jsx) — Métricas y analíticas del sistema.
- `#moderacion`: [ModerationPage](../src/pages/admin/moderation-page.jsx) — Cola de moderación y auditoría de contenido.
- `#usuarios`: [AdminUsersPage](../src/pages/admin/admin-users-page.jsx) — Gestión de usuarios, conducta y sanciones.
- `#admin-reports`: [AdminReportsPage](../src/pages/admin/admin-reports-page.jsx) — Centro de reportes comunitarios.

---

## 3. Capas de Seguridad y Guardias de Navegación (RBAC)

1. **[PrivateRoute](../src/shared/routing/private-route.jsx)**: Evalúa `isAuthenticated`. Si no existe sesión activa, muestra una pantalla de bloqueo con enlaces a login y registro.
2. **[AdminRoute](../src/shared/routing/admin-route.jsx)**: Evalúa que el usuario tenga rol de administrador (`user.role === 'admin'`). Los usuarios estándar son redirigidos protegiendo la consola.

---

## 4. Estado Global y Persistencia

- **[AuthContext](../src/shared/context/auth-context.jsx)**: Maneja sesión, registro, login, cambio de contraseña con SHA-256, borrado de cuenta (`deleteAccount`) y persistencia en `localStorage.sonar_auth_user`.
- **[AccessibilityContext](../src/shared/context/accessibility-context.jsx)**: Gestiona tamaño de fuente, alto contraste WCAG AAA, filtros de daltonismo, tipografía disléxica, lectura por voz (TTS) y atajos de teclado.
- **[ThemeContext](../src/shared/context/theme-context.jsx)**: Controla el modo claro y modo oscuro con persistencia en `localStorage.theme`.
- **[PlayerContext](../src/shared/context/player-context.jsx)**: Controla el reproductor global de audio, streaming de muestras Deezer y apertura centralizada del modal de reseñas.
