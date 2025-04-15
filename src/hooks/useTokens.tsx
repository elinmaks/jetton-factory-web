
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Token {
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

interface UseTokensProps {
  status?: string;
  limit?: number;
}

export const useTokens = ({ status, limit = 10 }: UseTokensProps = {}) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('tokens')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);
        
        if (status) {
          query = query.eq('status', status);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setTokens(data as Token[]);
      } catch (err) {
        console.error('Error fetching tokens:', err);
        setError(err as Error);
        toast.error('Failed to load tokens');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTokens();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('tokens-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tokens'
      }, () => {
        fetchTokens();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [status, limit]);
  
  return { tokens, loading, error };
};

export default useTokens;
