/** @vitest-environment jsdom */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n, { LANGUAGES, resources } from '../src/shared/i18n/index.js';
import { LanguageProvider, useLanguage } from '../src/shared/context/language-context.jsx';
import { ForgotPasswordForm } from '../src/features/auth/components/forgot-password-form.jsx';
import { useUIText } from '../src/shared/i18n/use-ui-text.js';
import { usePageScroll } from '../src/shared/routing/use-page-scroll.js';

// The editorial card has perpetual animations unrelated to form localization.
vi.mock('../src/features/auth/components/rotating-review.jsx', () => ({ RotatingReview: () => null }));

afterEach(async () => { cleanup(); await i18n.changeLanguage('es'); vi.restoreAllMocks(); });

describe('translation resources', () => {
  for (const { code } of LANGUAGES) {
    it(`${code} has every key and interpolation variable`, () => {
      for (const namespace of ['translation', 'ui']) {
        expect(Object.keys(resources[code][namespace]).sort()).toEqual(Object.keys(resources.es[namespace]).sort());
        for (const [key, value] of Object.entries(resources[code][namespace])) {
          expect(typeof value, `${code}:${key}`).toBe('string');
          expect(value.trim(), `${code}:${key}`).not.toBe('');
          const vars = text => [...text.matchAll(/{{\s*([^}]+)\s*}}/g)].map(m => m[1]).sort();
          expect(vars(value), `${code}:${key}`).toEqual(vars(resources.es[namespace][key]));
        }
      }
    });
  }
});

function Probe() {
  const { t, changeLanguage, currentLang } = useLanguage();
  const ui = useUIText();
  return <><button onClick={() => changeLanguage('ja')}>{t('nav.home')}</button><span data-testid="language">{currentLang}</span><span>{ui('Correo electrónico')}</span><span>{ui('Texto de respaldo legible')}</span></>;
}

describe('reactive language selection', () => {
  for (const provided of [false, true]) {
    it(`updates and persists ${provided ? 'with' : 'without'} LanguageProvider`, async () => {
      await i18n.changeLanguage('es');
      render(provided ? <I18nextProvider i18n={i18n}><LanguageProvider><Probe /></LanguageProvider></I18nextProvider> : <Probe />);
      fireEvent.click(screen.getByRole('button', { name: 'Inicio' }));
      expect(await screen.findByText('メールアドレス')).toBeTruthy();
      expect(screen.getByTestId('language').textContent).toBe('ja');
      expect(localStorage.getItem('sonar_language')).toBe('ja');
      expect(document.documentElement.lang).toBe('ja');
      expect(screen.getByText('Texto de respaldo legible')).toBeTruthy();
    });
  }
  it('translates an isolated recovery form without changing entered data', async () => {
    await i18n.changeLanguage('es');
    render(<ForgotPasswordForm />);
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'musica@example.com' } });
    for (const { code } of LANGUAGES) {
      await act(async () => { await i18n.changeLanguage(code); });
      expect(screen.getByLabelText(resources[code].ui['Correo electrónico']).value).toBe('musica@example.com');
      expect(screen.getByRole('button', { name: resources[code].ui['Enviar Código de Recuperación'] })).toBeTruthy();
    }
  });
});

it('scrolls on page changes but not filters, search or parameter changes', () => {
  const scroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  const { rerender } = renderHook(({ path }) => usePageScroll(path), { initialProps: { path: 'explore' } });
  rerender({ path: 'explore?q=rock' });
  rerender({ path: 'explore?q=jazz&filter=new' });
  expect(scroll).not.toHaveBeenCalled();
  rerender({ path: 'news?q=jazz' });
  expect(scroll).toHaveBeenCalledExactlyOnceWith({ top: 0, behavior: 'instant' });
  rerender({ path: 'news?q=rock' });
  expect(scroll).toHaveBeenCalledTimes(1);
});
