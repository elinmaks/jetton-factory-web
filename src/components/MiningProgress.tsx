
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Cpu, ChevronRight, Play, Square } from 'lucide-react';
import { useMining, MiningStats } from '@/hooks/useMining';

interface MiningProgressProps {
  tokenId?: string;
  targetBlocks?: number;
  difficulty?: number;
  onComplete?: () => void;
  className?: string;
}

const MiningProgress: React.FC<MiningProgressProps> = ({
  tokenId,
  targetBlocks = 1,
  difficulty = 4,
  onComplete,
  className = ''
}) => {
  const { 
    stats, 
    startMining, 
    stopMining,
    latestResult
  } = useMining({ 
    tokenId, 
    initialDifficulty: difficulty,
    onSuccess: (result) => {
      if (stats.foundBlocks >= targetBlocks && onComplete) {
        onComplete();
      }
    }
  });
  
  // Calculate progress percentage
  const progressPercentage = Math.min(
    (stats.foundBlocks / targetBlocks) * 100,
    100
  );
  
  // Format hash rate
  const formatHashRate = (hashRate: number) => {
    if (hashRate > 1000000) {
      return `${(hashRate / 1000000).toFixed(2)} MH/s`;
    } else if (hashRate > 1000) {
      return `${(hashRate / 1000).toFixed(2)} KH/s`;
    }
    return `${hashRate.toFixed(2)} H/s`;
  };
  
  // Format time elapsed
  const formatTimeElapsed = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Cpu className="h-5 w-5 mr-2 text-ton-blue" />
          <h3 className="text-lg font-semibold text-white">
            Mining Progress
          </h3>
        </div>
        
        {stats.foundBlocks >= targetBlocks ? (
          <span className="bg-ton-success/20 text-ton-success text-xs font-medium py-1 px-2 rounded-full">
            Completed
          </span>
        ) : (
          <span className="bg-ton-blue/20 text-ton-blue text-xs font-medium py-1 px-2 rounded-full">
            {stats.foundBlocks} / {targetBlocks} Blocks
          </span>
        )}
      </div>
      
      <Progress value={progressPercentage} className="h-3" />
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-ton-blue/10 rounded-md p-3">
          <div className="text-gray-400 mb-1">Hash Rate</div>
          <div className="text-white font-mono">
            {stats.running ? formatHashRate(stats.hashRate) : '0 H/s'}
          </div>
        </div>
        
        <div className="bg-ton-blue/10 rounded-md p-3">
          <div className="text-gray-400 mb-1">Time Elapsed</div>
          <div className="text-white font-mono">
            {formatTimeElapsed(stats.timeElapsed)}
          </div>
        </div>
        
        <div className="bg-ton-blue/10 rounded-md p-3">
          <div className="text-gray-400 mb-1">Difficulty</div>
          <div className="text-white font-mono">
            {difficulty.toFixed(1)} ({`0`.repeat(difficulty)})
          </div>
        </div>
        
        <div className="bg-ton-blue/10 rounded-md p-3">
          <div className="text-gray-400 mb-1">Blocks Found</div>
          <div className="text-white font-mono">
            {stats.foundBlocks} / {targetBlocks}
          </div>
        </div>
      </div>
      
      {latestResult && (
        <div className="bg-ton-success/10 border border-ton-success/20 rounded-md p-3 mt-4">
          <div className="text-ton-success font-medium mb-1">Latest Block</div>
          <div className="text-gray-300 text-xs font-mono break-all">
            {latestResult.hash}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Nonce: {latestResult.nonce}</span>
            <span>{(latestResult.hashesComputed / 1000).toFixed(1)}K hashes</span>
          </div>
        </div>
      )}
      
      <div className="flex gap-3">
        {!stats.running && stats.foundBlocks < targetBlocks && (
          <Button 
            onClick={startMining} 
            className="flex-1 token-gradient"
            disabled={stats.foundBlocks >= targetBlocks}
          >
            <Play className="h-4 w-4 mr-2" />
            Start Mining
          </Button>
        )}
        
        {stats.running && (
          <Button 
            onClick={stopMining} 
            variant="outline" 
            className="flex-1 border-red-500 text-red-500"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop Mining
          </Button>
        )}
        
        {stats.foundBlocks >= targetBlocks && onComplete && (
          <Button 
            onClick={onComplete} 
            className="flex-1 token-gradient"
          >
            Continue
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MiningProgress;
