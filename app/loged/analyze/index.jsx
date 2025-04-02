import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  Dimensions,
  Image,
  FlatList,
  Modal,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../../assets/colors/Colors";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase.ts";
import { useUser } from "../../../context/UserContext.tsx";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export default function indexAnalyze() {
  const { user } = useUser();
  const [image, setImage] = useState(null);
  const [image64, setImage64] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [ingredients, setIngredients] = useState([]); // Estado para los ingredientes detectados
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);

  const router = useRouter();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitas otorgar permisos para acceder a la galería."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImage64(result.assets[0].base64);
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitas otorgar permisos para acceder a la cámara."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImage64(result.assets[0].base64);
    }
  };

  const analyzeImage = async () => {
    if (!image || !image64) {
      Alert.alert("Error", "Selecciona una imagen antes de analizar");
      return;
    }

    try {
      setLoading(true);
      const response = await axios({
        method: "POST",
        url: "https://detect.roboflow.com/comida-lz8pz/4",
        params: {
          api_key: "cRp3GkSKrhrMgEgwuVpL",
        },
        data: `data:image/jpeg;base64,${image64}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const detectedFood = [
        ...new Set(
          response.data.predictions.map(
            (prediction) =>
              prediction.class.charAt(0).toUpperCase() +
              prediction.class.slice(1).toLowerCase()
          )
        ),
      ];
      if (detectedFood.length === 0) {
        Alert.alert("Error", "No se encontraron ingredientes en la imagen");
      } else {
        setIngredients(detectedFood);
        fetchRecipes(detectedFood);
      }
    } catch (error) {
      console.error(
        "Error en análisis de imagen:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        `Hubo un problema al identificar los ingredientes: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipes = async (detectedIngredients) => {
    try {
      // Obtener los IDs de los favoritos del usuario
      const { data: favoritosData, error: favoritosError } = await supabase
        .from("favoritos")
        .select("id_platillo")
        .eq("id_user", user.sub);

      if (favoritosError) {
        console.error("Error al obtener favoritos:", favoritosError);
        return;
      }

      const favoritosIds = favoritosData.map((fav) => fav.id_platillo);

      // Obtener las recetas basadas en los ingredientes detectados
      const { data: recetasData, error: recetasError } = await supabase.rpc(
        "obtener_platillos_por_ingredientes",
        {
          ingredientes_input: detectedIngredients,
        }
      );

      if (recetasError) {
        console.error("Error al obtener recetas:", recetasError);
        setRecipes([]);
        return;
      }

      // Combinar las recetas con el estado de favoritos
      const updatedRecipes = recetasData.map((recipe) => ({
        ...recipe,
        isFavorito: favoritosIds.includes(recipe.id), // Marcar como favorito si está en la lista de favoritos
      }));

      console.log("Recetas actualizadas con favoritos:", updatedRecipes);
      setRecipes(updatedRecipes);
    } catch (err) {
      console.error("Error al obtener recetas:", err);
      setRecipes([]);
    }
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

    const isFavorito = recipes.find(
      (recipe) => recipe.id === id_platillo
    )?.isFavorito;

    if (isFavorito) {
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

        setRecipes((prevRecipes) =>
          prevRecipes.map((recipe) =>
            recipe.id === id_platillo
              ? { ...recipe, isFavorito: false }
              : recipe
          )
        );
        console.log(`Platillo ${id_platillo} eliminado de favoritos.`);
      } catch (error) {
        console.error("Error al eliminar de favoritos:", error);
      }
    } else {
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

        setRecipes((prevRecipes) =>
          prevRecipes.map((recipe) =>
            recipe.id === id_platillo ? { ...recipe, isFavorito: true } : recipe
          )
        );
        console.log(`Platillo ${id_platillo} agregado a favoritos.`);
      } catch (error) {
        console.error("Error al agregar a favoritos:", error);
      }
    }
  };

  useEffect(() => {
    if (image) {
      analyzeImage();
    }
  }, [image]);

  return (
    <View style={styles.container}>
      <View style={styles.titleCont}>
        <Text style={styles.title}>Analyze</Text>
      </View>
      <ScrollView>
        <View style={styles.analyzeCont}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={{ gap: 20 }}>
              <Pressable onPress={pickImage}>
                <View style={styles.btnAnalyzeCont}>
                  <Text style={styles.txtBtnAnalyze}>Seleccionar imagen</Text>
                </View>
              </Pressable>

              <Pressable onPress={openCamera}>
                <View style={styles.btnAnalyzeCont}>
                  <Text style={styles.txtBtnAnalyze}>Tomar fotografía</Text>
                </View>
              </Pressable>
            </View>
          )}
        </View>
        {image && (
          <View style={styles.afterAnalyzeCont}>
            <View style={styles.btnAfterAnalyzeCont}>
              <Pressable onPress={() => setImage(null)}>
                <View style={styles.btnAfterAnalyze}>
                  <Text style={styles.txtSubirOtraImagen}>
                    Subir otra imagen
                  </Text>
                </View>
              </Pressable>

              <Pressable onPress={() => setModalVisible(true)}>
                <View style={styles.btnIngredients}>
                  <Text style={styles.txtVerIngredientes}>
                    Ver ingredientes
                  </Text>
                </View>
              </Pressable>
            </View>
            <Text style={styles.txtRecetas}>Recetas recomendadas</Text>
            <View style={styles.listCont}>
              {/* Cambiar los datos de la flatlist cuando se acabe de arreglar el front */}
              <FlatList
                data={recipes}
                keyExtractor={(item, id) => id.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      console.log("ID de la receta: ", item.id);
                      registerRecipeViews(item.id);
                      router.push({
                        pathname: "/loged/analyze/recipe",
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
                          // Background Linear Gradient
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
                          <Text style={styles.txtItem}>
                            {item.nombre_platillo}
                          </Text>
                        </View>
                      </ImageBackground>
                    </View>
                  </Pressable>
                )}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                ItemSeparatorComponent={() => (
                  <View style={{ marginVertical: screenHeight * 0.015 }} />
                )}
              />
            </View>
          </View>
        )}
        {/* Modal para mostrar ingredientes */}
        <Modal
          transparent={true}
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            {ingredients.length === 0 ? (
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>
                  No se encontraron ingredientes en la imagen
                </Text>
              </View>
            ) : (
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Ingredientes</Text>
                <FlatList
                  data={ingredients}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <Text style={styles.modalItem}>• {item}</Text>
                  )}
                  scrollEnabled={false}
                />
              </View>
            )}
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: screenHeight * 0.08,
    //justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.beige,
  },
  titleCont: {
    width: screenWidth * 0.9,
    marginBottom: screenHeight * 0.03,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.verdeMuyOscuro,
  },
  analyzeCont: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.35,
    backgroundColor: Colors.beigeOscuro,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
  },
  image: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.35,
    resizeMode: "cover",
    borderRadius: 24,
  },
  btnAnalyzeCont: {
    width: screenWidth * 0.7,
    height: screenHeight * 0.08,
    backgroundColor: Colors.verdeOscuro,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  txtBtnAnalyze: {
    color: Colors.beige,
  },
  afterAnalyzeCont: {
    width: screenWidth * 0.9,
    marginTop: screenHeight * 0.02,
  },
  btnAfterAnalyzeCont: {
    width: screenWidth * 0.9,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: screenHeight * 0.03,
  },
  btnAfterAnalyze: {
    backgroundColor: Colors.beigeOscuro,
    width: screenWidth * 0.4,
    height: screenHeight * 0.05,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  txtSubirOtraImagen: {
    color: Colors.grisOscuro,
  },
  btnIngredients: {
    backgroundColor: Colors.verdeOscuro,
    width: screenWidth * 0.4,
    height: screenHeight * 0.05,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  txtVerIngredientes: {
    color: Colors.beige,
  },
  txtRecetas: {
    color: Colors.verdeMuyOscuro,
    fontSize: 24,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#FDF3C6",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  modalItem: {
    fontSize: 16,
  },
  listCont: {
    width: screenWidth * 0.9,
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
