
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ConnectWallet from '@/components/ConnectWallet';
import TelegramAuth from '@/components/TelegramAuth';
import { useTonConnect } from '@/contexts/TonConnectContext';
import { useTelegram } from '@/contexts/TelegramContext';
import { telegramBackButton } from '@/utils/telegram';
import CreateTokenSteps from '@/components/CreateTokenSteps';

const CreateToken = () => {
  const { connected } = useTonConnect();
  const { isInTelegram } = useTelegram();
  const navigate = useNavigate();

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

  return (
    <div className="telegram-app bg-ton-background dark:bg-ton-background">
      <div className="container py-6 px-4 flex flex-col items-center min-h-full">
        <div className="w-full max-w-md flex justify-start mb-6">
          <Link to="/">
            <Button variant="ghost" className="text-gray-300 hover:text-white p-0">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Market
            </Button>
          </Link>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-ton-blue to-ton-lightBlue bg-clip-text text-transparent">
            Create Your Token
          </h1>
          <p className="text-gray-300 mt-2">
            Deploy a custom Jetton on TON blockchain with Proof-of-Work
          </p>
        </div>

        <div className="w-full max-w-md mb-6">
          <div className="bg-ton-card border-ton-blue/20 rounded-lg shadow-lg p-4 mb-6">
            <h3 className="text-white font-medium mb-2">Authentication Required</h3>
            {isInTelegram 
              ? <TelegramAuth className="py-4" /> 
              : <ConnectWallet className="py-4" />}
          </div>
        
          {(connected || isInTelegram) && (
            <CreateTokenSteps />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateToken;
