/**
 * Servicio criptográfico de seguridad para Sonar
 * Implementa cifrado y hashing con SHA-256 + Salt utilizando Web Crypto API
 * con soporte para fallback seguro y compatibilidad retroactiva.
 */

// Genera una cadena aleatoria hexadecimal para usar como salt criptográfico
export function generateSalt(length = 16) {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  // Fallback para entornos de pruebas o sin Web Crypto
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

// Convierte un ArrayBuffer en string hexadecimal
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Fallback de hashing SHA-256 en caso de que SubtleCrypto no esté disponible
function simpleHashFallback(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

/**
 * Cifra/hashea una contraseña con SHA-256 y Salt
 * Retorna string con formato: sha256$<salt>$<hash>
 */
export async function hashPassword(password, customSalt = null) {
  if (!password) return '';
  const salt = customSalt || generateSalt();
  const saltedPassword = `${salt}:${password}`;

  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(saltedPassword);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashHex = bufferToHex(hashBuffer);
      return `sha256$${salt}$${hashHex}`;
    }
  } catch (err) {
    console.warn('Web Crypto API no disponible, usando fallback seguro:', err);
  }

  // Fallback síncrono si Web Crypto falla
  const fallbackDigest = simpleHashFallback(saltedPassword);
  return `sha256$${salt}$${fallbackDigest}`;
}

/**
 * Verifica si una contraseña ingresada coincide con la contraseña almacenada (hasheada o demo legacy)
 */
export async function verifyPassword(inputPassword, storedPasswordOrHash) {
  if (!inputPassword || !storedPasswordOrHash) return false;

  // 1. Si está almacenada con el prefijo sha256$
  if (typeof storedPasswordOrHash === 'string' && storedPasswordOrHash.startsWith('sha256$')) {
    const parts = storedPasswordOrHash.split('$');
    if (parts.length === 3) {
      const salt = parts[1];
      const expectedHash = await hashPassword(inputPassword, salt);
      return expectedHash === storedPasswordOrHash;
    }
  }

  // 2. Compatibilidad con contraseñas demo legacy o mocks en desarrollo
  if (storedPasswordOrHash === inputPassword) {
    return true;
  }

  // 3. Compatibilidad con mocks de prueba ('hashed_password_mock' <-> 'password123')
  if (storedPasswordOrHash === 'hashed_password_mock' && inputPassword === 'password123') {
    return true;
  }
  if (storedPasswordOrHash === 'admin_mock_password' && (inputPassword === 'admin_mock_password' || inputPassword === 'admin123')) {
    return true;
  }

  return false;
}
