import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { BaseTheme, NewSpeciesTheme, FieldInputTheme, EditModalTheme } from '../constants/theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {DetailFields, NondetailFields, ExcludedNewSpeciesNondetailFields, FieldInputPlaceholders } from '../constants/species-fields';
class FieldInput extends Component {
  render() {
    return (
      <View style={[EditModalTheme.content, BaseTheme.row]}>
        <View style={FieldInputTheme.label}>
          <Text style= {[FieldInputTheme.labelText, BaseTheme.centerText, BaseTheme.bold]}>
          {this.props.fieldName.toProperCase()}
          </Text>
        </View>
        <View style={EditModalTheme.fieldInputContainer}>
          <TextInput style={[FieldInputTheme.fieldInput, BaseTheme.centerText]}
            multiline={true}
            numberOfLines={1}
            returnKeyType={'done'}
            returnKeyLabel={'done'}
            blurOnSubmit={true}
            value={this.props.fieldValue}
            onChangeText={(text) => {this.props.onChangeText(this.props.fieldName, text)}}/>
        </View>
      </View>
    );
  }
}

class NewSpeciesScreen extends Component {
  constructor(props) {
    super(props);
    this.renderFieldInputs = this.renderFieldInputs.bind(this);

    let state = {};
    state.fields = {};
    for (field of NondetailFields) {
      if (ExcludedNewSpeciesNondetailFields.includes(field) == false) {
        state.fields[field] = FieldInputPlaceholders[field] || '';
      }
    }
    for (field of DetailFields) {
      state.fields[field] = FieldInputPlaceholders[field] || '';
    }
    console.log(state.fields);
    this.state = state;
  }
  setFieldValue (fieldName, newFieldValue) {
    console.log(fieldName + ': ' + newFieldValue);
    this.setState((prevState) =>{
      let newFields = prevState.fields;
      newFields[fieldName] = newFieldValue;
      return {feilds: newFields};
    });
  }

  renderFieldInputs() {
    let fields = Object.keys(this.state.fields);
    let renderedFields = [];

    for (field of fields) {
      renderedFields.push(
        <FieldInput
        key={field}
        fieldName={field}
        fieldValue={this.state.fields[field]}
        onChangeText={(fieldName, newFieldValue) =>
          {this.setFieldValue(fieldName, newFieldValue)}}/>
      )
    }
    return renderedFields;
  }

  render() {
    return (
      <KeyboardAwareScrollView>
        <View style={EditModalTheme.header}>
          <Text style={[EditModalTheme.headerText]}>New Species</Text>
        </View>
        {this.renderFieldInputs()}
      {/* <FieldInput
        fieldName={'overview'}
        fieldValue={this.state['overview']}
        onChangeText={(fieldName, newFieldValue) => {this.setFieldValue(fieldName, newFieldValue)}}/> */}
      </KeyboardAwareScrollView>
    );
  }
}

export default NewSpeciesScreen;