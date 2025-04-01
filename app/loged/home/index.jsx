import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ImageBackground,
} from "react-native";
import React, { useRef, useState, useCallback, useEffect } from "react";
import Colors from "../../../assets/colors/Colors";
import { useUser } from "../../../context/UserContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import FavoriteButton from "../../../components/FavoriteButton"; // Importar el componente
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const datos = {
  advice: [
    {
      id: 1,
      text: "Que las verduras nunca falten en tu plato",
      img: "https://hips.hearstapps.com/hmg-prod/images/frutas-1552246920.jpg?crop=0.669xw:1.00xh;0.166xw,0&resize=1200:*",
    },
    {
      id: 2,
      text: "Mantente siempre hidratado tomando 3 litros de agua al día",
      img: "https://www.prosaudesl.com/la-importancia-de-la-hidratacion-como-el-agua-impacta-en-tu-salud_img234714t1.jpg",
    },
    {
      id: 3,
      text: "No olvides hacer ejercicio al menos 30 minutos al dia",
      img: "https://enlinea.santotomas.cl/web/wp-content/uploads/sites/2/2017/03/ejercicio-salud-tuillang-yuing.ust-vina-del-mar.jpg",
    },
  ],
};

const Index = () => {
  const { user } = useUser();
  const [paginationIndex, setPaginationIndex] = useState(0);
  const [mealsRand, setMealsRand] = useState([]);
  const [userId, setUserId] = useState(null); // Guardar el ID INT8 del usuario
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

  // Obtener el ID INT8 del usuario desde la tabla "usuarios"
  const fetchUserId = async () => {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("id")
        .eq("id_user", user.id) // Usar el UUID del usuario
        .single();

      if (error) {
        console.error("Error al obtener el ID del usuario:", error);
        return null;
      }

      setUserId(data.id); // Guardar el ID INT8 en el estado
      return data.id;
    } catch (error) {
      console.error("Error al obtener el ID del usuario:", error);
      return null;
    }
  };

  // Obtener los IDs de los favoritos del usuario
  const fetchFavoritos = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("favoritos")
        .select("id_platillo")
        .eq("id_usuario", userId);

      if (error) {
        console.error("Error al obtener favoritos:", error);
        return [];
      }

      console.log("Favoritos obtenidos:", data); // Verificar los datos
      return data.map((fav) => fav.id_platillo); // Retornar solo los IDs
    } catch (error) {
      console.error("Error al obtener favoritos:", error);
      return [];
    }
  };

  // Obtener recetas aleatorias y determinar si son favoritas
  const getRandomMeals = async () => {
    try {
      const id = await fetchUserId(); // Obtener el ID INT8 del usuario
      if (!id) {
        console.warn("No se pudo obtener el ID del usuario.");
        return;
      }

      const { data: meals, error } = await supabase.rpc("getrandommeals", {
        limit_count: 5, // Limitar a 5 resultados
      });

      if (error) {
        console.error("Error al obtener platillos:", error);
        return;
      }

      console.log("Datos obtenidos de getrandommeals:", meals);

      if (!meals || meals.length === 0) {
        console.warn("No se obtuvieron recetas de getrandommeals.");
        setMealsRand([]);
        return;
      }

      const favoritos = (await fetchFavoritos(id)).map((fav) => String(fav)); // Convertir favoritos a string
      setFavoritosIds(favoritos); // Guardar los IDs de favoritos

      const mealsWithFavorito = meals.map((meal) => ({
        ...meal,
        isFavorito: favoritos.includes(meal.id_platillo), // Comparar como strings
      }));

      console.log("Recetas con favoritos asignados:", mealsWithFavorito);
      setMealsRand(mealsWithFavorito);
    } catch (error) {
      console.error("Error al obtener recetas aleatorias:", error);
    }
  };

  // Alternar favoritos (agregar o eliminar)
  const toggleFavorito = async (id_platillo) => {
    const idPlatilloNumerico = Number(id_platillo); // Convertir a número
    console.log("ID del platillo (convertido a número):", idPlatilloNumerico);

    const userId = await fetchUserId();
    if (!userId) {
      return;
    }

    const isFavorito = favoritosIds.includes(idPlatilloNumerico);

    if (isFavorito) {
      // Eliminar de favoritos
      const { error } = await supabase
        .from("favoritos")
        .delete()
        .eq("id_usuario", userId)
        .eq("id_platillo", idPlatilloNumerico);

      if (error) {
        console.error("Error al eliminar de favoritos:", error);
        Alert.alert("Error", "No se pudo eliminar el platillo de favoritos.");
      } else {
        setFavoritosIds((prev) =>
          prev.filter((id) => id !== idPlatilloNumerico)
        );
        setMealsRand((prevMeals) =>
          prevMeals.map((meal) =>
            meal.id_platillo === id_platillo
              ? { ...meal, isFavorito: false }
              : meal
          )
        );
      }
    } else {
      // Agregar a favoritos
      const { error } = await supabase.from("favoritos").insert({
        id_usuario: userId,
        id_platillo: idPlatilloNumerico, // Usar el valor numérico
      });

      if (error) {
        console.error("Error al agregar a favoritos:", error);
        Alert.alert("Error", "No se pudo agregar el platillo a favoritos.");
      } else {
        setFavoritosIds((prev) => [...prev, idPlatilloNumerico]);
        setMealsRand((prevMeals) =>
          prevMeals.map((meal) =>
            meal.id_platillo === id_platillo
              ? { ...meal, isFavorito: true }
              : meal
          )
        );
      }
    }
  };

  useEffect(() => {
    getRandomMeals();
  }, []);

  console.log("Datos de mealsRand:", mealsRand);

  return (
    <View style={styles.container}>
      <View style={styles.saluteCont}>
        <Text style={styles.welcomeTxt}>Bienvenido</Text>
        <Text style={styles.userTxt}>
          {user?.user_metadata?.nombre || "Usuario"}{" "}
          {user?.user_metadata?.apellidos || ""}
        </Text>
      </View>

      <View style={styles.advicesCont}>
        <View style={styles.recuerdaCont}>
          <Text style={styles.subtitleTxt}>Recuerda ...</Text>
        </View>

        <FlatList
          data={datos.advice}
          keyExtractor={(item, index) =>
            item?.id ? item.id.toString() : index.toString()
          }
          renderItem={({ item }) => (
            <View style={styles.flatlistCont}>
              <View style={styles.itemCont}>
                <View style={styles.descriptionItemCont}>
                  <Text style={styles.txtDescriptionItem}>{item.text}</Text>
                </View>
                <Image source={{ uri: item.img }} style={styles.imgCont} />
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
          {datos.advice.map((_, id) => (
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
          <Text style={styles.subtitleTxt}>Recetas recomendadas</Text>
        </View>

        <View style={styles.recetasCont}>
          {mealsRand.length === 0 ? (
            <Text style={styles.noRecipesText}>
              No hay recetas disponibles.
            </Text>
          ) : (
            <FlatList
              data={mealsRand}
              keyExtractor={(item, index) =>
                item?.id ? item.id.toString() : index.toString()
              }
              renderItem={({ item }) => (
                <Pressable
                  onPress={async () => {
                    const userId = await fetchUserId(); // Obtener el userId
                    router.push({
                      pathname: "/loged/home/recipe", // Navegar al componente `recipe` en la carpeta `home`
                      params: {
                        id: item.id_platillo, // Pasar el ID del platillo
                        nombre: item.nombre_platillo,
                        img: item.imagen_platillo,
                        ingredientes: item.ingredientes,
                        instrucciones: item.instrucciones_platillo,
                        userId, // Pasar el userId como parámetro
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
                      <Pressable
                        onPress={() => toggleFavorito(item.id_platillo)} // Usar la propiedad correcta
                        style={styles.favButton}
                      >
                        <Ionicons
                          name="heart"
                          size={24}
                          color={item.isFavorito ? Colors.rojo : Colors.beige}
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
          )}
        </View>
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.beige,
    alignItems: "center",
  },
  saluteCont: {
    width: screenWidth,
    height: screenHeight * 0.22,
    paddingTop: screenHeight * 0.08,
    paddingLeft: screenWidth * 0.06,
    gap: screenHeight * 0.01,
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
    justifyContent: "center",
    marginLeft: screenWidth * 0.025,
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
  noRecipesText: {
    fontSize: 18,
    color: Colors.grisOscuro,
    textAlign: "center",
    marginTop: 20,
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
