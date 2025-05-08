import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; // Importe a configuração da API

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async ({ usuario, senha }) => {
    try {
      const response = await api.post('/app/login', { usuario, senha }); 
      const { token } = response.data; 
      setToken(token); 
    } catch (error) {
      console.error('Erro ao fazer login', error);
      throw new Error('Erro ao fazer login');
    }
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
