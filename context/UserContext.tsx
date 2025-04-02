import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Alert } from "react-native";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Función mejorada para obtener datos del usuario
  // UserContext.jsx
  const fetchUserData = async () => {
    try {
      // Obtener sesión actual
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setUser(null);
        return;
      }

      // Obtener datos adicionales del usuario
      const { data: userData, error: userError } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id_user", session.user.id) // Usamos el ID de la sesión
        .single();

      if (userError) throw userError;

      // Combinar datos de auth y perfil
      setUser({
        ...userData,
        id: session.user.id, // Asegurar que tenemos el ID correcto
        email: session.user.email,
        email_verified: session.user.email_confirmed_at !== null,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    }
  };

  // Escuchar cambios de autenticación
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        await fetchUserData();
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        router.replace("/");
      }
    });

    // Cargar datos iniciales
    fetchUserData();

    return () => subscription?.unsubscribe();
  }, []);

  const logOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      router.replace("/");
      Alert.alert("Éxito", "Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      Alert.alert("Error", "No se pudo cerrar la sesión");
    }
  };

  // Función para actualizar el contexto después de editar
  const updateUserData = async () => {
    await fetchUserData();
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, logOut, fetchUserData, updateUserData }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe estar dentro de un UserProvider");
  }
  return context;
};
