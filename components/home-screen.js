import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground} from "react-native";
import { Theme, THEME_COLORS } from '../constants/theme';
import { LeftButton, RightButton } from './buttons';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  navigateTo(screen) {
    this.props.navigation.navigate(screen);
  }

  render() {
    return (
      <View style = {Theme.containerContainer}>
        <ImageBackground
          source={require('../assets/splish-splash.jpg')}
          style={Theme.background}>
          <Image style={Theme.backgroundLogo} source={require('../assets/logo.png')} resizeMode='contain'/>
          </ImageBackground>
        <View style = {LocalTheme.buttonContainer}>
          <LeftButton text={'ABOUT'} onPress={() => {this.navigateTo('Home')}}/>
          <RightButton text={'SEARCH'} onPress={() => {this.navigateTo('Search')}}/> 
          <LeftButton text={'CATEGORIES'} onPress={() => {this.navigateTo('Categories')}}/> 
        </View>
      </View>
    );
  }
}

const LocalTheme = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: THEME_COLORS.TRANSPARENT,
    justifyContent: 'flex-end',
    paddingBottom: 60
  },
});

export default HomeScreen;