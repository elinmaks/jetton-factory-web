
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Clock, Pickaxe } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useTonConnect } from '@/contexts/TonConnectContext';
import { Token } from '@/hooks/useTokens';

const ActiveMining = () => {
  const { wallet } = useTonConnect();
  const [miningTokens, setMiningTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMiningTokens = async () => {
      if (!wallet?.address) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('tokens')
          .select('*')
          .eq('creator_address', wallet.address)
          .eq('status', 'mining')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setMiningTokens(data as Token[]);
      } catch (err) {
        console.error('Error fetching mining tokens:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMiningTokens();
    
    // Set up real-time subscription for mining tokens
    if (wallet?.address) {
      const subscription = supabase
        .channel('mining-tokens-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'tokens',
          filter: `creator_address=eq.${wallet.address}`
        }, () => {
          fetchMiningTokens();
        })
        .subscribe();
      
      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [wallet?.address]);

  if (loading) {
    return null;
  }

  if (miningTokens.length === 0) {
    return null;
  }

  return (
    <Card className="bg-ton-card border-ton-blue/20 shadow-lg mt-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white flex items-center">
            <Pickaxe className="h-5 w-5 mr-2 text-ton-blue" />
            Active Mining
          </h3>
        </div>
        
        <div className="space-y-4">
          {miningTokens.map((token) => (
            <div key={token.id} className="bg-black/20 rounded-md p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-white font-medium">{token.name}</h4>
                  <p className="text-xs text-gray-400">{token.symbol}</p>
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(token.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Mining Progress</span>
                  <span className="text-ton-blue">0/1 blocks</span>
                </div>
                <Progress value={0} className="h-2 bg-gray-800" />
              </div>
              
              <Link to={`/token/${token.id}`}>
                <Button size="sm" className="w-full bg-ton-blue/20 hover:bg-ton-blue/30 text-ton-blue">
                  Continue Mining
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveMining;
