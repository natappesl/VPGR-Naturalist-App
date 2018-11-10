import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import { Theme, THEME_COLORS } from '../constants/theme';

class SideButton extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      pressStatus: false,
    };
  }

  onHideUnderlay() {
    this.setState({ pressStatus: false });
  }
  onShowUnderlay() {
    this.setState({ pressStatus: true });
  }
  
  render() {
    return (
      <TouchableHighlight
        style={
          this.state.pressStatus ?
            this.props.pressStyle :
            this.props.buttonStyle
          }
        activeOpacity={1}
        onHideUnderlay={() => { this.onHideUnderlay()}}
        onShowUnderlay={() => { this.onShowUnderlay()}}
        onPress={() => { this.props.onPress()}}
        delayPressIn={0}
        delayPressOut={0}
        >
        <Text style={
          this.state.pressStatus ?
            this.props.textPressStyle :
            this.props.textStyle
          }>
            {this.props.text}
          </Text>
      </TouchableHighlight>
    );
  }
}

export class LeftButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SideButton
        text={this.props.text}
        onPress={() => {this.props.onPress()}}
        textStyle={LocalTheme.leftButtonText}
        buttonStyle={LocalTheme.leftButtonHighlight}
        pressStyle={LocalTheme.leftButtonPressed}
        textStyle={LocalTheme.leftButtonText}
        textPressStyle={LocalTheme.leftButtonTextPressed}
      />
    );
  }
}

export class RightButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SideButton
        text={this.props.text}
        onPress={() => {this.props.onPress()}}
        textStyle={LocalTheme.rightButtonText}
        buttonStyle={LocalTheme.rightButtonHighlight}
        pressStyle={LocalTheme.rightButtonPressed}
        textStyle={LocalTheme.rightButtonText}
        textPressStyle={LocalTheme.rightButtonTextPressed}
      />
    );
  }
}

const BUTTON_FONT_SIZE = 24;
const BUTTON_WIDTH = 320;
const BUTTON_HEIGHT = 60;
const BUTTON_FONT_WEIGHT = 'bold';
const BUTTON_FONT_STYLE = 'normal';
const BUTTON_MARGIN = 20;

const LocalTheme = StyleSheet.create({
  leftButtonHighlight: {
    flex: 1,
    maxHeight: BUTTON_HEIGHT,
    backgroundColor: THEME_COLORS.SECONDARY,
    width: BUTTON_WIDTH,
    alignSelf: 'flex-start',
    padding: 10,
    margin: BUTTON_MARGIN,
    marginLeft: 0,
  },
  leftButtonPressed: {
    flex: 1,
    maxHeight: BUTTON_HEIGHT - 10,
    backgroundColor: THEME_COLORS.SECONDARY,
    width: BUTTON_WIDTH - 10,
    alignSelf: 'flex-start',
    padding: 10,
    margin: BUTTON_MARGIN + 5,
    marginLeft: 0,
  },
  leftButtonText : {
    flex: 1,
    textAlign: 'right',
    textAlignVertical: 'center',
    fontSize: BUTTON_FONT_SIZE,
    color: THEME_COLORS.BG,
    fontStyle: BUTTON_FONT_STYLE,
    fontWeight: BUTTON_FONT_WEIGHT,
  },
  leftButtonTextPressed : {
    flex: 1,
    textAlign: 'right',
    textAlignVertical: 'center',
    fontSize: BUTTON_FONT_SIZE - 4,
    color: THEME_COLORS.BG,
    fontStyle: BUTTON_FONT_STYLE,
    fontWeight: BUTTON_FONT_WEIGHT,
  },
  rightButtonHighlight: {
    flex: 1,
    maxHeight: BUTTON_HEIGHT,
    backgroundColor: THEME_COLORS.SECONDARY,
    width: BUTTON_WIDTH,
    padding: 10,
    alignSelf: 'flex-end',
    margin: BUTTON_MARGIN,
    marginRight: 0,
  },
  rightButtonPressed: {
    flex: 1,
    maxHeight: BUTTON_HEIGHT - 10,
    backgroundColor: THEME_COLORS.SECONDARY,
    width: BUTTON_WIDTH - 10,
    padding: 10,
    alignSelf: 'flex-end',
    margin: BUTTON_MARGIN + 5,
    marginRight: 0,
  },
  rightButtonText : {
    flex: 1,
    textAlign: 'left',
    textAlignVertical: 'center',
    fontSize: BUTTON_FONT_SIZE,
    color: THEME_COLORS.BG,
    fontStyle: BUTTON_FONT_STYLE,
    fontWeight: BUTTON_FONT_WEIGHT,
  },
  rightButtonTextPressed : {
    flex: 1,
    textAlign: 'left',
    textAlignVertical: 'center',
    fontSize: BUTTON_FONT_SIZE - 4,
    color: THEME_COLORS.BG,
    fontStyle: BUTTON_FONT_STYLE,
    fontWeight: BUTTON_FONT_WEIGHT,
  },
});