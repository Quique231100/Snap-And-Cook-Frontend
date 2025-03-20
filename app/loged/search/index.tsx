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

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const Search = () => {
  const [busqueda, setBusqueda] = useState("");
  const [meals, setMeals] = useState([]);

  const router = useRouter();

  const filterData = meals.filter((dish) =>
    dish.nombre_platillo.toLowerCase().includes(busqueda.toLowerCase())
  );

  //Hook para renderizar los datos cuando se accede a esta ventana

  const fetchData = async () => {
    const { data, error } = await supabase.rpc("obtener_platillos");

    if (error) {
      console.log(error);
    } else {
      setMeals(data);
    }
  };

  useEffect(() => {
    fetchData();
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
              onPress={() =>
                router.push({
                  pathname: "/loged/search/recipe",
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
});
