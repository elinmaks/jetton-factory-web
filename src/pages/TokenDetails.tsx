
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ExternalLink, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Flame, 
  Cpu,
  Info,
  Check,
  Globe,
  MessagesSquare
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useTelegram } from '@/contexts/TelegramContext';
import { telegramBackButton } from '@/utils/telegram';
import MiningProgress from '@/components/MiningProgress';

interface TokenData {
  id: string;
  name: string;
  symbol: string;
  description: string;
  supply: string;
  creator_address: string;
  status: 'draft' | 'mining' | 'deploying' | 'completed';
  contract_address?: string;
  deployment_tx?: string;
  mining_difficulty: number;
  target_blocks: number;
  created_at: string;
  price?: number;
  market_cap?: number;
}

const TokenDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isInTelegram } = useTelegram();
  const [token, setToken] = useState<TokenData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trade');
  
  // Setup Telegram Back Button
  useEffect(() => {
    if (isInTelegram) {
      telegramBackButton.show();
      telegramBackButton.onClick(() => {
        navigate('/memepad');
      });
    }

    return () => {
      if (isInTelegram) {
        telegramBackButton.hide();
      }
    };
  }, [isInTelegram, navigate]);
  
  // Fetch token data
  useEffect(() => {
    const fetchToken = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('tokens')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        if (data) {
          setToken(data);
        }
      } catch (error) {
        console.error('Error fetching token:', error);
        toast.error('Failed to load token details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchToken();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('token-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'tokens',
        filter: `id=eq.${id}`
      }, (payload) => {
        setToken(payload.new as TokenData);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [id]);
  
  // Handle mining completion
  const handleMiningComplete = async () => {
    if (!token) return;
    
    try {
      const { error } = await supabase
        .from('tokens')
        .update({ status: 'deploying' })
        .eq('id', token.id);
      
      if (error) throw error;
      
      toast.success('Mining completed!', {
        description: 'You can now deploy your token to the blockchain'
      });
    } catch (error) {
      console.error('Error updating token status:', error);
      toast.error('Failed to update token status');
    }
  };
  
  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="telegram-app bg-ton-background">
        <div className="container py-6 px-4 flex flex-col items-center min-h-full">
          <div className="w-full flex justify-start mb-6">
            <Button variant="ghost" onClick={() => navigate('/memepad')} className="text-gray-300">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </Button>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-gray-400">Loading token details...</div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render not found state
  if (!token) {
    return (
      <div className="telegram-app bg-ton-background">
        <div className="container py-6 px-4 flex flex-col items-center min-h-full">
          <div className="w-full flex justify-start mb-6">
            <Button variant="ghost" onClick={() => navigate('/memepad')} className="text-gray-300">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </Button>
          </div>
          <Card className="w-full max-w-md bg-ton-card border-ton-blue/20">
            <CardHeader>
              <CardTitle className="text-white">Token Not Found</CardTitle>
              <CardDescription className="text-gray-400">
                The token you're looking for doesn't exist or has been removed
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/memepad')} className="w-full">
                Browse Tokens
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="telegram-app bg-ton-background">
      <div className="container py-6 px-4 flex flex-col items-center min-h-full">
        <div className="w-full max-w-md flex justify-start mb-6">
          <Link to="/memepad">
            <Button variant="ghost" className="text-gray-300 hover:text-white p-0">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Memepad
            </Button>
          </Link>
        </div>
        
        <Card className="w-full max-w-md bg-ton-card border-ton-blue/20 shadow-lg mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-ton-blue/20 rounded-full flex items-center justify-center">
                <span className="text-xl">{token.symbol.substring(0, 1)}</span>
              </div>
              <div>
                <CardTitle className="text-white">{token.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  ${token.symbol}
                </CardDescription>
              </div>
              <div className="ml-auto">
                <div className="bg-ton-blue/10 text-ton-blue text-xs font-medium py-1 px-2 rounded-full uppercase">
                  {token.status}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-2">
            {token.description && (
              <p className="text-sm text-gray-300 mb-4">{token.description}</p>
            )}
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-ton-blue/10 rounded-md p-3">
                <div className="text-gray-400 text-xs mb-1">Supply</div>
                <div className="text-white font-medium">
                  {parseInt(token.supply).toLocaleString()}
                </div>
              </div>
              
              <div className="bg-ton-blue/10 rounded-md p-3">
                <div className="text-gray-400 text-xs mb-1">Created</div>
                <div className="text-white font-medium">
                  {new Date(token.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {token.status === 'mining' && (
              <MiningProgress 
                tokenId={token.id}
                targetBlocks={token.target_blocks}
                difficulty={token.mining_difficulty}
                onComplete={handleMiningComplete}
                className="mb-4"
              />
            )}
            
            {token.status === 'deploying' && (
              <div className="bg-ton-blue/10 p-4 rounded-md mb-4">
                <h3 className="text-white font-medium flex items-center mb-2">
                  <Cpu className="h-5 w-5 mr-2 text-ton-blue" />
                  Ready to Deploy
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  Mining completed! Your token is ready to be deployed to the TON blockchain.
                </p>
                <Button className="w-full token-gradient">
                  Deploy Token
                </Button>
              </div>
            )}
            
            {token.status === 'completed' && token.contract_address && (
              <div className="p-4 bg-ton-success/10 border border-ton-success/20 rounded-md mb-4">
                <h3 className="text-ton-success font-medium flex items-center mb-2">
                  <Check className="h-5 w-5 mr-2" />
                  Token Successfully Deployed
                </h3>
                
                <div className="mb-3">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm text-gray-400">Contract Address</p>
                    <button 
                      onClick={() => copyToClipboard(token.contract_address || '')}
                      className="text-ton-blue hover:text-ton-lightBlue"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-white font-mono break-all">
                    {token.contract_address}
                  </p>
                </div>
                
                {token.deployment_tx && (
                  <a 
                    href={token.deployment_tx} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-between text-sm text-white hover:text-ton-blue"
                  >
                    <span>View on Explorer</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {token.status === 'completed' && (
          <Card className="w-full max-w-md bg-ton-card border-ton-blue/20 shadow-lg mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="trade" className="data-[state=active]:bg-ton-blue data-[state=active]:text-white">
                  Trade
                </TabsTrigger>
                <TabsTrigger value="info" className="data-[state=active]:bg-ton-blue data-[state=active]:text-white">
                  Info
                </TabsTrigger>
                <TabsTrigger value="social" className="data-[state=active]:bg-ton-blue data-[state=active]:text-white">
                  Social
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="trade" className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Buy
                  </Button>
                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                    <ArrowDown className="h-4 w-4 mr-2" />
                    Sell
                  </Button>
                </div>
                
                <div className="bg-ton-blue/10 p-4 rounded-md text-center mb-4">
                  <div className="text-gray-400 text-xs mb-1">Current Price</div>
                  <div className="text-2xl font-bold text-white">
                    {token.price ? `${token.price.toFixed(6)} TON` : 'Not Listed'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-ton-blue/10 rounded-md p-3">
                    <div className="text-gray-400 text-xs mb-1">Market Cap</div>
                    <div className="text-white font-medium">
                      {token.market_cap ? `${token.market_cap.toFixed(2)} TON` : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="bg-ton-blue/10 rounded-md p-3">
                    <div className="text-gray-400 text-xs mb-1">24h Change</div>
                    <div className="text-green-500 font-medium">
                      +0.00%
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="info" className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-medium mb-2">About</h3>
                    <p className="text-sm text-gray-300">
                      {token.description || 'No description provided'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-medium mb-2">Creator</h3>
                    <div className="flex items-center justify-between bg-ton-blue/10 p-3 rounded-md">
                      <span className="text-sm text-gray-300 font-mono">
                        {token.creator_address.substring(0, 6)}...{token.creator_address.substring(token.creator_address.length - 4)}
                      </span>
                      <button 
                        onClick={() => copyToClipboard(token.creator_address)}
                        className="text-ton-blue hover:text-ton-lightBlue"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-medium mb-2">Statistics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-700/50">
                        <span className="text-sm text-gray-400">Total Supply</span>
                        <span className="text-sm text-white">{parseInt(token.supply).toLocaleString()} {token.symbol}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-700/50">
                        <span className="text-sm text-gray-400">Created</span>
                        <span className="text-sm text-white">{new Date(token.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-400">Mining Difficulty</span>
                        <span className="text-sm text-white">{token.mining_difficulty.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="social" className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button variant="outline" className="w-full">
                    <Globe className="h-4 w-4 mr-2" />
                    Website
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessagesSquare className="h-4 w-4 mr-2" />
                    Telegram
                  </Button>
                </div>
                
                <div className="bg-ton-blue/10 p-4 rounded-md mb-4">
                  <h3 className="text-white font-medium flex items-center mb-2">
                    <Flame className="h-5 w-5 mr-2 text-ton-blue" />
                    Community Rating
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Hot or Not?</span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-green-500 text-green-500">
                        Hot 🔥
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500 text-red-500">
                        Not ❄️
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-ton-blue/10 p-4 rounded-md">
                  <h3 className="text-white font-medium mb-2">Community Comments</h3>
                  <p className="text-sm text-gray-300">
                    Comments coming soon!
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TokenDetails;
