
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ChevronLeft, ExternalLink, Copy } from 'lucide-react';
import { toast } from 'sonner';

const TokenSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, deploymentResult } = location.state || {};
  
  if (!token || !deploymentResult) {
    // Redirect to home if there's no data
    React.useEffect(() => {
      navigate('/');
    }, [navigate]);
    return null;
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const openTonkeeperLink = () => {
    // Format may vary based on actual implementation
    const url = `https://app.tonkeeper.com/transfer/${deploymentResult.jettonAddress}`;
    window.open(url, '_blank');
  };

  return (
    <div className="telegram-app bg-ton-background dark:bg-ton-background">
      <div className="container py-6 px-4 flex flex-col items-center min-h-full">
        <div className="w-full max-w-md mb-6">
          <Button variant="ghost" size="sm" className="text-gray-400" onClick={() => navigate('/')}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Creator
          </Button>
        </div>

        <div className="flex justify-center mb-8">
          <div className="rounded-full bg-ton-success/20 p-4">
            <CheckCircle className="h-12 w-12 text-ton-success" />
          </div>
        </div>

        <Card className="w-full max-w-md bg-ton-card border-ton-blue/20 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-white text-center">Token Created Successfully!</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Your Jetton is now deployed on the TON blockchain
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-md">
              <div>
                <p className="text-sm text-gray-400">Token Name</p>
                <p className="font-semibold text-white">{token.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Symbol</p>
                <p className="font-semibold text-white">{token.symbol}</p>
              </div>
            </div>

            <div className="p-3 bg-black/20 rounded-md">
              <div className="flex justify-between">
                <p className="text-sm text-gray-400">Total Supply</p>
                <p className="font-semibold text-white">{Number(token.amount).toLocaleString()} {token.symbol}</p>
              </div>
            </div>

            <div className="p-3 bg-black/20 rounded-md">
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm text-gray-400">Jetton Address</p>
                <button 
                  onClick={() => copyToClipboard(deploymentResult.jettonAddress)}
                  className="text-ton-blue hover:text-ton-lightBlue"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="font-mono text-xs text-white break-all">
                {deploymentResult.jettonAddress}
              </p>
            </div>

            {token.description && (
              <div className="p-3 bg-black/20 rounded-md">
                <p className="text-sm text-gray-400 mb-1">Description</p>
                <p className="text-sm text-white">{token.description}</p>
              </div>
            )}

            <div className="p-3 bg-black/20 rounded-md flex justify-between items-center">
              <p className="text-sm text-white">View on Explorer</p>
              <a 
                href={deploymentResult.explorerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-ton-blue hover:text-ton-lightBlue"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </CardContent>

          <CardFooter>
            <Button 
              className="w-full token-gradient"
              onClick={openTonkeeperLink}
            >
              Add to Tonkeeper
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TokenSuccess;
