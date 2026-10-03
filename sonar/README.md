# 🎵 SONAR · Audiophile Curation Hub & Music Community

Consulta la documentación principal completa del proyecto en el [README raíz](../README.md).

### 🚀 Comandos Rápidos
```bash
# Iniciar API Mock y Servidor Seguro (puerto 3001)
npm run api

# Iniciar Frontend (Vite en puerto 5173)
npm run dev

# Iniciar n8n (Webhooks, Agente Gemini y Asistente Sommelier en puerto 5678)
n8n start

# Ejecutar Suite Completa de Pruebas Unitarias (Jest: 38 suites, 196 tests)
npm test
```

### 🤖 Workflows de n8n con Google Gemini
Los flujos listos para importar a n8n se encuentran en:
- `src/shared/services/n8n/sonar-moderacion-ia-resenas.json` (Moderación con Gemini 2.0 Flash)
- `src/shared/services/n8n/sonar-chatbot-asistente-musical.json` (Sonaria AI Sommelier)

### 🧭 Enrutado y control de acceso
`react-router-dom` provee el `BrowserRouter` raíz (`src/App.jsx`) y los enlaces/`useLocation`.
La selección de páginas se hace en `src/shared/routing/app-router.jsx` con un enrutador ligero
basado en hash (`#/ruta`), con soporte de alias de rutas, scroll al cambiar de página y
transiciones animadas. Se eligió así para conservar los enlaces históricos `#explore`, `#dashboard`, etc.

- **Rutas públicas:** home, login, register, community, reviews, news, etc.
- **Rutas privadas** (`PrivateRoute`): perfil de usuario y ajustes.
- **Rutas de administrador** (`AdminRoute`, rol `admin` guardado en `db.json`): consola, dashboard, moderación, catálogo (CRUD), usuarios y Admin Hub IA.

### 📊 Dashboard
El gráfico de actividad semanal usa **Recharts** (`src/features/admin/dashboard/components/activity-chart.jsx`).
