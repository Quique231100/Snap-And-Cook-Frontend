import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
} from "react-native";
import React from "react";
import Colors from "../../../assets/colors/Colors";

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

const datos = {
  random: [
    {
      id: 1,
      nombre: "Hola",
    },
    {
      id: 2,
      nombre: "Hola",
    },
    {
      id: 3,
      nombre: "Hola",
    },
  ],
};

const Favorites = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      <ScrollView>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          arcu nisl, posuere at aliquet eu, mollis ut enim. Sed sed arcu in
          dolor fermentum convallis eget ut massa. Phasellus eget ultricies
          nunc. Suspendisse sed gravida eros. Etiam vitae neque tristique,
          fermentum odio eu, elementum enim. Vestibulum ante ipsum primis in
          faucibus orci luctus et ultrices posuere cubilia curae; Maecenas
          suscipit mauris eget posuere auctor. In vitae blandit mi. Quisque
          imperdiet fermentum quam, in tristique arcu. Curabitur et lectus
          turpis. Proin sem justo, tempus nec turpis ac, egestas consequat ex.
          Vivamus urna purus, hendrerit ac finibus nec, commodo et mauris.
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
          posuere cubilia curae; Integer et orci nunc. In quam lacus, dignissim
          ac eleifend non, aliquet quis orci. Integer non ornare ante, fermentum
          luctus augue. Nunc vel purus eget nibh lobortis hendrerit. Aliquam sit
          amet arcu eget ante cursus egestas. Morbi ac augue vel justo mollis
          imperdiet. Donec laoreet tellus eros, sit amet vestibulum nunc
          interdum vel. Pellentesque habitant morbi tristique senectus et netus
          et malesuada fames ac turpis egestas. Nunc arcu est, gravida vel velit
          eget, consequat varius dolor. Morbi vehicula massa nec ex vulputate
          rutrum. Morbi sit amet aliquam ligula, a convallis quam. Suspendisse
          pulvinar molestie posuere. Nullam in porttitor nisl. Morbi metus
          felis, pretium ornare magna ac, lobortis sagittis mauris. Donec ante
          felis, volutpat eu fermentum vel, sodales eu nunc. Donec tellus nunc,
          luctus dignissim nulla non, ultrices suscipit urna. Sed efficitur odio
          vel ornare posuere. Sed viverra cursus nulla eu pharetra. Maecenas
          facilisis metus nibh, fringilla vehicula risus cursus ac.
        </Text>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          arcu nisl, posuere at aliquet eu, mollis ut enim. Sed sed arcu in
          dolor fermentum convallis eget ut massa. Phasellus eget ultricies
          nunc. Suspendisse sed gravida eros. Etiam vitae neque tristique,
          fermentum odio eu, elementum enim. Vestibulum ante ipsum primis in
          faucibus orci luctus et ultrices posuere cubilia curae; Maecenas
          suscipit mauris eget posuere auctor. In vitae blandit mi. Quisque
          imperdiet fermentum quam, in tristique arcu. Curabitur et lectus
          turpis. Proin sem justo, tempus nec turpis ac, egestas consequat ex.
          Vivamus urna purus, hendrerit ac finibus nec, commodo et mauris.
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
          posuere cubilia curae; Integer et orci nunc. In quam lacus, dignissim
          ac eleifend non, aliquet quis orci. Integer non ornare ante, fermentum
          luctus augue. Nunc vel purus eget nibh lobortis hendrerit. Aliquam sit
          amet arcu eget ante cursus egestas. Morbi ac augue vel justo mollis
          imperdiet. Donec laoreet tellus eros, sit amet vestibulum nunc
          interdum vel. Pellentesque habitant morbi tristique senectus et netus
          et malesuada fames ac turpis egestas. Nunc arcu est, gravida vel velit
          eget, consequat varius dolor. Morbi vehicula massa nec ex vulputate
          rutrum. Morbi sit amet aliquam ligula, a convallis quam. Suspendisse
          pulvinar molestie posuere. Nullam in porttitor nisl. Morbi metus
          felis, pretium ornare magna ac, lobortis sagittis mauris. Donec ante
          felis, volutpat eu fermentum vel, sodales eu nunc. Donec tellus nunc,
          luctus dignissim nulla non, ultrices suscipit urna. Sed efficitur odio
          vel ornare posuere. Sed viverra cursus nulla eu pharetra. Maecenas
          facilisis metus nibh, fringilla vehicula risus cursus ac.
        </Text>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          arcu nisl, posuere at aliquet eu, mollis ut enim. Sed sed arcu in
          dolor fermentum convallis eget ut massa. Phasellus eget ultricies
          nunc. Suspendisse sed gravida eros. Etiam vitae neque tristique,
          fermentum odio eu, elementum enim. Vestibulum ante ipsum primis in
          faucibus orci luctus et ultrices posuere cubilia curae; Maecenas
          suscipit mauris eget posuere auctor. In vitae blandit mi. Quisque
          imperdiet fermentum quam, in tristique arcu. Curabitur et lectus
          turpis. Proin sem justo, tempus nec turpis ac, egestas consequat ex.
          Vivamus urna purus, hendrerit ac finibus nec, commodo et mauris.
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
          posuere cubilia curae; Integer et orci nunc. In quam lacus, dignissim
          ac eleifend non, aliquet quis orci. Integer non ornare ante, fermentum
          luctus augue. Nunc vel purus eget nibh lobortis hendrerit. Aliquam sit
          amet arcu eget ante cursus egestas. Morbi ac augue vel justo mollis
          imperdiet. Donec laoreet tellus eros, sit amet vestibulum nunc
          interdum vel. Pellentesque habitant morbi tristique senectus et netus
          et malesuada fames ac turpis egestas. Nunc arcu est, gravida vel velit
          eget, consequat varius dolor. Morbi vehicula massa nec ex vulputate
          rutrum. Morbi sit amet aliquam ligula, a convallis quam. Suspendisse
          pulvinar molestie posuere. Nullam in porttitor nisl. Morbi metus
          felis, pretium ornare magna ac, lobortis sagittis mauris. Donec ante
          felis, volutpat eu fermentum vel, sodales eu nunc. Donec tellus nunc,
          luctus dignissim nulla non, ultrices suscipit urna. Sed efficitur odio
          vel ornare posuere. Sed viverra cursus nulla eu pharetra. Maecenas
          facilisis metus nibh, fringilla vehicula risus cursus ac.
        </Text>
        <FlatList
          data={datos.random}
          keyExtractor={(item, id) => id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                height: screenHeight * 0.1,
                width: screenWidth * 0.4,
                backgroundColor: "red",
              }}
            >
              <Text>{item.id}</Text>
              <Text>{item.nombre}</Text>
            </View>
          )}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ margin: 10 }} />}
        />
      </ScrollView>
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.beige,
    // justifyContent: "center",
    // alignItems: "center",
    paddingTop: 60,
  },
  title: {
    fontSize: 36,
  },
});
