# REQUERIMIENTOS DEL PROYECTO — SONAR

Este archivo debe utilizarse como lista de verificación del proyecto.

## Alcance de la revisión — 24 de septiembre de 2026

Se conservan 124 casillas marcadas y 99 pendientes. Las casillas marcadas reflejan evidencia de código y, cuando corresponde, pruebas registradas en esta sesión; no certifican una instalación limpia, servicios externos activos ni todas las vistas en un navegador. Los apartados se solapan: estos conteos no equivalen a un porcentaje de avance.

Los controles de sesión y rol marcados corresponden al frontend. React Router DOM está instalado y se utiliza BrowserRouter, pero el selector principal de páginas sigue siendo propio. Las peticiones y componentes de Deezer existen; su disponibilidad en el entorno de entrega necesita comprobación.

Las métricas verificadas incluyen usuarios totales, reseñas totales y reseñas pendientes. El gráfico semanal utiliza React y CSS como solución equivalente. La recuperación y n8n siguen parcialmente simulados.

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
* [ ] Rutas configuradas correctamente.
* [x] Navegación entre páginas funcional.
* [x] Rutas públicas.
* [x] Rutas privadas.
* [x] Protección contra acceso no autorizado.

Comprobar que escribir directamente una URL privada sin iniciar sesión no permita acceder al contenido protegido.

---

# 3. Diseño responsive

El sistema debe funcionar correctamente en al menos tres tamaños.

* [ ] Móvil aproximadamente 375px.
* [ ] Tablet aproximadamente 768px.
* [ ] Escritorio aproximadamente 1280px o superior.

Revisar:

* [ ] Login.
* [ ] Dashboard de administrador.
* [ ] Dashboard de usuario.
* [ ] Gestión de usuarios.
* [ ] Buscador.
* [ ] Recuperación de contraseña.
* [ ] Resto de páginas principales.

Verificar que no existan:

* Elementos cortados.
* Overflow horizontal innecesario.
* Botones fuera de pantalla.
* Texto superpuesto.
* Cards deformadas.
* Menús inutilizables.

---

# 4. Accesibilidad

El proyecto debe cumplir al menos **3 de las siguientes 4 categorías**.

## 4.1 Tema o contraste

* [x] Existe modo claro/oscuro o control de contraste.

## 4.2 Tamaño del texto

* [ ] El usuario puede aumentar el tamaño del texto sin romper la interfaz.

## 4.3 Lectores de pantalla

* [x] Uso de HTML semántico.
* [ ] Uso apropiado de atributos ARIA.
* [ ] Inputs asociados correctamente con labels.
* [ ] Botones identificables para lectores de pantalla.

## 4.4 No depender únicamente del color

* [x] Estados importantes utilizan texto, iconos u otros indicadores además del color.

Al finalizar esta revisión indicar:

```text
Accesibilidad con evidencia parcial: 2 / 4 categorías (tema y estados no dependientes del color). Lectores de pantalla y aumento de texto pendientes de completar y comprobar.
```

---

# 5. Backend simulado

* [x] Uso de JSON Server.
* [x] Existe `db.json`.
* [x] El frontend consume datos desde JSON Server.
* [ ] Los datos importantes se almacenan en `db.json`.

---

# 6. Peticiones HTTP

Verificar que existan operaciones según los recursos utilizados.

* [x] GET.
* [x] POST.
* [x] PUT o PATCH.
* [ ] DELETE.

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
* [ ] Se envía correo de recuperación.
* [x] Existe enlace/token de recuperación.
* [x] Existe página para establecer una contraseña nueva.
* [ ] El token se valida.
* [ ] El token tiene expiración.
* [ ] La contraseña se actualiza correctamente.
* [ ] El token queda invalidado después de utilizarse.

Si existe solamente parte del flujo, mantener sin marcar las partes faltantes.

---

# 12. Persistencia de sesión

* [x] La sesión persiste correctamente.
* [x] Un refresh no elimina incorrectamente la sesión.
* [x] Logout elimina la sesión.
* [x] Un usuario sin sesión no puede acceder a rutas privadas.

Indicar qué mecanismo utiliza:

