import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Pressable,
  ImageBackground,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../../../assets/colors/Colors";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

const Favorites = () => {
  const { user } = useUser();
  const [favoritos, setFavoritos] = useState([]);
  const router = useRouter();

  // Función para obtener los favoritos
  const fetchFavoritos = async () => {
    if (!user || !user.sub) {
      console.error("El usuario no está autenticado.");
      return [];
    }

    try {
      // Obtener los IDs de los favoritos
      const { data: favoritosData, error: favoritosError } = await supabase
        .from("favoritos")
        .select("id_platillo")
        .eq("id_user", user.sub);

      if (favoritosError) {
        console.error("Error al obtener favoritos:", favoritosError);
        return [];
      }

      const favoritosIds = favoritosData.map((fav) => fav.id_platillo);

      if (favoritosIds.length === 0) {
        console.log("No hay favoritos para este usuario.");
        setFavoritos([]);
        return;
      }

      // Obtener los detalles de los platillos favoritos directamente desde la tabla `platillos`
      const { data: platillosData, error: platillosError } = await supabase
        .from("platillos")
        .select("*")
        .in("id", favoritosIds); // Filtrar por los IDs de los favoritos

      if (platillosError) {
        console.error("Error al obtener platillos favoritos:", platillosError);
        return [];
      }

      console.log("Platillos favoritos obtenidos:", platillosData);

      // Procesar los datos para incluir la propiedad `isFavorito`
      const favoritos = platillosData.map((platillo) => ({
        ...platillo,
        isFavorito: true, // Todos los platillos en esta lista son favoritos
      }));

      setFavoritos(favoritos); // Actualizar el estado con los platillos favoritos
    } catch (error) {
      console.error("Error al obtener favoritos:", error);
    }
  };

  // Ejecutar `fetchFavoritos` cada vez que la ventana se enfoque
  useFocusEffect(
    React.useCallback(() => {
      fetchFavoritos();
    }, [user])
  );

  // Función para alternar favoritos
  const toggleFavorito = async (id_platillo) => {
    if (!user || !user.sub) {
      console.error("El usuario no está autenticado.");
      return;
    }

    const isFavorito = favoritos.some((fav) => fav.id === id_platillo);

    if (isFavorito) {
      // Eliminar de favoritos
      try {
        const { error } = await supabase
          .from("favoritos")
          .delete()
          .eq("id_platillo", id_platillo)
          .eq("id_user", user.sub);

        if (error) {
          console.error("Error al eliminar de favoritos:", error);
          Alert.alert("Error", "No se pudo eliminar el platillo de favoritos.");
          return;
        }

        // Actualizar el estado
        setFavoritos((prevFavoritos) =>
          prevFavoritos.filter((fav) => fav.id !== id_platillo)
        );
        console.log(`Platillo ${id_platillo} eliminado de favoritos.`);
      } catch (error) {
        console.error("Error al eliminar de favoritos:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>
      <FlatList
        data={favoritos} // Usar el estado `favoritos` que contiene `platillosData`
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              router.push({
                pathname: "/loged/favorites/recipe",
                params: {
                  nombre: item.nombre, // Cambiado a `nombre`
                  img: item.imagen, // Cambiado a `imagen`
                  ingredientes: item.ingredientes, // Si existe esta propiedad
                  instrucciones: item.instrucciones, // Cambiado a `instrucciones`
                },
              });
            }}
          >
            <View style={styles.itemCont}>
              <ImageBackground
                source={{ uri: item.imagen }} // Cambiado a `imagen`
                style={styles.imgItemCont}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.8)", "transparent"]}
                  style={styles.background}
                  start={{ x: 0.5, y: 1.1 }}
                  end={{ x: 0.5, y: 0 }}
                />
                {/* Botón de favorito */}
                <Pressable
                  style={styles.favButton}
                  onPress={() => toggleFavorito(item.id)}
                >
                  <Ionicons
                    name="heart"
                    size={24}
                    color={item.isFavorito ? Colors.rojo : Colors.beige}
                  />
                </Pressable>
                <View style={styles.txtItemCont}>
                  <Text style={styles.txtItem}>{item.nombre}</Text>
                </View>
              </ImageBackground>
            </View>
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View style={{ marginVertical: screenHeight * 0.015 }} />
        )}
      />
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.beige,
    padding: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 16,
    color: Colors.grisOscuro,
  },
  itemCont: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  imgItemCont: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 200,
  },
  favButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Colors.verdeGasolina, // Color de fondo del botón
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  txtItemCont: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  txtItem: {
    color: Colors.beige,
    fontSize: 18,
    fontWeight: "bold",
  },
});
