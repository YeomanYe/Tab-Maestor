import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'tab-maestro-theme';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const resolveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const themeRef = useRef(theme);

  // Keep ref in sync with theme state
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  const applyTheme = (newTheme: Theme) => {
    const resolved = resolveTheme(newTheme);
    document.documentElement.setAttribute('data-theme', resolved);
    setResolvedTheme(resolved);
  };

  // Load theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      if (typeof window !== 'undefined' && window.chrome?.storage?.sync) {
        try {
          const result = await window.chrome.storage.sync.get(THEME_STORAGE_KEY);
          const savedTheme = result?.[THEME_STORAGE_KEY] as Theme | undefined;
          if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
            setThemeState(savedTheme);
            setResolvedTheme(resolveTheme(savedTheme));
            applyTheme(savedTheme);
          }
        } catch {
          // Use default theme
        }
      }
    };
    loadTheme();

    // Listen for system theme changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        if (themeRef.current === 'system') {
          const newResolved = getSystemTheme();
          setResolvedTheme(newResolved);
          applyTheme('system');
        }
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);

    // Save to chrome.storage.sync
    if (typeof window !== 'undefined' && window.chrome?.storage?.sync) {
      try {
        await window.chrome.storage.sync.set({ [THEME_STORAGE_KEY]: newTheme });
      } catch {
        // Silently fail
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
