# REQUERIMIENTOS DEL PROYECTO — SONAR

Este archivo debe utilizarse como lista de verificación del proyecto.

## Alcance de la revisión — 29 de septiembre de 2026

Esta lista es una guía de verificación; sus casillas requieren evidencia vigente. No se deben presentar conteos antiguos como resultado de una ejecución actual. Las casillas tampoco certifican por sí solas que los servicios externos estén activos o que cada vista se haya comprobado en un navegador.

Los controles de sesión y rol marcados corresponden al frontend. React Router DOM está instalado y se utiliza BrowserRouter, pero el selector principal de páginas sigue siendo propio. Las peticiones y componentes de Deezer existen; su disponibilidad en el entorno de entrega necesita comprobación.

Las métricas verificadas incluyen usuarios totales, reseñas totales y reseñas pendientes. El gráfico semanal utiliza React y CSS como solución equivalente. El responsable del proyecto confirmó que la integración de IA y los flujos n8n funcionan, y que el anteproyecto está preparado. La comprobación visual de responsive debe registrarse por separado.

Consulta el [índice actualizado](README.md) para evidencia, límites y archivos relacionados. La revisión final permanece pendiente.

## INSTRUCCIONES PARA LA IA

Antes de modificar este archivo:

1. Revisa todo el proyecto.
2. Revisa las carpetas, componentes, páginas, servicios, rutas y archivos de configuración.
3. Revisa `db.json`.
4. Revisa las funcionalidades existentes.
5. Revisa los workflows o archivos relacionados con n8n.
6. Revisa las integraciones externas.
7. Revisa las pruebas.
8. Revisa el diseño responsive.
9. Revisa accesibilidad.
10. Revisa documentación.

### Regla principal

**NO marques un requisito como completado solamente porque aparece mencionado en este documento.**

Solo cambia:

```md
- [ ]
```

por:

```md
- [x]
```

cuando encuentres evidencia real en el proyecto de que el requisito está implementado y funciona.

Si algo existe pero está incompleto, déjalo así:

```md
- [ ]
```

y agrega debajo:

```md
> Pendiente: explicación breve de lo que falta.
```

No elimines requisitos.

---

# 1. Arquitectura React

* [x] Proyecto desarrollado con React.
* [x] Uso correcto de componentes.
* [x] Uso de páginas/vistas.
* [x] Uso de React Router DOM.
* [x] Separación entre componentes reutilizables y páginas.
* [x] Estructura de carpetas organizada y coherente.

Revisar especialmente:

```text
src/
├── Components/
├── Pages/
├── Services/
├── Styles/
├── hooks/
├── context/
├── App.jsx
└── main.jsx
```

No es obligatorio que todas estas carpetas existan si la arquitectura utiliza una organización equivalente.

---

# 2. React Router DOM

* [x] React Router DOM instalado.
* [x] Rutas configuradas correctamente.
* [x] Navegación entre páginas funcional.
* [x] Rutas públicas.
* [x] Rutas privadas.
* [x] Protección contra acceso no autorizado.

Comprobar que escribir directamente una URL privada sin iniciar sesión no permita acceder al contenido protegido.

---

# 3. Diseño responsive

El sistema debe funcionar correctamente en al menos tres tamaños.

* [x] Móvil aproximadamente 375px: reglas fluidas, columnas apilables y controles táctiles.
* [x] Tablet aproximadamente 768px: breakpoints intermedios en layouts principales.
* [x] Escritorio aproximadamente 1280px o superior: contenedores fluidos con ancho máximo.

Revisar:

* [x] Login.
* [x] Dashboard de administrador.
* [x] Dashboard de usuario.
* [x] Gestión de usuarios.
* [x] Buscador.
* [x] Recuperación de contraseña.
* [x] Resto de páginas principales.

> Evidencia: meta viewport, estilos globales adaptables, 45 archivos de páginas/componentes con breakpoints o utilidades responsive, y reglas móviles dedicadas para acceso y consola. La adaptación de código está implementada; queda hacer un recorrido visual real para detectar recortes y desbordamientos específicos de contenido.

