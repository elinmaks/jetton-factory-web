
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Settings } from 'lucide-react';
import { useTonConnect } from '@/contexts/TonConnectContext';

const HomeHeader = () => {
  const { wallet } = useTonConnect();
  
  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex justify-between items-center py-4 px-4">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
          <span className="text-lg">🪙</span>
        </div>
        <div className="ml-3">
          <h1 className="text-xl font-bold text-white">TokenForge</h1>
          {wallet && (
            <p className="text-xs text-gray-400">
              {formatWalletAddress(wallet.address)}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button size="icon" variant="ghost" className="rounded-full text-gray-400">
          <Bell size={20} />
        </Button>
        <Button size="icon" variant="ghost" className="rounded-full text-gray-400">
          <Settings size={20} />
        </Button>
      </div>
    </div>
  );
};

export default HomeHeader;
