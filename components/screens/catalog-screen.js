import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { Authenticator } from "aws-amplify-react-native";
import Amplify, { Storage, Auth } from "aws-amplify";

export default class CatalogScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "default"
    };
  }
  render() {
    return (
      <View style={styles.containerContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>CATALOG</Text>
          <Icon
            iconStyle={styles.headerButton}
            name="search"
            color="#fff"
            onPress={() => this.signOut()}
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
