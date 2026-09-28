const rows = `
· ↑ ↓ y Enter|· ↑ ↓ and Enter|· ↑ ↓ et Entrée|· ↑ ↓ e Invio|· ↑ ↓ 和 Enter|· ↑ ↓ と Enter
o coloca en public/audio/|or place in public/audio/|ou placez dans public/audio/|oppure inserisci in public/audio/|或放入 public/audio/|または public/audio/ に配置
ej. Ep. 45: La historia no contada del sintetizador Minimoog|e.g. Ep. 45: The untold story of the Minimoog|ex. Ép. 45 : L’histoire méconnue du Minimoog|es. Ep. 45: La storia nascosta del Minimoog|例：第45集：Minimoog 不为人知的故事|例：第45回：Minimoogの知られざる歴史
ej. Crónicas del Vinilo|e.g. Vinyl chronicles|ex. Chroniques du vinyle|es. Cronache del vinile|例：黑胶纪事|例：レコード年代記
ej. Marcos Vinyl & Elena Analog|e.g. Marcos Vinyl & Elena Analog|ex. Marcos Vinyl & Elena Analog|es. Marcos Vinyl & Elena Analog|例：Marcos Vinyl & Elena Analog|例：Marcos Vinyl & Elena Analog
SISTEMA AUDIÓFILO DE ALTA PRECISIÓN · SERIE SL-2026 HI-FI|PRECISION AUDIOPHILE SYSTEM · SL-2026 HI-FI SERIES|SYSTÈME AUDIOPHILE DE PRÉCISION · SÉRIE SL-2026 HI-FI|SISTEMA AUDIOFILO DI PRECISIONE · SERIE SL-2026 HI-FI|高精度发烧友系统 · SL-2026 HI-FI 系列|高精度オーディオシステム・SL-2026 HI-FIシリーズ
Brazo en S balanceado, aguja fonocaptora interactiva con desplazamiento en tiempo real, vúmetros balísticos y buscador de vinilos.|Balanced S-arm, interactive real-time stylus, ballistic meters and vinyl search.|Bras en S équilibré, diamant interactif en temps réel, vumètres et recherche de vinyles.|Braccio a S bilanciato, puntina interattiva in tempo reale, vumetri e ricerca vinili.|平衡 S 形唱臂、实时互动唱针、电平表与黑胶搜索。|バランス型S字アーム、リアルタイムの針操作、VUメーター、レコード検索。
Haz clic en cualquier surco del disco para soltar la aguja en ese punto|Click any groove to drop the needle there|Cliquez sur un sillon pour y poser le diamant|Fai clic su un solco per posarvi la puntina|点击任意音槽将唱针放在该位置|溝をクリックしてその位置に針を下ろします
Arrastra para mover la aguja a otro minuto|Drag to move the needle to another time|Glissez pour déplacer le diamant|Trascina per spostare la puntina|拖动唱针以跳转时间|ドラッグして針の位置を変更
VÚMETRO ESTÉREO dB|STEREO VU METER dB|VUMÈTRE STÉRÉO dB|VUMETRO STEREO dB|立体声电平表 dB|ステレオVUメーター dB
CANAL L|CHANNEL L|CANAL G|CANALE S|左声道|左チャンネル
CANAL R|CHANNEL R|CANAL D|CANALE D|右声道|右チャンネル
Buscar artista o álbum (ej. Radiohead, Daft Punk, Tame Impala, Rosalía)...|Search artist or album (e.g. Radiohead, Daft Punk, Tame Impala, Rosalía)…|Chercher artiste ou album (ex. Radiohead, Daft Punk, Tame Impala, Rosalía)…|Cerca artista o album (es. Radiohead, Daft Punk, Tame Impala, Rosalía)…|搜索艺人或专辑（如 Radiohead、Daft Punk、Tame Impala、Rosalía）…|アーティストやアルバムを検索（例：Radiohead、Daft Punk、Tame Impala、Rosalía）…
Ajusta tu biografía, avatar y géneros preferidos para calibrar tus recomendaciones acústicas en Sonar.|Edit your bio, avatar and favorite genres to tune Sonar recommendations.|Modifiez biographie, avatar et genres favoris pour ajuster vos recommandations Sonar.|Modifica biografia, avatar e generi preferiti per affinare i consigli Sonar.|调整简介、头像与喜爱流派以优化 Sonar 推荐。|自己紹介、アバター、好きなジャンルでSonarのおすすめを調整。
Restaurar tus colecciones, reseñas y preferencias desde un archivo JSON|Restore collections, reviews and preferences from JSON|Restaurer collections, avis et préférences depuis un fichier JSON|Ripristina collezioni, recensioni e preferenze da JSON|从 JSON 恢复收藏、评论与偏好|JSONからコレクション、レビュー、好みを復元
Descargar respaldo JSON de tus álbumes, reseñas y configuración|Download a JSON backup of albums, reviews and settings|Télécharger une sauvegarde JSON des albums, avis et réglages|Scarica backup JSON di album, recensioni e impostazioni|下载专辑、评论与设置的 JSON 备份|アルバム、レビュー、設定のJSONバックアップを取得
Explora el catálogo o las recomendaciones para iniciar una sesión sonora en alta fidelidad.|Explore the catalog or recommendations to start a hi-fi session.|Explorez le catalogue ou les recommandations pour une session hi-fi.|Esplora il catalogo o i consigli per iniziare una sessione hi-fi.|探索目录或推荐，开启高保真聆听。|カタログやおすすめからHi-Fiリスニングを始めましょう。
Explora la comunidad o las reseñas para seguir a tus creadores y productores favoritos.|Explore the community or reviews to follow your favorite creators.|Explorez la communauté ou les avis pour suivre vos créateurs favoris.|Esplora community o recensioni per seguire i tuoi autori preferiti.|探索社区或评论以关注喜爱的创作者与制作人。|コミュニティやレビューから好きなクリエイターをフォロー。
Conecta con críticos y audiófilos destacados en la sección de Comunidad.|Connect with critics and audiophiles in Community.|Retrouvez critiques et audiophiles dans la communauté.|Incontra critici e audiofili nella community.|在社区中与知名评论家和发烧友交流。|コミュニティで評論家や音楽愛好家とつながりましょう。
Porcentaje de afinidad y compatibilidad en géneros musicales|Music genre affinity percentage|Pourcentage d’affinité musicale|Percentuale di affinità musicale|音乐流派匹配度百分比|音楽ジャンルの相性の割合
Registra tus tornamesas, DACs y audífonos para exhibirlos en tu perfil y personalizar la respuesta acústica.|Add turntables, DACs and headphones to your profile and tune your sound.|Ajoutez platines, DAC et casques à votre profil pour personnaliser le son.|Aggiungi giradischi, DAC e cuffie al profilo per personalizzare il suono.|登记唱机、DAC 与耳机以展示在资料中并自定义音效。|ターンテーブル、DAC、ヘッドホンを登録してプロフィールに表示し、音を調整。
Análisis Contextual & Lírico (IA)|Context & lyric analysis (AI)|Analyse du contexte et des paroles (IA)|Analisi del contesto e dei testi (IA)|背景与歌词分析（AI）|背景と歌詞の分析（AI）
Comentarios destacados de la comunidad|Featured community comments|Commentaires de la communauté à la une|Commenti della community in evidenza|精选社区评论|注目のコミュニティコメント
VITRINA EDITORIAL AUDIÓFILA|AUDIOPHILE EDITORIAL SHOWCASE|VITRINE ÉDITORIALE AUDIOPHILE|VETRINA EDITORIALE AUDIOFILA|发烧友编辑展示|音楽編集ショーケース
Reproducir una joya musical aleatoria|Play a random musical gem|Écouter une pépite au hasard|Riproduci una gemma musicale casuale|随机播放音乐佳作|ランダムに名曲を再生
Sorpréndeme (Ruleta)|Surprise me (roulette)|Surprenez-moi (roulette)|Sorprendimi (roulette)|给我惊喜（轮盘）|おまかせ（ルーレット）
Haz clic para escuchar la muestra de 30s|Click to hear a 30s preview|Cliquez pour écouter un extrait de 30 s|Fai clic per un’anteprima di 30 s|点击收听30秒试听|クリックして30秒試聴
— Consejo Editorial Sonar|— Sonar editorial board|— Comité éditorial Sonar|— Comitato editoriale Sonar|— Sonar 编辑委员会|— Sonar編集委員会
DISCURSO & ANÁLISIS|DISCUSSION & ANALYSIS|DISCUSSION ET ANALYSE|DISCUSSIONE E ANALISI|讨论与分析|議論と分析
Voces críticas y oyentes apasionados compartiendo su perspectiva musical en alta resolución.|Critics and passionate listeners sharing their musical perspectives.|Critiques et auditeurs passionnés partagent leur vision musicale.|Critici e ascoltatori appassionati condividono la loro prospettiva musicale.|评论家与热情听众分享音乐见解。|評論家と熱心なリスナーが音楽の視点を共有。
O prueba con:|Or try:|Ou essayez :|Oppure prova:|或尝试：|または：
🛡️ Seguro|🛡️ Safe|🛡️ Sûr|🛡️ Sicuro|🛡️ 安全|🛡️ 安全
RESULTADOS (Usa ↑ ↓ Enter Espacio)|RESULTS (Use ↑ ↓ Enter Space)|RÉSULTATS (↑ ↓ Entrée Espace)|RISULTATI (↑ ↓ Invio Spazio)|结果（使用 ↑ ↓ Enter 空格）|検索結果（↑ ↓ Enter スペース）
Enter para ver todo|Enter to view all|Entrée pour tout voir|Invio per vedere tutto|按 Enter 查看全部|Enterで全件表示
PISTAS DESTACADAS EN DEEZER:|FEATURED DEEZER TRACKS:|TITRES DEEZER À LA UNE :|TRACCE DEEZER IN EVIDENZA:|DEEZER 精选曲目：|DEEZERの注目曲：
🧘 Calmo / Ambient|🧘 Calm / ambient|🧘 Calme / ambient|🧘 Calmo / ambient|🧘 平静 / 氛围|🧘 穏やか／アンビエント
🔥 Fiesta / Rave|🔥 Party / rave|🔥 Fête / rave|🔥 Festa / rave|🔥 派对 / 狂欢|🔥 パーティー／レイヴ
¡Resumen y credencial listos para compartir!|Summary and card ready to share!|Résumé et carte prêts à partager !|Riepilogo e tessera pronti da condividere!|总结与凭证已可分享！|サマリーとカードを共有できます！
SONAR WRAPPED • REPORTE ACÚSTICO|SONAR WRAPPED • LISTENING REPORT|SONAR WRAPPED • RAPPORT D’ÉCOUTE|SONAR WRAPPED • RAPPORTO DI ASCOLTO|SONAR WRAPPED • 聆听报告|SONAR WRAPPED・リスニングレポート
Tu Espectro Musical y Hábitos de Escucha|Your music spectrum and listening habits|Votre spectre musical et vos habitudes d’écoute|Il tuo spettro musicale e abitudini di ascolto|你的音乐光谱与聆听习惯|音楽の傾向とリスニング習慣
Métricas calculadas a partir de tus sesiones Lossless, álbumes coleccionados y valoraciones críticas.|Metrics based on lossless sessions, collected albums and reviews.|Mesures basées sur vos sessions sans perte, albums et avis.|Metriche basate su sessioni lossless, album e recensioni.|指标根据无损聆听、收藏专辑与评论评分计算。|ロスレスセッション、アルバム、レビューに基づく指標。
Descargar imagen HD de tu credencial oficial de melómano|Download HD music lover card|Télécharger la carte de mélomane en HD|Scarica tessera di appassionato in HD|下载高清音乐爱好者凭证|音楽愛好家カードをHDでダウンロード
Tiempo Hi-Fi Acumulado|Total hi-fi time|Temps hi-fi cumulé|Tempo hi-fi accumulato|累计高保真时长|累計Hi-Fi時間
Álbumes Archivados|Archived albums|Albums archivés|Album archiviati|已归档专辑|保存したアルバム
Vinilteca de 180g|180g vinyl library|Vinylothèque 180 g|Viniloteca 180g|180克黑胶库|180gレコードライブラリ
Reseñas de Autor|Authored reviews|Avis d’auteur|Recensioni d’autore|原创评论|執筆レビュー
Críticas comunitarias|Community reviews|Avis communautaires|Recensioni della community|社区评论|コミュニティレビュー
Hora Pico de Audición|Peak listening hour|Heure d’écoute de pointe|Ora di punta d’ascolto|聆听高峰时段|最も聴く時間帯
Sesión Nocturna en Tubos|Late-night tube session|Session nocturne à lampes|Sessione notturna a valvole|深夜电子管聆听|深夜の真空管セッション
Distribución Semanal de Minutos de Escucha|Weekly listening minutes|Minutes d’écoute hebdomadaires|Minuti di ascolto settimanali|每周聆听分钟分布|週間リスニング時間
Promedio: 40 min/día|Average: 40 min/day|Moyenne : 40 min/jour|Media: 40 min/giorno|平均：40分钟/天|平均：40分／日
Afinidad por Formato de Audio|Audio format affinity|Affinité par format audio|Affinità per formato audio|音频格式偏好|音声形式の好み
* Basado en la respuesta armónica de tu ecualización y catálogo guardado.|* Based on equalization harmonics and saved catalog.|* Selon votre égalisation et votre catalogue enregistré.|* Basato su equalizzazione e catalogo salvato.|* 根据均衡器谐波响应与已保存目录。|* イコライザーの特性と保存カタログに基づきます。
Credencial Oficial de Melómano|Official music lover card|Carte officielle de mélomane|Tessera ufficiale di appassionato|官方音乐爱好者凭证|公式音楽愛好家カード
Pasaporte & Identidad de Audio Hi-Fi|Hi-fi passport & identity|Passeport et identité hi-fi|Passaporto e identità hi-fi|高保真护照与身份|Hi-Fiパスポートとアイデンティティ
Exportar Tarjeta PNG|Export PNG card|Exporter la carte PNG|Esporta tessera PNG|导出 PNG 卡片|PNGカードを出力
Pasaporte ID|Passport ID|ID du passeport|ID passaporto|护照 ID|パスポートID
Cadena Acústica Certificada|Certified audio chain|Chaîne audio certifiée|Catena audio certificata|认证音频链|認定オーディオチェーン
Setup Principal|Main setup|Installation principale|Configurazione principale|主要设备配置|メイン構成
• Rango:|• Rank:|• Rang :|• Rango:|• 等级：|• ランク：
Descargar Respaldo JSON|Download JSON backup|Télécharger la sauvegarde JSON|Scarica backup JSON|下载 JSON 备份|JSONバックアップを取得
ARQUITECTURA DE AUDIO ANALÓGICO & DIGITAL|ANALOG & DIGITAL AUDIO ARCHITECTURE|ARCHITECTURE AUDIO ANALOGIQUE ET NUMÉRIQUE|ARCHITETTURA AUDIO ANALOGICA E DIGITALE|模拟与数字音频架构|アナログとデジタル音声の構成
Cadena de Señal Audiófila Visual|Visual audiophile signal chain|Chaîne de signal audiophile visuelle|Catena del segnale audiofila visiva|可视化发烧友信号链|オーディオ信号チェーンの表示
Configura el flujo de audio desde la aguja del vinilo hasta tus audífonos.|Configure audio from the stylus to your headphones.|Configurez le flux audio du diamant au casque.|Configura l’audio dalla puntina alle cuffie.|配置从唱针到耳机的音频流程。|レコードの針からヘッドホンまでの音声経路を設定。
Pureza Acústica Total|Total audio purity|Pureté audio totale|Purezza audio totale|整体音质纯净度|総合音質純度
Paso|Step|Étape|Passaggio|步骤|ステップ
Personaliza la imagen o degradado de cabecera de tu perfil público.|Customize your public profile header image or gradient.|Personnalisez l’image ou le dégradé d’en-tête de votre profil.|Personalizza immagine o sfumatura dell’intestazione del profilo.|自定义公开资料的封面图片或渐变。|公開プロフィールのヘッダー画像やグラデーションを設定。
Comparte tus dispositivos de alta fidelidad con la comunidad Sonar.|Share your hi-fi equipment with Sonar.|Partagez votre matériel hi-fi avec Sonar.|Condividi la tua attrezzatura hi-fi con Sonar.|与 Sonar 社区分享高保真设备。|SonarコミュニティにHi-Fi機器を紹介。
Auriculares / Monitores Principales|Main headphones / monitors|Casque / enceintes principaux|Cuffie / monitor principali|主要耳机 / 监听音箱|主なヘッドホン／モニター
Tocadiscos / Tornamesa o DAC Principal|Main turntable or DAC|Platine ou DAC principal|Giradischi o DAC principale|主要唱机或 DAC|主なターンテーブルまたはDAC
Amplificador / DAC / Previo de Fono|Amplifier / DAC / phono preamp|Amplificateur / DAC / préampli phono|Amplificatore / DAC / preamplificatore phono|放大器 / DAC / 唱放|アンプ／DAC／フォノプリアンプ
Formato de Escucha Predilecto|Favorite listening format|Format d’écoute favori|Formato di ascolto preferito|首选聆听格式|お気に入りのリスニング形式
Vinilo 33⅓ RPM (Prensaje Analógico)|33⅓ RPM vinyl (analog pressing)|Vinyle 33⅓ tours (pressage analogique)|Vinile 33⅓ RPM (stampa analogica)|33⅓转黑胶（模拟压制）|33⅓RPMレコード（アナログプレス）
Cassette / Cinta Magnética Vintage|Cassette / vintage magnetic tape|Cassette / bande magnétique vintage|Cassetta / nastro magnetico vintage|卡带 / 复古磁带|カセット／ヴィンテージ磁気テープ
Tu contraseña se procesa mediante algoritmo criptográfico|Your password is processed using a cryptographic algorithm|Votre mot de passe utilise un algorithme cryptographique|La password viene elaborata con un algoritmo crittografico|密码使用加密算法处理|パスワードは暗号アルゴリズムで処理されます
SHA-256 con Salt único|SHA-256 with unique salt|SHA-256 avec sel unique|SHA-256 con salt unico|SHA-256 与独立盐值|一意のソルト付きSHA-256
Descarga una copia completa de tu perfil, críticas publicadas, colecciones guardadas y preferencias.|Download your full profile, published reviews, collections and preferences.|Téléchargez votre profil, avis, collections et préférences.|Scarica profilo, recensioni, collezioni e preferenze.|下载资料、已发布评论、收藏与偏好的完整副本。|プロフィール、公開レビュー、コレクション、好みの完全なコピーを取得。
Esta acción es irreversible. Se eliminará tu perfil, configuración, preferencias y registros de sesión en Sonar.|This cannot be undone. Your Sonar profile, settings, preferences and session records will be deleted.|Cette action est irréversible. Votre profil Sonar, réglages, préférences et sessions seront supprimés.|L’azione è irreversibile. Profilo, impostazioni, preferenze e sessioni Sonar saranno eliminati.|此操作不可撤销。Sonar 资料、设置、偏好与会话记录将被删除。|この操作は取り消せません。Sonarのプロフィール、設定、好み、セッション記録が削除されます。
Acumula monedas escuchando pistas en alta resolución, redactando reseñas y manteniendo tu racha de escucha.|Earn coins by listening, writing reviews and keeping your streak.|Gagnez des pièces en écoutant, en écrivant des avis et en maintenant votre série.|Guadagna monete ascoltando, scrivendo recensioni e mantenendo la serie.|通过高解析聆听、撰写评论与持续聆听赚取金币。|高音質の曲を聴き、レビューを書き、連続記録を維持してコインを獲得。
Personaliza tu avatar, desbloquea skins visuales para el reproductor y luce títulos de prestigio.|Customize your avatar, unlock player skins and display prestigious titles.|Personnalisez votre avatar, débloquez des thèmes et affichez des titres prestigieux.|Personalizza l’avatar, sblocca temi del lettore e mostra titoli prestigiosi.|自定义头像、解锁播放器皮肤并展示荣誉称号。|アバターやプレーヤーをカスタマイズし、称号を表示。
Completa cada objetivo para reclamar monedas y sumar puntos de experiencia inmediatamente.|Complete goals to claim coins and experience immediately.|Atteignez les objectifs pour gagner immédiatement pièces et expérience.|Completa obiettivi per ottenere subito monete ed esperienza.|完成目标立即领取金币与经验值。|目標を達成してコインと経験値をすぐに獲得。
Personaliza cómo responde la curva acústica de la plataforma a tu equipamiento y oídos.|Tune the platform’s sound curve to your equipment and hearing.|Adaptez la courbe sonore à votre équipement et votre écoute.|Adatta la curva sonora all’attrezzatura e al tuo ascolto.|根据设备与听感自定义平台声学曲线。|機器と聴こえ方に合わせて音響カーブを調整。
Mint (M) - Impecable|Mint (M) - pristine|Mint (M) - impeccable|Mint (M) - perfetto|Mint (M) - 全新|Mint (M) - 完全美品
Near Mint (NM) - Casi Nuevo|Near Mint (NM) - almost new|Near Mint (NM) - presque neuf|Near Mint (NM) - quasi nuovo|Near Mint (NM) - 近全新|Near Mint (NM) - 新品同様
Very Good (VG) - Buen Estado|Very Good (VG) - good condition|Very Good (VG) - bon état|Very Good (VG) - buono stato|Very Good (VG) - 状态良好|Very Good (VG) - 良好
Good (G) - Con Desgaste|Good (G) - worn|Good (G) - usé|Good (G) - usurato|Good (G) - 有磨损|Good (G) - 使用感あり
Tornamesa Direct Drive|Direct-drive turntable|Platine à entraînement direct|Giradischi a trazione diretta|直驱唱机|ダイレクトドライブターンテーブル
Termoiónico 12AX7 · Saturación Clase A|12AX7 tube · Class A saturation|Tube 12AX7 · Saturation classe A|Valvola 12AX7 · Saturazione classe A|12AX7 电子管 · A类饱和|12AX7真空管・クラスAサチュレーション
Bulbos Valvulares|Vacuum tubes|Tubes à vide|Valvole|真空电子管|真空管
No encontramos canciones, noticias, sellos ni vinilos con ese término. Prueba con “Radiohead”, “vinilo” o “festivales”.|No tracks, news, labels or vinyl match. Try “Radiohead”, “vinyl” or “festivals”.|Aucun titre, actualité, label ou vinyle. Essayez « Radiohead », « vinyle » ou « festivals ».|Nessuna traccia, notizia, etichetta o vinile. Prova “Radiohead”, “vinile” o “festival”.|未找到歌曲、新闻、厂牌或黑胶。尝试“Radiohead”、“黑胶”或“音乐节”。|曲、ニュース、レーベル、レコードが見つかりません。「Radiohead」「レコード」「フェス」などをお試しください。
Modo Kids y Control Parental activo. Clic para administrar.|Kids mode and parental controls active. Click to manage.|Mode enfant et contrôle parental actifs. Cliquez pour gérer.|Modalità bambini e controllo genitori attivi. Fai clic per gestire.|儿童模式与家长控制已启用，点击管理。|キッズモードと保護者設定が有効です。クリックして管理。
Tus Sonar Coins acumuladas. Clic para canjear en la Boutique.|Your Sonar Coins. Click to redeem in the store.|Vos Sonar Coins. Cliquez pour les échanger en boutique.|Le tue Sonar Coins. Fai clic per riscattarle nella boutique.|你的 Sonar Coins，点击在商店兑换。|貯まったSonar Coins。クリックしてストアで交換。
TELEMETRÍA EN VIVO · SISTEMA OPERATIVO|LIVE TELEMETRY · OPERATING SYSTEM|TÉLÉMÉTRIE EN DIRECT · SYSTÈME|TELEMETRIA LIVE · SISTEMA OPERATIVO|实时遥测 · 操作系统|ライブテレメトリー・システム
Motor de Audio:|Audio engine:|Moteur audio :|Motore audio:|音频引擎：|音声エンジン：
Hi-Res 24-bit / 96kHz (Simulado)|Hi-Res 24-bit / 96kHz (simulated)|Hi-Res 24 bits / 96 kHz (simulé)|Hi-Res 24-bit / 96kHz (simulato)|高解析24位 / 96kHz（模拟）|Hi-Res 24-bit／96kHz（シミュレーション）
Latencia de Red Deezer API:|Deezer API network latency:|Latence réseau API Deezer :|Latenza rete API Deezer:|Deezer API 网络延迟：|Deezer APIネットワーク遅延：
18 ms (Óptima)|18 ms (optimal)|18 ms (optimale)|18 ms (ottimale)|18毫秒（最佳）|18ミリ秒（最適）
Caché Local de Vinilos:|Local vinyl cache:|Cache local de vinyles :|Cache locale vinili:|本地黑胶缓存：|ローカルレコードキャッシュ：
Activo (IndexedDB / LocalStorage)|Active (IndexedDB / LocalStorage)|Actif (IndexedDB / LocalStorage)|Attivo (IndexedDB / LocalStorage)|已启用（IndexedDB / LocalStorage）|有効（IndexedDB／LocalStorage）
Filtro de Ruido Analógico:|Analog noise filter:|Filtre de bruit analogique :|Filtro rumore analogico:|模拟噪声滤波器：|アナログノイズフィルター：
Calibración RIAA + 33⅓ RPM|RIAA calibration + 33⅓ RPM|Calibration RIAA + 33⅓ tr/min|Calibrazione RIAA + 33⅓ RPM|RIAA 校准 + 33⅓转|RIAA調整 + 33⅓RPM
Moderación de IA:|AI moderation:|Modération IA :|Moderazione IA:|AI 审核：|AIモデレーション：
El motor de Sonar procesa las transiciones de audio con amortiguación suave, consulta en tiempo real los catálogos de metadatos y mantiene el estado analógico del usuario.|Sonar smoothly transitions audio, queries metadata catalogs in real time and preserves user analog state.|Sonar assure des transitions audio douces, consulte les métadonnées en direct et conserve l’état analogique.|Sonar gestisce transizioni fluide, consulta metadati in tempo reale e conserva lo stato analogico.|Sonar 平滑处理音频切换、实时查询元数据并保留用户的模拟状态。|Sonarは音声を滑らかに切り替え、メタデータをリアルタイムで参照し、アナログ状態を保持します。
Interferencia acústica momentánea|Temporary sound interference|Interférence sonore temporaire|Interferenza sonora momentanea|暂时的声音干扰|一時的な音声の不具合
Esta sección experimentó una anomalía imprevista. La señal se ha aislado para proteger tu experiencia de escucha.|This section encountered an unexpected error and was isolated to protect your listening experience.|Cette section a rencontré une erreur et a été isolée pour préserver votre écoute.|Questa sezione ha riscontrato un errore ed è stata isolata per proteggere l’ascolto.|此部分出现意外错误，已隔离以保护聆听体验。|このセクションで予期しないエラーが発生したため、リスニングを保護するために分離しました。
Reconectar señal|Reconnect signal|Reconnecter le signal|Riconnetti segnale|重新连接信号|信号を再接続
Ir al Inicio|Go home|Aller à l’accueil|Vai alla home|前往首页|ホームへ
Detalles técnicos para desarrolladores|Technical details for developers|Détails techniques pour développeurs|Dettagli tecnici per sviluppatori|开发者技术详情|開発者向けの技術情報
Gracias por tu colaboración. Nuestro equipo de moderación evaluará este contenido para garantizar una comunidad segura y respetuosa en Sonar.|Thank you. Our moderators will review this content to keep Sonar safe and respectful.|Merci. Notre équipe examinera ce contenu pour préserver une communauté sûre et respectueuse.|Grazie. I moderatori esamineranno il contenuto per mantenere Sonar sicuro e rispettoso.|感谢协助。审核团队将评估内容以维护安全、友善的社区。|ご協力ありがとうございます。安全で互いを尊重するコミュニティのため、内容を審査します。
. Sonar sanciona el contenido que incite al odio, violencia o infracción a las guías editoriales.|. Sonar acts against hate, violence and editorial guideline violations.|. Sonar sanctionne la haine, la violence et les infractions aux règles éditoriales.|. Sonar sanziona odio, violenza e violazioni delle linee guida editoriali.|。Sonar 会处罚煽动仇恨、暴力或违反编辑准则的内容。|。Sonarは憎悪や暴力の扇動、編集ガイドライン違反に対処します。
EL CRITERIO ES HUMANO|JUDGMENT IS HUMAN|LE JUGEMENT EST HUMAIN|IL GIUDIZIO È UMANO|判断来自人|判断するのは人
Escuchar.|Listen.|Écouter.|Ascoltare.|聆听。|聴く。
Comprender.|Understand.|Comprendre.|Comprendere.|理解。|理解する。
Después, decidir.|Then decide.|Puis décider.|Poi decidere.|然后决定。|そして判断する。
Cuidamos un espacio donde las opiniones distintas puedan sonar juntas.|We nurture a space where different opinions can coexist.|Nous préservons un espace où les opinions différentes coexistent.|Proteggiamo uno spazio in cui opinioni diverse convivono.|维护一个让不同观点共存的空间。|異なる意見が共存できる場を守ります。
Criterios editoriales|Editorial criteria|Critères éditoriaux|Criteri editoriali|编辑标准|編集基準
Escucha atenta.|Listen carefully.|Écoute attentive.|Ascolto attento.|用心聆听。|注意深く聴く。
Valora los argumentos sobre la música.|Value arguments about music.|Valorisez les arguments sur la musique.|Valorizza le argomentazioni sulla musica.|重视对音乐的论述。|音楽についての論点を大切に。
Autoría original.|Original authorship.|Création originale.|Autorialità originale.|原创内容。|独自の著作。
Favorece experiencias y opiniones propias.|Favor personal experiences and opinions.|Privilégiez les expériences et opinions personnelles.|Privilegia esperienze e opinioni proprie.|鼓励个人经历与观点。|自身の経験や意見を重視。
Pasión y respeto.|Passion and respect.|Passion et respect.|Passione e rispetto.|热情与尊重。|情熱と尊重。
La crítica es bienvenida; los ataques personales no.|Criticism is welcome; personal attacks are not.|La critique est bienvenue, pas les attaques personnelles.|Le critiche sono benvenute, gli attacchi personali no.|欢迎批评，不接受人身攻击。|批評は歓迎しますが、個人攻撃は認めません。
Resumen operativo|Operational overview|Résumé opérationnel|Riepilogo operativo|运营概览|運用概要
Métricas secundarias|Secondary metrics|Indicateurs secondaires|Metriche secondarie|次要指标|補助指標
nuevos usuarios / 7 días|new users / 7 days|nouveaux utilisateurs / 7 jours|nuovi utenti / 7 giorni|新用户 / 7天|新規ユーザー／7日
reportes pendientes|pending reports|signalements en attente|segnalazioni in attesa|待处理举报|未対応の報告
usuarios sancionados|sanctioned users|utilisateurs sanctionnés|utenti sanzionati|受处罚用户|制裁対象ユーザー
Últimos eventos registrados|Latest recorded events|Derniers événements enregistrés|Ultimi eventi registrati|最近记录的事件|最新の記録イベント
No hay actividad con fecha registrada.|No dated activity recorded.|Aucune activité datée enregistrée.|Nessuna attività con data registrata.|没有带日期的活动记录。|日付付きの活動記録はありません。
✓ Aprobar|✓ Approve|✓ Approuver|✓ Approva|✓ 批准|✓ 承認
LO QUE DICE LA COMUNIDAD|WHAT THE COMMUNITY SAYS|CE QUE DIT LA COMMUNAUTÉ|COSA DICE LA COMMUNITY|社区声音|コミュニティの声
Opiniones generales|General opinions|Avis généraux|Opinioni generali|总体观点|全体的な意見
coincidencias|matches|correspondances|corrispondenze|匹配项|一致
Comentarios con texto similar sobre un mismo álbum, compartidos por al menos dos usuarios. Incluye reseñas aprobadas y pendientes; no representa necesariamente la opinión de toda la comunidad.|Similar comments on an album from at least two users. Includes approved and pending reviews; may not represent the whole community.|Commentaires similaires sur un album par au moins deux utilisateurs. Inclut les avis approuvés et en attente, sans représenter toute la communauté.|Commenti simili su un album da almeno due utenti. Include recensioni approvate e in attesa, non necessariamente l’intera community.|至少两名用户对同一专辑发表的相似评论，包括已批准与待审评论，不一定代表整个社区。|同じアルバムへの2人以上の類似コメント。承認済みと保留中を含み、コミュニティ全体の意見とは限りません。
No se pudo actualizar el resumen. Actualiza la cola para volver a intentarlo.|Could not update summary. Refresh the queue to retry.|Impossible de mettre à jour le résumé. Actualisez la file.|Impossibile aggiornare il riepilogo. Aggiorna la coda.|无法更新概要，请刷新队列重试。|概要を更新できませんでした。キューを更新して再試行。
Reuniendo las opiniones…|Gathering opinions…|Collecte des avis…|Raccolta delle opinioni…|正在汇总观点…|意見を収集中…
usuarios coinciden|users agree|utilisateurs d’accord|utenti concordano|位用户观点一致|人の意見が一致
Opinión representativa ·|Representative opinion ·|Avis représentatif ·|Opinione rappresentativa ·|代表性观点 ·|代表的な意見・
reseñas relacionadas|related reviews|avis associés|recensioni correlate|相关评论|関連レビュー
Leer comentarios relacionados|Read related comments|Lire les commentaires associés|Leggi commenti correlati|阅读相关评论|関連コメントを読む
Revisar reseña →|Review this post →|Examiner cet avis →|Esamina recensione →|审核评论 →|レビューを確認 →
Todavía no hay opiniones coincidentes|No matching opinions yet|Pas encore d’avis similaires|Nessuna opinione simile|暂无相似观点|一致する意見はまだありません
Cuando dos usuarios compartan comentarios similares sobre el mismo álbum, aparecerán aquí con sus reseñas para revisarlas.|Similar comments from two users on the same album will appear here for review.|Les commentaires similaires de deux utilisateurs sur un album apparaîtront ici.|Commenti simili di due utenti sullo stesso album appariranno qui per la revisione.|两位用户对同一专辑发表相似评论后，将在此显示供审核。|同じアルバムへの2人の類似コメントを、確認用にここに表示します。
Portada no disponible|Cover unavailable|Couverture indisponible|Copertina non disponibile|封面不可用|カバー画像なし
CATÁLOGO MUSICAL · DEEZER|MUSIC CATALOG · DEEZER|CATALOGUE MUSICAL · DEEZER|CATALOGO MUSICALE · DEEZER|音乐目录 · DEEZER|音楽カタログ・DEEZER
/ 5 · Calificación del oyente|/ 5 · Listener rating|/ 5 · Note de l’auditeur|/ 5 · Valutazione ascoltatore|/ 5 · 听众评分|／5・リスナー評価
Escuchar en Deezer ↗|Listen on Deezer ↗|Écouter sur Deezer ↗|Ascolta su Deezer ↗|在 Deezer 收听 ↗|Deezerで聴く ↗
`.trim().split('\n').map(row => row.split('|'));
export const DETAILS_TRANSLATIONS = Object.fromEntries(
  ['es', 'en', 'fr', 'it', 'zh', 'ja'].map((language, index) => [language, Object.fromEntries(rows.map(values => [values[0], values[index]]))]),
);
