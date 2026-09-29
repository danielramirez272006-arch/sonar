# Flujo administrativo de SONAR

## Funciones disponibles

- Dashboard con métricas calculadas, actividad reciente y gráfico semanal.
- Gestión de usuarios con filtros, perfil, reportes e historial de sanciones.
- Cola de reseñas, confirmación de rechazo y registro de decisiones.
- Reportes con acceso al usuario, envío a moderación y resolución.
- Opiniones generales con comentarios similares de al menos dos usuarios del mismo álbum.
- Exportación CSV y actualización manual de datos.

El análisis etiquetado como IA sigue siendo una simulación local. SONAR Intelligence prepara información para una integración futura.

## Persistencia

Las colecciones principales son /users y /reviews.

Los reportes están en users[].conductReports: identificador, responsable del reporte, contenido, motivo, fecha y estado. Los estados son pending, reviewed y resolved; dismissed se presenta como resuelto para compatibilidad. El indicador de conducta sigue contando los no descartados, incluidos reportes resueltos.

Las sanciones están en users[].sanctions; conservan motivo, administrador, fechas y retirada. El estado efectivo usa mutedUntil, suspendedUntil y status. No se permite sancionar cuentas administradoras desde este flujo.

Las reseñas nuevas se guardan como pending_moderation y las decisiones se anexan a moderationHistory. Comunidad incluye reseñas aprobadas de la API y tarjetas de ejemplo.

Los eventos sin fecha válida no se inventan para el gráfico semanal. Las coincidencias de opiniones excluyen reseñas rechazadas y cuentan usuarios distintos.

## Comprobación manual pendiente

1. Iniciar npm run api y npm run dev desde la carpeta de la aplicación.
2. Publicar una reseña con una cuenta activa y comprobar su registro pendiente.
3. Entrar como administrador; aprobar o rechazar y revisar el historial.
4. Reportar una reseña real desde otra cuenta; localizar el reporte en #admin-reports.
5. Enviar a moderación o resolver y verificar la persistencia tras recargar.
6. Revisar y confirmar una sanción; retirarla y comprobar su historial.
7. Comparar métricas y gráfico con los registros de usuarios y reseñas.
8. Probar opiniones similares de dos usuarios del mismo álbum y abrir sus comentarios.
9. Comprobar errores de red, teclado, zoom y tamaños de 375, 768 y 1280 px o más.

Estos pasos describen qué verificar; no son un registro de pruebas manuales ya realizadas.

## Límites

La autorización se aplica en el cliente. JSON Server requiere una capa de autorización para impedir llamadas directas no autorizadas. Algunas actualizaciones de usuarios tienen fallback local y pueden aparentar éxito si falla el servidor.

La última ejecución de pruebas registrada en la sesión pasó 90 pruebas en 17 archivos. No acredita servicios externos ni cobertura visual completa.

Consulta [requisitos](Docs/requerimientos.md) y [documentación técnica](Docs/README.md).
