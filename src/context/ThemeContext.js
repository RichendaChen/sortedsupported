import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'theme_preference';
const TEXT_SCALE_STORAGE_KEY = 'text_scale_preference';
const MIN_TEXT_SCALE = 0.8;
const MAX_TEXT_SCALE = 1.5;

const clampTextScale = (value) =>
  Math.min(MAX_TEXT_SCALE, Math.max(MIN_TEXT_SCALE, Number(value.toFixed(2))));

const themes = {
  light: {
    mode: 'light',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    primary: '#5B6FA8',
    text: '#333333',
    subtext: '#999999',
    border: '#E0E0E0',
    danger: '#FF6B9D',
    warning: '#FFD93D',
  },
  dark: {
    mode: 'dark',
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#8FA0D8',
    text: '#E0E0E0',
    subtext: '#A0A0A0',
    border: '#333333',
    danger: '#FF82AE',
    warning: '#F8D74A',
  },
};

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState(null);
  const [textScale, setTextScaleState] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const loadPreference = async () => {
      try {
        const [storedTheme, storedScale] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(TEXT_SCALE_STORAGE_KEY),
        ]);

        const parsedScale = Number.parseFloat(storedScale || '');

        if (isMounted && (storedTheme === 'light' || storedTheme === 'dark')) {
          setPreference(storedTheme);
        }

        if (isMounted && Number.isFinite(parsedScale)) {
          setTextScaleState(clampTextScale(parsedScale));
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };

    loadPreference();

    return () => {
      isMounted = false;
    };
  }, []);

  const mode = preference || (systemScheme === 'dark' ? 'dark' : 'light');

  const toggleTheme = async () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setPreference(next);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const setTextScale = async (nextScale) => {
    const normalizedScale = clampTextScale(Number(nextScale) || 1);
    setTextScaleState(normalizedScale);

    try {
      await AsyncStorage.setItem(TEXT_SCALE_STORAGE_KEY, String(normalizedScale));
    } catch (error) {
      console.error('Error saving text scale preference:', error);
    }
  };

  const increaseTextScale = () => setTextScale(textScale + 0.1);
  const decreaseTextScale = () => setTextScale(textScale - 0.1);

  const value = useMemo(
    () => ({
      theme: themes[mode],
      isDark: mode === 'dark',
      preference,
      textScale,
      toggleTheme,
      setTextScale,
      increaseTextScale,
      decreaseTextScale,
    }),
    [mode, preference, textScale]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};
