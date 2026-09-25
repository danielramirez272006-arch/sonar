import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18n from './shared/config/i18n';
import "./Styles/index.css";
import 'blobatar/motion.css';
import 'blobatar/gaze.css';
import { ErrorBoundary } from './shared/components/ui/error-boundary.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </ErrorBoundary>
  </StrictMode>,
);

