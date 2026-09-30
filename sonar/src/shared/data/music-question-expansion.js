// Stable, append-only bank: question indices are also used to validate rewards.
// Reference material: https://www.musictheory.net/lessons
// https://philharmonia.co.uk/resources/instruments/ · https://musopen.org/sheetmusic/
// Language order for authored rows: Spanish, English, French, Italian, Chinese, Japanese.
const languages = ['es', 'en', 'fr', 'it', 'zh', 'ja'];
const localized = text => text.split('|');
const same = text => languages.map(() => String(text));
const questions = [];
export const EXTRA_TRIVIA_TRANSLATIONS = Object.fromEntries(languages.map(lang => [lang, {}]));

function add(category, prompts, answers, facts) {
  // Rotate positions deterministically; the bank must match in browser and server.
  const correct = questions.length % 3;
  const ordered = [...answers];
  ordered.splice(correct, 0, ordered.shift());
  languages.forEach((lang, i) => {
    const dictionary = EXTRA_TRIVIA_TRANSLATIONS[lang];
    dictionary[prompts[0]] = prompts[i];
    ordered.forEach(answer => { dictionary[answer[0]] = answer[i]; });
    dictionary[facts[0]] = facts[i];
  });
  questions.push({ question: prompts[0], options: ordered.map(answer => answer[0]), correct, fact: facts[0], category });
}

