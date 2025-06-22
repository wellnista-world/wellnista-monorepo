'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../api/supabaseClient';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (phone: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check active sessions and sets the user
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const formatPhoneNumber = (rawPhone: string) => {
    const cleaned = rawPhone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return '+66' + cleaned.slice(1);
    }
    return '+66' + cleaned;
  };

  const signIn = async (phone: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const formattedPhone = formatPhoneNumber(phone);
      const { data, error } = await supabase.auth.signInWithPassword({
        phone: formattedPhone,
        password,
      });

      if (error) throw error;
      setUser(data.user);
      router.push('/home');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clear cart data specifically
      if (user) {
        localStorage.removeItem(`cart_${user.id}`);
      }
      localStorage.removeItem('cart_anonymous');
      
      // Clear other local storage and session storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      // Even if there's an error with Supabase logout, we should still clear the local state
      if (error) {
        console.warn('Supabase logout error:', error);
        // Don't throw the error, just log it and continue with local cleanup
      }
      
      // Clear user state
      setUser(null);
      
      // Force redirect to login page
      window.location.href = '/';
      
    } catch (error: unknown) {
      console.error('Logout error:', error);
      
      // Even if there's an error, we should still clear local state and redirect
      if (user) {
        localStorage.removeItem(`cart_${user.id}`);
      }
      localStorage.removeItem('cart_anonymous');
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      setError(null);
      
      // Force redirect to login page
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (phone: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const formattedPhone = formatPhoneNumber(phone);
      const { data, error } = await supabase.auth.signUp({
        phone: formattedPhone,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user returned from signup');

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([{ user_id: data.user.id }]);

      if (profileError) throw profileError;
      router.push('/register');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 