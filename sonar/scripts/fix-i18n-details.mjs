import fs from 'node:fs';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
const traverse = traverseModule.default;
// An option's visible translation must never become its persisted value.
for (const file of fs.readdirSync('src', { recursive: true }).filter(f => f.endsWith('.jsx'))) {
 const filename = `src/${file}`;
 let source = fs.readFileSync(filename, 'utf8');
 const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
 const edits = [];
 traverse(ast, { JSXElement(p) {
  const opening = p.node.openingElement;
  if (opening.name.name !== 'option' || opening.attributes.some(a => a.name?.name === 'value')) return;
  const children = p.node.children.filter(c => c.type !== 'JSXText' || c.value.trim());
  if (children.length !== 1 || children[0].type !== 'JSXExpressionContainer') return;
  const expression = children[0].expression;
  if (expression.type === 'CallExpression' && expression.callee.name === 'ui' && expression.arguments[0]?.type === 'StringLiteral')
   edits.push([opening.name.end, ` value=${JSON.stringify(expression.arguments[0].value)}`]);
 }});
 for (const [offset, text] of edits.sort((a,b) => b[0] - a[0])) source = source.slice(0,offset) + text + source.slice(offset);
 if (edits.length) fs.writeFileSync(filename, source);
}
const catalog = 'src/pages/admin/catalog-page.jsx';
let source = fs.readFileSync(catalog, 'utf8');
source = source.replace("t(`admin.catalog.field.${key}`, { defaultValue: label })", "ui(label)");
source = source.replace("`${editor.id != null ? 'Editar' : 'Crear'} ${definition.singular}`", "`${editor.id != null ? t('admin.catalog.edit') : t('admin.catalog.newRecord')} ${catalogSingular}`");
fs.writeFileSync(catalog, source);
