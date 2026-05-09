import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, fullName: string) => Promise<boolean>;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  scanLimitMessage: string;
  setScanLimitMessage: (message: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [scanLimitMessage, setScanLimitMessage] = useState('');

  useEffect(() => {
    // Check localStorage for existing user
    const storedUser = localStorage.getItem('internveritas_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    // Check if this user signed up before (has stored name)
    const storedAccounts = JSON.parse(localStorage.getItem('internveritas_accounts') || '{}');
    const fullName = storedAccounts[email] || email.split('@')[0];
    const user = { email, fullName };
    setUser(user);
    localStorage.setItem('internveritas_user', JSON.stringify(user));
    
    // Reset scan count on login
    localStorage.removeItem('internveritas_scan_count');
    return true;
  };

  const signup = async (email: string, _password: string, fullName: string): Promise<boolean> => {
    const user = { email, fullName };
    setUser(user);
    localStorage.setItem('internveritas_user', JSON.stringify(user));
    // Store the name so login can retrieve it later
    const storedAccounts = JSON.parse(localStorage.getItem('internveritas_accounts') || '{}');
    storedAccounts[email] = fullName;
    localStorage.setItem('internveritas_accounts', JSON.stringify(storedAccounts));
    
    // Reset scan count on signup
    localStorage.removeItem('internveritas_scan_count');
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('internveritas_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        scanLimitMessage,
        setScanLimitMessage,
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
