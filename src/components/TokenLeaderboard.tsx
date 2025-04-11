
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data for trending tokens
const trendingTokens = [
  { 
    name: "Zaza Coin", 
    symbol: "ZAZA", 
    price: "0.0021", 
    change: "+84", 
    volume: "13,400",
    marketCap: "2.1M"
  },
  { 
    name: "Moon Token", 
    symbol: "MOON", 
    price: "0.0035", 
    change: "+45", 
    volume: "8,900",
    marketCap: "3.5M"
  },
  { 
    name: "Cyber Credit", 
    symbol: "CYBR", 
    price: "0.0016", 
    change: "-12", 
    volume: "5,200",
    marketCap: "1.6M"
  },
  { 
    name: "Diamond Hand", 
    symbol: "DIAM", 
    price: "0.0056", 
    change: "+23", 
    volume: "4,700",
    marketCap: "5.6M"
  }
];

const TokenLeaderboard = () => {
  return (
    <div className="w-full overflow-auto">
      <Table className="w-full">
        <TableHeader className="bg-ton-background/50">
          <TableRow>
            <TableHead className="text-ton-blue">Token</TableHead>
            <TableHead className="text-ton-blue text-right">Price</TableHead>
            <TableHead className="text-ton-blue text-right">24h Change</TableHead>
            <TableHead className="text-ton-blue text-right hidden sm:table-cell">Volume</TableHead>
            <TableHead className="text-ton-blue text-right hidden md:table-cell">Market Cap</TableHead>
            <TableHead className="text-ton-blue text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trendingTokens.map((token) => (
            <TableRow key={token.symbol} className="border-b border-ton-blue/10">
              <TableCell className="font-medium text-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-ton-blue/10 flex items-center justify-center text-xs">
                    {token.symbol.substring(0, 2)}
                  </div>
                  <div>
                    <div>{token.name}</div>
                    <div className="text-xs text-gray-400">{token.symbol}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-mono text-white">
                {token.price} TON
              </TableCell>
              <TableCell className="text-right">
                <span 
                  className={`flex items-center justify-end ${
                    token.change.startsWith("+") ? "text-ton-success" : "text-ton-error"
                  }`}
                >
                  {token.change.startsWith("+") ? (
                    <ArrowUp className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDown className="w-3 h-3 mr-1" />
                  )}
                  {token.change}%
                </span>
              </TableCell>
              <TableCell className="text-right text-gray-300 hidden sm:table-cell">
                {token.volume} TON
              </TableCell>
              <TableCell className="text-right text-gray-300 hidden md:table-cell">
                {token.marketCap} TON
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" className="text-ton-blue hover:text-white hover:bg-ton-blue/20">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TokenLeaderboard;
