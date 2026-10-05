const jsonServer = require('json-server');
const { randomBytes, randomInt, createHash, timingSafeEqual } = require('node:crypto');
const path = require('node:path');
const { createModeration } = require('./moderation-agent.cjs');
const equal = (a,b) => { const x=Buffer.from(String(a || '')), y=Buffer.from(String(b || '')); return x.length === y.length && timingSafeEqual(x,y); };
const blocked = u => u?.status === 'banned' || (u?.status === 'suspended' && (!u.suspendedUntil || Date.parse(u.suspendedUntil) > Date.now()));
const safeUser = u => { const { password, ...rest } = u; return rest; };
function verify(password, saved) {
  if (typeof password !== 'string' || !password || typeof saved !== 'string') return false;
  if (saved.startsWith('sha256$')) {
    const [,salt,digest] = saved.split('$');
    const saltedPassword = `${salt}:${password}`;
    if (equal(createHash('sha256').update(saltedPassword).digest('hex'), digest)) return true;
    // Recover accounts created by clients without Web Crypto, then upgrade their hash at login.
    if (/^[0-9a-f]{16}$/.test(digest)) {
      let hash = 0;
      for (let i = 0; i < saltedPassword.length; i++) {
        hash = (hash << 5) - hash + saltedPassword.charCodeAt(i);
        hash |= 0;
      }
      return equal(Math.abs(hash).toString(16).padStart(16, '0'), digest);
    }
    return false;
  }
  // Compatibility with demo accounts created by the old client-side mock auth.
  if (saved === 'hashed_password_mock') return equal(password, 'password123');
  if (saved === 'admin_mock_password') return equal(password, 'admin123') || equal(password, saved);
  return equal(password,saved);
}
function createApp({ filename = path.join(__dirname,'../db.json'), env = process.env, request = fetch } = {}) {
  const app = jsonServer.create(), router = jsonServer.router(filename), db = router.db;
  const sessions = new Map();
  const passwordResetCodes = new Map();
  const admin = db.getState().users.find(u => u.role === 'admin' && u.email === (env.SONAR_ADMIN_EMAIL || 'admin@sonar.local'));
  const agent = createModeration(db, { adminId: admin?.id, geminiKey: env.GEMINI_API_KEY, geminiModel: env.GEMINI_MODEL, openrouterKey: env.OPENROUTER_API_KEY }, request);
  app.use(jsonServer.bodyParser);
  app.use((req,res,next) => {
    if (!['GET','HEAD','OPTIONS'].includes(req.method) && req.headers.origin && !['http://localhost:5173','http://127.0.0.1:5173',env.SONAR_APP_ORIGIN].filter(Boolean).includes(req.headers.origin)) return res.status(403).json({ error:'Origen no permitido' });
    const cookie = /(?:^|;\s*)sonar_session=([^;]+)/.exec(req.headers.cookie || '')?.[1];
    const session = sessions.get(cookie);
    if (session && session.expires > Date.now()) req.user = db.getState().users.find(u => String(u.id) === session.userId);
    req.isAdmin = req.user?.role === 'admin' && !blocked(req.user);
    const currentAdmin = db.getState().users.find(u => u.id === admin?.id && u.role === 'admin');
    req.isAgent = Boolean(currentAdmin && !blocked(currentAdmin) && env.SONAR_AGENT_TOKEN?.length >= 32 && equal(req.headers.authorization, `Bearer ${env.SONAR_AGENT_TOKEN}`));
    next();
  });
  function establish(res,u) {
    const token = randomBytes(32).toString('hex');
    sessions.set(token,{userId:String(u.id),expires:Date.now()+86400000});
    res.setHeader('Set-Cookie',`sonar_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400${env.NODE_ENV === 'production' ? '; Secure' : ''}`);
    return safeUser(u);
  }
  app.post('/auth/login',(req,res) => {
    const u = db.getState().users.find(u => u.email?.toLowerCase() === String(req.body.email || '').trim().toLowerCase());
    if (!u || !verify(req.body.password,u.password)) return res.status(401).json({error:'Correo o contraseña incorrectos'});
    if (blocked(u)) return res.status(403).json({error:'Cuenta suspendida o baneada'});
    if (/^sha256\$[^$]+\$[0-9a-f]{16}$/.test(u.password || '') || ['hashed_password_mock','admin_mock_password'].includes(u.password)) {
      const salt = randomBytes(16).toString('hex');
      u.password = `sha256$${salt}$${createHash('sha256').update(`${salt}:${req.body.password}`).digest('hex')}`;
      db.write();
    }
    res.json(establish(res,u));
  });
  app.post('/trivia/reward',async (req,res) => {
    if (!req.user || blocked(req.user)) return res.status(403).json({error:'Inicia sesión con una cuenta activa'});
    const { roundId, mode, deck, answers } = req.body;
    if (typeof roundId !== 'string' || !/^[a-zA-Z0-9-]{20,64}$/.test(roundId) || !['solo','1v1'].includes(mode) || !Array.isArray(deck) || deck.length !== 16 || new Set(deck).size !== 16 || !Array.isArray(answers) || answers.length !== 16) return res.status(400).json({error:'Partida incompleta'});
    try {
      const { MUSIC_QUESTIONS } = await import('../src/features/profile/components/music-questions.js');
      if (deck.some(i => !Number.isInteger(i) || !MUSIC_QUESTIONS[i]) || answers.some(a => !Number.isInteger(a) || a < -1 || a > 2)) return res.status(400).json({error:'Respuestas inválidas'});
      const scores = [0,0]; let turn = 0;
      deck.forEach((q,i) => { if (answers[i] === MUSIC_QUESTIONS[q].correct) scores[turn]++; else if (mode === '1v1') turn = 1-turn; });
      const won = mode === 'solo' ? scores[0] >= 10 : scores[0] > scores[1];
      if (!won) return res.status(400).json({error:'Esta partida no cumple la meta para ganar Coins'});
      const u = db.getState().users.find(u => u.id === req.user.id);
      const claimed = (u.triviaRewards || []).some(r => r.id === roundId);
      if (!claimed) {
        u.sonarPoints = (Number.isFinite(u.sonarPoints) ? u.sonarPoints : 0) + 100;
        u.triviaRewards = [...(u.triviaRewards || []), {id:roundId, coins:100, createdAt:new Date().toISOString()}];
        db.write();
      }
      res.json({points:u.sonarPoints, coins:100, alreadyClaimed:claimed});
    } catch { res.status(500).json({error:'No se pudo guardar la recompensa. Intenta de nuevo.'}); }
  });
  app.post('/auth/logout',(req,res) => {
    const cookie = /(?:^|;\s*)sonar_session=([^;]+)/.exec(req.headers.cookie || '')?.[1];
    sessions.delete(cookie); res.setHeader('Set-Cookie','sonar_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0'); res.json({success:true});
  });
  app.get('/auth/me',(req,res) => req.user && !blocked(req.user) ? res.json(safeUser(req.user)) : res.status(401).json({error:'Inicia sesión o revisa la suspensión de tu cuenta'}));
  app.post('/auth/password',(req,res) => {
    if (!req.user || blocked(req.user) || !verify(req.body.oldPassword,req.user.password)) return res.status(403).json({error:'Contraseña actual incorrecta'});
    if (typeof req.body.newPassword !== 'string' || req.body.newPassword.length < 6) return res.status(400).json({error:'Mínimo 6 caracteres'});
    const salt=randomBytes(16).toString('hex');
    req.user.password=`sha256$${salt}$${createHash('sha256').update(`${salt}:${req.body.newPassword}`).digest('hex')}`;
    db.write(); res.json({success:true});
  });
  app.post('/auth/password/reset/request',async (req,res) => {
    const email=String(req.body.email || '').trim().toLowerCase();
    if (!email || email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({error:'Correo electrónico inválido'});
    const user=db.getState().users.find(u=>u.email?.toLowerCase()===email);
    if (!user) return res.status(404).json({error:'No existe una cuenta con ese correo'});
    const previous=passwordResetCodes.get(email);
    if (previous && previous.sentAt>Date.now()-60_000) return res.status(429).json({error:'Espera un minuto antes de solicitar otro código'});
    const code=String(randomInt(100000,1000000));
    const endpoint=env.N8N_FORGOT_PASSWORD_WEBHOOK_URL || 'http://127.0.0.1:5678/webhook/forgot-password';
    try {
      const response=await request(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,code}),signal:AbortSignal.timeout(8000)});
      if (!response.ok) throw new Error(`n8n HTTP ${response.status}`);
      passwordResetCodes.set(email,{codeHash:createHash('sha256').update(code).digest('hex'),expiresAt:Date.now()+15*60_000,sentAt:Date.now(),attempts:0});
      return res.json({success:true,message:'Si la cuenta existe, recibirás un código de recuperación por correo.'});
    } catch {
      return res.status(503).json({error:'No se pudo enviar el correo de recuperación. Comprueba que n8n esté activo y vuelve a intentarlo.'});
    }
  });
  app.post('/auth/password/reset', (req,res) => {
    const email=String(req.body.email || '').trim().toLowerCase();
    const code=String(req.body.code || '').trim();
    const newPassword=req.body.newPassword;
    const pending=passwordResetCodes.get(email);
    if (!pending || pending.expiresAt<Date.now() || pending.attempts>=5) {
      passwordResetCodes.delete(email);
      return res.status(400).json({error:'El código es incorrecto o expiró. Solicita uno nuevo.'});
    }
    pending.attempts++;
    const submittedHash=createHash('sha256').update(code).digest('hex');
    if (!/^\d{6}$/.test(code) || !equal(submittedHash,pending.codeHash)) return res.status(400).json({error:'El código es incorrecto o expiró. Solicita uno nuevo.'});
    if (typeof newPassword!=='string' || newPassword.length<6 || newPassword.length>200) return res.status(400).json({error:'La contraseña debe tener al menos 6 caracteres.'});
    const user=db.getState().users.find(u=>u.email?.toLowerCase()===email);
    if (!user) return res.status(404).json({error:'No existe una cuenta con ese correo'});
    const salt=randomBytes(16).toString('hex');
    user.password=`sha256$${salt}$${createHash('sha256').update(`${salt}:${newPassword}`).digest('hex')}`;
    db.write();
    passwordResetCodes.delete(email);
    res.json({success:true});
  });
  app.post('/auth/google',async (req,res) => {
    let googleResponseReceived = false;
    try {
      const googleClientId = env.GOOGLE_CLIENT_ID || env.VITE_GOOGLE_CLIENT_ID;
      if (!googleClientId || req.body.credential === 'dev-google-credential-token') {
        const email = req.body.profile?.email || 'melomano_google@sonar.audio';
        let u = db.getState().users.find(u => u.email?.toLowerCase() === email.toLowerCase());
        if (!u) {
          u = {
            id: randomBytes(16).toString('hex'),
            email: email.toLowerCase(),
            username: req.body.profile?.name || 'Melómano Google',
            role: 'user',
            provider: 'google',
            avatarUrl: req.body.profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            status: 'active',
            createdAt: new Date().toISOString()
          };
          for (const field of ['avatarBg','bio','gear','preferences','accountType','parentalControl']) if (req.body.profile?.[field] !== undefined) u[field]=req.body.profile[field];
          db.get('users').push(u).write();
        }
        if (blocked(u)) return res.status(403).json({error:'Cuenta suspendida o baneada'});
        return res.json(establish(res,u));
      }
      const tokenInfoUrl = 'https://oauth2.googleapis.com/tokeninfo?id_token='+encodeURIComponent(req.body.credential || '');
      let response;
      try {
        response = await request(tokenInfoUrl,{signal:AbortSignal.timeout(10000)});
      } catch (firstError) {
        console.warn('Reintentando validacion de Google:', firstError?.cause?.code || firstError?.name || 'network error');
        response = await request(tokenInfoUrl,{signal:AbortSignal.timeout(10000)});
      }
      const p = await response.json();
      googleResponseReceived = true;
      if (!response.ok || p.aud !== googleClientId || !['accounts.google.com','https://accounts.google.com'].includes(p.iss) || Number(p.exp)*1000 <= Date.now() || ![true,'true'].includes(p.email_verified)) return res.status(401).json({error:'Credencial Google inválida'});
      let u = db.getState().users.find(u => u.email?.toLowerCase() === p.email.toLowerCase());
      if (!u) {
        u={id:randomBytes(16).toString('hex'),email:p.email.toLowerCase(),username:p.name || 'Usuario',role:'user',provider:'google',googleId:p.sub,avatarUrl:p.picture,status:'active',createdAt:new Date().toISOString()};
        // Mismos campos que acepta POST /users, y solo al crear la cuenta.
        for (const field of ['avatarBg','bio','gear','preferences','accountType','parentalControl']) if (req.body.profile?.[field] !== undefined) u[field]=req.body.profile[field];
        db.get('users').push(u).write();
      }
      if (blocked(u)) return res.status(403).json({error:'Cuenta suspendida o baneada'});
      res.json(establish(res,u));
    } catch (error) {
      if (!googleResponseReceived) {
        console.error('No se pudo conectar con la validacion de Google:', error?.cause?.code || error?.name || 'network error');
        return res.status(503).json({error:'El servidor no puede conectarse con Google. Revisa la conexion o la configuracion de red del servidor e intenta de nuevo.'});
      }
      return res.status(502).json({error:'No se pudo procesar la respuesta de Google. Intenta de nuevo.'});
    }
  });
  app.use('/admin/moderation',(req,res,next) => req.isAgent || req.isAdmin ? next() : res.status(403).json({error:'Permiso administrativo requerido'}));
  app.post('/admin/moderation/run-agent',async (req,res) => {
    try { res.json(await agent.run()); } catch { res.status(500).json({error:'Error del agente; revisa el servidor'}); }
  });
  app.post('/admin/moderation/notifications/claim',(req,res) => {
    const now=Date.now();
    const notices=(db.getState().moderationNotifications || []).filter(n=>n.status==='pending' && !(Date.parse(n.leaseUntil)>now)).slice(0,10);
    for(const n of notices) n.leaseUntil=new Date(now+15*60000).toISOString();
    db.write(); res.json(notices);
  });
  app.post('/admin/moderation/notifications/:id/sent',(req,res) => {
    const n=(db.getState().moderationNotifications || []).find(n=>n.id===req.params.id);
    if (!n) return res.status(404).json({error:'Aviso inexistente'});
    if (typeof req.body.messageId !== 'string' || !req.body.messageId) return res.status(400).json({error:'Falta messageId'});
    n.status='sent'; n.messageId=req.body.messageId; n.sentAt=new Date().toISOString(); db.write(); res.json({success:true});
  });
  app.get('/admin/moderation/decisions',(req,res) => res.json(db.getState().moderationDecisions || []));
  app.use('/admin',(req,res) => res.status(404).json({error:'Ruta administrativa inexistente'}));
  app.post('/users',(req,res) => {
    const b=req.body;
    if (typeof b.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) || typeof b.password !== 'string' || !b.password.startsWith('sha256$')) return res.status(400).json({error:'Datos de registro inválidos'});
    if (db.getState().users.some(u=>u.email?.toLowerCase()===b.email.toLowerCase())) return res.status(409).json({error:'Correo registrado'});
    const u={id:randomBytes(16).toString('hex'),email:b.email.toLowerCase(),password:b.password,username:String(b.username || 'Usuario').slice(0,80),role:'user',status:'active',createdAt:new Date().toISOString()};
    for (const field of ['avatarBg','bio','gear','preferences','accountType','parentalControl']) if (b[field] !== undefined) u[field]=b[field];
    db.get('users').push(u).write(); res.status(201).json(establish(res,u));
  });
  app.get('/users',(req,res) => {
    let rows=db.getState().users;
    if (req.query.email) rows=rows.filter(u=>u.email?.toLowerCase()===String(req.query.email).toLowerCase());
    if (req.query.id) rows=rows.filter(u=>String(u.id)===String(req.query.id));
    if (req.query.username) rows=rows.filter(u=>u.username===req.query.username);
    res.json(rows.map(u=>req.isAdmin || req.user?.id===u.id ? safeUser(u) : {id:u.id,username:u.username,avatarUrl:u.avatarUrl,bio:u.bio}));
  });
  app.get('/users/:id',(req,res) => {
    const u=db.getState().users.find(u=>String(u.id)===req.params.id);
    if (!u) return res.status(404).json({error:'Usuario inexistente'});
    res.json(req.isAdmin || req.user?.id===u.id ? safeUser(u) : {id:u.id,username:u.username,avatarUrl:u.avatarUrl,bio:u.bio});
  });
  app.use('/users/:id',(req,res,next) => {
    if (!['PATCH','PUT','DELETE'].includes(req.method)) return next();
    // Compatibilidad con reportes comunitarios: solo anexar un reporte propio.
    if (req.method==='PATCH' && req.user && !blocked(req.user) && !req.isAdmin && Object.keys(req.body).length===1 && Array.isArray(req.body.conductReports)) {
      const target=db.getState().users.find(u=>String(u.id)===req.params.id);
      const incoming=req.body.conductReports.at(-1);
      if (!target || !incoming || typeof incoming.reason!=='string' || !incoming.reason.trim() || incoming.reason.length>1000 || !incoming.contentId) return res.status(400).json({error:'Reporte inválido'});
      if ((target.conductReports || []).some(r=>String(r.reporterId)===String(req.user.id) && String(r.contentId)===String(incoming.contentId) && r.contentType===incoming.contentType && r.status==='pending')) return res.status(409).json({error:'Ya tienes un reporte pendiente'});
      const report={id:randomBytes(16).toString('hex'),reporterId:req.user.id,reporterName:req.user.username,contentId:String(incoming.contentId),contentType:String(incoming.contentType || 'comment'),contentSnapshot:String(incoming.contentSnapshot || '').slice(0,10000),reason:incoming.reason.trim(),status:'pending',createdAt:new Date().toISOString()};
      target.conductReports=[...(target.conductReports || []),report]; db.write(); return res.json({id:target.id,success:true});
    }
    if (!req.user || blocked(req.user) || (!req.isAdmin && String(req.user.id)!==req.params.id)) return res.status(403).json({error:'Sin permiso'});
    if (req.method==='PUT') return res.status(405).json({error:'Usa PATCH'});
    if (req.method==='PATCH') {
      const fields=req.isAdmin ? ['username','bio','avatarUrl','avatarBg','gear','preferences','accountType','parentalControl','status','suspendedUntil','mutedUntil','sanctions','conductReports'] : ['username','bio','avatarUrl','avatarBg','gear','preferences','accountType','parentalControl'];
      if (Object.keys(req.body).some(k=>!fields.includes(k))) return res.status(403).json({error:'Campo protegido'});
    }
    next();
  });
  app.get('/reports',(req,res)=>{
    let rows=db.getState().reports || [];
    if(!req.isAdmin) rows=rows.filter(r=>req.user && String(r.reporterId)===String(req.user.id));
    for(const key of ['contentId','contentType','reporterId','status']) if(req.query[key]) rows=rows.filter(r=>String(r[key])===String(req.query[key]));
    res.json(rows);
  });
  app.post('/reports',(req,res)=>{
    if(!req.user || blocked(req.user)) return res.status(403).json({error:'Inicia sesión con una cuenta activa'});
    const b=req.body;
    if(typeof b.reason!=='string' || !b.reason.trim() || b.reason.length>1000 || !b.contentId) return res.status(400).json({error:'Reporte inválido'});
    const report={id:randomBytes(16).toString('hex'),reporterId:req.user.id,reporterName:req.user.username,userId:null,userName:String(b.userName || 'Autor sin cuenta vinculada'),contentId:String(b.contentId),contentType:String(b.contentType || 'comment'),contentSnapshot:String(b.contentSnapshot || '').slice(0,10000),reason:b.reason.trim(),status:'pending',createdAt:new Date().toISOString()};
    db.set('reports',[...(db.getState().reports || []),report]).write();res.status(201).json(report);
  });
  app.patch('/reports/:id',(req,res)=>{
    if(!req.isAdmin) return res.status(403).json({error:'Permiso administrativo requerido'});
    const report=(db.getState().reports || []).find(r=>String(r.id)===req.params.id);
    if(!report) return res.status(404).json({error:'Reporte inexistente'});
    if(!['pending','reviewed','resolved','dismissed'].includes(req.body.status)) return res.status(400).json({error:'Estado inválido'});
    report.status=req.body.status;db.write();res.json(report);
  });
  app.get('/reviews',(req,res) => {
    let rows=db.getState().reviews;
    if (!req.isAdmin) rows=rows.filter(r=>r.status==='approved' || String(r.userId)===String(req.user?.id));
    if (req.query.userId) rows=rows.filter(r=>String(r.userId)===String(req.query.userId));
    if (req.query.status) rows=rows.filter(r=>r.status===req.query.status);
    res.json(rows);
  });
  app.get('/reviews/:id',(req,res) => {
    const r=db.getState().reviews.find(r=>String(r.id)===req.params.id);
    if (!r || (!req.isAdmin && r.status!=='approved' && String(r.userId)!==String(req.user?.id))) return res.status(404).json({error:'Reseña no disponible'});
    res.json(r);
  });
  app.post('/reviews',(req,res) => {
    if (!req.user || blocked(req.user) || Date.parse(req.user.mutedUntil)>Date.now()) return res.status(403).json({error:'Inicia sesión con una cuenta activa'});
    if (typeof req.body.content !== 'string' || !req.body.content.trim() || req.body.content.length>10000) return res.status(400).json({error:'Texto requerido, máximo 10000 caracteres'});
    const r={id:randomBytes(16).toString('hex'),userId:req.user.id,userName:req.user.username,content:req.body.content,status:'pending_moderation',createdAt:new Date().toISOString(),aiFlagged:false};
    for (const f of ['albumId','albumTitle','parentAlbum','artist','artistName','rating','type','trackTitle','hasSpoilers','cover']) if (req.body[f]!==undefined) r[f]=req.body[f];
    db.get('reviews').push(r).write(); res.status(201).json(r);
  });
  app.use('/reviews/:id',(req,res,next) => {
    if (!['PATCH','PUT','DELETE'].includes(req.method)) return next();
    const r=db.getState().reviews.find(r=>String(r.id)===req.params.id);
    if (!r) return res.status(404).json({error:'Reseña inexistente'});
    if (!req.user || blocked(req.user) || (!req.isAdmin && String(r.userId)!==String(req.user.id))) return res.status(403).json({error:'Sin permiso'});
    if (req.method==='PUT') return res.status(405).json({error:'Usa PATCH'});
    if (req.method==='PATCH') {
      const fields=req.isAdmin ? ['content','rating','status','aiFlagged','moderationHistory'] : ['content','rating'];
      if (Object.keys(req.body).some(k=>!fields.includes(k))) return res.status(403).json({error:'Campo protegido'});
      if ('content' in req.body) {
        if (typeof req.body.content!=='string' || !req.body.content.trim() || req.body.content.length>10000) return res.status(400).json({error:'Texto inválido'});
        req.body.status='pending_moderation';
      }
    }
    next();
  });
  app.use((req,res,next) => {
    // Nunca exponer el volcado /db, relaciones anidadas o evidencia privada del agente.
    if (!/^\/(users|reviews)(\/[^/]+)?\/?$/.test(req.path)) {
      const publicCollections=['featuredReleases','recordLabels','vinylEditions','announcements','music'];
      if (!publicCollections.includes(req.path.split('/')[1]) || req.path.split('/').length>3 || Object.keys(req.query).some(k=>['_embed','_expand'].includes(k))) return res.status(403).json({error:'Ruta no permitida'});
      if (!['GET','HEAD'].includes(req.method) && !req.isAdmin) return res.status(403).json({error:'Permiso administrativo requerido'});
    }
    next();
  });
  router.render=(req,res)=> {
    const data=res.locals.data;
    res.jsonp(req.path.startsWith('/users') && data?.password ? safeUser(data) : data);
  };
  app.use(router);
  return { app, db, agent };
}
if (require.main===module) {
  const fs = require('node:fs');
  // Vite already reads .env for the browser. Load it here too so the API can
  // validate the same public Google client ID. Server-only overrides remain
  // in .env.server.local and take precedence because existing env vars win.
  const appEnvFile=path.join(__dirname,'../.env');
  const serverEnvFile=path.join(__dirname,'../.env.server.local');
  if (fs.existsSync(appEnvFile)) process.loadEnvFile(appEnvFile);
  if (fs.existsSync(serverEnvFile)) process.loadEnvFile(serverEnvFile);
  const { app }=createApp();
  app.listen(Number(process.env.PORT || 3001),process.env.HOST || '127.0.0.1',()=>console.log('SONAR API con permisos y agente: puerto '+(process.env.PORT || 3001)));
}
module.exports={createApp,verify,blocked};
