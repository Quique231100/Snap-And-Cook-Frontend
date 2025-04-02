import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ImageBackground,
  ScrollView,
  Alert,
} from "react-native";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { HelloWave } from "@/components/HelloWave";
import Colors from "../../../assets/colors/Colors";
import { useUser } from "../../../context/UserContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { Ionicons } from "@expo/vector-icons"; // Importación para el ícono del botón de favorito
import { useFocusEffect } from "@react-navigation/native";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const Index = () => {
  const { user } = useUser();
  const [paginationIndex, setPaginationIndex] = useState(0);
  const [advice, setAdvice] = useState([]);
  const [mealsRand, setMealsRand] = useState([]);
  const [lastMeals, setLastMeals] = useState([]);
  const [favoritosIds, setFavoritosIds] = useState([]); // IDs de los favoritos
  const router = useRouter();

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== undefined) {
      setPaginationIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  const getAdvice = async () => {
    const { data, error } = await supabase.rpc("obtener_recomendaciones_salud");
    if (error) {
      Alert.alert(
        "Error en salud",
        "No se pudo obtener las recomendaciones de salud"
      );
      setAdvice([]);
    } else {
      setAdvice(data);
    }
  };

  const getPopularMeals = async (favoritosIds) => {
    const { data, error } = await supabase.rpc(
      "obtener_platillos_por_popularidad",
      {
        limit_count: 5,
      }
    );

    if (error) {
      console.error("Error al obtener platillos", error);
      return;
    }

    // Agregar la propiedad `isFavorito` a cada platillo
    const updatedMeals = data.map((meal) => ({
      ...meal,
      isFavorito: favoritosIds.includes(meal.id), // Comparar con los IDs de favoritos
    }));
    setMealsRand(updatedMeals); // Actualizar el estado con los platillos y su estado de favorito
  };

  const getLastMeals = async (usuarioId, favoritosIds) => {
    const { data, error } = await supabase.rpc("get_ultimos_vistos", {
      user_uuid: usuarioId,
    });

    if (error) {
      console.error("Error al obtener historial:", error);
      setLastMeals([]);
      return;
    }

    // Agregar la propiedad `isFavorito` a cada platillo
    const updatedLastMeals = data.map((meal) => ({
      ...meal,
      isFavorito: favoritosIds.includes(meal.id), // Comparar con los IDs de favoritos
    }));

    console.log(
      "Últimas recetas vistas con estado de favorito:",
      updatedLastMeals
    );

    setLastMeals(updatedLastMeals); // Actualizar el estado con los platillos y su estado de favorito
  };

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
        .select(); // Esto devuelve el registro insertado

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error registrando vista de receta:", error);
      return null;
    }
  };

  const fetchFavoritos = async () => {
    if (!user || !user.sub) {
      console.error("El usuario no está autenticado.");
      return [];
    }

    try {
      const { data, error } = await supabase
        .from("favoritos")
        .select("id_platillo")
        .eq("id_user", user.sub);

      if (error) {
        console.error("Error al obtener favoritos:", error);
        return [];
      }

      console.log("Favoritos obtenidos desde la base de datos:", data);
      const favoritos = data.map((fav) => fav.id_platillo);
      setFavoritosIds(favoritos); // Actualizar el estado
      console.log("Estado actualizado de favoritosIds:", favoritos);
      return favoritos; // Devolver los favoritos
    } catch (error) {
      console.error("Error al obtener favoritos:", error);
      return [];
    }
  };

  const toggleFavorito = async (id_platillo) => {
    if (!user || !user.sub) {
      console.error("El usuario no está autenticado.");
      return;
    }

    console.log("ID del platillo recibido:", id_platillo);

    if (!id_platillo) {
      console.error("El ID del platillo es inválido.");
      Alert.alert("Error", "El ID del platillo no es válido.");
      return;
    }

    const isFavorito = favoritosIds.includes(id_platillo);

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
        setFavoritosIds((prev) => prev.filter((id) => id !== id_platillo));
        setMealsRand((prevMeals) =>
          prevMeals.map((meal) =>
            meal.id === id_platillo
              ? { ...meal, isFavorito: false } // Actualizar `isFavorito` a false
              : meal
          )
        );
        console.log(`Platillo ${id_platillo} eliminado de favoritos.`);
      } catch (error) {
        console.error("Error al eliminar de favoritos:", error);
      }
    } else {
      // Agregar a favoritos
      try {
        const { error } = await supabase.from("favoritos").insert({
          id_platillo,
          id_user: user.sub,
        });

        if (error) {
          console.error("Error al agregar a favoritos:", error);
          Alert.alert("Error", "No se pudo agregar el platillo a favoritos.");
          return;
        }

        // Actualizar el estado
        setFavoritosIds((prev) => [...prev, id_platillo]);
        setMealsRand((prevMeals) =>
          prevMeals.map((meal) =>
            meal.id === id_platillo
              ? { ...meal, isFavorito: true } // Actualizar `isFavorito` a true
              : meal
          )
        );
        console.log(`Platillo ${id_platillo} agregado a favoritos.`);
      } catch (error) {
        console.error("Error al agregar a favoritos:", error);
      }
    }
  };

  const fetchData = async () => {
    try {
      const favoritos = await fetchFavoritos(); // Obtener los favoritos primero
      console.log("Favoritos cargados:", favoritos);
      await getPopularMeals(favoritos); // Pasar los favoritos a `getPopularMeals`
      getAdvice();
      await getLastMeals(user.sub, favoritos); // Pasar los favoritos a `getLastMeals`
    } catch (error) {
      console.error("Error al cargar los datos iniciales:", error);
    }
  };

  // Actualizar los datos cada vez que la ventana se enfoque
  useFocusEffect(
    React.useCallback(() => {
      if (user && user.sub) {
        fetchData();
      }
    }, [user])
  );

  return (
    <View style={styles.container}>
      <View style={styles.saluteCont}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: screenWidth * 0.9,
            justifyContent: "space-between",
          }}
        >
          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <HelloWave />
              <Text style={styles.welcomeTxt}>Bienvenido</Text>
            </View>
            <Text style={styles.userTxt}>
              {user.nombre} {user.apellidos}
            </Text>
          </View>
          <Image
            source={require("../../../assets/images/Snap&Cook_Logotipo_03.png")}
            style={{
              resizeMode: "cover",
              width: screenWidth * 0.3,
              height: screenHeight * 0.15,
            }}
          />
        </View>
      </View>
      <ScrollView>
        <View style={styles.advicesCont}>
          <View style={styles.recuerdaCont}>
            <Text style={styles.subtitleTxt}>Recuerda 🤔</Text>
          </View>

          <FlatList
            data={advice}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.flatlistCont}>
                <View style={styles.itemCont}>
                  <View style={styles.descriptionItemCont}>
                    <Text style={styles.txtTitleItem}>{item.titulo}</Text>
                    <Text style={styles.txtDescriptionItem}>{item.frase}</Text>
                  </View>
                  <Image source={{ uri: item.imagen }} style={styles.imgCont} />
                </View>
              </View>
            )}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            viewabilityConfigCallbackPairs={
              viewabilityConfigCallbackPairs.current
            }
          />

          <View style={styles.dotCont}>
            {advice.map((_, id) => (
              <View
                key={id}
                style={[
                  styles.flatlistDot,
                  {
                    backgroundColor:
                      paginationIndex === id
                        ? Colors.beigeMasOscuro
                        : Colors.beigeOscuro,
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.recetasTxtCont}>
            <Text style={styles.subtitleTxt}>🔥 Tendencia esta semana</Text>
          </View>

          <View style={styles.recetasCont}>
            <FlatList
              data={mealsRand}
              keyExtractor={(item, id) => id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    console.log(item);
                    registerRecipeViews(item.id);
                    router.push({
                      pathname: "/loged/home/recipe",
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
                  <View style={styles.itemRecipeCont}>
                    <ImageBackground
                      source={{ uri: item.imagen_platillo }}
                      style={styles.imgItemRecipeCont}
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
                        onPress={() => {
                          toggleFavorito(item.id); // Asegúrate de que `id_platillo` sea la propiedad correcta
                        }}
                      >
                        <Ionicons
                          name="heart"
                          size={24}
                          color={item.isFavorito ? Colors.rojo : Colors.beige} // Cambiar el color según el estado de favorito
                        />
                      </Pressable>
                      <View style={styles.txtItemCont}>
                        <Text style={styles.txtItem}>
                          {item.nombre_platillo}
                        </Text>
                      </View>
                    </ImageBackground>
                  </View>
                </Pressable>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View style={styles.recetasTxtCont}>
            <Text style={styles.subtitleTxt}>⏱️ Últimas recetas vistas</Text>
          </View>

          <View style={styles.recetasCont}>
            <FlatList
              data={lastMeals}
              keyExtractor={(item, id) => id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    console.log(item);
                    registerRecipeViews(item.id);
                    router.push({
                      pathname: "/loged/home/recipe",
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
                  <View style={styles.itemRecipeCont}>
                    <ImageBackground
                      source={{ uri: item.imagen_platillo }}
                      style={styles.imgItemRecipeCont}
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
                        onPress={() => {
                          toggleFavorito(item.id); // Asegúrate de que `id` sea la propiedad correcta
                        }}
                      >
                        <Ionicons
                          name="heart"
                          size={24}
                          color={item.isFavorito ? Colors.rojo : Colors.beige} // Cambiar el color según el estado de favorito
                        />
                      </Pressable>
                      <View style={styles.txtItemCont}>
                        <Text style={styles.txtItem}>
                          {item.nombre_platillo}
                        </Text>
                      </View>
                    </ImageBackground>
                  </View>
                </Pressable>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.beige,
    alignItems: "center",
    paddingBottom: screenHeight * 0.01,
  },
  saluteCont: {
    width: screenWidth,
    height: screenHeight * 0.22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.verdeMuyOscuro,
    borderBottomRightRadius: 34,
    borderBottomLeftRadius: 34,
  },
  welcomeTxt: {
    color: Colors.beige,
    fontSize: 36,
    fontWeight: "bold",
  },
  userTxt: {
    color: Colors.beige,
    fontSize: 24,
  },
  advicesCont: {
    width: screenWidth,
    alignItems: "center",
  },
  recuerdaCont: {
    width: screenWidth,
    height: screenHeight * 0.08,
    justifyContent: "center",
  },
  subtitleTxt: {
    fontSize: 24,
    color: Colors.grisOscuro,
    marginLeft: screenWidth * 0.05,
  },
  flatlistCont: {
    alignItems: "center",
    width: screenWidth,
  },
  itemCont: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.25,
    backgroundColor: Colors.beigeOscuro,
    borderRadius: 24,
    justifyContent: "space-between",
    flexDirection: "row",
    overflow: "hidden",
  },
  descriptionItemCont: {
    width: screenWidth * 0.45,
    height: screenHeight * 0.25,
    gap: screenHeight * 0.01,
    justifyContent: "center",
    marginLeft: screenWidth * 0.025,
  },
  txtTitleItem: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.grisOscuro,
  },
  txtDescriptionItem: {
    fontSize: 16,
    fontWeight: "400",
    color: Colors.grisOscuro,
  },
  imgCont: {
    width: screenWidth * 0.45,
    height: screenHeight * 0.25,
    resizeMode: "cover",
    borderTopLeftRadius: 70,
    borderBottomLeftRadius: 70,
  },
  dotCont: {
    flexDirection: "row",
    marginTop: 10,
  },
  flatlistDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  recetasCont: {
    width: screenWidth,
  },
  recetasTxtCont: {
    width: screenWidth,
    height: screenHeight * 0.1,
    justifyContent: "center",
  },
  itemRecipeCont: {
    backgroundColor: Colors.verdeGasolina,
    width: screenWidth * 0.8,
    height: screenHeight * 0.2,
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: screenWidth * 0.05,
  },
  imgItemRecipeCont: {
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
    backgroundColor: Colors.verdeGasolina, // Color de fondo del botón
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
});