const families = [
  localized('Cuerda|Strings|Cordes|Archi e corde|弦乐器|弦楽器'),
  localized('Viento madera|Woodwinds|Bois|Legni|木管乐器|木管楽器'),
  localized('Viento metal|Brass|Cuivres|Ottoni|铜管乐器|金管楽器'),
  localized('Percusión|Percussion|Percussions|Percussioni|打击乐器|打楽器'),
];
const instruments = [
  [0, 'Violín|Violin|Violon|Violino|小提琴|ヴァイオリン'],
  [0, 'Viola|Viola|Alto|Viola|中提琴|ヴィオラ'],
  [0, 'Violonchelo|Cello|Violoncelle|Violoncello|大提琴|チェロ'],
  [0, 'Contrabajo|Double bass|Contrebasse|Contrabbasso|低音提琴|コントラバス'],
  [0, 'Arpa|Harp|Harpe|Arpa|竖琴|ハープ'],
  [0, 'Guitarra clásica|Classical guitar|Guitare classique|Chitarra classica|古典吉他|クラシックギター'],
  [0, 'Ukelele|Ukulele|Ukulélé|Ukulele|尤克里里|ウクレレ'],
  [0, 'Mandolina|Mandolin|Mandoline|Mandolino|曼陀林|マンドリン'],
  [0, 'Laúd|Lute|Luth|Liuto|琉特琴|リュート'],
  [0, 'Banjo|Banjo|Banjo|Banjo|班卓琴|バンジョー'],
  [1, 'Flauta travesera|Concert flute|Flûte traversière|Flauto traverso|长笛|フルート'],
  [1, 'Flautín|Piccolo|Piccolo|Ottavino|短笛|ピッコロ'],
  [1, 'Oboe|Oboe|Hautbois|Oboe|双簧管|オーボエ'],
  [1, 'Corno inglés|English horn|Cor anglais|Corno inglese|英国管|コーラングレ'],
  [1, 'Clarinete|Clarinet|Clarinette|Clarinetto|单簧管|クラリネット'],
  [1, 'Clarinete bajo|Bass clarinet|Clarinette basse|Clarinetto basso|低音单簧管|バスクラリネット'],
  [1, 'Fagot|Bassoon|Basson|Fagotto|巴松管|ファゴット'],
  [1, 'Contrafagot|Contrabassoon|Contrebasson|Controfagotto|低音巴松管|コントラファゴット'],
  [1, 'Saxofón alto|Alto saxophone|Saxophone alto|Sassofono contralto|中音萨克斯管|アルトサクソフォーン'],
  [1, 'Flauta dulce|Recorder|Flûte à bec|Flauto dolce|竖笛|リコーダー'],
  [2, 'Trompeta|Trumpet|Trompette|Tromba|小号|トランペット'],
  [2, 'Trombón|Trombone|Trombone|Trombone|长号|トロンボーン'],
  [2, 'Trompa|French horn|Cor|Corno|圆号|ホルン'],
  [2, 'Tuba|Tuba|Tuba|Tuba|大号|テューバ'],
  [2, 'Corneta de pistones|Cornet|Cornet à pistons|Cornetta|短号|コルネット'],
  [2, 'Fliscorno|Flugelhorn|Bugle|Flicorno soprano|柔音号|フリューゲルホルン'],
  [2, 'Bombardino|Euphonium|Euphonium|Eufonio|次中音号|ユーフォニアム'],
  [2, 'Sousafón|Sousaphone|Sousaphone|Sousafono|苏萨号|スーザフォン'],
  [3, 'Timbales orquestales|Timpani|Timbales d’orchestre|Timpani|定音鼓|ティンパニ'],
  [3, 'Caja de batería|Snare drum|Caisse claire|Rullante|小军鼓|スネアドラム'],
  [3, 'Bombo|Bass drum|Grosse caisse|Grancassa|大鼓|バスドラム'],
  [3, 'Platillos|Cymbals|Cymbales|Piatti|钹|シンバル'],
  [3, 'Triángulo|Triangle|Triangle|Triangolo|三角铁|トライアングル'],
  [3, 'Xilófono|Xylophone|Xylophone|Xilofono|木琴|シロフォン'],
  [3, 'Marimba|Marimba|Marimba|Marimba|马林巴琴|マリンバ'],
  [3, 'Vibráfono|Vibraphone|Vibraphone|Vibrafono|颤音琴|ヴィブラフォン'],
  [3, 'Glockenspiel|Glockenspiel|Glockenspiel|Glockenspiel|钟琴|グロッケンシュピール'],
  [3, 'Castañuelas|Castanets|Castagnettes|Nacchere|响板|カスタネット'],
  [3, 'Güiro|Güiro|Güiro|Güiro|刮瓜|ギロ'],
  [3, 'Bongós|Bongos|Bongos|Bonghi|邦戈鼓|ボンゴ'],
];
instruments.forEach(([family, text]) => {
  const n = localized(text);
  const f = families[family];
  add('instruments', [
    `¿A qué familia instrumental pertenece este instrumento: ${n[0]}?`,
    `Which instrument family includes the ${n[1]}?`,
    `À quelle famille appartient cet instrument : ${n[2]} ?`,
    `A quale famiglia appartiene questo strumento: ${n[3]}?`,
    `${n[4]}属于哪个乐器家族？`, `${n[5]}はどの楽器の仲間ですか？`,
  ], [f, families[(family + 1) % 4], families[(family + 2) % 4]], [
    `${n[0]} pertenece a la familia de ${f[0].toLowerCase()}. La clasificación depende de cómo produce el sonido.`,
    `${n[1]} belongs to the ${f[1].toLowerCase()} family, classified by how it produces sound.`,
    `${n[2]} appartient à la famille ${f[2].toLowerCase()}, selon son mode de production du son.`,
    `${n[3]} appartiene alla famiglia ${f[3].toLowerCase()}, in base a come produce il suono.`,
    `${n[4]}属于${f[4]}，乐器按发声方式分类。`, `${n[5]}は${f[5]}です。音の出し方によって分類されます。`,
  ]);
});

