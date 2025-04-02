import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import Colors from "../../../assets/colors/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../../context/UserContext";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const RecetaPage = () => {
  const { id, nombre, img, ingredientes, instrucciones } =
    useLocalSearchParams();

  const [isFavorito, setIsFavorito] = useState(false);

  // Verificar si la receta es un favorito
  const checkIfFavorito = async () => {
    try {
      // Obtener el usuario autenticado
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        console.error("Error al obtener el usuario autenticado:", userError);
        return;
      }

      const userId = userData?.user?.id;

      if (!userId) {
        console.error("El ID del usuario no está definido.");
        return;
      }

      // Verificar si la receta es un favorito
      const { data, error } = await supabase
        .from("favoritos")
        .select("id_platillo")
        .eq("id_user", userId)
        .eq("id_platillo", parseInt(id, 10));

      if (error) {
        console.error("Error al verificar favoritos:", error);
        return;
      }

      setIsFavorito(data.length > 0); // Si hay datos, la receta es un favorito
    } catch (error) {
      console.error("Error al verificar favoritos:", error);
    }
  };

  // Alternar el estado de favorito
  const toggleFavorito = async () => {
    try {
      // Obtener el usuario autenticado
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        console.error("Error al obtener el usuario autenticado:", userError);
        return;
      }

      const userId = userData?.user?.id;

      if (!userId) {
        console.error("El ID del usuario no está definido.");
        return;
      }

      if (isFavorito) {
        // Eliminar de favoritos
        const { error } = await supabase
          .from("favoritos")
          .delete()
          .eq("id_user", userId)
          .eq("id_platillo", parseInt(id, 10));

        if (error) {
          console.error("Error al eliminar de favoritos:", error);
          Alert.alert("Error", "No se pudo eliminar la receta de favoritos.");
          return;
        }

        setIsFavorito(false);
      } else {
        // Agregar a favoritos
        const { error } = await supabase.from("favoritos").insert({
          id_user: userId,
          id_platillo: parseInt(id, 10),
        });

        if (error) {
          console.error("Error al agregar a favoritos:", error);
          Alert.alert("Error", "No se pudo agregar la receta a favoritos.");
          return;
        }

        setIsFavorito(true);
      }
    } catch (error) {
      console.error("Error al alternar favorito:", error);
    }
  };

  // Procesar ingredientes e instrucciones
  const ingredientesArray = Array.isArray(ingredientes)
    ? ingredientes
    : typeof ingredientes === "string"
    ? ingredientes.replace(/[{}]/g, "").split(",")
    : [];

  const instruccionesArray = Array.isArray(instrucciones)
    ? instrucciones
    : typeof instrucciones === "string"
    ? instrucciones.replace(/[{}]/g, "").split(",")
    : [];

  // Verificar el estado de favorito al cargar la página
  useEffect(() => {
    checkIfFavorito();
  }, []);

  return (
    <View style={styles.container}>
      {/* Imagen y botón de favorito */}
      <ImageBackground source={{ uri: img }} style={styles.imgCont}>
        <LinearGradient
          colors={["rgba(0,0,0,0.8)", "transparent"]}
          style={styles.background}
          start={{ x: 0.5, y: 1.5 }}
          end={{ x: 0.5, y: 0 }}
        />
        <Pressable onPress={toggleFavorito} style={styles.favButton}>
          <Ionicons
            name="heart"
            size={24}
            color={isFavorito ? Colors.rojo : Colors.beige}
          />
        </Pressable>
        <Text style={styles.txtDish}>{nombre}</Text>
      </ImageBackground>

      {/* Contenedor de receta */}
      <View style={styles.recipeCont}>
        {/* Ingredientes */}
        <View style={styles.ingredientesCont}>
          <Text style={styles.txtSubtitle}>Ingredientes</Text>
          {ingredientesArray.map((ingrediente, index) => (
            <Text key={index} style={styles.txtAPI}>
              - {ingrediente.trim()}
            </Text>
          ))}
        </View>

        {/* Instrucciones */}
        <View style={styles.instruccionesCont}>
          <Text style={styles.txtSubtitle}>Instrucciones</Text>
          {instruccionesArray.map((instruccion, index) => (
            <Text key={index} style={styles.txtAPI}>
              - {instruccion.trim()}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

export default RecetaPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.beige,
    alignItems: "center",
  },
  imgCont: {
    width: screenWidth,
    height: screenHeight * 0.4,
    resizeMode: "contain",
    justifyContent: "flex-end",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: screenHeight * 0.4,
  },
  favButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 50,
    padding: 5,
    zIndex: 10,
  },
  txtDish: {
    color: Colors.beige,
    fontSize: 30,
    fontWeight: "bold",
    marginLeft: screenWidth * 0.05,
    marginBottom: screenHeight * 0.01,
  },
  recipeCont: {
    flex: 1,
    width: screenWidth * 0.9,
    marginTop: 20,
  },
  ingredientesCont: {
    marginBottom: 20,
  },
  instruccionesCont: {
    marginBottom: 20,
  },
  txtSubtitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.verdeMuyOscuro,
    marginBottom: 10,
  },
  txtAPI: {
    fontSize: 18,
    color: Colors.verdeMuyOscuro,
    marginBottom: 5,
  },
});
