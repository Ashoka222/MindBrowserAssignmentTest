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
      favListArray: [],
      isFavSelected: false,
      offset: 0,
      initialLoading: false,
      loading: true,
      searchValue: "",
      isSearching: false,
    };
  }

  componentDidMount() {
    this.setState({ listArray: [], allListArray: [], isFavSelected: false });
    this.setState({ initialLoading: true });
    this.getDataAPI();
  }

  //API Call
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
          //   let obj = { id: element.id, name: element.title, image: element.images.original.url, isFav: false };
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

  //Handling on list item and navigate to details screen
  handleListOnPress = (item) => {
    this.props.navigation.navigate("Details", { item: item });
  };

  //Handling Favourite item
  setFavouriteItem = (item, index) => {
    if (!item.isFav) {
      let favCount = 0;
      this.state.listArray.forEach((element) => {
        if (element.isFav) {
          favCount += 1;
        }
      });
      if (favCount == 5) {
        Alert.alert("", "You can select Maximum 5 items as favourite.");
        return;
      }
    }

    let newObj = item;
    let isFav = item.isFav ? false : true;
    console.log(isFav);
    newObj.isFav = isFav;
    this.state.listArray[index] = newObj;
    let newArray = this.state.listArray;
    if (this.state.isFavSelected) {
      this.setState({ listArray: newArray });
      this.handleSegmentPress("favourite");
    } else {
      this.setState({ listArray: newArray });
    }
  };

  //Handling Normal List & Favourite List
  handleSegmentPress = (item) => {
    this.setState({ searchValue: "" });
    console.log(item + " clicked");
    if (item == "list") {
      this.setState({
        listArray: this.state.allListArray,
        isFavSelected: false,
      });
    }
    if (item == "favourite") {
      let newArray = [];
      for (let index = 0; index < this.state.allListArray.length; index++) {
        const element = this.state.allListArray[index];
        if (element.isFav) {
          newArray.push(element);
        }
      }
      this.setState({
        listArray: newArray,
        isFavSelected: true,
        loading: false,
      });
    }
  };

  //Handling Load More
  loadMoreItems = () => {
    if (this.state.isFavSelected || this.state.isSearching) {
      return;
    }
    console.log("Load More...");
    this.setState({ offset: (this.state.offset += 10) });
    this.getDataAPI();
  };

  //Handling Loader on load more
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

  //Handling searched text value
  onChangeValue = async (value) => {
    this.setState({ searchValue: value });

    const filteredItems = this.state.listArray.filter((e) =>
      e.title.toLowerCase().includes(value.toLowerCase())
    );
    if (value !== "") {
      this.setState({ listArray: filteredItems, isSearching: true });
    } else {
      if (this.state.isFavSelected) {
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

  //Render
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
                { fontSize: this.state.isFavSelected ? 15 : 18 },
              ]}
            >
              List
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.favListStyle, styles.centerAll]}
            onPress={() => this.handleSegmentPress("favourite")}
          >
            <Text
              style={[
                styles.segmentTitle,
                { fontSize: this.state.isFavSelected ? 18 : 15 },
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
          <View style={styles.initLoaderView}>
            <ActivityIndicator
              size={"large"}
              color="black"
              style={{ marginLeft: 8 }}
            />
            <Text style={{ marginTop: 10 }}>Loading data...</Text>
          </View>
        ) : this.state.listArray.length > 0 ? (
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
        ) : (
          <View style={styles.initLoaderView}>
            <Text style={styles.noDataStyle}>No Data</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

//Handling List Item design function
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
      <View style={styles.imageViewStyle}>
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
        </View>

        <View style={styles.favIconStyle}>
          {item.isFav ? (
            <MaterialIcons
              onPress={() => setFavouriteItem(item, index)}
              name="favorite"
              size={32}
              color="red"
            />
          ) : (
            <MaterialIcons
              onPress={() => setFavouriteItem(item, index)}
              name="favorite-outline"
              size={32}
              color="black"
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

//StyleSheet
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
    // padding: 10,
    width: "95%",
  },
  favIconStyle: {
    width: "12%",
    height: "100%",
    paddingTop: 18,
    backgroundColor: Colors.white,
    alignItems: "center",
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
  imageViewStyle: {
    height: 180,
    width: "100%",
  },
  gifImage: {
    height: "100%",
    width: "100%",
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
  favListStyle: {
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
  noDataStyle: {
    marginTop: -120,
    fontStyle: "italic",
    fontWeight: "bold",
    fontSize: 18,
  },
});
