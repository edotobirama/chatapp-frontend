// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';


interface AuthContextType {
  isAuthenticated: boolean;
  token : string|null;
  login: (response :{token:string,userId:string}) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );
  const [token , setToken] = useState(localStorage.getItem('token'));

  const login = (response: {token:string, userId:string}) => {
    localStorage.setItem('token', response.token);
    localStorage.setItem('userId', response.userId);
    setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated,token, login, logout }}>
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