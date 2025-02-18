import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

const Login = () => {
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
          <View style={styles.iconCont}></View>
          <TextInput placeholder="Correo" placeholderTextColor={"#F4E7D4"} />
        </View>
        <View style={styles.inputCont}>
          <View style={styles.iconCont}></View>
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor={"#F4E7D4"}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.forgotPass}
        onPress={() => console.log("Forgot password")}
      >
        <Text style={styles.subtitle}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => console.log("entrar")}
      >
        <Text style={styles.subtitle}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => console.log("Registrar")}
      >
        <Text style={{ fontSize: 16, color: "#4C5454" }}>
          ¿Aún no tienes una cuenta? Registrarse
        </Text>
      </TouchableOpacity>
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
  },
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
