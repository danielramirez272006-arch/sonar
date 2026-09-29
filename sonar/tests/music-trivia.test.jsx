// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { MusicTrivia, initialGame, triviaReducer } from '../src/features/profile/components/music-trivia';
import { MUSIC_QUESTIONS } from '../src/features/profile/components/music-questions';
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });
const correct = state => MUSIC_QUESTIONS[state.deck[state.index]].correct;
it('keeps 100 unique valid questions and draws sixteen without repeats', () => {
  expect(MUSIC_QUESTIONS).toHaveLength(100);
  expect(new Set(MUSIC_QUESTIONS.map(q => q.question)).size).toBe(100);
  for (const q of MUSIC_QUESTIONS) {
    expect(q.options).toHaveLength(3);
    expect(q.options[q.correct]).toBeTruthy();
  }
  expect(new Set(initialGame().deck).size).toBe(16);
  vi.spyOn(Math, 'random').mockReturnValue(0);
  const first = initialGame().deck;
  Math.random.mockReturnValue(0.99);
  expect(initialGame().deck).not.toEqual(first);
});
it('scores once and retains control when correct', () => {
  let state = triviaReducer(initialGame(), { type: 'start' });
  state = triviaReducer(state, { type: 'answer', option: correct(state) });
  expect(state.scores).toEqual([1, 0]);
  expect(triviaReducer(state, { type: 'answer', option: correct(state) })).toBe(state);
  expect(triviaReducer(state, { type: 'next', duelMode: true }).turn).toBe(0);
});
it('rejects late answers and passes control after expiry', () => {
  const start = triviaReducer(initialGame(), { type: 'start' });
  const state = triviaReducer(start, { type: 'answer', option: correct(start), now: start.deadline });
  expect(state.selected).toBe(-1);
  expect(state.scores).toEqual([0, 0]);
  expect(triviaReducer(state, { type: 'next', duelMode: true }).turn).toBe(1);
});
it('ends after sixteen and resets the score and clock', () => {
  let state = triviaReducer(initialGame(), { type: 'start' });
  for (let i = 0; i < 16; i++) {
    state = triviaReducer(state, { type: 'answer', option: correct(state) });
    state = triviaReducer(state, { type: 'next', duelMode: true });
  }
  expect(state.finished).toBe(true);
  expect(state.scores).toEqual([16, 0]);
  const reset = triviaReducer(state, { type: 'reset' });
  expect(reset.index).toBe(0);
  expect(reset.scores).toEqual([0, 0]);
  expect(reset.selected).toBe(null);
});
it('shows timeout at fifteen seconds and disables answers', () => {
  vi.useFakeTimers();
  render(<MusicTrivia />);
  fireEvent.change(screen.getByLabelText('Modo de juego'), { target: { value: '1v1' } });
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar juego' }));
  act(() => vi.advanceTimersByTime(15000));
  expect(screen.getByText(/Se acabó el tiempo/)).toBeTruthy();
  expect(screen.getByText(/El control pasa a Jugador 2/)).toBeTruthy();
  expect(document.querySelectorAll('.mt-option:disabled')).toHaveLength(3);
  fireEvent.click(screen.getByRole('button', { name: 'Siguiente pregunta' }));
  expect(screen.getByText(/Turno de Jugador 2/)).toBeTruthy();
  expect(screen.getByText('15 s')).toBeTruthy();
});
it('shows celebration and stops the timer on a correct answer', () => {
  vi.useFakeTimers();
  render(<MusicTrivia />);
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar juego' }));
  const q = MUSIC_QUESTIONS.find(q => screen.queryByText(q.question));
  fireEvent.click(screen.getByRole('button', { name: q.options[q.correct] }));
  expect(screen.getByText(/Ese es el ritmo/)).toBeTruthy();
  expect(document.querySelector('.mt-celebrate')).toBeTruthy();
  act(() => vi.advanceTimersByTime(16000));
  expect(screen.queryByText(/Se acabó el tiempo/)).toBe(null);
});

it('waits for start and preserves time while paused', () => {
  vi.useFakeTimers();
  render(<MusicTrivia />);
  act(() => vi.advanceTimersByTime(20000));
  expect(screen.queryByText(/Se acabó el tiempo/)).toBe(null);
  expect(document.querySelectorAll('.mt-option')).toHaveLength(0);
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar juego' }));
  act(() => vi.advanceTimersByTime(5000));
  expect(screen.getByText('10 s')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Pausar' }));
  act(() => vi.advanceTimersByTime(30000));
  expect(document.querySelectorAll('.mt-option')).toHaveLength(0);
  fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
  expect(screen.getByText('10 s')).toBeTruthy();
  act(() => vi.advanceTimersByTime(10000));
  expect(screen.getByText(/Se acabó el tiempo/)).toBeTruthy();
});