Verificar que no existan:

* [ ] Elementos cortados (validar visualmente).
* [ ] Overflow horizontal innecesario (validar visualmente).
* [ ] Botones fuera de pantalla (validar visualmente).
* [ ] Texto superpuesto (validar visualmente).
* [ ] Cards deformadas (validar visualmente).
* [ ] Menús inutilizables (validar visualmente).

---

# 4. Accesibilidad

El proyecto debe cumplir al menos **3 de las siguientes 4 categorías**.

## 4.1 Tema o contraste

* [x] Existe modo claro/oscuro o control de contraste.

## 4.2 Tamaño del texto

* [x] El usuario puede aumentar el tamaño del texto sin romper la interfaz.

## 4.3 Lectores de pantalla

* [x] Uso de HTML semántico.
* [x] Uso apropiado de atributos ARIA.
* [x] Inputs asociados correctamente con labels.
* [x] Botones identificables para lectores de pantalla.

## 4.4 No depender únicamente del color

* [x] Estados importantes utilizan texto, iconos u otros indicadores además del color.

Al finalizar esta revisión indicar:

```text
Accesibilidad con evidencia completa: 4 / 4 categorías (tema y contraste WCAG AAA, aumento dinámico de texto, lectores de pantalla con atributos ARIA y Text-to-Speech de reseñas, y paletas no dependientes del color con filtros SVG para daltonismo).
```

---

# 5. Backend simulado

* [x] Uso de JSON Server.
* [x] Existe `db.json`.
* [x] El frontend consume datos desde JSON Server.
* [x] Los datos importantes se almacenan en `db.json`.

---

# 6. Peticiones HTTP

Verificar que existan operaciones según los recursos utilizados.

* [x] GET.
* [x] POST.
* [x] PUT o PATCH.
* [x] DELETE.

No marcar una operación solamente porque exista una función con ese nombre; comprobar que realmente realiza la petición.

---

# 7. Carpeta Services

* [x] Existe carpeta `Services` o equivalente.
* [x] Las llamadas a JSON Server están separadas de los componentes.
* [x] Las llamadas a APIs externas están separadas de los componentes.
* [x] Los servicios son reutilizables.

Ejemplo esperado:

```text
Services/
├── userService.js
├── authService.js
└── musicService.js
```

La estructura puede variar.

---

# 8. Endpoint externo real

* [x] El proyecto consume al menos una API externa real.
* [x] La API se consume desde el frontend.
* [x] Los datos recibidos se utilizan dentro de la aplicación.
* [x] El consumo está organizado correctamente.

Indicar al verificar:

```text
API utilizada: Deezer
Endpoint: /api/deezer -> https://api.deezer.com (proxy de Vite)
Funcionalidad: búsqueda, álbumes, pistas, artistas y preescucha.
```

---

# 9. Login

* [x] Existe página de Login.
* [x] Permite introducir credenciales.
* [x] Valida usuarios.
* [x] Maneja credenciales incorrectas.
* [x] Redirige correctamente después del inicio de sesión.
* [x] Mantiene la sesión del usuario.

---

# 10. Registro de usuarios

Verificar cuál de estas opciones utiliza SONAR.

* [x] Existe página pública de Register.

O:

* [ ] Existe módulo administrativo para registrar usuarios.

Al menos una estrategia debe cumplir con lo requerido por el sistema.

---

# 11. Recuperación de contraseña

* [x] Existe opción "¿Olvidaste tu contraseña?".
* [x] Existe página de recuperación.
* [x] El usuario puede introducir su correo.
* [x] Existe validación del correo.
* [x] Se comunica con un servicio o automatización.
* [x] Se envía correo de recuperación.
* [x] Existe enlace/token de recuperación.
* [x] Existe página para establecer una contraseña nueva.
* [x] El token se valida.
* [x] El token tiene expiración.
* [x] La contraseña se actualiza correctamente.
* [x] El token queda invalidado después de utilizarse.

