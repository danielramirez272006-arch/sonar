# 🎵 SONAR · Audiophile Curation Hub & Music Community

<p align="center">
  <img src="https://raw.githubusercontent.com/danielramirez272006-arch/sonar/daniel/sonar/public/favicon.svg" alt="SONAR Logo" width="80" height="80" />
</p>

<p align="center">
  <strong>Plataforma comunitaria de crítica musical, preescucha en alta fidelidad y ecosistema interactivo para melómanos.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Vitest-130%20Tests%20Passing-4EBA0F?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest Passing" />
  <img src="https://img.shields.io/badge/n8n-Webhooks%20Active-EA4B71?style=for-the-badge&logo=n8n&logoColor=white" alt="n8n Webhooks" />
</p>

---

## 🎨 Paleta Cromática Oficial de Diseño

SONAR está diseñado siguiendo una cuidada selección cromática con altos ratios de contraste y cumplimiento estricto de normas de accesibilidad:

| Muestra | Código Hex | Nombre | Uso en la Interfaz |
| :--- | :--- | :--- | :--- |
| <span style="display:inline-block;width:20px;height:20px;background:#231123;border-radius:4px;border:1px solid #555;"></span> | **`#231123`** | *Midnight Violet* | **Color de fondo base**: Lienzo principal oscuro sobre el que interactúa el usuario (`sonar-base`). |
| <span style="display:inline-block;width:20px;height:20px;background:#4B2840;border-radius:4px;border:1px solid #555;"></span> | **`#4B2840`** | *Blackberry Cream* | **Color de superficie**: Tarjetas, paneles modales y separación visual de reseñas (`sonar-surface`). |
| <span style="display:inline-block;width:20px;height:20px;background:#DCDCDD;border-radius:4px;border:1px solid #555;"></span> | **`#DCDCDD`** | *Alabaster Grey* | **Color de texto principal**: Garantiza legibilidad perfecta y contraste sobre fondos oscuros (`sonar-text`). |
| <span style="display:inline-block;width:20px;height:20px;background:#003844;border-radius:4px;border:1px solid #555;"></span> | **`#003844`** | *Dark Teal* | **Color primario (acento)**: Botones de acción, bordes activos de Modo Libre y elementos interactivos (`sonar-accent`). |
| <span style="display:inline-block;width:20px;height:20px;background:#B80C09;border-radius:4px;border:1px solid #555;"></span> | **`#B80C09`** | *Brick Ember* | **Color de alerta/moderación**: Acciones críticas, Modo Supervisado, estados del sistema y acento de marca (`sonar-primary`). |

---

## 🚀 Inicio Rápido

### Prerrequisitos
- **Node.js**: `^20.19.0 || >=22.12.0`
- **npm**: `>=10.x`

### 1. Clonar el repositorio
```bash
git clone https://github.com/danielramirez272006-arch/sonar.git
cd sonar/sonar
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar la API Mock (JSON Server)
En una terminal:
```bash
npm run api
```
> Corre en `http://localhost:3001/` proveyendo persistencia para usuarios, reseñas, reportes y catálogos.

### 4. Iniciar el Servidor de Desarrollo (Vite Frontend)
En una segunda terminal:
```bash
npm run dev
```
> Abre la URL local generada por Vite (por defecto `http://localhost:5173/`).

### 5. Iniciar n8n (Opcional para Webhooks y Automatizaciones)
```bash
n8n start
```
> Panel accesible en `http://localhost:5678/`. Los flujos de registro OTP, alertas de login, newsletter y recuperación se encuentran en `sonar/n8n/`.

---

## ✨ Características Principales

### 🎧 Reproductor Global Hi-Fi con Motor de Síntesis Web Audio
- **Audio Infalible**: Si los flujos remotos de Deezer presentan restricciones de red o CORS en el navegador del cliente, el motor Web Audio API sintetiza armonías sonoras en tiempo real, garantizando que el reproductor siempre funcione.
- **Letras Sincronizadas**: Integración de letras para catálogo audiófilo y temas infantiles.
- **Skins Dinámicos Equipables**:
  - *Skin VU Meter*: Vúmetros analógicos con agujas balísticas reactivas al ritmo sonoro.
  - *Skin Casete 1984*: Bobinas analógicas giratorias y contador mecánico en tiempo real.

### 🛡️ Control Parental & Modos de Experiencia
- **Modo Kids (Recomendado para Niños)**:
  - Filtro estricto 100% familiar (bloqueo de lenguaje explícito, temas sensibles y artistas bloqueados).
  - Temporizador de estudio Pomodoro adaptado para tareas.
  - Trivia educativa musical interactiva y generador de sonidos relajantes de la naturaleza (lluvia, olas, bosque).
- **Modo Supervisado Familiar**:
  - Desbloqueo temporal de pistas explícitas mediante código PIN secreto de 4 dígitos.
