import { EXTRA_MUSIC_QUESTIONS, EXTRA_TRIVIA_TRANSLATIONS } from '../src/shared/data/music-question-expansion.js';
import { MUSIC_QUESTIONS } from '../src/features/profile/components/music-questions.js';

it('appends exactly 500 questions without moving the original reward-validation indices', () => {
  expect(EXTRA_MUSIC_QUESTIONS).toHaveLength(500);
  expect(MUSIC_QUESTIONS.slice(100)).toEqual(EXTRA_MUSIC_QUESTIONS);
  expect(MUSIC_QUESTIONS[0].question).toBe('¿Qué instrumento de la orquesta tiene cuerdas y se toca con un arco?');
  expect(MUSIC_QUESTIONS[99].question).toBe('¿Qué artista colaboró con Daft Punk en «Starboy»?');
});

it('translates every added question, distinct option and explanation into all six languages', () => {
  for (const language of ['es', 'en', 'fr', 'it', 'zh', 'ja']) {
    const dictionary = EXTRA_TRIVIA_TRANSLATIONS[language];
    expect(new Set(EXTRA_MUSIC_QUESTIONS.map(q => dictionary[q.question])).size).toBe(500);
    for (const q of EXTRA_MUSIC_QUESTIONS) {
      for (const text of [q.question, ...q.options, q.fact]) expect(dictionary[text]?.trim()).toBeTruthy();
      expect(new Set(q.options.map(option => dictionary[option])).size).toBe(3);
    }
  }
});

it('keeps answer keys accurate for accidentals, octave crossings, classification and durations', () => {
  const examples = [
    ['En la escala menor natural de La, ¿qué nota ocupa el grado 7?', 'Sol'],
    ['En la escala menor natural de Do, ¿qué nota ocupa el grado 3?', 'Mi♭'],
    ['En la escala menor natural de Sol♯, ¿qué nota ocupa el grado 6?', 'Mi'],
    ['¿Cuántas corcheas sin puntillo completan exactamente un compás de 6/8, sin silencios ni grupos irregulares?', '6'],
    ['¿Cuántas fusas sin puntillo completan exactamente un compás de 2/2, sin silencios ni grupos irregulares?', '32'],
    ['¿A qué familia instrumental pertenece este instrumento: Saxofón alto?', 'Viento madera'],
    ['¿Quién compuso «Carmen»?', 'Georges Bizet'],
    ['¿Qué nota ocupa el grado 4 de la escala de La♭ mayor?', 'Re♭'],
    ['Al subir de Si a Do dentro de una octava, ¿cuántos semitonos recorres?', '1'],
    ['Con Si como fundamental, ¿qué notas forman una tríada mayor?', 'Si – Re♯ – Fa♯'],
    ['Con Do como fundamental, ¿qué notas forman una tríada disminuida?', 'Do – Mi♭ – Sol♭'],
    ['Si encadenas 3 figuras de tipo «blanca», ¿a cuántas semicorcheas equivale su duración total?', '24'],
  ];
  for (const [prompt, answer] of examples) {
    const q = EXTRA_MUSIC_QUESTIONS.find(q => q.question === prompt);
    expect(q, prompt).toBeDefined();
    expect(q.options[q.correct], prompt).toBe(answer);
  }
  for (let position = 0; position < 3; position++) {
    expect(EXTRA_MUSIC_QUESTIONS.filter(q => q.correct === position).length).toBeGreaterThan(130);
  }
});
