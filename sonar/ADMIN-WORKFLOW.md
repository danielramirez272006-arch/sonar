# Ampliación administrativa de SONAR

- [x] Perfil administrativo con avatar, rol, estado, fechas y contadores reales.
- [x] Reportes en `#admin-reports`, filtros y acceso a usuario/contenido/moderación.
- [x] Silenciar, suspender, banear y retirar sanciones con motivo y confirmación.
- [x] Historial persistente de sanciones, responsable, duración y retiradas.
- [x] Actividad reciente a partir de usuarios, reseñas, reportes y decisiones.
- [x] Gráfico de siete días: reseñas, usuarios, reportes y moderaciones.
- [x] KPI calculados: pendientes, marcados, altas, reportes y sancionados.
- [x] Gestión de usuarios con búsqueda, filtros por estado/rol y tabla compacta.
- [x] SONAR Intelligence preparado; sin decisiones automáticas ni riesgo inventado.
- [x] Hero compacto, estados vacíos, errores, contraste y adaptación móvil.
- [x] Publicación real en API, reporte de reseñas y registro de moderaciones.

## Persistencia y compatibilidad

Se mantienen las colecciones existentes `/users` y `/reviews`, sin migración destructiva.
Los reportes anteriores `users[].conductReports` se reutilizan. Cada reporte nuevo añade
`reporterId`, `reporterName`, `contentType`, `contentId`, `contentSnapshot`, `createdAt` y `status`.
Los estados son `pending`, `reviewed`, `resolved`; el estado anterior `dismissed` se
conserva en el historial y se muestra como resuelto en la sección de reportes.
El indicador de conducta sigue contando los reportes no descartados.

Las sanciones están en `users[].sanctions`. Se conservan motivo, tipo, fecha, duración,
administrador, vencimiento y retirada. Los estados efectivos usan `mutedUntil`,
`suspendedUntil` y `status`; las sanciones temporales vencidas se consideran inactivas.
Las cuentas administradoras no se pueden sancionar desde estas acciones.

Las nuevas reseñas se guardan como pendientes con `createdAt`; las decisiones se
anexan a `reviews[].moderationHistory`. La comunidad muestra reseñas aprobadas
persistidas y conserva las tarjetas editoriales de ejemplo. Estas últimas, sin un
usuario real identificado, no permiten generar reportes.

Los datos antiguos sin fecha se mantienen y cuentan en los totales, pero no en las
estadísticas de siete días. Las fechas no se deducen ni se rellenan artificialmente.
`admin-data.js` expone `behaviorInput` como contrato de entrada para una futura IA:
reportes, sanciones, publicaciones recientes, contenido marcado y reseñas rechazadas.

## Comprobación manual

1. Ejecutar `npm run api` y `npm run dev` en terminales distintas.
2. Publicar una reseña desde el portal con una cuenta activa; abrir moderación como admin.
3. Aprobarla y encontrarla en Comunidad; reportarla desde una cuenta de usuario.
4. Abrir Reportes, consultar el contenido y enviar a moderación.
5. Abrir el perfil; seleccionar una sanción, duración y motivo. Revisar y confirmar.
6. Comprobar el historial, indicador, KPI y actividad; retirar la sanción y recargar.
7. Revisar filtros, búsquedas, navegación por teclado y tamaños de pantalla.

El proyecto sigue usando JSON Server y autenticación de demostración. Los controles
actuales se aplican en el cliente; un backend con autorización es necesario para
hacer cumplir estas restricciones frente a llamadas directas a la API en producción.
