import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
} from "react-native";
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

        <Link href="/Login" asChild>
          <Pressable>
            <View style={styles.loginBtn}>
              <Text style={styles.txtLoginBtn}>
                ¿Ya tienes una cuenta? Iniciar sesión
              </Text>
            </View>
          </Pressable>
        </Link>
      </View>

      {/* Contenedor del formulario que solo da la opción de hacer scroll */}
      <ScrollView
        style={styles.formScrollCont}
        keyboardShouldPersistTaps="handled"
      >
        {/* Contenedor del formulario*/}
        <View style={styles.formViewCont}>
          {/* Contenedor de los input del nombre y apellidos */}
          <View style={styles.nameCont}>
            {/* Input del nombre */}
            <View style={styles.inputUpCont}>
              <View style={styles.iconCont}>
                <Ionicons name="person" size={32} color="#F4E7D4" />
              </View>
              <TextInput
                placeholder="Nombre"
                placeholderTextColor={"#F4E7D4"}
                style={styles.txtInput}
              />
            </View>
            {/* Input de los apellidos */}
            <View style={styles.inputDownCont}>
              <View style={styles.iconCont}>
                <Ionicons name="person" size={32} color="#F4E7D4" />
              </View>
              <TextInput
                placeholder="Apellidos"
                placeholderTextColor={"#F4E7D4"}
                style={styles.txtInput}
              />
            </View>
          </View>
          {/* Este es el input del correo */}
          <View style={styles.inputCont}>
            <View style={styles.iconCont}>
              <Ionicons name="mail-sharp" size={32} color="#F4E7D4" />
            </View>
            <TextInput
              placeholder="Correo"
              placeholderTextColor={"#F4E7D4"}
              style={styles.txtInput}
              keyboardType="email-address"
            />
          </View>
          {/* Contenedor de los input de las contraseñas */}
          <View style={styles.passCont}>
            {/* Input de la contraseña */}
            <View style={styles.inputUpCont}>
              <View style={styles.iconCont}>
                <Ionicons name="lock-closed" size={32} color="#F4E7D4" />
              </View>
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor={"#F4E7D4"}
                style={styles.txtInput}
                secureTextEntry={true}
              />
            </View>
            {/* Input de confirmar la contraseña */}
            <View style={styles.inputDownCont}>
              <View style={styles.iconCont}>
                <Ionicons name="lock-closed" size={32} color="#F4E7D4" />
              </View>
              <TextInput
                placeholder="Confirmar contraseña"
                placeholderTextColor={"#F4E7D4"}
                style={styles.txtInput}
                secureTextEntry={true}
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
            <TextInput
              placeholder="Estatura"
              placeholderTextColor={"#F4E7D4"}
              style={styles.txtInput}
              keyboardType="numeric"
            />
          </View>
          {/* Este es el input de la edad*/}
          <View style={styles.inputAgeCont}>
            <View style={styles.iconCont}>
              <Ionicons name="calendar" size={32} color="#F4E7D4" />
            </View>
            <TextInput
              placeholder="Edad"
              placeholderTextColor={"#F4E7D4"}
              style={styles.txtInput}
              keyboardType="number-pad"
            />
          </View>
          {/* Este es el input del peso */}
          <View style={styles.inputWeightCont}>
            <View style={styles.iconCont}>
              <Ionicons name="scale" size={32} color="#F4E7D4" />
            </View>
            <TextInput
              placeholder="Peso"
              placeholderTextColor={"#F4E7D4"}
              style={styles.txtInput}
              keyboardType="numeric"
            />
          </View>
          {/* Botón para el registro de datos*/}
          <Pressable onPress={() => console.log("Registro")}>
            <View style={styles.registerBtn}>
              <Text style={styles.txtRegisterBtn}>Registrar</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
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
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: "30%",
    marginBottom: "10%",
    // backgroundColor: "red",
  },
  title: {
    fontSize: 36,
    color: Colors.beige,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.beige,
  },
  loginBtn: {
    width: "100%",
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
  formScrollCont: {
    width: "90%",
    height: "40%",
    marginBottom: "12%",
  },
  formViewCont: {
    //backgroundColor: "green",
  },
  nameCont: {
    marginBottom: "4%",
  },
  passCont: {
    marginTop: "4%",
  },
  sexCont: {
    width: "100%",
    backgroundColor: "green",
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  inputCont: {
    flexDirection: "row",
    width: "100%",
    height: 48,
    backgroundColor: Colors.verdeOscuro,
    borderRadius: 8,
    gap: 10,
    //backgroundColor: "red",
  },
  inputUpCont: {
    flexDirection: "row",
    width: "100%",
    height: 48,
    backgroundColor: "#12685D",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.verdeMuyOscuro,
    gap: 10,
  },
  txtInput: { width: "100%", color: Colors.beige },
  inputDownCont: {
    flexDirection: "row",
    width: "100%",
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
    width: "100%",
    height: 48,
    backgroundColor: "#12685D",
    borderRadius: 8,
    gap: 10,
    marginBottom: "4%",
  },
  inputAgeCont: {
    flexDirection: "row",
    width: "100%",
    height: 48,
    backgroundColor: "#12685D",
    borderRadius: 8,
    gap: 10,
    marginBottom: "4%",
  },
  inputWeightCont: {
    flexDirection: "row",
    width: "100%",
    height: 48,
    backgroundColor: "#12685D",
    borderRadius: 8,
    gap: 10,
    marginBottom: "4%",
  },
  registerBtn: {
    width: "100%",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.grisOscuro,
    borderRadius: 8,
  },
  txtRegisterBtn: {
    fontSize: 16,
    color: Colors.beige,
  },
});
