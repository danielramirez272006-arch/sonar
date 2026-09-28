import fs from 'fs';

const file = 'src/shared/i18n/locales/interface-messages.js';
const lines = fs.readFileSync(file, 'utf8').split('\r\n');
const idx = lines.findIndex(l => l.trim() === '`.trim().split(\'\\n\').map(row => row.split(\'|\'));');
if (idx < 0) throw new Error('no encontre el cierre del template');

const rows = [
  'Crítica Verificada|Verified review|Critique vérifiée|Recensione verificata|认证乐评|認証レビュー',
  'Top Reseñador|Top Reviewer|Top Critique|Top Recensore|最佳乐评人|トップレビュアー',
  'Curadora|Curator|Curatrice|Curatrice|策展人|キュレーター',
  'Selección Editorial|Editorial Pick|Choix de la rédaction|Scelta editoriale|编辑精选|編集部ピック',
  'Voto de la Comunidad|Community Vote|Vote de la communauté|Voto della community|社区投票|コミュニティ投票',
  'Puntuación Perfecta|Perfect Score|Note parfaite|Punteggio perfetto|满分|満点',
  'Popular|Popular|Populaire|Popolare|热门|人気',
  'Hi-Fi Pro|Hi-Fi Pro|Hi-Fi Pro|Hi-Fi Pro|Hi-Fi 专业版|Hi-Fi プロ',
  'Calidez|Warmth|Chaleur|Calore|温暖音色|温もり',
  'Prioritario|Priority|Prioritaire|Prioritario|优先|優先',
  'Grave|Severe|Grave|Grave|严重|重大',
  'General|General|Général|Generale|一般|一般',
];

const fresh = rows.filter(r => !lines.includes(r));
if (fresh.length) {
  lines.splice(idx, 0, ...fresh);
  fs.writeFileSync(file, lines.join('\r\n'), 'utf8');
}
for (const r of fresh) {
  const cells = r.split('|');
  if (cells.length !== 6) throw new Error(`fila con ${cells.length} columnas: ${r}`);
}
console.log(`+${fresh.length} claves de badges`);
