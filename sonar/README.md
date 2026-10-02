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

# Ejecutar Suite Completa de 195 Tests
npm test
```

### 🤖 Workflows de n8n con Google Gemini
Los flujos listos para importar a n8n se encuentran en:
- `src/shared/services/n8n/sonar-moderacion-ia-resenas.json` (Moderación con Gemini 2.0 Flash)
- `src/shared/services/n8n/sonar-chatbot-asistente-musical.json` (Sonaria AI Sommelier)
