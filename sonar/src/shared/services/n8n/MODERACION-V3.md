# Moderacion con agente real

El flujo v3 fue actualizado: ahora n8n ejecuta un agente del servidor que busca, lee y modera las resenas de la base real.

Consulta [configuracion local y funcionamiento](./MODERACION-AGENTE.md). La API requerida ya esta implementada en `server/api.cjs`; ejecuta `npm run api`. Faltan configurar las claves del servidor, el nombre del modelo Gemini y las credenciales de Gmail/n8n.
