import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ButtonTheme, BaseTheme } from '../constants/theme';

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
    //TODO: HOW TO REDUCE THESE UGLY IFs ???
    let buttonStyle = [ButtonTheme.side, BaseTheme.shadow];
    if (this.state.pressStatus) {
      buttonStyle.push(ButtonTheme.pressed);
    }
    if (this.props.left) {
      buttonStyle.push(ButtonTheme.left);
    }
    if (this.props.right) {
      buttonStyle.push (ButtonTheme.right);
    }
    if (this.props.icon) {
      buttonStyle.push(ButtonTheme.icon);
    }
    if (this.props.style) {
      buttonStyle.push(this.props.style);
    }

    let textStyle = [ButtonTheme.text];
    if (this.state.pressStatus) {
      textStyle.push(ButtonTheme.textPressed);
    }
    if (this.props.left) {
      textStyle.push(ButtonTheme.leftText);
    }
    if (this.props.right) {
      textStyle.push (ButtonTheme.rightText);
    }
    return (
      <TouchableOpacity
        style={buttonStyle}
        onPressIn={() => {this.onPressIn()}}
        onPressOut={() => { this.onPressOut()}}
        onPress={() => { this.props.onPress()}}
        onLongPress={() => {this.props.onLongPress()}}
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

export class ConfirmButtons extends Component {
  render() {
    return (
      <View style={ButtonTheme.buttonContainer}>
        <TouchableOpacity
          style={[ButtonTheme.button, ButtonTheme.saveButton, BaseTheme.shadow]}
          onPress={this.props.confirm}>
          <Text style={[ButtonTheme.normalText, BaseTheme.centerText]}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[ButtonTheme.button, ButtonTheme.cancelButton, BaseTheme.shadow]}
          onPress={this.props.cancel}>
          <Text style={[ButtonTheme.normalText, BaseTheme.centerText]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
