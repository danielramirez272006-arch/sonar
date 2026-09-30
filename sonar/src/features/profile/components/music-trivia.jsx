import { apiRequest } from '../../../shared/services/api-client';
﻿import './music-trivia.css';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { MUSIC_QUESTIONS } from './music-questions';

export const ROUND_SIZE = 16;
export const QUESTION_MS = 15000;
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
  const [reward, setReward] = useState({ id: null, status: 'idle', message: '' });
  const claimLock = useRef(false);
  const [mode, setMode] = useState('solo');
  const [names, setNames] = useState(['Jugador 1', 'Jugador 2']);
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
  const name = i => names[i].trim() || `Jugador ${i + 1}`;
  const missed = state.selected !== null && state.selected !== question.correct;
  const wonCoins = state.finished && (duelMode ? state.scores[0] > state.scores[1] : state.scores[0] >= 10);
  const claimReward = async () => {
    if (!wonCoins || claimLock.current) return;
    claimLock.current = true;
    setReward({id:state.roundId, status:'loading', message:'Guardando recompensa...'});
    try {
      const result = await apiRequest('/trivia/reward', {method:'POST', body:JSON.stringify({roundId:state.roundId, mode, deck:state.deck, answers:state.answers})});
      try { localStorage.setItem('sonar_user_points', String(result.points)); } catch { /* optional cache */ }
      window.dispatchEvent(new CustomEvent('sonar:points-updated', {detail:{points:result.points}}));
      setReward({id:state.roundId,status:'saved',message:result.alreadyClaimed ? 'Recompensa ya recibida: 100 Sonar Coins.' : '+100 Sonar Coins guardadas en tu cuenta.'});
    } catch (error) { setReward({id:state.roundId,status:'error',message:error.message}); }
    finally { claimLock.current = false; }
  };
  const answered = state.index + (state.selected !== null ? 1 : 0);
  return <section className="music-trivia" aria-label="Trivia musical">
    <header className="mt-header">
      <div className="mt-heading"><span className="mt-record" aria-hidden="true">♫</span><div>
        <span className="mt-eyebrow">SONAR KIDS · PLAY & LEARN</span>
        <h4>¡Dale play a tu mente!</h4>
        <p>Trivia musical · Grandes descubrimientos, una pregunta a la vez.</p>
      </div></div>
      <span className="mt-count"><strong>{MUSIC_QUESTIONS.length}</strong> en el banco · 16 por partida</span>
    </header>
    <div className="mt-toolbar">
      <label className="mt-mode">Elige tu reto<select aria-label="Modo de juego" value={mode} onChange={e => { setMode(e.target.value); dispatch({ type: 'reset' }); }}>
        <option value="solo">♫ Individual</option><option value="1v1">⚡ Duelo 1 contra 1</option>
      </select></label>
      <div className="mt-rules"><span>Gana 100 Sonar Coins</span><span>16 al azar · 15 s por pregunta</span><button type="button" className="mt-sound" aria-pressed={soundEnabled} onClick={() => setSoundEnabled(value => !value)}>{soundEnabled ? 'Sonido activado' : 'Sonido desactivado'}</button><span>✦ Acierta y suma</span><span>↗ Conserva tu turno</span>{duelMode && <span>⇄ Si fallas, pasa el control</span>}<small>Cambiar de modo reinicia la partida{duelMode ? ' · Mismo dispositivo' : ''}.</small></div>
    </div>
    {!state.finished && <div className="mt-game-controls">
      {!state.started || state.paused ? <button type="button" className="mt-next" onClick={startOrResume}>{state.started ? 'Continuar' : 'Iniciar juego'}</button> : <button type="button" className="mt-sound" disabled={state.selected !== null} onClick={() => dispatch({ type: 'pause' })}>Pausar</button>}
      <span role="status">{!state.started ? 'Todo listo: el reloj comienza cuando tú decidas.' : state.paused ? 'Juego en pausa. Tu tiempo y tus puntos están guardados.' : 'Partida en curso'}</span>
    </div>}
    {duelMode ? <div className="mt-players">{names.map((value, i) => <label key={i} className={`mt-player ${state.turn === i && !state.finished ? 'is-active' : ''}`}>
      <span className="mt-avatar" aria-hidden="true">{i === 0 ? '♫' : '★'}</span>
      <span className="mt-player-name"><span>JUGADOR {i + 1}{state.turn === i && !state.finished ? ' · TU TURNO' : ''}</span><input aria-label={`Nombre del jugador ${i + 1}`} maxLength={30} value={value} onChange={e => setNames(previous => previous.map((n, j) => i === j ? e.target.value : n))} /></span>
      <span className="mt-score"><strong>{state.scores[i]}</strong>aciertos</span>
    </label>)}</div> : <div className="mt-solo"><span>✦ Tu mejor rival eres tú. ¡Vamos por otro acierto!</span><span><strong>{state.scores[0]}</strong> aciertos</span></div>}
    <div className="mt-progress-heading"><span>Tu recorrido musical</span><strong>{answered} / {ROUND_SIZE}</strong></div>
    <progress className="mt-progress" aria-label="Preguntas respondidas" value={answered} max={ROUND_SIZE} />
    <p className="mt-reward-rules">{duelMode ? 'Jugador 1 representa tu cuenta. Gana el duelo para obtener 100 Coins; los empates no dan premio.' : 'Consigue al menos 10 de 16 aciertos para ganar 100 Sonar Coins.'}</p>
    {state.finished ? <div className="mt-result" role="status">
      <span className="mt-trophy" aria-hidden="true">🏆</span><span className="mt-eyebrow">¡RETO COMPLETADO!</span>
      <h5>Partida terminada</h5>
      <p>{duelMode ? `${winners.length > 1 ? 'Empate' : 'Ganador'}: ${players.map((_, i) => i).filter(i => state.scores[i] === highest).map(name).join(', ')} · ${highest} aciertos` : `Resultado: ${state.scores[0]} de ${ROUND_SIZE} aciertos`}</p>
      {wonCoins && <div className="mt-reward">
        <strong>Premio de victoria: 100 Sonar Coins</strong>
        {reward.id === state.roundId && <p role="status">{reward.message}</p>}
        <button type="button" className="mt-next" disabled={reward.id === state.roundId && ['loading','saved'].includes(reward.status)} onClick={claimReward}>{reward.id === state.roundId && reward.status === 'saved' ? 'Recompensa recibida' : 'Recibir 100 Coins'}</button>
      </div>}
      <button type="button" className="mt-next" onClick={() => dispatch({ type: 'reset' })}>Jugar de nuevo</button>
    </div> : !state.started || state.paused ? <div className="mt-result"><h5>{state.paused ? 'Una pausa para tomar aire' : '¿Listo para el reto?'}</h5><p>{state.paused ? 'Pulsa Continuar para volver a la misma pregunta.' : '16 preguntas, 15 segundos por respuesta. Pulsa Iniciar juego.'}</p></div> : <div className="mt-question-card">
      <div className="mt-question-meta"><span className="mt-question-number">PREGUNTA {String(state.index + 1).padStart(2, '0')}</span><span role="status">{duelMode ? `Turno de ${name(state.turn)}` : 'Escucha tu intuición'} <span aria-hidden="true">✧</span></span></div>
      <div className={`mt-timer ${remaining <= 5000 ? 'is-urgent' : ''}`}><span>Tiempo para responder <strong>{state.selected === -1 ? 0 : Math.ceil(remaining / 1000)} s</strong></span><progress aria-label="Tiempo restante" max={QUESTION_MS} value={state.selected === -1 ? 0 : remaining} /></div><h5>{question.question}</h5><p className="mt-hint">Tres opciones. Un nuevo descubrimiento.</p>
      <div className="mt-options">{question.options.map((option, i) => {
        const revealed = state.selected !== null;
        const correct = revealed && i === question.correct;
        const wrong = state.selected === i && missed;
        return <button type="button" key={option} disabled={revealed} className={`mt-option ${correct ? 'is-correct' : wrong ? 'is-wrong' : revealed ? 'is-muted' : ''}`} onClick={() => answer(i)}>
          <span className="mt-option-letter" aria-hidden="true">{correct ? '✓' : wrong ? '×' : ['A', 'B', 'C'][i]}</span><span>{option}</span>
          {correct && <span className="mt-sr-only"> · Respuesta correcta</span>}{wrong && <span className="mt-sr-only"> · Respuesta incorrecta</span>}
        </button>;
      })}</div>
      {state.selected !== null && <div role="status" className={`mt-feedback ${missed ? 'is-missed' : ''}`}>
        <div>{!missed && <span key={state.index} className="mt-celebrate" aria-hidden="true">✦ ♪ +1 ♫ ✦</span>}<strong>{state.selected === -1 ? '¡Se acabó el tiempo!' : missed ? '¡Aprender también suma!' : '¡Ese es el ritmo! +1 punto'}</strong><p>{missed ? 'Respuesta incorrecta. ' : ''}{question.fact}</p>
        {duelMode && state.index < state.deck.length - 1 && <small>{missed ? `El control pasa a ${name((state.turn + 1) % 2)} en la siguiente pregunta.` : `${name(state.turn)} conserva el turno.`}</small>}</div>
        <button type="button" className="mt-next" onClick={() => dispatch({ type: 'next', duelMode })}>{state.index === state.deck.length - 1 ? 'Ver resultado' : 'Siguiente pregunta'}<span aria-hidden="true"> →</span></button>
      </div>}
    </div>}
    <footer className="mt-footer"><span>♫ Aprende · Juega · Descubre</span><span>{duelMode ? 'Gana quien tenga más aciertos' : 'Cada pregunta es una nueva nota'}</span></footer>
  </section>;
}
