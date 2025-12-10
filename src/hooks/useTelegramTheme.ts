import { useState, useEffect } from 'react';

export interface TelegramTheme {
  bg_color: string;
  secondary_bg_color: string;
  text_color: string;
  hint_color: string;
  link_color: string;
  button_color: string;
  button_text_color: string;
}

const defaultThemeParams: TelegramTheme = {
  bg_color: '#000000',
  secondary_bg_color: '#1C1C1E',
  text_color: '#FFFFFF',
  hint_color: '#9E9E9E',
  link_color: '#007AFF',
  button_color: '#007AFF',
  button_text_color: '#FFFFFF',
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        themeParams: TelegramTheme;
        setBackgroundColor: (color: string) => void;
        setHeaderColor: (color: string) => void;
        onEvent: (event: string, callback: () => void) => void;
        offEvent: (event: string, callback: () => void) => void;
        enableVerticalSwipes?: () => void;
        disableVerticalSwipes?: () => void;
        HapticFeedback?: {
          impactOccurred: (style: string) => void;
          notificationOccurred: (type: string) => void;
        };
      };
    };
  }
}

export function useTelegramTheme() {
  const [theme, setTheme] = useState<TelegramTheme>(defaultThemeParams);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const WebApp = window.Telegram.WebApp;
      
      WebApp.ready();
      setTheme(WebApp.themeParams);
      WebApp.setBackgroundColor(WebApp.themeParams.bg_color);
      WebApp.setHeaderColor(WebApp.themeParams.secondary_bg_color || WebApp.themeParams.bg_color);

      const handleThemeChange = () => {
        setTheme(WebApp.themeParams);
        WebApp.setBackgroundColor(WebApp.themeParams.bg_color);
        WebApp.setHeaderColor(WebApp.themeParams.secondary_bg_color || WebApp.themeParams.bg_color);
      };

      WebApp.onEvent('themeChanged', handleThemeChange);
      return () => WebApp.offEvent('themeChanged', handleThemeChange);
    }
  }, []);

  return theme;
}

export function triggerHaptic(type: 'light' | 'success') {
  if (window.Telegram?.WebApp?.HapticFeedback) {
    if (type === 'light') {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    } else {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
  } else if (window.navigator?.vibrate) {
    window.navigator.vibrate(50);
  }
}

export function disableWebViewSwipes() {
  window.Telegram?.WebApp?.disableVerticalSwipes?.();
}

export function enableWebViewSwipes() {
  window.Telegram?.WebApp?.enableVerticalSwipes?.();
}
