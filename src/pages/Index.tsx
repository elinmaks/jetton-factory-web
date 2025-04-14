
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTonConnect } from '@/contexts/TonConnectContext';
import { useTelegram } from '@/contexts/TelegramContext';
import { Loader2, LayoutGrid, LineChart, Sparkles } from 'lucide-react';
import MarketCard from '@/components/MarketCard';
import TokenLeaderboard from '@/components/TokenLeaderboard';
import NFTCollections from '@/components/NFTCollections';
import TelegramAuth from '@/components/TelegramAuth';
import { hapticFeedback, telegramMainButton } from '@/utils/telegram';

const Index = () => {
  const { connected, connecting, connectWallet } = useTonConnect();
  const { isInTelegram } = useTelegram();
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [amount, setAmount] = useState('');

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

  const handleBuyClick = () => {
    if (isInTelegram) {
      hapticFeedback.impact('medium');
    }
    setBuyDialogOpen(true);
  };

  const handleSellClick = () => {
    if (isInTelegram) {
      hapticFeedback.impact('medium');
    }
    setSellDialogOpen(true);
  };

  const handleConfirmBuy = () => {
    // This would be where you handle the buy transaction
    // Just a mock for now
    if (isInTelegram) {
      hapticFeedback.notification('success');
    }
    setTimeout(() => {
      setBuyDialogOpen(false);
      setAmount('');
    }, 1000);
  };

  const handleConfirmSell = () => {
    // This would be where you handle the sell transaction
    // Just a mock for now
    if (isInTelegram) {
      hapticFeedback.notification('success');
    }
    setTimeout(() => {
      setSellDialogOpen(false);
      setAmount('');
    }, 1000);
  };

  return (
    <div className="telegram-app bg-ton-background dark:bg-ton-background">
      <div className="container py-8 px-6 flex flex-col items-center min-h-full">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-ton-blue to-ton-lightBlue bg-clip-text text-transparent">
            TokenForge
          </h1>
          <p className="text-gray-300 mt-3 text-lg">
            The Ultimate TON Token Platform
          </p>
        </div>

        <Tabs defaultValue="featured" className="w-full max-w-4xl mb-10">
          <TabsList className="grid grid-cols-3 mb-6 p-1.5">
            <TabsTrigger value="featured" className="data-[state=active]:bg-ton-blue data-[state=active]:text-white text-base py-3">
              <Sparkles className="mr-2 h-5 w-5" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-ton-blue data-[state=active]:text-white text-base py-3">
              <LineChart className="mr-2 h-5 w-5" />
              Market
            </TabsTrigger>
            <TabsTrigger value="nft" className="data-[state=active]:bg-ton-blue data-[state=active]:text-white text-base py-3">
              <LayoutGrid className="mr-2 h-5 w-5" />
              NFTs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured" className="mt-0">
            <div className="flex flex-col items-center">
              <MarketCard 
                onBuyClick={handleBuyClick}
                onSellClick={handleSellClick}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="market" className="mt-0">
            <div className="bg-ton-card rounded-lg p-6 shadow-lg border border-ton-blue/20">
              <h3 className="text-2xl font-bold text-white mb-6">
                Trending Tokens
              </h3>
              <TokenLeaderboard />
            </div>
          </TabsContent>
          
          <TabsContent value="nft" className="mt-0">
            <div className="bg-ton-card rounded-lg p-6 shadow-lg border border-ton-blue/20">
              <h3 className="text-2xl font-bold text-white mb-6">
                Popular Collections
              </h3>
              <NFTCollections />
            </div>
          </TabsContent>
        </Tabs>

        <footer className="mt-10 text-center text-gray-400 text-base">
          {isInTelegram ? (
            <TelegramAuth className="mx-auto" />
          ) : (
            <p>
              {!connected ? (
                <Button 
                  variant="link" 
                  className="text-ton-blue text-lg" 
                  onClick={connectWallet}
                >
                  {connecting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
          )}
        </footer>

        {/* Buy Dialog */}
        <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
          <DialogContent className="bg-ton-card text-white">
            <DialogHeader>
              <DialogTitle className="text-xl">Buy ZAZA Token</DialogTitle>
              <DialogDescription className="text-gray-400">
                Enter the amount of tokens you want to buy
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-ton-background border-ton-blue/20 h-12 text-lg"
                />
                <span className="font-mono text-lg text-gray-300">ZAZA</span>
              </div>
              <div className="text-base text-gray-400">
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
              <DialogTitle className="text-xl">Sell ZAZA Token</DialogTitle>
              <DialogDescription className="text-gray-400">
                Enter the amount of tokens you want to sell
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-ton-background border-ton-blue/20 h-12 text-lg"
                />
                <span className="font-mono text-lg text-gray-300">ZAZA</span>
              </div>
              <div className="text-base text-gray-400">
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
