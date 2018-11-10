import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Authenticator } from "aws-amplify-react-native";

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Authenticator />;
  }
}
