// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import MusicMemory, { createMemoryGame, memoryReducer } from '../src/features/profile/components/music-memory';
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });
it('creates eight pairs and prevents repeat selections and moves during a mismatch', () => {
  let state = createMemoryGame();
  expect(new Set(state.cards.map(c => c.id)).size).toBe(16);
  for(let pair=0;pair<8;pair++) expect(state.cards.filter(c=>c.pair===pair)).toHaveLength(2);
  const other = state.cards.findIndex(c=>c.pair!==state.cards[0].pair);
  state=memoryReducer(state,{type:'flip',index:0});
  expect(memoryReducer(state,{type:'flip',index:0})).toBe(state);
  state=memoryReducer(state,{type:'flip',index:other});
  expect(state.moves).toBe(1);
  expect(memoryReducer(state,{type:'flip',index:2})).toBe(state);
});
it('completes the board with eight correct moves and resets progress', () => {
  let state=createMemoryGame();
  for(let pair=0;pair<8;pair++) for(const index of state.cards.map((c,i)=>c.pair===pair?i:-1).filter(i=>i>=0)) state=memoryReducer(state,{type:'flip',index});
  expect(state.matched).toHaveLength(8);
  expect(state.moves).toBe(8);
  expect(state.mistakes).toBe(0);
  expect(memoryReducer(state,{type:'flip',index:0})).toBe(state);
  state=memoryReducer(state,{type:'reset'});
  expect(state.matched).toEqual([]);
  expect(state.moves).toBe(0);
});
it('accumulates failures across turns and keeps them after a match until a new game', () => {
  let state = createMemoryGame();
  const partner = state.cards.findIndex((c, i) => i !== 0 && c.pair === state.cards[0].pair);
  const wrong = state.cards.findIndex(c => c.pair !== state.cards[0].pair);
  for (let turn = 0; turn < 2; turn++) {
    state = memoryReducer(state, { type: 'flip', index: 0 });
    state = memoryReducer(state, { type: 'flip', index: wrong });
    state = memoryReducer(state, { type: 'hide' });
  }
  state = memoryReducer(state, { type: 'flip', index: 0 });
  state = memoryReducer(state, { type: 'flip', index: partner });
  expect(state.mistakes).toBe(2);
  expect(state.moves).toBe(3);
  expect(state.matched).toHaveLength(1);
  expect(memoryReducer(state, { type: 'reset' }).mistakes).toBe(0);
});
it('hides mismatches after the delay and clears the timer when restarting', () => {
  vi.useFakeTimers();
  vi.spyOn(Math, 'random').mockReturnValue(0.999);
  const {container}=render(<MusicMemory />);
  const cards=()=>[...container.querySelectorAll('.memory-card')];
  fireEvent.click(cards()[0]);fireEvent.click(cards()[2]);
  act(()=>vi.advanceTimersByTime(1200));
  expect(container.querySelectorAll('.memory-card.is-visible:not(.is-matched)')).toHaveLength(0);
  fireEvent.click(cards()[0]);fireEvent.click(cards()[2]);
  fireEvent.click(container.querySelector('.memory-reset'));
  fireEvent.click(cards()[0]);
  act(()=>vi.advanceTimersByTime(1200));
  expect(container.querySelectorAll('.is-visible')).toHaveLength(1);
});
