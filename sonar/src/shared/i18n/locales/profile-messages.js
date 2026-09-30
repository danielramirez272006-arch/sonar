const rows = `
Historial (|History (|Historique (|Cronologia (|历史（|履歴（
Artistas (|Artists (|Artistes (|Artisti (|艺人（|アーティスト（
Siguiendo (|Following (|Abonnements (|Seguiti (|关注（|フォロー中（
Equipamiento Hi-Fi|Hi-fi equipment|Équipement hi-fi|Attrezzatura hi-fi|高保真设备|Hi-Fi機器
Modo Kids & Control|Kids mode & controls|Mode enfant et contrôle|Modalità bambini e controllo|儿童模式与控制|キッズモードと設定
Importar|Import|Importer|Importa|导入|インポート
Exportar|Export|Exporter|Esporta|导出|エクスポート
Backup|Backup|Sauvegarde|Backup|备份|バックアップ
Algoritmo acústico ajustado a tus gustos:|Sound algorithm tuned to your taste:|Algorithme sonore adapté à vos goûts :|Algoritmo sonoro adattato ai tuoi gusti:|已按你的偏好调整音乐算法：|好みに合わせた音楽アルゴリズム：
Modificar géneros en perfil|Edit genres in profile|Modifier les genres du profil|Modifica generi nel profilo|在资料中修改流派|プロフィールのジャンルを編集
% Afinidad|% affinity|% d’affinité|% affinità|% 匹配度|%の相性
Escribir reseña|Write review|Écrire un avis|Scrivi recensione|撰写评论|レビューを書く
Cuadrícula|Grid|Grille|Griglia|网格|グリッド
Caja 3D|3D crate|Bac 3D|Cassa 3D|3D唱片箱|3Dクレート
No tienes discos guardados en esta categoría|No records saved in this category|Aucun disque enregistré dans cette catégorie|Nessun disco salvato in questa categoria|此类别暂无已保存唱片|このカテゴリに保存したレコードはありません
Explora las recomendaciones personalizadas o busca álbumes para añadirlos a tus colecciones personales.|Explore recommendations or find albums to add to your collections.|Explorez les recommandations ou cherchez des albums à ajouter à vos collections.|Esplora i consigli o cerca album da aggiungere alle tue collezioni.|探索个性推荐或查找专辑以加入收藏。|おすすめを探したり、コレクションに追加するアルバムを検索しましょう。
Escribir notas íntimas en tu Diario Acústico|Write private listening notes|Écrire des notes d’écoute privées|Scrivi note di ascolto private|撰写私人聆听笔记|非公開のリスニングノートを書く
Diario|Journal|Journal|Diario|日记|日記
Buscar por álbum, artista o texto de tu crítica...|Search album, artist or review text…|Chercher un album, artiste ou texte d’avis…|Cerca album, artista o testo della recensione…|搜索专辑、艺人或评论文本…|アルバム、アーティスト、レビュー本文を検索…
Ordenar:|Sort:|Trier :|Ordina:|排序：|並べ替え：
Más antiguas|Oldest first|Les plus anciens|Meno recenti|最早优先|古い順
Mayor puntuación ⭐|Highest rated ⭐|Mieux notés ⭐|Voto più alto ⭐|评分最高 ⭐|高評価順 ⭐
Menor puntuación|Lowest rated|Moins bien notés|Voto più basso|评分最低|低評価順
Calificación:|Rating:|Note :|Valutazione:|评分：|評価：
Tipo:|Type:|Type :|Tipo:|类型：|種類：
Mostrando|Showing|Affichage|Visualizzati|显示|表示中
de|of|sur|di|共|／
Aún no has escrito ninguna reseña|You have not written any reviews yet|Vous n’avez pas encore écrit d’avis|Non hai ancora scritto recensioni|你还没有撰写评论|まだレビューを書いていません
Comparte tus análisis acústicos y reflexiones sonoras con la comunidad de Sonar.|Share your music analysis and reflections with Sonar.|Partagez vos analyses et réflexions musicales avec Sonar.|Condividi analisi e riflessioni musicali con Sonar.|与 Sonar 社区分享音乐分析与感想。|Sonarコミュニティに音楽の分析や感想を共有しましょう。
Explorar álbumes recomendados|Explore recommended albums|Explorer les albums recommandés|Esplora album consigliati|探索推荐专辑|おすすめアルバムを探す
No se encontraron reseñas con los filtros seleccionados|No reviews match these filters|Aucun avis ne correspond aux filtres|Nessuna recensione corrisponde ai filtri|没有符合筛选条件的评论|フィルターに一致するレビューがありません
Prueba cambiando el término de búsqueda o seleccionando otra calificación.|Try another search term or rating.|Essayez un autre terme ou une autre note.|Prova un altro termine o un’altra valutazione.|请尝试其他搜索词或评分。|検索語や評価を変更してください。
Registro de canciones, pistas y podcasts reproducidos recientemente en esta sesión.|Tracks and podcasts played recently in this session.|Titres et podcasts récemment écoutés dans cette session.|Tracce e podcast riprodotti di recente in questa sessione.|本次会话最近播放的曲目和播客。|このセッションで最近再生した曲とポッドキャスト。
Limpiar Historial|Clear history|Effacer l’historique|Cancella cronologia|清除历史|履歴を消去
Aún no has reproducido ninguna pista|You have not played any tracks yet|Vous n’avez pas encore écouté de titre|Non hai ancora riprodotto tracce|你还没有播放曲目|まだ曲を再生していません
Explorar Recomendaciones|Explore recommendations|Explorer les recommandations|Esplora consigli|探索推荐|おすすめを探す
Reproducir de nuevo|Play again|Réécouter|Riproduci di nuovo|再次播放|もう一度再生
Aún no sigues a ningún artista|You do not follow any artists yet|Vous ne suivez aucun artiste|Non segui ancora artisti|你还没有关注艺人|まだアーティストをフォローしていません
Descubrir Artistas en la Comunidad|Discover community artists|Découvrir les artistes de la communauté|Scopri artisti nella community|发现社区艺人|コミュニティのアーティストを探す
Dejar de seguir|Unfollow|Ne plus suivre|Smetti di seguire|取消关注|フォロー解除
Aún no sigues a ningún melómano|You do not follow any music lovers yet|Vous ne suivez aucun mélomane|Non segui ancora appassionati|你还没有关注音乐爱好者|まだ音楽愛好家をフォローしていません
Ver Melómanos Destacados|View featured music lovers|Voir les mélomanes à la une|Vedi appassionati in evidenza|查看精选音乐爱好者|注目の音楽愛好家を見る
% Afinidad Sonora|% music affinity|% d’affinité musicale|% affinità musicale|% 音乐匹配度|%の音楽の相性
Siguiendo ✓|Following ✓|Abonné ✓|Segui già ✓|已关注 ✓|フォロー中 ✓
Equipamiento Hi-Fi & Calibración|Hi-fi equipment & calibration|Équipement hi-fi et calibration|Attrezzatura hi-fi e calibrazione|高保真设备与校准|Hi-Fi機器と調整
Calidad de Estudio|Studio quality|Qualité studio|Qualità studio|录音室音质|スタジオ品質
✓ Equipamiento actualizado con éxito|✓ Equipment updated|✓ Équipement mis à jour|✓ Attrezzatura aggiornata|✓ 设备更新成功|✓ 機器を更新しました
Tornamesa|Turntable|Platine|Giradischi|唱机|ターンテーブル
Audífonos|Headphones|Casque|Cuffie|耳机|ヘッドホン
DAC / Amplificador|DAC / amplifier|DAC / amplificateur|DAC / amplificatore|DAC / 放大器|DAC／アンプ
Formato Clave|Key format|Format clé|Formato principale|主要格式|主な形式
Tornamesa / Reproductor|Turntable / player|Platine / lecteur|Giradischi / lettore|唱机 / 播放器|ターンテーブル／プレーヤー
Audífonos / Monitores|Headphones / monitors|Casque / enceintes|Cuffie / monitor|耳机 / 监听音箱|ヘッドホン／モニター
DAC & Amplificación|DAC & amplification|DAC et amplification|DAC e amplificazione|DAC 与放大|DACと増幅
Formato Preferido de Audición|Preferred listening format|Format d’écoute préféré|Formato di ascolto preferito|首选聆听格式|好みのリスニング形式
Guardar Equipamiento en Perfil|Save equipment to profile|Enregistrer l’équipement du profil|Salva attrezzatura nel profilo|将设备保存到资料|プロフィールに機器を保存
Cargando permisos...|Loading permissions…|Chargement des autorisations…|Caricamento permessi…|正在加载权限…|権限を読み込み中…
Pista anterior|Previous track|Piste précédente|Traccia precedente|上一曲|前の曲
Pista siguiente|Next track|Piste suivante|Traccia successiva|下一曲|次の曲
Obtenido|Obtained|Obtenu|Ottenuto|已获得|獲得済み
Recompensa Acústica|Music reward|Récompense musicale|Premio musicale|音乐奖励|音楽リワード
Entendido|Got it|Compris|Capito|知道了|了解
Gamificación & Misiones Semanales|Gamification & weekly quests|Jeu et missions hebdomadaires|Gioco e missioni settimanali|游戏化与每周任务|ゲームと週間クエスト
Desafíos Acústicos|Music challenges|Défis musicaux|Sfide musicali|音乐挑战|音楽チャレンジ
Completa misiones de escucha y curaduría para elevar tu rango y desbloquear recompensas exclusivas.|Complete listening and curation quests to rank up and unlock rewards.|Accomplissez des missions d’écoute et de sélection pour progresser et gagner des récompenses.|Completa missioni di ascolto e selezione per salire di livello e ottenere premi.|完成聆听与精选任务以提升等级并解锁奖励。|リスニングや選曲のクエストでランクを上げ、特典を獲得しましょう。
Renuevan en 4 días|Refresh in 4 days|Renouvellement dans 4 jours|Si rinnovano tra 4 giorni|4天后更新|4日後に更新
Progreso:|Progress:|Progression :|Progresso:|进度：|進捗：
Reclamado|Claimed|Récupéré|Riscattato|已领取|受取済み
Reclamar|Claim|Récupérer|Riscatta|领取|受け取る
En curso|In progress|En cours|In corso|进行中|進行中
Perfil & Avatar Studio|Profile & avatar studio|Profil et studio d’avatar|Profilo e studio avatar|资料与头像工作室|プロフィールとアバタースタジオ
Equipamiento Audiófilo|Audiophile equipment|Équipement audiophile|Attrezzatura audiofila|发烧友设备|オーディオ機器
Seguridad & Cifrado|Security & encryption|Sécurité et chiffrement|Sicurezza e crittografia|安全与加密|セキュリティと暗号化
Eliminar Cuenta|Delete account|Supprimer le compte|Elimina account|删除账户|アカウントを削除
Nombre de Usuario / Firma|Username / signature|Nom d’utilisateur / signature|Nome utente / firma|用户名 / 签名|ユーザー名／署名
Biografía / Manifiesto Musical|Biography / music manifesto|Biographie / manifeste musical|Biografia / manifesto musicale|简介 / 音乐宣言|自己紹介／音楽マニフェスト
Cuéntale a la comunidad tus discos de cabecera o qué buscas en una masterización...|Tell the community about your favorite records or mastering preferences…|Présentez vos disques favoris ou vos attentes en matière de mastering…|Racconta i tuoi dischi preferiti o cosa cerchi nel mastering…|向社区介绍喜爱的唱片或母带处理偏好…|お気に入りのレコードやマスタリングへのこだわりを紹介…
Identidad Visual|Visual identity|Identité visuelle|Identità visiva|视觉身份|ビジュアルアイデンティティ
Personaliza tu avatar con más de 34 combinaciones cromáticas.|Customize your avatar with over 34 color combinations.|Personnalisez votre avatar avec plus de 34 combinaisons de couleurs.|Personalizza l’avatar con oltre 34 combinazioni cromatiche.|使用超过34种配色组合自定义头像。|34種類以上の配色でアバターをカスタマイズ。
Generar Aleatorio|Generate random|Générer au hasard|Genera casuale|随机生成|ランダム生成
Vista previa del avatar subido|Uploaded avatar preview|Aperçu de l’avatar importé|Anteprima avatar caricato|已上传头像预览|アップロードしたアバターのプレビュー
Imagen cargada con éxito|Image uploaded|Image importée|Immagine caricata|图片上传成功|画像をアップロードしました
Tu foto será visible en todas tus reseñas y perfil|Your photo will appear on your reviews and profile|Votre photo sera visible sur vos avis et votre profil|La foto sarà visibile nelle recensioni e nel profilo|照片将显示在你的评论与资料中|写真はレビューとプロフィールに表示されます
Cambiar Foto|Change photo|Changer de photo|Cambia foto|更换照片|写真を変更
Eliminar foto|Remove photo|Supprimer la photo|Rimuovi foto|删除照片|写真を削除
Haz clic para seleccionar o arrastra tu foto aquí|Click to choose or drag your photo here|Cliquez pour choisir ou glissez votre photo ici|Fai clic o trascina qui la foto|点击选择或将照片拖到此处|クリックで選択するか写真をドラッグ
Archivos PNG, JPG, JPEG, WEBP o GIF (hasta 8MB)|PNG, JPG, JPEG, WEBP or GIF (up to 8MB)|PNG, JPG, JPEG, WEBP ou GIF (8 Mo max)|PNG, JPG, JPEG, WEBP o GIF (max 8 MB)|PNG、JPG、JPEG、WEBP 或 GIF（最大8MB）|PNG、JPG、JPEG、WEBP、GIF（8MBまで）
Fondo del Avatar|Avatar background|Fond de l’avatar|Sfondo avatar|头像背景|アバターの背景
24 Sólidos|24 solid colors|24 couleurs unies|24 colori uniformi|24种纯色|24色の単色
10 Degradados|10 gradients|10 dégradés|10 sfumature|10种渐变|10種類のグラデーション
Portada de Perfil (Banner)|Profile cover (banner)|Couverture du profil (bannière)|Copertina del profilo (banner)|资料封面（横幅）|プロフィールのカバー（バナー）
Subir Imagen|Upload image|Importer une image|Carica immagine|上传图片|画像をアップロード
Quitar|Remove|Retirer|Rimuovi|移除|削除
O elige un estilo de atmósfera sonora:|Or choose a sound atmosphere style:|Ou choisissez une ambiance sonore :|Oppure scegli un’atmosfera sonora:|或选择音乐氛围风格：|または音楽の雰囲気を選択：
Gustos Musicales|Music taste|Goûts musicaux|Gusti musicali|音乐偏好|音楽の好み
Guardar Perfil & Preferencias|Save profile & preferences|Enregistrer profil et préférences|Salva profilo e preferenze|保存资料与偏好|プロフィールと好みを保存
Equipamiento de Escucha|Listening equipment|Équipement d’écoute|Attrezzatura di ascolto|聆听设备|リスニング機器
Guardar Equipamiento|Save equipment|Enregistrer l’équipement|Salva attrezzatura|保存设备|機器を保存
Cifrado & Seguridad de la Cuenta|Account encryption & security|Chiffrement et sécurité du compte|Crittografia e sicurezza account|账户加密与安全|アカウントの暗号化と安全
Contraseña Actual|Current password|Mot de passe actuel|Password attuale|当前密码|現在のパスワード
Ingresa tu contraseña actual|Enter your current password|Saisissez votre mot de passe actuel|Inserisci la password attuale|输入当前密码|現在のパスワードを入力
Nueva Contraseña (Mínimo 6 caracteres)|New password (at least 6 characters)|Nouveau mot de passe (6 caractères minimum)|Nuova password (almeno 6 caratteri)|新密码（至少6个字符）|新しいパスワード（6文字以上）
Crea una contraseña segura|Create a secure password|Créez un mot de passe sûr|Crea una password sicura|创建安全密码|安全なパスワードを作成
Confirmar Nueva Contraseña|Confirm new password|Confirmer le nouveau mot de passe|Conferma nuova password|确认新密码|新しいパスワードを確認
Repite tu nueva contraseña|Repeat your new password|Répétez votre nouveau mot de passe|Ripeti la nuova password|再次输入新密码|新しいパスワードを再入力
Portabilidad: Exportar mis Datos (JSON)|Portability: export my data (JSON)|Portabilité : exporter mes données (JSON)|Portabilità: esporta i miei dati (JSON)|可移植性：导出我的数据（JSON）|データ移行：データをエクスポート（JSON）
Descargar Archivo JSON|Download JSON file|Télécharger le fichier JSON|Scarica file JSON|下载 JSON 文件|JSONファイルをダウンロード
Zona de Peligro: Eliminar Cuenta Permanentemente|Danger zone: permanently delete account|Zone sensible : supprimer définitivement le compte|Zona pericolosa: elimina account definitivamente|危险区域：永久删除账户|危険ゾーン：アカウントの完全削除
Para confirmar la eliminación, escribe|To confirm deletion, type|Pour confirmer la suppression, saisissez|Per confermare l’eliminazione, digita|要确认删除，请输入|削除を確認するには入力：
Diario Acústico & Sleeve Notes|Listening journal & sleeve notes|Journal d’écoute et notes de pochette|Diario d’ascolto e note di copertina|聆听日记与唱片笔记|リスニング日記とライナーノーツ
Atmósfera de Audición:|Listening atmosphere:|Ambiance d’écoute :|Atmosfera di ascolto:|聆听氛围：|リスニングの雰囲気：
Momento o Pasaje Destacado (mm:ss):|Highlight moment (mm:ss):|Passage marquant (mm:ss) :|Momento saliente (mm:ss):|精彩时刻（分:秒）：|注目の場面（分:秒）：
Tus Notas de Escucha Privadas:|Your private listening notes:|Vos notes d’écoute privées :|Le tue note di ascolto private:|你的私人聆听笔记：|非公開のリスニングノート：
Saldo Sonar Coins|Sonar Coins balance|Solde Sonar Coins|Saldo Sonar Coins|Sonar Coins 余额|Sonar Coins残高
Boutique Activa|Store open|Boutique ouverte|Boutique aperta|商店已开放|ストア営業中
Rango & Experiencia|Rank & experience|Rang et expérience|Rango ed esperienza|等级与经验|ランクと経験値
Nivel|Level|Niveau|Livello|等级|レベル
Faltan|Remaining|Restant|Mancano|还需|あと
XP para alcanzar el|XP to reach|XP pour atteindre|XP per raggiungere|经验值即可达到|XPで到達：
Racha de Escucha|Listening streak|Série d’écoute|Serie di ascolto|连续聆听|連続リスニング
🔥 5 Días Seguidos|🔥 5 days in a row|🔥 5 jours de suite|🔥 5 giorni consecutivi|🔥 连续5天|🔥 5日連続
Multiplicador de puntos:|Points multiplier:|Multiplicateur de points :|Moltiplicatore punti:|积分倍数：|ポイント倍率：
1.5x Bonificación Activa|1.5x bonus active|Bonus 1,5x actif|Bonus 1,5x attivo|1.5倍奖励生效|1.5倍ボーナス有効
Boutique Exclusiva Sonar Hi-Fi|Exclusive Sonar Hi-Fi store|Boutique exclusive Sonar Hi-Fi|Boutique esclusiva Sonar Hi-Fi|Sonar Hi-Fi 专属商店|Sonar Hi-Fi限定ストア
Catálogo de Canje & Personalización|Redemption & customization catalog|Catalogue d’échange et personnalisation|Catalogo premi e personalizzazione|兑换与自定义目录|交換とカスタマイズのカタログ
Vista previa en avatar|Preview on avatar|Aperçu sur l’avatar|Anteprima sull’avatar|头像预览|アバターでプレビュー
Canjear|Redeem|Échanger|Riscatta|兑换|交換
Desafíos & Misiones Semanales|Weekly challenges & quests|Défis et missions hebdomadaires|Sfide e missioni settimanali|每周挑战与任务|週間チャレンジとクエスト
Gana Monedas Cumpliendo Metas Musicales|Earn coins by reaching music goals|Gagnez des pièces avec vos objectifs musicaux|Guadagna monete con obiettivi musicali|完成音乐目标赚取金币|音楽の目標を達成してコインを獲得
Renuevan cada lunes|Refresh every Monday|Renouvellement chaque lundi|Si rinnovano ogni lunedì|每周一更新|毎週月曜に更新
Reclamar Recompensa|Claim reward|Récupérer la récompense|Riscatta premio|领取奖励|報酬を受け取る
Procesamiento Digital de Audio (DSP)|Digital signal processing (DSP)|Traitement audio numérique (DSP)|Elaborazione audio digitale (DSP)|数字音频处理（DSP）|デジタル音声処理（DSP）
Firma de Sonido & Ecualizador|Sound signature & equalizer|Signature sonore et égaliseur|Firma sonora ed equalizzatore|音色特征与均衡器|サウンド特性とイコライザー
Ajuste de Bandas de Frecuencia (dB)|Frequency band adjustment (dB)|Réglage des bandes de fréquence (dB)|Regolazione bande di frequenza (dB)|频段调整（dB）|周波数帯域の調整（dB）
Rango: -6 dB a +6 dB|Range: -6 dB to +6 dB|Plage : -6 dB à +6 dB|Intervallo: da -6 dB a +6 dB|范围：-6 dB 至 +6 dB|範囲：-6 dB〜+6 dB
Rango actual|Current rank|Rang actuel|Rango attuale|当前等级|現在のランク
reseñas para alcanzar el rango:|reviews to reach rank:|avis pour atteindre le rang :|recensioni per raggiungere il rango:|条评论即可达到等级：|レビューで次のランク：
Tu Caja de Vinilos está vacía|Your vinyl crate is empty|Votre bac à vinyles est vide|La tua cassa di vinili è vuota|你的黑胶唱片箱为空|レコードクレートは空です
Guarda álbumes en tu colección para hojearlos en el visor 3D.|Save albums to browse them in the 3D viewer.|Enregistrez des albums pour les parcourir en 3D.|Salva album per sfogliarli nel visualizzatore 3D.|保存专辑后可在3D视图中浏览。|アルバムを保存して3Dビューで閲覧しましょう。
Modo Caja 3D •|3D crate mode •|Mode bac 3D •|Modalità cassa 3D •|3D唱片箱模式 •|3Dクレートモード •
Haz clic para reproducir este vinilo|Click to play this vinyl|Cliquez pour écouter ce vinyle|Fai clic per riprodurre questo vinile|点击播放此黑胶|クリックしてこのレコードを再生
Estado Físico:|Physical condition:|État physique :|Condizione fisica:|品相：|盤の状態：
Vinilo anterior|Previous vinyl|Vinyle précédent|Vinile precedente|上一张黑胶|前のレコード
Poner en Tornamesa|Put on turntable|Mettre sur la platine|Metti sul giradischi|放入唱机|ターンテーブルに置く
Siguiente vinilo|Next vinyl|Vinyle suivant|Vinile successivo|下一张黑胶|次のレコード
El PIN actual no es correcto.|The current PIN is incorrect.|Le code PIN actuel est incorrect.|Il PIN attuale non è corretto.|当前 PIN 不正确。|現在のPINが正しくありません。
PIN parental actualizado.|Parental PIN updated.|Code PIN parental mis à jour.|PIN genitoriale aggiornato.|家长 PIN 已更新。|保護者用PINを更新しました。
Modo Kids activado.|Kids Mode enabled.|Mode enfant activé.|Modalità Kids attivata.|儿童模式已开启。|キッズモードを有効にしました。
Modo supervisado activado.|Supervised Mode enabled.|Mode supervisé activé.|Modalità supervisionata attivata.|监督模式已开启。|保護者監督モードを有効にしました。
Modo adulto activado.|Adult Mode enabled.|Mode adulte activé.|Modalità adulti attivata.|成人模式已开启。|大人モードを有効にしました。
PIN incorrecto. El Modo Kids sigue activo.|Incorrect PIN. Kids Mode is still active.|Code PIN incorrect. Le mode enfant reste actif.|PIN errato. La Modalità Kids resta attiva.|PIN 错误。儿童模式仍处于启用状态。|PINが違います。キッズモードは有効なままです。
Se requiere el PIN parental|Parental PIN required|Code PIN parental requis|È richiesto il PIN genitoriale|需要家长 PIN|保護者用PINが必要です
Ingresa el PIN de 4 dígitos para salir del Modo Kids. El modo seguirá activo si cancelas.|Enter the 4-digit PIN to leave Kids Mode. It will remain active if you cancel.|Saisissez le code PIN à 4 chiffres pour quitter le mode enfant. Il restera actif si vous annulez.|Inserisci il PIN di 4 cifre per uscire dalla Modalità Kids. Resterà attiva se annulli.|输入 4 位 PIN 以退出儿童模式。取消后儿童模式仍会保持启用。|キッズモードを終了するには4桁のPINを入力してください。キャンセルするとモードは有効なままです。
PIN parental|Parental PIN|Code PIN parental|PIN genitoriale|家长 PIN|保護者用PIN
PIN actual|Current PIN|Code PIN actuel|PIN attuale|当前 PIN|現在のPIN
Nuevo PIN|New PIN|Nouveau code PIN|Nuovo PIN|新 PIN|新しいPIN
Sesión Inmersiva sin Pausas|Immersive Non-Stop Session|Session immersive sans pause|Sessione immersiva senza pause|无缝沉浸聆听|途切れない没入セッション
Escucha 3 álbumes completos en calidad Lossless.|Listen to 3 full albums in Lossless quality.|Écoutez 3 albums complets en qualité sans perte.|Ascolta 3 album completi in qualità Lossless.|在无损音质下完整聆听 3 张专辑。|ロスレス音質でフルアルバムを3枚聴く。
Crítica de Rango Dinámico|Dynamic Range Review|Critique de plage dynamique|Recensione gamma dinamica|动态范围乐评|ダイナミックレンジのレビュー
Publica una reseña detallando la fidelidad acústica de un disco.|Publish a review detailing the acoustic fidelity of an album.|Publiez un avis détaillant la fidélité acoustique d'un disque.|Pubblica una recensione che dettagli la fedeltà acustica di un disco.|发布一篇详述专辑声学保真度的乐评。|レコードの音響再現性を詳細にレビュー。
Fidelidad Diaria Constante|Daily Listening Consistency|Fidélité quotidienne constante|Costanza d'ascolto quotidiana|每日持续聆听|毎日の安定したリスニング
Mantén una racha de 3 días consecutivos escuchando música.|Keep a 3-day consecutive listening streak.|Maintenez une série de 3 jours d'écoute consécutifs.|Mantieni una serie di 3 giorni consecutivi di ascolto.|保持连续 3 天的音乐聆听记录。|3日連続で音楽を聴く連続記録を維持。
Curador de Vinilos Independientes|Indie Vinyl Curator|Curateur de vinyles indépendants|Curatore di vinili indipendenti|独立黑胶策展人|インディーズレコードキュレーター
Guarda 5 álbumes de sellos discográficos de culto.|Save 5 albums from cult record labels.|Enregistrez 5 albums de labels de culte.|Salva 5 album di etichette discografiche di culto.|收藏 5 张小众或先锋厂牌专辑。|カルトレーベルのアルバムを5枚保存。
Sesión Inmersiva Diaria|Daily Immersive Session|Session immersive quotidienne|Sessione immersiva quotidiana|每日沉浸聆听|デイリー没入セッション
Escucha 3 pistas completas sin interrupción en Sonar.|Listen to 3 full tracks without interruption on Sonar.|Écoutez 3 pistes complètes sans interruption sur Sonar.|Ascolta 3 brani completi senza interruzioni su Sonar.|在 Sonar 上无间断完整聆听 3 首曲目。|Sonarで曲を途切れることなく3曲フル再生。
Crítica de Audiofilia|Audiophile Review|Critique audiophile|Recensione audiofila|发烧友乐评|オーディオファイルレビュー
Publica o califica una reseña evaluando el rango dinámico.|Publish or rate a review evaluating dynamic range.|Publiez ou notez un avis évaluant la plage dynamique.|Pubblica o valuta una recensione sulla gamma dinamica.|发布或评价关于动态范围的乐评。|ダイナミックレンジを評価するレビューを投稿または採点。
Curador de la Semana|Curator of the Week|Curateur de la semaine|Curatore della settimana|本周策展人|今週のキュレーター
Guarda 5 álbumes de sellos discográficos independientes.|Save 5 albums from independent record labels.|Enregistrez 5 albums de labels indépendants.|Salva 5 album di etichette discografiche indipendenti.|收藏 5 张独立厂牌专辑。|インディーズレーベルのアルバムを5枚保存。
Constancia de Oro|Golden Consistency|Constance d'or|Costanza d'oro|黄金毅力|黄金の継続力
Mantén una racha de escucha activa durante 5 días seguidos.|Keep an active listening streak for 5 days in a row.|Maintenez une série d'écoute active pendant 5 jours d'affilée.|Mantieni una serie di ascolto attiva per 5 giorni consecutivi.|连续 5 天保持活跃聆听记录。|5日間連続でアクティブなリスニング記録を維持。
Misiones y Desafíos Audiófilos|Audiophile Missions and Challenges|Missions et défis audiophiles|Missioni e sfide audiofile|发烧友任务与挑战|オーディオファイルのミッションとチャレンジ
Completa objetivos de audición y análisis para sumar monedas rápidamente.|Complete listening and analysis goals to earn coins quickly.|Atteignez vos objectifs d'écoute et d'analyse pour gagner des pièces rapidement.|Completa obiettivi di ascolto e analisi per guadagnare monete rapidamente.|完成聆听和分析目标，快速获得金币。|リスニングと分析の目標を達成して素早くコインを獲得。
Tienda & Recompensas Audiófilas|Audiophile Store & Rewards|Boutique et récompenses audiophiles|Negozio e premi audiofili|发烧友商店与奖励|オーディオファイルのストアと報酬
Bóveda de Fidelidad Sonora|Sound Loyalty Vault|Coffre de fidélité sonore|Scrigno della fedeltà sonora|聆听忠诚宝库|サウンドロイヤルティ保管庫
Gana Sonar Coins escuchando vinilos, publicando reseñas Hi-Fi y manteniendo tu racha de audiófilo.|Earn Sonar Coins by listening to vinyl, publishing Hi-Fi reviews and keeping your streak.|Gagnez des Sonar Coins en écoutant des vinyles, publiant des critiques Hi-Fi et gardant votre série.|Guadagna Sonar Coins ascoltando vinili, pubblicando recensioni Hi-Fi e mantenendo la serie.|通过聆听黑胶、发布高保真乐评并保持连续记录来赚取 Sonar Coins。|レコードを聴き、Hi-Fiレビューを投稿して連続記録を維持することでSonar Coinsを獲得。
Recibo Retro|Retro Receipt|Reçu rétro|Scontrino rétro|复古收据|レトロレシート
Ver Recibo de Disquería Retro|View Retro Record Store Receipt|Voir le reçu de disquaire rétro|Vedi scontrino del negozio di dischi rétro|查看复古唱片店收据|レトロレコード店のレシートを見る
Silenciar efectos de sonido|Mute sound effects|Couper les effets sonores|Disattiva effetti sonori|静音音效|効果音をミュート
Activar efectos de sonido de UI|Enable UI sound effects|Activer les effets sonores de l'interface|Attiva effetti sonori UI|开启界面音效|UI効果音を有効化
Audiófilo|Audiophile|Audiophile|Audiofilo|发烧友|オーディオファイル
Días Consecutivos|Consecutive Days|Jours consécutifs|Giorni consecutivi|连续天数|連続日数
Multiplicador activo:|Active multiplier:|Multiplicateur actif :|Moltiplicatore attivo:|生效倍数：|適用倍率：
Racha Reclamada Hoy|Streak Claimed Today|Série récupérée aujourd'hui|Serie riscattata oggi|今日已领连续奖励|本日の連続ボーナス受取済み
Reclamar Bono Diario|Claim Daily Bonus|Récupérer le bonus quotidien|Riscatta bonus giornaliero|领取每日奖励|デイリーボーナスを受け取る
Vuelve mañana para abrir otra funda de vinilo|Come back tomorrow to open another vinyl sleeve|Revenez demain pour ouvrir une autre pochette vinyle|Torna domani per aprire un'altra copertina vinile|明天再来开启另一个黑胶封套|明日また新しいレコードスリーブを開封できます
Abre la funda sellada y gana recompensas aleatorias|Open the sealed sleeve and win random rewards|Ouvrez la pochette scellée pour gagner des récompenses|Apri la copertina sigillata e vinci premi casuali|开启密封封套赢取随机奖励|密封スリーブを開けてランダム特典を獲得
Meta Comunitaria Mes|Monthly Community Goal|Objectif communautaire mensuel|Obiettivo comunitario mensile|月度社区目标|月間コミュニティ目標
Reseñas Hi-Fi colectivas|Collective Hi-Fi Reviews|Avis Hi-Fi collectifs|Recensioni Hi-Fi collettive|社区 Hi-Fi 评论|コミュニティHi-Fiレビュー
Tornamesa Direct Drive|Direct Drive Turntable|Platine Direct Drive|Giradischi Direct Drive|直驱唱机|ダイレクトドライブターンテーブル
Catálogo de Recompensas|Rewards Catalog|Catalogue des récompenses|Catalogo premi|奖励目录|リワードカタログ
Personaliza tu avatar, reproductor, cadena DSP y temas visuales.|Customize your avatar, player, DSP chain and visual themes.|Personnalisez votre avatar, lecteur, chaîne DSP et thèmes visuels.|Personalizza avatar, lettore, catena DSP e temi visivi.|自定义头像、播放器、DSP 音链和视觉主题。|アバター、プレーヤー、DSPチェーン、ビジュアルテーマをカスタマイズ。
Títulos|Titles|Titres|Titoli|称号|称号
Probador en Vivo • Sandbox|Live Preview • Sandbox|Aperçu en direct • Bac à sable|Anteprima dal vivo • Sandbox|实时预览 • 沙盒|ライブプレビュー • サンドボックス
PROBANDO|PREVIEWING|APERÇU|ANTEPRIMA|预览中|プレビュー中
Reproductor Sonar Hi-Fi|Sonar Hi-Fi Player|Lecteur Sonar Hi-Fi|Lettore Sonar Hi-Fi|Sonar Hi-Fi 播放器|Sonar Hi-Fi プレーヤー
Diaria|Daily|Quotidienne|Giornaliera|每日|デイリー
Semanal|Weekly|Hebdomadaire|Settimanale|每周|ウィークリー
Exclusivo|Exclusive|Exclusif|Esclusivo|专属|限定
Popular|Popular|Populaire|Popolare|热门|人気
Hi-Fi Pro|Hi-Fi Pro|Hi-Fi Pro|Hi-Fi Pro|Hi-Fi 专业|Hi-Fi Pro
Vinilo|Vinyl|Vinyle|Vinile|黑胶|レコード
Calidez|Warmth|Chaleur|Calore|温暖|温かみ
DSP Hi-Fi|DSP Hi-Fi|DSP Hi-Fi|DSP Hi-Fi|DSP 高保真|DSP Hi-Fi
Estudio|Studio|Studio|Studio|录音室|スタジオ
Táctil|Tactile|Tactile|Tattile|触觉|触感
Premium|Premium|Premium|Premium|高级|プレミアム
Marco Vinilo de Oro 24K|24K Gold Vinyl Frame|Cadre vinyle en or 24 carats|Cornice vinile in oro 24K|24K黄金黑胶边框|24Kゴールドレコードフレーム
Marco Prisma Pink Floyd|Pink Floyd Prism Frame|Cadre prisme Pink Floyd|Cornice prisma Pink Floyd|平克·弗洛伊德三棱镜边框|ピンク・フロイド プリズムフレーム
Marco Caoba Analógica|Analog Mahogany Frame|Cadre acajou analogique|Cornice mogano analogica|模拟桃花心木边框|アナログマホガニーフレーム
Skin Cassette C-90 CrO2|C-90 CrO2 Cassette Skin|Skin cassette C-90 CrO2|Skin cassetta C-90 CrO2|C-90 CrO2 磁带皮肤|C-90 CrO2 カセットスキン
Skin VU Meter Aguja Analógica|Analog Needle VU Meter Skin|Skin VU-mètre à aiguille analogique|Skin VU Meter ad ago analogico|模拟指针 VU 表皮肤|アナログ針VUメータースキン
Skin Tornamesa Direct Drive 33/45|Direct Drive 33/45 Turntable Skin|Skin platine Direct Drive 33/45|Skin giradischi Direct Drive 33/45|直驱 33/45 唱机皮肤|ダイレクトドライブ 33/45 ターンテーブルスキン
Skin Bulbos Valvulares Hi-End|Hi-End Tube Valves Skin|Skin tubes à lampes Hi-End|Skin valvole termoioniche Hi-End|高端电子管皮肤|ハイエンド真空管スキン
Preset DSP: Calidez Valvular 1970|DSP Preset: 1970 Tube Warmth|Preset DSP : Chaleur à lampes 1970|Preset DSP: Calore valvolare 1970|DSP 预设：1970 电子管温润|DSPプリセット：1970 真空管の温もり
Preset DSP: Cinta Studer A800|DSP Preset: Studer A800 Tape|Preset DSP : Bande Studer A800|Preset DSP: Nastro Studer A800|DSP 预设：Studer A800 磁带模拟|DSPプリセット：Studer A800 テープ
Preset DSP: Acústica Club de Jazz|DSP Preset: Jazz Club Acoustics|Preset DSP : Acoustique club de jazz|Preset DSP: Acustica jazz club|DSP 预设：爵士俱乐部声场|DSPプリセット：ジャズクラブ音響
Pack Sonoro: Clics Analógicos Swiss|Sound Pack: Swiss Analog Clicks|Pack sonore : Clics analogiques suisses|Pacchetto suoni: Clic analogici svizzeri|音效包：瑞士机械旋钮点击音|サウンドパック：スイス製アナログクリック音
Pack Sonoro: Aguja de Diamante Ortofon|Sound Pack: Ortofon Diamond Stylus|Pack sonore : Diamant Ortofon|Pacchetto suoni: Puntina in diamante Ortofon|音效包：高度风钻石唱针落针音|サウンドパック：オルトフォン ダイヤモンド針音
Tema UI: Vintage McIntosh Blue|UI Theme: Vintage McIntosh Blue|Thème UI : Vintage McIntosh Blue|Tema UI: Vintage McIntosh Blue|界面主题：复古 McIntosh 经典蓝|UIテーマ：ビンテージ McIntosh ブルー
Tema UI: Gold Champagne Audiophile|UI Theme: Gold Champagne Audiophile|Thème UI : Gold Champagne Audiophile|Tema UI: Gold Champagne Audiophile|界面主题：香槟金发烧级典雅|UIテーマ：ゴールドシャンパン オーディオファイル
Título: Oído Absoluto|Title: Absolute Pitch|Titre : Oreille absolue|Titolo: Orecchio assoluto|称号：绝对音感|称号：絶対音感
Título: Maestro del Mastering|Title: Mastering Guru|Titre : Maître du mastering|Titolo: Maestro del mastering|称号：母带大师|称号：マスタリングの巨匠
Título: Arqueólogo del Vinilo|Title: Vinyl Archaeologist|Titre : Archéologue du vinyle|Titolo: Archeologo del vinile|称号：黑胶考古学家|称号：レコード考古学者
Título: Purista Hi-Res 192kHz|Title: Hi-Res 192kHz Purist|Titre : Puriste Hi-Res 192kHz|Titolo: Purista Hi-Res 192kHz|称号：Hi-Res 192kHz 原音纯粹者|称号：ハイレゾ 192kHz ピュアリスト
Pase VIP Salón de Debate Acústico|VIP Pass: Acoustic Discussion Lounge|Pass VIP Salon de débat acoustique|Pass VIP Salotto di dibattito acustico|VIP 通行证：声学品鉴沙龙|VIPパス：音響ディスカッションラウンジ
Pase Transmisión Directa DSD|VIP Pass: DSD Direct Stream|Pass Streaming direct DSD|Pass Streaming diretto DSD|DSD 源码直通串流权限|DSD ダイレクトストリームパス
Pase Asistente Crítico IA Ilimitado|VIP Pass: Unlimited AI Critic|Pass Assistant critique IA illimité|Pass Assistente critico IA illimitato|无限制 AI 乐评助手通行证|無制限 AI 批評アシスタントパス
Efecto tornasolado iridiscente que reacciona a los reflejos de luz.|Iridescent shimmer that reacts to lighting angles.|Effet irisé réagissant aux reflets de la lumière.|Effetto cangiante che reagisce ai riflessi di luce.|随光线角度变换的虹彩渐变光效。|光の反射に反応する玉虫色のイリデッセント効果。
Halo refractario de espectro visible con haz de luz continua.|Continuous visible-spectrum refracted light beam.|Halo réfracté à spectre visible avec faisceau continu.|Fascio refratto a spettro visibile con alone continuo.|具有连续可见光谱折射光晕的光束效果。|連続した光線を持つ可視光スペクトルの屈折ハロ。
Acabado en madera noble lacada de gabinete acústico artesanal.|Fine lacquered tonewood from artisan acoustic cabinets.|Finition en bois noble laqué d'ébénisterie acoustique.|Finitura in legno pregiato laccato da mobile acustico artigianale.|手工声学箱体同款名贵烤漆实木饰面。|職人仕立ての高級ラッカー仕上げ木製キャビネット。
Diseño retro con carretes giratorios analógicos para el reproductor global de Sonar.|Retro design with spinning analog reels for Sonar's global player.|Design rétro avec bobines tournantes pour le lecteur global Sonar.|Design rétro con bobine rotanti analogiche per il player Sonar.|带有旋转模拟磁带盘的复古播放器皮肤。|Sonarプレーヤー用の回転アナログリール付きレトロデザイン。
Vúmetro balístico retroiluminado en ámbar que mide la dinámica sonora.|Amber-backlit ballistic VU meter measuring acoustic dynamics.|VU-mètre balistique rétroéclairé ambre mesurant la dynamique.|VU meter balistico retroilluminato in ambra con misura dinamica.|琥珀色背光动圈式 VU 表，实时呈现音频动态。|音響のダイナミクスを測定する琥珀色バックライトのVUメーター。
Plato giratorio estroboscópico de cuarzo con brazo fonocaptor dinámico.|Quartz stroboscopic turntable platter with dynamic tonearm.|Plateau stroboscopique à quartz et bras de lecture dynamique.|Piatto stroboscopico al quarzo con braccio dinamico.|石英锁相频闪转盘配动态唱臂。|ダイナミックトーンアーム付きクォーツストロボターンテーブル。
Preamplificador con filamentos incandescentes y saturación armónica par.|Preamplifier with glowing filaments and even-harmonic warmth.|Préampli à filaments incandescents et saturation harmonique paire.|Preamplificatore a filamenti incandescenti e armoniche pari.|带有温暖发光灯丝和偶次谐波饱和的电子管前级。|白熱フィラメントと偶数次高調波サチュレーションを備えたプリアンプ。
Realce armónico de frecuencias medias y compresión sutil que emula etapas a tubos.|Mid-frequency harmonic boost and subtle tube stage compression.|Rehausse harmonique des médiums et compression subtile à lampes.|Rafforzamento armonico dei medi e sottile compressione valvolare.|增强中频泛音与微妙动态压缩，再现电子管经典暖色。|中域の高調波ブーストと真空管特有の心地よいコンプレッション。
Saturación analógica a 15 IPS con pegada redonda en graves y agudos aterciopelados.|15 IPS analog tape saturation with punchy lows and silky highs.|Saturation analogique 15 IPS aux basses rondes et aigus soyeux.|Saturazione analogica 15 IPS con bassi corposi e alti vellutati.|15 IPS 模拟开盘带饱和，低频饱满圆润、高频丝滑柔顺。|15 IPSアナログテープサチュレーションによる豊かな低音と滑らかな高音。
Reverberación espacial de sala íntima con absorción de madera natural.|Intimate room acoustic reverb with natural wood absorption.|Réverbération de salle intimiste avec absorption bois naturel.|Riverbero acustico da sala intima con assorbimento in legno naturale.|带有天然木质吸音质感的私密爵士俱乐部空间混响。|自然な木材の吸音特性を活かした親密なジャズクラブのリバーブ。
Sustituye las interacciones táctiles de la app por clics mecánicos de potenciómetro suizo.|Replaces app tactile taps with Swiss stepped mechanical clicks.|Remplace les clics de l'app par des clics de potentiomètre suisse.|Sostituisce i clic dell'app con scatti meccanici di potenziometri svizzeri.|将应用交互音效替换为瑞士精密步进电位器的机械清脆点击声。|アプリの操作音をスイス製精密ポテンショメーターの機械音に変更。
Efecto de caída de aguja en microsurco al reproducir discos o pulsar me gusta.|Vinyl needle drop in microgroove on track playback or like.|Effet de dépose d'aiguille sur microsillon à la lecture ou au like.|Effetto puntina nel microsolco all'avvio della traccia o ai mi piace.|黑胶唱针落入唱片微槽时的经典沙沙声与落针音。|再生時やいいね時にレコードの溝に針が落ちるリアルな効果音。
Elegante panel negro con retroiluminación azul turquesa icónica de alta gama.|Sleek black faceplate with iconic turquoise blue luxury backlight.|Élégant panneau noir avec rétroéclairage bleu turquoise iconique.|Elegante pannello nero con iconica retroilluminazione blu turchese.|典雅黑面板配以标志性湖水蓝指针背光。|高級感あふれるブラックパネルと象徴的なターコイズブルーのバックライト。
Acentos en oro cepillado y fondo carbón para máxima sofisticación visual.|Brushed gold accents and charcoal backdrop for maximum luxury.|Touches or brossé et fond charbon pour une sophistication suprême.|Accenti in oro spazzolato e sfondo carbone di massima raffinatezza.|拉丝香槟金点缀与炭黑底色，极致奢华质感。|ブラッシュドゴールドのアクセントとチャコール背景の洗練された佇まい。
Insignia exclusiva que se muestra en tu perfil público y comentarios de reseñas.|Exclusive badge displayed on public profile and review comments.|Badge exclusif affiché sur votre profil public et commentaires d'avis.|Distintivo esclusivo visibile su profilo pubblico e commenti recensioni.|在公开资料与乐评评论区展示的专属荣誉徽章。|公開プロフィールやレビューのコメント欄に表示される特別バッジ。
Reconocimiento de máxima autoridad acústica en la comunidad de Sonar.|Sonar's highest-authority acoustic recognition across the platform.|Reconnaissance d'autorité acoustique maximale sur Sonar.|Riconoscimento di massima autorevolezza acustica su Sonar.|Sonar 社区最高权威声学鉴赏家专属认可。|Sonarコミュニティにおける最高位の音響オーソリティ認定。
Distintivo de coleccionista experto en prensados originales y primeras ediciones.|Badge for collectors specialized in original pressings and 1st editions.|Insigne de collectionneur expert en pressages originaux et éditions rares.|Distintivo da collezionista esperto di prime stampe ed edizioni rare.|专注于原版压片与首版珍藏的资深藏家专属徽章。|オリジナル盤や初版レコードの目利きコレクター向けバッジ。
Para quienes no aceptan nada por debajo de la fidelidad Bit-Perfect de estudio.|For listeners who accept nothing less than studio Bit-Perfect purity.|Pour ceux qui n'acceptent rien de moins que le Bit-Perfect de studio.|Per chi non accetta niente di meno della fedeltà Bit-Perfect da studio.|献给只接受录音室级别源码位完美（Bit-Perfect）播放的发烧玩家。|スタジオ品質のビットパーフェクト再生にこだわる純粋主義者向け。
Acceso ilimitado a salas de escucha privadas con audiófilos y críticos certificados.|Unlimited access to private listening lounges with certified critics.|Accès illimité aux salons d'écoute privés avec critiques certifiés.|Accesso illimitato alle sale d'ascolto private con critici certificati.|无限制进入发烧友与认证乐评人的私密高保真听音室。|認定評論家やオーディオファイルが集う非公開リスニングラウンジへのアクセス。
Transmisión directa de audio sin compresión con rango dinámico expandido.|Direct uncompressed stream transmission with expanded dynamic range.|Flux audio non compressé direct avec plage dynamique étendue.|Streaming audio non compresso diretto con gamma dinamica estesa.|无损无压缩 DSD 直通串流传输，呈现极宽广的动态范围。|拡張されたダイナミックレンジで非圧縮ダイレクトストリームを再生。
Análisis ilimitados de poética de letras y correlaciones musicales por IA.|Unlimited AI lyric poetics analysis and harmonic correlations.|Analyses poétiques de paroles et corrélations musicales illimitées par IA.|Analisi poetiche dei testi e correlazioni armoniche illimitate con IA.|AI 歌词意境与声学和声关联的无限制深度解析。|歌詞の詩的分析と音楽の調和性をAIで無制限に詳細分析。
Al llegar a la meta: Toda la comunidad desbloquea la skin conmemorativa|When goal is met: The entire community unlocks the commemorative skin|À l'atteinte de l'objectif : Toute la communauté débloque le skin commémoratif|Al raggiungimento dell'obiettivo: Tutta la community sblocca la skin commemorativa|达成目标后：全体社区成员将解锁纪念皮肤|目標達成時：コミュニティ全員が記念スキンをアンロック
¡Faltan solo|Only|Plus que|Mancano solo|仅剩|あと
reseñas para el desbloqueo colectivo!|reviews left for community unlock!|avis pour le déblocage collectif !|recensioni per lo sblocco collettivo!|条评论即可全员解锁！|レビューで全体アンロック！
Buscar por nombre, preset, marca o descripción...|Search by name, preset, brand or description…|Rechercher par nom, preset, marque ou description…|Cerca per nome, preset, marca o descrizione…|按名称、预设、品牌或描述搜索…|名前、プリセット、ブランド、説明で検索…
Cargar más recompensas|Load more rewards|Charger plus de récompenses|Carica altri premi|加载更多奖励|さらにリワードを読み込む
recompensas|rewards|récompenses|premi|项奖励|件のリワード
artículos disponibles|items available|articles disponibles|articoli disponibili|个可用商品|件のアイテムが利用可能
No se encontraron recompensas|No rewards found|Aucune récompense trouvée|Nessun premio trovato|未找到匹配奖励|リワードが見つかりません
Prueba con otro término de búsqueda o selecciona otra categoría.|Try another search term or choose a different category.|Essayez un autre terme ou choisissez une autre catégorie.|Prova con un altro termine o seleziona un'altra categoria.|请尝试其他搜索词或选择其他分类。|別の検索語を入力するか、他のカテゴリを選択してください。
Ver todo el catálogo|View full catalog|Voir tout le catalogue|Vedi tutto il catalogo|查看完整目录|全カタログを見る
Legendario|Legendary|Légendaire|Leggendario|传奇|伝説
Hi-End|Hi-End|Hi-End|Hi-End|高端旗舰|ハイエンド
Vintage|Vintage|Vintage|Vintage|复古经典|ビンテージ
Icono|Iconic|Icône|Icona|标志性|象徴
Culto|Cult|Culte|Di culto|小众先锋|カルト
Inmersivo|Immersive|Immersif|Immersivo|沉浸式|没入型
Japón|Japan|Japon|Giappone|日本原产|日本
Bauhaus|Bauhaus|Bauhaus|Bauhaus|包豪斯|バウハウス
Física|Physics|Physique|Fisica|物理声学|物理音響
Escultura|Sculpture|Sculpture|Scultura|声学雕塑|彫刻造形
Ultra-Raro|Ultra-Rare|Ultra-rare|Ultra-raro|绝版罕见|ウルトラレア
Referencia|Reference|Référence|Riferimento|参考级|リファレンス
Lujo|Luxury|Luxe|Lusso|奢华级|ラグジュアリー
Elite|Elite|Élite|Élite|精英藏家|エリート
Gran Maestro|Grand Master|Grand Maître|Gran Maestro|声学宗师|グランドマスター
Vitalicio|Lifetime|À vie|A vita|终身会员|永久
Pro|Pro|Pro|Pro|专业级|Pro
Mastering|Mastering|Mastering|Mastering|母带级|マスタリング
Hi-Res|Hi-Res|Hi-Res|Hi-Res|高解析度|ハイレゾ
Carrusel Deslizante|Sliding Carousel|Carrousel coulissant|Carosello a scorrimento|滑动轮播|スライドカルーセル
Vista Cuadrícula|Grid View|Vue grille|Vista a griglia|网格视图|グリッド表示
Deslizar|Slide|Faire défiler|Scorri|滑动浏览|スライド
Ver categoría|View category|Voir la catégorie|Vedi categoria|查看分类|カテゴリを見る
Marcos de Avatar|Avatar Frames|Cadres d'avatar|Cornici avatar|头像边框|アバターフレーム
Skins de Reproductor|Player Skins|Skins de lecteur|Skin del lettore|播放器皮肤|プレーヤースキン
Presets DSP & Audio|DSP & Audio Presets|Préréglages DSP & Audio|Preset DSP e audio|DSP 与音频预设|DSP＆オーディオプリセット
Packs de Sonidos UI|UI Sound Packs|Packs de sons UI|Pacchetti suoni UI|界面音效包|UIサウンドパック
Temas Visuales UI|UI Visual Themes|Thèmes visuels UI|Temi visivi UI|界面视觉主题|UIビジュアルテーマ
Títulos de Prestigio|Prestige Titles|Titres de prestige|Titoli di prestigio|荣誉称号|プレステージ称号
Pases VIP & Beneficios|VIP Passes & Perks|Pass VIP et avantages|Pass VIP e vantaggi|VIP 通行证与特权|VIPパス＆特典
Deslizar a la izquierda|Slide left|Glisser à gauche|Scorri a sinistra|向左滑动|左へスライド
Deslizar a la derecha|Slide right|Glisser à droite|Scorri a destra|向右滑动|右へスライド
`.trim().split('\n').map(row => row.split('|'));
export const PROFILE_TRANSLATIONS = Object.fromEntries(
  ['es', 'en', 'fr', 'it', 'zh', 'ja'].map((language, index) => [language, Object.fromEntries(rows.map(values => [values[0], values[index]]))]),
);
