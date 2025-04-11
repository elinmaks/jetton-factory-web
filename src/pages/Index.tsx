
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MarketCard from '@/components/MarketCard';
import { useTonConnect } from '@/contexts/TonConnectContext';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { connected, connecting, connectWallet } = useTonConnect();
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [amount, setAmount] = useState('');

  const handleBuyClick = () => {
    setBuyDialogOpen(true);
  };

  const handleSellClick = () => {
    setSellDialogOpen(true);
  };

  const handleConfirmBuy = () => {
    // This would be where you handle the buy transaction
    // Just a mock for now
    setTimeout(() => {
      setBuyDialogOpen(false);
      setAmount('');
    }, 1000);
  };

  const handleConfirmSell = () => {
    // This would be where you handle the sell transaction
    // Just a mock for now
    setTimeout(() => {
      setSellDialogOpen(false);
      setAmount('');
    }, 1000);
  };

  return (
    <div className="telegram-app bg-ton-background dark:bg-ton-background">
      <div className="container py-6 px-4 flex flex-col items-center min-h-full">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-ton-blue to-ton-lightBlue bg-clip-text text-transparent">
            TokenForge
          </h1>
          <p className="text-gray-300 mt-2">
            Top trending token of the day
          </p>
        </div>

        <MarketCard 
          onBuyClick={handleBuyClick}
          onSellClick={handleSellClick}
        />

        <footer className="mt-8 text-center text-gray-400 text-sm">
          <p>
            {!connected ? (
              <Button 
                variant="link" 
                className="text-ton-blue" 
                onClick={connectWallet}
              >
                {connecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect your wallet"
                )}
              </Button>
            ) : (
              "Wallet connected"
            )}
            {' '}to create your token or start mining
          </p>
        </footer>

        {/* Buy Dialog */}
        <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
          <DialogContent className="bg-ton-card text-white">
            <DialogHeader>
              <DialogTitle>Buy ZAZA Token</DialogTitle>
              <DialogDescription className="text-gray-400">
                Enter the amount of tokens you want to buy
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-ton-background border-ton-blue/20"
                />
                <span className="font-mono text-gray-300">ZAZA</span>
              </div>
              <div className="text-sm text-gray-400">
                Price: {amount ? (Number(amount) * 0.0021).toFixed(4) : '0.0000'} TON
              </div>
              <Button 
                onClick={handleConfirmBuy} 
                className="w-full bg-ton-success hover:bg-ton-success/90"
              >
                Confirm Purchase
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Sell Dialog */}
        <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
          <DialogContent className="bg-ton-card text-white">
            <DialogHeader>
              <DialogTitle>Sell ZAZA Token</DialogTitle>
              <DialogDescription className="text-gray-400">
                Enter the amount of tokens you want to sell
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-ton-background border-ton-blue/20"
                />
                <span className="font-mono text-gray-300">ZAZA</span>
              </div>
              <div className="text-sm text-gray-400">
                Value: {amount ? (Number(amount) * 0.0021).toFixed(4) : '0.0000'} TON
              </div>
              <Button 
                onClick={handleConfirmSell} 
                className="w-full border-ton-error text-ton-error bg-transparent hover:bg-ton-error/10"
              >
                Confirm Sale
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
