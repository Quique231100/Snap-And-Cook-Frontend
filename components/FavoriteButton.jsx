import React, { useState, useEffect } from "react";
import { Pressable, Animated, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import Colors from "../assets/colors/Colors";
import { useUser } from "../context/UserContext"; // Importar el contexto del usuario

const FavoriteButton = ({ idPlatillo, isFavoritoInicial, onToggle }) => {
  const { user } = useUser(); // Obtener el usuario desde el contexto
  const [userId, setUserId] = useState(null); // Guardar el ID INT8 del usuario
  const [isFavorito, setIsFavorito] = useState(isFavoritoInicial);
  const [scaleValue] = useState(new Animated.Value(1));

  // Obtener el ID INT8 del usuario desde la base de datos
  const fetchUserId = async () => {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("id")
        .eq("id_user", user.id) // Usar el UUID del usuario
        .single();

      if (error) {
        console.error("Error al obtener el ID del usuario:", error);
        Alert.alert("Error", "No se pudo obtener el ID del usuario.");
        return null;
      }

      setUserId(data.id); // Guardar el ID INT8 en el estado
    } catch (error) {
      console.error("Error al obtener el ID del usuario:", error);
      Alert.alert("Error", "No se pudo obtener el ID del usuario.");
    }
  };

  // Llamar a `fetchUserId` al montar el componente
  useEffect(() => {
    if (user?.id) {
      fetchUserId();
    }
  }, [user]);

  const toggleFavorito = async () => {
    if (!userId) {
      Alert.alert("Error", "No se pudo obtener el ID del usuario.");
      return;
    }

    try {
      if (isFavorito) {
        // Eliminar de favoritos
        const { error } = await supabase
          .from("favoritos")
          .delete()
          .eq("id_usuario", userId)
          .eq("id_platillo", idPlatillo);

        if (error) throw error;

        setIsFavorito(false);
        if (onToggle) onToggle(false); // Notificar al padre
      } else {
        // Agregar a favoritos
        const { error } = await supabase.from("favoritos").insert({
          id_usuario: userId,
          id_platillo: idPlatillo,
        });

        if (error) throw error;

        setIsFavorito(true);
        if (onToggle) onToggle(true); // Notificar al padre
      }
    } catch (error) {
      console.error("Error al alternar favorito:", error);
      Alert.alert("Error", "No se pudo actualizar el estado de favorito.");
    }
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => toggleFavorito());
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Ionicons
          name="heart"
          size={24}
          color={isFavorito ? Colors.rojo : Colors.beige}
        />
      </Animated.View>
    </Pressable>
  );
};

export default FavoriteButton;
