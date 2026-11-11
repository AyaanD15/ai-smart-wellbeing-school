import { useEffect, useMemo, useState } from 'react';
import { FluentProvider, Text } from '@fluentui/react-components';
import { MotionConfig } from 'motion/react';
import { BrowserRouter, Link } from 'react-router-dom';
import { darkTheme, lightTheme } from './theme';
import { AppRoutes } from './routes';
import { Header } from '../components/Header';
import { PreviewStateSwitcher } from '../components/PreviewStateSwitcher';

type ThemePreference = 'light' | 'dark' | 'system';

function getSystemTheme(): boolean {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

function getSavedThemePreference(): ThemePreference {
  return 'system';
}

function AppShell() {
  const [themePreference, setThemePreference] = useState<ThemePreference>(getSavedThemePreference);
  const [systemDark, setSystemDark] = useState(getSystemTheme);
  const isDark = themePreference === 'dark' || (themePreference === 'system' && systemDark);
  const appTheme = useMemo(() => isDark ? darkTheme : lightTheme, [isDark]);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mediaQuery) return undefined;
    const updateSystemTheme = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    setSystemDark(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateSystemTheme);
    return () => mediaQuery.removeEventListener('change', updateSystemTheme);
  }, []);

  useEffect(() => {
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, [isDark]);

  function toggleTheme(): void {
    const nextPreference: ThemePreference = isDark ? 'light' : 'dark';
    setThemePreference(nextPreference);
  }

  return (
    <FluentProvider theme={appTheme} className="fluent-app-provider">
      <MotionConfig reducedMotion="user">
        <div className="app-frame" data-theme={isDark ? 'dark' : 'light'}>
          <a className="skip-link" href="#main-content">Skip to content</a>
          <Header isDark={isDark} onToggleTheme={toggleTheme} />
          <main className="app-main" id="main-content">
            <AppRoutes />
          </main>
          <footer className="app-footer">
            <div className="app-footer__inner">
              <Text size={200}>© Grade 10 physical science exhibition · AI Smart Wellbeing School · Website by Ayaan Dongre</Text>
              <nav aria-label="Footer navigation">
                <Link to="/buildings">Campus plan</Link>
                <Link to="/3d-model">3D model</Link>
                <Link to="/wellbeing">Privacy & wellbeing</Link>
                <Link to="/build-guide">Build guide</Link>
              </nav>
            </div>
          </footer>
          <PreviewStateSwitcher />
        </div>
      </MotionConfig>
    </FluentProvider>
  );
}

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppShell />
    </BrowserRouter>
  );
}
