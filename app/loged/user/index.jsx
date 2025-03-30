import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import Colors from "../../../assets/colors/Colors";

const User = () => {
  return (
    <View style={styles.container}>
      <Text>User</Text>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.beige,
    justifyContent: "center",
    alignItems: "center",
  },
});
