import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert} from "react-native";
import { Icon } from 'react-native-elements';
import { Theme, THEME_COLORS } from '../constants/theme';
import { SideButton } from './buttons';
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
        <View style={[Theme.headerContainer, Theme.reverseRow]}>
        <SideButton right style={Theme.rightIconButton} onPress={() => {this.props.navigation.navigate('Login')}}>
            <Icon style={{flex: 1,}} name='pencil' type='font-awesome' color={THEME_COLORS.BG}/>
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
    width: '100%',
    backgroundColor: THEME_COLORS.TRANSPARENT,
    justifyContent: 'flex-end',
    paddingBottom: 60
  }
});

export default HomeScreen;