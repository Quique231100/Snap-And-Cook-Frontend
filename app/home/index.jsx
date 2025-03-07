import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import React from "react";
import Colors from "../../assets/colors/Colors";
import { useUser } from "../../context/UserContext";

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
      text: "Mantente siempre hidratado tomando 3 litros de agua al dia",
      img: "https://www.prosaudesl.com/la-importancia-de-la-hidratacion-como-el-agua-impacta-en-tu-salud_img234714t1.jpg",
    },
    // {
    //   id: 3,
    //   text: "No olvides hacer ejercicio al menos 30 minutos al dia",
    //   img: "https://enlinea.santotomas.cl/web/wp-content/uploads/sites/2/2017/03/ejercicio-salud-tuillang-yuing.ust-vina-del-mar.jpg",
    // },
  ],
};

const Index = () => {
  const { user } = useUser();
  return (
    <View style={styles.container}>
      <View style={styles.saluteCont}>
        <Text style={styles.welcomeTxt}>Bienvenido</Text>
        {/* <Text style={styles.userTxt}>{user.nombre}</Text> */}
      </View>

      <View style={styles.advicesCont}>
        <View style={styles.recuerdaCont}>
          <Text style={styles.subtitleTxt}>Recuerda ...</Text>
        </View>
        <View>
          <FlatList
            data={datos.advice}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.sliderItemCont}>
                <View style={styles.descriptionItemCont}>
                  <Text style={styles.txtDescriptionItem}>{item.text}</Text>
                </View>
                <Image source={{ uri: item.img }} style={styles.imgCont} />
              </View>
            )}
            horizontal={true}
          />
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
    //justifyContent: "center",
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
    backgroundColor: "red",
    width: screenWidth,
  },
  subtitleTxt: {
    fontSize: 24,
    color: Colors.grisOscuro,
  },
  sliderItemCont: {
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
});
