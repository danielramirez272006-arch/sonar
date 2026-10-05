# 🎵 SONAR · Audiophile Curation Hub & Music Community

<p align="center">
  <img src="https://raw.githubusercontent.com/danielramirez272006-arch/sonar/daniel/sonar/public/favicon.svg" alt="SONAR Logo" width="85" height="85" />
</p>

<p align="center">
  <strong>Plataforma comunitaria de crítica musical, preescucha en alta fidelidad y ecosistema interactivo para audiófilos con moderación IA y asistente sommelier.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Vitest-196%20Tests%20Passing-4EBA0F?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest 196 Passing" />
  <img src="https://img.shields.io/badge/i18n-6%20Languages-blue?style=for-the-badge&logo=google-translate&logoColor=white" alt="i18n 6 Languages" />
  <img src="https://img.shields.io/badge/n8n-Gemini%20Agent%20Active-EA4B71?style=for-the-badge&logo=n8n&logoColor=white" alt="n8n Gemini Agent" />
  <img src="https://img.shields.io/badge/Google%20Gemini-2.0%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
</p>

---

## 🎨 Paleta Cromática Oficial de Diseño

SONAR está diseñado siguiendo una cuidada selección cromática con altos ratios de contraste y cumplimiento estricto de normas de accesibilidad:

| Muestra | Código Hex | Nombre | Uso en la Interfaz |
| :--- | :--- | :--- | :--- |
| <span style="display:inline-block;width:20px;height:20px;background:#231123;border-radius:4px;border:1px solid #555;"></span> | **`#231123`** | *Midnight Violet* | **Color de fondo base**: Lienzo principal oscuro sobre el que interactúa el usuario (`sonar-base`). |
| <span style="display:inline-block;width:20px;height:20px;background:#4B2840;border-radius:4px;border:1px solid #555;"></span> | **`#4B2840`** | *Blackberry Cream* | **Color de superficie**: Tarjetas, paneles modales y separación visual de reseñas (`sonar-surface`). |
| <span style="display:inline-block;width:20px;height:20px;background:#DCDCDD;border-radius:4px;border:1px solid #555;"></span> | **`#DCDCDD`** | *Alabaster Grey* | **Color de texto principal**: Garantiza legibilidad perfecta y contraste sobre fondos oscuros (`sonar-text`). |
| <span style="display:inline-block;width:20px;height:20px;background:#003844;border-radius:4px;border:1px solid #555;"></span> | **`#003844`** | *Dark Teal* | **Color primario (acento)**: Botones de acción, bordes activos y elementos interactivos (`sonar-accent`). |
| <span style="display:inline-block;width:20px;height:20px;background:#B80C09;border-radius:4px;border:1px solid #555;"></span> | **`#B80C09`** | *Brick Ember* | **Color de alerta/moderación**: Acciones críticas, Modo Supervisado, estados del sistema y acento de marca (`sonar-primary`). |

---

## 🚀 Inicio Rápido

### Prerrequisitos
- **Node.js**: `^20.19.0 || >=22.12.0`
- **npm**: `>=10.x`
- **n8n**: `>=1.0.0` (Opcional, para el Agente Gemini y automatizaciones)

### 1. Clonar el repositorio
```bash
git clone https://github.com/danielramirez272006-arch/sonar.git
cd sonar/sonar
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar la API Mock (JSON Server & Backend de Seguridad)
En una primera terminal:
```bash
npm run api
```
> Corre en `http://localhost:3001/` proveyendo persistencia para usuarios, reseñas, recompensas, control de sesiones y catálogos.

### 4. Iniciar el Servidor de Desarrollo (Vite Frontend)
En una segunda terminal:
```bash
npm run dev
```
> Abre la URL local generada por Vite (por defecto `http://localhost:5173/`).

### 5. Iniciar n8n (Agente Moderador IA, Sommelier y Webhooks)
En una tercera terminal:
```bash
n8n start
```
> Panel accesible en `http://localhost:5678/`. Los flujos de n8n se encuentran en `sonar/src/shared/services/n8n/`.

---

## ✨ Características Principales

