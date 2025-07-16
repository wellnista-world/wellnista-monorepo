import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../api/supabaseClient';

interface CoinContextType {
  coins: number;
  loading: boolean;
  addCoins: (amount: number) => Promise<void>;
  subtractCoins: (amount: number) => Promise<boolean>;
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
  }, [user]);

  // Add coins to user account
  const addCoins = async (amount: number) => {
    if (!user?.id || amount <= 0) return;

    try {
      const newBalance = coins + amount;
      
      const { error } = await supabase
        .from('users')
        .update({ coins: newBalance })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error adding coins:', error);
      } else {
        setCoins(newBalance);
      }
    } catch (error) {
      console.error('Error adding coins:', error);
    }
  };

  // Subtract coins from user account
  const subtractCoins = async (amount: number): Promise<boolean> => {
    if (!user?.id || amount <= 0) return false;

    if (coins < amount) {
      return false; // Insufficient coins
    }

    try {
      const newBalance = coins - amount;
      
      const { error } = await supabase
        .from('users')
        .update({ coins: newBalance })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error subtracting coins:', error);
        return false;
      } else {
        setCoins(newBalance);
        return true;
      }
    } catch (error) {
      console.error('Error subtracting coins:', error);
      return false;
    }
  };

  // Refresh coins from database
  const refreshCoins = async () => {
    await fetchCoins();
  };

  const value = {
    coins,
    loading,
    addCoins,
    subtractCoins,
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