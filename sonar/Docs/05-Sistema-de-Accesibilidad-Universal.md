# Sistema de Accesibilidad Universal (WCAG 2.1 AA/AAA) — SONAR

SONAR implementa un sistema integral de accesibilidad diseñado para garantizar una experiencia inclusiva a usuarios con diversas necesidades visuales, auditivas, motoras y cognitivas.

---

## 1. Módulos y Capacidades del Sistema

### 1.1 Alto Contraste y Modos de Visualización
- **Modo Alto Contraste (WCAG AAA)**: Relación de contraste superior a 7:1 en todos los textos interactivos y elementos de fondo.
- **Modo Oscuro / Modo Claro**: Alternancia fluida y persistente mediante [theme-context.jsx](../src/shared/context/theme-context.jsx).
- **Filtros SVG para Daltonismo ([color-blindness-filters.jsx](../src/shared/components/a11y/color-blindness-filters.jsx))**:
  - `Protanopía`: Matriz adaptada para deficiencia de tonos rojos.
  - `Deuteranopía`: Matriz adaptada para deficiencia de tonos verdes.
  - `Tritanopía`: Matriz adaptada para deficiencia de tonos azules.
  - `Acromatopsia`: Modo monocromático de alta escala de grises.

### 1.2 Tipografía y Legibilidad Dinámica
- **Escala de Fuentes**: Multiplicadores de texto configurables (Normal: 100%, Grande: 115%, Extra Grande: 130%) mediante variables CSS dinámicas `--a11y-font-scale`.
- **Tipografía OpenDyslexic**: Modo de fuente especialmente diseñado para reducir la fatiga visual y facilitar la lectura en personas con dislexia.
- **Espaciado Mejorado**: Opción de interlineado y separación de caracteres expandida.

### 1.3 Lectura por Voz (Text-to-Speech)
- **Integración Nativa**: Uso de `window.speechSynthesis` gestionado en [accessibility-context.jsx](../src/shared/context/accessibility-context.jsx).
- **Botón «🔊 Escuchar» ([tts-button.jsx](../src/shared/components/a11y/tts-button.jsx))**: Presente en reseñas del feed, análisis de IA de letras y ensayos editoriales.
- **Control de Reproducción**: Permite pausar, detener y regular el ritmo de lectura.

### 1.4 Navegación por Teclado y Ayudas Motoras
- **Skip to Content ([skip-to-content.jsx](../src/shared/components/a11y/skip-to-content.jsx))**: Enlace de salto rápido accesible con <kbd>Tab</kbd> para omitir la navegación inicial.
- **Atajos de Teclado Globales ([keyboard-shortcuts-modal.jsx](../src/shared/components/a11y/keyboard-shortcuts-modal.jsx))**:
  - <kbd>Alt + A</kbd>: Abrir panel de accesibilidad.
  - <kbd>?</kbd> / <kbd>Shift + /</kbd>: Abrir guía de atajos de teclado.
  - <kbd>Espacio</kbd> / <kbd>K</kbd>: Reproducir / Pausar audio.
  - <kbd>M</kbd>: Silenciar / Reactivar audio.
  - <kbd>Esc</kbd>: Cerrar modales activos.
- **Cursor Grande y Reducción de Animaciones**: Modos para personas con dificultades motrices o sensibilidad al movimiento.

---

## 2. Pestaña Lateral de Acceso Rápido

El widget de accesibilidad se ubica en una pestaña lateral izquierda discreta ([accessibility-widget.jsx](../src/shared/components/a11y/accessibility-widget.jsx)) con posición `top-1/2 left-0`, garantizando que nunca interfiera ni colisione con el reproductor de audio inferior ni con la barra de navegación superior.
