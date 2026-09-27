const fs = require('fs');
const {parse} = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const rows = [];
for (const file of fs.readdirSync('src', {recursive:true}).filter(f => f.endsWith('.jsx') && !f.includes('.test.'))) {
 const source = fs.readFileSync(`src/${file}`, 'utf8');
 const ast = parse(source,{sourceType:'module',plugins:['jsx']});
 traverse(ast, {
  StringLiteral(p) {
   let a = p.parentPath;
   while (a?.isConditionalExpression() || a?.isLogicalExpression()) a = a.parentPath;
   if (a?.isJSXExpressionContainer() && (!a.parentPath.isJSXAttribute() || ['title','placeholder','aria-label','alt'].includes(a.parentPath.node.name.name)) && /[a-záéíóúñ]/i.test(p.node.value)) rows.push({file: file.replaceAll('\\','/'),line:p.node.loc.start.line,text:p.node.value});
  },
  TemplateLiteral(p) {
   if (p.findParent(a=>a.isJSXExpressionContainer()) && /[áéíóúñ]|[A-Z][a-z]+ [a-z]/.test(p.node.quasis.map(q=>q.value.cooked).join(' '))) rows.push({file:file.replaceAll('\\','/'),line:p.node.loc.start.line,text:source.slice(p.node.start,p.node.end)});
  }
 });
}
fs.writeFileSync('scripts/i18n-expressions.json',JSON.stringify(rows,null,2));
console.log(`${rows.length} expressions`);
console.log([...new Set(rows.map(r=>r.text))].join('\n'));
