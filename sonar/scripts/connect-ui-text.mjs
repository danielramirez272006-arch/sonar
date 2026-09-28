import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import { ADMIN_TRANSLATIONS } from '../src/shared/i18n/locales/admin-messages.js';
import { PAGE_TRANSLATIONS } from '../src/shared/i18n/locales/page-messages.js';
import { UI_TRANSLATIONS } from '../src/shared/i18n/locales/ui-messages.js';
import { INTERFACE_TRANSLATIONS } from '../src/shared/i18n/locales/interface-messages.js';
import { PROFILE_TRANSLATIONS } from '../src/shared/i18n/locales/profile-messages.js';
import { CONTROLS_TRANSLATIONS } from '../src/shared/i18n/locales/controls-messages.js';
import { DETAILS_TRANSLATIONS } from '../src/shared/i18n/locales/details-messages.js';
import { FAMILY_TRANSLATIONS } from '../src/shared/i18n/locales/family-messages.js';
import { STATE_TRANSLATIONS } from '../src/shared/i18n/locales/state-messages.js';
import { FEEDBACK_TRANSLATIONS } from '../src/shared/i18n/locales/feedback-messages.js';
const traverse = traverseModule.default;
const es = JSON.parse(fs.readFileSync('src/shared/i18n/locales/es.json', 'utf8'));
const known = new Set([...Object.values({...es, ...ADMIN_TRANSLATIONS.es, ...PAGE_TRANSLATIONS.es}), ...Object.keys(UI_TRANSLATIONS.es), ...Object.keys(INTERFACE_TRANSLATIONS.es), ...Object.keys(PROFILE_TRANSLATIONS.es), ...Object.keys(CONTROLS_TRANSLATIONS.es), ...Object.keys(DETAILS_TRANSLATIONS.es), ...Object.keys(FAMILY_TRANSLATIONS.es), ...Object.keys(STATE_TRANSLATIONS.es), ...Object.keys(FEEDBACK_TRANSLATIONS.es)]);
let total = 0;
for (const file of fs.readdirSync('src', { recursive: true }).filter(f => /\.jsx$/.test(f) && !f.includes('.test.'))) {
 const filename = path.join('src', file);
 let source = fs.readFileSync(filename, 'utf8');
 const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
 const edits = [];
 const owners = new Map();
 function owner(p) {
  for (let parent = p.parentPath; parent; parent = parent.parentPath) {
   if (!parent.isFunction()) continue;
   const name = parent.node.id?.name || (parent.parentPath.isVariableDeclarator() ? parent.parentPath.node.id.name : '');
   if (/^[A-Z]/.test(name)) return parent.node;
  }
 }
 function replace(p, text, wrap, raw = text, options = '') {
  if (!known.has(text) || !text.trim()) return;
  const component = owner(p);
  if (!component) return;
  const code = `ui(${JSON.stringify(text)}${options})`;
  // Preserve the spacing React gives inline text next to icons and dynamic values.
  const before = /^\s/.test(raw) && !/^\s*\n/.test(raw) ? ' ' : '';
  const after = /\s$/.test(raw) && !/\n\s*$/.test(raw) ? ' ' : '';
  const replacement = wrap === 'text' ? `${before}{${code}}${after}` : wrap ? `{${code}}` : code;
  edits.push([p.node.start, p.node.end, replacement]);
  owners.set(component.start, component);
 }
 traverse(ast, {
  TemplateLiteral(p) {
   if (!p.findParent(a => a.isJSXExpressionContainer())) return;
   const text = p.node.quasis.map((q,i) => q.value.cooked + (i < p.node.expressions.length ? `{{value${i}}}` : '')).join('');
   const options = p.node.expressions.map((e,i) => `value${i}: ${source.slice(e.start,e.end)}`).join(', ');
   replace(p,text,false,text,`, { ${options} }`);
  },
  JSXText(p) { replace(p, p.node.value.replace(/\s+/g, ' ').trim(), 'text', p.node.value); },
  StringLiteral(p) {
   const parent = p.parent;
   if (parent.type === 'JSXAttribute' && ['placeholder','title','aria-label','alt','label','description'].includes(parent.name.name)) {
    replace(p, p.node.value, true); return;
   }
   // Literal branches of visible expressions, never values, IDs, styles or filters.
   let ancestor = p.parentPath;
   while (ancestor?.isConditionalExpression() || ancestor?.isLogicalExpression() || ancestor?.isParenthesizedExpression()) ancestor = ancestor.parentPath;
   if (ancestor?.isJSXExpressionContainer() && !ancestor.parentPath.isJSXAttribute()) replace(p, p.node.value, false);
   if (ancestor?.isJSXExpressionContainer() && ancestor.parentPath.isJSXAttribute() && ['title','aria-label','placeholder','alt'].includes(ancestor.parentPath.node.name.name)) replace(p, p.node.value, false);
  },
 });
 if (!edits.length) continue;
 for (const component of owners.values()) {
  if (component.body.type === 'BlockStatement') {
   if (!source.slice(component.body.start, component.body.end).includes('const ui = useUIText()')) edits.push([component.body.start + 1, component.body.start + 1, '\n  const ui = useUIText();']);
  } else {
   const arrowEnd = source.indexOf('=>', component.start) + 2;
   edits.push([arrowEnd, component.body.start, ' { const ui = useUIText(); return (']);
   edits.push([component.body.end, component.end, '); }']);
  }
 }
 edits.sort((a,b) => b[0] - a[0]);
 for (const [start,end,replacement] of edits) source = source.slice(0,start) + replacement + source.slice(end);
 if (!source.includes("import { useUIText }")) {
  const relative = path.relative(path.dirname(filename), 'src/shared/i18n/use-ui-text.js').replaceAll('\\', '/');
  source = `import { useUIText } from '${relative.startsWith('.') ? relative : './' + relative}';\n` + source;
 }
 fs.writeFileSync(filename, source);
 total += edits.length;
}
console.log(`${total} UI edits`);
