
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Rocket, Flame, Clock, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTelegram } from '@/contexts/TelegramContext';
import { telegramBackButton } from '@/utils/telegram';
import BottomNavigation from '@/components/BottomNavigation';

// Mock live trades data
const liveTradesData = [
  { user: 'Crypto123', action: 'buy', token: 'PEPE', amount: '2.5', time: '2m ago' },
  { user: 'TokenMaster', action: 'sell', token: 'DOGE', amount: '1.8', time: '5m ago' },
  { user: 'MoonHodler', action: 'buy', token: 'SHIB', amount: '5.2', time: '10m ago' },
];

// Mock tokens data
const tokensData = [
  { id: 1, name: 'PepeCoin', symbol: 'PEPE', marketCap: '120K', change: '+24%', createdAt: '2d ago', logo: '🐸' },
  { id: 2, name: 'MoonShot', symbol: 'MOON', marketCap: '85K', change: '+18%', createdAt: '5d ago', logo: '🌙' },
  { id: 3, name: 'RocketFuel', symbol: 'FUEL', marketCap: '62K', change: '+11%', createdAt: '1d ago', logo: '🚀' },
  { id: 4, name: 'DiamondHands', symbol: 'DIAM', marketCap: '45K', change: '+9%', createdAt: '3d ago', logo: '💎' },
  { id: 5, name: 'CatCoin', symbol: 'CAT', marketCap: '32K', change: '+5%', createdAt: '6h ago', logo: '🐱' },
];

const Memepad = () => {
  const { isInTelegram } = useTelegram();
  const [currentTradeIndex, setCurrentTradeIndex] = useState(0);

  // Setup Telegram Back Button
  useEffect(() => {
    if (isInTelegram) {
      telegramBackButton.show();
      telegramBackButton.onClick(() => {
        window.location.href = '/';
      });
    }

    return () => {
      if (isInTelegram) {
        telegramBackButton.hide();
      }
    };
  }, [isInTelegram]);

  // Rotate through live trades
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTradeIndex((prevIndex) => (prevIndex + 1) % liveTradesData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentTrade = liveTradesData[currentTradeIndex];

  return (
    <div className="telegram-app bg-background dark:bg-background">
      <div className="container py-4 px-4 flex flex-col min-h-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Memepad</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" className="rounded-full bg-muted border-none">
              <Search size={18} />
            </Button>
            <Link to="/create-token">
              <Button className="rounded-full token-gradient">
                <Rocket size={18} className="mr-2" />
                Create Token
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Live Trades Bar */}
        <div className="bg-card rounded-xl p-3 mb-6 overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-ton-blue to-ton-success"></div>
          <div className="flex items-center text-sm animate-pulse-slow">
            <div className={`rounded-full h-6 w-6 flex items-center justify-center mr-2 ${
              currentTrade.action === 'buy' ? 'bg-ton-success/20 text-ton-success' : 'bg-ton-error/20 text-ton-error'
            }`}>
              {currentTrade.action === 'buy' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            </div>
            <span className="text-gray-400">
              <span className="text-white">{currentTrade.user}</span> {currentTrade.action === 'buy' ? 'bought' : 'sold'} {currentTrade.amount} TON of {' '}
              <span className="text-white">{currentTrade.token}</span> {currentTrade.time}
            </span>
          </div>
        </div>
        
        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted mb-4">
            <TabsTrigger value="trending" className="data-[state=active]:bg-ton-blue">
              <Flame size={16} className="mr-1" /> Trending
            </TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-ton-blue">
              <Clock size={16} className="mr-1" /> New
            </TabsTrigger>
            <TabsTrigger value="hot" className="data-[state=active]:bg-ton-blue">
              <TrendingUp size={16} className="mr-1" /> Hot
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-ton-blue">
              All
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending" className="mt-0 space-y-4">
            {tokensData.map(token => (
              <Card key={token.id} className="bg-card border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-xl">{token.logo}</span>
                      </div>
                      <div className="ml-3">
                        <div className="flex items-center">
                          <p className="text-white font-medium">{token.name}</p>
                          <p className="text-gray-400 text-xs ml-2">{token.symbol}</p>
                        </div>
                        <div className="flex items-center mt-1">
                          <p className="text-xs text-gray-400">MK: {token.marketCap}</p>
                          <p className="text-xs text-ton-success ml-3">{token.change}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{token.createdAt}</p>
                      <Link to={`/token/${token.id}`}>
                        <Button size="sm" variant="ghost" className="mt-1 text-ton-blue p-0 h-auto">
                          <span className="text-xs">Trade</span>
                          <ArrowUpRight size={14} className="ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="new" className="mt-0">
            <div className="p-8 text-center text-gray-400">
              <p>New listings coming soon</p>
            </div>
          </TabsContent>
          
          <TabsContent value="hot" className="mt-0">
            <div className="p-8 text-center text-gray-400">
              <p>Hot tokens coming soon</p>
            </div>
          </TabsContent>
          
          <TabsContent value="all" className="mt-0">
            <div className="p-8 text-center text-gray-400">
              <p>All tokens coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Memepad;
