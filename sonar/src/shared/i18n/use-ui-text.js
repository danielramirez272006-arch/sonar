import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import './index.js';

// Source-language keys are restricted to authored UI copy. Never pass user data.
export function useUIText() {
  const { t, i18n } = useTranslation('ui');
  return useCallback((text, options = {}) => t(text, {
    ...options, defaultValue: text, keySeparator: false, nsSeparator: false,
  }), [t, i18n.language]);
}

