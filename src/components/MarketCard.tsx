
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTonConnect } from '@/contexts/TonConnectContext';
import { toast } from "sonner";
import TrendingChart from './TrendingChart';

// Mock data for the trending token
const trendingToken = {
  name: "Zaza Coin",
  symbol: "ZAZA",
  change: "+84%",
  volume: "13,400 TON",
  price: "0.0021 TON",
  image: "/placeholder.svg" // Using the placeholder image that is available
};

interface MarketCardProps {
  onBuyClick: () => void;
  onSellClick: () => void;
}

const MarketCard = ({ onBuyClick, onSellClick }: MarketCardProps) => {
  const { connected, connectWallet } = useTonConnect();

  const handleAction = (action: () => void) => {
    if (!connected) {
      toast.info("Please connect your wallet first");
      connectWallet();
    } else {
      action();
    }
  };

  return (
    <Card className="w-full max-w-md bg-ton-card border-ton-blue/20 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src={trendingToken.image} 
              alt={trendingToken.name} 
              className="w-10 h-10 rounded-full bg-ton-blue/10"
            />
            <div>
              <CardTitle className="text-lg text-white">
                {trendingToken.name} 
                <span className="text-sm text-gray-400 ml-1">
                  {trendingToken.symbol}
                </span>
              </CardTitle>
              <div className="flex items-center text-ton-success text-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>{trendingToken.change}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-medium">{trendingToken.price}</p>
            <p className="text-gray-400 text-xs">Volume: {trendingToken.volume}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-36 w-full">
          <TrendingChart />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button 
            onClick={() => handleAction(onBuyClick)}
            className="bg-ton-success hover:bg-ton-success/90"
          >
            <ArrowUpRight className="mr-1 h-4 w-4" />
            Buy Token
          </Button>
          <Button 
            onClick={() => handleAction(onSellClick)} 
            variant="outline"
            className="border-ton-error text-ton-error hover:bg-ton-error/10"
          >
            <ArrowDownRight className="mr-1 h-4 w-4" />
            Sell Token
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button 
          variant="ghost" 
          className="w-full text-gray-300 hover:text-white"
        >
          <Info className="mr-1 h-4 w-4" />
          More Details
        </Button>
        <Link to="/create-token" className="w-full">
          <Button className="w-full token-gradient">
            Create Your Own Token
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default MarketCard;
