import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  DetailFields,
  NondetailFields,
  ExcludedNewSpeciesNondetailFields,
  FieldInputPlaceholders
} from "../constants/species-fields";
import {
  ColorTraits,
  SizeTraits,
  SpeciesTypes,
  ConservationStatus
} from "../constants/trait-categories";
import { BaseTheme, NewSpeciesTheme } from "../constants/theme";

import Background from "./background";
import { FieldInput } from "./field-input";
import { ConfirmButtons } from "./buttons";

import DatabaseService from '../services/database';

DefaultFieldInputPlaceholders = {
  alias: 'Test species',
  overview: 'A short, general description of tests',
  sciname: 'Genius testspecicus',
  size: 'small',
  stype: 'Animals',
  behavior: 'Common associates with bugs of the pestering type',
  habitat: 'Only found while testing',
  conservationstatus: 'LC',
}

export default class NewSpeciesScreen extends Component {
  constructor(props) {
    super(props);
    this.renderFieldInputs = this.renderFieldInputs.bind(this);
    this.saveNewSpecies = this.saveNewSpecies.bind(this);
    this.cancelNewSpecies = this.cancelNewSpecies.bind(this);

    let state = {};
    state.fields = {};
    for (field of NondetailFields) {
      if (ExcludedNewSpeciesNondetailFields.includes(field) == false) {
        state.fields[field] = DefaultFieldInputPlaceholders[field] || "";
      }
    }
    for (field of DetailFields) {
      state.fields[field] = DefaultFieldInputPlaceholders[field] || "";
    }
    console.log(state.fields);
    this.state = state;
  }

  setFieldValue(fieldName, newFieldValue) {
    console.log(fieldName + ": " + newFieldValue);
    this.setState(prevState => {
      let newFields = prevState.fields;
      newFields[fieldName] = newFieldValue;
      return { feilds: newFields };
    });
  }

  async saveNewSpecies() {
    let id = await DatabaseService.insertSpecies(this.state.fields);
    if (id != -1) {
      this.props.navigation.pop();
    }
  }

  cancelNewSpecies() {
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
          onChangeText={(fieldName, newFieldValue) => {
            this.setFieldValue(fieldName, newFieldValue);
          }}
        />
      );
    }
    return renderedFields;
  }

  render() {
    return (
      <View>
        <Background />
        <KeyboardAwareScrollView>
          <View style={[NewSpeciesTheme.header, BaseTheme.shadow]}>
            <Text style={[NewSpeciesTheme.headerText]}>Add New Species</Text>
          </View>
          {this.renderFieldInputs()}
          <ConfirmButtons
            confirm={this.saveNewSpecies}
            cancel={this.cancelNewSpecies}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
