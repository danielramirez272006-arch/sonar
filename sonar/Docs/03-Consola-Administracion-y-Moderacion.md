# 🛡️ 03. Consola de Administración y Moderación

Este documento detalla las herramientas operativas para administradores y curadores de contenido en **SONAR • CONSOLE**.

---

## 1. ◫ Dashboard Administrativo (`AdminDashboardPage`)
**Ruta:** `/#dashboard`, `/#admin`  
**Archivo:** [`sonar/src/pages/admin/admin-dashboard-page.jsx`](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/src/pages/admin/admin-dashboard-page.jsx)

### Componentes Principales:
1. **Tarjetas de Métricas KPI (`KpiCards`)**:
   - Reseñas totales registradas en la plataforma.
   - Reseñas pendientes de revisión humana.
   - Reseñas aprobadas y rechazadas con porcentajes.
   - Reseñas marcadas automáticamente por el motor de IA.
2. **Banner de Acción Rápida**:
   - Notificación visual con contador en tiempo real de reseñas que requieren atención inmediata y acceso directo a la cola.
3. **Mesa de Trabajo**:
   - **Descarga CSV (`exportCsv`)**: Exporta el conjunto completo de reseñas en formato CSV compatible con hojas de cálculo y sanitizado contra inyecciones de fórmulas.
   - **Botón de Actualización (`refresh`)**: Sincroniza métricas y reseñas con la base de datos sin recargar la página.
4. **Distribución de Calificaciones**:
   - Gráfico de barras horizontales (1 a 5 estrellas) con contador y porcentaje relativo.
5. **Feed de Actividad Reciente (`RecentActivityFeed`)**:
   - Muestra las últimas acciones registradas (publicaciones, reportes de usuarios y alertas de IA) con estado en vivo.
6. **Guía Editorial (`EditorialGuide`)**:
   - Recordatorio de los 3 pilares de curaduría: Criterio musical, foco en escucha física y respeto mutuo.

---

## 2. ≋ Centro de Moderación de Reseñas (`ModerationPage`)
**Ruta:** `/#moderacion`  
**Archivo:** [`sonar/src/pages/admin/moderation-page.jsx`](file:///c:/Users/MAURICIO/OneDrive/Documentos/sonar/sonar/src/pages/admin/moderation-page.jsx)

### Flujo de Trabajo del Curador:
1. **Tabla de Moderación (`ModerationTable`)**:
   - Lista todas las reseñas con avatar del usuario, álbum referenciado, calificación y texto de la reseña.
   - Identificadores de estado: *Pendiente*, *Aprobada*, *Rechazada* y *Marcada por IA*.
2. **Acciones Disponibles por Reseña**:
   - **✓ Aprobar (`approveReview`)**: Cambia el estado a `approved` y la hace visible en el portal público.
   - **✕ Rechazar (`rejectReview`)**: Cambia el estado a `rejected` y la retira de la circulación pública.
   - **⚡ Analizar con IA (`analyzeReview`)**: Ejecuta el motor algorítmico local para detectar palabras de la lista ofensiva y marcarla para revisión humana si corresponde.
3. **Bloqueo contra Concurrencia (`actionLock`)**:
   - El estado de la aplicación previene envíos duplicados mientras una acción asíncrona se encuentra en proceso.
