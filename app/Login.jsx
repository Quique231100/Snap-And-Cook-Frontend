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
import Colors from "../assets/colors/Colors.js";
import axios from "axios";
import { useUser } from "../context/UserContext"; // Importar el contexto
import { supabase } from "../lib/supabase.ts";

const Login = () => {
  const { setUser } = useUser(); // Obtener la función para actualizar el usuario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  //Funcion para inicio de sesion
  const handleLogin = async () => {
    // Validación de campos vacíos
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Debe llenar los campos para continuar");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    setLoading(false);
    if (error) {
      Alert.alert("Error al iniciar sesión", error);
      return;
    }
    console.log("Usuario logueado:", data.user.user_metadata);

    // Refrescar el token del usuario para obtener los datos actualizados
    const { data: sessionData, error: refreshError } =
      await supabase.auth.refreshSession();
    if (refreshError) {
      Alert.alert(
        "Error al refrescar el token del usuario",
        refreshError.message
      );
      return;
    }

    // Actualizar el contexto del usuario con los datos actualizados
    setUser(sessionData.user.user_metadata);
    router.push("/loged");
  };

  const getRandomMeals = async () => {
    try {
      const id = await fetchUserId(); // Obtener el ID INT8 del usuario
      if (!id) return;

      const { data: meals, error } = await supabase.rpc("getrandommeals", {
        limit_count: 5,
      });

      if (error) {
        console.error("Error al obtener platillos", error);
        return;
      }

      const favoritos = await fetchFavoritos(id); // Obtener los IDs de favoritos
      setFavoritosIds(favoritos); // Guardar los IDs de favoritos

      // Convertir los IDs de las recetas a números y asignar `isFavorito`
      const mealsWithFavorito = meals.map((meal) => ({
        ...meal,
        isFavorito: favoritos.includes(Number(meal.id)), // Convertir `meal.id` a número
      }));

      console.log("Recetas con favoritos asignados:", mealsWithFavorito); // Verificar las recetas
      setMealsRand(mealsWithFavorito);
    } catch (error) {
      console.error("Error al obtener recetas aleatorias:", error);
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

      <Pressable onPress={handleLogin}>
        <View style={styles.loginButton}>
          <Text style={styles.subtitle}>Entrar</Text>
        </View>
      </Pressable>

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
