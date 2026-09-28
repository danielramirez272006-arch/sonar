import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const LOCALES = 'src/shared/i18n/locales';
const LANGS = ['es', 'en', 'fr', 'it', 'zh', 'ja'];
const probe = [
  'Crítica Verificada', 'Top Reseñador', 'Curadora',
  'Selección Editorial', 'Voto de la Comunidad', 'Puntuación Perfecta',
  'Popular', 'Hi-Fi Pro', 'Vinilo', 'Calidez',
  'Prioritario', 'Grave', 'Moderación', 'Comunidad', 'General',
];

const found = new Map();
for (const f of fs.readdirSync(LOCALES).filter(x => x.endsWith('-messages.js'))) {
  const mod = await import(pathToFileURL(path.resolve(LOCALES, f)).href);
  let t = null;
  for (const v of Object.values(mod)) if (v && typeof v === 'object' && v.es && typeof v.es === 'object' && v.en) { t = v; break; }
  if (!t) continue;
  const isTemplate = !Object.keys(t.es).some(k => k.includes('.'));
  for (const [k, v] of Object.entries(t.es)) {
    for (const p of probe) {
      if (isTemplate ? k === p : v === p) {
        const langs = LANGS.filter(l => typeof t[l][k] === 'string' && t[l][k] !== '');
        const arr = found.get(p) || [];
        arr.push(`${f} :: ${k} -> [${langs.length}/6] ${langs.length === 6 ? 'YA COMPLETA' : 'INCOMPLETA'}`);
        found.set(p, arr);
      }
    }
  }
}
for (const p of probe) {
  const hits = found.get(p);
  console.log(hits ? hits.join('\n     ') : `NUEVA   "${p}"`);
}