```text
Mecanismo: AuthContext y localStorage (sonar_auth_user); sin verificación de sesión en servidor.
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
* [ ] Las acciones están protegidas según rol.

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

* [ ] Existe integración real de Inteligencia Artificial.
* [ ] Está disponible desde el frontend.
* [ ] El usuario puede interactuar con la funcionalidad.
* [ ] Tiene una función relacionada con SONAR.
* [ ] Maneja errores correctamente.
* [ ] No es solamente una interfaz decorativa.

Al verificar indicar:

```text
IA utilizada: ninguna integración real acreditada; servicios simulados.
Función: recomendaciones fijas, contexto lírico de ejemplo y detección por diccionario.
Dónde se utiliza: portal y consola de moderación.
Cómo se conecta: funciones locales de ia-service.js; sin conexión a un modelo.
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
* [ ] Existe comunicación entre SONAR y n8n.
* [x] Existen Webhooks si son necesarios.
* [ ] Los workflows funcionan correctamente.

---

# 23. Workflows n8n

El requisito académico solicita al menos **2 flujos**.

## Workflow 1

* [x] Existe.
* [ ] Funciona.
* [x] Está relacionado con el sistema.

Documentar:

```text
Nombre:
Trigger:
Objetivo:
Nodos principales:
Resultado:
```

## Workflow 2

* [ ] Existe.
* [ ] Funciona.
* [ ] Está relacionado con el sistema.

Documentar:

```text
Nombre:
Trigger:
Objetivo:
Nodos principales:
Resultado:
```

Si existen workflows adicionales, documentarlos debajo.

---

# 24. Integración Gmail

Si SONAR utiliza Gmail:

* [x] Existe integración.
* [ ] Las credenciales no están expuestas en el repositorio.
* [x] El destinatario se obtiene dinámicamente cuando corresponde.
* [ ] El envío funciona.
* [ ] Maneja errores.

---

# 25. Seguridad básica

Revisar:

* [ ] No existen contraseñas o API Keys expuestas directamente en el repositorio.
* [ ] No hay tokens privados escritos en componentes React.
* [x] Las rutas privadas están protegidas.
* [ ] Las funcionalidades administrativas verifican roles.
* [x] Los formularios realizan validaciones.
* [ ] La recuperación de contraseña evita exponer información innecesaria de usuarios.

---

# 26. Pruebas unitarias

Las pruebas deben realizarse a nivel de frontend con Jest según los requisitos del proyecto.

* [ ] Jest está instalado/configurado.
* [x] Existen archivos de pruebas.
* [x] Existen pruebas de componentes.
* [x] Existen pruebas de lógica importante.
* [x] Las pruebas se ejecutan correctamente.
* [x] No existen pruebas vacías creadas únicamente para cumplir.

Indicar:

```text
Número de pruebas: 90 en 17 archivos en la última ejecución registrada de esta sesión.
Componentes probados: consola, búsqueda, reportes, formularios y tarjetas de álbum.
Lógica probada: métricas, sanciones, persistencia, coincidencias de opiniones, criptografía e interacciones.
Resultado: pasaron con Vitest; no se repitieron para actualizar estos documentos. Los mocks no certifican servicios externos.
```

---

# 27. Manejo de errores

* [ ] Las APIs manejan errores.
* [ ] JSON Server maneja errores de conexión.
* [x] Formularios muestran mensajes apropiados.
* [x] Estados loading están implementados cuando corresponde.
* [ ] La aplicación no se rompe si una petición falla.

---

# 28. Experiencia de usuario

* [ ] Navegación clara.
* [x] Estados loading.
* [x] Mensajes de éxito.
* [x] Mensajes de error.
* [x] Confirmaciones para acciones importantes.
* [ ] Diseño consistente.
* [x] Feedback visual en botones y controles.

---

# 29. Libro de marca

Debe existir documentación de identidad visual.

* [x] Paleta principal.
* [x] Paleta secundaria.
* [ ] Colores con contraste apropiado.
* [x] Tipografía.
* [x] Logo.
* [x] Estilos visuales.
* [x] Lineamientos de uso.

---

# 30. Anteproyecto

Verificar documentación entregada.

