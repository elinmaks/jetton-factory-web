
import React from 'react';
import { useTelegram } from '@/contexts/TelegramContext';
import useTelegramAuth from '@/hooks/useTelegramAuth';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface TelegramAuthProps {
  className?: string;
}

const TelegramAuth: React.FC<TelegramAuthProps> = ({ className }) => {
  const { isInTelegram } = useTelegram();
  const { isAuthenticated, isLoading, telegramUser } = useTelegramAuth();

  if (!isInTelegram) {
    return (
      <div className={`text-sm text-gray-400 ${className}`}>
        Open in Telegram for full functionality
      </div>
    );
  }

  if (isLoading) {
    return (
      <Button disabled className={className}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (isAuthenticated && telegramUser) {
    return (
      <div className={`flex items-center gap-2 bg-ton-card px-4 py-2 rounded-md text-sm ${className}`}>
        <div className="w-2 h-2 rounded-full bg-ton-success" />
        <span>
          {telegramUser.first_name} {telegramUser.last_name || ''}
        </span>
      </div>
    );
  }

  return (
    <div className={`text-sm text-gray-400 ${className}`}>
      Telegram authentication failed
    </div>
  );
};

export default TelegramAuth;
