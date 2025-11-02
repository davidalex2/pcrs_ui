import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, LoginRequest } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getUser();
    if (storedUser && authService.isAuthenticated()) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    // store token first so subsequent requests (me) include it
    authService.setToken(response.token);

    // Fetch full user profile (includes roles) from backend
    try {
      const userProfile = await authService.me();
      authService.setUser(userProfile);
      setUser(userProfile);
    } catch (err) {
      // Fallback: store minimal data if profile fetch fails
      const userData: User = {
        email: credentials.email,
        fullName: '',
        phone: '',
      };
      authService.setUser(userData);
      setUser(userData);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user && authService.isAuthenticated(),
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

