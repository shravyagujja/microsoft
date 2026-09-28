import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Company {
  id: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  company: Company | null;
  isDemoMode: boolean;
  isLoading: boolean;
  login: (token: string, user: User, company?: Company | null) => void;
  logout: () => void;
  setDemoMode: (isDemo: boolean) => void;
  setCompany: (company: Company) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompanyState] = useState<Company | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const demoMode = localStorage.getItem('demo_mode') === 'true';
      setIsDemoMode(demoMode);

      const token = localStorage.getItem('auth_token');
      if (token && !demoMode) {
        try {
          const res = await apiClient.get<any>('/auth/me');
          if (res.data?.success) {
            setUser(res.data.data.user);
            setCompanyState(res.data.data.company);
          } else {
            localStorage.removeItem('auth_token');
          }
        } catch (e) {
          localStorage.removeItem('auth_token');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = (token: string, u: User, c?: Company | null) => {
    localStorage.setItem('auth_token', token);
    if (c) localStorage.setItem('company_id', c.id);
    localStorage.removeItem('demo_mode');
    setUser(u);
    setCompanyState(c || null);
    setIsDemoMode(false);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('company_id');
    localStorage.removeItem('demo_mode');
    setUser(null);
    setCompanyState(null);
    setIsDemoMode(false);
  };

  const setDemoMode = (isDemo: boolean) => {
    if (isDemo) {
      localStorage.setItem('demo_mode', 'true');
      setIsDemoMode(true);
    } else {
      localStorage.removeItem('demo_mode');
      setIsDemoMode(false);
    }
  };

  const setCompany = (c: Company) => {
    localStorage.setItem('company_id', c.id);
    setCompanyState(c);
  };

  return (
    <AuthContext.Provider value={{ user, company, isDemoMode, isLoading, login, logout, setDemoMode, setCompany }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
