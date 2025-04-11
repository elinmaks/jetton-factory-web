
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  initTelegramWebApp, 
  isTelegramWebApp, 
  getTelegramUser
} from '@/utils/telegram';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramContextType {
  isInTelegram: boolean;
  user: TelegramUser | null;
  isInitialized: boolean;
  isLoading: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  isInTelegram: false,
  user: null,
  isInitialized: false,
  isLoading: true
});

export const useTelegram = () => useContext(TelegramContext);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const isInTelegram = isTelegramWebApp();

  useEffect(() => {
    const initTelegram = async () => {
      if (isInTelegram) {
        try {
          // Initialize Telegram Web App
          initTelegramWebApp();
          
          // Get user data
          const telegramUser = getTelegramUser();
          if (telegramUser) {
            setUser(telegramUser);
            
            // Here you can call your backend to register/authenticate the Telegram user
            // Example:
            // await registerTelegramUser(telegramUser);
          }
          
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
  }, [isInTelegram]);

  return (
    <TelegramContext.Provider value={{ isInTelegram, user, isInitialized, isLoading }}>
      {children}
    </TelegramContext.Provider>
  );
};

export default TelegramContext;