- **Modo Libre (Adultos & Audiófilos)**:
  - Navegación y escucha sin restricciones por todo el catálogo discográfico.

### 🎁 Boutique & Sistema de Recompensas
- **Saldo Sonar Coins & Niveles XP**: Gana monedas escuchando música, publicando reseñas y completando misiones diarias.
- **Caja Sorpresa Diaria (Daily Crate Drop)**: Abre una caja cada 24 horas para recibir multiplicadores de monedas y experiencia.
- **Marcos Cosméticos de Avatar**: Marcos visuales con animaciones reactivas (*Vinilo de Oro 24K, Neón Cyberpunk, Válvula Hi-Fi, Holograma Espectral*).
- **Títulos de Prestigio**: Luce distinciones como *«Oído Absoluto»* y *«Maestro del Mastering»*.

### 🌐 Automatizaciones con n8n
- **Verificación OTP de Registro**: Envío de código de 6 dígitos al correo electrónico del nuevo usuario.
- **Alerta de Inicio de Sesión**: Detección de nuevos dispositivos y notificación inmediata.
- **Recuperación de Contraseña**: Flujo de validación OTP para restablecer credenciales.
- **Boletín Editorial (Newsletter)**: Suscripción automática a tópicos personalizados (Lanzamientos, Vinilos, Hardware Hi-Fi).

### 🛠️ Consola de Administración & Moderación
- **Dashboard de Métricas**: Estadísticas de actividad comunitaria, reseñas pendientes y usuarios activos.
- **Moderación Inteligente**: Clasificación y análisis asistido por IA de contenido ofensivo.
- **Gestión de Sanciones**: Notificaciones, advertencias y suspensiones con confirmación y auditoría.
- **Exportación de Datos**: Descarga de registros y reportes en formato CSV.

### ♿ Accesibilidad Universal (WCAG 2.1 AA/AAA)
- Selector de tamaños de fuente, espaciado e interlineado tipográfico.
- Modos de daltonismo (Protanopía, Deuteranopía, Tritanopía, Acromatopsia).
- Lector de pantalla TTS (*Text-to-Speech*) integrado con controles de voz y velocidad.
- Guía de lectura focalizada y mapa completo de atajos de teclado (`Ctrl+K`, `Alt+A`, etc.).

---

## 🧪 Pruebas Automatizadas

El proyecto cuenta con una cobertura integral de pruebas unitarias y de integración utilizando **Vitest** y **Testing Library**:

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo observador
npm run test:watch
```

**Estado actual:** `26 suites de prueba / 130 tests pasando (100% pass rate)`.

---

## 📁 Estructura del Proyecto

```text
sonar/
├── n8n/                               # Workflows y automatizaciones exportadas de n8n
│   ├── sonar-registro-verificacion-otp.json
│   ├── sonar-notificacion-inicio-sesion.json
│   ├── sonar-newsletter-suscripcion.json
│   └── sonar-recuperacion-password.json
├── sonar/
│   ├── src/
│   │   ├── features/                  # Módulos organizados por dominio
│   │   │   ├── admin/                 # Consola de administración y moderación
│   │   │   ├── auth/                  # Formularios de acceso y registro
│   │   │   ├── home/                  # Componentes de la portada y destacados
│   │   │   ├── profile/               # Perfil, Control Parental, Boutique y Recompensas
│   │   │   └── reviews/               # Feed, tarjetas y modales de reseñas
│   │   ├── pages/                     # Vistas públicas, privadas y administrativas
│   │   ├── shared/                    # Contextos, servicios, hooks y componentes comunes
│   │   │   ├── components/            # UI, navegación, reproductor y accesibilidad
│   │   │   ├── context/               # Auth, Player, Theme y Accessibility Providers
│   │   │   ├── routing/               # Router y protección de rutas
│   │   │   └── services/              # Deezer API, Webhooks n8n, IA y Almacenamiento
│   │   ├── Styles/                    # Tokens de diseño y hojas de estilo CSS
│   │   ├── App.jsx                    # Raíz con arquitectura ErrorBoundary
│   │   └── main.jsx                   # Punto de entrada de la aplicación
│   ├── tests/                         # Suites de pruebas con Vitest
│   ├── db.json                        # Base de datos simulada de JSON Server
│   └── package.json                   # Dependencias y scripts
└── README.md                          # Documentación principal del repositorio
```

---

## 📜 Scripts Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo Vite con HMR. |
| `npm run api` | Inicia el backend mock JSON Server en el puerto 3001. |
| `npm test` | Ejecuta la suite completa de 130 tests con Vitest. |
| `npm run build` | Compila los paquetes optimizados para producción. |
| `npm run lint` | Analiza el código fuente en busca de errores con ESLint. |

---

<p align="center">
  <strong>SONAR</strong> · Buen criterio. Mejor música. 🎧
</p>
