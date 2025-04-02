import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Button,
  FlatList,
  Image,
  ImageBackground,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../../../assets/colors/Colors";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const Search = () => {
  const { user } = useUser();
  const [busqueda, setBusqueda] = useState("");
  const [meals, setMeals] = useState([]);

  const router = useRouter();

  const filterData = meals.filter((dish) =>
    dish.nombre_platillo.toLowerCase().includes(busqueda.toLowerCase())
  );

  //Hook para renderizar los datos cuando se accede a esta ventana

  const fetchData = async (favoritosIds) => {
    const { data, error } = await supabase.rpc("obtener_platillos");

    if (error) {
      console.error("Error al obtener platillos:", error);
      setMeals([]);
      return;
    }

    // Agregar la propiedad `isFavorito` a cada platillo
    const updatedMeals = data.map((meal) => ({
      ...meal,
      isFavorito: favoritosIds.includes(meal.id), // Comparar con los IDs de favoritos
    }));

    console.log("Platillos con estado de favorito:", updatedMeals);

    setMeals(updatedMeals); // Actualizar el estado con los platillos y su estado de favorito
  };

  const registerRecipeViews = async (recipeId) => {
    if (!user || !user.sub) return;
    console.log("Enviando receta con id: ", recipeId);
    try {
      const { data, error } = await supabase
        .from("platillos_vistas")
        .insert([
          {
            id_platillo: parseInt(recipeId, 10),
            id_user: user.sub,
          },
        ])
        .select(); //Esto devuelve el registro insertado

      if (error) throw error;
      console.log("Vista registrada correctamente men try:", data); // Debería mostrar el registro
      return data;
    } catch (error) {
      console.error("Error registrando vista de receta en catch:", error);
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
        .eq("id_user", user.sub); // Filtrar por el usuario actual

      if (error) {
        console.error("Error al obtener favoritos:", error);
        return [];
      }

      console.log("Favoritos obtenidos desde la base de datos:", data);
      const favoritos = data.map((fav) => fav.id_platillo); // Extraer solo los IDs de los platillos
      return favoritos; // Devolver los favoritos
    } catch (error) {
      console.error("Error al obtener favoritos:", error);
      return [];
    }
  };

  const toggleFavorito = async (id_platillo: number) => {
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

    const isFavorito = meals.find(
      (meal) => meal.id === id_platillo
    )?.isFavorito;

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
        setMeals((prevMeals) =>
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
        setMeals((prevMeals) =>
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

  useEffect(() => {
    const fetchDataWithFavoritos = async () => {
      try {
        const favoritos = await fetchFavoritos(); // Obtener los favoritos primero
        console.log("Favoritos cargados:", favoritos);
        await fetchData(favoritos); // Pasar los favoritos a `fetchData`
      } catch (error) {
        console.error("Error al cargar los datos iniciales:", error);
      }
    };

    if (user && user.sub) {
      fetchDataWithFavoritos();
    }
  }, [user]);

  useEffect(() => {
    const testFetchFavoritos = async () => {
      const favoritos = await fetchFavoritos();
      console.log("Favoritos cargados:", favoritos);
    };

    testFetchFavoritos();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerCont}>
        <View style={styles.titleCont}>
          <Text style={styles.txtTitle}>Search</Text>
        </View>
        <View style={styles.inputCont}>
          <TextInput
            placeholder="Buscar"
            placeholderTextColor={Colors.grisOscuro}
            style={styles.txtInput}
            value={busqueda}
            onChangeText={setBusqueda}
          />
          <Pressable onPress={() => console.log("Buscar")}>
            <View style={styles.iconCont}>
              <Ionicons name="search" size={32} color={Colors.grisOscuro} />
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.listCont}>
        {/* Cambiar los datos de la flatlist cuando se acabe de arreglar el front */}
        <FlatList
          data={filterData}
          keyExtractor={(item, id) => id.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                registerRecipeViews(item.id);
                router.push({
                  pathname: "/loged/search/recipe",
                  params: {
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
                    onPress={() => toggleFavorito(item.id)} // Llamar a la función `toggleFavorito`
                  >
                    <Ionicons
                      name="heart"
                      size={24}
                      color={item.isFavorito ? Colors.rojo : Colors.beige} // Cambiar el color según el estado de favorito
                    />
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

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.beige,
    // justifyContent: "center",
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
  txtInput: {
    width: "88%",
    color: Colors.grisOscuro,
    marginLeft: "2%",
    fontSize: 16,
  },
  inputCont: {
    flexDirection: "row",
    width: screenWidth * 0.9,
    height: screenHeight * 0.06,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.grisOscuro,
  },
  iconCont: {
    justifyContent: "center",
    height: "100%",
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
    backgroundColor: Colors.verdeGasolina, // Color de fondo del botón
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
});
