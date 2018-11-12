import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Theme, THEME_COLORS } from '../constants/theme';

export class SideButton extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      pressStatus: false,
    };
  }

  onPressIn() {
    this.setState({ pressStatus: true });
  }
  onPressOut() {
    this.setState({ pressStatus: false });
  }

  render() {
    let buttonStyle = [Theme.sideButton, Theme.shadow];
    if (this.state.pressStatus) {
      buttonStyle.push(Theme.buttonPressed);
    }
    if (this.props.left) {
      buttonStyle.push(Theme.leftButton);
    }
    if (this.props.right) {
      buttonStyle.push (Theme.rightButton);
    }
    if (this.props.style) {
      buttonStyle.push(this.props.style);
    }

    let textStyle = [Theme.buttonText];
    if (this.state.pressStatus) {
      textStyle.push(Theme.buttonTextPressed);
    }
    if (this.props.left) {
      textStyle.push(Theme.leftButtonText);
    }
    if (this.props.right) {
      textStyle.push (Theme.rightButtonText);
    }
    return (
      <TouchableOpacity
        style={buttonStyle}
        onPressIn={() => {this.onPressIn()}}
        onPressOut={() => { this.onPressOut()}}
        onPress={() => { this.props.onPress()}}
        delayPressIn={0}
        delayPressOut={0}>
        {this.props.text && (
          <Text style={textStyle}>{this.props.text}</Text>
        )}
        {!this.props.text && (
          this.props.children
        )}
      </TouchableOpacity>
    );
  }
}
