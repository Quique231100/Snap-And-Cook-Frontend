import { Pressable, StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";
import Colors from "../assets/colors/Colors.js";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Register = () => {
  return (
    <View style={styles.container}>
      <View style={styles.saluteCont}>
        <Text style={styles.title}>¡Bienvenido!</Text>
        <Text style={styles.subtitle}>
          Regístrate para comenzar la aventura
        </Text>
      </View>

      <Link href="/Login" asChild>
        <Pressable>
          <View style={styles.loginBtn}>
            <Text style={styles.txtLoginBtn}>
              ¿Ya tienes una cuenta? Iniciar sesión
            </Text>
          </View>
        </Pressable>
      </Link>

      <View style={styles.formCont}>
        {/* Contenedor de los input del nombre y apellidos */}
        <View style={styles.nameCont}>
          {/* Input del nombre */}
          <View style={styles.inputUpCont}>
            <View style={styles.iconCont}>
              <Ionicons name="person" size={32} color="#F4E7D4" />
            </View>
            <TextInput placeholder="Nombre" placeholderTextColor={"#F4E7D4"} />
          </View>
          {/* Input de los apellidos */}
          <View style={styles.inputDownCont}>
            <View style={styles.iconCont}>
              <Ionicons name="person" size={32} color="#F4E7D4" />
            </View>
            <TextInput
              placeholder="Apellidos"
              placeholderTextColor={"#F4E7D4"}
            />
          </View>
        </View>
        {/* Este es el input del correo */}
        <View style={styles.inputCont}>
          <View style={styles.iconCont}>
            <Ionicons name="mail-sharp" size={32} color="#F4E7D4" />
          </View>
          <TextInput placeholder="Correo" placeholderTextColor={"#F4E7D4"} />
        </View>
        {/* Contenedor de los input de las contraseñas */}
        <View style={styles.passCont}>
          {/* Input del nombre */}
          <View style={styles.inputUpCont}>
            <View style={styles.iconCont}>
              <Ionicons name="lock-closed" size={32} color="#F4E7D4" />
            </View>
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor={"#F4E7D4"}
            />
          </View>
          {/* Input de los apellidos */}
          <View style={styles.inputDownCont}>
            <View style={styles.iconCont}>
              <Ionicons name="lock-closed" size={32} color="#F4E7D4" />
            </View>
            <TextInput
              placeholder="Confirmar contraseña"
              placeholderTextColor={"#F4E7D4"}
            />
          </View>
        </View>
        {/* Este es el contenedor para marcar sexo del usuario */}
        <View style={styles.sexCont}>
          <Text style={styles.subtitle}>Apartado para checkbox de Sexo</Text>
        </View>
        {/* Este es el input de la estatura */}
        <View style={styles.inputSizeCont}>
          <View style={styles.iconCont}>
            <Ionicons name="man" size={32} color="#F4E7D4" />
          </View>
          <TextInput placeholder="Estatura" placeholderTextColor={"#F4E7D4"} />
        </View>
        {/* Este es el input de la edad*/}
        <View style={styles.inputAgeCont}>
          <View style={styles.iconCont}>
            <Ionicons name="calendar" size={32} color="#F4E7D4" />
          </View>
          <TextInput placeholder="Edad" placeholderTextColor={"#F4E7D4"} />
        </View>
        {/* Este es el input del peso */}
        <View style={styles.inputWeightCont}>
          <View style={styles.iconCont}>
            <Ionicons name="scale" size={32} color="#F4E7D4" />
          </View>
          <TextInput placeholder="Peso" placeholderTextColor={"#F4E7D4"} />
        </View>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.verdeGasolina,
    justifyContent: "center",
    alignItems: "center",
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
  loginBtn: {
    width: 322,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.beige,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.grisOscuro,
  },
  txtLoginBtn: {
    fontSize: 16,
    color: Colors.grisOscuro,
  },
  formCont: {
    margin: 12,
    width: 322,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "red",
  },
  nameCont: {
    margin: 12,
  },
  passCont: {
    margin: 12,
  },
  sexCont: {
    marginBottom: 12,
  },
  inputCont: {
    flexDirection: "row",
    width: 322,
    height: 48,
    backgroundColor: "#12685D",
    borderRadius: 8,
    gap: 10,
  },
  inputUpCont: {
    flexDirection: "row",
    width: 322,
    height: 48,
    backgroundColor: "#12685D",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.verdeMuyOscuro,
    gap: 10,
  },
  inputDownCont: {
    flexDirection: "row",
    width: 322,
    height: 48,
    backgroundColor: "#12685D",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    gap: 10,
  },
  iconCont: {
    justifyContent: "center",
    alignItems: "center",
  },
  inputSizeCont: {
    flexDirection: "row",
    width: 322,
    height: 48,
    backgroundColor: "#12685D",
    borderRadius: 8,
    gap: 10,
    marginBottom: 12,
  },
  inputAgeCont: {
    flexDirection: "row",
    width: 322,
    height: 48,
    backgroundColor: "#12685D",
    borderRadius: 8,
    gap: 10,
    marginBottom: 12,
  },
  inputWeightCont: {
    flexDirection: "row",
    width: 322,
    height: 48,
    backgroundColor: "#12685D",
    borderRadius: 8,
    gap: 10,
    marginBottom: 12,
  },
});
