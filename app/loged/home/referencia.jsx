import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import Colors from "../../../assets/colors/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../../context/UserContext";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const RecetaPage = () => {
  const { id, nombre, img, ingredientes, instrucciones, userId } =
    useLocalSearchParams(); // Recibir el userId como parámetro

  const [isFavorito, setIsFavorito] = React.useState(false);

  // Usar el userId directamente en las consultas
  const checkIfFavorito = async () => {
    if (!userId) {
      console.error("El ID del usuario no está definido.");
      return;
    }

    const { data, error } = await supabase
      .from("favoritos")
      .select("id_platillo")
      .eq("id_usuario", userId)
      .eq("id_platillo", parseInt(id, 10));

    if (error) {
      console.error("Error al verificar favoritos:", error);
    } else {
      setIsFavorito(data.length > 0); // Si hay datos, el platillo es favorito
    }
  };

  React.useEffect(() => {
    if (id) {
      checkIfFavorito();
    }
  }, [id]);

  // Alternar favoritos
  const toggleFavorito = async () => {
    if (!userId) {
      console.error("El ID del usuario no está definido.");
      Alert.alert("Error", "No se pudo realizar la acción.");
      return;
    }

    if (isFavorito) {
      // Eliminar de favoritos
      const { error } = await supabase
        .from("favoritos")
        .delete()
        .eq("id_usuario", userId)
        .eq("id_platillo", parseInt(id, 10));

      if (error) {
        console.error("Error al eliminar de favoritos:", error);
        Alert.alert("Error", "No se pudo eliminar de favoritos.");
      } else {
        setIsFavorito(false);
        Alert.alert("Éxito", "Receta eliminada de favoritos.");
      }
    } else {
      // Agregar a favoritos
      const { error } = await supabase.from("favoritos").insert({
        id_usuario: userId,
        id_platillo: parseInt(id, 10),
      });

      if (error) {
        console.error("Error al agregar a favoritos:", error);
        Alert.alert("Error", "No se pudo agregar a favoritos.");
      } else {
        setIsFavorito(true);
        Alert.alert("Éxito", "Receta agregada a favoritos.");
      }
    }
  };

  // Convertir ingredientes a un array si es necesario
  const ingredientesArray = Array.isArray(ingredientes)
    ? ingredientes
    : typeof ingredientes === "string"
    ? ingredientes.replace(/[{}]/g, "").split(",")
    : [];

  return (
    <View style={styles.container}>
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

      <View style={styles.recipeCont}>
        <View style={styles.section}>
          <Text style={styles.txtSubtitle}>Ingredientes</Text>
          {ingredientesArray.length > 0 ? (
            <FlatList
              data={ingredientesArray}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={styles.txtItem}>- {item.trim()}</Text>
              )}
            />
          ) : (
            <Text style={styles.txtItem}>No hay ingredientes disponibles.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.txtSubtitle}>Instrucciones</Text>
          <Text style={styles.txtItem}>{instrucciones}</Text>
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
    resizeMode: "cover",
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
    top: 20,
    right: 20,
    backgroundColor: Colors.verdeGasolina,
    padding: 10,
    borderRadius: 25,
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
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: Colors.beigeClaro,
    borderRadius: 10,
  },
  txtSubtitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.verdeMuyOscuro,
    marginBottom: 10,
  },
  txtItem: {
    fontSize: 16,
    color: Colors.verdeOscuro,
    marginBottom: 5,
  },
});
