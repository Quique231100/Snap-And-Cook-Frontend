import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  nombre: string;
  apellidos: string;
  email: string;
  sexo: string;
  edad: number;
  estatura: number;
  peso: number;
};

type UserContextType = {
  user: User | null;
  isAuthenticated: boolean;
  updateUser: (newData: Partial<User>) => void;
  logout: () => Promise<void>;
  login: (userData: User) => Promise<void>;
  loadingAuth: boolean;
};

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Verificar autenticación al iniciar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
      } finally {
        setLoadingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (userData: User) => {
    try {
      setLoadingAuth(true);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    } finally {
      setLoadingAuth(false);
    }
  };

  const updateUser = async (newData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...newData };
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setLoadingAuth(true);
      await AsyncStorage.removeItem('userData');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    } finally {
      setLoadingAuth(false);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      isAuthenticated, 
      updateUser, 
      logout, 
      login,
      loadingAuth
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);