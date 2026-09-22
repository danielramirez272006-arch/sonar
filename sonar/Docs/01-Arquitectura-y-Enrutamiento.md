# 🏛️ 01. Arquitectura y Enrutamiento

Este documento detalla la estructura técnica, el sistema de enrutamiento SPA y la gestión global de estado y temas de la plataforma **SONAR**.

---

## 📁 Estructura del Código Fuente

El código fuente de la aplicación se encuentra encapsulado en `sonar/src/` bajo una arquitectura modular y escalable por capas:

```
sonar/src/
├── assets/                  # Iconos y recursos estáticos internos
├── features/                # Módulos encapsulados por dominio
│   ├── admin/               # Lógica, hooks y componentes de administración
│   ├── auth/                # Formularios y componentes de autenticación
│   └── home/                # Componentes destacados de la portada (Hero, Vinilo, etc.)
├── pages/                   # Vistas principales de página
│   ├── admin/               # Páginas de administración y moderación
│   ├── public/              # Páginas públicas (Home, Álbum, Comunidad, 404, etc.)
│   └── user/                # Páginas de usuario y perfil
├── shared/                  # Código y utilidades compartidas
│   ├── components/          # Componentes reutilizables (Navbar, Footer, UI atómica)
│   ├── context/             # Proveedores de contexto de React (Tema, Auth)
│   ├── routing/             # Enrutador central (AppRouter)
│   └── services/            # Clientes de API, servicio de IA y webhooks
└── Styles/                  # Hojas de estilo CSS globales y específicas
    ├── App.css
    ├── index.css
    ├── admin.css
    ├── admin-dashboard.css
    └── admin-moderation.css
```

---

## 🚦 Sistema de Enrutamiento (`AppRouter`)

El archivo [`sonar/src/shared/routing/app-router.jsx`](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/src/shared/routing/app-router.jsx) implementa un enrutador SPA reactivo sin recargas, con soporte simultáneo para navegación por **Path** (`/explore`) y navegación por **Hash** (`#explore`).

### Ventajas del Enrutador Implementado:
1. **Sin dependencias externas pesadas**: Manejo ágil mediante la API de historial y eventos `popstate` y `hashchange`.
2. **Transiciones fluidas con Framer Motion**: Cada cambio de vista está envuelto en un componente [`PageTransition`](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/src/shared/components/ui/page-transition.jsx) con desvanecimiento y desplazamiento suave.
3. **Manejo de Ruta 404**: Cualquier ruta no registrada despliega automáticamente la página [`NotFoundPage`](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/src/pages/public/not-found-page.jsx).

```jsx
// Ejemplo de uso del hook useRouter en componentes hijos
import { useRouter } from '../../shared/routing/app-router';

const MyComponent = () => {
  const { currentPath, navigate } = useRouter();

  return (
    <button onClick={() => navigate('#community')}>
      Ir a la Comunidad
    </button>
  );
};
```

---

## 🌓 Contexto de Tema Claro / Oscuro (`ThemeProvider`)

Ubicado en [`sonar/src/shared/context/theme-context.jsx`](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/src/shared/context/theme-context.jsx):

- **Detección automática**: Consulta las preferencias del sistema (`prefers-color-scheme`).
- **Persistencia**: Guarda la elección en `localStorage` con la clave `'sonar-theme'`.
- **Clases en raíz HTML**: Aplica las clases `.dark` o `.light` en el elemento `<html>` para compatibilidad nativa con CSS y Tailwind.
- **Botón conmutador animado en Navbar**: Permite cambiar instantáneamente entre el modo blanco editorial y el modo negro audiófilo.