// Original work titles are retained in every language, just like artist names.
const works = [
  ['Antonio Vivaldi', 'Le quattro stagioni'],
  ['Johann Sebastian Bach', 'Goldberg-Variationen, BWV 988'],
  ['Georg Friedrich Händel', 'Messiah, HWV 56'],
  ['Wolfgang Amadeus Mozart', 'Die Zauberflöte, K. 620'],
  ['Ludwig van Beethoven', 'Fidelio, op. 72'],
  ['Joseph Haydn', 'Die Schöpfung, Hob. XXI:2'],
  ['Franz Schubert', 'Winterreise, D. 911'],
  ['Frédéric Chopin', 'Fantaisie-Impromptu, op. 66'],
  ['Franz Liszt', 'Liebesträume, S. 541'],
  ['Robert Schumann', 'Kinderszenen, op. 15'],
  ['Johannes Brahms', 'Ein deutsches Requiem, op. 45'],
  ['Felix Mendelssohn', 'Lieder ohne Worte'],
  ['Pyotr Ilyich Tchaikovsky', 'The Nutcracker, op. 71'],
  ['Antonín Dvořák', 'Rusalka, op. 114'],
  ['Edvard Grieg', 'Peer Gynt, op. 23'],
  ['Jean Sibelius', 'Finlandia, op. 26'],
  ['Camille Saint-Saëns', 'Le Carnaval des animaux'],
  ['Claude Debussy', 'La Mer, L. 109'],
  ['Maurice Ravel', 'Boléro'],
  ['Erik Satie', 'Trois Gymnopédies'],
  ['Georges Bizet', 'Carmen'],
  ['Giuseppe Verdi', 'La traviata'],
  ['Giacomo Puccini', 'Tosca'],
  ['Gioachino Rossini', 'Il barbiere di Siviglia'],
  ['Richard Wagner', 'Der Ring des Nibelungen'],
  ['Richard Strauss', 'Also sprach Zarathustra, op. 30'],
  ['Johann Strauss II', 'An der schönen blauen Donau, op. 314'],
  ['Gustav Holst', 'The Planets, op. 32'],
  ['Modest Mussorgsky', 'Pictures at an Exhibition'],
  ['Nikolai Rimsky-Korsakov', 'Scheherazade, op. 35'],
  ['Sergei Prokofiev', 'Peter and the Wolf, op. 67'],
  ['Igor Stravinsky', 'Le Sacre du printemps'],
  ['Sergei Rachmaninoff', 'Rhapsody on a Theme of Paganini, op. 43'],
  ['Dmitri Shostakovich', 'Lady Macbeth of the Mtsensk District, op. 29'],
  ['Hector Berlioz', 'Symphonie fantastique, op. 14'],
  ['Gabriel Fauré', 'Pavane, op. 50'],
  ['Paul Dukas', 'L’Apprenti sorcier'],
  ['Isaac Albéniz', 'Iberia'],
  ['Manuel de Falla', 'El amor brujo'],
  ['Bedřich Smetana', 'Má vlast'],
];
works.forEach(([composer, work], i) => {
  const others = [works[(i + 7) % works.length], works[(i + 19) % works.length]];
  const fact = [
    `«${work}» es una obra de ${composer}.`, `“${work}” was composed by ${composer}.`,
    `« ${work} » est une œuvre de ${composer}.`, `«${work}» è un’opera di ${composer}.`,
    `《${work}》的作曲家是${composer}。`, `『${work}』は${composer}の作品です。`,
  ];
  add('composers', [
    `¿Quién compuso «${work}»?`, `Who composed “${work}”?`, `Qui a composé « ${work} » ?`,
    `Chi ha composto «${work}»?`, `《${work}》是谁作曲的？`, `『${work}』を作曲したのは誰ですか？`,
  ], [same(composer), ...others.map(row => same(row[0]))], fact);
  add('works', [
    `¿Cuál de estas obras fue compuesta por ${composer}?`, `Which of these works was composed by ${composer}?`,
    `Laquelle de ces œuvres a été composée par ${composer} ?`, `Quale di queste opere è stata composta da ${composer}?`,
    `下列哪部作品由${composer}创作？`, `次のうち${composer}が作曲した作品はどれですか？`,
  ], [same(work), ...others.map(row => same(row[1]))], fact);
});