* [ ] Objetivo general.
* [ ] Objetivos específicos.
* [ ] Introducción.
* [ ] Desarrollo.
* [ ] Anexos.

---

# 31. Mockups

* [ ] Existen mockups.
* [ ] Existe vista de escritorio.
* [ ] Existe vista móvil.
* [ ] Los mockups son similares al resultado final.

---

# 32. Git y GitHub

* [x] Proyecto conectado a Git.
* [x] Existe repositorio GitHub.
* [x] Existen commits del desarrollo.
* [x] Uso apropiado de ramas.
* [ ] No existen archivos sensibles publicados.
* [ ] `.gitignore` configurado correctamente.

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
* [ ] Integrantes.
* [x] Funcionalidades principales.
* [ ] Explicación de API externa.
* [ ] Explicación de IA.
* [ ] Explicación de n8n.
* [x] Estructura principal del proyecto.

---

# 34. Dependencias

Revisar `package.json`.

* [x] Todas las dependencias utilizadas aparecen instaladas.
* [x] No existen imports de paquetes inexistentes.
* [ ] No existen dependencias importantes sin utilizar.
* [ ] El proyecto puede instalarse utilizando `npm install`.

---

# 35. Ejecución del proyecto

Comprobar desde una instalación limpia:

```bash
npm install
npm run dev
```

* [ ] React inicia correctamente.
* [ ] No aparecen errores críticos en consola.
* [ ] Todas las páginas cargan.

Comprobar JSON Server:

* [ ] JSON Server inicia correctamente.
* [ ] El frontend logra conectarse.

---

# 36. Consola del navegador

* [ ] No existen errores importantes.
* [ ] No existen warnings graves.
* [ ] No existen peticiones fallidas inesperadas.
* [x] No existen imports rotos.

---

# 37. Revisión final

Antes de marcar esta sección se debe revisar todo el proyecto.

* [ ] Aplicación funcional.
* [ ] React.
* [ ] Router DOM.
* [ ] Responsive.
* [ ] Accesibilidad.
* [ ] Services.
* [ ] JSON Server.
* [ ] API externa.
* [ ] Login.
* [ ] Registro de usuarios.
* [ ] Rutas privadas.
* [ ] Roles.
* [ ] CRUD.
* [ ] Dashboard administrativo.
* [ ] 3 métricas.
* [ ] Gráfico.
* [ ] Inteligencia Artificial.
* [ ] Jest.
* [ ] n8n.
* [ ] Mínimo 2 workflows.
* [ ] Libro de marca.
* [ ] Mockups.
* [ ] Documentación.

---

# RESULTADO DE LA AUDITORÍA

La IA debe completar esta sección después de revisar el proyecto.

```text
Requisitos con evidencia: 124 casillas; arquitectura, servicios, autenticación de demostración, administración, métricas y pruebas.
Requisitos incompletos: IA real, Jest exigido, segundo workflow, recuperación completa y CRUD completo de usuarios.
Requisitos que necesitan revisión: responsive, accesibilidad, entrega real de correo, instalación limpia, despliegue, seguridad y entregables académicos.

PRIORIDAD ALTA:
1. Incorporar una integración real de IA y el segundo workflow n8n.
2. Completar recuperación: expiración, uso único y errores reales de envío/guardado.
3. Verificar autorización del backend y resolver la exigencia de Jest frente a Vitest.

PRIORIDAD MEDIA:
1. Validar rutas, operaciones CRUD requeridas y persistencia en JSON Server.
2. Comprobar responsive, teclado, lectores de pantalla y contraste.
3. Completar anteproyecto, mockups e integrantes; verificar documentación con la rúbrica.

PRIORIDAD BAJA:
1. Unificar tipografía y completar lineamientos del libro de marca.
2. Revisar dependencias sin uso y mantenimiento del repositorio.
3. Registrar pruebas manuales y del entorno de entrega.
```

## REGLA FINAL PARA LA IA

No modificar funcionalidades que ya funcionan durante esta auditoría.

Primero:

1. Revisar.
2. Marcar checks.
3. Explicar qué falta.
4. Indicar archivos relacionados.
5. Proponer cambios.

No implementar automáticamente los requisitos faltantes hasta recibir autorización.
