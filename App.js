import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./src/Screens/HomeScreen";
import DetailsScreen from "./src/Screens/DetailsScreen";
import Colors from "./src/Config/Colors";

const Stack = createStackNavigator();

//TEST APP FROM BELLOW LINK
// https://exp.host/@k_ashok222/MindBrowserAssignmentTest

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} extraData={"someData"} />}
        </Stack.Screen> */}
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