### 🤖 Sonaria · Sommelier Musical con Inteligencia Artificial
- Asistente conversacional inteligente impulsado por Google Gemini y n8n (`sonar-chatbot-asistente-musical.json`).
- Recomendaciones musicales contextuales según estados de ánimo, géneros y artistas de culto.
- Motor de contingencia local que garantiza respuestas analíticas incluso sin conexión a n8n.

### 🧠 Admin Hub IA · Co-piloto Estratégico Todo-en-Uno
- **Agente de IA Integrado**: Integración con Google Gemini + n8n (`sonar-admin-hub-agent.json`) para asistencia avanzada en vivo al administrador.
- **Triada de Capacidades**: Gestión de Catálogo (duplicados, géneros faltantes), Análisis de Usuarios (cuentas de riesgo, reportes pendientes) y Reportes Ejecutivos.
- **Soporte Multilingüe Auténtico**: Detecta la preferencia de idioma del administrador (`es`, `en`, `fr`, `it`, `zh`, `ja`) y genera respuestas, métricas, recomendaciones y *quickActions* en el idioma activo.
- **Modo Contingencia Offline**: Generador simulado multilingüe de alta calidad cuando n8n no está disponible.

### 🛡️ Moderación IA con Google Gemini & n8n
- **Análisis de Reseñas en Tiempo Real**: Conexión con Gemini 2.0 Flash para auditar contenido generado por usuarios.
- **Tolerancia Cero a la Toxicidad**: Detección de ataques personales, insultos, evasiones tipográficas y discurso de odio.
- **Auto-Flagging & Consola de Administración**: Las reseñas marcadas se etiquetan automáticamente con justificación analítica en la base de datos.
- **Notificaciones al Administrador**: Despacho de correos estilizados con resúmenes de moderación.

### 🎮 Sonar Kids & Trivia Musical Interactiva (600+ Preguntas)
- **Banco de más de 600 preguntas musicales** curadas con rigor histórico y técnico.
- **Modos de Juego**:
  - *Individual (Solo)*: Responde 16 preguntas contrarreloj con 15 segundos por turno. Consigue al menos 10 aciertos para ganar **100 Sonar Coins**.
  - *Duelo 1 contra 1*: Turnos dinámicos en el mismo dispositivo donde el Jugador 1 compite por el premio para su cuenta.
- **Persistencia Segura**: Reclamación respaldada por el endpoint `/trivia/reward` con validación de partida y prevención de duplicados.

### 🎧 Reproductor Hi-Fi & Modo Tocadiscos Vinilo 33⅓ RPM
- **Audio Infalible**: Flujos de preescucha remota y síntesis Web Audio API en contingencia.
- **Modo Tocadiscos Inmersivo**: Visualizador analógico de aguja, plato giratorio y texturas de vinilo.
- **Skins Dinámicos Equipables**: Vúmetros VU Meter y Casete analógico 1984.

### 🌐 Internacionalización Completa (6 Idiomas)
- Soporte nativo para:
  - 🇪🇸 **Español**
  - 🇺🇸 **English**
  - 🇫🇷 **Français**
  - 🇮🇹 **Italiano**
  - 🇯🇵 **日本語**
  - 🇨🇳 **中文**
- Selector de idioma dinámico en barra superior y pie de página con persistencia en `localStorage`.

### 📚 Secciones Editoriales y Legales de Sonar
- **Colecciones de Vinilo 180g (`#collections`)**: Guías técnicas de prensaje, gramajes (140g vs 180g), velocidades (33⅓ vs 45 RPM) y preservación antiestática.
- **Directorio de Sellos (`#labels`)**: Catálogo de casas discográficas de culto (Warp, 4AD, Blue Note, Ninja Tune).
- **Listas Curadas (`#lists`)**: Selecciones temáticas y obras maestras del Art Rock, Vanguardia y Ambient.
- **Pautas Editoriales & Código de Criterio (`#guidelines`)**: Escala oficial de 1.0 a 5.0 y directrices de redacción crítica.
- **Visión & Misión (`#about`)**: Manifiesto institucional y pilares de la curaduría audiófila.
- **Términos y Condiciones (`#terms`)**: Marco legal, uso de IA y política de propiedad intelectual.
- **Boletín & Feed RSS 2.0 (`#rss_feed` / `#noticias`)**: Despacho semanal y sincronización para lectores RSS (Feedly, Reeder).
- **API para Desarrolladores (`#api`)**: Documentación REST con autenticación Bearer Token y endpoints de catálogo y reseñas.
- **Sesiones & Podcasts (`#podcasts`)**: Reproducción y análisis de episodios audiófilos pista por pista.

