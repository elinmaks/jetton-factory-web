
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  initTelegramWebApp, 
  isTelegramWebApp, 
  getTelegramUser,
  telegramBackButton
} from '@/utils/telegram';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramTheme {
  bg_color: string;
  text_color: string;
  hint_color: string;
  link_color: string;
  button_color: string;
  button_text_color: string;
  secondary_bg_color?: string;
}

interface ViewportInfo {
  height: number;
  stableHeight: number;
  isExpanded: boolean;
}

interface TelegramContextType {
  isInTelegram: boolean;
  user: TelegramUser | null;
  isInitialized: boolean;
  isLoading: boolean;
  theme: TelegramTheme | null;
  viewport: ViewportInfo;
  platform: 'android' | 'ios' | 'tdesktop' | 'web' | 'unknown';
}

const TelegramContext = createContext<TelegramContextType>({
  isInTelegram: false,
  user: null,
  isInitialized: false,
  isLoading: true,
  theme: null,
  viewport: { height: 0, stableHeight: 0, isExpanded: false },
  platform: 'unknown'
});

export const useTelegram = () => useContext(TelegramContext);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [theme, setTheme] = useState<TelegramTheme | null>(null);
  const [viewport, setViewport] = useState<ViewportInfo>({
    height: 0,
    stableHeight: 0,
    isExpanded: false
  });
  const [platform, setPlatform] = useState<'android' | 'ios' | 'tdesktop' | 'web' | 'unknown'>('unknown');
  
  const isInTelegram = isTelegramWebApp();

  useEffect(() => {
    const initTelegram = async () => {
      if (isInTelegram) {
        try {
          // Initialize Telegram Web App
          const tg = initTelegramWebApp();
          
          if (!tg) return;
          
          // Get user data
          const telegramUser = getTelegramUser();
          if (telegramUser) {
            setUser(telegramUser);
          }
          
          // Get theme data
          if (tg.themeParams) {
            setTheme(tg.themeParams);
          }
          
          // Get viewport data
          setViewport({
            height: tg.viewportHeight,
            stableHeight: tg.viewportStableHeight,
            isExpanded: tg.isExpanded
          });
          
          // Get platform
          setPlatform(tg.platform || 'unknown');
          
          // Listen for viewport changes
          tg.onEvent('viewportChanged', () => {
            setViewport({
              height: tg.viewportHeight,
              stableHeight: tg.viewportStableHeight,
              isExpanded: tg.isExpanded
            });
          });
          
          // Listen for theme changes
          tg.onEvent('themeChanged', () => {
            if (tg.themeParams) {
              setTheme(tg.themeParams);
            }
          });
          
          setIsInitialized(true);
        } catch (error) {
          console.error('Failed to initialize Telegram Web App:', error);
        }
      } else {
        // Not running in Telegram
        setIsInitialized(true);
      }
      
      setIsLoading(false);
    };

    initTelegram();
    
    // Hide back button on cleanup
    return () => {
      if (isInTelegram) {
        telegramBackButton.hide();
      }
    };
  }, [isInTelegram]);

  return (
    <TelegramContext.Provider 
      value={{ 
        isInTelegram, 
        user, 
        isInitialized, 
        isLoading, 
        theme, 
        viewport,
        platform
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};

export default TelegramContext;
