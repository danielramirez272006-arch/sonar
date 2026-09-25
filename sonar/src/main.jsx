import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "./Styles/index.css";
import 'blobatar/motion.css';
import 'blobatar/gaze.css';
import { ErrorBoundary } from './shared/components/ui/error-boundary.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
