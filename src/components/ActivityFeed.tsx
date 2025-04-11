
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Rocket, Coins, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

// Mock data for activity feed
const activityItems = [
  {
    id: 1,
    type: 'launch',
    title: 'New Token Launch',
    description: 'Cyber Credit (CYBR) just launched on TokenForge',
    time: '2 hours ago',
    user: 'CyberLabs',
    userInitial: 'C',
    icon: Rocket
  },
  {
    id: 2,
    type: 'transaction',
    title: 'Large Transaction',
    description: 'Someone bought 25,000 ZAZA for 52.5 TON',
    time: '4 hours ago',
    user: 'Anonymous',
    userInitial: 'A',
    icon: ArrowUpRight
  },
  {
    id: 3,
    type: 'airdrop',
    title: 'MOON Airdrop',
    description: 'MOON token distributed 10,000 tokens to early supporters',
    time: '6 hours ago',
    user: 'MoonTeam',
    userInitial: 'M',
    icon: Coins
  },
  {
    id: 4,
    type: 'transaction',
    title: 'Whale Movement',
    description: 'Whale wallet sold 50,000 DIAM for 280 TON',
    time: '12 hours ago',
    user: 'Whale',
    userInitial: 'W',
    icon: ArrowDownRight
  }
];

const ActivityFeed = () => {
  return (
    <Card className="w-full bg-ton-card border-ton-blue/20 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center">
          <Clock className="h-5 w-5 mr-2 text-ton-blue" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityItems.map((item) => (
            <div key={item.id} className="flex items-start space-x-4 border-b border-ton-blue/10 pb-3 last:border-0">
              <Avatar className="h-9 w-9 mt-1">
                <AvatarFallback className="bg-ton-blue/20 text-ton-blue">
                  {item.userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <div className="text-xs text-gray-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.time}
                  </div>
                </div>
                <p className="text-xs text-gray-300">
                  {item.description}
                </p>
                <div className="flex items-center mt-1">
                  <div className={`
                    h-5 w-5 rounded-full flex items-center justify-center
                    ${item.type === 'launch' ? 'bg-ton-blue/20 text-ton-blue' : ''} 
                    ${item.type === 'transaction' && item.icon === ArrowUpRight ? 'bg-ton-success/20 text-ton-success' : ''} 
                    ${item.type === 'transaction' && item.icon === ArrowDownRight ? 'bg-ton-error/20 text-ton-error' : ''} 
                    ${item.type === 'airdrop' ? 'bg-amber-500/20 text-amber-500' : ''} 
                  `}>
                    <item.icon className="h-3 w-3" />
                  </div>
                  <span className="text-xs text-gray-400 ml-2">
                    by {item.user}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
