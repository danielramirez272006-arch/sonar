# Arquitectura y enrutamiento

## Organización

El código se organiza por dominio en `src/features/`, por vistas en `src/pages/` y por recursos reutilizables en `src/shared/`. Esta organización equivale a separar componentes, páginas, servicios y contextos sin exigir carpetas llamadas literalmente Components o Services.

[main.jsx](../src/main.jsx) monta React con AuthProvider y ThemeProvider. [App.jsx](../src/App.jsx) contiene la consola administrativa y la composición general de la aplicación.

## Rutas

[AppRouter](../src/shared/routing/app-router.jsx) selecciona las páginas mediante el hash y escucha `hashchange` y `popstate`. También lee el pathname cuando no hay hash.

React Router DOM está instalado y `BrowserRouter` envuelve la aplicación, pero no sustituye el selector propio por una configuración completa de `Routes` y `Route`. No debe darse por cumplida toda la sección académica de React Router solo por tener la dependencia.

[PrivateRoute](../src/shared/routing/private-route.jsx) exige sesión. [AdminRoute](../src/shared/routing/admin-route.jsx) exige además `role === 'admin'`. Las rutas protegidas muestran el login como alternativa cuando no se cumplen estas condiciones.

La consola admite parámetros como `#usuarios?user=ID`, `#admin-reports?report=ID` y `#admin-reviews?review=ID`. Las páginas desconocidas muestran NotFoundPage.

## Estado y persistencia

- [AuthContext](../src/shared/context/auth-context.jsx): usuario, registro, login y logout; sesión en `sonar_auth_user` de localStorage.
- [ThemeContext](../src/shared/context/theme-context.jsx): preferencia del sistema o selección guardada en `theme` y `sonar-theme`; aplica `dark` o `light` al HTML.
- [PlayerContext](../src/shared/context/player-context.jsx): reproducción y apertura del formulario de reseñas.
- Los hooks de administración consultan usuarios, reseñas y pendientes a través de servicios.

## Límites de autorización

La sesión y el rol se leen del navegador. JSON Server no implementa autorización de servidor: proteger una ruta no impide modificar datos mediante llamadas directas a la API. Tampoco existe garantía de validación de sesión remota tras recargar.

El cliente de usuarios tiene alternativas locales ante errores de red. Registro y actualización pueden devolver un resultado local aunque el servidor no haya persistido la operación.
