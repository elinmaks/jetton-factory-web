
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Rocket, BarChart3, Bot } from 'lucide-react';

const ActionButtons = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      <Link to="/create-token" className="flex flex-col items-center">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-16 w-16 rounded-full border-ton-blue bg-ton-blue/10 text-ton-blue hover:bg-ton-blue/20"
        >
          <Rocket size={28} />
        </Button>
        <span className="text-xs mt-2 text-gray-300">Launch Token</span>
      </Link>
      
      <Link to="/memepad" className="flex flex-col items-center">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-16 w-16 rounded-full border-ton-success bg-ton-success/10 text-ton-success hover:bg-ton-success/20"
        >
          <BarChart3 size={28} />
        </Button>
        <span className="text-xs mt-2 text-gray-300">Memepad</span>
      </Link>
      
      <Link to="/bot" className="flex flex-col items-center">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-16 w-16 rounded-full border-ton-error bg-ton-error/10 text-ton-error hover:bg-ton-error/20"
        >
          <Bot size={28} />
        </Button>
        <span className="text-xs mt-2 text-gray-300">Trading Bot</span>
      </Link>
    </div>
  );
};

export default ActionButtons;