### 🎁 Boutique & Sistema de Recompensas
- **Economía de Sonar Coins & Niveles XP**: Gana monedas en la trivia, publicando reseñas y explorando música.
- **Caja Sorpresa Diaria (Daily Crate)**: Apertura cada 24 horas con multiplicadores y recompensas cosméticas.
- **Marcos de Avatar y Títulos de Prestigio**: Personalización con cosméticos desbloqueables en la tienda.

### 🔒 Seguridad Criptográfica & Control de Acceso
- Contraseñas almacenadas con cifrado seguro **SHA-256** y salting aleatorio criptográfico.
- Autenticación segura mediante cookies `HttpOnly` y protección estricta de rutas administrativas.
- Control parental con bloqueo de pistas explícitas mediante código PIN configurable de 4 dígitos.

### 📊 Importación y Exportación de Catálogos (Excel)
- Exportación completa del catálogo de discos e historial a hojas de cálculo `.xlsx` mediante la librería `exceljs`.
- Capacidad de importación masiva de metadatos discográficos.

---

## 🧪 Pruebas Automatizadas

El proyecto cuenta con una cobertura integral de pruebas unitarias y de integración utilizando **Vitest** y **Testing Library**:

```bash
# Ejecutar toda la suite de pruebas
npm test
```

**Estado actual:** `38 suites de prueba / 196 tests pasando al 100%`.

---

## 📁 Estructura del Proyecto

```text
sonar/
├── sonar/
│   ├── src/
│   │   ├── features/                  # Módulos organizados por dominio
│   │   │   ├── admin/                 # Consola de administración, Admin Hub IA y moderación
│   │   │   ├── auth/                  # Formularios de acceso, registro OTP y recuperación
│   │   │   ├── chatbot/               # Sonaria AI Sommelier
│   │   │   ├── home/                  # Componentes de la portada y novedades
│   │   │   ├── profile/               # Perfil, Trivia, Control Parental y Tienda
│   │   │   └── reviews/               # Feed, tarjetas y modales de reseñas
│   │   ├── pages/                     # Vistas públicas, privadas y de administración
│   │   │   ├── public/                # Guidelines, About, Terms, Vinyl, Labels, RSS, etc.
│   │   │   ├── user/                  # Dashboard de usuario y perfil
│   │   │   └── admin/                 # Panel de moderación y auditoría
│   │   ├── shared/                    # Contextos, servicios, hooks e i18n
│   │   │   ├── components/            # Layout (Navbar, Footer), UI y Reproductor
│   │   │   ├── context/               # Auth, Player, Theme, Language y Accessibility
│   │   │   ├── i18n/                  # Diccionarios y traducciones en 6 idiomas
│   │   │   └── services/              # Deezer API, Webhooks n8n, Agente IA y Crypto
│   │   │       └── n8n/               # Workflows JSON listos para importar a n8n
│   │   ├── App.jsx                    # Raíz con enrutamiento y ErrorBoundary
│   │   └── main.jsx                   # Punto de entrada de la aplicación
│   ├── tests/                         # Suites de pruebas con Vitest (196 tests)
│   ├── server/                        # Backend mock y API con endpoints de seguridad
│   │   ├── api.cjs                    # Servidor Express / JSON Server seguro
│   │   └── trivia.checks.cjs          # Verificaciones de backend para Sonar Coins
│   ├── db.json                        # Base de datos simulada
│   └── package.json                   # Dependencias y scripts
└── README.md                          # Documentación principal del repositorio
```

---

## 📜 Scripts Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo Vite con HMR (`http://localhost:5173/`). |
| `npm run api` | Inicia el backend API en el puerto 3001 (`http://localhost:3001/`). |
| `npm test` | Ejecuta la suite completa de 196 tests con Vitest. |
| `npm run build` | Compila los paquetes optimizados para producción. |
| `npm run lint` | Analiza el código fuente con ESLint. |

---

<p align="center">
  <strong>SONAR</strong> · Buen criterio. Mejor música. 🎧
</p>
