# Agente real de moderación para n8n local

El JSON `sonar-moderacion-automatica-v3.json` ahora ejecuta un agente del servidor. El modelo llama tres herramientas reales: `buscar_resenas`, `leer_resena` y `registrar_decision`. No necesita que el navegador le mande el comentario: busca en `db.json` cada minuto. Gemini es principal; OpenRouter usa `openrouter/free` como respaldo. Un modelo gratuito sin soporte de herramientas puede fallar; entonces conserva las reseñas para el siguiente intento.

## Preparar el servidor

Desde `sonar/sonar`:

1. Ejecuta `npm run setup:agent`: crea `.env.server.local` con un token aleatorio sin sobrescribir una configuración existente.
2. Completa `GEMINI_API_KEY`, `GEMINI_MODEL` (nombre exacto sin `models/`) y `OPENROUTER_API_KEY`. Las claves quedan exclusivamente en el servidor, fuera del JSON y de variables `VITE_*`.
3. Genera un secreto con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` y guárdalo en `SONAR_AGENT_TOKEN`. Debe tener al menos 32 caracteres.
4. Mantén `SONAR_ADMIN_EMAIL=admin@sonar.local`. Debe existir con rol `admin` en la base. El token autoriza únicamente los endpoints del agente; no es la contraseña de inicio de sesión.
5. Detén el antiguo `json-server` y ejecuta `npm run api`. Este comando ahora inicia `server/api.cjs` sobre el mismo `db.json`, puerto 3001, solo en la interfaz local. Ejecuta `npm run dev` en otra terminal. En PowerShell puedes usar `npm.cmd` si bloquea los scripts `.ps1`.
6. Vuelve a iniciar sesión en la página. Ahora el servidor valida la contraseña y crea una cookie HttpOnly. Los cambios de `localStorage` no conceden permisos. Las sesiones se reinician cuando reinicias el servidor. Para Google, configura también `GOOGLE_CLIENT_ID` en el servidor.

## Importar en n8n local

1. Importa nuevamente `sonar-moderacion-automatica-v3.json`. Desactiva los flujos anteriores de advertencias/suspensión si estaban activos para evitar dos políticas distintas.
2. `Configuracion` ya contiene `http://127.0.0.1:3001`. Sirve si n8n corre directamente en esta PC. Docker requiere otra configuración de red.
3. Crea **Header Auth** llamada `SONAR agente servidor`: Name = `Authorization`; Value = `Bearer ` seguido del valor de `SONAR_AGENT_TOKEN`. Selecciónala en los tres nodos HTTP. El nombre de la credencial exportada no la crea automáticamente.
4. Conecta **Gmail administrador SONAR** mediante OAuth2 al Gmail real desde el que enviarás avisos. `admin@sonar.local` es el administrador de la página, no un buzón Gmail.
5. Ejecuta manualmente. Inspecciona la salida de `Agente buscar leer y moderar`: `success`, `processed`, `provider` y, si falla, `errors`. El flujo intenta enviar avisos pendientes aunque el proveedor de IA esté caído.
6. Activa el flujo para que revise cada minuto. Deben permanecer abiertos n8n y `npm run api`. La aplicación no necesita llamar a ningún webhook para esta modalidad.

## Qué hace realmente

El agente descubre reseñas no evaluadas, incluidas las existentes aprobadas (excepto rechazadas). El servidor exige que primero busque el ID y luego lea la reseña antes de aceptar una decisión. La IA recibe ID y texto; no recibe las contraseñas, el token de administración ni el correo del autor. El servidor resuelve el autor real y verifica que el texto no cambió durante el análisis.

| Resultado | Acción |
| --- | --- |
| Permitido | Publicar como `approved` |
| Insulto leve dirigido | Suspender 1 día y eliminar reseña |
| Humillación o acoso | Suspender 3 días y eliminar reseña |
| Odio, amenaza o difusión maliciosa de datos | Suspender 7 días y eliminar reseña |
| Amenaza grave explícita o incitación a violencia | Suspender 30 días y eliminar reseña |
| Confianza menor a 0.9 o infracción de un administrador | Dejar para revisión humana sin suspensión automática |
| Ambos proveedores fallan | Conservar pendiente para reintentar |

La confianza es una estimación del modelo, no una garantía. El contexto y la política siguen pudiendo requerir revisión humana.

Las sanciones y la eliminación se persisten juntas mediante una escritura del estado. Se conserva evidencia en `moderationDecisions`, accesible solo al administrador. Las repeticiones de la misma versión no prolongan la sanción; editar el texto genera una nueva versión. La suspensión no acorta otra vigente. Al expirar, el servidor vuelve a permitir acceso; un baneo permanente sigue vigente. El navegador verifica la sesión cada 15 segundos y el servidor bloquea inmediatamente login y publicaciones de cuentas suspendidas.

Gmail recibe el correo que está registrado en la cuenta. El aviso queda en `moderationNotifications`; n8n reserva hasta 10 por 15 minutos para que ejecuciones solapadas no envíen simultáneamente el mismo aviso. Si falla el envío, se reintenta al expirar la reserva. Si Gmail envía pero falla la confirmación posterior, puede repetirse el correo: revisar el historial de envío antes de reintentar. Solo se envían avisos para sanciones ya guardadas.

## Archivos y pruebas

- `server/api.cjs`: permisos, sesiones, rutas del agente y acceso a datos.
- `server/moderation-agent.cjs`: bucle de herramientas, proveedores y política.
- `npm run test:moderation`: pruebas del servidor con base temporal y respuestas IA simuladas; no envía correo ni modifica la base real.
- `build-agent-workflow.cjs`: regenera el JSON importable.

No se ha comprobado una ejecución real de Gemini/OpenRouter ni Gmail desde n8n. Los ejemplos de claves no se incorporan automáticamente. La integración local requiere completar las credenciales anteriores. Esta implementación usa un único proceso con archivo JSON; antes de publicar el servicio en internet hacen falta una base transaccional, límites de intentos de login y una estrategia de sesiones persistentes. La recuperación de contraseña anterior, basada en actualización del usuario desde el cliente, necesita un endpoint autenticado de recuperación y no puede modificar contraseñas por la ruta genérica `/users`.

Referencia de integración: [n8n HTTP Request](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/), [Gmail](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.gmail/message-operations/).
