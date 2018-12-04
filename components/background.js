import React, { Component } from "react";
import {
  ImageBackground,
  Image,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { BackgroundTheme, BaseTheme } from "../constants/theme";

export default class Background extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ImageBackground
        source={require("../assets/splish-splash.jpg")}
        style={BackgroundTheme.main}
        resizeMode="stretch"
      />
    );
  }
}
