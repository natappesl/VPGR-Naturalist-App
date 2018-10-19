import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon, FormValidationMessage } from "react-native-elements";
import { Authenticator } from "aws-amplify-react-native";
import Amplify, { Storage, Auth } from "aws-amplify";

class Search extends Component {
  render () {
    return (
      <View style={styles.searchContainer}><Text>SEARCH</Text></View>
    );
  }
}

export default class CatalogScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "default",
      showSearch: false,
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
            onPress={() => this.toggleSearch()}
          />
        </View>
        <View style={styles.contentContainer}>
          {!this.state.showSearch && <Search/>}
        </View>
      </View>
    );
  }

  toggleSearch() {
    this.setState( () => {showSearch: !this.state.showSearch});
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
  searchContainer: {
    flex: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "green"
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
