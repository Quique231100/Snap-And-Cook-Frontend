import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
} from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import Colors from "../../../assets/colors/Colors";
import { LinearGradient } from "expo-linear-gradient";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const RecetaPage = () => {
  const { id, nombre, img, ingredientes, instrucciones } =
    useLocalSearchParams();

  const ingredientesArray =
    typeof ingredientes === "string"
      ? ingredientes.replace(/[{}]/g, "").split(",")
      : [];

  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: img }} style={styles.imgCont}>
        <LinearGradient
          // Background Linear Gradient
          colors={["rgba(0,0,0,0.8)", "transparent"]}
          style={styles.background}
          start={{ x: 0.5, y: 1.5 }}
          end={{ x: 0.5, y: 0 }}
        />
        <Text style={styles.txtDish}>{nombre}</Text>
      </ImageBackground>
      <View style={styles.recipeCont}>
        <View style={styles.ingredientesCont}>
          <Text style={styles.txtSubtitle}>Ingredietes</Text>

          <Text style={styles.txtAPI}>
            <FlatList
              data={ingredientesArray}
              keyExtractor={(item, id) => id.toString()}
              renderItem={({ item }) => <Text>- {item}</Text>}
            />
          </Text>
        </View>
        <View style={styles.instruccionesCont}>
          <Text style={styles.txtSubtitle}>Instrucciones</Text>
          <Text>{instrucciones}</Text>
          <Text style={styles.txtAPI}></Text>
        </View>
      </View>
    </View>
  );
};

export default RecetaPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.beige,
    alignItems: "center",
  },
  imgCont: {
    width: screenWidth,
    height: screenHeight * 0.4,
    resizeMode: "contain",
    justifyContent: "flex-end",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: screenHeight * 0.4,
  },
  txtDish: {
    color: Colors.beige,
    fontSize: 30,
    fontWeight: "bold",
    marginLeft: screenWidth * 0.05,
    marginBottom: screenHeight * 0.01,
  },
  recipeCont: {},
  ingredientesCont: {
    width: screenWidth,
  },
  txtSubtitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.verdeMuyOscuro,
  },
  txtAPI: {
    fontSize: 20,
    color: Colors.verdeMuyOscuro,
  },
});
