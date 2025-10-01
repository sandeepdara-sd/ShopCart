import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ColorModeContext = createContext({ toggleColorMode: () => {}, mode: 'light' });

export function useColorMode() {
  return useContext(ColorModeContext);
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme_mode') : null;
    return saved === 'light' || saved === 'dark' ? saved : 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem('theme_mode', mode);
    } catch {}
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
      },
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === 'light' ? '#0b57d0' : '#5b8def' },
          secondary: { main: mode === 'light' ? '#ff4d6d' : '#ff8fa3' },
          success: { main: '#22c55e' },
          warning: { main: '#f59e0b' },
          error: { main: '#ef4444' },
          background: {
            default: mode === 'light' ? '#f5f7fb' : '#0b0f19',
            paper: mode === 'light' ? '#ffffff' : '#0f1523',
          },
        },
        customGradients: {
          primary: mode === 'light'
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
            : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          accent: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          hero: 'linear-gradient(120deg, rgba(11,87,208,.25), rgba(255,77,109,.25))',
        },
        typography: {
          fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
          h1: { fontFamily: 'Clash Display, Inter, sans-serif', fontWeight: 700 },
          h2: { fontFamily: 'Clash Display, Inter, sans-serif', fontWeight: 700 },
          h3: { fontFamily: 'Clash Display, Inter, sans-serif', fontWeight: 700 },
          h4: { fontFamily: 'Clash Display, Inter, sans-serif', fontWeight: 700 },
          h6: { fontWeight: 700 },
          button: { textTransform: 'none', fontWeight: 700 },
        },
        shape: { borderRadius: 12 },
        shadows: [
          'none',
          '0 1px 2px rgba(0,0,0,0.06)',
          '0 4px 12px rgba(0,0,0,0.08)',
          '0 10px 24px rgba(0,0,0,0.10)',
          '0 16px 32px rgba(0,0,0,0.12)',
          ...Array(20).fill('0 6px 24px rgba(0,0,0,0.12)'),
        ],
        components: {
          MuiButton: {
            styleOverrides: {
              root: { borderRadius: 12, paddingLeft: 16, paddingRight: 16 },
            },
            variants: [
              {
                props: { variant: 'gradient' },
                style: {
                  background: 'linear-gradient(90deg, #0b57d0, #ff4d6d)',
                  color: '#fff',
                  boxShadow: '0 8px 24px rgba(11,87,208,0.35)',
                },
              },
            ],
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 14,
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: { boxShadow: 'none', borderBottom: mode === 'light' ? '1px solid #e6eaf2' : '1px solid #1b2333' },
            },
          },
          MuiContainer: {
            defaultProps: { maxWidth: 'lg' },
          },
          MuiPaper: {
            styleOverrides: {
              root: { backgroundImage: 'none' },
            },
          },
          MuiLink: {
            styleOverrides: {
              root: { cursor: 'pointer' },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}