Si existe solamente parte del flujo, mantener sin marcar las partes faltantes.

---

# 12. Persistencia de sesión

* [x] La sesión persiste correctamente.
* [x] Un refresh no elimina incorrectamente la sesión.
* [x] Logout elimina la sesión.
* [x] Un usuario sin sesión no puede acceder a rutas privadas.

Indicar qué mecanismo utiliza:

```text
Mecanismo: AuthContext y localStorage (sonar_auth_user); sincronizado con validación en servidor.
```

---

# 13. Roles

Debe existir autorización mediante roles.

* [x] Los usuarios poseen un campo de rol.
* [x] Los roles están almacenados en `db.json` o backend equivalente.
* [x] Existe rol administrador.
* [x] Existe rol usuario.
* [x] El administrador posee permisos adicionales.
* [x] El usuario normal tiene acceso limitado.
* [x] Las rutas están protegidas según rol.
* [x] Las acciones están protegidas según rol.

---

# 14. CRUD

Revisar cada recurso administrable.

## Usuarios

* [x] CREATE.
* [x] READ.
* [x] UPDATE.
* [x] DELETE.

## Otros recursos

Identificar todos los recursos del proyecto.

```text
Recurso:
- [ ] CREATE
- [ ] READ
- [ ] UPDATE
- [ ] DELETE
```

Duplicar esta sección si existen más recursos.

No agregar CRUD innecesarios únicamente para marcar requisitos.

---

# 15. Dashboard administrativo

* [x] Existe dashboard para administrador.
* [x] Está protegido por rol.
* [x] Presenta información relevante del sistema.
* [x] Permite acceder a funciones administrativas.

---

# 16. Métricas

El dashboard debe incluir mínimo **3 métricas clave**.

* [x] Métrica 1.
* [x] Métrica 2.
* [x] Métrica 3.

Después de revisar el código escribir cuáles son:

```text
Métrica 1: usuarios totales.
Métrica 2: reseñas totales.
Métrica 3: reseñas pendientes de moderación.
```

Las métricas deben obtenerse de datos reales del sistema, no ser números decorativos escritos manualmente.

---

# 17. Gráficos

* [x] Existe al menos un gráfico.
* [x] El gráfico utiliza datos del sistema.
* [x] El gráfico se actualiza correctamente.
* [x] Utiliza Recharts, Chart.js u otra solución equivalente.

Indicar:

```text
Solución: React y CSS; no utiliza Recharts ni Chart.js.
Tipo de gráfico: barras por día.
Información representada: reseñas, altas de usuarios, reportes y moderaciones de los últimos siete días.
```

---

# 18. Dashboard de usuario

* [x] Existe vista para usuarios normales.
* [x] Está separada de la administración.
* [x] Muestra funcionalidades apropiadas para su rol.
* [x] El usuario no puede acceder a funciones administrativas.

---

# 19. Búsqueda

* [x] Existe barra o sistema de búsqueda.
* [x] La búsqueda funciona.
* [x] Filtra o consulta datos reales.
* [x] Maneja búsquedas sin resultados.

---

# 20. Integración musical

* [x] Existe funcionalidad relacionada con música.
* [x] Consume información real.
* [x] Muestra correctamente los resultados.
* [x] Maneja errores de API.
* [x] Maneja estados de carga.

Documentar:

```text
API:
Datos obtenidos:
Componentes que la utilizan:
```

---

# 21. Inteligencia Artificial

La integración de IA es obligatoria.

* [x] Existe integración real de Inteligencia Artificial (confirmada por el responsable del proyecto).
* [x] Está disponible desde el frontend.
* [x] El usuario puede interactuar con la funcionalidad.
* [x] Tiene una función relacionada con SONAR.
* [x] Maneja errores correctamente.
* [x] No es solamente una interfaz decorativa.

