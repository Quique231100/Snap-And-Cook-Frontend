// //Este es el archivo principal donde la app funciona correctamente

// //Importación de las ventanas de la aplicación
// import Login from "./Login.jsx";

// //Función principal de la aplicación
// export default function Index() {
//   return <Login />;
// }

import { Text, View, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import Colors from "../assets/colors/Colors.js";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.txtTitle}>Bienvenido</Text>

      <View style={styles.btnContainer}>
        <Link href="/Login" asChild>
          <Pressable>
            <View style={styles.loginBtn}>
              <Text style={styles.txtLoginBtn}>Iniciar sesión</Text>
            </View>
          </Pressable>
        </Link>

        <Link href="/Register" asChild>
          <Pressable onPress={() => console.log("Login")}>
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
  txtTitle: {
    color: Colors.beige,
  },
  btnContainer: {
    gap: 24,
  },
  loginBtn: {
    width: 322,
    height: 48,
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
    width: 322,
    height: 48,
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
