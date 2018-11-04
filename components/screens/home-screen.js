import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import SQLite from "react-native-sqlite-storage";
import Amplify, { Storage, Auth } from "aws-amplify";
import { Theme } from "../../constants/theme";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "default"
    };
  }

  signOut() {
    Auth.signOut()
      .then(() => console.log("Sign out successful. "))
      .catch(err => console.log("Sign out failed??", err));
  }

  render() {
    return (
      <View style={Theme.containerContainer}>
        <View style={Theme.headerContainer}>
          <Text style={Theme.headerTitle}>VERNAL POOLS NATURALIST</Text>
          <Icon
            iconStyle={Theme.headerButton}
            name="book"
            type="font-awesome"
            color="#fff"
            onPress={() => this.props.navigation.navigate("Catalog")}
          />
          <Icon
            iconStyle={Theme.headerButton}
            name="pencil"
            type="font-awesome"
            color="#fff"
            onPress={() => this.props.navigation.navigate("Login")}
          />
        </View>
        <View style={Theme.contentContainer} />
      </View>
    );
  }
}