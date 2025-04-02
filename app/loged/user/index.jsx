import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import { supabase } from "../../../lib/supabase";
import Colors from "../../../assets/colors/Colors";
import { useRouter } from "expo-router";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const User = () => {
  const { user, logOut, updateUser } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [sexo, setSexo] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [estatura, setEstatura] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const cambioEditable = () => {
    setIsEditable(!isEditable);
  };

  const guardarDatos = async () => {
    try {
      // 1. Verificar sesión
      setIsLoading(true);
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        throw new Error("No hay sesión activa");
      }

      // 2. Preparar datos para la tabla 'usuarios'
      const userUpdates = {
        nombre: nombre,
        apellidos: apellidos,
        sexo: sexo,
        edad: edad ? parseInt(edad) : null,
        peso: peso ? parseFloat(peso) : null,
        estatura: estatura ? parseFloat(estatura) : null,
      };

      // 3. Actualizar tabla 'usuarios'
      const { error: dbError } = await supabase
        .from("usuarios")
        .update(userUpdates)
        .eq("id_user", session.user.id);

      setIsLoading(false);
      setIsEditable(false);
      Alert.alert("Éxito", "Datos actualizados correctamente");
      if (dbError) {
        throw dbError;
        console.log("Error al actualizar la tabla usuarios:", dbError);
      }

      // 4. Actualizar user_metadata en Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: userUpdates,
      });

      if (authError) {
        throw authError;
        console.log("Error al actualizar user_metadata:", authError);
      }

      // 5. Actualizar contexto local
      await updateUser();
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error", error.message || "Error al actualizar datos", [
        {
          text: "OK",
          onPress: () => console.log("Usuario confirmó error"),
        },
      ]);
    } finally {
      setIsLoading(false); // Se ejecuta siempre, haya error o no
    }
  };

  const cerrarSesion = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "No se pudo cerrar la sesión", [
        {
          text: "OK",
          onPress: () => console.log("Usuario confirmó error de cierre"),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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
        <View style={styles.scrollCont}>
          <View style={styles.userCont}>
            <Text style={styles.subtitle}>Correo</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              editable={isEditable}
            />

            <Text style={styles.subtitle}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              editable={isEditable}
            />

            <Text style={styles.subtitle}>Apellidos</Text>
            <TextInput
              style={styles.input}
              value={apellidos}
              onChangeText={setApellidos}
              editable={isEditable}
            />

            <Text style={styles.subtitle}>Sexo</Text>
            <TextInput
              style={styles.input}
              value={sexo}
              onChangeText={setSexo}
              editable={isEditable}
            />

            <Text style={styles.subtitle}>Edad</Text>
            <TextInput
              style={styles.input}
              value={edad}
              onChangeText={setEdad}
              keyboardType="numeric"
              editable={isEditable}
            />

            <Text style={styles.subtitle}>Peso</Text>
            <TextInput
              style={styles.input}
              value={peso}
              onChangeText={setPeso}
              keyboardType="numeric"
              editable={isEditable}
            />

            <Text style={styles.subtitle}>Estatura</Text>
            <TextInput
              style={styles.input}
              value={estatura}
              onChangeText={setEstatura}
              keyboardType="numeric"
              editable={isEditable}
            />
          </View>

          <View style={styles.btnCont}>
            <Pressable
              onPress={isEditable ? guardarDatos : cambioEditable}
              disabled={isLoading}
            >
              <View style={styles.btn}>
                <Text style={styles.txtBtn}>
                  {isLoading
                    ? "Guardando..."
                    : isEditable
                    ? "Guardar"
                    : "Actualizar"}
                </Text>
              </View>
            </Pressable>

            <Pressable onPress={cerrarSesion} disabled={isLoading}>
              <View style={styles.btn}>
                <Text style={styles.txtBtn}>Cerrar sesión</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: screenHeight * 0.08,
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
  scrollCont: {
    width: screenWidth * 0.9,
  },
  userCont: {
    gap: screenHeight * 0.02,
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "400",
    color: Colors.verdeMuyOscuro,
  },
  input: {
    borderBottomWidth: 1,
    color: Colors.grisOscuro,
    borderBottomColor: Colors.beigeMasOscuro,
    fontSize: 20,
  },
  btnCont: {
    justifyContent: "center",
    alignItems: "center",
    margin: screenHeight * 0.03,
    gap: screenHeight * 0.03,
  },
  btn: {
    width: screenWidth * 0.6,
    height: screenHeight * 0.05,
    justifyContent: "center",
    backgroundColor: Colors.grisOscuro,
    borderRadius: 8,
  },
  txtBtn: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.beige,
    textAlign: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
