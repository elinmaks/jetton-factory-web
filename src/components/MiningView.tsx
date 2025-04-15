
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Pickaxe, Clock, PlayCircle, PauseCircle, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { useMining, MiningStats } from '@/hooks/useMining';
import { hapticFeedback, telegramMainButton, showPopup } from '@/utils/telegram';
import { useTelegram } from '@/contexts/TelegramContext';
import { useTonConnect } from '@/contexts/TonConnectContext';
import { supabase } from '@/integrations/supabase/client';

interface MiningViewProps {
  tokenId: string;
  tokenName: string;
  tokenSymbol: string;
}

const MiningView: React.FC<MiningViewProps> = ({ tokenId, tokenName, tokenSymbol }) => {
  const navigate = useNavigate();
  const { isInTelegram } = useTelegram();
  const { wallet } = useTonConnect();
  const [miningComplete, setMiningComplete] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);
  const [totalBlocks] = useState(1000); // Mining requires 1000 blocks
  const [foundBlocks, setFoundBlocks] = useState(0);
  
  // Initialize mining hook
  const { 
    stats, 
    startMining, 
    stopMining, 
    latestResult,
    setDifficulty 
  } = useMining({ 
    tokenId,
    initialDifficulty: 4, // Start with a reasonable difficulty
    onSuccess: handleMiningSuccess
  });
  
  // Update mining button text on Telegram
  useEffect(() => {
    if (isInTelegram) {
      if (stats.running) {
        telegramMainButton.setText('Stop Mining');
        telegramMainButton.setParams({ color: '#DC2626' });
        telegramMainButton.onClick(() => handleStopMining());
        telegramMainButton.show();
      } else if (!miningComplete) {
        telegramMainButton.setText('Start Mining');
        telegramMainButton.setParams({ color: '#0098EA' });
        telegramMainButton.onClick(() => handleStartMining());
        telegramMainButton.show();
      } else {
        telegramMainButton.setText('Mining Complete!');
        telegramMainButton.setParams({ color: '#16A34A' });
        telegramMainButton.onClick(() => navigate(`/token/${tokenId}`));
        telegramMainButton.show();
      }
    }
    
    return () => {
      if (isInTelegram) {
        telegramMainButton.hide();
      }
    };
  }, [stats.running, miningComplete, isInTelegram, tokenId, navigate]);
  
  // Fetch initial mining progress
  useEffect(() => {
    const fetchMiningProgress = async () => {
      if (!tokenId || !wallet?.address) return;
      
      try {
        const { data, error } = await supabase
          .from('mining_shares')
          .select('*')
          .eq('token_id', tokenId)
          .eq('is_valid', true);
        
        if (error) throw error;
        
        const validBlocks = data?.length || 0;
        setFoundBlocks(validBlocks);
        
        const progress = Math.min(Math.floor((validBlocks / totalBlocks) * 100), 100);
        setMiningProgress(progress);
        
        // If mining is complete
        if (validBlocks >= totalBlocks) {
          setMiningComplete(true);
          
          // Update token status in database
          await supabase
            .from('tokens')
            .update({ status: 'completed' })
            .eq('id', tokenId);
        }
      } catch (err) {
        console.error('Error fetching mining progress:', err);
      }
    };
    
    fetchMiningProgress();
    
    // Set up real-time subscription for mining shares
    if (tokenId) {
      const subscription = supabase
        .channel(`mining-shares-${tokenId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'mining_shares',
          filter: `token_id=eq.${tokenId}`
        }, () => {
          fetchMiningProgress();
        })
        .subscribe();
      
      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [tokenId, wallet?.address, totalBlocks]);
  
  // Success handler for mining
  async function handleMiningSuccess(result: any) {
    try {
      // Save the mining share
      const { error } = await supabase.from('mining_shares').insert({
        token_id: tokenId,
        user_id: wallet?.address,
        hash: result.hash,
        nonce: result.nonce,
        is_valid: true
      });
      
      if (error) throw error;
      
      // Update blocks count and progress
      const newFoundBlocks = foundBlocks + 1;
      setFoundBlocks(newFoundBlocks);
      
      const progress = Math.min(Math.floor((newFoundBlocks / totalBlocks) * 100), 100);
      setMiningProgress(progress);
      
      // Provide feedback
      hapticFeedback.impact('medium');
      toast.success('Block mined successfully!');
      
      // Check if mining is complete
      if (newFoundBlocks >= totalBlocks) {
        setMiningComplete(true);
        showPopup('Mining Complete!', `You have successfully mined all blocks for ${tokenName}. The token is now ready!`, [
          { id: 'view', type: 'default', text: 'View Token' }
        ]).then((buttonId) => {
          if (buttonId === 'view') {
            navigate(`/token/${tokenId}`);
          }
        });
        
        // Update token status in database
        await supabase
          .from('tokens')
          .update({ status: 'completed' })
          .eq('id', tokenId);
      }
    } catch (err) {
      console.error('Error processing mining success:', err);
      toast.error('Error saving mining result');
    }
  }
  
  function handleStartMining() {
    hapticFeedback.impact('light');
    startMining();
    toast.info('Mining started');
  }
  
  function handleStopMining() {
    hapticFeedback.impact('light');
    stopMining();
    toast.info('Mining paused');
  }
  
  // Format the hash rate to be more readable
  const formatHashRate = (hashRate: number) => {
    if (hashRate >= 1000) {
      return `${(hashRate / 1000).toFixed(2)} KH/s`;
    }
    return `${hashRate.toFixed(2)} H/s`;
  };

  return (
    <Card className="bg-ton-card border-ton-blue/20 shadow-lg mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center">
          <Pickaxe className="h-5 w-5 mr-2 text-ton-blue" />
          {miningComplete ? 'Mining Complete' : 'Token Mining'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-medium text-white">{tokenName}</h3>
            <p className="text-xs text-gray-400">{tokenSymbol}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-white">{miningComplete ? '100%' : `${miningProgress}%`}</p>
            <p className="text-xs text-gray-400">Mining Progress</p>
          </div>
        </div>
        
        <Progress 
          value={miningProgress} 
          className="h-2 bg-gray-800" 
        />
        
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="bg-black/20 p-2 rounded-md">
            <p className="text-xs text-gray-400">Blocks Mined</p>
            <p className="text-sm text-white">{foundBlocks}/{totalBlocks}</p>
          </div>
          
          <div className="bg-black/20 p-2 rounded-md">
            <p className="text-xs text-gray-400">Hash Rate</p>
            <p className="text-sm text-white">
              {stats.running ? formatHashRate(stats.hashRate) : '0 H/s'}
            </p>
          </div>
          
          <div className="bg-black/20 p-2 rounded-md">
            <p className="text-xs text-gray-400">Status</p>
            <p className="text-sm text-white">{
              miningComplete 
                ? <span className="text-green-500">Complete</span> 
                : (stats.running 
                  ? <span className="text-blue-500">Active</span> 
                  : <span className="text-gray-500">Paused</span>)
            }</p>
          </div>
        </div>
        
        {!miningComplete && (
          <div className="text-xs text-gray-400 mb-2">
            <p>Mining tokens requires computational work to be performed. Click Start Mining to begin the process.</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2">
        {miningComplete ? (
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 flex items-center"
            onClick={() => navigate(`/token/${tokenId}`)}
          >
            <Trophy className="h-4 w-4 mr-2" />
            View Token
          </Button>
        ) : (
          <>
            {stats.running ? (
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 flex items-center"
                onClick={handleStopMining}
              >
                <PauseCircle className="h-4 w-4 mr-2" />
                Pause Mining
              </Button>
            ) : (
              <Button 
                className="w-full bg-ton-blue hover:bg-ton-blue/90 flex items-center"
                onClick={handleStartMining}
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Start Mining
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default MiningView;
