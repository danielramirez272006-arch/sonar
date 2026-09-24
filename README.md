# SONAR

Aplicación académica de reseñas musicales con portal público, perfiles de usuario y consola de moderación.

## Ejecutar

La aplicación está en la subcarpeta `sonar/` de este repositorio. Desde la carpeta que contiene este README:

```bash
cd sonar
npm install
npm run api
```

En otra terminal, desde la misma carpeta de la aplicación:

```bash
npm run dev
```

JSON Server utiliza el puerto 3001. Abre la dirección que muestre Vite. La versión instalada de Vite requiere Node.js `^20.19.0 || >=22.12.0`.

## Tecnologías

React 19, Vite 8, Tailwind CSS 4, CSS propio, Framer Motion, Lucide, Blobatar y JSON Server. React Router DOM está instalado y envuelve la aplicación; la selección de páginas sigue en un router propio basado principalmente en hash.

Las pruebas usan Vitest, Testing Library y jsdom; no Jest.

```bash
npm test
npm run build
npm run lint
```

## Funcionalidades

- Búsqueda musical y preescucha mediante Deezer.
- Registro, inicio de sesión y persistencia local de sesión.
- Perfiles, favoritos e interacciones comunitarias.
- Publicación de reseñas pendientes de moderación.
- Administración de usuarios, reportes, sanciones y decisiones sobre reseñas.
- Métricas calculadas, actividad semanal y exportación CSV.
- Opiniones generales por coincidencias de texto entre usuarios distintos.

## Estado y límites

JSON Server conserva usuarios y reseñas en `db.json`. Parte de las interacciones utiliza `localStorage`. La autorización actual se aplica en el cliente; no constituye autorización del backend.

El análisis de IA es simulado. Las opiniones generales utilizan reglas de coincidencia de texto, sin un modelo de IA.

Existe un workflow n8n de recuperación por correo. El envío real depende de una instancia y credenciales configuradas; el cliente incluye una respuesta simulada ante fallos. La expiración y uso único del código siguen pendientes.

La integración Deezer usa el proxy de desarrollo de Vite. Un despliegue necesita configurar un proxy equivalente.

## Documentación

- [Índice y mapa del proyecto](sonar/Docs/README.md)
- [Requisitos y auditoría](sonar/Docs/requerimientos.md)
- [Flujo administrativo](sonar/ADMIN-WORKFLOW.md)

La lista formal de integrantes, el anteproyecto y los mockups requieren completar o localizar sus entregables.
