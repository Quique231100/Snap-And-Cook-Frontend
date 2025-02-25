import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { useState } from "react";
import Colors from "../../assets/colors/Colors";
import { Ionicons } from "@expo/vector-icons";

const Search = () => {
  const [busqueda, setBusqueda] = useState("");
  return (
    <View style={styles.container}>
      <Text>Search</Text>
      <View style={styles.inputCont}>
        <TextInput
          placeholder="Buscar"
          placeholderTextColor={Colors.grisOscuro}
          style={styles.txtInput}
          value={busqueda}
          onChangeText={setBusqueda}
          autoCapitalize="none"
        />
        <View style={styles.iconCont}>
          <Ionicons name="search" size={32} color={Colors.grisOscuro} />
        </View>
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.beige,
    justifyContent: "center",
    alignItems: "center",
  },
  txtInput: {
    width: "88%",
    color: Colors.grisOscuro,
    marginLeft: "2%",
    fontSize: 16,
  },
  inputCont: {
    flexDirection: "row",
    width: "90%",
    height: "6%",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.grisOscuro,
    //gap: 10,
  },
  iconCont: {
    justifyContent: "center",
  },
});
