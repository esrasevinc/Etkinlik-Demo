import React, { createContext, useContext, useState } from 'react';

interface AuthContextProps {
  role: string; 
  loginAsAdmin: () => void;
  loginAsUser: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<string>('user'); // veya varsayılan bir rol

  const loginAsAdmin = () => setRole('admin');
  const loginAsUser = () => setRole('user');

  return (
    <AuthContext.Provider value={{ role, loginAsAdmin, loginAsUser }}>
      {children}
    </AuthContext.Provider>
  );
};
