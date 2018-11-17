import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { BaseTheme, NewSpeciesTheme, FieldInputTheme, EditModalTheme } from '../constants/theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class FieldInput extends Component {
  render() {
    return (
      <View style={[EditModalTheme.content, BaseTheme.row]}>
        <View style={FieldInputTheme.label}>
          <Text style= {[FieldInputTheme.labelText, BaseTheme.centerText, BaseTheme.bold]}>
          HELLO WORLD
          </Text>
        </View>
        <View style={EditModalTheme.fieldInputContainer}>
          <TextInput style={[FieldInputTheme.fieldInput, BaseTheme.centerText]}
            multiline={true}
            numberOfLines={1}
            returnKeyType={'done'}
            returnKeyLabel={'done'}
            blurOnSubmit={true} />
        </View>
      </View>
    );
  }
}

class NewSpeciesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  render() {
    return (
      <KeyboardAwareScrollView>
        <View style={EditModalTheme.header}>
          <Text style={[EditModalTheme.headerText]}>New Species</Text>
        </View>
      <FieldInput/>
      <FieldInput/>
      <FieldInput/>
      <FieldInput/>
      <FieldInput/>
      <FieldInput/>
      <FieldInput/>
      <FieldInput/>
      <FieldInput/>
      <FieldInput/>
      <FieldInput/>
      <FieldInput/>
      <FieldInput/>
      <FieldInput/>
      </KeyboardAwareScrollView>
    );
  }
}

export default NewSpeciesScreen;