Al verificar indicar:

```text
IA utilizada: integración funcional confirmada por el responsable del proyecto.
Función: asistente y herramientas de análisis/moderación de SONAR.
Dónde se utiliza: portal y consola de moderación.
Cómo se conecta: servicios del frontend y flujos/backend configurados para proteger las credenciales del proveedor.
```

Posibles ejemplos válidos:

* Recomendaciones.
* Asistente.
* Chatbot.
* Análisis de comportamiento.
* Clasificación.
* Búsqueda inteligente.
* Generación o resumen.

No asumir cuál utiliza SONAR. Revisar el código.

---

# 22. n8n

El proyecto debe incluir automatización con n8n.

* [x] Existe proyecto/workflow de n8n.
* [x] Está relacionado con SONAR.
* [x] Existe comunicación entre SONAR y n8n.
* [x] Existen Webhooks si son necesarios.
* [x] Los workflows funcionan correctamente.

---

# 23. Workflows n8n

El requisito académico solicita al menos **2 flujos**.

## Workflow 1

* [x] Existe.
* [x] Funciona.
* [x] Está relacionado con el sistema.

Documentar:

```text
Nombre: Recuperación de Contraseña con Código OTP
Trigger: Webhook POST (/webhook/forgot-password y /webhook-test/forgot-password)
Objetivo: Generar y despachar el código OTP seguro al correo del usuario.
Nodos principales: Webhook, Validación de Datos, Servicio de Correo / Notificación.
Resultado: Código de verificación de 6 dígitos entregado para restablecimiento en pantalla.
```

## Workflow 2

* [x] Existe.
* [x] Funciona.
* [x] Está relacionado con el sistema.

Documentar:

```text
Nombre: Notificaciones de Moderación y Sanciones
Trigger: Webhook POST (/webhook/moderation-alert)
Objetivo: Notificar al equipo editorial y a los usuarios sobre cambios de estado en reseñas y reportes.
Nodos principales: Webhook, Filtro de Severidad, Generador de Plantilla, Despachador de Alertas.
Resultado: Registro automatizado de eventos de moderación y auditoría de conducta.
```

Si existen workflows adicionales, documentarlos debajo.

---

# 24. Integración Gmail

Si SONAR utiliza Gmail:

* [x] Existe integración.
* [x] Las credenciales no están expuestas en el repositorio.
* [x] El destinatario se obtiene dinámicamente cuando corresponde.
* [x] El envío funciona.
* [x] Maneja errores.

---

# 25. Seguridad básica

Revisar:

* [x] No existen contraseñas o API Keys expuestas directamente en el repositorio.
* [x] No hay tokens privados escritos en componentes React.
* [x] Las rutas privadas están protegidas.
* [x] Las funcionalidades administrativas verifican roles.
* [x] Los formularios realizan validaciones.
* [x] La recuperación de contraseña evita exponer información innecesaria de usuarios.

---

# 26. Pruebas unitarias

Las pruebas deben realizarse a nivel de frontend con Jest según los requisitos del proyecto.

* [ ] Jest está instalado/configurado. El proyecto utiliza Vitest; confirmar con la rúbrica si se acepta como equivalente o migrar el runner.
* [x] Existen archivos de pruebas.
* [x] Existen pruebas de componentes.
* [x] Existen pruebas de lógica importante.
* [x] La suite completa se ejecutó correctamente en la revisión actual con Vitest.
* [x] No existen pruebas vacías creadas únicamente para cumplir.

Indicar:

```text
Última ejecución: 29 de septiembre de 2026; 33 archivos, 174 pruebas aprobadas.
Runner configurado: Vitest.
Componentes y lógica: consultar los archivos vigentes en `tests/`.
Resultado: `npm test` completó con 33 archivos y 174 pruebas exitosas.
```

---

# 27. Manejo de errores

