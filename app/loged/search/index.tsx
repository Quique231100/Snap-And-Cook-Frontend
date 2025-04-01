import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  ImageBackground,
  Dimensions,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../../../assets/colors/Colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useUser } from "../../../context/UserContext"; // Importar el contexto del usuario
import { useFocusEffect } from "@react-navigation/native"; // Importar useFocusEffect

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const Search = () => {
  const { user } = useUser(); // Obtener el usuario desde el contexto
  const [busqueda, setBusqueda] = useState("");
  const [meals, setMeals] = useState([]);
  const [favoritos, setFavoritos] = useState([]); // Guardar los IDs de los favoritos
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // Guardar el id INT8 del usuario
  const [scaleValue] = useState(new Animated.Value(1)); // Animación del botón
  const router = useRouter();

  // Obtener el ID del usuario desde la tabla "usuarios"
  const fetchUserId = async () => {
    if (!user?.id) {
      console.error("El usuario no está definido.");
      Alert.alert("Error", "No se pudo obtener el ID del usuario.");
      return null;
    }

    const { data, error } = await supabase
      .from("usuarios")
      .select("id")
      .eq("id_user", user.id) // Usar el UUID del usuario desde el contexto
      .single();

    if (error) {
      console.error("Error al obtener el ID del usuario:", error);
      Alert.alert("Error", "No se pudo obtener el ID del usuario.");
      return null;
    }

    return data.id;
  };

  // Obtener los IDs de los favoritos del usuario
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

    return data.map((fav) => fav.id_platillo); // Retornar solo los IDs de los platillos favoritos
  };

  // Obtener todos los platillos
  const fetchPlatillos = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("obtener_platillos");

    if (error) {
      console.error("Error al obtener platillos:", error);
      Alert.alert("Error", "No se pudieron cargar los platillos.");
      setLoading(false);
      return [];
    }

    setLoading(false);
    return data;
  };

  // Agregar un platillo a favoritos
  const addToFavoritos = async (idPlatillo) => {
    if (!userId) {
      console.error("El ID del usuario no está definido.");
      Alert.alert("Error", "No se pudo agregar a favoritos.");
      return;
    }

    const { error } = await supabase
      .from("favoritos")
      .insert({ id_usuario: userId, id_platillo: idPlatillo });

    if (error) {
      console.error("Error al agregar a favoritos:", error);
      Alert.alert("Error", "No se pudo agregar a favoritos.");
    } else {
      setFavoritos((prev) => [...prev, idPlatillo]); // Actualizar el estado local
    }
  };

  // Eliminar un platillo de favoritos
  const removeFromFavoritos = async (idPlatillo) => {
    if (!userId) {
      console.error("El ID del usuario no está definido.");
      Alert.alert("Error", "No se pudo eliminar de favoritos.");
      return;
    }

    const { error } = await supabase
      .from("favoritos")
      .delete()
      .eq("id_usuario", userId)
      .eq("id_platillo", idPlatillo);

    if (error) {
      console.error("Error al eliminar de favoritos:", error);
      Alert.alert("Error", "No se pudo eliminar de favoritos.");
    } else {
      setFavoritos((prev) => prev.filter((favId) => favId !== idPlatillo)); // Actualizar el estado local
    }
  };

  // Cargar los datos de los platillos y los favoritos al iniciar
  const fetchData = async () => {
    const id = await fetchUserId(); // Obtener el ID INT8 del usuario
    if (id) {
      setUserId(id); // Guardar el ID del usuario en el estado
      const favoritosIds = await fetchFavoritos(id); // Obtener los favoritos del usuario
      setFavoritos(favoritosIds); // Guardar los IDs de los favoritos
    }

    const platillosData = await fetchPlatillos();
    setMeals(platillosData);
  };

  // Manejar la animación del botón de favorito
  const handleFavoritePress = (idPlatillo, isFavorito) => {
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
    ]).start(() => {
      if (isFavorito) {
        removeFromFavoritos(idPlatillo);
      } else {
        addToFavoritos(idPlatillo);
      }
    });
  };

  // Recargar la lista al enfocar la ventana
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

  // Filtrar los platillos según la búsqueda
  const filterData = meals.filter((dish) =>
    dish.nombre_platillo.toLowerCase().includes(busqueda.toLowerCase())
  );

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
        <FlatList
          data={filterData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isFavorito = favoritos.includes(item.id); // Verificar si el platillo es favorito
            return (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/loged/search/recipe",
                    params: {
                      id: item.id,
                      nombre: item.nombre_platillo,
                      img: item.imagen_platillo,
                      ingredientes: item.ingredientes,
                      instrucciones: item.instrucciones_platillo,
                      userId, // Pasar el userId como parámetro
                    },
                  })
                }
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
                      onPress={() => handleFavoritePress(item.id, isFavorito)}
                    >
                      <Animated.View
                        style={{ transform: [{ scale: scaleValue }] }}
                      >
                        <Ionicons
                          name="heart"
                          size={24}
                          color={isFavorito ? Colors.rojo : Colors.beige} // Cambiar color si es favorito
                        />
                      </Animated.View>
                    </Pressable>
                    <View style={styles.txtItemCont}>
                      <Text style={styles.txtItem}>{item.nombre_platillo}</Text>
                    </View>
                  </ImageBackground>
                </View>
              </Pressable>
            );
          }}
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
    backgroundColor: Colors.beige,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.beige,
  },
});
