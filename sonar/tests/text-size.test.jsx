import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { AccessibilityProvider, useAccessibility } from '../src/shared/context/accessibility-context';
import { enlargeTextOnly } from '../src/shared/utils/text-size';

afterEach(() => { cleanup(); localStorage.clear(); document.documentElement.className = ''; });

it('enlarges nested text once, preserves icons and restores inline styles', () => {
  const { container } = render(<div style={{ fontSize: '20px', width: '200px' }}>Texto <strong style={{ fontSize: '20px' }}>anidado</strong><span className="material-symbols-outlined" style={{ fontSize: '24px' }}>star</span></div>);
  const restore = enlargeTextOnly(1.3, container);
  expect(container.firstChild.style.fontSize).toBe('26px');
  expect(container.querySelector('strong').style.fontSize).toBe('26px');
  expect(container.querySelector('span').style.fontSize).toBe('24px');
  expect(container.firstChild.style.width).toBe('200px');
  restore();
  expect(container.firstChild.style.fontSize).toBe('20px');
  expect(container.querySelector('strong').style.fontSize).toBe('20px');
});

function Controls() {
  const { settings, updateSetting, resetAllSettings } = useAccessibility();
  return <><p style={{ fontSize: '20px' }}>Lectura</p><output>{settings.fontSize}</output>
    <button onClick={() => updateSetting('textOnlySize', 'xlarge')}>Letras</button>
    <button onClick={resetAllSettings}>Reset</button></>;
}
it('persists the independent text setting and resets it without altering interface size', () => {
  const view = render(<AccessibilityProvider><Controls /></AccessibilityProvider>);
  fireEvent.click(screen.getByText('Letras'));
  expect(screen.getByText('Lectura').style.fontSize).toBe('26px');
  expect(screen.getByText('normal')).toBeTruthy();
  expect(document.documentElement.classList.contains('a11y-font-xlarge')).toBe(false);
  expect(JSON.parse(localStorage.getItem('sonar_a11y_settings')).textOnlySize).toBe('xlarge');
  view.unmount();
  render(<AccessibilityProvider><Controls /></AccessibilityProvider>);
  expect(screen.getByText('Lectura').style.fontSize).toBe('26px');
  fireEvent.click(screen.getByText('Reset'));
  expect(screen.getByText('Lectura').style.fontSize).toBe('20px');
});
