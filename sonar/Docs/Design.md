# Diseño de SONAR

Guía de la implementación actual, actualizada el 24 de septiembre de 2026. Reemplaza la especificación inicial que contenía cifras y prestaciones de ejemplo. No constituye una validación de contraste ni un juego de mockups.

## Identidad visual

La interfaz utiliza una estética editorial musical: portadas, referencias al vinilo, títulos destacados y tarjetas para reseñas. La administración prioriza lectura, estados y decisiones.

| Rol | Valores utilizados |
| --- | --- |
| Fondo claro | #FFF7FA, #FFFFFF |
| Fondo oscuro | #231123; paneles administrativos #24202A |
| Superficie de marca | #4B2840 |
| Acento ciruela | #5C1D5E |
| Alertas | #B80C09 |
| Acento secundario | #003844 |
| Texto oscuro | #231123 |
| Texto sobre fondo oscuro | #DCDCDD, #F5EDF3 |
| Bordes claros | #E6D5E2 |

Los tokens generales están en [index.css](../src/Styles/index.css). La consola tiene ajustes propios en [admin.css](../src/Styles/admin.css), [admin-dashboard.css](../src/Styles/admin-dashboard.css) y [admin-moderation.css](../src/Styles/admin-moderation.css).

## Componentes y uso

- Mantener etiquetas visibles para estados: pendiente, aprobada, rechazada, sancionada o resuelta.
- Usar iconos como apoyo del texto, no como único significado.
- Mantener las acciones de consulta agrupadas y destacar la decisión principal.
- Los reportes tienen «Ver usuario», «Enviar a moderación» y «Resolver reporte».
- Las opiniones generales presentan la evidencia mediante comentarios desplegables.
- Las métricas de la consola proceden de datos; no reutilizar cifras decorativas del diseño inicial como resultados reales.

El [logo](../public/logo-sonar.svg) y el [favicon](../public/favicon.svg) están en public. Los componentes usan tipografía sans serif y acentos serif en elementos editoriales; revisar las reglas de cada zona antes de cambiar fuentes.

## Temas y adaptación

ThemeProvider cambia las clases dark/light y conserva la selección. Los estilos incluyen breakpoints y reglas de movimiento reducido. Esto no acredita por sí solo accesibilidad completa.

La revisión pendiente debe cubrir 375, 768 y 1280 px o más, zoom, foco, teclado, contraste y etiquetas de controles. El componente Input compartido requiere revisar la asociación entre label e input.

## Entregables pendientes

No se localizaron entregables independientes de mockups de escritorio y móvil ni un anteproyecto completo. Esta guía aporta paleta, recursos y criterios, pero queda pendiente completar el libro de marca y verificar su aplicación.
