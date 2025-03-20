//Este es el archivo principal donde la app funciona correctamente

//Importación de las ventanas de la aplicación
import "react-native-url-polyfill/auto.js";
import { Text, View, StyleSheet, Pressable, Image } from "react-native";
import { Link } from "expo-router";
import Colors from "../assets/colors/Colors.js";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase.ts";
import { useEffect, useState } from "react";

//Función principal de la aplicación
export default function Index() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.saluteContainer}>
        <Text style={styles.txtTitle}>Bienvenido</Text>
        <Text style={styles.txtSubtitle}>
          Cualquier receta en tan solo un "shoot"
        </Text>
      </View>

      <View style={styles.imgCont}>
        <Image
          style={styles.imgM}
          source={require("@/assets/images/imgWelcome.png")}
        />
      </View>

      <View style={styles.btnContainer}>
        <Link href="/login" asChild>
          <Pressable>
            <View style={styles.loginBtn}>
              <Text style={styles.txtLoginBtn}>Iniciar sesión</Text>
            </View>
          </Pressable>
        </Link>

        <Link href="/register" asChild>
          <Pressable>
            <View style={styles.registerBtn}>
              <Text style={styles.txtRegisterBtn}>Crear una cuenta</Text>
            </View>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.verdeGasolina,
    alignItems: "center",
    justifyContent: "center",
  },
  saluteContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: "10%",
  },
  txtTitle: {
    color: Colors.beige,
    fontSize: 36,
    fontWeight: "bold",
  },
  txtSubtitle: {
    color: Colors.beige,
    fontSize: 16,
  },
  imgCont: {
    width: "80%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "4%",
  },
  imgM: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  btnContainer: {
    width: "80%",
    height: "20%",
  },
  loginBtn: {
    width: "100%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.grisOscuro,
    borderRadius: 8,
  },
  txtLoginBtn: {
    color: Colors.beige,
    fontSize: 16,
  },
  registerBtn: {
    width: "100%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.beige,
    borderWidth: 1,
    borderColor: Colors.grisOscuro,
    borderRadius: 8,
  },
  txtRegisterBtn: {
    color: Colors.grisOscuro,
    fontSize: 16,
  },
});
