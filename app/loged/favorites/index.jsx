import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  ImageBackground,
  Pressable,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../../assets/colors/Colors";
import { supabase } from "../../../lib/supabase";
import { useUser } from "../../../context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native"; // Importar useFocusEffect
import { useRouter } from "expo-router"; // Importar useRouter para la navegación

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

const Favorites = () => {
  const { user } = useUser();
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scaleValue] = useState(new Animated.Value(1));
  const router = useRouter(); // Inicializar el router para la navegación

  // Obtener el ID del usuario desde la tabla "usuarios"
  const fetchUserId = async () => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id")
      .eq("id_user", user.id)
      .single();

    if (error) {
      console.error("Error al obtener el ID del usuario:", error);
      Alert.alert("Error", "No se pudo obtener el ID del usuario.");
      return null;
    }

    return data.id;
  };

  // Obtener IDs de favoritos del usuario
  const fetchFavoritos = async (userId) => {
    const { data, error } = await supabase
      .from("favoritos")
      .select("id_platillo")
      .eq("id_usuario", userId);

    if (error) {
      console.error("Error al obtener favoritos:", error);
      Alert.alert("Error", "No se pudieron cargar los favoritos.");
      return [];
    }

    return data.map((fav) => fav.id_platillo);
  };

  // Obtener todos los platillos
  const fetchPlatillos = async () => {
    const { data, error } = await supabase.rpc("obtener_platillos");

    if (error) {
      console.error("Error al obtener platillos:", error);
      Alert.alert("Error", "No se pudieron cargar los platillos.");
      return [];
    }

    return data;
  };

  // Combinar favoritos con los datos de los platillos
  const fetchData = async () => {
    setLoading(true);

    const userId = await fetchUserId();
    if (!userId) {
      setLoading(false);
      return;
    }

    const [favoritosIds, platillosData] = await Promise.all([
      fetchFavoritos(userId),
      fetchPlatillos(),
    ]);

    const favoritosData = platillosData.filter((platillo) =>
      favoritosIds.includes(platillo.id)
    );

    setFavoritos(favoritosData);
    setLoading(false);
  };

  // Alternar favoritos (agregar o eliminar)
  const toggleFavorito = async (id_platillo) => {
    const userId = await fetchUserId();
    if (!userId) {
      return;
    }

    const isFavorito = favoritos.some(
      (platillo) => platillo.id === id_platillo
    );

    if (isFavorito) {
      // Eliminar de favoritos
      const { error } = await supabase
        .from("favoritos")
        .delete()
        .eq("id_usuario", userId)
        .eq("id_platillo", id_platillo);

      if (error) {
        console.error("Error al eliminar de favoritos:", error);
        Alert.alert("Error", "No se pudo eliminar el platillo de favoritos.");
      } else {
        setFavoritos((prev) =>
          prev.filter((platillo) => platillo.id !== id_platillo)
        );
      }
    } else {
      // Agregar a favoritos
      const { error } = await supabase.from("favoritos").insert({
        id_usuario: userId,
        id_platillo,
      });

      if (error) {
        console.error("Error al agregar a favoritos:", error);
        Alert.alert("Error", "No se pudo agregar el platillo a favoritos.");
      } else {
        const platillo = favoritos.find(
          (platillo) => platillo.id === id_platillo
        );
        setFavoritos((prev) => [...prev, platillo]);
      }
    }
  };

  const handleFavoritePress = (id_platillo) => {
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
    ]).start(() => toggleFavorito(id_platillo));
  };

  // Recargar la lista de favoritos al enfocar la pantalla
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.verdeGasolina} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>
      {favoritos.length === 0 ? (
        <Text style={styles.noFavoritesText}>
          No tienes platillos favoritos aún.
        </Text>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={async () => {
                const userId = await fetchUserId(); // Obtener el userId
                router.push({
                  pathname: "/loged/favorites/recipe", // Navegar al componente `recipe` en la carpeta `favorites`
                  params: {
                    id: item.id,
                    nombre: item.nombre_platillo,
                    img: item.imagen_platillo,
                    ingredientes: item.ingredientes,
                    instrucciones: item.instrucciones_platillo,
                    userId, // Pasar el userId como parámetro
                  },
                });
              }}
            >
              <View style={styles.itemContainer}>
                <ImageBackground
                  source={{ uri: item.imagen_platillo }}
                  style={styles.image}
                >
                  <LinearGradient
                    colors={["rgba(0,0,0,0.8)", "transparent"]}
                    style={styles.background}
                    start={{ x: 0.5, y: 1.1 }}
                    end={{ x: 0.5, y: 0 }}
                  />
                  <Pressable
                    onPress={() => handleFavoritePress(item.id)}
                    style={styles.favButton}
                  >
                    <Animated.View
                      style={{ transform: [{ scale: scaleValue }] }}
                    >
                      <Ionicons
                        name="heart"
                        size={24}
                        color={
                          favoritos.some((platillo) => platillo.id === item.id)
                            ? Colors.rojo
                            : Colors.beige
                        }
                      />
                    </Animated.View>
                  </Pressable>
                  <View style={styles.textContainer}>
                    <Text style={styles.itemText}>{item.nombre_platillo}</Text>
                  </View>
                </ImageBackground>
              </View>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.beige,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.grisOscuro,
    marginBottom: 20,
  },
  noFavoritesText: {
    fontSize: 18,
    color: Colors.grisOscuro,
    textAlign: "center",
    marginTop: 20,
  },
  itemContainer: {
    height: screenHeight * 0.2,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  textContainer: {
    height: "100%",
    justifyContent: "flex-end",
    padding: 10,
  },
  itemText: {
    color: Colors.beige,
    fontSize: 20,
    fontWeight: "bold",
  },
  favButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Colors.verdeGasolina,
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  separator: {
    height: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
