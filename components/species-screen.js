import React, { Component } from "react";
import {
  Modal,
  Alert,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Button
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { BaseTheme, Colors, SpeciesTheme, EditModalTheme } from "../constants/theme";
import { ConservationStatus } from "../constants/trait-categories";
import { SideButton } from "./buttons";
import Background from "./background";
import DatabaseService from "../services/database";
import MediaService from "../services/media";
import { DetailFields } from "../constants/species-fields";

export default class SpeciesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      species: this.props.navigation.getParam("species"),
      showModal: false,
      edittingFieldName: '',
      edittingFieldValue: '',
    };

    if (!this.state.species) {
      console.warn(
        "Navigated to species page without passing a species object!"
      );
      this.props.navigation.pop();
    }

    // Bind in constructor so the bounded function is only created once
    this.renderKeys = this.renderKeys.bind(this);
    this.setField = this.setField.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.saveEditModal = this.saveEditModal.bind(this);

  }

  callEdit() {
    this.editField(this.fieldName);
  }

  setField (fieldName, value) {
    DatabaseService.updateSpecies(fieldName)
  }

  openEditModal (fieldName) {
    this.setState(prevState => ({
      showModal: true,
      edittingFieldName: fieldName,
      edittingFieldValue: this.state.species[fieldName]
    }));
  }

  async saveEditModal() {
    let success = await DatabaseService.updateSpecies(this.state.species.id, this.state.edittingFieldName, this.state.edittingFieldValue);
    this.closeEditModal();

    if (success) {
      let updatedSpecies = await DatabaseService.getSpecies(this.state.species.id);
      if (updatedSpecies) {
        this.setState({species: updatedSpecies});
      }
    }
  }

  async closeEditModal() {
    this.setState({
      showModal: false,
    });
  }

  renderKeys() {
    let keys = Object.keys(this.state.species);
    let renderedKeys = [];
    for (key of keys) {
      if (DetailFields.includes(key)) {
        renderedKeys.push(
          <TouchableWithoutFeedback style={SpeciesTheme.detailContainer}
            longPressDelay={1}
            onPress={this.callEdit} 
            key={this.state.species[key]}
            fieldName={key}
            editField={this.openEditModal}>
            <View style={SpeciesTheme.detailTextContainer}>
              <Text style={[SpeciesTheme.detailLabel]}>{key.toProperCase()}</Text>
              <View style={SpeciesTheme.detailContent}>
                <Text style={SpeciesTheme.detailContentText}>{this.state.species[key]}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      }
    }
    return renderedKeys;
  }

  render() {
    return (
      <View style={BaseTheme.container}>
        <Background />
        {this.state.showModal &&
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <KeyboardAwareScrollView style={EditModalTheme.container}>
          <View style={[EditModalTheme.header, BaseTheme.shadow]}>
            <Text style={EditModalTheme.headerText}>
            Editting "{this.state.edittingFieldName.toProperCase()}"
            </Text>
          </View>
            <View style= {[EditModalTheme.content, BaseTheme.shadow]}>
              <View style={EditModalTheme.fieldInputContainer}>
                <TextInput style={EditModalTheme.fieldInput}
                  autoFocus={true}
                  multiline={true}
                  numberOfLines={1}
                  value={this.state.edittingFieldValue}
                  onChangeText={text => this.setState({edittingFieldValue: text})}
                  returnKeyType={'done'}
                  returnKeyLabel={'done'}
                  blurOnSubmit={true}

                />
              </View>
              <View style={EditModalTheme.buttonContainer}>
                <TouchableOpacity
                  style={[EditModalTheme.button, EditModalTheme.saveButton]}
                  onPress={this.saveEditModal}>
                  <Text style={[EditModalTheme.buttonText, EditModalTheme.centerText]}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[EditModalTheme.button, EditModalTheme.cancelButton]}
                  onPress={this.closeEditModal}>
                  <Text style={[EditModalTheme.buttonText, EditModalTheme.centerText]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Modal>}
        <View style={BaseTheme.header}>
          <SideButton
            left
            text={this.state.species.alias}
            onPress={() => {
              this.props.navigation.pop();
            }}
          />
        </View>
        <View style={BaseTheme.content}>
          <ScrollView style={SpeciesTheme.scroll}>
            <View style={SpeciesTheme.info}>
              <View style={SpeciesTheme.mainImageContainer}>
                <Image
                  style={[SpeciesTheme.mainImage, BaseTheme.shadow]}
                  source={{ uri: MediaService.getImageURI(this.state.species.url) }}
                />
                <View style={SpeciesTheme.namesContainer}>
                  <View style={[SpeciesTheme.detailContainer]}>
                    <Text style={SpeciesTheme.detailLabel}>
                      Scientific Name
                    </Text>
                    <View style={SpeciesTheme.detailContent}>
                    <Text style={[SpeciesTheme.detailContentText, BaseTheme.italic]}>
                        {this.state.species.sciname}
                      </Text>
                    </View>
                  </View>
                  <View style={[SpeciesTheme.detailContainer]}>
                    <Text style={SpeciesTheme.detailLabel}>Aliases</Text>
                    <View style={SpeciesTheme.detailContent}>
                      <Text style={[SpeciesTheme.detailContentText]}>
                        {this.state.species.aliases}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {this.renderKeys()}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
