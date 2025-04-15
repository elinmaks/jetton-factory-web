
// Telegram Web App integration utility
// Documentation: https://core.telegram.org/bots/webapps

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          query_id: string;
          user: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          auth_date: string;
          hash: string;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        sendData: (data: string) => void;
        openLink: (url: string) => void;
        onEvent: (eventType: string, eventHandler: Function) => void;
        offEvent: (eventType: string, eventHandler: Function) => void;
        requestFullscreen: () => void;
        setHeaderColor: (color: "bg_color" | "secondary_bg_color" | string) => void;
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: Function) => void;
          offClick: (callback: Function) => void;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText: (text: string) => void;
          onClick: (callback: Function) => void;
          offClick: (callback: Function) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive: boolean) => void;
          hideProgress: () => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color: string;
          text_color: string;
          hint_color: string;
          link_color: string;
          button_color: string;
          button_text_color: string;
        };
      };
    };
  }
}

// Check if running in Telegram WebApp
export const isTelegramWebApp = (): boolean => {
  return typeof window !== 'undefined' && window.Telegram?.WebApp !== undefined;
};

// Get user data from Telegram WebApp
export const getTelegramUser = () => {
  if (!isTelegramWebApp()) {
    return null;
  }
  
  return window.Telegram.WebApp.initDataUnsafe.user;
};

// Initialize Telegram WebApp
export const initTelegramWebApp = () => {
  if (!isTelegramWebApp()) {
    console.warn('Telegram WebApp is not available');
    return;
  }
  
  // Tell Telegram WebApp we're ready
  window.Telegram.WebApp.ready();
  
  // Request fullscreen mode (Bot API 8.0+)
  try {
    if (window.Telegram.WebApp.requestFullscreen) {
      window.Telegram.WebApp.requestFullscreen();
    }
  } catch (e) {
    console.warn('Failed to request fullscreen mode:', e);
  }
  
  // Set header color to match app theme
  try {
    if (window.Telegram.WebApp.setHeaderColor) {
      // Use the background color from the theme or set a specific color
      window.Telegram.WebApp.setHeaderColor('#000000');
    }
  } catch (e) {
    console.warn('Failed to set header color:', e);
  }
  
  // Expand the WebApp to take the whole screen if fullscreen is not supported
  if (!window.Telegram.WebApp.isExpanded) {
    window.Telegram.WebApp.expand();
  }
  
  // Apply Telegram theme colors to CSS variables
  if (window.Telegram.WebApp.themeParams) {
    const { 
      bg_color, 
      text_color, 
      hint_color, 
      link_color, 
      button_color, 
      button_text_color 
    } = window.Telegram.WebApp.themeParams;
    
    document.documentElement.style.setProperty('--tg-bg-color', bg_color);
    document.documentElement.style.setProperty('--tg-text-color', text_color);
    document.documentElement.style.setProperty('--tg-hint-color', hint_color);
    document.documentElement.style.setProperty('--tg-link-color', link_color);
    document.documentElement.style.setProperty('--tg-button-color', button_color);
    document.documentElement.style.setProperty('--tg-button-text-color', button_text_color);
  }
  
  return window.Telegram.WebApp;
};

// Use Telegram haptic feedback
export const hapticFeedback = {
  impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
    }
  },
  notification: (type: 'error' | 'success' | 'warning') => {
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
    }
  },
  selectionChanged: () => {
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.HapticFeedback.selectionChanged();
    }
  }
};

// Handle Telegram main button
export const telegramMainButton = {
  setText: (text: string) => {
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.MainButton.setText(text);
    }
  },
  show: () => {
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.MainButton.show();
    }
  },
  hide: () => {
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.MainButton.hide();
    }
  },
  onClick: (callback: Function) => {
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.MainButton.onClick(callback);
    }
  },
  offClick: (callback: Function) => {
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.MainButton.offClick(callback);
    }
  },
  showProgress: () => {
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.MainButton.showProgress(true);
    }
  },
  hideProgress: () => {
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.MainButton.hideProgress();
    }
  }
};

// Handle Telegram back button
export const telegramBackButton = {
  show: () => {
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.BackButton.show();
    }
  },
  hide: () => {
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.BackButton.hide();
    }
  },
  onClick: (callback: Function) => {
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.BackButton.onClick(callback);
    }
  }
};

export default {
  initTelegramWebApp,
  isTelegramWebApp,
  getTelegramUser,
  hapticFeedback,
  telegramMainButton,
  telegramBackButton
};
