
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronsUp, Wallet as WalletIcon, ArrowRightLeft, Send, Shield } from 'lucide-react';
import { useTelegram } from '@/contexts/TelegramContext';
import { useTonConnect } from '@/contexts/TonConnectContext';
import { telegramBackButton } from '@/utils/telegram';
import BottomNavigation from '@/components/BottomNavigation';
import { Token } from '@/hooks/useTokens';

const Wallet = () => {
  const navigate = useNavigate();
  const { isInTelegram } = useTelegram();
  const { connected, wallet } = useTonConnect();
  const [userTokens, setUserTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Setup Telegram Back Button
  useEffect(() => {
    if (isInTelegram) {
      telegramBackButton.show();
      telegramBackButton.onClick(() => {
        navigate('/');
      });
    }

    return () => {
      if (isInTelegram) {
        telegramBackButton.hide();
      }
    };
  }, [isInTelegram, navigate]);

  // Fetch user's tokens
  useEffect(() => {
    const fetchUserTokens = async () => {
      if (!wallet?.address) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('tokens')
          .select('*')
          .eq('creator_address', wallet.address);
        
        if (error) throw error;
        setUserTokens(data as Token[]);
      } catch (error) {
        console.error('Error fetching user tokens:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTokens();
  }, [wallet?.address]);

  // Mock balance for demonstration
  const balance = {
    ton: 14.5,
    usd: 35.62,
  };

  return (
    <div className="telegram-app bg-ton-background dark:bg-ton-background">
      <div className="container pb-16 pt-4 px-4 flex flex-col min-h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <WalletIcon className="h-6 w-6 mr-2 text-ton-blue" />
            Wallet
          </h1>
          {wallet && (
            <div className="text-sm text-gray-400 font-mono">
              {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
            </div>
          )}
        </div>

        {/* TON Balance Card */}
        <Card className="bg-ton-card border-none shadow-lg mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-xl">TON Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{balance.ton.toFixed(2)} TON</p>
                <p className="text-sm text-gray-400">≈ ${balance.usd.toFixed(2)}</p>
              </div>
              <WalletIcon className="h-12 w-12 text-ton-blue opacity-50" />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button className="token-gradient rounded-lg">
                <ChevronsUp className="h-4 w-4 mr-2" />
                Deposit
              </Button>
              <Button variant="outline" className="border-gray-700 rounded-lg">
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User's Tokens */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-white mb-3">Your Tokens</h2>
          
          {isLoading ? (
            <div className="text-center py-8 text-gray-400">Loading tokens...</div>
          ) : userTokens.length > 0 ? (
            <div className="space-y-3">
              {userTokens.map((token) => (
                <Card key={token.id} className="bg-ton-card border-none shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-ton-blue/20 flex items-center justify-center mr-3">
                          <span className="text-lg text-white">{token.symbol.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{token.name}</h3>
                          <p className="text-xs text-gray-400">${token.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-white">{Number(token.supply).toLocaleString()}</p>
                        <p className="text-xs text-gray-400">Supply</p>
                      </div>
                    </div>
                    
                    {token.status === 'mining' && (
                      <div className="mt-2">
                        <Button 
                          size="sm" 
                          className="w-full bg-ton-blue/20 hover:bg-ton-blue/30 text-ton-blue"
                          onClick={() => navigate(`/token/${token.id}`)}
                        >
                          Continue Mining
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-ton-card border-none shadow-lg">
              <CardContent className="p-6 text-center">
                <p className="text-gray-400 mb-4">You haven't created any tokens yet</p>
                <Button 
                  onClick={() => navigate('/create-token')}
                  className="token-gradient"
                >
                  Create Token
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Security and Settings */}
        <Card className="bg-ton-card border-none shadow-lg mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Security & Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-gray-300">
                <Shield className="h-4 w-4 mr-3 text-ton-blue" />
                Security Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300">
                <ArrowRightLeft className="h-4 w-4 mr-3 text-ton-blue" />
                Transaction History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Wallet;
