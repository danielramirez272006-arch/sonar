const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createApp } = require('./api.cjs');
const { versionOf } = require('./moderation-agent.cjs');
function fixture() { return { users:[{id:'admin',email:'admin@sonar.local',password:'test-admin',role:'admin'},{id:'u',email:'author@example.com',username:'Author',password:'test-user',role:'user'}],reviews:[{id:'r',userId:'u',content:'Comentario de prueba',status:'pending_moderation'}] }; }
async function setup(t, request, data=fixture()) {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sonar-agent-')), filename=path.join(dir,'db.json'); fs.writeFileSync(filename,JSON.stringify(data));
  const env={SONAR_AGENT_TOKEN:'a'.repeat(64),GEMINI_API_KEY:'test',GEMINI_MODEL:'test',OPENROUTER_API_KEY:'test'};
  const service=createApp({filename,env,request});
  const server=service.app.listen(0,'127.0.0.1'); await new Promise(resolve=>server.once('listening',resolve));
  t.after(async()=>{await new Promise(resolve=>server.close(resolve));fs.rmSync(dir,{recursive:true,force:true});});
  const url=`http://127.0.0.1:${server.address().port}`;
  const call=(p,body,headers={})=>fetch(url+p,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json',...headers},...(body===undefined?{}:{body:JSON.stringify(body)})});
  return {...service,call,filename,url};
}
const decision={offensive:true,severity:'high',confidence:0.99,reason:'Amenaza dirigida'};
test('agente llama herramientas, suspende, elimina y deja correo pendiente',async t=>{
  const calls=[];
  const request=async(url,options)=>{
    const body=JSON.parse(options.body); calls.push(body);
    const tool=[{name:'buscar_resenas',args:{}},{name:'leer_resena',args:{reviewId:'r'}},{name:'registrar_decision',args:{reviewId:'r',...decision}}][calls.length-1];
    return new Response(JSON.stringify({candidates:[{content:{role:'model',parts:[{functionCall:tool}]}}]}));
  };
  const {agent,db,call}=await setup(t,request);
  const cookie=(await call('/auth/login',{email:'author@example.com',password:'test-user'})).headers.get('set-cookie').split(';')[0];
  const result=await agent.run(); assert.equal(result.success,true); assert.equal(calls.length,3);
  assert.equal(db.getState().reviews.length,0); assert.equal(db.getState().users[1].status,'suspended');
  assert.equal(db.getState().moderationNotifications[0].email,'author@example.com');
  assert.equal((await call('/reviews',{content:'Otra reseña'},{cookie})).status,403);
  assert.equal((await call('/auth/login',{email:'author@example.com',password:'test-user'})).status,403);
  assert.equal((await call('/auth/me',undefined,{cookie})).status,401);
  assert.equal((await agent.run()).processed,0);
});
test('fallback OpenRouter usa herramientas tras fallo Gemini',async t=>{
  let count=0;
  const request=async url=>{
    if(url.includes('googleapis')) return new Response('{}',{status:429});
    const tool=[{name:'buscar_resenas',args:{}},{name:'leer_resena',args:{reviewId:'r'}},{name:'registrar_decision',args:{reviewId:'r',offensive:false,severity:'none',confidence:0.99,reason:'Critica musical'}}][count++];
    return new Response(JSON.stringify({choices:[{message:{role:'assistant',tool_calls:[{id:`call-${count}`,type:'function',function:{name:tool.name,arguments:JSON.stringify(tool.args)}}]}}]}));
  };
  const {agent,db}=await setup(t,request);
  assert.equal((await agent.run()).provider,'openrouter'); assert.equal(db.getState().reviews[0].status,'approved');
});
test('fallo de ambos proveedores no elimina ni sanciona',async t=>{
  const {agent,db}=await setup(t,async()=>new Response('{}',{status:503}));
  assert.equal((await agent.run()).success,false); assert.equal(db.getState().reviews.length,1); assert.equal(db.getState().users[1].status,undefined);
});
test('decision idempotente, version obsoleta y formato invalido',async t=>{
  const {agent,db}=await setup(t);
  const version=versionOf(db.getState().reviews[0]);
  assert.throws(()=>agent.apply('r','obsoleta',decision));
  assert.throws(()=>agent.apply('r',version,{...decision,offensive:false}));
  agent.apply('r',version,decision); const until=db.getState().users[1].suspendedUntil;
  agent.apply('r',version,decision); assert.equal(db.getState().users[1].suspendedUntil,until); assert.equal(db.getState().moderationNotifications.length,1);
});
test('baja confianza mantiene pendiente; expiracion permite acceso',async t=>{
  const {agent,db,call}=await setup(t);
  agent.apply('r',versionOf(db.getState().reviews[0]),{...decision,confidence:0.4});
  assert.equal(db.getState().reviews[0].status,'pending_moderation'); assert.equal(agent.pending().length,0);
  db.getState().users[1].status='suspended';db.getState().users[1].suspendedUntil='2020-01-01T00:00:00Z';db.write();
  assert.equal((await call('/auth/login',{email:'author@example.com',password:'test-user'})).status,200);
});
test('permisos: no exponer claves/evidencia ni permitir suplantar autor',async t=>{
  const {call,db,url}=await setup(t);
  assert.equal((await call('/admin/moderation/run-agent',{})).status,403);
  assert.equal((await call('/db')).status,403);
  assert.equal((await call('/moderationDecisions')).status,403);
  assert.equal((await call('/users/u/reviews')).status,403);
  assert.equal((await (await call('/users')).json()).some(u=>u.password),false);
  const cookie=(await call('/auth/login',{email:'author@example.com',password:'test-user'})).headers.get('set-cookie').split(';')[0];
  const created=await (await call('/reviews',{content:'Buen disco',userId:'admin',status:'approved'},{cookie})).json();
  assert.equal(created.userId,'u');assert.equal(created.status,'pending_moderation');
  const forged=await fetch(url+'/users/u',{method:'PATCH',headers:{cookie,'Content-Type':'application/json'},body:JSON.stringify({role:'admin',status:'active'})});
  assert.equal(forged.status,403); assert.equal(db.getState().users[1].role,'user');
  assert.equal(db.getState().reviews.length,2);
});
test('reserva de correo impide entregas concurrentes y confirmacion es persistente',async t=>{
  const {agent,db,call}=await setup(t);
  agent.apply('r',versionOf(db.getState().reviews[0]),decision);
  const headers={authorization:'Bearer '+'a'.repeat(64)};
  const first=await (await call('/admin/moderation/notifications/claim',{},headers)).json();
  assert.equal(first.length,1);
  assert.equal((await (await call('/admin/moderation/notifications/claim',{},headers)).json()).length,0);
  db.getState().moderationNotifications[0].leaseUntil='2020-01-01T00:00:00Z'; db.write();
  assert.equal((await (await call('/admin/moderation/notifications/claim',{},headers)).json()).length,1);
  assert.equal((await call('/admin/moderation/notifications/'+first[0].id+'/sent',{messageId:'gmail-test'},headers)).status,200);
  assert.equal(db.getState().moderationNotifications[0].status,'sent');
});
test('el agente no puede decidir sobre IDs que no busco y leyo',async t=>{
  let count=0;
  const {agent,db}=await setup(t,async()=> {
    count++;
    if(count>1) return new Response('{}',{status:503});
    return new Response(JSON.stringify({candidates:[{content:{role:'model',parts:[{functionCall:{name:'registrar_decision',args:{reviewId:'r',...decision}}}]}}]}));
  });
  assert.equal((await agent.run()).success,false);
  assert.equal(db.getState().reviews.length,1);assert.equal(db.getState().users[1].status,undefined);
});
test('reportar no permite modificar sanciones o reportes anteriores',async t=>{
  const {call,db,url}=await setup(t);
  const cookie=(await call('/auth/login',{email:'author@example.com',password:'test-user'})).headers.get('set-cookie').split(';')[0];
  const res=await fetch(url+'/users/admin',{method:'PATCH',headers:{cookie,'Content-Type':'application/json'},body:JSON.stringify({conductReports:[{contentId:'r',contentType:'review',reason:'Revisar',reporterId:'admin',status:'resolved'}]})});
  assert.equal(res.status,200);
  assert.equal(db.getState().users[0].conductReports[0].reporterId,'u');
  assert.equal(db.getState().users[0].conductReports[0].status,'pending');
  assert.equal(db.getState().users[0].role,'admin');
});
