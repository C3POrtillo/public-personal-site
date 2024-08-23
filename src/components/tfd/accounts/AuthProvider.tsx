import { createContext, useContext, useEffect, useState } from 'react';

import type { FC, PropsWithChildren } from 'react';

export type UserData = {
  username: string;
  id: number;
};

interface AuthContextType {
  isAuthenticated: UserData | undefined;
  login: (user: UserData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<UserData | undefined>(undefined);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/checkAuth');
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.user);
        } else {
          setIsAuthenticated(undefined);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(undefined);
      }
    };

    checkAuth();
  }, []);

  const login = (user: UserData) => {
    setIsAuthenticated(user);
  };
  const logout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setIsAuthenticated(undefined);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
