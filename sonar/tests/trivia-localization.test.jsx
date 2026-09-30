// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import i18n from '../src/shared/i18n';
import { MusicTrivia } from '../src/features/profile/components/music-trivia';
import { MUSIC_QUESTIONS } from '../src/features/profile/components/music-questions';
import { TRIVIA_TRANSLATIONS } from '../src/shared/i18n/locales/trivia-messages';
afterEach(async () => {cleanup();vi.useRealTimers();await i18n.changeLanguage('es');});
it('has a complete question and answer dictionary in every supported language',()=>{
 for(const lang of ['es','en','fr','it','zh','ja']) {
   for(const q of MUSIC_QUESTIONS) {
     expect(TRIVIA_TRANSLATIONS[lang][q.question]).toBeTruthy();
     for(const answer of q.options)expect(TRIVIA_TRANSLATIONS[lang][answer]).toBeTruthy();
   }
 }
 expect(MUSIC_QUESTIONS.slice(100)).toHaveLength(400);
});
it('switches all six languages without resetting the question or timer',async()=>{
 vi.useFakeTimers();
 await i18n.changeLanguage('es');
 render(<MusicTrivia />);
 fireEvent.click(screen.getByRole('button',{name:'Iniciar juego'}));
 const q = MUSIC_QUESTIONS.find(q=>screen.queryByText(q.question));
 act(()=>vi.advanceTimersByTime(5000));
 for(const lang of ['en','fr','it','zh','ja','es']) {
   await act(async()=>{await i18n.changeLanguage(lang);});
   expect(screen.getByText(TRIVIA_TRANSLATIONS[lang][q.question])).toBeTruthy();
   expect(screen.getByRole('button',{name:TRIVIA_TRANSLATIONS[lang][q.options[q.correct]]})).toBeTruthy();
   expect(screen.getByText('10 s')).toBeTruthy();
 }
 fireEvent.click(screen.getByRole('button',{name:q.options[q.correct]}));
 await act(async()=>{await i18n.changeLanguage('en');});
 expect(screen.getByText(/That's the beat/)).toBeTruthy();
 expect(screen.getByText('The answer is: '+TRIVIA_TRANSLATIONS.en[q.options[q.correct]]+'.')).toBeTruthy();
});
