const rows = `
Por favor introduce un nombre de usuario.|Please enter a username.|Saisissez un nom d’utilisateur.|Inserisci un nome utente.|请输入用户名。|ユーザー名を入力してください。
Por favor introduce un correo electrónico válido.|Please enter a valid email address.|Saisissez une adresse e-mail valide.|Inserisci un indirizzo email valido.|请输入有效邮箱。|有効なメールアドレスを入力してください。
El PIN de control parental para cuenta Junior debe tener exactamente 4 dígitos (ej. 1234).|The Junior parental PIN must have exactly 4 digits (e.g. 1234).|Le PIN parental Junior doit contenir 4 chiffres (ex. 1234).|Il PIN genitori Junior deve avere 4 cifre (es. 1234).|青少年账户的家长 PIN 必须为4位数字（如1234）。|ジュニアの保護者PINは4桁にしてください（例：1234）。
Este correo ya está registrado en SONAR. Por favor inicia sesión o recupera tu contraseña.|This email is already registered with SONAR. Sign in or reset your password.|Cet e-mail est déjà inscrit sur SONAR. Connectez-vous ou réinitialisez votre mot de passe.|Questa email è già registrata su SONAR. Accedi o reimposta la password.|此邮箱已在 SONAR 注册，请登录或重置密码。|このメールはSONARに登録済みです。ログインするかパスワードを再設定してください。
No se pudo enviar el código de verificación a tu correo.|Could not email the verification code.|Impossible d’envoyer le code de vérification.|Impossibile inviare il codice di verifica.|无法向邮箱发送验证码。|確認コードを送信できませんでした。
Por favor ingresa el código de 6 dígitos que llegó a tu correo.|Enter the 6-digit code sent to your email.|Saisissez le code à 6 chiffres reçu par e-mail.|Inserisci il codice di 6 cifre ricevuto via email.|请输入邮箱收到的六位验证码。|メールで受信した6桁のコードを入力してください。
El código debe tener exactamente 6 dígitos.|The code must have exactly 6 digits.|Le code doit contenir exactement 6 chiffres.|Il codice deve avere esattamente 6 cifre.|验证码必须为6位数字。|コードは6桁にしてください。
El código de 6 dígitos ingresado es incorrecto. Por favor revisa tu correo e inténtalo de nuevo.|The code is incorrect. Check your email and try again.|Le code est incorrect. Vérifiez votre e-mail et réessayez.|Il codice è errato. Controlla l’email e riprova.|验证码错误，请检查邮箱后重试。|コードが違います。メールを確認して再試行してください。
La contraseña debe tener al menos 6 caracteres.|Password must have at least 6 characters.|Le mot de passe doit contenir au moins 6 caractères.|La password deve avere almeno 6 caratteri.|密码必须至少包含6个字符。|パスワードは6文字以上にしてください。
Debes aceptar los Términos y Condiciones para crear tu cuenta.|Accept the terms and conditions to create your account.|Acceptez les conditions pour créer votre compte.|Accetta i termini per creare l’account.|创建账户须接受条款与条件。|アカウント作成には利用規約への同意が必要です。
No se pudo completar el registro. Inténtalo de nuevo.|Could not complete registration. Try again.|Inscription impossible. Réessayez.|Registrazione non completata. Riprova.|无法完成注册，请重试。|登録できませんでした。再試行してください。
No se pudo conectar con Google.|Could not connect to Google.|Connexion à Google impossible.|Impossibile connettersi a Google.|无法连接 Google。|Googleに接続できませんでした。
Aceptable|Acceptable|Acceptable|Accettabile|尚可|普通
Ingresa el código que acabamos de enviar a {{value0}}.|Enter the code we just sent to {{value0}}.|Saisissez le code envoyé à {{value0}}.|Inserisci il codice inviato a {{value0}}.|输入刚发送至 {{value0}} 的验证码。|{{value0}}に送信したコードを入力してください。
Reenviar código en {{value0}}s|Resend code in {{value0}}s|Renvoyer le code dans {{value0}} s|Invia di nuovo tra {{value0}} s|{{value0}}秒后重新发送|{{value0}}秒後に再送信
Reenviar código ({{value0}}s)|Resend code ({{value0}}s)|Renvoyer le code ({{value0}} s)|Invia di nuovo ({{value0}} s)|重新发送（{{value0}}秒）|再送信（{{value0}}秒）
Portada de {{value0}}|Cover of {{value0}}|Couverture de {{value0}}|Copertina di {{value0}}|{{value0}} 的封面|{{value0}}のカバー
Análisis lírico de {{value0}} por IA Sonar|Sonar AI lyric analysis of {{value0}}|Analyse IA Sonar des paroles de {{value0}}|Analisi testi IA Sonar di {{value0}}|Sonar AI 对 {{value0}} 的歌词分析|Sonar AIによる{{value0}}の歌詞分析
Escribir crítica de {{value0}}|Write a review of {{value0}}|Écrire une critique de {{value0}}|Scrivi una recensione di {{value0}}|撰写 {{value0}} 的评论|{{value0}}のレビューを書く
Escribir crítica para {{value0}}|Write a review for {{value0}}|Écrire une critique pour {{value0}}|Scrivi una recensione per {{value0}}|为 {{value0}} 撰写评论|{{value0}}のレビューを書く
Escuchar muestra de {{value0}}|Listen to a preview of {{value0}}|Écouter un extrait de {{value0}}|Ascolta un’anteprima di {{value0}}|收听 {{value0}} 试听|{{value0}}を試聴
Ver edición de vinilo {{value0}}|View vinyl edition {{value0}}|Voir l’édition vinyle {{value0}}|Vedi edizione vinile {{value0}}|查看黑胶版本 {{value0}}|レコード版{{value0}}を見る
Añadir {{value0}} a favoritos|Add {{value0}} to favorites|Ajouter {{value0}} aux favoris|Aggiungi {{value0}} ai preferiti|将 {{value0}} 加入收藏|{{value0}}をお気に入りに追加
Audiófilo #{{value0}}|Audiophile #{{value0}}|Audiophile n°{{value0}}|Audiofilo #{{value0}}|发烧友 #{{value0}}|音楽愛好家 #{{value0}}
Ver reseña de {{value0}}|View review by {{value0}}|Voir l’avis de {{value0}}|Vedi recensione di {{value0}}|查看 {{value0}} 的评论|{{value0}}のレビューを見る
Crítica de {{value0}} sobre {{value1}}|Review by {{value0}} of {{value1}}|Critique de {{value0}} sur {{value1}}|Recensione di {{value0}} su {{value1}}|{{value0}} 对 {{value1}} 的评论|{{value0}}による{{value1}}のレビュー
Reproducir muestra de {{value0}}|Play preview of {{value0}}|Écouter l’extrait de {{value0}}|Riproduci anteprima di {{value0}}|播放 {{value0}} 试听|{{value0}}の試聴を再生
Progreso actual: {{value0}}%|Current progress: {{value0}}%|Progression actuelle : {{value0}} %|Progresso attuale: {{value0}}%|当前进度：{{value0}}%|現在の進捗：{{value0}}%
Responder a {{value0}}|Reply to {{value0}}|Répondre à {{value0}}|Rispondi a {{value0}}|回复 {{value0}}|{{value0}}に返信
Escribe tu respuesta para {{value0}}...|Write your reply to {{value0}}…|Écrivez votre réponse à {{value0}}…|Scrivi la risposta a {{value0}}…|撰写给 {{value0}} 的回复…|{{value0}}への返信を入力…
Respondiendo al hilo de {{value0}}...|Replying to {{value0}}’s thread…|Réponse au fil de {{value0}}…|Risposta alla discussione di {{value0}}…|正在回复 {{value0}} 的话题…|{{value0}}のスレッドに返信中…
Sigues a {{value0}}|You follow {{value0}}|Vous suivez {{value0}}|Segui {{value0}}|你已关注 {{value0}}|{{value0}}をフォロー中
Seguir a {{value0}}|Follow {{value0}}|Suivre {{value0}}|Segui {{value0}}|关注 {{value0}}|{{value0}}をフォロー
Avatar de {{value0}}|Avatar of {{value0}}|Avatar de {{value0}}|Avatar di {{value0}}|{{value0}} 的头像|{{value0}}のアバター
Cambiar idioma a {{value0}}|Switch language to {{value0}}|Changer la langue en {{value0}}|Cambia lingua in {{value0}}|切换语言为 {{value0}}|言語を{{value0}}に変更
Calificar con {{value0}} estrellas|Rate {{value0}} stars|Noter {{value0}} étoiles|Valuta {{value0}} stelle|评分为 {{value0}} 星|{{value0}}つ星で評価
Escuchar {{value0}} en Deezer (nueva pestaña)|Listen to {{value0}} on Deezer (new tab)|Écouter {{value0}} sur Deezer (nouvel onglet)|Ascolta {{value0}} su Deezer (nuova scheda)|在 Deezer 收听 {{value0}}（新标签页）|Deezerで{{value0}}を聴く（新しいタブ）
{{value0}} reportes; nivel máximo del indicador a partir de 10|{{value0}} reports; maximum indicator level from 10|{{value0}} signalements ; niveau maximal dès 10|{{value0}} segnalazioni; livello massimo da 10|{{value0}}条举报；10条起达到最高指示级别|{{value0}}件の報告。10件以上で最大レベル
Reproducir {{value0}}|Play {{value0}}|Lire {{value0}}|Riproduci {{value0}}|播放 {{value0}}|{{value0}}を再生
Criticar {{value0}}|Review {{value0}}|Critiquer {{value0}}|Recensisci {{value0}}|评论 {{value0}}|{{value0}}をレビュー
`.trim().split('\n').map(row => row.split('|'));
export const FEEDBACK_TRANSLATIONS = Object.fromEntries(
  ['es', 'en', 'fr', 'it', 'zh', 'ja'].map((language, index) => [language, Object.fromEntries(rows.map(values => [values[0], values[index]]))]),
);