// Shared Italian performance vocabulary, with individually authored definitions.
const terms = [
  ['pianissimo', 'Muy suave|Very soft|Très doux|Molto piano|很弱|とても弱く'],
  ['fortissimo', 'Muy fuerte|Very loud|Très fort|Molto forte|很强|とても強く'],
  ['mezzo piano', 'Moderadamente suave|Moderately soft|Modérément doux|Moderatamente piano|中弱|やや弱く'],
  ['mezzo forte', 'Moderadamente fuerte|Moderately loud|Modérément fort|Moderatamente forte|中强|やや強く'],
  ['crescendo', 'Aumentar gradualmente la intensidad|Gradually get louder|Augmenter progressivement le volume|Aumentare gradualmente l’intensità|渐强|だんだん強く'],
  ['diminuendo', 'Disminuir gradualmente la intensidad|Gradually get softer|Diminuer progressivement le volume|Diminuire gradualmente l’intensità|渐弱|だんだん弱く'],
  ['accelerando', 'Aumentar gradualmente la velocidad|Gradually get faster|Accélérer progressivement|Accelerare gradualmente|渐快|だんだん速く'],
  ['rallentando', 'Reducir gradualmente la velocidad|Gradually slow down|Ralentir progressivement|Rallentare gradualmente|渐慢|だんだん遅く'],
  ['a tempo', 'Volver a la velocidad anterior|Return to the previous tempo|Revenir au tempo précédent|Tornare al tempo precedente|恢复原速|元の速さに戻る'],
  ['largo', 'Tocar con un tempo muy lento y amplio|Play at a very slow, broad tempo|Jouer dans un tempo très lent et large|Suonare con un tempo molto lento e ampio|以宽广缓慢的速度演奏|幅広く非常にゆっくり'],
  ['presto', 'Tocar muy rápido|Play very fast|Jouer très vite|Suonare molto velocemente|急速演奏|非常に速く'],
  ['andante', 'Tocar a paso tranquilo|Play at a walking pace|Jouer à une allure de marche|Suonare a passo tranquillo|以行走般的速度演奏|歩くような速さで'],
  ['moderato', 'Tocar a velocidad moderada|Play at a moderate speed|Jouer à une vitesse modérée|Suonare a velocità moderata|以中等速度演奏|中くらいの速さで'],
  ['dolce', 'Tocar con dulzura|Play sweetly|Jouer avec douceur|Suonare dolcemente|甜美地演奏|甘美に'],
  ['cantabile', 'Tocar con un carácter cantable|Play in a singing style|Jouer dans un style chantant|Suonare in modo cantabile|如歌地演奏|歌うように'],
  ['con brio', 'Tocar con energía y vivacidad|Play with energy and spirit|Jouer avec énergie et vivacité|Suonare con energia e vivacità|有活力地演奏|生き生きと元気よく'],
  ['espressivo', 'Tocar con expresión|Play expressively|Jouer avec expression|Suonare con espressione|富有表情地演奏|表情豊かに'],
  ['maestoso', 'Tocar con carácter majestuoso|Play majestically|Jouer avec majesté|Suonare con maestosità|庄严地演奏|堂々と荘厳に'],
  ['marcato', 'Tocar las notas con énfasis|Play the notes with emphasis|Jouer les notes avec insistance|Suonare le note con enfasi|强调每个音|一音ずつはっきり強調して'],
  ['tenuto', 'Sostener la nota durante todo su valor|Hold the note for its full value|Tenir la note pendant toute sa durée|Tenere la nota per tutto il suo valore|保持音符的完整时值|音の長さを十分に保って'],
  ['portamento', 'Deslizar la altura de un sonido hacia otro|Slide smoothly from one pitch to another|Glisser d’une hauteur à une autre|Scivolare da un’altezza a un’altra|从一个音高滑向另一个|ある音高から別の音高へ滑らかに移る'],
  ['tremolo', 'Repetir rápidamente una nota o alternar dos sonidos|Rapidly repeat a note or alternate two pitches|Répéter rapidement une note ou alterner deux sons|Ripetere rapidamente una nota o alternare due suoni|快速重复一个音或交替两个音|同じ音を急速に反復するか二音を交互に弾く'],
  ['trillo', 'Alternar rápidamente una nota con la nota superior vecina|Rapidly alternate a note with its upper neighbor|Alterner rapidement une note et sa voisine supérieure|Alternare rapidamente una nota e quella superiore vicina|与上方相邻音快速交替|ある音とすぐ上の音を素早く交互に奏する'],
  ['arco', 'Tocar las cuerdas con el arco|Play the strings with the bow|Jouer les cordes avec l’archet|Suonare le corde con l’arco|用弓拉奏琴弦|弓で弦を弾く'],
  ['col legno', 'Tocar con la madera del arco|Play with the wood of the bow|Jouer avec le bois de l’archet|Suonare con il legno dell’arco|用弓杆木质部分演奏|弓の木の部分で奏する'],
  ['sul ponticello', 'Tocar con el arco cerca del puente|Bow near the bridge|Jouer avec l’archet près du chevalet|Suonare con l’arco vicino al ponticello|靠近琴马运弓|駒の近くで弓を動かす'],
  ['sul tasto', 'Tocar con el arco sobre el diapasón|Bow over the fingerboard|Jouer avec l’archet sur la touche|Suonare con l’arco sopra la tastiera|在指板上方运弓|指板の上で弓を動かす'],
  ['con sordino', 'Tocar con sordina|Play with a mute|Jouer avec une sourdine|Suonare con la sordina|使用弱音器演奏|弱音器を付けて'],
  ['senza sordino', 'Tocar sin sordina|Play without a mute|Jouer sans sourdine|Suonare senza sordina|不使用弱音器演奏|弱音器を外して'],
  ['tutti', 'Tocar todos los intérpretes indicados juntos|All indicated performers play together|Tous les interprètes indiqués jouent ensemble|Tutti gli esecutori indicati suonano insieme|指定的演奏者全体齐奏|指定された奏者全員で奏する'],
  ['solo', 'Destacar a un intérprete individual|Feature an individual performer|Mettre en avant un interprète seul|Mettere in risalto un singolo esecutore|由单个演奏者独奏|一人の奏者が独奏する'],
  ['tacet', 'No tocar durante la sección indicada|Remain silent for the indicated section|Ne pas jouer pendant la section indiquée|Non suonare durante la sezione indicata|在指定段落休止|指定された部分では演奏しない'],
  ['da capo', 'Volver al comienzo de la pieza|Return to the beginning of the piece|Reprendre au début du morceau|Riprendere dall’inizio del brano|从乐曲开头重奏|曲の最初に戻る'],
  ['dal segno', 'Volver al signo de repetición indicado|Return to the indicated segno sign|Reprendre au signe indiqué|Riprendere dal segno indicato|从指定记号处重奏|指定されたセーニョの記号に戻る'],
  ['fine', 'Terminar en el punto indicado|End at the indicated point|Terminer à l’endroit indiqué|Terminare nel punto indicato|在指定位置结束|指定された場所で終わる'],
  ['attacca', 'Continuar con la siguiente sección sin pausa|Continue to the next section without a pause|Enchaîner la section suivante sans pause|Proseguire alla sezione successiva senza pausa|不停顿地接下一段|休まず次の部分へ続ける'],
  ['ad libitum', 'Interpretar el pasaje con la libertad indicada|Perform the passage with the indicated freedom|Interpréter le passage avec la liberté indiquée|Eseguire il passaggio con la libertà indicata|按标示允许的自由处理乐段|指示された範囲で自由に演奏する'],
  ['morendo', 'Apagar progresivamente el sonido|Let the sound gradually die away|Laisser le son s’éteindre progressivement|Lasciare spegnere gradualmente il suono|声音逐渐消逝|消え入るように'],
  ['sforzando', 'Dar un acento fuerte y repentino|Give a sudden strong accent|Donner un accent fort et soudain|Dare un accento forte e improvviso|突强重音|突然強くアクセントを付ける'],
  ['rubato', 'Flexibilizar expresivamente el tiempo musical|Vary the timing expressively|Assouplir le temps musical avec expression|Variare espressivamente il tempo musicale|富有表情地灵活处理节奏速度|表情のために拍の長さを柔軟に変える'],
];
terms.forEach(([term, definition], i) => {
  const meanings = localized(definition);
  const others = [terms[(i + 9) % terms.length], terms[(i + 21) % terms.length]];
  const fact = meanings.map((meaning, lang) => `${term}: ${meaning}${lang > 3 ? '。' : '.'}`);
  add('performance', [
    `En una partitura, ¿qué pide la indicación «${term}»?`, `In a score, what does “${term}” ask you to do?`,
    `Dans une partition, que demande l’indication « ${term} » ?`, `In una partitura, che cosa richiede «${term}»?`,
    `乐谱上的“${term}”要求怎样演奏？`, `楽譜の「${term}」は何を指示しますか？`,
  ], [meanings, ...others.map(row => localized(row[1]))], fact);
  add('vocabulary', [
    `¿Qué término musical corresponde a esta instrucción: «${meanings[0]}»?`,
    `Which musical term means “${meanings[1]}”?`, `Quel terme musical signifie « ${meanings[2]} » ?`,
    `Quale termine musicale significa «${meanings[3]}»?`, `哪个音乐术语表示“${meanings[4]}”？`,
    `「${meanings[5]}」を意味する音楽用語はどれですか？`,
  ], [same(term), ...others.map(row => same(row[0]))], fact);
});

