import React, { Component } from 'react';
import Background from './background';
import { Image, Text, View, Alert, TouchableWithoutFeedback} from "react-native";
import { HomeTheme, BaseTheme, Colors, dimensions } from '../constants/theme';
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
        <Background/>
        <View style = {[HomeTheme.buttonContainer, BaseTheme.reverseColumn]}>
          <SideButton left text={'SEARCH'} onPress={() => {this.navigateTo('Search')}} onLongPress={() => {this.navigateTo('NewSpecies')}} /> 
          <SideButton right text={'CATEGORIES'} onPress={() => {this.navigateTo('Categories')}} onLongPress={() => {this.navigateTo('NewSpecies')}} />
          <SideButton left text={'NEWS & EVENTS'} onPress={() => {
            Alert.alert(
              'NEWS & EVENTS',
              'Coming soon! Stay tuned, mah boy!',
              [{text: 'You got it, dude.', onPress: ()=> {}}, {text: 'Hurry up already!', onPress: ()=> {}}])
          }} onLongPress={() => {this.navigateTo('NewSpecies')}} />
        </View>
        <View style={HomeTheme.logoContainerContainer}>
          <View style={[HomeTheme.logoContainer, BaseTheme.shadow]}>
            <TouchableWithoutFeedback onLongPress={() => {this.props.navigation.navigate('Login')}} delayLongPress={1000}>
              <Image style={HomeTheme.logo} source={require('../assets/vpgr_logo.jpg')} resizeMode='contain'/>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  }
}


export default HomeScreen;