# Consola de administración y moderación

## Dashboard

[AdminDashboardPage](../src/pages/admin/admin-dashboard-page.jsx) muestra una cola prioritaria, estado de moderación, actividad semanal, eventos recientes, usuarios y archivo de reseñas.

[admin-data.js](../src/shared/services/admin-data.js) calcula usuarios, reseñas, pendientes, aprobadas, rechazadas, marcadas, altas recientes, reportes pendientes y usuarios sancionados a partir de los registros cargados.

El gráfico semanal utiliza React y CSS, sin Recharts ni Chart.js. Cuenta reseñas, altas, reportes y decisiones por día; excluye eventos futuros y registros sin fecha válida.

El gráfico ocupa la columna principal. La actividad reciente tiene desplazamiento interno para limitar su altura. Actualizar vuelve a consultar los datos; no hay garantía de sincronización continua con otros clientes.

## Moderación

En `#moderacion` se revisan reseñas pendientes. Aprobar y rechazar actualizan el estado; el rechazo solicita confirmación. Las decisiones quedan en `moderationHistory`.

La acción etiquetada como IA usa un diccionario local de palabras, no un modelo externo. Puede marcar contenido para revisión humana, pero no aprueba ni rechaza automáticamente.

El archivo `#admin-reviews` permite revisar estados y enlaces a reseñas concretas.

## Opiniones generales

[CommunityOpinions](../src/features/admin/moderation/components/community-opinions.jsx) muestra grupos calculados por [community-opinions.js](../src/shared/services/community-opinions.js):

- Usa reseñas aprobadas o pendientes con autor, álbum y texto.
- Agrupa únicamente dentro del mismo álbum.
- Exige al menos dos usuarios distintos; varias reseñas de una persona no bastan.
- Normaliza texto y compara coincidencias exactas o conjuntos de palabras con reglas conservadoras.
- Muestra una opinión representativa, número de usuarios y comentarios originales desplegables.
- Incluye estados de carga, error y ausencia de coincidencias.

No es un resumen generativo ni una medición fiable de consenso o sentimiento. Las reglas no comprenden todos los matices del lenguaje.

## Reportes y usuarios

`#admin-reports` permite filtrar reportes, abrir el usuario, enviar a moderación y resolver. Se retiró el botón redundante «Ver contenido».

`#usuarios` ofrece filtros, perfil administrativo, historial, indicador de conducta y sanciones. Silenciar, suspender, banear o retirar sanciones requiere motivo y confirmación. Las sanciones temporales se evalúan según su vencimiento.

SONAR Intelligence muestra datos preparados para una futura integración; no calcula un riesgo real.

## Persistencia y alcance

Los reportes y sanciones pertenecen al usuario; las decisiones de moderación pertenecen a la reseña. Resolver no elimina el historial. Las restricciones se aplican desde el cliente y requieren autorización de servidor para ser seguras frente a llamadas directas.

Consulta [el flujo de comprobación](../ADMIN-WORKFLOW.md).
