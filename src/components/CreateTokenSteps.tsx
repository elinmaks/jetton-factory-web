import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TokenForm from '@/components/TokenForm';
import MiningProgress from '@/components/MiningProgress';
import { Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTonConnect } from '@/contexts/TonConnectContext';
import { useTelegram } from '@/contexts/TelegramContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Token } from '@/hooks/useTokens';

type TokenData = {
  name: string;
  symbol: string;
  description?: string;
  amount: string;
  logoUrl?: string;
};

type Step = 'form' | 'mining' | 'deploy';

const CreateTokenSteps = () => {
  const navigate = useNavigate();
  const { connected, wallet, deployToken } = useTonConnect();
  const { isInTelegram } = useTelegram();
  const { toast } = useToast();
  
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>('form');
  const [tokenId, setTokenId] = useState<string>('');
  const [isDeploying, setIsDeploying] = useState(false);
  
  // Handle form submission
  const handleFormSubmit = async (data: TokenData) => {
    try {
      // Save token draft to Supabase
      const { data: tokenRecord, error } = await supabase
        .from('tokens')
        .insert({
          name: data.name,
          symbol: data.symbol,
          description: data.description || '',
          supply: data.amount,
          creator_address: wallet?.address || '',
          status: 'mining',
          mining_difficulty: 4,
          target_blocks: 1
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      // Save token data to state
      setTokenData(data);
      setTokenId(tokenRecord.id);
      
      // Move to mining step
      setCurrentStep('mining');
      
      toast({
        title: "Token draft created",
        description: "Now you need to mine a block to mint your token"
      });
      
    } catch (error) {
      console.error('Error creating token draft:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create token draft. Please try again."
      });
    }
  };
  
  // Handle mining completion
  const handleMiningComplete = () => {
    setCurrentStep('deploy');
    toast({
      title: "Mining completed",
      description: "You can now deploy your token to the blockchain"
    });
  };
  
  // Handle token deployment
  const handleDeploy = async () => {
    if (!tokenData || !wallet) return;
    
    setIsDeploying(true);
    
    try {
      // Update token status in Supabase
      const { error: updateError } = await supabase
        .from('tokens')
        .update({ status: 'deploying' })
        .eq('id', tokenId);
      
      if (updateError) throw updateError;
      
      // Deploy token to blockchain
      const result = await deployToken({
        name: tokenData.name,
        symbol: tokenData.symbol,
        description: tokenData.description || "",
        amount: tokenData.amount,
        image: null // TODO: Handle image upload
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to deploy token');
      }
      
      // Update token status and add blockchain data
      const { error: finalUpdateError } = await supabase
        .from('tokens')
        .update({
          status: 'completed',
          contract_address: result.jettonAddress,
          deployment_tx: result.explorerUrl
        })
        .eq('id', tokenId);
      
      if (finalUpdateError) throw finalUpdateError;
      
      // Navigate to success page
      navigate("/token-success", { 
        state: { 
          token: tokenData,
          deploymentResult: result 
        } 
      });
      
    } catch (error) {
      console.error('Error deploying token:', error);
      toast({
        variant: "destructive",
        title: "Deployment Failed",
        description: "Failed to deploy token to blockchain. Please try again."
      });
    } finally {
      setIsDeploying(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {currentStep === 'form' && (
        <Card className="bg-ton-card border-ton-blue/20">
          <CardHeader>
            <CardTitle className="text-white">Create Your Token</CardTitle>
            <CardDescription className="text-gray-400">
              Fill in the details for your new token
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TokenForm onSubmit={handleFormSubmit} />
          </CardContent>
        </Card>
      )}
      
      {currentStep === 'mining' && (
        <Card className="bg-ton-card border-ton-blue/20">
          <CardHeader>
            <CardTitle className="text-white">Mine Your Token</CardTitle>
            <CardDescription className="text-gray-400">
              Complete the Proof-of-Work mining to create your token
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-ton-blue/10 rounded-md text-sm text-gray-300">
              <div className="flex items-start mb-2">
                <Info className="h-4 w-4 text-ton-blue mr-2 mt-1" />
                <p>
                  Your token needs computational proof-of-work to be created. This prevents spam and gives value to your token. Start mining now!
                </p>
              </div>
            </div>
            <MiningProgress 
              tokenId={tokenId}
              targetBlocks={1}
              difficulty={4}
              onComplete={handleMiningComplete}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentStep('form')}
              className="text-gray-400"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {currentStep === 'deploy' && (
        <Card className="bg-ton-card border-ton-blue/20">
          <CardHeader>
            <CardTitle className="text-white">Deploy Your Token</CardTitle>
            <CardDescription className="text-gray-400">
              Mining completed! Now deploy your token to the TON blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tokenData && (
              <div className="space-y-4">
                <div className="p-4 bg-ton-success/10 border border-ton-success/20 rounded-md">
                  <h3 className="text-ton-success font-medium mb-2">Mining Successful!</h3>
                  <p className="text-gray-300 text-sm">
                    You've successfully completed the proof-of-work for:
                  </p>
                  <div className="mt-2 p-3 bg-black/30 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white font-medium">{tokenData.name}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-gray-400">Symbol:</span>
                      <span className="text-white font-medium">{tokenData.symbol}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-gray-400">Supply:</span>
                      <span className="text-white font-medium">{Number(tokenData.amount).toLocaleString()} {tokenData.symbol}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-ton-blue/10 rounded-md text-sm text-gray-300">
                  <div className="flex items-start">
                    <Info className="h-4 w-4 text-ton-blue mr-2 mt-1" />
                    <p>
                      The final step is to deploy your token to the TON blockchain. This requires signing a transaction with your wallet and paying a small network fee.
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleDeploy} 
                  className="w-full token-gradient" 
                  disabled={isDeploying}
                >
                  {isDeploying ? 'Deploying...' : 'Deploy Token to Blockchain'}
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentStep('mining')}
              className="text-gray-400"
              disabled={isDeploying}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CreateTokenSteps;
