import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  StyleSheet, 
  Alert, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import Colors from "../../../assets/colors/Colors";
import { useUser } from "../../../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import {useRouter} from "expo-router";
import { CommonActions } from "@react-navigation/native";

const User = () => {
  const { user, isAuthenticated, updateUser, logout, loadingAuth } = useUser();
  const navigation = useNavigation();
  const router = useRouter();
  
  // Estado inicial protegido
  const [userData, setUserData] = useState({
    nombre: user?.nombre || "",
    apellidos: user?.apellidos || "",
    correo: user?.email || "",
    sexo: user?.sexo || "",
    edad: user?.edad ? String(user.edad) : "",
    estatura: user?.estatura ? String(user.estatura) : "",
    peso: user?.peso ? String(user.peso) : "",
  });

  const [editando, setEditando] = useState(false);
  const [errores, setErrores] = useState({
    edad: "",
    estatura: "",
    peso: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        nombre: user.nombre || "",
        apellidos: user.apellidos || "",
        correo: user.email || "",
        sexo: user.sexo || "",
        edad: user.edad ? String(user.edad) : "",
        estatura: user.estatura ? String(user.estatura) : "",
        peso: user.peso ? String(user.peso) : "",
      });
    }
  }, [user]);

  const validarCampos = () => {
    const nuevosErrores = {
      edad: "",
      estatura: "",
      peso: "",
    };
    let valido = true;

    if (!userData.edad.trim()) {
      nuevosErrores.edad = "La edad es requerida";
      valido = false;
    } else if (isNaN(parseFloat(userData.edad))) {
      nuevosErrores.edad = "Debe ser un número válido";
      valido = false;
    } else if (parseFloat(userData.edad) < 1 || parseFloat(userData.edad) > 120) {
      nuevosErrores.edad = "Edad debe ser entre 1 y 120";
      valido = false;
    }

    if (!userData.estatura.trim()) {
      nuevosErrores.estatura = "La estatura es requerida";
      valido = false;
    } else if (isNaN(parseFloat(userData.estatura))) {
      nuevosErrores.estatura = "Debe ser un número válido";
      valido = false;
    } else if (parseFloat(userData.estatura) < 50 || parseFloat(userData.estatura) > 250) {
      nuevosErrores.estatura = "Estatura debe ser entre 50 y 250 cm";
      valido = false;
    }

    if (!userData.peso.trim()) {
      nuevosErrores.peso = "El peso es requerido";
      valido = false;
    } else if (isNaN(parseFloat(userData.peso))) {
      nuevosErrores.peso = "Debe ser un número válido";
      valido = false;
    } else if (parseFloat(userData.peso) < 2 || parseFloat(userData.peso) > 300) {
      nuevosErrores.peso = "Peso debe ser entre 2 y 300 kg";
      valido = false;
    }

    setErrores(nuevosErrores);
    return valido;
  };

  const handleChange = (field, value) => {
    if (["edad", "estatura", "peso"].includes(field)) {
      if (/^\d*\.?\d*$/.test(value)) {
        setUserData({ ...userData, [field]: value });
        if (errores[field]) {
          setErrores({ ...errores, [field]: "" });
        }
      }
    } else {
      setUserData({ ...userData, [field]: value });
    }
  };

  const guardarCambios = async () => {
    if (!validarCampos()) {
      Alert.alert("Error", "Por favor corrige los errores antes de guardar");
      return;
    }

    setLoading(true);
    try {
      await updateUser({
        nombre: userData.nombre,
        apellidos: userData.apellidos,
        email: userData.correo,
        sexo: userData.sexo,
        edad: parseFloat(userData.edad),
        estatura: parseFloat(userData.estatura),
        peso: parseFloat(userData.peso),
      });
      
      Alert.alert("Éxito", "Datos guardados correctamente");
      setEditando(false);
    } catch (error) {
      Alert.alert("Error", "No se pudieron guardar los cambios");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      router.push("/");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Sí, cerrar sesión", 
          onPress: handleLogout
        }
      ]
    );
  };

  if (loading || loadingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Perfil de Usuario</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput 
            style={[styles.input, styles.disabledInput]} 
            value={userData.nombre}
            editable={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Apellidos</Text>
          <TextInput 
            style={[styles.input, styles.disabledInput]} 
            value={userData.apellidos}
            editable={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput 
            style={[styles.input, styles.disabledInput]} 
            value={userData.correo} 
            editable={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Sexo</Text>
          <TextInput 
            style={[styles.input, styles.disabledInput]} 
            value={userData.sexo}
            editable={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Edad</Text>
          <TextInput 
            style={[styles.input, editando ? styles.editableInput : styles.disabledInput]} 
            value={userData.edad}
            onChangeText={(text) => handleChange("edad", text)} 
            editable={editando} 
            keyboardType="numeric" 
            placeholder="Ej: 25" 
          />
          {errores.edad ? <Text style={styles.errorText}>{errores.edad}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Estatura (cm)</Text>
          <TextInput 
            style={[styles.input, editando ? styles.editableInput : styles.disabledInput]} 
            value={userData.estatura}
            onChangeText={(text) => handleChange("estatura", text)} 
            editable={editando} 
            keyboardType="numeric" 
            placeholder="Ej: 175" 
          />
          {errores.estatura ? <Text style={styles.errorText}>{errores.estatura}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput 
            style={[styles.input, editando ? styles.editableInput : styles.disabledInput]} 
            value={userData.peso}
            onChangeText={(text) => handleChange("peso", text)} 
            editable={editando} 
            keyboardType="numeric" 
            placeholder="Ej: 70.5" 
          />
          {errores.peso ? <Text style={styles.errorText}>{errores.peso}</Text> : null}
        </View>

        <View style={styles.buttonContainer}>
          {editando ? (
            <>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={guardarCambios}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setEditando(false);
                  setErrores({ edad: "", estatura: "", peso: "" });
                  if (user) {
                    setUserData({
                      nombre: user.nombre || "",
                      apellidos: user.apellidos || "",
                      correo: user.email || "",
                      sexo: user.sexo || "",
                      edad: user.edad ? String(user.edad) : "",
                      estatura: user.estatura ? String(user.estatura) : "",
                      peso: user.peso ? String(user.peso) : "",
                    });
                  }
                }}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity 
                style={[styles.button, styles.editButton]}
                onPress={() => setEditando(true)}
              >
                <Text style={styles.buttonText}>Editar Información</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.logoutButton]}
                onPress={confirmLogout}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.beige,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.beige,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.dark,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: "500",
    color: Colors.dark,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    borderColor: "#d3d3d3",
    color: "#555",
  },
  editableInput: {
    backgroundColor: "white",
    borderColor: Colors.primary,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 25,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#4CAF50", // Verde
  },
  saveButton: {
    backgroundColor: "#2196F3", // Azul
  },
  cancelButton: {
    backgroundColor: "#f44336", // Rojo
  },
  logoutButton: {
    backgroundColor: "#FF9800", // Naranja
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});