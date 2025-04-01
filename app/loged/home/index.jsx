import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ImageBackground,
  ScrollView,
  Alert,
} from "react-native";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { HelloWave } from "@/components/HelloWave";
import Colors from "../../../assets/colors/Colors";
import { useUser } from "../../../context/UserContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";

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
  const [advice, setAdvice] = useState([]);
  const [mealsRand, setMealsRand] = useState([]);
  const [lastMeals, setLastMeals] = useState([]);
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

  const getAdvice = async () => {
    const { data, error } = await supabase.rpc("obtener_recomendaciones_salud");
    if (error) {
      Alert.alert(
        "Error en salud",
        "No se pudo obtener las recomendaciones de salud"
      );
      setAdvice([]);
    } else {
      setAdvice(data);
    }
  };

  const getPopularMeals = async () => {
    const { data, error } = await supabase.rpc(
      "obtener_platillos_por_popularidad",
      {
        limit_count: 5,
      }
    );

    if (error) console.error("Error al obtener platillos", error);

    setMealsRand(data);
  };

  const getLastMeals = async (usuarioId) => {
    const { data, error } = await supabase.rpc("get_ultimos_vistos", {
      user_uuid: usuarioId,
    });

    if (error) {
      console.error("Error al obtener historial:", error);
      setLastMeals([]);
    }
    setLastMeals(data);
  };

  const registerRecipeViews = async (recipeId) => {
    if (!user || !user.sub) return;

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
      console.log("Vista registrada correctamente :", data); // Debería mostrar el registro
      return data;
    } catch (error) {
      console.error("Error registrando vista de receta:", error);
      return null;
    }
  };

  useEffect(() => {
    getPopularMeals();
    getAdvice();
    getLastMeals(user.sub);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.saluteCont}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: screenWidth * 0.9,
            justifyContent: "space-between",
          }}
        >
          {/* <View style={{ backgroundColor: "red" }}> */}
          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <HelloWave />
              <Text style={styles.welcomeTxt}>Bienvenido</Text>
            </View>
            <Text style={styles.userTxt}>
              {user.nombre} {user.apellidos}
            </Text>
          </View>
          <Image
            source={require("../../../assets/images/Snap&Cook_Logotipo_03.png")}
            style={{
              resizeMode: "cover",
              width: screenWidth * 0.3,
              height: screenHeight * 0.15,
            }}
          />
        </View>
      </View>
      <ScrollView>
        <View style={styles.advicesCont}>
          <View style={styles.recuerdaCont}>
            <Text style={styles.subtitleTxt}>Recuerda 🤔</Text>
          </View>

          <FlatList
            data={advice}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.flatlistCont}>
                <View style={styles.itemCont}>
                  <View style={styles.descriptionItemCont}>
                    <Text style={styles.txtTitleItem}>{item.titulo}</Text>
                    <Text style={styles.txtDescriptionItem}>{item.frase}</Text>
                  </View>
                  <Image source={{ uri: item.imagen }} style={styles.imgCont} />
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
            {advice.map((_, id) => (
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
            <Text style={styles.subtitleTxt}>🔥 Tendencia esta semana</Text>
          </View>

          <View style={styles.recetasCont}>
            <FlatList
              data={mealsRand}
              keyExtractor={(item, id) => id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    console.log(item);
                    registerRecipeViews(item.id);
                    router.push({
                      pathname: "/loged/home/recipe",
                      params: {
                        nombre: item.nombre_platillo,
                        img: item.imagen_platillo,
                        ingredientes: item.ingredientes,
                        instrucciones: item.instrucciones_platillo,
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
          </View>

          <View style={styles.recetasTxtCont}>
            <Text style={styles.subtitleTxt}>⏱️ Últimas recetas vistas</Text>
          </View>

          <View style={styles.recetasCont}>
            <FlatList
              data={lastMeals}
              keyExtractor={(item, id) => id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    console.log(item);
                    registerRecipeViews(item.id);
                    router.push({
                      pathname: "/loged/home/recipe",
                      params: {
                        nombre: item.nombre_platillo,
                        img: item.imagen_platillo,
                        ingredientes: item.ingredientes,
                        instrucciones: item.instrucciones_platillo,
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
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.beige,
    alignItems: "center",
    paddingBottom: screenHeight * 0.01,
  },
  saluteCont: {
    width: screenWidth,
    height: screenHeight * 0.22,
    justifyContent: "center",
    alignItems: "center",
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
    gap: screenHeight * 0.01,
    justifyContent: "center",
    marginLeft: screenWidth * 0.025,
  },
  txtTitleItem: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.grisOscuro,
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
});
