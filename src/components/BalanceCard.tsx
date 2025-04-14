
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { useTonConnect } from '@/contexts/TonConnectContext';

const BalanceCard = () => {
  const { connected, connectWallet } = useTonConnect();
  
  // Mock balance data
  const balance = {
    ton: 14.5,
    usd: 35.62,
  };

  return (
    <Card className="bg-card border-none shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-lg text-gray-400">Your Balance</p>
            {connected ? (
              <>
                <h3 className="text-3xl font-bold mt-1 bg-gradient-to-r from-ton-blue to-ton-lightBlue bg-clip-text text-transparent">
                  {balance.ton.toFixed(2)} TON
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  ≈ ${balance.usd.toFixed(2)}
                </p>
              </>
            ) : (
              <div className="mt-2">
                <Button 
                  onClick={connectWallet} 
                  variant="outline" 
                  className="border-ton-blue text-ton-blue"
                >
                  Connect Wallet
                </Button>
              </div>
            )}
          </div>
          
          {connected && (
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full h-10 w-10 bg-muted text-white"
            >
              <ArrowUpRight size={20} />
            </Button>
          )}
        </div>
        
        {connected && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button className="token-gradient rounded-full h-12 text-base">
              Deposit
            </Button>
            <Button variant="outline" className="rounded-full h-12 text-base border-gray-700">
              Withdraw
            </Button>
          </div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
              🔥
            </div>
            <div>
              <p className="text-white font-medium">Daily Check-in</p>
              <p className="text-xs text-gray-400">Collect your daily bonus</p>
            </div>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            className="rounded-full text-ton-blue"
          >
            Collect <ChevronRight size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
