import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { BaseTheme, NewSpeciesTheme, FieldInputTheme, EditModalTheme } from '../constants/theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {DetailFields, NondetailFields, ExcludedNewSpeciesNondetailFields, FieldInputPlaceholders } from '../constants/species-fields';
import {ColorTraits, SizeTraits, SpeciesTypes, ConservationStatus} from '../constants/trait-categories';
import {ConfirmButtons} from './buttons';
import Background from './background';

class FieldInput extends Component {
  render() {
    return (
      <View style={[FieldInputTheme.container, BaseTheme.row, BaseTheme.shadow]}>
        <View style={FieldInputTheme.label}>
          <Text style= {[FieldInputTheme.labelText, BaseTheme.centerText, BaseTheme.bold]}>
          {this.props.fieldName}
          </Text>
        </View>
        <View style={[FieldInputTheme.inputContainer]}>
          <TextInput style={[FieldInputTheme.input, BaseTheme.centerText]}
            multiline={true}
            numberOfLines={1}
            returnKeyType={'done'}
            returnKeyLabel={'done'}
            blurOnSubmit={true}
            selectTextOnFocus={true}
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
    this.saveNewSpecies = this.saveNewSpecies.bind(this);
    this.cancelNewSpecies = this.cancelNewSpecies.bind(this);

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

  saveNewSpecies() {
    console.log(this.state);
  }

  cancelNewSpecies () {
    console.log(this.state);
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
      <View>
        <Background/>
        <KeyboardAwareScrollView>
          <View style={[NewSpeciesTheme.header, BaseTheme.shadow]}>
            <Text style={[NewSpeciesTheme.headerText]}>Add New Species</Text>
          </View>
          {this.renderFieldInputs()}
          <ConfirmButtons confirm={this.saveNewSpecies} cancel={this.cancelNewSpecies} />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default NewSpeciesScreen;