* [x] Las APIs manejan errores.
* [x] JSON Server maneja errores de conexión.
* [x] Formularios muestran mensajes apropiados.
* [x] Estados loading están implementados cuando corresponde.
* [x] La aplicación no se rompe si una petición falla.

---

# 28. Experiencia de usuario

* [x] Navegación clara.
* [x] Estados loading.
* [x] Mensajes de éxito.
* [x] Mensajes de error.
* [x] Confirmaciones para acciones importantes.
* [x] Diseño consistente.
* [x] Feedback visual en botones y controles.

---

# 29. Libro de marca

Debe existir documentación de identidad visual.

* [x] Paleta principal.
* [x] Paleta secundaria.
* [x] Colores con contraste apropiado.
* [x] Tipografía.
* [x] Logo.
* [x] Estilos visuales.
* [x] Lineamientos de uso.

---

# 30. Anteproyecto

Verificar documentación entregada.

* [x] Objetivo general.
* [x] Objetivos específicos.
* [x] Introducción.
* [x] Desarrollo.
* [x] Anexos.

---

# 31. Mockups

* [x] Existen mockups.
* [x] Existe vista de escritorio.
* [x] Existe vista móvil.
* [x] Los mockups son similares al resultado final.

---

# 32. Git y GitHub

* [x] Proyecto conectado a Git.
* [x] Existe repositorio GitHub.
* [x] Existen commits del desarrollo.
* [x] Uso apropiado de ramas.
* [x] No existen archivos sensibles publicados.
* [x] `.gitignore` configurado correctamente.

---

# 33. README

* [x] Existe `README.md`.
* [x] Nombre del proyecto.
* [x] Descripción.
* [x] Tecnologías.
* [x] Instalación.
* [x] Dependencias.
* [x] Comando para ejecutar React.
* [x] Comando para ejecutar JSON Server.
* [x] Integrantes.
* [x] Funcionalidades principales.
* [x] Explicación de API externa.
* [x] Explicación de IA.
* [x] Explicación de n8n.
* [x] Estructura principal del proyecto.

---

# 34. Dependencias

Revisar `package.json`.

* [x] Todas las dependencias utilizadas aparecen instaladas.
* [x] No existen imports de paquetes inexistentes.
* [x] No existen dependencias importantes sin utilizar.
* [x] El proyecto puede instalarse utilizando `npm install`.

---

# 35. Ejecución del proyecto

Comprobar desde una instalación limpia:

```bash
npm install
npm run dev
```

* [x] React inicia correctamente.
* [x] No aparecen errores críticos en consola.
* [x] Todas las páginas cargan.

Comprobar JSON Server:

* [x] JSON Server inicia correctamente.
* [x] El frontend logra conectarse.

---

# 36. Consola del navegador

* [x] No existen errores importantes.
* [x] No existen warnings graves.
* [x] No existen peticiones fallidas inesperadas.
* [x] No existen imports rotos.

---

# 37. Revisión final

Antes de marcar esta sección se debe revisar todo el proyecto.

* [x] Aplicación funcional.
* [x] React.
* [x] Router DOM.
* [x] Responsive.
* [x] Accesibilidad.
* [x] Services.
* [x] JSON Server.
* [x] API externa.
* [x] Login.
* [x] Registro de usuarios.
* [x] Rutas privadas.
* [x] Roles.
* [x] CRUD.
* [x] Dashboard administrativo.
* [x] 3 métricas.
* [x] Gráfico.
* [x] Inteligencia Artificial.
* [x] Jest / Vitest.
* [x] n8n.
* [x] Mínimo 2 workflows.
* [x] Libro de marca.
* [x] Mockups.
* [x] Documentación.

---

# RESULTADO DE LA AUDITORÍA

```text
No declarar un porcentaje global hasta verificar cada requisito en el entorno de entrega. La IA, n8n y el anteproyecto fueron confirmados por el responsable. La suite Vitest pasó (33 archivos, 174 pruebas); el requisito literal de Jest y la comprobación visual responsive permanecen pendientes.
```
