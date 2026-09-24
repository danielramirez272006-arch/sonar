# Índice de Documentación Técnica — SONAR

Bienvenido al centro de documentación técnica y operativa de **SONAR**, la plataforma y bitácora musical para audiófilos y críticos de audio de alta fidelidad.

---

## Índice General de Documentos

1. **[01-Arquitectura-y-Enrutamiento.md](01-Arquitectura-y-Enrutamiento.md)**:
   - Estructura de carpetas modular por dominio (`features`, `pages`, `shared`).
   - Sistema de enrutamiento dinámico y guardias de seguridad (RBAC).
   - Gestión de estado global con Context API (`Auth`, `Theme`, `Player`, `Accessibility`).

2. **[02-Portal-Publico.md](02-Portal-Publico.md)**:
   - Integración musical y streaming de muestras Deezer.
   - Feed de Críticas del Mes, publicación de reseñas y modo vinilo.
   - Avatar Studio con subida de imágenes locales (Drag & Drop) y arquetipos Blobatar.
   - Biblioteca personal y colecciones guardadas.

3. **[03-Consola-Administracion-y-Moderacion.md](03-Consola-Administracion-y-Moderacion.md)**:
   - Dashboard de analítica, métricas en tiempo real y gráficos semanales.
   - Flujo de moderación con aprobación, rechazo y confirmación.
   - Módulo de Opiniones Coincidentes de la Comunidad.
   - Indicador visual de conducta y gestión de sanciones.

4. **[04-Servicios-API-y-Motor-IA.md](04-Servicios-API-y-Motor-IA.md)**:
   - Cliente API completo (`api-client.js`) con JSON Server.
   - Integración externa con Deezer API.
   - Automatización n8n con Webhooks y flujos de recuperación de contraseñas.
   - Servicio criptográfico SHA-256 con salt aleatorio.

5. **[05-Sistema-de-Accesibilidad-Universal.md](05-Sistema-de-Accesibilidad-Universal.md)**:
   - Estándar WCAG 2.1 AA/AAA.
   - Modos de alto contraste, escala dinámica de fuentes y fuente OpenDyslexic.
   - Filtros SVG para daltonismo (Protanopía, Deuteranopía, Tritanopía, Acromatopsia).
   - Lectura por voz (Text-to-Speech) y atajos de teclado globales.

6. **[06-Seguridad-Criptografia-y-Autenticacion.md](06-Seguridad-Criptografia-y-Autenticacion.md)**:
   - Hashing criptográfico con Web Crypto API.
   - Control de acceso basado en roles (`admin` / `user`).
   - Códigos de verificación OTP temporizados (15 min).
   - Zona de peligro y eliminación definitiva de cuentas (CRUD DELETE).

7. **[07-Manual-de-Usuario-y-Guia-Audiophila.md](07-Manual-de-Usuario-y-Guia-Audiophila.md)**:
   - Guía paso a paso para el usuario final y melómano.
   - Creación de cuenta, personalización de perfil y equipo de audio.
   - Cómo escuchar muestras, redactar críticas y organizar colecciones.

8. **[08-Manual-Tecnico-de-Pruebas-y-Despliegue.md](08-Manual-Tecnico-de-Pruebas-y-Despliegue.md)**:
   - Manual de ejecución de pruebas automatizadas (18 suites, 95 tests con Vitest).
   - Guía de inicio local y compilación optimizada con Vite para producción.

9. **[09-Catalogo-de-Recursos-y-Modulos-CRUD.md](09-Catalogo-de-Recursos-y-Modulos-CRUD.md)**:
   - Matriz de recursos del sistema (Usuarios, Reseñas, Colecciones, Géneros, Listas Editoriales y Criterios).
   - Especificaciones de operaciones Create, Read, Update y Delete.

10. **[requerimientos.md](requerimientos.md)**:
    - Lista de verificación y auditoría del 100% de requerimientos completados.

11. **[Design.md](Design.md)**:
    - Lineamientos de identidad visual, paletas cromáticas, tipografía y diseño UI/UX.
