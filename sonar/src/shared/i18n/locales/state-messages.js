const rows = `
Resultados y accesos directos|Results and shortcuts|Résultats et raccourcis|Risultati e scorciatoie|结果与快捷入口|検索結果とショートカット
¿A dónde quieres ir?|Where would you like to go?|Où voulez-vous aller ?|Dove vuoi andare?|你想去哪里？|どこへ移動しますか？
En Tu Colección|In your collection|Dans votre collection|Nella tua collezione|已在收藏中|コレクションに保存済み
Guardar en Colección|Save to collection|Ajouter à la collection|Salva nella collezione|加入收藏|コレクションに保存
Quitar canción de mi colección|Remove track from my collection|Retirer le titre de ma collection|Rimuovi traccia dalla collezione|从收藏移除歌曲|コレクションから曲を削除
Guardar canción en mi colección|Save track to my collection|Ajouter le titre à ma collection|Salva traccia nella collezione|将歌曲加入收藏|コレクションに曲を保存
Cerrar Publicador|Close editor|Fermer l’éditeur|Chiudi editor|关闭编辑器|エディターを閉じる
Escribir una Crítica|Write a review|Écrire une critique|Scrivi una recensione|撰写评论|レビューを書く
Invitado|Guest|Invité|Ospite|访客|ゲスト
Guardando en la API...|Saving…|Enregistrement…|Salvataggio…|保存中…|保存中…
Publicar Crítica en la API|Publish review|Publier la critique|Pubblica recensione|发布评论|レビューを公開
✦ Todas|✦ All|✦ Toutes|✦ Tutte|✦ 全部|✦ すべて
✓ Siguiendo|✓ Following|✓ Abonné|✓ Segui già|✓ 已关注|✓ フォロー中
+ Seguir|+ Follow|+ Suivre|+ Segui|+ 关注|+ フォロー
Seguir|Follow|Suivre|Segui|关注|フォロー
Ocultando 18+ (Activo)|Hiding 18+ (active)|Masquage 18+ (actif)|Nascondi 18+ (attivo)|隐藏18+（已启用）|18歳以上向けを非表示（有効）
Ocultar explícitas [18+]|Hide explicit [18+]|Masquer l’explicite [18+]|Nascondi espliciti [18+]|隐藏露骨内容 [18+]|露骨な内容を非表示 [18+]
Quitar de favoritos|Remove from favorites|Retirer des favoris|Rimuovi dai preferiti|取消收藏|お気に入りから削除
Guardar canción en favoritos|Favorite this track|Ajouter le titre aux favoris|Aggiungi traccia ai preferiti|收藏歌曲|曲をお気に入りに保存
sellos|labels|labels|etichette|厂牌|レーベル
lanzamientos|releases|sorties|uscite|发行|リリース
Lanzamiento|Release|Sortie|Uscita|发行|リリース
edición|edition|édition|edizione|个版本|版
ediciones|editions|éditions|edizioni|个版本|版
En vinilo|On vinyl|En vinyle|Su vinile|黑胶版|レコード版
Cambiar Imagen|Change image|Changer l’image|Cambia immagine|更换图片|画像を変更
Seleccionar Imagen de Portada|Choose cover image|Choisir la couverture|Scegli copertina|选择封面|カバー画像を選択
MOTOR ACTIVO · QUARTZ LOCK|MOTOR ON · QUARTZ LOCK|MOTEUR ACTIF · QUARTZ LOCK|MOTORE ATTIVO · QUARTZ LOCK|马达运行 · 石英锁定|モーター稼働・クォーツロック
STANDBY · PLATO EN PAUSA|STANDBY · PLATTER PAUSED|VEILLE · PLATEAU EN PAUSE|STANDBY · PIATTO IN PAUSA|待机 · 唱盘暂停|待機・ターンテーブル停止
Quitar de tu colección|Remove from your collection|Retirer de votre collection|Rimuovi dalla tua collezione|从收藏移除|コレクションから削除
Guardar álbum en tu colección|Save album to your collection|Ajouter l’album à votre collection|Salva album nella tua collezione|将专辑加入收藏|コレクションにアルバムを保存
En Colección|In collection|Dans la collection|In collezione|已收藏|保存済み
PLAYING · CARA A|PLAYING · SIDE A|LECTURE · FACE A|RIPRODUZIONE · LATO A|播放中 · A面|再生中・A面
PAUSED|PAUSED|EN PAUSE|IN PAUSA|已暂停|一時停止
Levantar Aguja / Pausar|Lift needle / pause|Lever le diamant / pause|Solleva puntina / pausa|抬针 / 暂停|針を上げる／一時停止
Bajar Aguja al Surco|Lower needle to groove|Poser le diamant dans le sillon|Abbassa puntina nel solco|将唱针放入音槽|溝に針を下ろす
Quitar de canciones guardadas|Remove from saved tracks|Retirer des titres enregistrés|Rimuovi dalle tracce salvate|从已保存歌曲移除|保存した曲から削除
Guardar canción|Save track|Enregistrer le titre|Salva traccia|保存歌曲|曲を保存
Reciente|Recent|Récent|Recente|最近|最近
(Kids Activo)|(Kids active)|(Enfant actif)|(Bambini attivo)|（儿童模式已启用）|（キッズ有効）
💿 Álbum|💿 Album|💿 Album|💿 Album|💿 专辑|💿 アルバム
Sin asignar|Unassigned|Non attribué|Non assegnato|未指定|未設定
Pausar pista|Pause track|Mettre en pause|Pausa traccia|暂停曲目|曲を一時停止
Reproducir pista|Play track|Lire la piste|Riproduci traccia|播放曲目|曲を再生
Eliminar de favoritos|Remove from favorites|Retirer des favoris|Rimuovi dai preferiti|取消收藏|お気に入りから削除
Guardar en favoritos|Save to favorites|Ajouter aux favoris|Salva nei preferiti|加入收藏|お気に入りに保存
✓ Las contraseñas coinciden|✓ Passwords match|✓ Les mots de passe correspondent|✓ Le password coincidono|✓ 密码一致|✓ パスワードが一致
Cifrando con SHA-256 y guardando…|Encrypting with SHA-256 and saving…|Chiffrement SHA-256 et enregistrement…|Cifratura SHA-256 e salvataggio…|正在使用 SHA-256 加密并保存…|SHA-256で暗号化・保存中…
Regresar al paso anterior|Return to previous step|Revenir à l’étape précédente|Torna al passaggio precedente|返回上一步|前のステップに戻る
Verifica tu Correo|Verify your email|Vérifiez votre e-mail|Verifica la tua email|验证邮箱|メールを確認
Define tu Contraseña|Set your password|Définissez votre mot de passe|Imposta la password|设置密码|パスワードを設定
Ingresa el código de 6 dígitos que enviamos a tu bandeja.|Enter the 6-digit code sent to your inbox.|Saisissez le code à 6 chiffres reçu.|Inserisci il codice di 6 cifre ricevuto.|输入发送至邮箱的六位验证码。|受信した6桁のコードを入力。
Elige la contraseña que desees para acceder a Sonar.|Choose your password to access Sonar.|Choisissez votre mot de passe Sonar.|Scegli la password per Sonar.|设置用于登录 Sonar 的密码。|Sonarにログインするパスワードを選択。
Pausar Muestra|Pause preview|Mettre l’extrait en pause|Pausa anteprima|暂停试听|試聴を一時停止
Escuchar Ahora (30s)|Listen now (30s)|Écouter (30 s)|Ascolta ora (30 s)|立即试听（30秒）|今すぐ試聴（30秒）
Guardar en tu colección|Save to your collection|Ajouter à votre collection|Salva nella tua collezione|加入你的收藏|コレクションに保存
En tu colección|In your collection|Dans votre collection|Nella tua collezione|已在你的收藏中|コレクションに保存済み
Escribe un verso o letra...|Enter a verse or lyric…|Saisissez un vers ou des paroles…|Inserisci un verso o testo…|输入诗句或歌词…|フレーズや歌詞を入力…
Buscar por canción o pista...|Search song or track…|Chercher une chanson ou piste…|Cerca canzone o traccia…|搜索歌曲或曲目…|曲を検索…
Buscar artista (ej: Radiohead, Björk)...|Search artist (e.g. Radiohead, Björk)…|Chercher un artiste (ex. Radiohead, Björk)…|Cerca artista (es. Radiohead, Björk)…|搜索艺人（如 Radiohead、Björk）…|アーティストを検索（例：Radiohead、Björk）…
Buscar álbum, artista o melodía...|Search album, artist or melody…|Chercher album, artiste ou mélodie…|Cerca album, artista o melodia…|搜索专辑、艺人或旋律…|アルバム、アーティスト、メロディーを検索…
Escuchando... Di el nombre del álbum o artista|Listening… Say an album or artist name|Écoute… Dites le nom d’un album ou artiste|Ascolto… Pronuncia un album o artista|正在聆听…请说出专辑或艺人名称|聞いています…アルバム名やアーティスト名を話してください
Buscar por voz|Voice search|Recherche vocale|Ricerca vocale|语音搜索|音声検索
TENDENCIAS FAMILIARES (MODO KIDS)|FAMILY TRENDS (KIDS MODE)|TENDANCES FAMILIALES (MODE ENFANT)|TENDENZE FAMILIARI (MODALITÀ BAMBINI)|家庭热门（儿童模式）|家族向けトレンド（キッズモード）
TENDENCIAS GLOBALES|GLOBAL TRENDS|TENDANCES MONDIALES|TENDENZE GLOBALI|全球趋势|世界のトレンド
Nivel Relajante|Relaxing level|Niveau relaxant|Livello rilassante|放松强度|リラックスレベル
Máxima Euforia|Maximum euphoria|Euphorie maximale|Massima euforia|极致兴奋|最大の高揚感
Groove Equilibrado|Balanced groove|Groove équilibré|Groove equilibrato|均衡律动|バランスのよいグルーヴ
Quitar de colección|Remove from collection|Retirer de la collection|Rimuovi dalla collezione|从收藏移除|コレクションから削除
Guardar en colección|Save to collection|Ajouter à la collection|Salva nella collezione|加入收藏|コレクションに保存
Generando PNG...|Generating PNG…|Création du PNG…|Generazione PNG…|正在生成 PNG…|PNGを生成中…
Descargar Credencial HD|Download HD card|Télécharger la carte HD|Scarica tessera HD|下载高清凭证|HDカードをダウンロード
¡Copiado!|Copied!|Copié !|Copiato!|已复制！|コピーしました！
Compartir Resumen|Share summary|Partager le résumé|Condividi riepilogo|分享总结|サマリーを共有
Logro Desbloqueado|Achievement unlocked|Succès débloqué|Obiettivo sbloccato|成就已解锁|実績を解除
¡Cadena Guardada!|Chain saved!|Chaîne enregistrée !|Catena salvata!|信号链已保存！|チェーンを保存しました！
Guardar Setup|Save setup|Enregistrer la configuration|Salva configurazione|保存配置|構成を保存
Imagen personalizada activa|Custom image active|Image personnalisée active|Immagine personalizzata attiva|自定义图片已启用|カスタム画像が有効
Degradado predeterminado|Default gradient|Dégradé par défaut|Sfumatura predefinita|默认渐变|標準グラデーション
Cifrando con SHA-256...|Encrypting with SHA-256…|Chiffrement SHA-256…|Cifratura SHA-256…|正在使用 SHA-256 加密…|SHA-256で暗号化中…
Actualizar Contraseña Cifrada|Update encrypted password|Modifier le mot de passe chiffré|Aggiorna password cifrata|更新加密密码|暗号化パスワードを更新
Eliminando cuenta...|Deleting account…|Suppression du compte…|Eliminazione account…|正在删除账户…|アカウントを削除中…
Confirmar y Eliminar Definitivamente|Confirm and permanently delete|Confirmer la suppression définitive|Conferma ed elimina definitivamente|确认并永久删除|確認して完全に削除
🛡️ Modo Kids Activo|🛡️ Kids mode active|🛡️ Mode enfant actif|🛡️ Modalità bambini attiva|🛡️ 儿童模式已启用|🛡️ キッズモード有効
🔑 Modo Supervisado|🔑 Supervised mode|🔑 Mode supervisé|🔑 Modalità supervisionata|🔑 监督模式|🔑 見守りモード
🔓 Modo Libre (Adultos)|🔓 Unrestricted mode (adults)|🔓 Mode libre (adultes)|🔓 Modalità libera (adulti)|🔓 自由模式（成人）|🔓 制限なしモード（成人）
Experiencia musical 100% segura, educativa y adaptada para niños con temporizador de tareas y cuidado auditivo.|Safe, educational music for children with homework timer and hearing care.|Musique sûre et éducative pour enfants avec minuteur et protection auditive.|Musica sicura ed educativa per bambini con timer e protezione uditiva.|适合儿童的安全教育音乐体验，配有作业计时器与听力保护。|宿題タイマーと聴覚保護を備えた、子ども向けの安全な教育音楽体験。
Catálogo con filtro parental y desbloqueo temporal mediante PIN de 4 dígitos.|Parental filter with temporary unlock using a 4-digit PIN.|Filtre parental avec déblocage temporaire par PIN à 4 chiffres.|Filtro genitori con sblocco temporaneo tramite PIN di 4 cifre.|带家长过滤的目录，可通过四位 PIN 临时解锁。|保護者フィルター付きカタログ。4桁のPINで一時解除。
Catálogo completo sin restricciones para adultos, audiófilos y melómanos.|Full unrestricted catalog for adults and music lovers.|Catalogue complet sans restriction pour adultes et mélomanes.|Catalogo completo senza limiti per adulti e appassionati.|面向成人与音乐爱好者的完整无限制目录。|成人と音楽愛好家向けの制限なし全カタログ。
🎧 Sesión en curso con música suave|🎧 Session in progress with gentle music|🎧 Session en cours avec musique douce|🎧 Sessione in corso con musica soft|🎧 正在进行轻音乐会话|🎧 穏やかな音楽でセッション中
Listo para iniciar|Ready to start|Prêt à démarrer|Pronto per iniziare|准备开始|開始準備完了
Pausar Estudio|Pause study|Pause étude|Pausa studio|暂停学习|学習を一時停止
Iniciar Tiempo de Tareas (25 min)|Start homework time (25 min)|Démarrer les devoirs (25 min)|Inizia compiti (25 min)|开始作业时间（25分钟）|宿題時間を開始（25分）
🔊 Reproducción ambiental activa|🔊 Ambient playback active|🔊 Ambiance sonore active|🔊 Riproduzione ambientale attiva|🔊 环境音播放中|🔊 環境音を再生中
Toca para activar ambiente|Tap to activate ambience|Touchez pour activer l’ambiance|Tocca per attivare l’ambiente|点击启用环境音|タップして環境音を有効に
Reflexión Musical|Musical reflection|Réflexion musicale|Riflessione musicale|音乐感想|音楽の感想
¡Nota Guardada en tu Diario!|Note saved in your journal!|Note enregistrée dans votre journal !|Nota salvata nel diario!|笔记已保存到日记！|日記にノートを保存しました！
Guardar en Diario de Escucha|Save to listening journal|Enregistrer dans le journal d’écoute|Salva nel diario d’ascolto|保存到聆听日记|リスニング日記に保存
Caja Diaria Reclamada|Daily box claimed|Coffre quotidien récupéré|Cassa giornaliera riscattata|每日宝箱已领取|デイリーボックス受取済み
Caja Sorpresa Diaria|Daily surprise box|Coffre surprise quotidien|Cassa sorpresa giornaliera|每日惊喜宝箱|毎日のサプライズボックス
Vuelve mañana para más premios|Come back tomorrow for more rewards|Revenez demain pour plus de récompenses|Torna domani per altri premi|明天再来领取更多奖励|明日も報酬を受け取ろう
Gira y gana monedas y XP|Spin to win coins and XP|Tournez pour gagner pièces et XP|Gira per vincere monete e XP|旋转赢取金币与经验|回してコインとXPを獲得
✓ Abierta|✓ Opened|✓ Ouvert|✓ Aperta|✓ 已打开|✓ 開封済み
Abriendo...|Opening…|Ouverture…|Apertura…|打开中…|開封中…
Abrir Gratis|Open free|Ouvrir gratuitement|Apri gratis|免费打开|無料で開く
Pase Activo|Pass active|Pass actif|Pass attivo|通行证已启用|パス有効
Adquirido|Owned|Acquis|Acquistato|已拥有|取得済み
Equipado|Equipped|Équipé|Equipaggiato|已装备|装備中
Activar|Activate|Activer|Attiva|启用|有効にする
Equipar|Equip|Équiper|Equipaggia|装备|装備する
¡Firma Guardada!|Signature saved!|Signature enregistrée !|Firma salvata!|音色已保存！|サウンド特性を保存しました！
Aplicar al Perfil|Apply to profile|Appliquer au profil|Applica al profilo|应用到资料|プロフィールに適用
Título del Álbum|Album title|Titre de l’album|Titolo dell’album|专辑标题|アルバム名
Edición Maestra|Master edition|Édition maîtresse|Edizione master|母版版本|マスター版
Comentario reportado a moderación|Comment reported to moderators|Commentaire signalé aux modérateurs|Commento segnalato ai moderatori|评论已提交审核|コメントを審査に報告済み
Reportar comentario|Report comment|Signaler le commentaire|Segnala commento|举报评论|コメントを報告
Comentario reportado|Comment reported|Commentaire signalé|Commento segnalato|评论已举报|コメント報告済み
Reportar|Report|Signaler|Segnala|举报|報告
Respuesta reportada a moderación|Reply reported to moderators|Réponse signalée aux modérateurs|Risposta segnalata ai moderatori|回复已提交审核|返信を審査に報告済み
Reportar respuesta|Report reply|Signaler la réponse|Segnala risposta|举报回复|返信を報告
Respuesta reportada|Reply reported|Réponse signalée|Risposta segnalata|回复已举报|返信報告済み
Enviando…|Sending…|Envoi…|Invio…|发送中…|送信中…
Enviar reporte|Send report|Envoyer le signalement|Invia segnalazione|发送举报|報告を送信
Reseña de la comunidad|Community review|Avis de la communauté|Recensione della community|社区评论|コミュニティレビュー
Seguir Artista|Follow artist|Suivre l’artiste|Segui artista|关注艺人|アーティストをフォロー
Reseña reportada a moderación|Review reported to moderators|Avis signalé aux modérateurs|Recensione segnalata ai moderatori|乐评已提交审核|レビューを審査に報告済み
Reportar esta reseña a moderación|Report this review to moderators|Signaler cet avis aux modérateurs|Segnala questa recensione ai moderatori|将此乐评举报给审核员|このレビューを審査に報告
Reseña reportada|Review reported|Avis signalé|Recensione segnalata|乐评已举报|レビュー報告済み
Reportada|Reported|Signalée|Segnalata|已举报|報告済み
Selecciona una puntuación|Select a rating|Choisissez une note|Scegli una valutazione|选择评分|評価を選択
Describe la letra, producción sonora, instrumentación, interpretación vocal, mezcla o momento cumbre de la canción...|Describe lyrics, production, instruments, vocals, mix or highlights…|Décrivez paroles, production, instruments, voix, mixage ou moments forts…|Descrivi testi, produzione, strumenti, voce, mix o momenti salienti…|描述歌词、制作、乐器、演唱、混音或歌曲高潮…|歌詞、制作、楽器、歌唱、ミックス、聴きどころを説明…
Describe la cohesión temática del disco, la producción general, masterización, prensado en vinilo o impacto global...|Describe the album’s themes, production, mastering, vinyl pressing or overall impact…|Décrivez les thèmes, la production, le mastering, le pressage ou l’impact de l’album…|Descrivi temi, produzione, mastering, stampa del vinile o impatto dell’album…|描述专辑主题、整体制作、母带、黑胶压制或整体影响…|アルバムのテーマ、制作、マスタリング、プレス、全体の印象を説明…
Publicar Crítica de Canción|Publish track review|Publier une critique de titre|Pubblica recensione traccia|发布歌曲评论|曲のレビューを公開
Publicar Crítica de Álbum|Publish album review|Publier une critique d’album|Pubblica recensione album|发布专辑评论|アルバムレビューを公開
100% (Normal)|100% (normal)|100 % (normal)|100% (normale)|100%（标准）|100%（標準）
115% (Grande)|115% (large)|115 % (grand)|115% (grande)|115%（大）|115%（大）
130% (Extra)|130% (extra large)|130 % (très grand)|130% (extra)|130%（特大）|130%（特大）
Relajado|Relaxed|Détendu|Rilassato|宽松|ゆったり
Amplio|Wide|Large|Ampio|宽|広い
Detener Voz|Stop voice|Arrêter la voix|Ferma voce|停止语音|音声を停止
Probar Voz|Test voice|Tester la voix|Prova voce|测试语音|音声を試す
Detener lectura en voz alta|Stop reading aloud|Arrêter la lecture vocale|Ferma lettura vocale|停止朗读|読み上げを停止
Escuchar en voz alta (Text-to-Speech)|Read aloud (text-to-speech)|Lire à voix haute (synthèse vocale)|Leggi ad alta voce (sintesi vocale)|朗读（文字转语音）|読み上げ（音声合成）
Detener|Stop|Arrêter|Ferma|停止|停止
Ver notas del episodio|View episode notes|Voir les notes de l’épisode|Vedi note dell’episodio|查看节目笔记|エピソードノートを見る
Ver canciones del álbum|View album tracks|Voir les pistes de l’album|Vedi tracce dell’album|查看专辑曲目|アルバムの曲を見る
Pausar Podcast|Pause podcast|Mettre le podcast en pause|Pausa podcast|暂停播客|ポッドキャストを一時停止
Reproducir Podcast|Play podcast|Écouter le podcast|Riproduci podcast|播放播客|ポッドキャストを再生
En tus favoritos|In your favorites|Dans vos favoris|Nei tuoi preferiti|已收藏|お気に入りに保存済み
Ocultar canciones del álbum|Hide album tracks|Masquer les pistes de l’album|Nascondi tracce dell’album|隐藏专辑曲目|アルバムの曲を隠す
Ver canciones de este álbum|View this album’s tracks|Voir les pistes de cet album|Vedi tracce di questo album|查看此专辑曲目|このアルバムの曲を見る
Análisis acústico y disección sonora del episodio.|Audio analysis of the episode.|Analyse sonore de l’épisode.|Analisi sonora dell’episodio.|节目的音频分析。|エピソードの音声分析。
Leer Voz|Read aloud|Lire à voix haute|Leggi ad alta voce|语音朗读|読み上げ
Copiado|Copied|Copié|Copiato|已复制|コピー済み
Copiar|Copy|Copier|Copia|复制|コピー
Esta pista es una composición instrumental pura sin letra vocal registrada.|This is an instrumental track with no registered lyrics.|Cette piste instrumentale n’a pas de paroles enregistrées.|Questa traccia strumentale non ha testi registrati.|此曲为纯器乐作品，没有登记歌词。|この曲は歌詞のないインストゥルメンタルです。
Para episodios de podcast, consulta la pestaña de Ficha Técnica.|For podcasts, see the technical details tab.|Pour les podcasts, consultez la fiche technique.|Per i podcast, consulta la scheda tecnica.|播客请查看技术信息选项卡。|ポッドキャストは技術情報タブをご覧ください。
No se encontró transcripción abierta para esta canción.|No public transcript found for this track.|Aucune transcription publique pour ce titre.|Nessuna trascrizione pubblica per questa traccia.|未找到此歌曲的公开文字稿。|この曲の公開された文字起こしは見つかりませんでした。
Canción|Track|Titre|Traccia|歌曲|曲
Canción en favoritos|Track in favorites|Titre dans les favoris|Traccia nei preferiti|歌曲已收藏|曲はお気に入りに保存済み
Esta canción está clasificada con lenguaje explícito no apto para menores.|This track has explicit language unsuitable for minors.|Ce titre contient un langage explicite inadapté aux mineurs.|Questa traccia contiene linguaggio esplicito non adatto ai minori.|此歌曲包含不适合未成年人的露骨语言。|この曲には未成年に適さない露骨な表現があります。
Cambiar a Modo Negro|Switch to dark mode|Passer au mode sombre|Passa alla modalità scura|切换深色模式|ダークモードに変更
Aprobada|Approved|Approuvée|Approvata|已批准|承認済み
Cola de moderación|Moderation queue|File de modération|Coda di moderazione|审核队列|審査キュー
Consultando Deezer…|Querying Deezer…|Consultation de Deezer…|Consultazione Deezer…|正在查询 Deezer…|Deezerに問い合わせ中…
Información de Deezer|Deezer information|Informations Deezer|Informazioni Deezer|Deezer 信息|Deezerの情報
Datos guardados · Deezer no disponible|Saved data · Deezer unavailable|Données enregistrées · Deezer indisponible|Dati salvati · Deezer non disponibile|已保存数据 · Deezer 不可用|保存データ・Deezer利用不可
No se pudo cargar el álbum|Could not load album|Impossible de charger l’album|Impossibile caricare l’album|无法加载专辑|アルバムを読み込めませんでした
`.trim().split('\n').map(row => row.split('|'));
export const STATE_TRANSLATIONS = Object.fromEntries(
  ['es', 'en', 'fr', 'it', 'zh', 'ja'].map((language, index) => [language, Object.fromEntries(rows.map(values => [values[0], values[index]]))]),
);
