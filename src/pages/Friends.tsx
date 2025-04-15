
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Search, Share2, Medal } from 'lucide-react';
import { useTelegram } from '@/contexts/TelegramContext';
import { telegramBackButton } from '@/utils/telegram';
import BottomNavigation from '@/components/BottomNavigation';
import { Input } from '@/components/ui/input';

// Mock friends data - would be replaced with actual data from Supabase
const mockFriends = [
  { id: 1, name: 'Alex', username: '@alex_crypto', tokens: 2, verified: true },
  { id: 2, name: 'Maria', username: '@maria_ton', tokens: 5, verified: true },
  { id: 3, name: 'John', username: '@john_web3', tokens: 0, verified: false },
];

const Friends = () => {
  const navigate = useNavigate();
  const { isInTelegram, user } = useTelegram();
  const [searchTerm, setSearchTerm] = useState('');
  const [friends, setFriends] = useState(mockFriends);

  // Setup Telegram Back Button
  useEffect(() => {
    if (isInTelegram) {
      telegramBackButton.show();
      telegramBackButton.onClick(() => {
        navigate('/');
      });
    }

    return () => {
      if (isInTelegram) {
        telegramBackButton.hide();
      }
    };
  }, [isInTelegram, navigate]);

  // Filter friends based on search term
  const filteredFriends = friends.filter(
    friend => 
      friend.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="telegram-app bg-ton-background dark:bg-ton-background">
      <div className="container pb-16 pt-4 px-4 flex flex-col min-h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Users className="h-6 w-6 mr-2 text-ton-blue" />
            Friends
          </h1>
          <Button size="icon" variant="ghost" className="text-ton-blue">
            <UserPlus className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-ton-card border-gray-700 text-white"
            />
          </div>
        </div>

        {/* Friends List */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-3">Your Friends</h2>
          
          {filteredFriends.length > 0 ? (
            <div className="space-y-3">
              {filteredFriends.map((friend) => (
                <Card key={friend.id} className="bg-ton-card border-none shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-ton-blue/20 flex items-center justify-center mr-3">
                        <span className="text-lg text-white">{friend.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-medium text-white">{friend.name}</h3>
                          {friend.verified && (
                            <Medal className="h-4 w-4 ml-1 text-ton-blue" />
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{friend.username}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-white">{friend.tokens}</p>
                        <p className="text-xs text-gray-400">Tokens</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-ton-card border-none shadow-lg">
              <CardContent className="p-6 text-center">
                <p className="text-gray-400">No friends found</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Invite Friends */}
        <Card className="bg-ton-card border-none shadow-lg mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Invite Friends</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm mb-4">
              Invite your friends to earn tokens together. Both you and your friend will receive a bonus when they join.
            </p>
            <Button className="w-full token-gradient">
              <Share2 className="h-4 w-4 mr-2" />
              Share Invitation
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Friends;
