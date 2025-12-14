
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, SubscriptionPlan } from '../types';
import { TOKENS_PER_MESSAGE } from '../constants';
import { firebaseService } from '../services/firebaseService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with a default Guest Admin User immediately
  const [user, setUser] = useState<User | null>(() => {
      // Try to recover existing guest session to keep chat history linked locally
      try {
          const stored = localStorage.getItem('openyhool_guest_user');
          if (stored) return JSON.parse(stored);
      } catch (e) {}

      // Create a new Guest Admin Identity
      const newUser: User = {
          id: 'guest_' + Math.random().toString(36).substr(2, 9),
          name: 'Guest Admin',
          email: 'admin@openyhool.public',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
          subscriptionPlan: 'lifetime',
          isPro: true,
          tokens: 999999,
          isAdmin: true, // Everyone is Admin
          isBanned: false,
          joinedAt: Date.now()
      };
      
      try {
          localStorage.setItem('openyhool_guest_user', JSON.stringify(newUser));
      } catch (e) {}
      
      return newUser;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync user creation to backend (best effort)
  useEffect(() => {
      if (user) {
          firebaseService.createUser(user).catch(() => {});
      }
  }, []);

  const login = async () => {
      // No-op: Already logged in as Guest
      console.log("Authentication disabled: You are already logged in as Guest Admin.");
  };

  const register = async () => {
      // No-op
  };

  const logout = async () => {
      // No-op: Cannot logout in this public mode
      alert("Authentication is disabled for this site. You are permanently logged in as Guest Admin.");
  };

  const subscribe = async (plan: SubscriptionPlan) => {
    if (!user) return;

    let updatedUser = { ...user, subscriptionPlan: plan };

    if (plan === 'free') {
      updatedUser.isPro = false;
      updatedUser.tokens = 10000;
    } else if (plan === 'pro' || plan === 'lifetime') {
      updatedUser.isPro = true;
      updatedUser.tokens = 999999; 
    }

    setUser(updatedUser);
    localStorage.setItem('openyhool_guest_user', JSON.stringify(updatedUser));
    
    // Attempt async update to DB (fire and forget)
    firebaseService.updateUser(user.id, {
        subscriptionPlan: plan,
        isPro: updatedUser.isPro,
        tokens: updatedUser.tokens
    }).catch(() => {});
    
    firebaseService.addLog({ type: 'ACTION', message: `User ${user.email} subscribed to ${plan}` }).catch(() => {});
  };

  const deductTokens = (amount: number = TOKENS_PER_MESSAGE): boolean => {
    if (!user) return false;
    // Admin/Pro always free
    return true; 
  };

  const loginAsDev = () => {
      // No-op
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, subscribe, deductTokens, loginAsDev }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
