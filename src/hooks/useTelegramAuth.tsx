
import { useState, useEffect } from 'react';
import { useTelegram } from '@/contexts/TelegramContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useTelegramAuth = () => {
  const { user: telegramUser, isInTelegram, isInitialized } = useTelegram();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const authenticateTelegramUser = async () => {
      if (!isInitialized || !isInTelegram || !telegramUser) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Call the Supabase function to authenticate the Telegram user
        const { data, error } = await supabase.rpc('handle_telegram_auth', {
          telegram_id: telegramUser.id,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name || null
        });

        if (error) {
          console.error('Error authenticating Telegram user:', error);
          toast.error('Failed to authenticate with Telegram');
        } else {
          setIsAuthenticated(true);
          setUserId(data);
          console.log('Authentication successful, user ID:', data);
          toast.success('Authenticated with Telegram');
        }
      } catch (error) {
        console.error('Error in Telegram authentication:', error);
        toast.error('Error during authentication');
      } finally {
        setIsLoading(false);
      }
    };

    authenticateTelegramUser();
  }, [telegramUser, isInTelegram, isInitialized]);

  return {
    isAuthenticated,
    isLoading,
    userId,
    telegramUser
  };
};

export default useTelegramAuth;
