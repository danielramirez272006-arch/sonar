// Contrato de la API de sesiones para pruebas de componentes sin servidor real.
export function authServerFetch() {
  const users = [];
  let session = null;
  return async (url, options = {}) => {
    const p = new URL(url, 'http://localhost');
    const body = options.body ? JSON.parse(options.body) : {};
    const response = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
    if (p.pathname.endsWith('/auth/me')) return response(session || { error: 'Sin sesion' }, session ? 200 : 401);
    if (p.pathname.endsWith('/auth/logout')) { session = null; return response({ success: true }); }
    if (p.pathname.endsWith('/users') && options.method === 'POST') {
      const { password, ...profile } = body;
      void password;
      session = { ...profile, id: body.id || 'server-user', role: 'user' };
      users.push(session);
      return response(session, 201);
    }
    if (p.pathname.endsWith('/users')) return response(users.filter(u => !p.searchParams.has('email') || u.email === p.searchParams.get('email')));
    if (options.method === 'PATCH' && p.pathname.includes('/users/')) { Object.assign(session || {}, body); return response(session || body); }
    return response({ error: 'Ruta no simulada' }, 404);
  };
}
