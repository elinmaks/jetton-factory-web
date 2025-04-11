
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Wallet } from 'lucide-react';
import { useTonConnect } from '@/contexts/TonConnectContext';
import { cn } from '@/lib/utils';

interface ConnectWalletProps {
  className?: string;
}

const ConnectWallet = ({ className }: ConnectWalletProps) => {
  const { connected, connecting, wallet, connectWallet, disconnectWallet } = useTonConnect();

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {!connected ? (
        <Button 
          onClick={connectWallet} 
          disabled={connecting}
          className="token-gradient disabled:opacity-70"
        >
          {connecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </>
          )}
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 bg-ton-card px-4 py-2 rounded-md text-sm">
            <div className="w-2 h-2 rounded-full bg-ton-success" />
            <span className="font-mono text-xs md:text-sm truncate max-w-[150px] md:max-w-[200px]">
              {wallet?.address.slice(0, 6)}...{wallet?.address.slice(-4)}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={disconnectWallet}
            className="text-xs"
          >
            Disconnect
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
