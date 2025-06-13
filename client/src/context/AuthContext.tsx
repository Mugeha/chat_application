import { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
  _id: string;
  username: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('chat-user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (data: User) => {
    setUser(data);
    localStorage.setItem('chat-user', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chat-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
