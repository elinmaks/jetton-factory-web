
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
        CloudStorage?: {
          getItem: (key: string, callback: (value: string) => void) => void;
          setItem: (key: string, value: string) => void;
          removeItem: (key: string) => void;
        };
        showPopup: (params: {
          title?: string;
          message: string;
          buttons?: Array<{
            id: string;
            type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
            text: string;
          }>;
        }, callback?: (buttonId: string) => void) => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        showScanQrPopup: (params?: {
          text?: string;
        }, callback?: (text: string) => void) => void;
        closeScanQrPopup: () => void;
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
          setParams: (params: {
            text?: string;
            color?: string;
            text_color?: string;
            is_active?: boolean;
            is_visible?: boolean;
          }) => void;
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
          secondary_bg_color?: string;
        };
        platform: 'android' | 'ios' | 'tdesktop' | 'web';
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

// Initialize Telegram WebApp with all native features
export const initTelegramWebApp = () => {
  if (!isTelegramWebApp()) {
    console.warn('Telegram WebApp is not available');
    return null;
  }
  
  const tg = window.Telegram.WebApp;
  
  // Tell Telegram WebApp we're ready
  tg.ready();
  
  // Request fullscreen mode (Bot API 8.0+)
  try {
    tg.requestFullscreen();
  } catch (e) {
    console.warn('Failed to request fullscreen mode:', e);
    // Fall back to expand if fullscreen is not supported
    if (!tg.isExpanded) {
      tg.expand();
    }
  }
  
  // Set header color to match app theme
  try {
    // Use the background color from the theme or set a specific color
    tg.setHeaderColor('bg_color');
  } catch (e) {
    console.warn('Failed to set header color:', e);
  }
  
  // Apply Telegram theme colors to CSS variables
  if (tg.themeParams) {
    const { 
      bg_color, 
      text_color, 
      hint_color, 
      link_color, 
      button_color, 
      button_text_color,
      secondary_bg_color
    } = tg.themeParams;
    
    document.documentElement.style.setProperty('--tg-bg-color', bg_color);
    document.documentElement.style.setProperty('--tg-text-color', text_color);
    document.documentElement.style.setProperty('--tg-hint-color', hint_color);
    document.documentElement.style.setProperty('--tg-link-color', link_color);
    document.documentElement.style.setProperty('--tg-button-color', button_color);
    document.documentElement.style.setProperty('--tg-button-text-color', button_text_color);
    document.documentElement.style.setProperty('--tg-secondary-bg-color', secondary_bg_color || bg_color);
  }
  
  // Listen for viewport changes
  tg.onEvent('viewportChanged', () => {
    document.documentElement.style.setProperty('--tg-viewport-height', `${tg.viewportHeight}px`);
    document.documentElement.style.setProperty('--tg-viewport-stable-height', `${tg.viewportStableHeight}px`);
  });
  
  // Initial viewport sizes
  document.documentElement.style.setProperty('--tg-viewport-height', `${tg.viewportHeight}px`);
  document.documentElement.style.setProperty('--tg-viewport-stable-height', `${tg.viewportStableHeight}px`);
  
  return tg;
};

// Show native Telegram popup
export const showPopup = (title: string, message: string, buttons: Array<{
  id: string;
  type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
  text: string;
}> = []) => {
  if (!isTelegramWebApp()) {
    // Fallback for non-Telegram environment
    alert(`${title}\n${message}`);
    return Promise.resolve('ok');
  }
  
  return new Promise<string>((resolve) => {
    window.Telegram.WebApp.showPopup(
      {
        title,
        message,
        buttons: buttons.length ? buttons : [{ id: 'ok', type: 'ok', text: 'OK' }]
      },
      (buttonId) => {
        resolve(buttonId);
      }
    );
  });
};

// Show native Telegram alert
export const showAlert = (message: string): Promise<void> => {
  if (!isTelegramWebApp()) {
    alert(message);
    return Promise.resolve();
  }
  
  return new Promise<void>((resolve) => {
    window.Telegram.WebApp.showAlert(message, () => {
      resolve();
    });
  });
};

// Show native Telegram confirm dialog
export const showConfirm = (message: string): Promise<boolean> => {
  if (!isTelegramWebApp()) {
    return Promise.resolve(window.confirm(message));
  }
  
  return new Promise<boolean>((resolve) => {
    window.Telegram.WebApp.showConfirm(message, (confirmed) => {
      resolve(confirmed);
    });
  });
};

// Use Telegram haptic feedback
export const hapticFeedback = {
  impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
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
  setParams: (params: {
    text?: string;
    color?: string;
    text_color?: string;
    is_active?: boolean;
    is_visible?: boolean;
  }) => {
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.MainButton.setParams(params);
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
  enable: () => {
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.MainButton.enable();
    }
  },
  disable: () => {
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.MainButton.disable();
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
  showProgress: (leaveActive: boolean = true) => {
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.MainButton.showProgress(leaveActive);
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
  },
  offClick: (callback: Function) => {
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.BackButton.offClick(callback);
    }
  }
};

// Telegram CloudStorage functionality
export const cloudStorage = {
  getItem: (key: string): Promise<string | null> => {
    if (!isTelegramWebApp() || !window.Telegram.WebApp.CloudStorage) {
      // Return from localStorage as fallback
      return Promise.resolve(localStorage.getItem(key));
    }
    
    return new Promise((resolve) => {
      window.Telegram.WebApp.CloudStorage?.getItem(key, (value) => {
        resolve(value || null);
      });
    });
  },
  setItem: (key: string, value: string): Promise<void> => {
    if (!isTelegramWebApp() || !window.Telegram.WebApp.CloudStorage) {
      // Use localStorage as fallback
      localStorage.setItem(key, value);
      return Promise.resolve();
    }
    
    window.Telegram.WebApp.CloudStorage?.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string): Promise<void> => {
    if (!isTelegramWebApp() || !window.Telegram.WebApp.CloudStorage) {
      // Use localStorage as fallback
      localStorage.removeItem(key);
      return Promise.resolve();
    }
    
    window.Telegram.WebApp.CloudStorage?.removeItem(key);
    return Promise.resolve();
  }
};

// Get platform info
export const getPlatform = (): 'android' | 'ios' | 'tdesktop' | 'web' | 'unknown' => {
  if (!isTelegramWebApp()) {
    return 'unknown';
  }
  
  return window.Telegram.WebApp.platform;
};

export default {
  initTelegramWebApp,
  isTelegramWebApp,
  getTelegramUser,
  hapticFeedback,
  telegramMainButton,
  telegramBackButton,
  showPopup,
  showAlert,
  showConfirm,
  cloudStorage,
  getPlatform
};
