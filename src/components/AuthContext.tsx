import { createContext, useContext, useState } from 'react';

const AuthContext = createContext<{ loggedIn: boolean; setLoggedIn: (status: boolean) => void } | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
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
