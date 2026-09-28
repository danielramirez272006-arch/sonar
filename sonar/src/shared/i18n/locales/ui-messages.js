// Spanish | English | French | Italian | Chinese | Japanese.
// Only static interface copy belongs here; catalog and user content is excluded.
const rows = `
Comunidad editorial de audio|Audio editorial community|Communauté éditoriale audio|Community editoriale audio|音频编辑社区|オーディオ編集コミュニティ
Seguridad & Protección Sonar|Sonar security & protection|Sécurité et protection Sonar|Sicurezza e protezione Sonar|Sonar 安全与保护|Sonarの安全と保護
Recupera tu|Recover your|Retrouvez votre|Recupera il tuo|找回你的|音楽への
acceso musical.|access to music.|accès à la musique.|accesso alla musica.|音乐访问权限。|アクセスを復元。
Te enviaremos un código de seguridad de 6 dígitos a tu correo electrónico para verificar tu identidad y restablecer tu contraseña con cifrado SHA-256.|We will email a 6-digit security code to verify your identity and reset your password with SHA-256 encryption.|Nous vous enverrons un code à 6 chiffres pour vérifier votre identité et réinitialiser votre mot de passe avec SHA-256.|Ti invieremo un codice di 6 cifre per verificare la tua identità e reimpostare la password con SHA-256.|我们会向你的邮箱发送六位安全码，以验证身份并使用 SHA-256 重置密码。|本人確認とSHA-256によるパスワード再設定のため、6桁のコードをメールで送信します。
Cifrado seguro de extremo a extremo|Secure end-to-end encryption|Chiffrement sécurisé de bout en bout|Crittografia sicura end-to-end|安全的端到端加密|安全なエンドツーエンド暗号化
Código temporal de 15 minutos|Code valid for 15 minutes|Code valable 15 minutes|Codice valido per 15 minuti|验证码有效期为15分钟|コードの有効期限は15分
Regresar|Go back|Retour|Indietro|返回|戻る
Recuperar Contraseña|Reset password|Réinitialiser le mot de passe|Reimposta password|重置密码|パスワードの再設定
Correo electrónico|Email address|Adresse e-mail|Indirizzo email|电子邮箱|メールアドレス
tu@ejemplo.com|you@example.com|vous@exemple.fr|tu@esempio.it|you@example.com|you@example.com
Enviar Código de Recuperación|Send recovery code|Envoyer le code|Invia codice di recupero|发送恢复码|再設定コードを送信
Correo enviado a|Email sent to|E-mail envoyé à|Email inviata a|邮件已发送至|メール送信先：
Revisa tu bandeja de entrada o spam. Copia el código de 6 dígitos que te enviamos y escríbelo aquí:|Check your inbox or spam folder. Enter the 6-digit code we sent you:|Consultez votre boîte de réception ou vos spams. Saisissez le code à 6 chiffres :|Controlla la posta in arrivo o lo spam. Inserisci il codice di 6 cifre:|请检查收件箱或垃圾邮件，并在此输入六位验证码：|受信トレイまたは迷惑メールを確認し、6桁のコードを入力してください：
Código de 6 dígitos|6-digit code|Code à 6 chiffres|Codice di 6 cifre|六位验证码|6桁のコード
Cambiar correo|Change email|Changer d’e-mail|Cambia email|更改邮箱|メールを変更
Verificar Código|Verify code|Vérifier le code|Verifica codice|验证代码|コードを確認
Nueva contraseña|New password|Nouveau mot de passe|Nuova password|新密码|新しいパスワード
Mínimo 6 caracteres|At least 6 characters|Au moins 6 caractères|Almeno 6 caratteri|至少6个字符|6文字以上
Mínimo 8 caracteres|At least 8 characters|Au moins 8 caractères|Almeno 8 caratteri|至少8个字符|8文字以上
Fortaleza de contraseña|Password strength|Robustesse du mot de passe|Sicurezza della password|密码强度|パスワードの強度
Confirmar nueva contraseña|Confirm new password|Confirmer le nouveau mot de passe|Conferma nuova password|确认新密码|新しいパスワードを確認
Repite la nueva contraseña|Repeat new password|Répétez le nouveau mot de passe|Ripeti la nuova password|再次输入新密码|新しいパスワードを再入力
Guardar Nueva Contraseña|Save new password|Enregistrer le mot de passe|Salva nuova password|保存新密码|新しいパスワードを保存
¡Contraseña Restablecida con Éxito!|Password reset successfully!|Mot de passe réinitialisé !|Password reimpostata!|密码重置成功！|パスワードを再設定しました！
Tu nueva contraseña ha sido cifrada con|Your new password was encrypted with|Votre nouveau mot de passe a été chiffré avec|La nuova password è stata cifrata con|你的新密码已使用以下方式加密：|新しいパスワードの暗号化方式：
y guardada en tu cuenta. Ya puedes iniciar sesión con tus nuevas credenciales.|and saved to your account. You can now sign in with your new credentials.|et enregistré. Vous pouvez vous connecter avec vos nouveaux identifiants.|e salvata nel tuo account. Ora puoi accedere con le nuove credenziali.|并已保存到你的账户。现在可以使用新凭据登录。|でアカウントに保存されました。新しい認証情報でログインできます。
Iniciar Sesión Ahora|Sign in now|Se connecter maintenant|Accedi ora|立即登录|今すぐログイン
Volver a Iniciar Sesión|Back to sign in|Retour à la connexion|Torna all’accesso|返回登录|ログインに戻る
Vuelve a la|Return to the|Rejoignez la|Torna alla|回到|音楽の会話に
conversación musical.|music conversation.|conversation musicale.|conversazione musicale.|音乐交流。|戻りましょう。
Califica vinilos, analiza letras con inteligencia artificial y sincroniza tus hallazgos con una comunidad audiófila global.|Rate records, analyze lyrics with AI and share discoveries with a global audiophile community.|Notez des vinyles, analysez les paroles avec l’IA et partagez vos découvertes avec une communauté mondiale.|Valuta vinili, analizza testi con l’IA e condividi scoperte con una community audiofila globale.|评价唱片、使用人工智能分析歌词，并与全球发烧友社区分享发现。|レコードを評価し、AIで歌詞を分析して、世界中の音楽愛好家と発見を共有しましょう。
64,280 críticas registradas este mes|64,280 reviews this month|64 280 critiques ce mois-ci|64.280 recensioni questo mese|本月已有64,280条评论|今月のレビュー64,280件
28,400 álbumes catalogados|28,400 albums cataloged|28 400 albums répertoriés|28.400 album catalogati|已收录28,400张专辑|登録アルバム28,400枚
Volver al catálogo|Back to catalog|Retour au catalogue|Torna al catalogo|返回目录|カタログに戻る
Acceso con servicios externos|Sign in with external services|Connexion via un service externe|Accesso con servizi esterni|使用外部服务登录|外部サービスでログイン
Al ingresar aceptas las Condiciones de Servicio y la Política de Privacidad de Sonar.|By signing in you accept Sonar’s Terms of Service and Privacy Policy.|En vous connectant, vous acceptez les conditions et la politique de confidentialité de Sonar.|Accedendo accetti i termini di servizio e l’informativa privacy di Sonar.|登录即表示接受 Sonar 的服务条款与隐私政策。|ログインするとSonarの利用規約とプライバシーポリシーに同意したことになります。
Únete a la conversación musical.|Join the music conversation.|Rejoignez la conversation musicale.|Unisciti alla conversazione musicale.|加入音乐交流。|音楽の会話に参加しましょう。
Muestras de Audio HD|HD audio samples|Extraits audio HD|Anteprime audio HD|高清音频试听|HD音源の試聴
Análisis de Letras IA|AI lyric analysis|Analyse des paroles par IA|Analisi dei testi IA|AI 歌词分析|AI歌詞分析
Reseñas de Vinilos|Vinyl reviews|Critiques de vinyles|Recensioni di vinili|黑胶评论|レコードレビュー
Datos|Details|Informations|Dati|资料|情報
Código OTP|One-time code|Code à usage unique|Codice monouso|一次性验证码|ワンタイムコード
3. Contraseña|3. Password|3. Mot de passe|3. Password|3. 密码|3. パスワード
Registro con servicios externos|Register with external services|Inscription via un service externe|Registrazione con servizi esterni|使用外部服务注册|外部サービスで登録
o regístrate con tu correo|or register with email|ou inscrivez-vous par e-mail|oppure registrati con email|或使用邮箱注册|またはメールで登録
Identidad Sonora|Sound identity|Identité sonore|Identità sonora|音乐身份|サウンドアイデンティティ
Personalizable|Customizable|Personnalisable|Personalizzabile|可自定义|カスタマイズ可能
Modalidad de Cuenta & Control Parental|Account type & parental control|Type de compte et contrôle parental|Tipo di account e controllo genitori|账户类型与家长控制|アカウントの種類と保護者設定
Catálogo libre completo|Full unrestricted catalog|Catalogue complet sans restriction|Catalogo completo senza limiti|完整无限制目录|制限なしの全カタログ
Junior (Segura)|Junior (safe)|Junior (sécurisé)|Junior (sicuro)|青少年（安全）|ジュニア（安全）
Filtro explícito [E] y PIN|Explicit content [E] filter and PIN|Filtre explicite [E] et code PIN|Filtro esplicito [E] e PIN|露骨内容 [E] 过滤与 PIN|露骨な内容[E]のフィルターとPIN
🔒 PIN Parental (4 dígitos):|🔒 Parental PIN (4 digits):|🔒 Code parental (4 chiffres) :|🔒 PIN genitori (4 cifre):|🔒 家长 PIN（4位）：|🔒 保護者用PIN（4桁）：
Las pistas con contenido explícito requerirán este PIN para desbloquear su reproducción.|Explicit tracks require this PIN to unlock playback.|Les titres explicites nécessitent ce code pour être lus.|Le tracce esplicite richiedono questo PIN per la riproduzione.|播放露骨内容曲目需要此 PIN。|露骨な内容の曲を再生するには、このPINが必要です。
Nombre de usuario|Username|Nom d’utilisateur|Nome utente|用户名|ユーザー名
tu_usuario|your_username|votre_pseudo|tuo_nome_utente|your_username|your_username
Tu enlace público:|Your public link:|Votre lien public :|Il tuo link pubblico:|你的公开链接：|公開リンク：
Válido|Valid|Valide|Valido|有效|有効
Calibra tus Gustos|Tune your taste|Affinez vos goûts|Affina i tuoi gusti|调整音乐偏好|好みを調整
seleccionados|selected|sélectionnés|selezionati|已选|選択済み
Iniciar Sesión ➔|Sign in ➔|Se connecter ➔|Accedi ➔|登录 ➔|ログイン ➔
Continuar y Verificar Correo|Continue and verify email|Continuer et vérifier l’e-mail|Continua e verifica email|继续并验证邮箱|続行してメールを確認
Código de Verificación|Verification code|Code de vérification|Codice di verifica|验证码|確認コード
Hemos enviado un código de 6 dígitos a|We sent a 6-digit code to|Nous avons envoyé un code à 6 chiffres à|Abbiamo inviato un codice di 6 cifre a|六位验证码已发送至|6桁のコードの送信先：
. Ingrésalo para activar tu cuenta:|. Enter it to activate your account:|. Saisissez-le pour activer votre compte :|. Inseriscilo per attivare il tuo account:|。输入验证码以激活账户：|。入力してアカウントを有効にしてください：
Ingresa los 6 dígitos recibidos|Enter the 6 digits you received|Saisissez les 6 chiffres reçus|Inserisci le 6 cifre ricevute|输入收到的六位数字|受信した6桁を入力
🔒 Ingresa los 6 dígitos y presiona Verificar Código|🔒 Enter the 6 digits and press Verify code|🔒 Saisissez les 6 chiffres puis vérifiez le code|🔒 Inserisci le 6 cifre e premi Verifica codice|🔒 输入六位数字并点击验证代码|🔒 6桁を入力し「コードを確認」を押してください
Correo|Email|E-mail|Email|邮箱|メール
verificado con éxito|verified successfully|vérifié avec succès|verificata con successo|验证成功|確認済み
Elige tu contraseña|Choose your password|Choisissez votre mot de passe|Scegli la password|设置密码|パスワードを設定
Nivel de seguridad|Security level|Niveau de sécurité|Livello di sicurezza|安全等级|セキュリティレベル
Confirmar contraseña|Confirm password|Confirmer le mot de passe|Conferma password|确认密码|パスワードを確認
Repite tu contraseña|Repeat your password|Répétez votre mot de passe|Ripeti la password|再次输入密码|パスワードを再入力
Las contraseñas coinciden perfectamente|Passwords match|Les mots de passe correspondent|Le password coincidono|密码一致|パスワードが一致しています
Mínimo 6 letras|At least 6 letters|Au moins 6 lettres|Almeno 6 lettere|至少6个字母|6文字以上
Números o símbolos|Numbers or symbols|Chiffres ou symboles|Numeri o simboli|数字或符号|数字または記号
Deseo recibir la selección curatorial semanal y análisis de letras vía IA.|Send me the weekly selection and AI lyric analysis.|Je souhaite recevoir la sélection hebdomadaire et les analyses de paroles par IA.|Desidero ricevere la selezione settimanale e le analisi dei testi IA.|我希望收到每周精选与 AI 歌词分析。|週間セレクションとAI歌詞分析を受け取る。
He leído y acepto los|I have read and accept the|J’ai lu et j’accepte les|Ho letto e accetto i|我已阅读并接受|以下を読み、同意します：
Abrir y leer Términos y Condiciones|Open and read terms and conditions|Ouvrir et lire les conditions|Apri e leggi termini e condizioni|打开并阅读条款与条件|利用規約を開いて読む
Términos y Condiciones|Terms and conditions|Conditions générales|Termini e condizioni|条款与条件|利用規約
de Sonar.|of Sonar.|de Sonar.|di Sonar.|（Sonar）。|（Sonar）。
Crear mi Radar Sonoro|Create my sound radar|Créer mon radar sonore|Crea il mio radar sonoro|创建我的音乐雷达|マイ音楽レーダーを作成
Volver a verificación de código|Back to code verification|Retour à la vérification du code|Torna alla verifica del codice|返回验证码验证|コード確認に戻る
¿Ya tienes cuenta?|Already have an account?|Vous avez déjà un compte ?|Hai già un account?|已有账户？|アカウントをお持ちですか？
Inicia sesión aquí|Sign in here|Connectez-vous ici|Accedi qui|在此登录|こちらからログイン
Al registrarte tus contraseñas se almacenan con cifrado unidireccional SHA-256 según la Política de Privacidad de Sonar.|On registration, passwords are stored using one-way SHA-256 encryption under Sonar’s Privacy Policy.|À l’inscription, les mots de passe sont stockés avec SHA-256 selon la politique de confidentialité de Sonar.|Alla registrazione le password sono archiviate con SHA-256 secondo l’informativa privacy di Sonar.|注册时，密码将按 Sonar 隐私政策使用单向 SHA-256 加密存储。|登録時、パスワードはSonarのプライバシーポリシーに従いSHA-256で保存されます。
Ocultar contraseña|Hide password|Masquer le mot de passe|Nascondi password|隐藏密码|パスワードを隠す
Mostrar contraseña|Show password|Afficher le mot de passe|Mostra password|显示密码|パスワードを表示
Paso anterior|Previous step|Étape précédente|Passaggio precedente|上一步|前のステップ
Volver a iniciar sesión|Back to sign in|Retour à la connexion|Torna all’accesso|返回登录|ログインに戻る
Reenviar código|Resend code|Renvoyer le code|Invia nuovamente il codice|重新发送验证码|コードを再送信
Enviando código al correo…|Sending code by email…|Envoi du code par e-mail…|Invio del codice via email…|正在发送验证码…|コードをメールで送信中…
Enviando código de verificación…|Sending verification code…|Envoi du code de vérification…|Invio codice di verifica…|正在发送验证码…|確認コードを送信中…
Creando y Cifrando cuenta…|Creating and encrypting account…|Création et chiffrement du compte…|Creazione e cifratura account…|正在创建并加密账户…|アカウントを作成・暗号化中…
✕ Las contraseñas no coinciden|✕ Passwords do not match|✕ Les mots de passe ne correspondent pas|✕ Le password non coincidono|✕ 密码不一致|✕ パスワードが一致しません
Requerida|Required|Obligatoire|Obbligatoria|必填|必須
Débil (mínimo 6)|Weak (minimum 6)|Faible (minimum 6)|Debole (minimo 6)|弱（至少6位）|弱い（6文字以上）
Buena|Good|Bonne|Buona|良好|良好
Excelente (Cifrado SHA-256)|Excellent (SHA-256 encryption)|Excellent (chiffrement SHA-256)|Eccellente (cifratura SHA-256)|极好（SHA-256 加密）|優秀（SHA-256暗号化）
Por favor introduce tu correo electrónico.|Please enter your email address.|Veuillez saisir votre adresse e-mail.|Inserisci il tuo indirizzo email.|请输入电子邮箱。|メールアドレスを入力してください。
No se pudo enviar el código al correo. Inténtalo de nuevo.|Could not email the code. Try again.|Impossible d’envoyer le code. Réessayez.|Impossibile inviare il codice. Riprova.|无法发送验证码，请重试。|コードを送信できませんでした。再試行してください。
El código de 6 dígitos ingresado es incorrecto o ha expirado.|The 6-digit code is incorrect or expired.|Le code à 6 chiffres est incorrect ou expiré.|Il codice di 6 cifre è errato o scaduto.|六位验证码错误或已过期。|6桁のコードが間違っているか期限切れです。
La nueva contraseña debe tener al menos 6 caracteres.|The new password must have at least 6 characters.|Le nouveau mot de passe doit contenir au moins 6 caractères.|La nuova password deve contenere almeno 6 caratteri.|新密码必须至少包含6个字符。|新しいパスワードは6文字以上にしてください。
Las contraseñas no coinciden. Por favor verifícalas.|Passwords do not match. Please check them.|Les mots de passe ne correspondent pas. Vérifiez-les.|Le password non coincidono. Verificale.|密码不一致，请检查。|パスワードが一致しません。確認してください。
No se pudo actualizar la contraseña. Inténtalo de nuevo.|Could not update password. Try again.|Impossible de modifier le mot de passe. Réessayez.|Impossibile aggiornare la password. Riprova.|无法更新密码，请重试。|パスワードを更新できませんでした。再試行してください。
Ingresa tu correo para recibir un código de seguridad de 6 dígitos.|Enter your email to receive a 6-digit security code.|Saisissez votre e-mail pour recevoir un code à 6 chiffres.|Inserisci l’email per ricevere un codice di 6 cifre.|输入邮箱以接收六位安全码。|メールを入力して6桁のコードを受け取ってください。
Crea tu nueva contraseña segura para volver a entrar a Sonar.|Create a new secure password to return to Sonar.|Créez un mot de passe sécurisé pour revenir sur Sonar.|Crea una nuova password sicura per tornare su Sonar.|创建安全的新密码以重新登录 Sonar。|Sonarに戻るため、安全な新しいパスワードを作成してください。
¡Tu contraseña ha sido actualizada y cifrada con éxito!|Your password was updated and encrypted successfully!|Votre mot de passe a été modifié et chiffré !|Password aggiornata e cifrata con successo!|密码更新并加密成功！|パスワードを更新・暗号化しました！
No se pudo obtener el perfil de Google.|Could not retrieve Google profile.|Impossible de récupérer le profil Google.|Impossibile recuperare il profilo Google.|无法获取 Google 个人资料。|Googleプロフィールを取得できませんでした。
No se pudo iniciar sesión con Google.|Could not sign in with Google.|Impossible de se connecter avec Google.|Impossibile accedere con Google.|无法使用 Google 登录。|Googleでログインできませんでした。
No se pudo conectar con Google. Intenta de nuevo.|Could not connect to Google. Try again.|Connexion à Google impossible. Réessayez.|Impossibile connettersi a Google. Riprova.|无法连接 Google，请重试。|Googleに接続できませんでした。再試行してください。
`.trim().split('\n').map(row => row.split('|'));

export const UI_TRANSLATIONS = Object.fromEntries(
  ['es', 'en', 'fr', 'it', 'zh', 'ja'].map((language, index) => [
    language, Object.fromEntries(rows.map(values => [values[0], values[index]])),
  ]),
);
