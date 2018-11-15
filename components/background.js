import React, { Component } from 'react';
import {ImageBackground, Image} from 'react-native';
import {BackgroundTheme} from '../constants/theme';

export default class Background extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
        <ImageBackground
          source={require('../assets/splish-splash.jpg')}
          style={BackgroundTheme.main}
          resizeMode={'cover'}>
          {this.props.showLogo && (<Image style={BackgroundTheme.logo} source={require('../assets/logo_shadow.png')} resizeMode='contain'/>)}
        </ImageBackground>
    );
  }
}