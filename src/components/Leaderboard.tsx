
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, ArrowRight } from 'lucide-react';

// Mock leaderboard data
const leaderboardData = [
  { rank: 1, name: 'CryptoWhale', tokenName: 'PEPE', gain: '+321%', avatar: '🐳' },
  { rank: 2, name: 'MoonHunter', tokenName: 'DOGE', gain: '+245%', avatar: '🚀' },
  { rank: 3, name: 'TokenGuru', tokenName: 'SHIB', gain: '+187%', avatar: '🧙‍♂️' },
  { rank: 4, name: 'CoinMaster', tokenName: 'FLOKI', gain: '+156%', avatar: '🎮' },
  { rank: 5, name: 'BlockGenius', tokenName: 'WOJAK', gain: '+124%', avatar: '🧠' },
];

const Leaderboard = () => {
  return (
    <Card className="bg-card border-gray-800 shadow-xl mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
          Top Traders
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {leaderboardData.map((item, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between py-3 ${
              index < leaderboardData.length - 1 ? 'border-b border-gray-800' : ''
            }`}
          >
            <div className="flex items-center">
              <div className="w-6 text-center font-bold text-gray-500">
                {item.rank}
              </div>
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center ml-3">
                <span className="text-sm">{item.avatar}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{item.name}</p>
                <p className="text-xs text-gray-400">{item.tokenName}</p>
              </div>
            </div>
            <div className="text-ton-success font-medium text-sm">
              {item.gain}
            </div>
          </div>
        ))}
        
        <div className="mt-4 text-center">
          <button className="text-ton-blue flex items-center mx-auto text-sm">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
