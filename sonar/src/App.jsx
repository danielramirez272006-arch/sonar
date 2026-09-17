import React from 'react';
import { ThemeProvider } from './shared/context/theme-context';
import HomePage from './pages/public/home-page';

function App() {
  return (
    <ThemeProvider>
      <HomePage />
    </ThemeProvider>
  );
}

export default App;
