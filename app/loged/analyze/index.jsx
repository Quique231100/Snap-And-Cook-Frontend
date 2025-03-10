import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../../assets/colors/Colors";
import * as ImagePicker from "expo-image-picker";
import { resolveScheme } from "expo-linking";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export default function indexAnalyze() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitas otorgar permisos para acceder a la galeria"
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
        "Necesitas otorgar permisos para acceder a la camara"
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
                <Text style={styles.txtBtnAnalyze}>Tomar fotografia</Text>
              </View>
            </Pressable>
          </View>
        )}
      </View>
      {image && (
        <View style={styles.afterAnalyzeCont}>
          <View style={styles.btnAfterAnalyzeCont}>
            <Pressable onPress={() => console.log("Subir otra imagen")}>
              <View style={styles.btnAfterAnalyze}>
                <Text styles={styles.txtSubirOtraImagen}>
                  Subir otra imagen
                </Text>
              </View>
            </Pressable>
            <Pressable onPress={() => console.log("Ver ingredientes")}>
              <View style={styles.btnIngredients}>
                <Text styles={styles.txtVerIngredientes}>Ver ingredientes</Text>
              </View>
            </Pressable>
          </View>
          <Text style={styles.txtRecetas}>Recetas recomendadas</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.beige,
    justifyContent: "center",
    alignItems: "center",
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
  txtVerIngredientes: {
    color: Colors.beige,
  },
  btnIngredients: {
    backgroundColor: Colors.verdeOscuro,
    width: screenWidth * 0.4,
    height: screenHeight * 0.05,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  txtRecetas: {
    color: Colors.verdeMuyOscuro,
    fontSize: 24,
    fontWeight: "bold",
  },
});
