import { useTranslation } from 'react-i18next';
import './index.js';

// Source-language keys are restricted to authored UI copy. Never pass user data.
export function useUIText() {
  const { t } = useTranslation('ui');
  return (text, options = {}) => t(text, {
    ...options, defaultValue: text, keySeparator: false, nsSeparator: false,
  });
}
