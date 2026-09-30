import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../shared/context/language-context';
import { apiRequest } from '../../../shared/services/api-client';
﻿import './music-trivia.css';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { MUSIC_QUESTIONS } from './music-questions';

export const ROUND_SIZE = 16;
export const QUESTION_MS = 15000;
function CelebrationParticles({ coins = false }) {
  return <span className={`mt-particles ${coins ? 'mt-particles-coins' : ''}`} aria-hidden="true">
    {Array.from({ length: coins ? 12 : 28 }, (_, i) => <span key={i} style={{
      '--x': `${(i * 37 + 11) % 100}%`, '--delay': `${(i % 7) * 0.09}s`,
      '--drift': `${((i * 23) % 130) - 65}px`, '--spin': `${i % 2 ? 420 : -360}deg`,
      '--particle-color': ['#ffd374', '#c6a2ff', '#87e6d1', '#ff99b8'][i % 4],
    }}>{coins ? '♫' : ''}</span>)}
  </span>;
}
export const initialGame = () => {
  const deck = MUSIC_QUESTIONS.map((_, i) => i);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return { roundId: crypto.randomUUID(), answers: [], deck: deck.slice(0, ROUND_SIZE), index: 0, selected: null, turn: 0, scores: [0, 0], finished: false, started: false, paused: false, left: QUESTION_MS, deadline: null };
};
export function triviaReducer(state, action) {
  if (action.type === 'reset') return initialGame();
  if (state.finished) return state;
  const now = action.now ?? Date.now();
  if (action.type === 'start' && !state.started) return { ...state, started: true, deadline: now + QUESTION_MS };
  if (action.type === 'pause' && state.started && !state.paused && state.selected === null) {
    if (now >= state.deadline) return { ...state, selected: -1, answers: [...state.answers, -1] };
    return { ...state, paused: true, left: state.deadline - now };
  }
  if (action.type === 'resume' && state.paused) return { ...state, paused: false, deadline: now + state.left };
  if (!state.started || state.paused) return state;
  if (action.type === 'answer' && state.selected === null) {
    const option = (action.now ?? Date.now()) >= state.deadline ? -1 : action.option;
    const correct = option === MUSIC_QUESTIONS[state.deck[state.index]].correct;
    return { ...state, selected: option, answers: [...state.answers, option], scores: state.scores.map((score, i) => score + (correct && i === state.turn ? 1 : 0)) };
  }
  if (action.type === 'next' && state.selected !== null) {
    if (state.index === state.deck.length - 1) return { ...state, finished: true };
    const missed = state.selected !== MUSIC_QUESTIONS[state.deck[state.index]].correct;
    return { ...state, index: state.index + 1, selected: null, deadline: Date.now() + QUESTION_MS, turn: action.duelMode && missed ? (state.turn + 1) % 2 : state.turn };
  }
  return state;
}

