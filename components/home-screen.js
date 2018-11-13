import React, { Component } from 'react';
import Background from './background';
import { StyleSheet, Text, View, Alert} from "react-native";
import { Icon } from 'react-native-elements';
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
      <View style = {BaseTheme.container}>
        <Background showLogo />
        <View style={[BaseTheme.header, BaseTheme.reverseRow]}>
        <SideButton right icon onPress={() => {this.props.navigation.navigate('Login')}}>
            <Icon style={{flex: 1}} name='pencil' type='font-awesome' color={Colors.bg}/>
          </SideButton>
        </View>
        <View style = {LocalTheme.buttonContainer}>
          <SideButton left text={'NEWS & EVENTS'} onPress={() => {
            Alert.alert(
              'NEWS & EVENTS',
              'Coming soon! Stay tuned, mah boy!',
              [{text: 'You got it, dude.', onPress: ()=> {}}, {text: 'Hurry up already!', onPress: ()=> {}}])
          }}/>
          <SideButton right text={'SEARCH'} onPress={() => {this.navigateTo('Search')}}/> 
          <SideButton left text={'CATEGORIES'} onPress={() => {this.navigateTo('Categories')}}/> 
        </View>
      </View>
    );
  }
}

const LocalTheme = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    width: dimensions.w,
    backgroundColor: Colors.TRANSPARENT,
    justifyContent: 'flex-end',
    paddingBottom: 60
  }
});

export default HomeScreen;