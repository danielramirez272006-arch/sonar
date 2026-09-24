# Manual Técnico de Pruebas y Despliegue — SONAR

Este documento detalla los procedimientos técnicos para ejecutar la suite de pruebas automatizadas, iniciar los servicios y generar el empaquetado de producción de SONAR.

---

## 1. Requisitos Previos

- **Node.js**: Versión 18.0 o superior.
- **npm**: Versión 9.0 o superior.
- **n8n**: Instancia local en ejecución en `http://localhost:5678` (opcional para webhooks activos).

---

## 2. Ejecución del Entorno de Desarrollo

1. **Instalación de Dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar Mock Server (JSON Server)**:
   ```bash
   npm run api
   ```
   *Servidor mock activo en `http://localhost:3001` consumiendo `db.json`.*

3. **Iniciar Frontend (Vite Dev Server)**:
   ```bash
   npm run dev
   ```
   *Aplicación disponible en `http://localhost:5173`.*

---

## 3. Suite de Pruebas Automatizadas (Vitest)

SONAR cuenta con **18 suites de pruebas unitarias y de integración que abarcan 95 tests automatizados**:

Para ejecutar todas las pruebas:
```bash
npm test
```

### Cobertura de Pruebas:
- `tests/admin-data.test.js`: Cálculos de métricas, conteos y analítica semanal.
- `tests/admin-hooks.test.js`: Hooks personalizados de administración y moderación.
- `tests/admin-interface.test.jsx`: Interfaz de usuario de la consola, navegación y accesibilidad.
- `tests/admin-persistence.test.js`: Persistencia de sanciones, reportes y estados de moderación.
- `tests/admin-workflows.test.jsx`: Flujos de aprobación, rechazo y auditoría de reseñas.
- `tests/accessibility.test.jsx`: Proveedor de accesibilidad, Text-to-Speech, contraste y escalado de fuentes.
- `tests/auth-register.test.jsx`: Flujos de registro, hashing SHA-256 y autenticación.
- `tests/community-opinions.test.js`: Algoritmo de agrupación de opiniones coincidentes.
- `tests/conduct-indicator.test.jsx`: Lógica de evaluación y estados del indicador visual de conducta.
- `tests/console-search.test.jsx`: Búsqueda de usuarios y navegación en la consola administrativa.
- `tests/crypto-security.test.js`: Cifrado y verificación criptográfica con salt SHA-256.
- `tests/forgot-password.test.jsx`: Flujo de recuperación de contraseña con código OTP.
- `tests/ia-service.test.js`: Análisis de contexto lírico y detección de contenido.
- `tests/interactions-and-recommendations.test.js`: Likes, guardados de colecciones y motor de recomendaciones.
- `tests/n8n-forgot-password.test.js`: Integración de webhook OTP con n8n.
- `tests/n8n-webhooks.test.js`: Despacho de webhooks y notificaciones.
- `tests/review-album.test.jsx`: Creación, modal y visualización de críticas.
- `src/shared/components/ui/button.test.jsx`: Componente UI de botón y variantes de accesibilidad.

---

## 4. Compilación y Despliegue para Producción

Para compilar el proyecto optimizado con Vite:
```bash
npm run build
```

Para previsualizar la compilación localmente:
```bash
npm run preview
```
