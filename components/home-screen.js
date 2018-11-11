import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert} from "react-native";
import { Theme, THEME_COLORS } from '../constants/theme';
import { LeftButton, RightButton } from './buttons';
import Background from './background';

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
        <Background showLogo={true} />
        <View style = {LocalTheme.buttonContainer}>
          <LeftButton text={'NEWS & EVENTS'} onPress={() => {
            Alert.alert(
              'NEWS & EVENTS',
              'Coming soon! Stay tuned, mah boy!',
              [{text: 'You got it, dude.', onPress: ()=> {}}, {text: 'Hurry up already!', onPress: ()=> {}}])
          }}/>
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