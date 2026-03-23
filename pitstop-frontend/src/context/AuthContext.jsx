import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const navigate = useNavigate();

  // Optional token verification - doesn't force logout
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;
      
      try {
        const userData = await api.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userData);
      } catch (error) {
        console.log('Session expired, please login again');
        localStorage.removeItem('token');
      }
    };

    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    try {
      const { access_token } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      const userData = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      setUser(userData);
      
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);