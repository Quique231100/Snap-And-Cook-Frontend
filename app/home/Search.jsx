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
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../../assets/colors/Colors";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

const datosPrueba = {
  dishes: [
    {
      id: 1,
      nombre: "Plato 1",
      img: "https://www.shutterstock.com/image-photo/delicious-mostachol-dish-bread-red-600nw-2183362559.jpg",
    },
    {
      id: 2,
      nombre: "Plato 2",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-bj-jfAo5TSgHaiSm_5EvSUB5djsCcOSHEQ&s",
    },
    {
      id: 3,
      nombre: "Plato 3",
      img: "https://st2.depositphotos.com/1066961/9489/i/950/depositphotos_94891990-stock-photo-tandoori-chicken-salad-overhead-view.jpg",
    },
    {
      id: 4,
      nombre: "Plato 4",
      img: "https://as2.ftcdn.net/jpg/04/23/23/51/1000_F_423235179_2OUjMjS039QTsDgJd1Y2faorT81Xlyde.jpg",
    },
    {
      id: 5,
      nombre: "Plato 5",
      img: "https://www.dzoom.org.es/wp-content/uploads/2019/04/fotografia-de-comida-platos8-734x489.jpg",
    },
    {
      id: 6,
      nombre: "Plato 6",
      img: "https://www.blogdelfotografo.com/wp-content/uploads/2024/03/ella-olsson-6UxD0NzDywI-unsplash.webp",
    },
    {
      id: 7,
      nombre: "Plato 7",
      img: "https://media.gettyimages.com/id/1276524827/es/foto/avocado-toast.jpg?s=612x612&w=gi&k=20&c=PyNDasj8AmC8am9XC5q1fyGceICBLX52Y4qZgEu7u8c=",
    },
    {
      id: 8,
      nombre: "Plato 8",
      img: "https://media.istockphoto.com/id/493998607/es/foto/ensalada-de-pasta-en-un-taz%C3%B3n-de-corte-de-vidrio.jpg?s=612x612&w=0&k=20&c=PT0CLUarPR1stnWJiVKYogqPUjuApK0nu0p2LlFvUmc=",
    },
    {
      id: 9,
      nombre: "Plato 9",
      img: "https://www.shutterstock.com/image-photo/still-life-spike-typical-spanish-260nw-1106984015.jpg",
    },
    {
      id: 10,
      nombre: "Plato 10",
      img: "https://www.blogdelfotografo.com/wp-content/uploads/2024/03/suchandra-varma-f-x-84TUAI8-unsplash.webp",
    },
  ],
};

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const Search = () => {
  const [busqueda, setBusqueda] = useState("");
  const [data, setData] = useState([]);

  const filterData = datosPrueba.dishes.filter((dish) =>
    dish.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const fecthData = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "https://magicloops.dev/api/loop/80082ec7-4934-4d57-830a-1f97b629f1c4/run?results=10",
      });
      setData(response.data.dishes);
      console.log(response.data.dishes);
    } catch (error) {
      console.error("Error en la ejecucion: ", error);
    }
  };

  //Hook para renderizar los datos cuando se accede a esta ventana
  // useEffect(() => {
  //   fecthData();
  // }, []);

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
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable onPress={() => console.log(item.id)}>
              <View style={styles.itemCont}>
                <ImageBackground
                  source={{ uri: item.img }}
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
                    <Text style={styles.txtItem}>{item.nombre}</Text>
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
