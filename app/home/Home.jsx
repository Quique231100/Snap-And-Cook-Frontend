import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../../assets/colors/Colors";

const Home = () => {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.beige,
    justifyContent: "center",
    alignItems: "center",
  },
});
