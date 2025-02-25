import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../../assets/colors/Colors";

const Index = () => {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.beige,
    justifyContent: "center",
    alignItems: "center",
  },
});
