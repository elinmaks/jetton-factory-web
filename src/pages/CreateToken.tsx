
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import TokenForm from '@/components/TokenForm';
import ConnectWallet from '@/components/ConnectWallet';
import { useTonConnect } from '@/contexts/TonConnectContext';

const CreateToken = () => {
  const { connected } = useTonConnect();

  return (
    <div className="telegram-app bg-ton-background dark:bg-ton-background">
      <div className="container py-6 px-4 flex flex-col items-center min-h-full">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-ton-blue to-ton-lightBlue bg-clip-text text-transparent">
            Create Your Token
          </h1>
          <p className="text-gray-300 mt-2">
            Deploy a custom Jetton on TON blockchain
          </p>
        </div>

        <Card className="w-full max-w-md bg-ton-card border-ton-blue/20 shadow-lg mb-6">
          <CardHeader className="flex flex-col items-center">
            <CardTitle className="text-white">Connect Wallet</CardTitle>
            <CardDescription className="text-gray-400">
              Connect your TON wallet to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectWallet className="py-4" />
          </CardContent>
        </Card>

        {connected && (
          <Card className="w-full max-w-md bg-ton-card border-ton-blue/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Create Your Token</CardTitle>
              <CardDescription className="text-gray-400">
                Fill in the details for your new TON Jetton
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TokenForm />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreateToken;
