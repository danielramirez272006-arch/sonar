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
`.trim().split('\n').map(row => row.split('|'));
export const PROFILE_TRANSLATIONS = Object.fromEntries(
  ['es', 'en', 'fr', 'it', 'zh', 'ja'].map((language, index) => [language, Object.fromEntries(rows.map(values => [values[0], values[index]]))]),
);
