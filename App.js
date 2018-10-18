import React, { Component } from "react";
import {
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  StatusBar,
  Dimensions
} from "react-native";
import Amplify, { Storage, Auth } from "aws-amplify";
import aws_exports from "./aws-exports";
import { withAuthenticator } from "aws-amplify-react-native";
import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(false);

Amplify.configure(aws_exports);
const { width, height } = Dimensions.get("window");

type Props = {};
class App extends Component<Props> {
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
      .then(result => console.log("Sign out successful. ", result))
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
          <TouchableOpacity style={styles.headerButton}>
            <Text> Sign In </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerContainer: {
    height: '100%',
    width: '100%',
  },
  contentContainer: {
    flex: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "skyblue",
  },
  headerContainer: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'brown',
  },
  headerTitle: {
    flex:5,
  },
  headerButton: {
    flex: 1,
    alignSelf:'flex-end',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10
  },
});
export default withAuthenticator(App);
