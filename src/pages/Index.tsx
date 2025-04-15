
import React, { useEffect } from 'react';
import { useTelegram } from '@/contexts/TelegramContext';
import { telegramMainButton } from '@/utils/telegram';
import HomeHeader from '@/components/HomeHeader';
import BalanceCard from '@/components/BalanceCard';
import ActionButtons from '@/components/ActionButtons';
import Leaderboard from '@/components/Leaderboard';
import BottomNavigation from '@/components/BottomNavigation';
import { useTokens } from '@/hooks/useTokens';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, TrendingUp } from 'lucide-react';

const Index = () => {
  const { isInTelegram } = useTelegram();
  const { tokens, loading } = useTokens({ status: 'completed', limit: 5 });

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

  // Find trending token (most recently completed)
  const trendingToken = tokens && tokens.length > 0 ? tokens[0] : null;

  return (
    <div className="telegram-app bg-background dark:bg-background">
      <div className="container flex flex-col min-h-full pb-16">
        <HomeHeader />
        
        <div className="py-4 px-4">
          <BalanceCard />
          
          {/* Display trending token if available */}
          {trendingToken && (
            <Card className="bg-ton-card border-none shadow-lg mt-6 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-ton-blue" />
                  Trending Token
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-ton-blue/20 flex items-center justify-center mr-3">
                    <span className="text-xl text-white">{trendingToken.symbol.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{trendingToken.name}</h3>
                    <p className="text-sm text-gray-400">${trendingToken.symbol}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-lg font-medium text-white">
                      {trendingToken.price ? `${trendingToken.price.toFixed(4)} TON` : 'Not Listed'}
                    </p>
                    <p className="text-xs text-green-500">+0.00%</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-ton-blue/10 rounded-md p-2">
                    <p className="text-xs text-gray-400">Supply</p>
                    <p className="text-sm text-white">{parseInt(trendingToken.supply).toLocaleString()}</p>
                  </div>
                  <div className="bg-ton-blue/10 rounded-md p-2">
                    <p className="text-xs text-gray-400">Created</p>
                    <p className="text-sm text-white">{new Date(trendingToken.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <a 
                  href={`/token/${trendingToken.id}`} 
                  className="block mt-4 text-center text-sm text-ton-blue"
                >
                  View Details
                </a>
              </CardContent>
            </Card>
          )}
          
          <ActionButtons />
          
          <div className="mt-6">
            <div className="flex items-center mb-4">
              <Trophy className="h-5 w-5 mr-2 text-ton-blue" />
              <h2 className="text-lg font-bold text-white">Token Leaderboard</h2>
            </div>
            <Leaderboard />
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
