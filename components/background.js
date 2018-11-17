import React, { Component } from 'react';
import {ImageBackground, Image, TouchableWithoutFeedback} from 'react-native';
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
          {this.props.showLogo && (
            <TouchableWithoutFeedback onLongPress={() => {this.props.onLongPress()}} delayLongPress={1000}>
              <Image style={BackgroundTheme.logo} source={require('../assets/vpgr_logo.png')} resizeMode='contain'/>
            </TouchableWithoutFeedback>
            )}
        </ImageBackground>
    );
  }
}