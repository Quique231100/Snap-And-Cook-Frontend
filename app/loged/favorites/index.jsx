import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../../../assets/colors/Colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import { useFocusEffect } from "@react-navigation/native";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const Favorites = () => {
  const { user } = useUser();
  const [favoritos, setFavoritos] = useState([]);
  const router = useRouter();

  // Función para registrar la vista de una receta
  const registerRecipeViews = async (recipeId) => {
    if (!user || !user.sub) return;

    try {
      const { data, error } = await supabase
        .from("platillos_vistas")
        .insert([
          {
            id_platillo: parseInt(recipeId, 10),
            id_user: user.sub,
          },
        ])
        .select();

      if (error) throw error;
      console.log("Vista registrada:", data);
    } catch (error) {
      console.error("Error registrando vista de receta:", error);
    }
  };

  // Función para obtener los favoritos con detalles completos
  const fetchFavoritos = async () => {
    if (!user || !user.sub) {
      console.error("El usuario no está autenticado.");
      return;
    }

    try {
      const { data: favoritosData, error: favoritosError } = await supabase
        .from("favoritos")
        .select("id_platillo")
        .eq("id_user", user.sub);

      if (favoritosError) {
        console.error("Error al obtener favoritos:", favoritosError);
        setFavoritos([]);
        return;
      }

      const favoritosIds = favoritosData.map((fav) => fav.id_platillo);

      const { data: platillosData, error: platillosError } = await supabase.rpc(
        "obtener_platillos"
      );

      if (platillosError) {
        console.error(
          "Error al obtener detalles de los platillos favoritos:",
          platillosError
        );
        setFavoritos([]);
        return;
      }

      const favoritosDetalles = platillosData.filter((platillo) =>
        favoritosIds.includes(platillo.id)
      );

      console.log("Detalles de los platillos favoritos:", favoritosDetalles);
      setFavoritos(favoritosDetalles);
    } catch (error) {
      console.error("Error al obtener favoritos:", error);
      setFavoritos([]);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFavoritos();
    }, [user])
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerCont}>
        <View style={styles.titleCont}>
          <Text style={styles.txtTitle}>Favorites</Text>
        </View>
      </View>

      <View style={styles.listCont}>
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                // Registrar la vista de la receta
                registerRecipeViews(item.id);

                // Navegar a la página de detalles de la receta
                router.push({
                  pathname: "/loged/favorites/recipe",
                  params: {
                    id: item.id,
                    nombre: item.nombre_platillo,
                    img: item.imagen_platillo,
                    ingredientes: item.ingredientes,
                    instrucciones: item.instrucciones_platillo,
                  },
                });
              }}
            >
              <View style={styles.itemCont}>
                <ImageBackground
                  source={{ uri: item.imagen_platillo }}
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
                    onPress={() => console.log("Eliminar de favoritos")}
                  >
                    <Ionicons name="heart" size={24} color={Colors.rojo} />
                  </Pressable>
                  <View style={styles.txtItemCont}>
                    <Text style={styles.txtItem}>{item.nombre_platillo}</Text>
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
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.beige,
    alignItems: "center",
  },
  headerCont: {
    width: screenWidth,
    marginTop: screenHeight * 0.06,
    alignItems: "center",
    gap: screenHeight * 0.02,
    marginBottom: screenHeight * 0.02,
  },
  titleCont: {
    width: screenWidth * 0.9,
  },
  txtTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.grisOscuro,
  },
  listCont: {
    width: screenWidth * 0.9,
    marginBottom: screenHeight * 0.23,
  },
  itemCont: {
    backgroundColor: Colors.verdeGasolina,
    height: screenHeight * 0.2,
    borderRadius: 8,
    overflow: "hidden",
  },
  imgItemCont: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: screenHeight * 0.2,
  },
  txtItemCont: {
    height: "100%",
    justifyContent: "flex-end",
    marginLeft: "2%",
    paddingBottom: "2%",
  },
  txtItem: {
    color: Colors.beige,
    fontSize: 30,
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
});
