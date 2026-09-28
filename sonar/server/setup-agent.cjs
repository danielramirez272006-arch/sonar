const fs = require('node:fs');
const path = require('node:path');
const { randomBytes } = require('node:crypto');
const target = path.join(__dirname,'../.env.server.local');
if (fs.existsSync(target)) {
  console.log('.env.server.local ya existe; no se ha sobrescrito.');
} else {
  const template=fs.readFileSync(path.join(__dirname,'../.env.server.example'),'utf8');
  fs.writeFileSync(target,template.replace('SONAR_AGENT_TOKEN=','SONAR_AGENT_TOKEN='+randomBytes(32).toString('hex')),{flag:'wx'});
  console.log('.env.server.local creado con token aleatorio. Completa las claves IA y el nombre del modelo; el token no se muestra en consola.');
}
