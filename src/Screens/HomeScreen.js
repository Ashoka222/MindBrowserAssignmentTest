import React from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import Colors from "../Config/Colors";
import ApiKey from "../Config/ApiKey";

const { height, width } = Dimensions.get("screen");

// export default function HomeScreen({ navigation }) {
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listArray: [],
      fevListArray: [],
      isFevSelected: false,
      offset: 0,
      initialLoading: false,
      loading: true,
      searchValue: "",
      isSearching: false,
    };
  }

  componentDidMount() {
    this.setState({ listArray: [], allListArray: [], isFevSelected: false });
    this.setState({ initialLoading: true });
    this.getDataAPI();
  }

  getDataAPI() {
    this.setState({ loading: true });
    fetch(
      "https://api.giphy.com/v1/gifs/trending?api_key=" +
        ApiKey.API_KEY +
        "&limit=10&offset=" +
        this.state.offset +
        "&q="
    )
      .then((response) => response.json())
      .then((jsonResponse) => {
        console.log(jsonResponse);
        let data = this.state.allListArray;
        jsonResponse.data.forEach((element) => {
          //   let obj = { id: element.id, name: element.title, image: element.images.original.url, isFev: false };
          data.push(element);
        });
        this.setState({
          listArray: data,
          allListArray: data,
          initialLoading: false,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleListOnPress = (item) => {
    this.props.navigation.navigate("Details", { item: item });
  };

  setFavouriteItem = (item, index) => {
    if (!item.isFev) {
      let favCount = 0;
      this.state.listArray.forEach((element) => {
        if (element.isFev) {
          favCount += 1;
        }
      });
      if (favCount == 5) {
        Alert.alert("", "Maximum 5 items should be favourite.");
        return;
      }
    }

    let newObj = item;
    let isFev = item.isFev ? false : true;
    console.log(isFev);
    newObj.isFev = isFev;
    this.state.listArray[index] = newObj;
    let newArray = this.state.listArray;
    if (this.state.isFevSelected) {
      this.setState({ listArray: newArray });
      this.handleSegmentPress("favourite");
    } else {
      this.setState({ listArray: newArray });
    }
  };

  handleSegmentPress = (item) => {
    this.setState({ searchValue: "" });
    if (item == "list") {
      console.log("list clicked");
      this.setState({
        listArray: this.state.allListArray,
        isFevSelected: false,
      });
    }
    if (item == "favourite") {
      console.log("favourite clicked");
      let newArray = [];
      for (let index = 0; index < this.state.allListArray.length; index++) {
        const element = this.state.allListArray[index];
        if (element.isFev) {
          newArray.push(element);
        }
      }
      this.setState({
        listArray: newArray,
        isFevSelected: true,
        loading: false,
      });
    }
  };

  loadMoreItems = () => {
    if (this.state.isFevSelected || this.state.isSearching) {
      return;
    }
    console.log("Load More...");
    this.setState({ offset: (this.state.offset += 10) });
    this.getDataAPI();
  };

  listFooter = () => {
    return this.state.isSearching ? (
      <></>
    ) : (
      <View style={styles.footerList}>
        {this.state.loading ? (
          <ActivityIndicator
            size={"large"}
            color="black"
            style={{ marginLeft: 8 }}
          />
        ) : null}
      </View>
    );
  };

  onChangeValue = async (value) => {
    this.setState({ searchValue: value });

    const filteredItems = this.state.listArray.filter((e) =>
      e.title.toLowerCase().includes(value.toLowerCase())
    );
    if (value !== "") {
      this.setState({ listArray: filteredItems, isSearching: true });
    } else {
      if (this.state.isFevSelected) {
        this.setState({ isSearching: false });
        this.handleSegmentPress("favourite");
      } else {
        this.setState({
          listArray: this.state.allListArray,
          isSearching: false,
        });
      }
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.segmentStyle}>
          <TouchableOpacity
            style={[styles.listStyle, styles.centerAll]}
            onPress={() => this.handleSegmentPress("list")}
          >
            <Text
              style={[
                styles.segmentTitle,
                { fontSize: this.state.isFevSelected ? 15 : 18 },
              ]}
            >
              List
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.fevListStyle, styles.centerAll]}
            onPress={() => this.handleSegmentPress("favourite")}
          >
            <Text
              style={[
                styles.segmentTitle,
                { fontSize: this.state.isFevSelected ? 18 : 15 },
              ]}
            >
              Favourite
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{ width: width, alignItems: "center", marginVertical: -10 }}
        >
          <TextInput
            style={styles.inputStyle}
            placeholder={"Search"}
            value={this.state.searchValue}
            onChangeText={(value) => {
              this.onChangeValue(value);
            }}
            autoCorrect={false}
            keyboardType={"visible-password"}
          />
        </View>
        {this.state.initialLoading ? (
          <View>
            <ActivityIndicator
              size={"large"}
              color="black"
              style={{ marginLeft: 8 }}
            />
            <Text style={{ marginTop: 10 }}>Loading data...</Text>
          </View>
        ) : (
          <FlatList
            data={this.state.listArray}
            renderItem={({ item, index }) => (
              <ListItemFunction
                item={item}
                handleListOnPress={this.handleListOnPress}
                setFavouriteItem={this.setFavouriteItem}
                state={this.state}
                index={index}
              />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.01}
            onEndReached={this.loadMoreItems}
            ListFooterComponent={this.listFooter()}
          />
        )}
      </SafeAreaView>
    );
  }
}

function ListItemFunction({
  item,
  handleListOnPress,
  setFavouriteItem,
  state,
  index,
}) {
  return (
    <TouchableOpacity
      style={styles.listBackground}
      onPress={() => handleListOnPress(item)}
    >
      <View style={styles.contentView}>
        <View style={styles.firstSection}>
          <Image
            style={{ width: 60, height: 60 }}
            source={{
              uri: item.images.original.url,
            }}
          />

          <Text style={styles.titleStyle} numberOfLines={5}>
            {item.title}
          </Text>
        </View>

        <View
          style={{
            justifyContent: "flex-end",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={styles.sourceText} numberOfLines={5}>
            {item.source}
          </Text>
          {item.isFev ? (
            <TouchableOpacity
              style={[
                styles.listBackground,
                {
                  fontSize: state.isFevSelected ? 18 : 15,
                },
              ]}
              onPress={() => setFavouriteItem(item, index)}
            >
              <MaterialIcons name="favorite" size={32} color="red" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.listBackground,
                {
                  fontSize: state.isFevSelected ? 18 : 15,
                },
              ]}
              onPress={() => setFavouriteItem(item, index)}
            >
              <MaterialIcons name="favorite-outline" size={32} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // top: 15,
  },
  listBackground: {
    marginVertical: 5,
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#D3D3D3",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 3,
    padding: 10,
  },
  segmentStyle: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    justifyContent: "space-evenly",
  },
  listStyle: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  fevListStyle: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  centerAll: {
    justifyContent: "center",
    alignItems: "center",
  },
  segmentTitle: {
    fontWeight: "bold",
  },
  contentView: {
    flex: 1,
    justifyContent: "space-around",
  },
  firstSection: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  titleStyle: {
    fontSize: 15,
    fontWeight: "normal",
    margin: 5,
  },
  sourceText: {
    fontSize: 16,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  initLoaderView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  inputStyle: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "#fafafa",
    padding: 12,
    borderWidth: 0.5,
    borderColor: "#000",
    fontSize: 15,
    color: "#000",
    width: "90%",
    borderRadius: 5,
  },
});
