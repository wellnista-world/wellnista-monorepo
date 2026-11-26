import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../api/supabaseClient';

interface CoinContextType {
  coins: number;
  loading: boolean;
  refreshCoins: () => Promise<void>;
}

const CoinContext = createContext<CoinContextType | undefined>(undefined);

export const CoinProvider = ({ children }: { children: ReactNode }) => {
  const [coins, setCoins] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch user coins from database
  const fetchCoins = async () => {
    if (!user?.id) {
      setCoins(0);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('coins')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching coins:', error);
        setCoins(0);
      } else {
        setCoins(data?.coins || 0);
      }
    } catch (error) {
      console.error('Error fetching coins:', error);
      setCoins(0);
    } finally {
      setLoading(false);
    }
  };

  // Load coins when user changes
  useEffect(() => {
    fetchCoins();
  }, [user?.id]);

  // coins is a server-owned balance: it is read here but NEVER written from the client.
  // A client write can't be trusted (a user could set any balance), and the DB now blocks
  // UPDATE(coins) for the authenticated role (see coins_server_only.sql). Any future earn/
  // spend must go through a server route using the service role (e.g. /api/deduct-points),
  // then call refreshCoins() to re-read the authoritative balance.

  // Refresh coins from database
  const refreshCoins = async () => {
    await fetchCoins();
  };

  const value = {
    coins,
    loading,
    refreshCoins,
  };

  return <CoinContext.Provider value={value}>{children}</CoinContext.Provider>;
};

export const useCoins = () => {
  const context = useContext(CoinContext);
  if (context === undefined) {
    throw new Error('useCoins must be used within a CoinProvider');
  }
  return context;
}; 