const letters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const solfege = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'];
const pitchClasses = [0, 2, 4, 5, 7, 9, 11];
const note = value => languages.map(lang => ['es', 'fr', 'it'].includes(lang)
  ? value.replace(/[CDEFGAB]/g, letter => solfege[letters.indexOf(letter)]) : value);
const scales = [
  ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  ['G', 'A', 'B', 'C', 'D', 'E', 'F♯'],
  ['D', 'E', 'F♯', 'G', 'A', 'B', 'C♯'],
  ['A', 'B', 'C♯', 'D', 'E', 'F♯', 'G♯'],
  ['E', 'F♯', 'G♯', 'A', 'B', 'C♯', 'D♯'],
  ['B', 'C♯', 'D♯', 'E', 'F♯', 'G♯', 'A♯'],
  ['F', 'G', 'A', 'B♭', 'C', 'D', 'E'],
  ['B♭', 'C', 'D', 'E♭', 'F', 'G', 'A'],
  ['E♭', 'F', 'G', 'A♭', 'B♭', 'C', 'D'],
  ['A♭', 'B♭', 'C', 'D♭', 'E♭', 'F', 'G'],
];
scales.forEach(scale => scale.forEach((value, i) => {
  const tonic = note(scale[0]);
  const degree = i + 1;
  const sequences = languages.map((_, lang) => scale.map(n => note(n)[lang]).join(' – '));
  add('scales', [
    `¿Qué nota ocupa el grado ${degree} de la escala de ${tonic[0]} mayor?`,
    `Which note is degree ${degree} of the ${tonic[1]} major scale?`,
    `Quelle note est au degré ${degree} de la gamme de ${tonic[2]} majeur ?`,
    `Quale nota è il grado ${degree} della scala di ${tonic[3]} maggiore?`,
    `${tonic[4]}大调音阶的第${degree}级音是什么？`, `${tonic[5]}メジャースケールの第${degree}音はどれですか？`,
  ], [note(value), note(scale[(i + 2) % 7]), note(scale[(i + 4) % 7])], [
    `Cuenta desde la tónica: ${sequences[0]}. El grado ${degree} es ${note(value)[0]}.`,
    `Count from the tonic: ${sequences[1]}. Degree ${degree} is ${note(value)[1]}.`,
    `Compte depuis la tonique : ${sequences[2]}. Le degré ${degree} est ${note(value)[2]}.`,
    `Conta dalla tonica: ${sequences[3]}. Il grado ${degree} è ${note(value)[3]}.`,
    `从主音开始数：${sequences[4]}。第${degree}级是${note(value)[4]}。`,
    `主音から数えます：${sequences[5]}。第${degree}音は${note(value)[5]}です。`,
  ]);
}));

