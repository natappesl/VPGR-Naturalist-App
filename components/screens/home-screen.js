import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import SQLite from "react-native-sqlite-storage";
import Amplify, { Storage, Auth } from "aws-amplify";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "default"
    };
  }

  errorCallback(err) {
    console.log("DB Open fail. ", err);
  }

  signOut() {
    Auth.signOut()
      .then(() => console.log("Sign out successful. "))
      .catch(err => console.log("Sign out failed??", err));
  }

  submit() {
    SQLite.openDatabase(
      { name: "TPCH.db", location: "default" },
      () => {},
      this.errorCallback
    );
  }

  render() {
    return (
      <View style={styles.containerContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>VERNAL POOLS NATURALIST</Text>
          <Icon
            iconStyle={styles.headerButton}
            name="book"
            type="font-awesome"
            color="#fff"
            onPress={() => this.props.navigation.navigate("Catalog")}
          />
          <Icon
            iconStyle={styles.headerButton}
            name="pencil"
            type="font-awesome"
            color="#fff"
            onPress={() => this.props.navigation.navigate("Login")}
          />
        </View>
        <View style={styles.contentContainer} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerContainer: {
    height: "100%",
    width: "100%"
  },
  contentContainer: {
    flex: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "skyblue"
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "brown"
  },
  headerTitle: {
    flex: 5,
    textAlign: "center"
  },
  headerButton: {
    flex: 1,
    marginTop: 10,
    padding: 10
  }
});
