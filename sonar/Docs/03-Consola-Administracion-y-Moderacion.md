# Consola de Administración y Moderación — SONAR

## 1. Dashboard Administrativo y Métricas en Tiempo Real

El panel [AdminDashboardPage](../src/pages/admin/admin-dashboard-page.jsx) ofrece analítica clave del sistema:
- **Métricas Clave**: Usuarios totales registrados, reseñas totales publicadas y reseñas pendientes de revisión.
- **Gráfico de Actividad Semanal**: Visualización por barras diarias de reseñas, nuevos usuarios, reportes y decisiones de moderación de los últimos 7 días.
- **Cola Prioritaria**: Listado de elementos que requieren atención inmediata con atajos a la moderación.

---

## 2. Flujo de Moderación de Contenido

En [ModerationPage](../src/pages/admin/moderation-page.jsx):
- **Aprobación y Rechazo**: Aprobación directa o rechazo con solicitud de motivo y confirmación modal.
- **Historial de Decisiones**: Registro inmutable de cada veredicto (`status: approved | rejected | pending_moderation`).
- **Archivo Editorial**: Filtros avanzados por estado, autor, fecha y calificación.

---

## 3. Módulo de Opiniones Coincidentes de la Comunidad

El componente [CommunityOpinions](../src/features/admin/moderation/components/community-opinions.jsx) procesa reseñas mediante [community-opinions.js](../src/shared/services/community-opinions.js):
- Agrupa reseñas que comparten apreciaciones técnicas o valoraciones similares sobre un mismo álbum.
- Requiere al menos dos usuarios distintos para consolidar una coincidencia comunitaria.
- Muestra tarjeta representativa, número de críticos coincidentes y citas originales desplegables.

---

## 4. Gestión de Usuarios, Conducta y Sanciones

En [AdminUsersPage](../src/pages/admin/admin-users-page.jsx):
- **Indicador Visual de Conducta**: Carita semafórica calculada en base al historial de reportes (Verde = Ejemplar, Amarillo = Advertencia, Naranja = Riesgo, Rojo = Sanción Crítica).
- **Acciones de Sanción**:
  - Silenciar usuario temporalmente.
  - Suspender cuenta por tiempo determinado.
  - Expulsión / Baneo definitivo.
  - Retiro de sanciones con registro de auditoría.
- **Gestión de Reportes ([AdminReportsPage](../src/pages/admin/admin-reports-page.jsx))**: Clasificación por motivos (Lenguaje inapropiado, Spam, Odio, Spoilers sin marcar) con resolución auditada.
