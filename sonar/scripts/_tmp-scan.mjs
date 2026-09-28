import fs from 'fs';
import path from 'path';

const ROOT = 'src';
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'i18n') walk(p); }
    else if (/\.(jsx?|mjs)$/.test(e.name)) files.push(p);
  }
})(ROOT);

const skipFile = f => /i18n\/locales|\.test\.|__tests__|scripts\//.test(f);

// una frase "tipo UI": prosa, sin marcas de className ni datos SVG
const CSSY = /\b(text|bg|border|flex|grid|items|justify|px|py|pt|pb|pl|pr|mt|mb|ml|mr|gap|rounded|font|overflow|opacity|shadow|transition|duration|animate|min|max|space|col|row|top|left|right|bottom|inset|cursor|select|object|ring|absolute|relative|inline|hidden|hover|focus|disabled|group|peer|dark|light|uppercase|truncate|nowrap|break|whitespace|pointer|events|touch|will|order|basis|grow|shrink|self|place|content|divide|backdrop|filter|mix|blur|brightness|contrast|drop|grayscale|invert|saturate|sepia|transform|origin|scale|rotate|translate|skew|matrix|list|appearance|outline|caret|accent|scroll|snap|will|scrollbar|touch|resize|cursor|zoom|float|clear|clip|isolation|mix|contain)\b/;
const looksLikePhrase = s => {
  if (!s || s.length < 6 || s.length > 160) return false;
  if (/[<>{}]|\/\*|\$\{|\bfunction\b/.test(s)) return false;
  if (/[[\]]/.test(s)) return false;                                 // clases con corchetes
  if (/#[0-9a-fA-F]{3,8}\b/.test(s)) return false;                     // colores
  if (/rgba?\(|hsla?\(/.test(s)) return false;
  if (CSSY.test(s)) return false;
  if (/^\s*[Mm]\s*[\d.\-]/.test(s) || /[Mm]\d+\.\d+[a-z]/i.test(s)) return false; // paths SVG
  if (/^[a-z0-9_.:/#@$-]+$/.test(s)) return false;
  if (/^[\d\s.,:%$€#@+/*()-]+$/.test(s)) return false;
  if (!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(s)) return false;
  if (!/\s/.test(s)) return false;                                    // al menos 2 palabras
  // laMayoria debe ser letras/espacios/puntuacion de prosa
  const letters = (s.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g) || []).length;
  return letters / s.length > 0.5;
};

const CALLS = new Set(['ui', 't', 'alt', 'title', 'label']);
const out = new Map();

for (const f of files) {
  if (skipFile(f)) continue;
  const src = fs.readFileSync(f, 'utf8');
  // localizar argumentos de ui()/t() para excluirlos
  const wrapped = [];
  const callRe = /\b(ui|t)\s*\(\s*(?:'([^']*)'|"([^"]*)"|`([^`]*)`)/g;
  let m;
  while ((m = callRe.exec(src))) wrapped.push([m.index + m[0].length, m.index + m[0].length + (m[2] ?? m[3] ?? m[4] ?? '').length]);
  const inWrapped = i => wrapped.some(([a, b]) => i >= a && i <= b);

  const litRe = /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g;
  let l;
  while ((l = litRe.exec(src))) {
    const value = l[2];
    if (inWrapped(l.index)) continue;
    if (!looksLikePhrase(value)) continue;
    const line = src.slice(0, l.index).split('\n').length;
    if (!out.has(f)) out.set(f, []);
    out.get(f).push({ line, value });
  }
}

let total = 0;
for (const [f, items] of [...out].sort((a, b) => b[1].length - a[1].length)) {
  total += items.length;
  console.log(`\n== ${f}  (${items.length})`);
  for (const it of items) console.log(`   L${it.line}  ${it.value}`);
}
console.log(`\nTOTAL frases crudas: ${total}`);
