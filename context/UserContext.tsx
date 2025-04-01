import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ 
    nombre: "",
    apellidos: "",
    email: "",
    sexo: "",
    edad: null,
    estatura: null,
    peso: null
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Cargar datos al iniciar
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('userData');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoadingAuth(false);
      }
    };
    loadUser();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser({ nombre: "", apellidos: "", email: "", sexo: "", edad: null, estatura: null, peso: null });
    setIsAuthenticated(false);
    await AsyncStorage.removeItem('userData');
  };

  const updateUser = async (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        setUser, 
        isAuthenticated, 
        loadingAuth,
        login,
        logout,
        updateUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de UserProvider");
  }
  return context;
};