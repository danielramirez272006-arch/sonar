Diseña una suite administrativa web en formato desktop (1440px) para "SONAR", una plataforma audiófila de diario y crítica musical con estética editorial de vinilo.

### Paleta de Colores y Estilo Visual
- Fondo general: Blanco roto / marfil suave (#FFF7FA a #FFFFFF).
- Color primario y tipografía de acento: Violeta profundo / ciruela (#5C1D5E y #231123).
- Colores de alerta y soporte: Brick Ember (#B80C09) y Dark Teal (#003844).
- Superficies y bordes: Tarjetas con esquinas redondeadas (rounded-xl), bordes tenues lila (#F0D1EB) y sombras sutiles.
- Tipografía: Inter, sans-serif limpia con títulos densos y etiquetas en mayúsculas pequeñas con espaciado amplio.

### Header Global
- Logo superior izquierdo: Isotipo de roseta/radar sónico en cuadrantes con punto rojo central, seguido del nombre "SONAR • CONSOLE" de tamaño destacado y subtítulo "AUDIOPHILE CURATION HUB".
- Navegación: Enlaces horizontales (Dashboard, Descubrir, Álbumes, Listas, Reseñas, Comunidad) con badge activo en "Moderación (38)".
- Buscador central: Input con placeholder "Buscar catálogo..." y shortcut "⌘K".
- Botón CTA derecho: "+ Registrar Disco" en botón sólido violeta con esquinas redondeadas.

### Pantalla 1: Dashboard Administrativo
1. Cabecera de Página:
   - Breadcrumb: Administración / Centro de Control / Dashboard.
   - Título "Dashboard Administrativo" con bajada editorial.
   - Tarjeta de perfil de administrador a la derecha: avatar circular, nombre "Mateo Valenzuela", badge "LEAD CURATOR" y estado "En servicio activo".
2. Métricas Clave (Grid de 6 tarjetas superiores con iconos y microetiquetas):
   - Usuarios Totales: 48,290 (+12.4%).
   - Reseñas Acumuladas: 142,850 (+842 en 24h).
   - Pendientes: 38 con badge rojo "URGENTE" y enlace "Moderar ahora →".
   - Aprobadas: 138,420 (96.9%).
   - Rechazadas: 2,840 (1.98%).
   - Marcadas por IA: 152 con alerta roja.
3. Banner de Acción Rápida:
   - Caja de aviso con borde suave para atender 38 reseñas pendientes, con botón primario "Ir a Cola de Moderación (38)" y botón secundario "Ver Registros de Auditoría".
4. Layout Principal a 2 Columnas:
   - Columna izquierda (Actividad Reciente): Filtros píldora (Todas, Nuevas, Aprobadas, Rechazadas, Marcadas). Tarjetas individuales de reseñas con avatar, metadatos, calificación en estrellas, citas textuales entrecomilladas y botones de acción (Examinar, Aprobar, Rechazar y Suspender).
   - Columna derecha (Métricas y Reglas):
     * Distribución de Calificaciones (barras horizontales de 1 a 5 estrellas) y tiempo de respuesta (14 min).
     * Módulo de Filtros de IA Activos (Toxicidad 99.4%, Contenido sintético, Oyente verificado).
     * Enlaces al Manual Curatorial y descarga de CSV.

### Pantalla 2: Moderación de Reseñas
1. Header de Sección:
   - Título "Moderación de Reseñas", contador "38 reseñas en cola activa" con indicador verde pulsante y botón "Actualizar cola".
   - Barra de filtros: Tabs (Todas 38, Marcadas por IA 12, Reportadas 6) y buscador por crítico o álbum.
2. Feed de Moderación (Tarjetas editoriales de reseñas):
   - Cabecera de tarjeta: Avatar, usuario, badge de rol (Oyente Verificado, Crítico de Club, Colaboradora), IP/dispositivo y etiqueta de alerta (Alerta de Coherencia, Pendiente, Lenguaje Inadecuado, Spoilers).
   - Miniatura de Álbum: Carátula de vinilo con disco físico asomándose de la funda (Vespertine de Björk, Kid A de Radiohead, To Pimp a Butterfly de Kendrick Lamar, MOTOMAMI de Rosalía), estrellas de calificación y especificación técnica de la edición física (ej. "Vinilo 180g Pressing Direct Metal Mastering").
   - Texto de la reseña: Crítica musical en cursiva con terminología audiófila.
   - Caja de Auditoría IA: Recuadro temático con el veredicto del modelo (porcentaje de similitud, citas omitidas, detección de lenguaje o verificación de spoilers).
   - Barra de Acciones: Botón primario "Aprobar Reseña", botón secundario "Rechazar" y botón terciario con icono de chispa "Revisar con IA".
3. Barra Lateral Derecha:
   - Panel de estado "MOTOR IA SONAR" con precisión (99.4%), latencia (180ms) y gráfico de línea de rendimiento diario.
   - Caja de "Criterios Editoriales SONAR" (Foco en escucha física, Autoría original, Pasión y respeto).
   - Módulo para desarrolladores para alternar estados (Error, Empty State).
4. Player Inferior Persistente:
   - Barra horizontal de preescucha analógica: título del track ("Vespertine — Cocoon"), master 24-bit/96kHz, barra de progreso con tiempos y botón de reproducción.

### Footer
- Bloque con isotipo y descripción de marca SONAR.
- Columnas de navegación: Catálogo, Comunidad y Plataforma.
- Copyright legal "© 2025 SONAR Inc. Registrado con devoción sonora" con sello "EDICIÓN AUDIÓFILA".