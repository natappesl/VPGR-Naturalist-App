import React, { Component } from 'react';
import Background from './background';
import { StyleSheet, Text, View, Alert} from "react-native";
import { BaseTheme, Colors, dimensions } from '../constants/theme';
import { SideButton } from './buttons';

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
      <View style = {[BaseTheme.container, BaseTheme.reverseColumn, {justifyContent: 'space-between'}]}>
        <Background showLogo onLongPress={() => {this.props.navigation.navigate('Login')}}/>
        <View style = {[LocalTheme.buttonContainer, BaseTheme.reverseColumn]}>
          <SideButton left text={'SEARCH'} onPress={() => {this.navigateTo('Search')}} onLongPress={() => {this.navigateTo('NewSpecies')}} /> 
          <SideButton right text={'CATEGORIES'} onPress={() => {this.navigateTo('Categories')}} onLongPress={() => {this.navigateTo('NewSpecies')}} />
          <SideButton left text={'NEWS & EVENTS'} onPress={() => {
            Alert.alert(
              'NEWS & EVENTS',
              'Coming soon! Stay tuned, mah boy!',
              [{text: 'You got it, dude.', onPress: ()=> {}}, {text: 'Hurry up already!', onPress: ()=> {}}])
          }} onLongPress={() => {this.navigateTo('NewSpecies')}} />
        </View>
      </View>
    );
  }
}

const LocalTheme = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    maxHeight: '50%',
    width: dimensions.w,
    backgroundColor: Colors.transparent,
  }
});

export default HomeScreen;