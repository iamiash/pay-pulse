import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { userApi } from '../api/userApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('paypulse_token') || localStorage.getItem('token') || localStorage.getItem('access_token')
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      userApi
        .getProfile()
        .then((res) => {
          if (
            res.data.account_status === 'SUSPENDED' ||
            res.data.account_status === 'BANNED' ||
            res.data.account_status === 'DEACTIVATED'
          ) {
            logout();
          } else {
            setUser(res.data);
          }
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('paypulse_token', newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('paypulse_token');
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);