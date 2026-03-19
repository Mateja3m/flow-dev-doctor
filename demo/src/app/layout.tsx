import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import type { ReactNode } from 'react';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0052cc' },
    secondary: { main: '#00a9a5' },
    background: { default: '#f4f7fb', paper: '#ffffff' }
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' }
  }
});

export const metadata: Metadata = {
  title: 'Flow Dev Doctor Demo',
  description: 'Flow developer diagnostics toolkit demo'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