export function MusicTrivia() {
  const { t } = useTranslation('trivia');
  const ui = (text, values = {}) => t(text, { ...values, defaultValue: text, keySeparator: false, nsSeparator: false });
  const { currentLang } = useLanguage();
  const [reward, setReward] = useState({ id: null, status: 'idle', message: '' });
  const claimLock = useRef(false);
  const [mode, setMode] = useState('solo');
  const [names, setNames] = useState(['', '']);
  const [state, dispatch] = useReducer(triviaReducer, undefined, initialGame);
  const [remaining, setRemaining] = useState(QUESTION_MS);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef(null);
  useEffect(() => () => { audioRef.current?.close().catch(() => {}); }, []);
  useEffect(() => {
    if (!state.started) { setRemaining(QUESTION_MS); return; }
    if (state.paused) { setRemaining(state.left); return; }
    if (state.selected !== null || state.finished) return;
    const tick = () => {
      const left = Math.max(0, state.deadline - Date.now());
      setRemaining(left);
      if (!left) dispatch({ type: 'answer', option: -1 });
    };
    tick();
    const timer = setInterval(tick, 100);
    return () => clearInterval(timer);
  }, [state.deadline, state.selected, state.finished, state.started, state.paused, state.left]);
  const playFeedback = useCallback(correct => {
    if (soundEnabled) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const ctx = audioRef.current || (audioRef.current = new AudioContext());
          ctx.resume().then(() => {
            (correct ? [523.25, 659.25, 783.99] : [293.66, 220, 146.83]).forEach((frequency, i) => {
              const oscillator = ctx.createOscillator();
              const gain = ctx.createGain();
              const start = ctx.currentTime + i * 0.09;
              oscillator.frequency.value = frequency;
              gain.gain.setValueAtTime(0, start);
              gain.gain.linearRampToValueAtTime(0.055, start + 0.015);
              gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
              oscillator.connect(gain); gain.connect(ctx.destination);
              oscillator.start(start); oscillator.stop(start + 0.24);
              oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
            });
          }).catch(() => {});
        }
      } catch { /* El sonido es opcional; la partida continúa. */ }
    }
  }, [soundEnabled]);
  const played = useRef(null);
  useEffect(() => {
    if (state.selected === null) { played.current = null; return; }
    if (played.current === state.deadline) return;
    played.current = state.deadline;
    playFeedback(state.selected === MUSIC_QUESTIONS[state.deck[state.index]].correct);
  }, [state.selected, state.deadline, state.deck, state.index, playFeedback]);
  const answer = option => {
    if (!state.started || state.paused || state.selected !== null) return;
    dispatch({ type: 'answer', option });
  };
  const startOrResume = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (soundEnabled && AudioContext) {
        const ctx = audioRef.current || (audioRef.current = new AudioContext());
        ctx.resume().catch(() => {});
      }
    } catch { /* Audio is optional. */ }
    dispatch({ type: state.started ? 'resume' : 'start' });
  };
  const duelMode = mode === '1v1';
  const question = MUSIC_QUESTIONS[state.deck[state.index]];
  const players = duelMode ? names : ['Jugador 1'];
  const highest = Math.max(...state.scores.slice(0, players.length));
  const winners = players.filter((_, i) => state.scores[i] === highest);
  const name = i => names[i].trim() || ui('Jugador {{number}}', { number: i + 1 });
  const missed = state.selected !== null && state.selected !== question.correct;
  const wonCoins = state.finished && (duelMode ? state.scores[0] > state.scores[1] : state.scores[0] >= 10);
  const hasWinner = state.finished && (duelMode ? winners.length === 1 : wonCoins);
  const rewardSaved = reward.id === state.roundId && reward.status === 'saved';
  const claimReward = async () => {
    if (!wonCoins || claimLock.current) return;
    claimLock.current = true;
    setReward({id:state.roundId, status:'loading', message:'Guardando recompensa...'});
    try {
      const result = await apiRequest('/trivia/reward', {method:'POST', body:JSON.stringify({roundId:state.roundId, mode, deck:state.deck, answers:state.answers})});
      try { localStorage.setItem('sonar_user_points', String(result.points)); } catch { /* optional cache */ }
      window.dispatchEvent(new CustomEvent('sonar:points-updated', {detail:{points:result.points}}));
      setReward({id:state.roundId,status:'saved',celebrate:!result.alreadyClaimed,message:result.alreadyClaimed ? "Recompensa ya recibida: 100 Sonar Coins." : "+100 Sonar Coins guardadas en tu cuenta."});
    } catch { setReward({id:state.roundId,status:'error',message:'No se pudo guardar la recompensa. Inicia sesión e intenta de nuevo.'}); }
    finally { claimLock.current = false; }
  };
  const answered = state.index + (state.selected !== null ? 1 : 0);
  return <section className="music-trivia" aria-label={ui("Trivia musical")}>
    <header className="mt-header">
      <div className="mt-heading"><span className="mt-record" aria-hidden="true">♫</span><div>
        <span className="mt-eyebrow">SONAR KIDS · PLAY & LEARN</span>
        <h4>{ui("¡Dale play a tu mente!")}</h4>
        <p>{ui("Trivia musical · Grandes descubrimientos, una pregunta a la vez.")}</p>
      </div></div>
      <span className="mt-count"><strong>{MUSIC_QUESTIONS.length}</strong> {ui("en el banco · 16 por partida")}</span>
    </header>
    <div className="mt-toolbar">
      <label className="mt-mode">{ui("Elige tu reto")}<select aria-label={ui("Modo de juego")} value={mode} onChange={e => { setMode(e.target.value); dispatch({ type: 'reset' }); }}>
        <option value="solo">{ui("♫ Individual")}</option><option value="1v1">{ui("⚡ Duelo 1 contra 1")}</option>
      </select></label>
      <div className="mt-rules"><span>{ui("Gana 100 Sonar Coins")}</span><span>{ui("16 al azar · 15 s por pregunta")}</span><button type="button" className="mt-sound" aria-pressed={soundEnabled} onClick={() => setSoundEnabled(value => !value)}>{soundEnabled ? ui("Sonido activado") : ui("Sonido desactivado")}</button><span>{ui("✦ Acierta y suma")}</span><span>{ui("↗ Conserva tu turno")}</span>{duelMode && <span>{ui("⇄ Si fallas, pasa el control")}</span>}<small>{ui("Cambiar de modo reinicia la partida")}{duelMode ? ui(" · Mismo dispositivo") : ''}.</small></div>
    </div>
    {!state.finished && <div className="mt-game-controls">
      {!state.started || state.paused ? <button type="button" className="mt-next" onClick={startOrResume}>{state.started ? ui("Continuar") : ui("Iniciar juego")}</button> : <button type="button" className="mt-sound" disabled={state.selected !== null} onClick={() => dispatch({ type: 'pause' })}>{ui("Pausar")}</button>}
      <span role="status">{!state.started ? ui("Todo listo: el reloj comienza cuando tú decidas.") : state.paused ? ui("Juego en pausa. Tu tiempo y tus puntos están guardados.") : ui("Partida en curso")}</span>
    </div>}
    {duelMode ? <div className="mt-players">{names.map((value, i) => <label key={i} className={`mt-player ${state.turn === i && !state.finished ? 'is-active' : ''}`}>
      <span className="mt-avatar" aria-hidden="true">{i === 0 ? '♫' : '★'}</span>
      <span className="mt-player-name"><span>{ui("JUGADOR")} {i + 1}{state.turn === i && !state.finished ? ui(" · TU TURNO") : ''}</span><input aria-label={ui('Nombre del jugador {{number}}', {number:i+1})} maxLength={30} value={value} placeholder={name(i)} onChange={e => setNames(previous => previous.map((n, j) => i === j ? e.target.value : n))} /></span>
      <span className="mt-score"><strong>{state.scores[i]}</strong>{ui("aciertos")}</span>
    </label>)}</div> : <div className="mt-solo"><span>{ui("✦ Tu mejor rival eres tú. ¡Vamos por otro acierto!")}</span><span><strong>{state.scores[0]}</strong> {ui("aciertos")}</span></div>}
    <div className="mt-progress-heading"><span>{ui("Tu recorrido musical")}</span><strong>{answered} / {ROUND_SIZE}</strong></div>
    <progress className="mt-progress" aria-label={ui("Preguntas respondidas")} value={answered} max={ROUND_SIZE} />
    <p className="mt-reward-rules">{duelMode ? ui("Jugador 1 representa tu cuenta. Gana el duelo para obtener 100 Coins; los empates no dan premio.") : ui("Consigue al menos 10 de 16 aciertos para ganar 100 Sonar Coins.")}</p>
    {state.finished ? <div key={state.roundId} className={`mt-result ${hasWinner ? 'mt-victory' : ''}`} role="status">
      {hasWinner && <CelebrationParticles />}
      <span className="mt-trophy" aria-hidden="true">🏆</span><span className="mt-eyebrow">{ui("¡RETO COMPLETADO!")}</span>
      <h5>{hasWinner ? (duelMode ? `${ui("Ganador")}: ${name(state.scores[0] > state.scores[1] ? 0 : 1)}` : ui("¡RETO COMPLETADO!")) : ui("Partida terminada")}</h5>
      <p>{duelMode ? `${winners.length > 1 ? ui("Empate") : ui("Ganador")}: ${players.map((_, i) => i).filter(i => state.scores[i] === highest).map(name).join(', ')} · ${highest} ${ui('aciertos')}` : ui('Resultado: {{score}} de {{total}} aciertos', {score:state.scores[0],total:ROUND_SIZE})}</p>
      {wonCoins && <div className={`mt-reward ${rewardSaved ? 'is-saved' : ''} ${rewardSaved && reward.celebrate ? 'mt-reward-celebration' : ''}`}>
        {rewardSaved && <div className="mt-coin-award" aria-hidden="true">
          {reward.celebrate && <CelebrationParticles coins />}
          <span className="mt-gold-coin">♫</span>
          <span className="mt-coin-amount">+100 <small>Sonar Coins</small></span>
          <span className="mt-coin-check">✓</span>
        </div>}
        <strong>{ui("Premio de victoria: 100 Sonar Coins")}</strong>
        {reward.id === state.roundId && <p role="status">{ui(reward.message)}</p>}
        <button type="button" className="mt-next" disabled={reward.id === state.roundId && ['loading','saved'].includes(reward.status)} onClick={claimReward}>{reward.id === state.roundId && reward.status === 'saved' ? ui("Recompensa recibida") : ui("Recibir 100 Coins")}</button>
      </div>}
      <button type="button" className="mt-next" onClick={() => dispatch({ type: 'reset' })}>{ui("Jugar de nuevo")}</button>
    </div> : !state.started || state.paused ? <div className="mt-result"><h5>{state.paused ? ui("Una pausa para tomar aire") : ui("¿Listo para el reto?")}</h5><p>{state.paused ? ui("Pulsa Continuar para volver a la misma pregunta.") : ui("16 preguntas, 15 segundos por respuesta. Pulsa Iniciar juego.")}</p></div> : <div className="mt-question-card">
      <div className="mt-question-meta"><span className="mt-question-number">{ui("PREGUNTA")} {String(state.index + 1).padStart(2, '0')}</span><span role="status">{duelMode ? ui('Turno de {{name}}', {name:name(state.turn)}) : ui("Escucha tu intuición")} <span aria-hidden="true">✧</span></span></div>
      <div className={`mt-timer ${remaining <= 5000 ? 'is-urgent' : ''}`}><span>{ui("Tiempo para responder")} <strong>{state.selected === -1 ? 0 : Math.ceil(remaining / 1000)} s</strong></span><progress aria-label={ui("Tiempo restante")} max={QUESTION_MS} value={state.selected === -1 ? 0 : remaining} /></div><h5>{ui(question.question)}</h5><p className="mt-hint">{ui("Tres opciones. Un nuevo descubrimiento.")}</p>
      <div className="mt-options">{question.options.map((option, i) => {
        const revealed = state.selected !== null;
        const correct = revealed && i === question.correct;
        const wrong = state.selected === i && missed;
        return <button type="button" key={option} disabled={revealed} className={`mt-option ${correct ? 'is-correct' : wrong ? 'is-wrong' : revealed ? 'is-muted' : ''}`} onClick={() => answer(i)}>
          <span className="mt-option-letter" aria-hidden="true">{correct ? '✓' : wrong ? '×' : ['A', 'B', 'C'][i]}</span><span>{ui(option)}</span>
          {correct && <span className="mt-sr-only"> · Respuesta correcta</span>}{wrong && <span className="mt-sr-only"> · Respuesta incorrecta</span>}
        </button>;
      })}</div>
      {state.selected !== null && <div role="status" className={`mt-feedback ${missed ? 'is-missed' : ''}`}>
        <div>{!missed && <span key={state.index} className="mt-celebrate" aria-hidden="true">✦ ♪ +1 ♫ ✦</span>}<strong>{state.selected === -1 ? ui("¡Se acabó el tiempo!") : missed ? ui("¡Aprender también suma!") : ui("¡Ese es el ritmo! +1 punto")}</strong><p>{missed ? ui("Respuesta incorrecta. ") : ''}{currentLang === 'es' ? question.fact : ui('La respuesta es: {{answer}}.', {answer:ui(question.options[question.correct])})}</p>
        {duelMode && state.index < state.deck.length - 1 && <small>{missed ? ui('El control pasa a {{name}} en la siguiente pregunta.', {name:name((state.turn + 1) % 2)}) : ui('{{name}} conserva el turno.', {name:name(state.turn)})}</small>}</div>
        <button type="button" className="mt-next" onClick={() => dispatch({ type: 'next', duelMode })}>{state.index === state.deck.length - 1 ? ui("Ver resultado") : ui("Siguiente pregunta")}<span aria-hidden="true"> →</span></button>
      </div>}
    </div>}
    <footer className="mt-footer"><span>{ui("♫ Aprende · Juega · Descubre")}</span><span>{duelMode ? ui("Gana quien tenga más aciertos") : ui("Cada pregunta es una nueva nota")}</span></footer>
  </section>;
}


