import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Button,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import Colors from "../assets/colors/Colors";
import axios from "axios";
import { useUser } from "../context/UserContext";

//const baseUrl = process.env.DB_HOST; //ESTO DEJO DE FUNCIONAR, SE NECESITA ANALIZAR COMO OBTENER EL VALOR DE LA VARIABLE DE ENTORNO
const baseUrl = "http://localhost:4000"; //CAMBIAR ESTO EN PRODUCCION, SOLO ES PARA PRUEBAS

const Login = () => {
  //Este es un ejemplo
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  //Funcion para inicio de sesion
  const handleLogin = () => {
    console.log("Email: ", email);
    console.log("Password: ", password);
    try {
      //Validación campos vacíos
      if (!email.trim() || !password.trim()) {
        Alert.alert("Error", "Debe llenar los campos para continuar");
        return;
      }
      axios({
        method: "post",
        url: `${baseUrl}/users/sign-in`,
        data: {
          correo: email,
          contrasena: password,
        },
      })
        .then((response) => {
          if (!response.data) {
            Alert.alert("Error", "Correo o contraseña incorrectos");
            return;
          }
          // Si el inicio de sesión es exitoso, redirigir a Home
          setUser(response.data);
          router.push("/home");
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            Alert.alert("Error", "Correo o contraseña incorrectos");
          } else {
            console.error("Error en la petición:", error);
          }
        });
    } catch (error) {
      console.error("Error en la ejecución:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.saluteCont}>
        <Text style={styles.title}>¡Bienvenido!</Text>
        <Text style={styles.subtitle}>
          Inicia sesión con tu cuenta para entrar
        </Text>
      </View>
      <View style={styles.bothInputCont}>
        <View style={styles.inputCont}>
          <View style={styles.iconCont}>
            <Ionicons name="person" size={32} color="#F4E7D4" />
          </View>
          <TextInput
            placeholder="Correo"
            placeholderTextColor={"#F4E7D4"}
            style={styles.txtInput}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputCont}>
          <View style={styles.iconCont}>
            <Ionicons name="lock-closed" size={32} color="#F4E7D4" />
          </View>
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor={"#F4E7D4"}
            style={styles.txtInput}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
        </View>
      </View>

      <Link href="/" asChild>
        <Pressable>
          <View>
            <Text style={styles.subtitle}>¿Olvidaste tu contraseña?</Text>
          </View>
        </Pressable>
      </Link>

      {/* <Link href="/home" asChild> */}
      <Pressable onPress={handleLogin}>
        {/* <Pressable> */}
        <View style={styles.loginButton}>
          <Text style={styles.subtitle}>Entrar</Text>
        </View>
      </Pressable>
      {/* </Link> */}

      <Button title="BaseURL" onPress={() => console.log(baseUrl)} />

      <Link href="/register" asChild>
        <Pressable>
          <View style={styles.registerButton}>
            <Text style={{ fontSize: 16, color: "#4C5454" }}>
              ¿Aún no tienes una cuenta? Registrarse
            </Text>
          </View>
        </Pressable>
      </Link>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1EA896",
  },
  saluteCont: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    margin: 28,
  },
  title: {
    fontSize: 36,
    color: "#F4E7D4",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#F4E7D4",
  },
  bothInputCont: {
    gap: 10,
    marginBottom: 28,
  },
  inputCont: {
    flexDirection: "row",
    width: 322,
    height: 48,
    backgroundColor: "#12685D",
    borderRadius: 8,
    gap: 10,
  },
  iconCont: {
    justifyContent: "center",
    alignItems: "center",
  },
  txtInput: { width: "100%", color: Colors.beige },
  loginButton: {
    width: 322,
    height: 48,
    backgroundColor: "#4C5454",
    justifyContent: "center",
    alignItems: "center",
    margin: 28,
    borderRadius: 8,
  },
  registerButton: {
    width: 322,
    height: 48,
    backgroundColor: "#F4E7D4",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4C5454",
    borderRadius: 8,
  },
});
