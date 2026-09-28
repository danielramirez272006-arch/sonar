/**
 * Propiedades canonicas de Avatar a partir de un usuario, o de cualquier objeto
 * que lo represente (perfil, reseña, seguimiento).
 *
 * Todos los lugares de la app deben pasar por aqui. El fallo que se repite es
 * olvidar avatarSeed o avatarHue en un sitio y no en otro: el avatar no se
 * queja, simplemente esa persona aparece con otra cara y otro color segun donde
 * se mire. Nombre, semilla y color tienen que salir de la misma regla.
 */
export function avatarPropsFor(user, overrides) {
  const u = user || {};
  // username manda: es lo que escribe el servidor y lo que ve la persona.
  const identity = u.username || u.userName || u.name || u.email || 'usuario-sonar';
  return {
    src: u.avatarUrl,
    name: identity,
    avatarBg: u.avatarBg || u.avatarColor,
    avatarStyle: u.avatarStyle,
    // La semilla se resuelve aqui, nunca a partir de name. Si un sitio cambia
    // el texto que muestra (Ana Maria en vez de ana_maria) y name llegara a la
    // semilla, ese avatar tendria otra cara que el de al lado.
    avatarSeed: u.avatarSeed || identity,
    avatarHue: u.avatarHue,
    avatarTone: u.avatarTone,
    avatarIcon: u.avatarIcon,
    ...overrides,
  };
}

export default avatarPropsFor;
