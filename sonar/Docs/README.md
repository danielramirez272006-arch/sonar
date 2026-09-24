# Documentación de SONAR

Documentación contrastada con el código el 24 de septiembre de 2026. Describe la implementación local; no certifica servicios externos ni una instalación limpia.

## Documentos

1. [Arquitectura y enrutamiento](01-Arquitectura-y-Enrutamiento.md)
2. [Portal público y cuentas](02-Portal-Publico.md)
3. [Consola administrativa](03-Consola-Administracion-y-Moderacion.md)
4. [Servicios, IA y n8n](04-Servicios-API-y-Motor-IA.md)
5. [Diseño](Design.md)
6. [Requisitos y auditoría](requerimientos.md)
7. [Flujo administrativo y comprobaciones](../ADMIN-WORKFLOW.md)

## Inicio local

Desde la raíz del repositorio, entra en `sonar/`, donde están [package.json](../package.json) y [db.json](../db.json).

La versión instalada de Vite requiere Node.js `^20.19.0 || >=22.12.0`.

```bash
npm install
npm run api
```

En otra terminal, dentro de la misma carpeta:

```bash
npm run dev
```

JSON Server escucha en `http://localhost:3001`. Vite muestra la URL del frontend. Para verificar:

```bash
npm test
npm run build
npm run lint
```

La última ejecución registrada durante la integración de código pasó 90 pruebas en 17 archivos y compiló correctamente. No se repitieron estos comandos para esta actualización documental. Las pruebas con mocks no acreditan entrega de correos ni disponibilidad de APIs.

## Ubicación de los recursos

| Carpeta | Contenido |
| --- | --- |
| `src/features/` | Funciones por dominio: administración, autenticación, álbumes, reseñas, perfiles y portada. |
| `src/pages/` | Páginas públicas, de usuario y de administración. |
| `src/shared/` | Componentes, contextos, rutas y servicios compartidos. |
| `src/Styles/` | Estilos generales y administrativos. |
| `tests/` | Pruebas de lógica y componentes. |
| `n8n/` | Exportación del workflow de recuperación. |
| `public/` | Logos, iconos y avatares estáticos. |

## Rutas principales

| Hash | Vista | Acceso |
| --- | --- | --- |
| `#explore`, `#home` | Portada y búsqueda | Público |
| `#community`, `#reviews` | Comunidad y reseñas | Público |
| `#album` | Detalle editorial de álbum | Público |
| `#login`, `#register`, `#forgot-password` | Autenticación y recuperación | Público |
| `#usuario`, `#profile`, `#saved` | Dashboard de usuario | Sesión |
| `#profile-settings` | Configuración de perfil | Sesión |
| `#admin`, `#dashboard` | Dashboard administrativo | Administrador |
| `#moderacion` | Cola de revisión y opiniones | Administrador |
| `#usuarios` | Gestión de usuarios | Administrador |
| `#admin-reports` | Reportes | Administrador |
| `#admin-reviews` | Archivo de reseñas | Administrador |

La protección de estas vistas es de frontend. Consulta las limitaciones en [arquitectura](01-Arquitectura-y-Enrutamiento.md).
