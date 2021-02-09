import React from "react";
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import Colors from "../Config/Colors";

export default function DetailsScreen({ route }) {
  const { item } = route.params;

  const setFavouriteItem = async () => {
    // setFavouriteItem = () => {
    console.log("Fav pressed");
    item.isFav = item.isFav ? false : true;
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageView}>
        <Image
          source={{ uri: item.images.original.url }}
          style={styles.gifImage}
        />
      </View>
      <View style={styles.detailsViewContainer}>
        <View style={styles.detailsViewText}>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.otherText}>
            {"Uploaded By: " + item.username}
          </Text>
          <Text style={styles.otherText}>{"Rating: " + item.rating}</Text>
          <Text style={styles.otherText}>{"Source: " + item.source}</Text>
        </View>

        <View style={styles.favIconStyle}>
          {item.isFav ? (
            <MaterialIcons
              onPress={() => {
                setFavouriteItem();
              }}
              name="favorite"
              size={32}
              color="red"
            />
          ) : (
            <MaterialIcons
              onPress={() => {
                setFavouriteItem();
              }}
              name="favorite-outline"
              size={32}
              color="black"
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "flex-start",
    // alignItems: "center",
    padding: 5,
    margin: 5,
  },
  imageView: {
    height: "44%",
    width: "100%",
  },
  detailsViewContainer: {
    padding: 5,
    width: "100%",
    backgroundColor: Colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 2,
  },
  detailsViewText: {
    width: "88%",
    height: "100%",
    backgroundColor: Colors.white,
    padding: 5,
  },
  gifImage: {
    height: "100%",
    width: "100%",
  },
  favIconStyle: {
    width: "12%",
    height: "100%",
    paddingTop: 18,
    backgroundColor: Colors.white,
    alignItems: "center",
  },
  titleText: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  otherText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
