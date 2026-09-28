import fs from 'node:fs';
const rows = {
 'auth.invalid_email': ['Por favor ingresa un correo electrónico válido.', 'Please enter a valid email address.', 'Saisissez une adresse e-mail valide.', 'Inserisci un indirizzo email valido.', '请输入有效邮箱。', '有効なメールアドレスを入力してください。'],
 'page.news.automatedService': ['n8n Webhook Automatizado', 'Automated n8n webhook', 'Webhook n8n automatisé', 'Webhook n8n automatico', 'n8n 自动 Webhook', 'n8n自動Webhook'],
 'explore.album_of_week': ['Álbum Destacado de la Semana', 'Featured album of the week', 'Album de la semaine', 'Album della settimana', '本周精选专辑', '今週の注目アルバム'],
 'shortcuts.a11y_group': ['Accesibilidad y Asistencia', 'Accessibility and assistance', 'Accessibilité et assistance', 'Accessibilità e assistenza', '无障碍与辅助', 'アクセシビリティと補助'],
 'shortcuts.media_group': ['Reproducción y Control Multimedia', 'Playback and media controls', 'Lecture et commandes multimédias', 'Riproduzione e controlli multimediali', '播放与媒体控制', '再生とメディア操作'],
 'shortcuts.nav_group': ['Navegación Rápida', 'Quick navigation', 'Navigation rapide', 'Navigazione rapida', '快速导航', 'クイックナビゲーション'],
 'shortcuts.title': ['Atajos de Teclado', 'Keyboard shortcuts', 'Raccourcis clavier', 'Scorciatoie da tastiera', '键盘快捷键', 'キーボードショートカット'],
 'shortcuts.subtitle': ['Navega de forma rápida y accesible por todo SONAR sin usar el ratón.', 'Navigate SONAR quickly and accessibly without a mouse.', 'Naviguez rapidement dans SONAR sans souris.', 'Naviga in SONAR rapidamente senza mouse.', '无需鼠标即可快速便捷地浏览 SONAR。', 'マウスなしでSONARをすばやく操作できます。'],
};
for (const [index,lang] of ['es','en','fr','it','zh','ja'].entries()) {
 const file = `src/shared/i18n/locales/${lang}.json`;
 const data = JSON.parse(fs.readFileSync(file,'utf8'));
 for (const [key,values] of Object.entries(rows)) data[key] = values[index];
 fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
}
for (const form of ['login','register','forgot-password']) {
 const file = `src/features/auth/components/${form}-form.jsx`;
 let source = fs.readFileSync(file,'utf8');
 for (const expression of ['activeError','errorMessage','strength.label']) source = source.replaceAll(`{${expression}}`,`{ui(${expression})}`);
 fs.writeFileSync(file,source);
}
