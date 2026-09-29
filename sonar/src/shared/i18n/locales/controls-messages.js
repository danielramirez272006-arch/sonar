const rows = `
Comentario reportado para moderación. ¡Gracias por mantener la comunidad segura!|Comment reported. Thank you for keeping the community safe!|Commentaire signalé. Merci de protéger la communauté !|Commento segnalato. Grazie per proteggere la community!|评论已举报，感谢维护社区安全！|コメントを報告しました。安全なコミュニティへのご協力ありがとうございます！
Escribe un comentario o apreciación acústica...|Write a comment or listening impression…|Écrivez un commentaire ou une impression d’écoute…|Scrivi un commento o impressione d’ascolto…|撰写评论或聆听感想…|コメントや音楽の感想を入力…
Publicar comentario|Post comment|Publier le commentaire|Pubblica commento|发表评论|コメントを投稿
Sé el primero en comentar esta reseña.|Be the first to comment on this review.|Soyez le premier à commenter cet avis.|Commenta per primo questa recensione.|率先评论这篇乐评。|このレビューに最初のコメントをしましょう。
Reportado|Reported|Signalé|Segnalato|已举报|報告済み
Me gusta (Corazón)|Like (heart)|J’aime (cœur)|Mi piace (cuore)|喜欢（爱心）|いいね（ハート）
No me gusta (Corazón roto)|Dislike (broken heart)|Je n’aime pas (cœur brisé)|Non mi piace (cuore spezzato)|不喜欢（碎心）|よくないね（割れたハート）
Me gusta|Like|J’aime|Mi piace|喜欢|いいね
No me gusta|Dislike|Je n’aime pas|Non mi piace|不喜欢|よくないね
Responder|Reply|Répondre|Rispondi|回复|返信
Respondiendo a|Replying to|Réponse à|Risposta a|回复给|返信先：
Quitar mención directa|Remove direct mention|Retirer la mention directe|Rimuovi menzione diretta|移除直接提及|直接メンションを削除
Reportar reseña|Report review|Signaler l’avis|Segnala recensione|举报评论|レビューを報告
Motivo del reporte|Report reason|Motif du signalement|Motivo della segnalazione|举报原因|報告理由
comentarios|comments|commentaires|commenti|条评论|件のコメント
Cerrar formulario|Close form|Fermer le formulaire|Chiudi modulo|关闭表单|フォームを閉じる
Publicar Crítica Musical|Publish music review|Publier une critique musicale|Pubblica recensione musicale|发布乐评|音楽レビューを公開
por|by|par|di|作者|作成者：
¿Qué deseas calificar y analizar?|What would you like to rate and analyze?|Que souhaitez-vous noter et analyser ?|Cosa vuoi valutare e analizzare?|你想评价和分析什么？|何を評価・分析しますか？
Canción Específica|Specific track|Titre précis|Traccia specifica|指定歌曲|特定の曲
Álbum Completo|Full album|Album complet|Album completo|完整专辑|アルバム全体
Nombre de la Canción|Track name|Nom du titre|Nome della traccia|歌曲名称|曲名
Calificación|Rating|Note|Valutazione|评分|評価
Tu Crítica y Análisis|Your review and analysis|Votre critique et analyse|La tua recensione e analisi|你的评论与分析|レビューと分析
Contiene spoilers o detalles de la trama / concepto|Contains spoilers or plot / concept details|Contient des révélations sur l’intrigue ou le concept|Contiene spoiler o dettagli della trama / concetto|包含剧透或情节 / 概念细节|ネタバレや内容の詳細を含む
Ocultará el texto detrás de un aviso de moderación|Hides text behind a moderation notice|Masque le texte derrière un avertissement|Nasconde il testo dietro un avviso|文本将隐藏在审核提示后|注意書きの後ろに本文を隠します
No hay reseñas publicadas aún.|No reviews published yet.|Aucun avis publié pour le moment.|Nessuna recensione ancora pubblicata.|暂无已发布评论。|公開されたレビューはまだありません。
Abrir opciones de accesibilidad (Atajo: Alt + A)|Open accessibility options (Alt + A)|Ouvrir l’accessibilité (Alt + A)|Apri accessibilità (Alt + A)|打开无障碍选项（Alt + A）|アクセシビリティを開く（Alt + A）
Opciones de Accesibilidad (Alt + A)|Accessibility options (Alt + A)|Options d’accessibilité (Alt + A)|Opzioni di accessibilità (Alt + A)|无障碍选项（Alt + A）|アクセシビリティ設定（Alt + A）
Opciones de Accesibilidad|Accessibility options|Options d’accessibilité|Opzioni di accessibilità|无障碍选项|アクセシビリティ設定
Accesibilidad Universal|Universal accessibility|Accessibilité universelle|Accessibilità universale|通用无障碍|ユニバーサルアクセシビリティ
Personaliza el contraste, tipografía, audio y lectura para tu comodidad.|Customize contrast, typography, audio and reading for your comfort.|Adaptez contraste, typographie, audio et lecture à vos besoins.|Personalizza contrasto, caratteri, audio e lettura per il tuo comfort.|自定义对比度、字体、音频和阅读设置。|コントラスト、文字、音声、読みやすさを調整できます。
Lectura de toda la página|Read the whole page|Lecture de toute la page|Lettura dell'intera pagina|朗读整个页面|ページ全体を読み上げ
Lee el contenido principal en el idioma seleccionado. La lectura comienza cuando tú la activas.|Reads the main content in your selected language. Start reading whenever you choose.|Lit le contenu principal dans la langue choisie. Lancez la lecture quand vous le souhaitez.|Legge il contenuto principale nella lingua scelta. Avvia la lettura quando vuoi.|以所选语言朗读主要内容。由你决定何时开始。|選択中の言語で本文を読み上げます。読み上げは任意のタイミングで開始できます。
Leer página|Read page|Lire la page|Leggi la pagina|朗读页面|ページを読み上げ
Pausar|Pause|Pause|Pausa|暂停|一時停止
Continuar|Resume|Reprendre|Riprendi|继续|再開
Detener lectura|Stop reading|Arrêter la lecture|Interrompi lettura|停止朗读|読み上げを停止
No se encontró contenido para leer.|No readable content was found.|Aucun contenu à lire n’a été trouvé.|Nessun contenuto da leggere.|未找到可朗读的内容。|読み上げる内容が見つかりません。
Lectura en curso|Reading|Lecture en cours|Lettura in corso|正在朗读|読み上げ中
Lectura pausada|Reading paused|Lecture en pause|Lettura in pausa|朗读已暂停|読み上げ一時停止
Detén la lectura para cambiar la velocidad.|Stop reading to change the speed.|Arrêtez la lecture pour modifier la vitesse.|Interrompi la lettura per cambiare velocità.|停止朗读后再更改速度。|速度を変えるには読み上げを停止してください。
Cerrar panel de accesibilidad|Close accessibility panel|Fermer le panneau d’accessibilité|Chiudi pannello accessibilità|关闭无障碍面板|アクセシビリティパネルを閉じる
Lectura y Tipografía|Reading and typography|Lecture et typographie|Lettura e tipografia|阅读与字体|読みやすさと文字
Tamaño del Texto|Text size|Taille du texte|Dimensione testo|文字大小|文字サイズ
Interlineado y Espaciado|Line height and spacing|Interligne et espacement|Interlinea e spaziatura|行高与间距|行間と字間
Guía de Enfoque / Regla de Lectura|Focus guide / reading ruler|Guide de lecture / règle|Guida visiva / righello di lettura|专注指南 / 阅读尺|フォーカスガイド／読書ルーラー
Barra horizontal de seguimiento para no perder la línea al leer|Horizontal guide to keep your place while reading|Guide horizontal pour suivre les lignes|Guida orizzontale per seguire la lettura|帮助跟踪阅读位置的水平参考条|読む行を見失わないための水平ガイド
Fuente Adaptada para Dislexia|Dyslexia-friendly font|Police adaptée à la dyslexie|Carattere adatto alla dislessia|适合阅读障碍的字体|ディスレクシアに配慮したフォント
Mayor espaciado entre letras y palabras para evitar confusión visual|Extra letter and word spacing for visual clarity|Espacement accru pour une meilleure lisibilité|Spaziatura maggiore per una lettura più chiara|增加字母与单词间距以减少视觉混淆|文字や単語の間隔を広げて読みやすくします
Visión y Contraste|Vision and contrast|Vision et contraste|Visione e contrasto|视觉与对比度|見やすさとコントラスト
Modo Alto Contraste (AAA)|High contrast mode (AAA)|Mode contraste élevé (AAA)|Modalità alto contrasto (AAA)|高对比度模式（AAA）|ハイコントラストモード（AAA）
Fondo negro absoluto con bordes y tipografía de máxima visibilidad|Black background with highly visible borders and text|Fond noir avec bordures et texte très visibles|Sfondo nero con bordi e testo ben visibili|纯黑背景搭配高可见度边框与文字|黒い背景に見やすい枠線と文字
Modo Sepia / Calidez Visual|Sepia mode / warm colors|Mode sépia / couleurs chaudes|Modalità seppia / colori caldi|褐色模式 / 暖色视觉|セピアモード／暖色表示
Filtro cálido relajante contra la fatiga visual y luz azul|Warm filter for eye strain and blue light|Filtre chaud contre la fatigue visuelle et la lumière bleue|Filtro caldo per affaticamento visivo e luce blu|减少视觉疲劳与蓝光的暖色滤镜|目の疲れとブルーライトに配慮した暖色フィルター
Modo Monocromático (Escala de Grises)|Monochrome mode (grayscale)|Mode monochrome (niveaux de gris)|Modalità monocromatica (scala di grigi)|单色模式（灰度）|モノクロモード（グレースケール）
Elimina la saturación para una experiencia visual de bajo estímulo|Remove color saturation for less visual stimulation|Réduit la saturation pour limiter les stimuli visuels|Rimuove la saturazione per ridurre gli stimoli visivi|去除饱和度以减少视觉刺激|彩度をなくして視覚刺激を抑えます
Resaltar Elementos Interactivos|Highlight interactive elements|Surligner les éléments interactifs|Evidenzia elementi interattivi|突出交互元素|操作できる要素を強調
Distingue botones, enlaces y campos con bordes llamativos|Highlight buttons, links and fields with visible borders|Souligne boutons, liens et champs avec des bordures visibles|Evidenzia pulsanti, link e campi con bordi visibili|用醒目边框区分按钮、链接与字段|ボタン、リンク、入力欄を枠線で強調します
Puntero / Cursor Agrandado|Large pointer / cursor|Pointeur / curseur agrandi|Puntatore / cursore ingrandito|放大指针 / 光标|大きなポインター／カーソル
Aumenta el tamaño del ratón para no perder el foco|Make the pointer easier to find|Agrandit le pointeur pour mieux le repérer|Ingrandisce il puntatore per trovarlo facilmente|放大鼠标指针以便定位|ポインターを大きくして見つけやすくします
Filtros para Daltonismo|Color blindness filters|Filtres pour daltonisme|Filtri per daltonismo|色觉障碍滤镜|色覚フィルター
Audio, Movimiento y Asistencia|Audio, motion and assistance|Audio, mouvement et assistance|Audio, movimento e assistenza|音频、动画与辅助|音声、動き、補助機能
Micro-Sonidos de Navegación (Audio Cues)|Navigation sounds (audio cues)|Sons de navigation|Suoni di navigazione|导航提示音|ナビゲーション音
Tonos sutiles al interactuar con botones, favoritos y reproductor|Subtle sounds for buttons, favorites and player controls|Sons discrets pour les boutons, favoris et le lecteur|Suoni discreti per pulsanti, preferiti e lettore|操作按钮、收藏和播放器时的轻柔提示音|ボタン、お気に入り、プレーヤー操作の控えめな効果音
Pausar Animaciones y Giros|Pause animations and rotations|Suspendre animations et rotations|Pausa animazioni e rotazioni|暂停动画与旋转|アニメーションと回転を停止
Para personas con sensibilidad vestibular o mareos por movimiento|For people sensitive to motion|Pour les personnes sensibles au mouvement|Per persone sensibili al movimento|适用于对运动敏感或易晕动的人|動きに敏感な方や酔いやすい方のために
Lector de Reseñas por Voz (TTS)|Review reader (TTS)|Lecture vocale des avis (TTS)|Lettura vocale recensioni (TTS)|评论语音朗读（TTS）|レビューの読み上げ（TTS）
Velocidad de Lectura:|Reading speed:|Vitesse de lecture :|Velocità di lettura:|朗读速度：|読み上げ速度：
Idioma y Región / Language & Region|Language & region|Langue et région|Lingua e regione|语言与地区|言語と地域
Selecciona tu idioma preferido para la interfaz, navegación y controles:|Choose your language for the interface, navigation and controls:|Choisissez la langue de l’interface, de la navigation et des commandes :|Scegli la lingua per interfaccia, navigazione e controlli:|选择界面、导航和控件的首选语言：|画面、ナビゲーション、操作の言語を選択：
Ver Atajos de Teclado (?)|View keyboard shortcuts (?)|Voir les raccourcis clavier (?)|Vedi scorciatoie da tastiera (?)|查看键盘快捷键（?）|キーボードショートカットを見る（?）
Restablecer|Reset|Réinitialiser|Ripristina|重置|リセット
Guardar y Cerrar|Save and close|Enregistrer et fermer|Salva e chiudi|保存并关闭|保存して閉じる
Cerrar guía de atajos|Close shortcut guide|Fermer les raccourcis|Chiudi guida scorciatoie|关闭快捷键指南|ショートカットガイドを閉じる
📖 Guía de Enfoque Visual|📖 Visual focus guide|📖 Guide de lecture visuelle|📖 Guida visiva|📖 视觉专注指南|📖 視覚フォーカスガイド
Mueve el cursor para deslizar|Move the cursor to slide|Déplacez le curseur pour glisser|Muovi il cursore per scorrere|移动光标以滑动|カーソルを動かして移動
Saltar navegación e ir directamente al contenido principal|Skip navigation and go to main content|Passer la navigation et accéder au contenu|Salta navigazione e vai al contenuto|跳过导航并前往主要内容|ナビゲーションを飛ばして本文へ
Saltar al contenido principal|Skip to main content|Aller au contenu principal|Vai al contenuto principale|跳到主要内容|本文へスキップ
Consola de Administración|Admin console|Console d’administration|Console amministrativa|管理控制台|管理コンソール
Podcasts Sonar|Sonar podcasts|Podcasts Sonar|Podcast Sonar|Sonar 播客|Sonarポッドキャスト
Sesiones y Podcasts Sonar|Sonar sessions and podcasts|Sessions et podcasts Sonar|Sessioni e podcast Sonar|Sonar 音乐会与播客|Sonarセッションとポッドキャスト
Modo Tocadiscos Vinilo|Vinyl turntable mode|Mode platine vinyle|Modalità giradischi|黑胶唱机模式|レコードプレーヤーモード
Modo Tocadiscos Inmersivo 33⅓ RPM|Immersive 33⅓ RPM turntable mode|Mode platine immersif 33⅓ tr/min|Modalità giradischi immersiva 33⅓ RPM|沉浸式33⅓转唱机模式|没入型33⅓RPMターンテーブルモード
Boletín y Feed RSS|Newsletter and RSS feed|Newsletter et flux RSS|Newsletter e feed RSS|通讯与 RSS 订阅|ニュースレターとRSSフィード
Boletín y Feed RSS Audiófilo|Audiophile newsletter and RSS feed|Newsletter et flux RSS audiophiles|Newsletter e feed RSS audiofili|发烧友通讯与 RSS 订阅|音楽愛好家向けニュースレターとRSS
Ver telemetría y estado del sistema|View telemetry and system status|Voir la télémétrie et l’état du système|Vedi telemetria e stato del sistema|查看遥测与系统状态|テレメトリーとシステム状態を見る
Sonar Engine v2.4 Activo|Sonar Engine v2.4 active|Sonar Engine v2.4 actif|Sonar Engine v2.4 attivo|Sonar Engine v2.4 已启用|Sonar Engine v2.4 稼働中
Saltar en la pista de audio|Seek in audio track|Se déplacer dans la piste audio|Sposta posizione nella traccia|跳转音轨位置|曲の再生位置を変更
Contenido Explícito (Explicit Lyrics)|Explicit content (explicit lyrics)|Contenu explicite (paroles)|Contenuto esplicito (testi)|露骨内容（歌词）|露骨な内容（歌詞）
Contenido Explícito|Explicit content|Contenu explicite|Contenuto esplicito|露骨内容|露骨な内容
Retroceder 15 segundos|Back 15 seconds|Reculer de 15 secondes|Indietro di 15 secondi|后退15秒|15秒戻る
Adelantar 15 segundos|Forward 15 seconds|Avancer de 15 secondes|Avanti di 15 secondi|前进15秒|15秒進む
Cambiar velocidad de reproducción|Change playback speed|Modifier la vitesse de lecture|Cambia velocità di riproduzione|更改播放速度|再生速度を変更
Notas del episodio|Episode notes|Notes de l’épisode|Note dell’episodio|节目笔记|エピソードノート
Notas|Notes|Notes|Note|笔记|ノート
Ver Transcripción y Subtítulos Accesibles (CC)|View transcript and accessible captions (CC)|Voir transcription et sous-titres accessibles (CC)|Vedi trascrizione e sottotitoli accessibili (CC)|查看文字稿与无障碍字幕（CC）|文字起こしと字幕を表示（CC）
Ver Letras de la Canción y Transcripción (CC)|View lyrics and transcript (CC)|Voir paroles et transcription (CC)|Vedi testi e trascrizione (CC)|查看歌词与文字稿（CC）|歌詞と文字起こしを表示（CC）
Escribir una crítica|Write a review|Écrire une critique|Scrivi una recensione|撰写评论|レビューを書く
Cerrar reproductor|Close player|Fermer le lecteur|Chiudi lettore|关闭播放器|プレーヤーを閉じる
Voces:|Voices:|Voix :|Voci:|声部：|声：
Letras y transcripción accesible del audio actual|Lyrics and accessible transcript of current audio|Paroles et transcription accessible de l’audio|Testi e trascrizione accessibile dell’audio|当前音频的歌词与无障碍文字稿|現在の音声の歌詞と文字起こし
Letras (Lyrics)|Lyrics|Paroles|Testi|歌词|歌詞
Ficha Técnica|Technical details|Fiche technique|Scheda tecnica|技术信息|技術情報
Escuchar en voz alta con sintetizador TTS|Read aloud with TTS|Lire à voix haute avec TTS|Leggi ad alta voce con TTS|使用 TTS 朗读|TTSで読み上げ
Copiar texto al portapapeles|Copy text to clipboard|Copier le texte|Copia testo negli appunti|复制文本到剪贴板|テキストをコピー
Buscando letras oficiales en base de datos Sonar...|Searching Sonar for official lyrics…|Recherche de paroles officielles sur Sonar…|Ricerca testi ufficiali su Sonar…|正在 Sonar 数据库中搜索官方歌词…|Sonarで公式歌詞を検索中…
Pieza Instrumental|Instrumental piece|Morceau instrumental|Brano strumentale|器乐作品|インストゥルメンタル
Letra no disponible temporalmente|Lyrics temporarily unavailable|Paroles temporairement indisponibles|Testo temporaneamente non disponibile|歌词暂不可用|歌詞は一時的に利用できません
Reintentar Búsqueda|Retry search|Relancer la recherche|Riprova ricerca|重试搜索|再検索
Buscar en Google|Search Google|Chercher sur Google|Cerca su Google|在 Google 搜索|Googleで検索
Interlocutores / Mesa de análisis:|Speakers / discussion panel:|Intervenants / table ronde :|Interlocutori / tavola rotonda:|发言人 / 分析小组：|話者／討論パネル：
Cargando canciones del álbum...|Loading album tracks…|Chargement des pistes…|Caricamento tracce dell’album…|正在加载专辑曲目…|アルバムの曲を読み込み中…
No se encontraron más canciones para este álbum.|No more tracks found for this album.|Aucune autre piste pour cet album.|Nessun’altra traccia per questo album.|未找到此专辑的更多曲目。|このアルバムの他の曲は見つかりませんでした。
Contenido Explícito Bloqueado|Explicit content blocked|Contenu explicite bloqué|Contenuto esplicito bloccato|露骨内容已屏蔽|露骨な内容をブロックしました
Filtro Parental Sonar|Sonar parental filter|Filtre parental Sonar|Filtro genitori Sonar|Sonar 家长过滤|Sonar保護者フィルター
Ingresa el PIN de 4 dígitos para autorizar la reproducción:|Enter the 4-digit PIN to allow playback:|Saisissez le code à 4 chiffres pour autoriser la lecture :|Inserisci il PIN di 4 cifre per autorizzare la riproduzione:|输入四位 PIN 以允许播放：|再生を許可する4桁のPINを入力：
Desbloquear|Unlock|Débloquer|Sblocca|解锁|ロック解除
Cerrar menú móvil|Close mobile menu|Fermer le menu mobile|Chiudi menu mobile|关闭移动菜单|モバイルメニューを閉じる
Navegación|Navigation|Navigation|Navigazione|导航|ナビゲーション
Cerrar menú|Close menu|Fermer le menu|Chiudi menu|关闭菜单|メニューを閉じる
Buscar canciones, artistas y noticias|Search tracks, artists and news|Chercher titres, artistes et actualités|Cerca tracce, artisti e notizie|搜索歌曲、艺人与新闻|曲、アーティスト、ニュースを検索
Buscando en Deezer y en el contenido editorial de Sonar…|Searching Deezer and Sonar editorial content…|Recherche sur Deezer et dans les contenus Sonar…|Ricerca su Deezer e nei contenuti Sonar…|正在搜索 Deezer 与 Sonar 编辑内容…|DeezerとSonarの記事を検索中…
Reproducir muestra (30s)|Play preview (30s)|Écouter l’extrait (30 s)|Riproduci anteprima (30 s)|播放试听（30秒）|試聴を再生（30秒）
Ver noticias de “|View news about “|Voir les actualités de «|Vedi notizie su “|查看新闻：“|ニュースを見る：「
Ver canciones de “|View tracks by “|Voir les titres de «|Vedi tracce di “|查看歌曲：“|曲を見る：「
Cambiar tema|Change theme|Changer de thème|Cambia tema|切换主题|テーマを変更
Modo Kids|Kids mode|Mode enfant|Modalità bambini|儿童模式|キッズモード
Cerrar (Esc)|Close (Esc)|Fermer (Échap)|Chiudi (Esc)|关闭（Esc）|閉じる（Esc）
Cerrar ventana|Close window|Fermer la fenêtre|Chiudi finestra|关闭窗口|ウィンドウを閉じる
Acceso para Miembros|Member access|Accès membres|Accesso membri|会员访问|メンバーアクセス
Inicia Sesión para Criticar|Sign in to review|Connectez-vous pour commenter|Accedi per recensire|登录以发表评论|レビューするにはログイン
Debes tener una cuenta activa en Sonar para calificar música y publicar tus análisis en la comunidad.|You need an active Sonar account to rate music and publish reviews.|Un compte Sonar actif est nécessaire pour noter la musique et publier des avis.|Serve un account Sonar attivo per valutare musica e pubblicare recensioni.|需要有效的 Sonar 账户才能评价音乐并发表评论。|音楽の評価やレビューの投稿にはSonarのアカウントが必要です。
Crear una Cuenta|Create an account|Créer un compte|Crea un account|创建账户|アカウントを作成
¡Reporte Enviado con Éxito!|Report sent successfully!|Signalement envoyé !|Segnalazione inviata!|举报发送成功！|報告を送信しました！
Estado: En cola de moderación prioritaria|Status: priority moderation queue|Statut : file de modération prioritaire|Stato: coda di moderazione prioritaria|状态：优先审核队列|状態：優先審査待ち
Cerrar Ventana|Close window|Fermer la fenêtre|Chiudi finestra|关闭窗口|ウィンドウを閉じる
Reportar Contenido|Report content|Signaler le contenu|Segnala contenuto|举报内容|内容を報告
Selecciona el motivo que mejor describe el problema|Select the reason that best describes the issue|Choisissez le motif qui décrit le mieux le problème|Scegli il motivo che descrive meglio il problema|选择最符合问题的原因|問題に最も合う理由を選択
Motivo principal del reporte|Main report reason|Motif principal du signalement|Motivo principale della segnalazione|主要举报原因|主な報告理由
* Requerido|* Required|* Obligatoire|* Obbligatorio|* 必填|* 必須
Etiquetas de contexto rápido (opcional)|Quick context tags (optional)|Mots-clés de contexte (facultatif)|Tag di contesto rapido (facoltativo)|快速背景标签（可选）|状況タグ（任意）
Detalles adicionales (opcional)|Additional details (optional)|Détails supplémentaires (facultatif)|Dettagli aggiuntivi (facoltativo)|其他详情（可选）|追加の詳細（任意）
Describe brevemente por qué consideras que este contenido viola las normas...|Briefly explain why this content breaks the rules…|Expliquez brièvement pourquoi ce contenu enfreint les règles…|Spiega brevemente perché il contenuto viola le regole…|简要说明内容违反规则的原因…|規則に違反している理由を簡単に説明…
Los reportes son|Reports are|Les signalements sont|Le segnalazioni sono|举报为|報告は
100% anónimos|100% anonymous|100 % anonymes|100% anonime|100% 匿名|完全匿名
Enviar Reporte|Send report|Envoyer le signalement|Invia segnalazione|发送举报|報告を送信
Cerrar notificación|Dismiss notification|Fermer la notification|Chiudi notifica|关闭通知|通知を閉じる
`.trim().split('\n').map(row => row.split('|'));
export const CONTROLS_TRANSLATIONS = Object.fromEntries(
  ['es', 'en', 'fr', 'it', 'zh', 'ja'].map((language, index) => [language, Object.fromEntries(rows.map(values => [values[0], values[index]]))]),
);
