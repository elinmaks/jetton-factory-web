
import React, { useEffect } from 'react';
import { useTelegram } from '@/contexts/TelegramContext';
import { telegramMainButton } from '@/utils/telegram';
import HomeHeader from '@/components/HomeHeader';
import BalanceCard from '@/components/BalanceCard';
import ActionButtons from '@/components/ActionButtons';
import Leaderboard from '@/components/Leaderboard';
import BottomNavigation from '@/components/BottomNavigation';

const Index = () => {
  const { isInTelegram } = useTelegram();

  // Setup Telegram Main Button
  useEffect(() => {
    if (isInTelegram) {
      telegramMainButton.setText('Create Token');
      telegramMainButton.onClick(() => {
        window.location.href = '/create-token';
      });
      telegramMainButton.show();
    }

    return () => {
      if (isInTelegram) {
        telegramMainButton.hide();
      }
    };
  }, [isInTelegram]);

  return (
    <div className="telegram-app bg-background dark:bg-background">
      <div className="container flex flex-col min-h-full">
        <HomeHeader />
        
        <div className="py-4 px-4">
          <BalanceCard />
          <ActionButtons />
          <Leaderboard />
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
