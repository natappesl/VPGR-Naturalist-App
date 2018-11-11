import React, { Component } from 'react';
import {ImageBackground, Image } from 'react-native';
import {Theme} from '../constants/theme';

class Background extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ImageBackground
        source={require('../assets/splish-splash.jpg')}
        style={Theme.background}>
        {this.props.showLogo && (<Image style={Theme.backgroundLogo} source={require('../assets/logo_shadow.png')} resizeMode='contain'/>)}
      </ImageBackground>
    );
  }
}

export default Background;