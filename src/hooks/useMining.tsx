
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useTonConnect } from '@/contexts/TonConnectContext';
import { hapticFeedback } from '@/utils/telegram';

export interface MiningStats {
  hashRate: number;
  hashesComputed: number;
  timeElapsed: number;
  foundBlocks: number;
  difficulty: number;
  running: boolean;
}

export interface MiningResult {
  hash: string;
  nonce: number;
  timeElapsed: number;
  hashesComputed: number;
}

interface UseMiningProps {
  tokenId?: string;
  initialDifficulty?: number;
  onSuccess?: (result: MiningResult) => void;
}

export const useMining = ({ 
  tokenId, 
  initialDifficulty = 4,
  onSuccess 
}: UseMiningProps = {}) => {
  const { wallet } = useTonConnect();
  const [stats, setStats] = useState<MiningStats>({
    hashRate: 0,
    hashesComputed: 0,
    timeElapsed: 0,
    foundBlocks: 0,
    difficulty: initialDifficulty,
    running: false
  });
  
  const [blockData, setBlockData] = useState<string>('');
  const [targetPrefix, setTargetPrefix] = useState<string>('');
  const [latestResult, setLatestResult] = useState<MiningResult | null>(null);
  
  const workerRef = useRef<Worker | null>(null);
  
  // Initialize block data and target prefix
  useEffect(() => {
    // Generate random block data if not provided
    if (!blockData) {
      const randomData = `TokenForge_${Date.now()}_${Math.random()}_${tokenId || 'general'}`;
      setBlockData(randomData);
    }
    
    // Set target prefix based on difficulty (number of leading zeros)
    const prefix = '0'.repeat(stats.difficulty);
    setTargetPrefix(prefix);
  }, [tokenId, stats.difficulty, blockData]);
  
  // Function to start mining
  const startMining = useCallback(() => {
    if (stats.running) return;
    
    try {
      // Create a new worker
      const worker = new Worker(new URL('../workers/miningWorker.ts', import.meta.url), { type: 'module' });
      workerRef.current = worker;
      
      // Handle messages from the worker
      worker.onmessage = async (e) => {
        const data = e.data;
        
        if (data.type === 'progress') {
          // Update mining stats
          setStats(prevStats => ({
            ...prevStats,
            hashRate: data.hashRate,
            hashesComputed: data.hashesComputed,
            timeElapsed: data.timeElapsed
          }));
        } 
        else if (data.type === 'success') {
          // Handle successful mining
          const result = {
            hash: data.hash,
            nonce: data.nonce,
            timeElapsed: data.timeElapsed,
            hashesComputed: data.hashesComputed
          };
          
          // Save block to database
          if (wallet) {
            try {
              const { error } = await supabase.from('mining_shares').insert({
                hash: result.hash,
                nonce: result.nonce,
                block_number: stats.foundBlocks + 1,
                user_id: wallet.address,
                is_valid: true
              });
              
              if (error) throw error;
              
              // Update stats
              setStats(prevStats => ({
                ...prevStats,
                foundBlocks: prevStats.foundBlocks + 1,
                running: false
              }));
              
              setLatestResult(result);
              
              // Provide haptic feedback if in Telegram
              hapticFeedback.notification('success');
              
              // Notify user
              toast.success('Block found!', {
                description: `Hash: ${result.hash.substring(0, 10)}...`
              });
              
              // Call success handler
              if (onSuccess) {
                onSuccess(result);
              }
            } catch (error) {
              console.error('Error saving mining result:', error);
              toast.error('Error saving mining result');
            }
          }
          
          // Stop mining
          stopMining();
        }
      };
      
      // Start the worker
      worker.postMessage({
        blockData,
        difficulty: stats.difficulty,
        targetPrefix
      });
      
      // Update state
      setStats(prevStats => ({
        ...prevStats,
        running: true
      }));
      
      toast.info('Mining started', {
        description: `Finding hash with ${stats.difficulty} leading zeros`
      });
      
    } catch (error) {
      console.error('Error starting mining:', error);
      toast.error('Failed to start mining');
    }
  }, [stats.difficulty, stats.running, stats.foundBlocks, targetPrefix, blockData, wallet, onSuccess]);
  
  // Function to stop mining
  const stopMining = useCallback(() => {
    if (!stats.running) return;
    
    try {
      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'stop' });
        workerRef.current.terminate();
        workerRef.current = null;
      }
      
      // Update state
      setStats(prevStats => ({
        ...prevStats,
        running: false
      }));
      
      toast.info('Mining stopped');
      
    } catch (error) {
      console.error('Error stopping mining:', error);
      toast.error('Failed to stop mining');
    }
  }, [stats.running]);
  
  // Clean up worker on unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);
  
  return {
    stats,
    startMining,
    stopMining,
    targetPrefix,
    latestResult,
    setDifficulty: (difficulty: number) => setStats(prev => ({ ...prev, difficulty }))
  };
};

export default useMining;
