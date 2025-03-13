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
import Colors from "../../../assets/colors/Colors";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const baseUrl = "http://192.168.0.105:4000"; // CAMBIAR ESTO EN PRODUCCIÓN

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export default function indexAnalyze() {
  const [image, setImage] = useState(null);
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
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitas otorgar permisos para acceder a la cámara."
      );
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      Alert.alert("Error", "Selecciona una imagen antes de analizar");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: image,
        name: "image.jpg",
        type: "image/jpeg",
      });

      axios({
        method: "post",
        url: `${baseUrl}/api/analyze`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((response) => {
          setLoading(false);
          if (!response.data || !response.data.results) {
            Alert.alert("Error", "Error en el análisis");
            return;
          }

          let ingredientsData = response.data.results[2];

          // Verificamos si el resultado es un string y lo convertimos a array
          if (typeof ingredientsData === "string") {
            try {
              ingredientsData = JSON.parse(ingredientsData);
            } catch (error) {
              Alert.alert("Error", "No se pudieron procesar los ingredientes.");
              return;
            }
          }

          if (Array.isArray(ingredientsData) && ingredientsData.length > 0) {
            setIngredients(ingredientsData);
            fetchRecipes(ingredientsData);
            Alert.alert("¡Listo!", "Los ingredientes han sido detectados");
          } else {
            setIngredients([]);
            Alert.alert("Información", "No se encontraron ingredientes.");
          }
        })
        .catch((error) => {
          console.error("Error en la petición:", error);
          Alert.alert("Error", "No se pudo completar el análisis.");
        });
    } catch (error) {
      console.error("Error en la ejecución", error);
      Alert.alert("Error", "No se pudo completar la ejecución.");
    }
  };

  const fetchRecipes = async (ingredients) => {
    try {
      const response = await axios.post(`${baseUrl}/platillos/by-ingredients`, {
        ingredientes: ingredients,
      });
      if (response.data && response.data.length > 0) {
        setRecipes(response.data);
      } else {
        console.log("No se encontraron recetas");
        setRecipes([]);
      }
    } catch (error) {
      console.error("Error al obtener recetas:", error);
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
                <Text style={styles.txtSubirOtraImagen}>Subir otra imagen</Text>
              </View>
            </Pressable>

            <Pressable onPress={() => setModalVisible(true)}>
              <View style={styles.btnIngredients}>
                <Text style={styles.txtVerIngredientes}>Ver ingredientes</Text>
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
                  onPress={() =>
                    router.push({
                      pathname: "/loged/analyze/recipe",
                      params: {
                        nombre: item.nombre_platillo,
                        img: item.imagen_platillo,
                        ingredientes: item.ingredientes,
                        instrucciones: item.instrucciones_platillo,
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
                        // Background Linear Gradient
                        colors={["rgba(0,0,0,0.8)", "transparent"]}
                        style={styles.background}
                        start={{ x: 0.5, y: 1.1 }}
                        end={{ x: 0.5, y: 0 }}
                      />
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
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Ingredientes</Text>
            <FlatList
              data={ingredients}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={styles.modalItem}>• {item}</Text>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.beige,
  },
  titleCont: {
    width: screenWidth * 0.9,
    marginBottom: screenHeight * 0.03,
    marginTop: screenHeight * -0.35,
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
});