letters.forEach((root, i) => {
  for (let steps = 1; steps <= 6; steps++) {
    const j = (i + steps) % 7;
    const distance = (pitchClasses[j] - pitchClasses[i] + 12) % 12;
    const from = note(root);
    const to = note(letters[j]);
    add('intervals', [
      `Al subir de ${from[0]} a ${to[0]} dentro de una octava, ¿cuántos semitonos recorres?`,
      `Ascending from ${from[1]} to ${to[1]} within one octave, how many semitones do you move?`,
      `En montant de ${from[2]} à ${to[2]} dans une octave, combien de demi-tons parcours-tu ?`,
      `Salendo da ${from[3]} a ${to[3]} entro un’ottava, quanti semitoni percorri?`,
      `在一个八度内从${from[4]}上行到${to[4]}，相隔几个半音？`,
      `1オクターブ以内で${from[5]}から${to[5]}へ上がると、半音いくつ分ですか？`,
    ], [same(distance), same(distance + 1), same(distance + 2)], [
      `De ${from[0]} a ${to[0]} en sentido ascendente hay ${distance} semitonos; cada tecla contigua del piano es un semitono.`,
      `Ascending from ${from[1]} to ${to[1]} spans ${distance} semitones; adjacent piano keys are one semitone apart.`,
      `De ${from[2]} à ${to[2]} en montant : ${distance} demi-tons. Deux touches voisines du piano sont séparées d’un demi-ton.`,
      `Da ${from[3]} a ${to[3]} salendo ci sono ${distance} semitoni; due tasti adiacenti distano un semitono.`,
      `从${from[4]}上行到${to[4]}相隔${distance}个半音，钢琴相邻琴键相差一个半音。`,
      `${from[5]}から${to[5]}への上行は半音${distance}個分です。ピアノの隣り合う鍵盤は半音差です。`,
    ]);
  }
});

