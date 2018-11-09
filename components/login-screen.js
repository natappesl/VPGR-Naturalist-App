import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Authenticator } from "aws-amplify-react-native";

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "default"
    };
  }

  render() {
    return <Authenticator />;
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
