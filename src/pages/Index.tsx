
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTonConnect } from '@/contexts/TonConnectContext';
import { Loader2, LayoutGrid, LineChart, Sparkles } from 'lucide-react';
import MarketCard from '@/components/MarketCard';
import TokenLeaderboard from '@/components/TokenLeaderboard';
import NFTCollections from '@/components/NFTCollections';

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
            The Ultimate TON Token Platform
          </p>
        </div>

        <Tabs defaultValue="featured" className="w-full max-w-4xl mb-8">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="featured" className="data-[state=active]:bg-ton-blue data-[state=active]:text-white">
              <Sparkles className="mr-2 h-4 w-4" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-ton-blue data-[state=active]:text-white">
              <LineChart className="mr-2 h-4 w-4" />
              Market
            </TabsTrigger>
            <TabsTrigger value="nft" className="data-[state=active]:bg-ton-blue data-[state=active]:text-white">
              <LayoutGrid className="mr-2 h-4 w-4" />
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
            <div className="bg-ton-card rounded-lg p-4 shadow-lg border border-ton-blue/20">
              <h3 className="text-xl font-bold text-white mb-4">
                Trending Tokens
              </h3>
              <TokenLeaderboard />
            </div>
          </TabsContent>
          
          <TabsContent value="nft" className="mt-0">
            <div className="bg-ton-card rounded-lg p-4 shadow-lg border border-ton-blue/20">
              <h3 className="text-xl font-bold text-white mb-4">
                Popular Collections
              </h3>
              <NFTCollections />
            </div>
          </TabsContent>
        </Tabs>

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
