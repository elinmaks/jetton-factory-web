
import React, { useEffect, useState } from 'react';
import { useTelegram } from '@/contexts/TelegramContext';
import { telegramMainButton, hapticFeedback } from '@/utils/telegram';
import { useNavigate } from 'react-router-dom';
import HomeHeader from '@/components/HomeHeader';
import BalanceCard from '@/components/BalanceCard';
import ActionButtons from '@/components/ActionButtons';
import Leaderboard from '@/components/Leaderboard';
import BottomNavigation from '@/components/BottomNavigation';
import { useTokens } from '@/hooks/useTokens';
import { useTonConnect } from '@/contexts/TonConnectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, TrendingUp, Pickaxe } from 'lucide-react';
import MiningView from '@/components/MiningView';

const Index = () => {
  const navigate = useNavigate();
  const { isInTelegram, isInitialized } = useTelegram();
  const { wallet, connected } = useTonConnect();
  const { tokens: trendingTokens, loading: trendingLoading } = useTokens({ 
    status: 'completed', 
    limit: 5 
  });
  const { tokens: miningTokens, loading: miningLoading } = useTokens({ 
    status: 'mining',
    creator_address: wallet?.address || '',
    enabled: connected && !!wallet?.address
  });

  // Set up Telegram MainButton
  useEffect(() => {
    if (isInTelegram && isInitialized) {
      // Configure main button for token creation
      telegramMainButton.setText('Create Token');
      telegramMainButton.setParams({
        color: '#0098EA',
        text_color: '#FFFFFF'
      });
      telegramMainButton.onClick(() => {
        hapticFeedback.impact('medium');
        navigate('/create-token');
      });
      telegramMainButton.show();
    }

    return () => {
      if (isInTelegram) {
        telegramMainButton.hide();
      }
    };
  }, [isInTelegram, isInitialized, navigate]);

  // Find trending token (most recently completed)
  const trendingToken = trendingTokens && trendingTokens.length > 0 ? trendingTokens[0] : null;

  return (
    <div className="telegram-app bg-background dark:bg-background">
      <div className="container flex flex-col min-h-full pb-16">
        <HomeHeader />
        
        <div className="py-4 px-4">
          <BalanceCard />
          
          {/* Display Active Mining Tokens */}
          {!miningLoading && miningTokens && miningTokens.length > 0 && (
            <div className="mt-6">
              {miningTokens.map(token => (
                <MiningView 
                  key={token.id}
                  tokenId={token.id}
                  tokenName={token.name}
                  tokenSymbol={token.symbol}
                />
              ))}
            </div>
          )}
          
          {/* Display trending token if available */}
          {!trendingLoading && trendingToken && (
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
                  onClick={(e) => {
                    e.preventDefault();
                    hapticFeedback.impact('light');
                    navigate(`/token/${trendingToken.id}`);
                  }}
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
