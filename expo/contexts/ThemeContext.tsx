import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { LightColors, DarkColors, THEME_BACKGROUNDS, type ThemeColors, type AppThemeName } from '@/constants/colors';

const THEME_KEY = 'sakura_theme_mode';
const APP_THEME_KEY = 'sakura_app_theme';

const VALID_THEMES: AppThemeName[] = ['ocean', 'sunset', 'neon', 'green'];

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const [isDark, setIsDark] = useState(false);
  const [appTheme, setAppTheme] = useState<AppThemeName>('ocean');

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(THEME_KEY),
      AsyncStorage.getItem(APP_THEME_KEY),
    ]).then(([darkVal, themeVal]) => {
      if (darkVal === 'dark') setIsDark(true);
      if (themeVal && VALID_THEMES.includes(themeVal as AppThemeName)) {
        setAppTheme(themeVal as AppThemeName);
      } else {
        setAppTheme('ocean');
        AsyncStorage.setItem(APP_THEME_KEY, 'ocean').catch(() => {});
      }
    }).catch(() => {});
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      AsyncStorage.setItem(THEME_KEY, next ? 'dark' : 'light').catch(() => {});
      return next;
    });
  }, []);

  const changeAppTheme = useCallback((theme: AppThemeName) => {
    setAppTheme(theme);
    AsyncStorage.setItem(APP_THEME_KEY, theme).catch(() => {});
  }, []);

  const baseColors: ThemeColors = isDark ? DarkColors : LightColors;
  const themeBg = THEME_BACKGROUNDS[appTheme];
  const bgOverride = isDark ? themeBg.dark : themeBg.light;
  const colors: ThemeColors = {
    ...baseColors,
    ...bgOverride,
  };

  return {
    isDark,
    colors,
    toggleTheme,
    appTheme,
    changeAppTheme,
  };
});