const qualities = [
  [4, 7, localized('mayor|major|majeur|maggiore|大三和弦|メジャー')],
  [3, 7, localized('menor|minor|mineur|minore|小三和弦|マイナー')],
  [3, 6, localized('disminuida|diminished|diminué|diminuita|减三和弦|ディミニッシュ')],
  [4, 8, localized('aumentada|augmented|augmenté|aumentata|增三和弦|オーギュメント')],
];
function chord(rootIndex, third, fifth) {
  return [0, third, fifth].map((distance, index) => {
    const letterIndex = (rootIndex + index * 2) % 7;
    const naturalDistance = (pitchClasses[letterIndex] - pitchClasses[rootIndex] + 12) % 12;
    const alteration = distance - naturalDistance;
    return letters[letterIndex] + (alteration < 0 ? '♭'.repeat(-alteration) : '♯'.repeat(alteration));
  }).join(' – ');
}
letters.forEach((root, rootIndex) => qualities.forEach(([third, fifth, quality], i) => {
  const n = note(root);
  const tones = note(chord(rootIndex, third, fifth));
  const distractors = [qualities[(i + 1) % 4], qualities[(i + 2) % 4]].map(([a, b]) => note(chord(rootIndex, a, b)));
  add('chords', [
    `Con ${n[0]} como fundamental, ¿qué notas forman una tríada ${quality[0]}?`,
    `With ${n[1]} as the root, which notes form a ${quality[1]} triad?`,
    `Avec ${n[2]} comme fondamentale, quelles notes forment un accord ${quality[2]} de trois sons ?`,
    `Con ${n[3]} come fondamentale, quali note formano una triade ${quality[3]}?`,
    `以${n[4]}为根音，哪些音组成${quality[4]}？`, `${n[5]}を根音とする${quality[5]}・トライアドの構成音は？`,
  ], [tones, ...distractors], [
    `Las notas son ${tones[0]}; están a 0, ${third} y ${fifth} semitonos de la fundamental.`,
    `The notes are ${tones[1]}, at 0, ${third}, and ${fifth} semitones above the root.`,
    `Les notes sont ${tones[2]}, à 0, ${third} et ${fifth} demi-tons de la fondamentale.`,
    `Le note sono ${tones[3]}, a 0, ${third} e ${fifth} semitoni dalla fondamentale.`,
    `构成音为${tones[4]}，分别距根音0、${third}和${fifth}个半音。`,
    `構成音は${tones[5]}。根音から半音0、${third}、${fifth}個分の位置です。`,
  ]);
}));

const durations = [
  [16, localized('redonda|whole note|ronde|semibreve|全音符|全音符')],
  [8, localized('blanca|half note|blanche|minima|二分音符|2分音符')],
  [4, localized('negra|quarter note|noire|semiminima|四分音符|4分音符')],
  [2, localized('corchea|eighth note|croche|croma|八分音符|8分音符')],
  [1, localized('semicorchea|sixteenth note|double croche|semicroma|十六分音符|16分音符')],
];
durations.forEach(([units, label]) => {
  for (let count = 1; count <= 12; count++) {
    const total = units * count;
    add('rhythm', [
      `Si encadenas ${count} figuras de tipo «${label[0]}», ¿a cuántas semicorcheas equivale su duración total?`,
      `How many sixteenth notes equal the total duration of ${count} × ${label[1]}?`,
      `Combien de doubles croches durent autant que ${count} × ${label[2]} ?`,
      `Quante semicrome equivalgono alla durata di ${count} × ${label[3]}?`,
      `${count}个${label[4]}的总时值等于几个十六分音符？`,
      `${label[5]}${count}個分の長さは、16分音符何個分ですか？`,
    ], [same(total), same(total + units), same(total + units * 2)], [
      `Una figura de tipo «${label[0]}» equivale a ${units} semicorcheas. ${count} × ${units} = ${total}.`,
      `One ${label[1]} equals ${units} sixteenth notes. ${count} × ${units} = ${total}.`,
      `Une ${label[2]} vaut ${units} doubles croches. ${count} × ${units} = ${total}.`,
      `Una ${label[3]} vale ${units} semicrome. ${count} × ${units} = ${total}.`,
      `一个${label[4]}等于${units}个十六分音符。${count} × ${units} = ${total}。`,
      `${label[5]}1個は16分音符${units}個分です。${count} × ${units} = ${total}。`,
    ]);
  }
});

export const EXTRA_MUSIC_QUESTIONS = questions;
