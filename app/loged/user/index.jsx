import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import { supabase } from "../../../lib/supabase";
import Colors from "../../../assets/colors/Colors";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const User = () => {
  const { user } = useUser();

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [sexo, setSexo] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [estatura, setEstatura] = useState("");

  const guardarDatos = async () => {
    const { data, error } = await supabase
      .from("usuarios")
      .update({
        nombre: nombre,
        apellidos: apellidos,
        sexo: sexo,
        edad: Number(edad), // Asegura que los valores numéricos sean números
        peso: Number(peso),
        estatura: Number(estatura),
      })
      .eq("id_user", user.sub)
      .select();

    if (error) {
      console.error("Error al guardar los datos: ", error);
    }
    console.log("Datos guardados: ", data);
  };

  // Cargar los datos del usuario cuando el componente se monta
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setNombre(user.nombre || "");
      setApellidos(user.apellidos || "");
      setSexo(user.sexo || "");
      setEdad(user.edad?.toString() || "");
      setPeso(user.peso?.toString() || "");
      setEstatura(user.estatura?.toString() || "");
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.titleCont}>
        <Text style={styles.title}>User</Text>
      </View>
      <ScrollView>
        <View style={styles.userCont}>
          <Text style={styles.subtitle}>Correo</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.subtitle}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.subtitle}>Apellidos</Text>
          <TextInput
            style={styles.input}
            value={apellidos}
            onChangeText={setApellidos}
          />

          <Text style={styles.subtitle}>Sexo</Text>
          <TextInput style={styles.input} value={sexo} onChangeText={setSexo} />

          <Text style={styles.subtitle}>Edad</Text>
          <TextInput
            style={styles.input}
            value={edad}
            onChangeText={setEdad}
            keyboardType="numeric"
          />

          <Text style={styles.subtitle}>Peso</Text>
          <TextInput
            style={styles.input}
            value={peso}
            onChangeText={setPeso}
            keyboardType="numeric"
          />

          <Text style={styles.subtitle}>Estatura</Text>
          <TextInput
            style={styles.input}
            value={estatura}
            onChangeText={setEstatura}
            keyboardType="numeric"
          />
        </View>
        <Pressable onPress={() => guardarDatos()}>
          <View style={styles.btn}>
            <Text style={styles.txtBtn}>Guardar</Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: screenHeight * 0.08,
    //justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.beige,
  },
  titleCont: {
    width: screenWidth * 0.9,
    marginBottom: screenHeight * 0.03,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.verdeMuyOscuro,
  },
  userCont: {
    width: screenWidth * 0.9,
    gap: screenHeight * 0.02,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "400",
    color: Colors.verdeMuyOscuro,
  },
  input: {
    backgroundColor: "red",
  },
  btn: {
    width: screenWidth * 0.6,
    backgroundColor: Colors.grisOscuro,
  },
});
