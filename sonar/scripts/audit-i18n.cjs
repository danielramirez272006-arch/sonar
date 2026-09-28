const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const files = fs.readdirSync('src', { recursive: true }).filter(f => /\.jsx$/.test(f) && !f.includes('.test.'));
const rows = [];
for (const file of files) {
 const source = fs.readFileSync(path.join('src', file), 'utf8');
 const ast = parser.parse(source, { sourceType: 'module', plugins: ['jsx'] });
 traverse(ast, {
  JSXText(p) {
   const text = p.node.value.replace(/\s+/g, ' ').trim();
   if (/[a-zA-ZÀ-ÿ]/.test(text)) rows.push({ file: file.replaceAll('\\', '/'), line: p.node.loc.start.line, text, kind: 'text' });
  },
  StringLiteral(p) {
   const parent = p.parent;
   if (parent.type === 'JSXAttribute' && ['placeholder','title','aria-label','alt','label','description'].includes(parent.name.name))
    rows.push({ file: file.replaceAll('\\', '/'), line: p.node.loc.start.line, text: p.node.value, kind: 'attribute' });
  }
 });
}
fs.writeFileSync('scripts/i18n-audit.json', JSON.stringify(rows, null, 2));
console.log(`${rows.length} literal UI strings in ${new Set(rows.map(r => r.file)).size} files`);
const counts = {};
for (const r of rows) counts[r.file] = (counts[r.file] || 0) + 1;
console.log(counts);
