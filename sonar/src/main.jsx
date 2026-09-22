import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "./Styles/index.css";
import { ThemeProvider } from './shared/context/theme-context.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
