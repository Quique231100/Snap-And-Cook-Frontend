import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../../assets/colors/Colors";

const Analyze = () => {
  return (
    <View style={styles.container}>
      <Text>Analyze</Text>
    </View>
  );
};

export default Analyze;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.beige,
    justifyContent: "center",
    alignItems: "center",
  },
});
