import { ThemeProvider } from '@vapor-ui/core';

import { Home } from './pages';

import '@vapor-ui/core/styles.css';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Home />
    </ThemeProvider>
  );
}
