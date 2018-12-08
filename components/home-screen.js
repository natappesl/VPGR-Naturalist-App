import React, { Component } from 'react';
import Background from './background';
import { Image, Text, View, Alert, TouchableWithoutFeedback} from "react-native";
import { Icon } from 'react-native-elements';
import { HomeTheme, BaseTheme, Colors, dimensions } from '../constants/theme';
import { SideButton } from './buttons';
import DatabaseService from '../services/database';

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
              <Image style={HomeTheme.logo} source={require('../assets/vpgr_logo_shadow_crop.png')} resizeMode='cover'/>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={{display: 'flex', flexDirection: 'row', flex: 1, width: '100%', justifyContent: 'flex-end',}}>
        <SideButton right icon onPress={() => {DatabaseService.syncDatabase()}}>
            <Icon style={{flex: 1,}} name='sync'  color={Colors.bg}/>
          </SideButton>
        </View>
      </View>
    );
  }
}


export default HomeScreen;