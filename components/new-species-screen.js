import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  DetailFields,
  NondetailFields,
  NewSpeciesFields,
  DefaultFieldInputPlaceholders,
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
import { FieldInput, EntryInput } from "./field-input";
import { ConfirmButtons } from "./buttons";

import DatabaseService from '../services/database';


export default class NewSpeciesScreen extends Component {
  constructor(props) {
    super(props);
    this.renderFieldInputs = this.renderFieldInputs.bind(this);
    this.saveNewSpecies = this.saveNewSpecies.bind(this);
    this.cancelNewSpecies = this.cancelNewSpecies.bind(this);

    let state = {};
    state.fields = {};
    for (field of NewSpeciesFields) {
      state.fields[field] = DefaultFieldInputPlaceholders[field] || "";
    }

    state.tags = [
      'default',
    ];
    state.images = [
      'placeholder.png',
    ];
    this.state = state;
  }

  updateField(fieldName, newFieldValue) {
    console.log(fieldName + ": " + newFieldValue);
    this.setState(prevState => {
      let newFields = prevState.fields;
      newFields[fieldName] = newFieldValue;
      return { fields: newFields };
    });
  }

  async addEntry(entryType) {
    this.setState(prevState => {
      let newState = prevState;
      newState[entryType].push('');
      return {state: newState};
    });
  }

  async updateEntry(entryType, index, text) {
    this.setState( prevState => {
      let newState = prevState;
      newState[entryType][index] = text;
      return {state: newState};
    })
  }

  async deleteEntry (entryType) {
    this.setState(prevState => {
      let newState = prevState;
      newState[entryType].pop();
      return {state: newState};
    });
  }

  async saveNewSpecies() {
    let tags = this.parseEntries(this.state.tags);
    let images = this.parseEntries(this.state.images);
    console.log('Calling');
    let id = await DatabaseService.insertSpecies(this.state.fields, tags, images);
    if (id != -1) {
      this.props.navigation.pop();
    }
  }

  parseEntries(entries) {
    let parsedEntries = [];
    for (i = 0; i < entries.length; i++) {
      if (entries[i] != '') {
        let entry = entries[i].trim();
        // Check twice in case someone added
        // any number of spaces and nothing else
        // lol
        if (entry != '') {
          parsedEntries.push(entry);
        }
      }
    }
    return parsedEntries;
  }

  cancelNewSpecies() {
    console.log(this.state);
    this.props.navigation.pop();
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
            this.updateField(fieldName, newFieldValue);
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
          <EntryInput
            entries={this.state.tags}
            entryName={'Traits'}
            onAdd={() => { this.addEntry('tags') }}
            onUpdate={(entryId, entry) => { this.updateEntry('tags', entryId, entry) }}
            onDelete={() => { this.deleteEntry('tags') }}/>
          <EntryInput
            entries={this.state.images}
            entryName={'Images'}
            onAdd={() => { this.addEntry('images') }}
            onUpdate={(entryId, entry) => { this.updateEntry('images', entryId, entry) }}
            onDelete={() => { this.deleteEntry('images') }}/>
          <ConfirmButtons
            confirm={this.saveNewSpecies}
            cancel={this.cancelNewSpecies}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
