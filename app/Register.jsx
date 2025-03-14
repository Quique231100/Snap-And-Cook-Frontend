import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React from "react";
import Colors from "../assets/colors/Colors.js";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useState } from "react";

//Cambiar en produccion
const baseUrl = "http://localhost:4000";

const Register = () => {
  const router = useRouter();

  // Estados para cada campo del formulario
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [sexo, setSexo] = useState("");
  const [edad, setEdad] = useState("");
  const [estatura, setEstatura] = useState("");
  const [peso, setPeso] = useState("");
  const [enfermedades, setEnfermedades] = useState("Ninguna");
  const [alergias, setAlergias] = useState("Ninguna");

  // Función para manejar el registro
  const handleRegister = async () => {
    if (contrasena !== confirmarContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Crear el objeto con los datos del usuario (ESTO ANTES DE ACTUALIZAR - QUIQUE)
    // const userData = {
    //   nombre,
    //   apellidos,
    //   correo,
    //   contrasena,
    //   sexo,
    //   edad: parseInt(edad, 10),
    //   estatura: parseFloat(estatura),
    //   peso: parseFloat(peso),
    //   enfermedades,
    //   alergias,
    // };

    try {
      //ESTO ES ANTES DE ACTUALIZAR - QUIQUE
      // const response = await axios.post(baseUrl, userData);

      // // Manejar la respuesta del backend
      // if (response.status === 201) {
      //   alert("Usuario registrado correctamente");
      //   // Redirigir al usuario a la pantalla de inicio de sesión o dashboard
      // }
      axios({
        method: "post",
        url: `${baseUrl}/users/sign-up`,
        data: {
          nombre: nombre,
          apellidos: apellidos,
          correo: correo,
          contrasena: contrasena,
          sexo: sexo,
          edad: parseInt(edad, 10),
          estatura: parseFloat(estatura),
          peso: parseFloat(peso),
        },
      })
        .then((response) => {
          if (!response.data) {
            Alert.alert("Error", "Datos incorrectos");
            return;
          }
          // Si el inicio de sesión es exitoso, redirigir a Home
          Alert.alert("Exito", "Registro exitoso, por favor inicia sesión");
          router.push("/login");
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            Alert.alert("Error", "Datos incorrectos");
          } else {
            console.error("Error en la petición:", error);
          }
        });
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      if (error.response && error.response.status === 409) {
        Alert.alert("El correo electrónico ya está en uso");
      } else {
        Alert.alert("Error en el servidor. Inténtalo de nuevo más tarde.");
      }
    }
  };

  /* Función para los checkbox */
  const Checkbox = ({ label, checked, onChange }) => {
    return (
      <TouchableOpacity onPress={onChange} style={styles.checkboxContainer}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]} />
        <Text style={styles.checkboxLabel}>{label}</Text>
      </TouchableOpacity>
    );
  };

  /* Función para elegir el tipo de sexo */
  const handleSexoChange = (selectedSexo) => {
    setSexo(selectedSexo);
  };

  return (
    <View style={styles.container}>
      <View style={styles.saluteCont}>
        <Text style={styles.title}>¡Bienvenido!</Text>
        <Text style={styles.subtitle}>
          Regístrate para comenzar la aventura
        </Text>

        <Link href="/login" asChild>
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
                value={nombre}
                onChangeText={setNombre}
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
                value={apellidos}
                onChangeText={setApellidos}
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
              value={correo}
              onChangeText={setCorreo}
              autoCapitalize="none"
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
                value={contrasena}
                onChangeText={setContrasena}
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
                value={confirmarContrasena}
                onChangeText={setConfirmarContrasena}
              />
            </View>
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
              value={estatura}
              onChangeText={setEstatura}
            />
          </View>
          {/* Este es el contenedor para marcar sexo del usuario */}
          <View style={styles.sexCont}>
            <View style={styles.sexHeader}>
              <Ionicons name="male" size={24} color="#F4E7D4" />
              <Ionicons name="female" size={24} color="#F4E7D4" />
              <Text style={styles.sexLabel}>Sexo</Text>
            </View>
            <View style={styles.checkboxGroup}>
              <Checkbox
                label="Femenino"
                checked={sexo === "Femenino"}
                onChange={() => handleSexoChange("Femenino")}
              />
              <Checkbox
                label="Masculino"
                checked={sexo === "Masculino"}
                onChange={() => handleSexoChange("Masculino")}
              />
            </View>
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
              value={edad}
              onChangeText={setEdad}
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
              value={peso}
              onChangeText={setPeso}
            />
          </View>
          {/* Botón para el registro de datos*/}
          <Pressable onPress={handleRegister}>
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
    backgroundColor: "#12685D",
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    padding: 10,
    marginTop: "4%",
  },
  sexHeader: {
    flexDirection: "row",
    alignItems: "left",
    marginBottom: 10,
  },
  sexLabel: {
    fontSize: 16,
    color: Colors.beige,
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
    marginTop: "4%",
  },
  inputAgeCont: {
    flexDirection: "row",
    width: "100%",
    height: 48,
    backgroundColor: "#12685D",
    borderRadius: 8,
    gap: 10,
    marginBottom: "4%",
    marginTop: "4%",
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
  checkboxGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    height: 20,
    width: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.beige,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: Colors.beige,
  },
  checkboxLabel: {
    fontSize: 16,
    color: Colors.beige,
  },
});
