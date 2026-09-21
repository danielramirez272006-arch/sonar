import React from 'react';
import { ThemeProvider } from './shared/context/theme-context';
import AppRouter from './shared/routing/app-router';

function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
