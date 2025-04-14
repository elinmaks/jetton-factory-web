
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Rocket, Users, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/earnings', icon: TrendingUp, label: 'Earnings' },
    { path: '/memepad', icon: Rocket, label: 'Memepad' },
    { path: '/friends', icon: Users, label: 'Friends' },
    { path: '/wallet', icon: Wallet, label: 'Wallet' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800 py-2 px-2 sm:w-[600px] sm:mx-auto">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-16 py-2 rounded-lg",
                isActive ? "text-ton-blue" : "text-gray-400 hover:text-gray-300"
              )}
            >
              <Icon size={24} className={isActive ? "animate-pulse-slow" : ""} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
