import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Theme, THEME_COLORS } from '../constants/theme';

class SideButton extends Component {
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
    return (
      <TouchableOpacity
        style={
          this.state.pressStatus ?
            this.props.pressStyle :
            this.props.buttonStyle
          }
        onPressIn={() => { this.onPressIn()}}
        onPressOut={() => { this.onPressOut()}}
        onPress={() => { this.props.onPress()}}
        delayPressIn={0}
        delayPressOut={0}>
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

export class LeftButton extends SideButton {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SideButton
        onPress={() => {this.props.onPress()}}
        buttonStyle={LocalTheme.leftButtonHighlight}
        pressStyle={LocalTheme.leftButtonPressed}>
        <Text style={
          this.state.pressStatus ?
          LocalTheme.leftButtonTextPressed :
          LocalTheme.leftButtonText
          }>
            {this.props.text}
        </Text>
      </SideButton>
    );
  }
}

export class RightButton extends SideButton {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SideButton
        onPress={() => {this.props.onPress()}}
        buttonStyle={LocalTheme.rightButtonHighlight}
        pressStyle={LocalTheme.rightButtonPressed}
        textPressStyle={LocalTheme.rightButtonTextPressed}>
        <Text style={
          this.state.pressStatus ?
          LocalTheme.rightButtonTextPressed :
          LocalTheme.rightButtonText
          }>
            {this.props.text}
        </Text>
      </SideButton>
    );
  }
}

const BUTTON_FONT_SIZE = 24;
const BUTTON_WIDTH = 320;
const BUTTON_HEIGHT = 60;
const BUTTON_FONT_WEIGHT = 'bold';
const BUTTON_FONT_STYLE = 'normal';
const BUTTON_MARGIN = 20;
const BUTTON_PADDING = 10;
const BUTTON_BORDER_RADIUS = 10;

const LocalTheme = StyleSheet.create({
  leftButtonHighlight: {
    flex: 1,
    maxHeight: BUTTON_HEIGHT,
    backgroundColor: THEME_COLORS.SECONDARY,
    width: BUTTON_WIDTH,
    alignSelf: 'flex-start',
    padding: BUTTON_PADDING,
    margin: BUTTON_MARGIN,
    marginLeft: 0,
    borderTopRightRadius: BUTTON_BORDER_RADIUS,
    borderBottomRightRadius: BUTTON_BORDER_RADIUS,
    shadowColor: 'rgba(0,0,0, 0.5)', // IOS
    shadowOffset: { height: 10, width: 10 }, // IOS
    shadowOpacity: 0.5, // IOS
    shadowRadius: 5, //IOS
    elevation: 5, // Android
    zIndex: 10,
  },
  leftButtonPressed: {
    flex: 1,
    maxHeight: BUTTON_HEIGHT - 10,
    backgroundColor: THEME_COLORS.SECONDARY,
    width: BUTTON_WIDTH - 10,
    alignSelf: 'flex-start',
    padding: BUTTON_PADDING,
    margin: BUTTON_MARGIN + 5,
    borderTopRightRadius: BUTTON_BORDER_RADIUS,
    borderBottomRightRadius: BUTTON_BORDER_RADIUS,
    marginLeft: 0,
    shadowColor: 'rgba(0,0,0, 0.5)', // IOS
    shadowOffset: { height: 10, width: 10 }, // IOS
    shadowOpacity: 0.5, // IOS
    shadowRadius: 5, //IOS
    elevation: 5, // Android
    zIndex: 10,
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
    color: THEME_COLORS.HEADING_TEXT,
    fontStyle: BUTTON_FONT_STYLE,
    fontWeight: BUTTON_FONT_WEIGHT,
  },
  rightButtonHighlight: {
    flex: 1,
    maxHeight: BUTTON_HEIGHT,
    backgroundColor: THEME_COLORS.SECONDARY,
    width: BUTTON_WIDTH,
    padding: BUTTON_PADDING,
    alignSelf: 'flex-end',
    margin: BUTTON_MARGIN,
    marginRight: 0,
    borderTopLeftRadius: BUTTON_BORDER_RADIUS,
    borderBottomLeftRadius: BUTTON_BORDER_RADIUS,
    shadowColor: 'rgba(0,0,0, 0.5)', // IOS
    shadowOffset: { height: 10, width: 10 }, // IOS
    shadowOpacity: 0.5, // IOS
    shadowRadius: 5, //IOS
    elevation: 5, // Android
    zIndex: 10,
  },
  rightButtonPressed: {
    flex: 1,
    maxHeight: BUTTON_HEIGHT - 10,
    backgroundColor: THEME_COLORS.SECONDARY,
    width: BUTTON_WIDTH - 10,
    padding: BUTTON_PADDING,
    alignSelf: 'flex-end',
    margin: BUTTON_MARGIN + 5,
    marginRight: 0,
    borderTopLeftRadius: BUTTON_BORDER_RADIUS,
    borderBottomLeftRadius: BUTTON_BORDER_RADIUS,
    shadowColor: 'rgba(0,0,0, 0.5)', // IOS
    shadowOffset: { height: 10, width: 10 }, // IOS
    shadowOpacity: 0.5, // IOS
    shadowRadius: 5, //IOS
    elevation: 5, // Android
    zIndex: 10,
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
    color: THEME_COLORS.HEADING_TEXT,
    fontStyle: BUTTON_FONT_STYLE,
    fontWeight: BUTTON_FONT_WEIGHT,
  },
});