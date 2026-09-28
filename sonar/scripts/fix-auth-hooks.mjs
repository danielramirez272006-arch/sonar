import fs from 'node:fs';
for (const [file, component, handler] of [
 ['login-form', 'LoginForm', 'handleGoogleLogin'],
 ['register-form', 'RegisterForm', 'handleGoogleRegister'],
]) {
 const filename = `src/features/auth/components/${file}.jsx`;
 let source = fs.readFileSync(filename,'utf8');
 source = source.replace("import { useGoogleLogin }", "import { GoogleOAuthProvider, useGoogleLogin }");
 source = source.replace("import { useLanguage } from '../../../shared/context/language-context';\n", '');
 source = source.replace(`export const ${component} =`, `const ${component}Content =`);
 source = source.replace(new RegExp(`  let ${handler} = \\(\\) => \\{\\};\\s*try \\{\\s*${handler} = useGoogleLogin`), `  const ${handler} = useGoogleLogin`);
 source = source.replace(new RegExp(`  \\} catch \\{\\s*${handler} = \\(\\) => \\{\\};\\s*\\}`), '');
 source = source.replace(`export default ${component};`, `export const ${component} = () => (\n  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>\n    <${component}Content />\n  </GoogleOAuthProvider>\n);\n\nexport default ${component};`);
 fs.writeFileSync(filename, source);
}
const app = 'src/App.jsx';
let source = fs.readFileSync(app,'utf8');
source = source.replace(/^import \{ GoogleOAuthProvider \}[^\n]*\n/m,'');
source = source.replace(/\s*<GoogleOAuthProvider clientId=\{import.meta.env.VITE_GOOGLE_CLIENT_ID \|\| ''\}>/,'');
source = source.replace(/\s*<\/GoogleOAuthProvider>/,'');
fs.writeFileSync(app,source);
for (const file of fs.readdirSync('src',{recursive:true}).filter(f=>f.endsWith('.jsx'))) {
 const p = `src/${file}`;
 const s = fs.readFileSync(p,'utf8');
 if (s.includes('\ufeff')) fs.writeFileSync(p,s.replace(/\ufeff/g,''));
}
