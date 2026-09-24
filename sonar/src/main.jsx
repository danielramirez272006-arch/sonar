import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "./Styles/index.css";
import 'blobatar/motion.css';
import 'blobatar/gaze.css';
import { ThemeProvider } from './shared/context/theme-context.jsx';
import { AuthProvider } from './shared/context/auth-context.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
