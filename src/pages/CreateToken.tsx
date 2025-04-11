
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Rocket, Shield, Zap, Info, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import TokenForm from '@/components/TokenForm';
import ConnectWallet from '@/components/ConnectWallet';
import { useTonConnect } from '@/contexts/TonConnectContext';

const CreateToken = () => {
  const { connected } = useTonConnect();

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
          <>
            <Tabs defaultValue="standard" className="w-full max-w-md mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="standard" className="data-[state=active]:bg-ton-blue data-[state=active]:text-white">
                  <Rocket className="mr-2 h-4 w-4" />
                  Standard
                </TabsTrigger>
                <TabsTrigger value="advanced" className="data-[state=active]:bg-ton-blue data-[state=active]:text-white">
                  <Shield className="mr-2 h-4 w-4" />
                  Advanced
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Card className="w-full max-w-md bg-ton-card border-ton-blue/20 shadow-lg mb-6">
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

            <Card className="w-full max-w-md bg-ton-card border-ton-blue/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Info className="h-5 w-5 mr-2 text-ton-blue" />
                  Benefits of TokenForge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mr-3 bg-ton-blue/10 rounded-full p-1">
                      <CheckCircle className="h-5 w-5 text-ton-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Instant Listing</h4>
                      <p className="text-sm text-gray-300">Your token is automatically listed on our marketplace</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-3 bg-ton-blue/10 rounded-full p-1">
                      <CheckCircle className="h-5 w-5 text-ton-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Trading Ready</h4>
                      <p className="text-sm text-gray-300">Users can buy and sell your token immediately</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-3 bg-ton-blue/10 rounded-full p-1">
                      <CheckCircle className="h-5 w-5 text-ton-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Creator Rewards</h4>
                      <p className="text-sm text-gray-300">Earn fees from trading activity of your token</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateToken;
