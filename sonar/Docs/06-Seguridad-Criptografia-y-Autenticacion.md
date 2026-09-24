# Seguridad, Criptografía y Autenticación — SONAR

SONAR implementa estándares modernos de seguridad y criptografía para proteger las identidades y credenciales de los usuarios.

---

## 1. Cifrado de Contraseñas (SHA-256 + Salt)

En [crypto-service.js](../src/shared/services/crypto-service.js):
- **Web Crypto API**: Uso de primitivas criptográficas del estándar W3C (`crypto.subtle`).
- **Generación de Salt**: Salting criptográfico aleatorio de 16 bytes mediante `crypto.getRandomValues(new Uint8Array(16))`.
- **Derivación**: La contraseña en texto plano se concatena con el salt y se procesa mediante función hash SHA-256.
- **Formato**: `sha256$<salt_hex>$<hash_hex>`.
- **Seguridad en Reposo**: Ni en `db.json` ni en `localStorage` se almacenan contraseñas en texto claro.

---

## 2. Control de Acceso Basado en Roles (RBAC)

- **Roles Definidos**:
  - `user`: Melómano estándar con acceso a exploración, reseñas, catálogo, colecciones personales y configuración de perfil.
  - `admin`: Administrador de la plataforma con acceso a analítica de métricas, cola de moderación, sanciones y resolución de reportes.
- **Guardias de Enrutamiento**:
  - [PrivateRoute](../src/shared/routing/private-route.jsx): Protege las secciones de usuario activo.
  - [AdminRoute](../src/shared/routing/admin-route.jsx): Valida `hasRole('admin')` antes de renderizar cualquier vista de la consola administrativa.

---

## 3. Recuperación de Contraseñas con Código OTP

En [forgot-password-form.jsx](../src/features/auth/components/forgot-password-form.jsx) y [n8n-webhooks.js](../src/shared/services/n8n-webhooks.js):
- **Código OTP de 6 dígitos**: Generado de forma segura y despachado hacia el webhook de n8n.
- **Ventana de Expiración**: Válido durante 15 minutos para prevenir ataques de repetición.
- **Actualización Segura**: Al validar el código, el usuario define su nueva contraseña, la cual es cifrada con SHA-256 y persistida en su cuenta.

---

## 4. Ciclo de Vida del Usuario y Eliminación Segura (CRUD DELETE)

- **Confirmación Explícita**: Para eliminar una cuenta, el usuario debe acceder a la Zona de Peligro en el editor de perfil y escribir la frase de confirmación `ELIMINAR MI CUENTA`.
- **Limpieza de Sesión**: La función `deleteAccount()` en [AuthContext](../src/shared/context/auth-context.jsx) ejecuta la eliminación en la API mediante `deleteUser()` y limpia los tokens y claves de `localStorage`.
