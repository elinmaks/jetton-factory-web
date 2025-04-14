
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Trophy, CheckCircle2, Clock, Twitter, Youtube, Globe } from 'lucide-react';
import { useTelegram } from '@/contexts/TelegramContext';
import { telegramBackButton } from '@/utils/telegram';
import BottomNavigation from '@/components/BottomNavigation';

// Mock tasks data
const tasks = [
  { 
    id: 1, 
    title: 'Follow on Twitter', 
    description: 'Follow @TokenForge to earn points', 
    icon: Twitter, 
    reward: '50', 
    completed: false 
  },
  { 
    id: 2, 
    title: 'Watch Youtube Tutorial', 
    description: 'Learn how to create your first token', 
    icon: Youtube, 
    reward: '100', 
    completed: false 
  },
  { 
    id: 3, 
    title: 'Visit Website', 
    description: 'Explore the TokenForge website', 
    icon: Globe, 
    reward: '30', 
    completed: true 
  }
];

const Earnings = () => {
  const { isInTelegram } = useTelegram();

  // Weekly challenge data
  const weeklyProgress = {
    completed: 2,
    total: 7,
    percentage: (2 / 7) * 100
  };

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

  return (
    <div className="telegram-app bg-background dark:bg-background">
      <div className="container py-4 px-4 flex flex-col min-h-full">
        <h1 className="text-2xl font-bold text-white mb-6">Earn Points</h1>
        
        <Card className="bg-card border-gray-800 mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Weekly Challenge
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white">Daily Check-ins</p>
                  <p className="text-xs text-gray-400">
                    {weeklyProgress.completed}/{weeklyProgress.total} days completed
                  </p>
                </div>
                <p className="text-ton-blue font-medium">200 Points</p>
              </div>
              
              <Progress value={weeklyProgress.percentage} className="h-2 bg-gray-800" />
              
              <div className="flex space-x-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      i < weeklyProgress.completed 
                        ? 'bg-ton-success/20 text-ton-success' 
                        : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    {i < weeklyProgress.completed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="socials" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted mb-4">
            <TabsTrigger value="socials" className="data-[state=active]:bg-ton-blue">
              Socials
            </TabsTrigger>
            <TabsTrigger value="onchain" className="data-[state=active]:bg-ton-blue">
              OnChain
            </TabsTrigger>
            <TabsTrigger value="academy" className="data-[state=active]:bg-ton-blue">
              Academy
            </TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-ton-blue">
              New
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="socials" className="mt-0">
            <div className="space-y-4">
              {tasks.map(task => (
                <Card key={task.id} className="bg-card border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          task.completed ? 'bg-ton-success/20 text-ton-success' : 'bg-ton-blue/20 text-ton-blue'
                        }`}>
                          {React.createElement(task.icon, { size: 20 })}
                        </div>
                        <div className="ml-3">
                          <p className="text-white font-medium">{task.title}</p>
                          <p className="text-xs text-gray-400">{task.description}</p>
                        </div>
                      </div>
                      
                      {task.completed ? (
                        <div className="text-ton-success flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          <span>Done</span>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          className="bg-ton-blue hover:bg-ton-blue/90"
                        >
                          {task.reward} pts
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="onchain" className="mt-0">
            <div className="p-8 text-center text-gray-400">
              <p>Coming soon</p>
            </div>
          </TabsContent>
          
          <TabsContent value="academy" className="mt-0">
            <div className="p-8 text-center text-gray-400">
              <p>Coming soon</p>
            </div>
          </TabsContent>
          
          <TabsContent value="new" className="mt-0">
            <div className="p-8 text-center text-gray-400">
              <p>Coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Earnings;
