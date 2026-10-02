import { useEffect, useReducer } from 'react';
import { useUIText } from '../../../shared/i18n/use-ui-text';
import './music-memory.css';

const instruments = ['🎸', '🎹', '🎺', '🎻', '🥁', '🎷', '🪕', '🪈'];
export function createMemoryGame() {
  const cards = instruments.flatMap((symbol, pair) => [0, 1].map(copy => ({ id: `${pair}-${copy}`, pair, symbol })));
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return { cards, open: [], matched: [], moves: 0, mistakes: 0 };
}
export function memoryReducer(state, action) {
  if (action.type === 'reset') return createMemoryGame();
  if (action.type === 'hide') return { ...state, open: [] };
  if (action.type !== 'flip' || state.open.length === 2 || state.open.includes(action.index)) return state;
  const card = state.cards[action.index];
  if (!card || state.matched.includes(card.pair)) return state;
  if (!state.open.length) return { ...state, open: [action.index] };
  const match = state.cards[state.open[0]].pair === card.pair;
  return { ...state, moves: state.moves + 1, mistakes: state.mistakes + (match ? 0 : 1), open: match ? [] : [...state.open, action.index], matched: match ? [...state.matched, card.pair] : state.matched };
}

export default function MusicMemory() {
  const ui = useUIText();
  const [state, dispatch] = useReducer(memoryReducer, undefined, createMemoryGame);
  const won = state.matched.length === instruments.length;
  useEffect(() => {
    if (state.open.length !== 2) return;
    const timeout = setTimeout(() => dispatch({ type: 'hide' }), 1100);
    return () => clearTimeout(timeout);
  }, [state.open]);
  return <section className={`music-memory ${won ? 'is-won' : ''}`} aria-labelledby="memory-title">
    <header className="memory-header">
      <div><span className="memory-eyebrow">SONAR ARCADE</span><h3 id="memory-title">{ui('Memoria musical')}</h3>
        <p>{ui('Voltea dos cartas y encuentra los instrumentos iguales. ¡Completa las ocho parejas!')}</p></div>
      <button type="button" className="memory-reset" onClick={() => dispatch({ type: 'reset' })}>{ui('Nueva partida')}</button>
    </header>
    <div className="memory-stats"><span>{ui('Parejas')}: <strong>{state.matched.length} / 8</strong></span><span>{ui('Movimientos')}: <strong>{state.moves}</strong></span><span role="status">{ui('Intentos fallidos')}: <strong>{state.mistakes}</strong></span></div>
    <div className="memory-board" aria-label={ui('Tablero de memoria')}>
      {state.cards.map((card, index) => {
        const matched = state.matched.includes(card.pair);
        const visible = matched || state.open.includes(index);
        return <button key={card.id} type="button" className={`memory-card ${visible ? 'is-visible' : ''} ${matched ? 'is-matched' : ''}`}
          aria-label={`${ui('Carta')} ${index + 1}: ${visible ? card.symbol : ui('Oculta')}${matched ? ` · ${ui('Pareja encontrada')}` : ''}`}
          aria-disabled={matched || state.open.includes(index) || state.open.length === 2}
          onClick={() => dispatch({ type: 'flip', index })}>
          <span className="memory-card-symbol" aria-hidden="true">{visible ? card.symbol : '♫'}</span>
          <span className="memory-card-number" aria-hidden="true">{matched ? '✓' : String(index + 1).padStart(2, '0')}</span>
        </button>;
      })}
    </div>
    <p className="memory-status" role="status" aria-live="polite">{won
      ? ui('¡Orquesta completa! Encontraste todas las parejas en {{count}} movimientos.', { count: state.moves })
      : state.open.length === 2 ? ui('No coinciden. Recuerda sus posiciones e inténtalo de nuevo.')
        : state.open.length === 1 ? ui('Ahora elige otra carta.') : ui('Parejas encontradas: {{count}} de 8. Elige una carta.', { count: state.matched.length })}</p>
  </section>;
}
