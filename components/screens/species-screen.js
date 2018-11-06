import React, { Component } from 'react';
import {View, Text} from 'react-native';
import { Theme } from '../../constants/theme';

export default class SpeciesScreen extends Component {
  constructor (props) {
    super(props);

  }

  render() {
    const {navigation} = this.props;
    const species = navigation.getParam('species', undefined);

    return (
      <View>
        <Text> HELLOW WORLD </Text>
      </View>
    );
  }
}
