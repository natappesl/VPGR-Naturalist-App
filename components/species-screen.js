import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback
} from "react-native";
import { BaseTheme, Colors, SpeciesTheme } from "../constants/theme";
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
      showDetails: false
    };

    this.species = this.props.navigation.getParam("species");
    if (!this.species) {
      console.warn(
        "Navigated to species page without passing a species object!"
      );
      this.props.navigation.pop();
    }

    // Bind in constructor so the bounded function is only created once
    this.renderKeys = this.renderKeys.bind(this);
    this.editField = this.editField.bind(this);
  }

  toggleDetails() {
    this.setState(state => ({ showDetails: !state.showDetails }));
  }

  editField (event) { 
    //Alert.alert('Editting Field', event, [{text: 'OK', onPress: ()=> {}}])
    console.log(event);
  }

  renderKeys() {
    let keys = Object.keys(this.species);
    let renderedKeys = [];
    for (key of keys) {
      if (DetailFields.includes(key)) {
        renderedKeys.push(
          <TouchableWithoutFeedback style={[SpeciesTheme.detailContainer, {backgroundColor: 'red'}]} longPressDelay={1} onLongPress={(event) => {this.editField(event)}} key={key}>
            <View style={{flex: 1,}}>
              <Text style={[SpeciesTheme.detailLabel]}>{key.toProperCase()}</Text>
              <Text style={SpeciesTheme.detailContent}>{this.species[key]}</Text>
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
        <View style={BaseTheme.header}>
          <SideButton
            left
            text={this.species.alias}
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
                  source={{ uri: MediaService.getImageURI(this.species.url) }}
                />
                <View style={SpeciesTheme.namesContainer}>
                  <View style={[SpeciesTheme.detailContainer]}>
                    <Text style={SpeciesTheme.detailLabel}>
                      Scientific Name
                    </Text>
                    <Text
                      style={[SpeciesTheme.detailContent, BaseTheme.italic]}
                    >
                      {this.species.sciname}
                    </Text>
                  </View>
                  <View style={[SpeciesTheme.detailContainer]}>
                    <Text style={SpeciesTheme.detailLabel}>Aliases</Text>
                    <Text style={SpeciesTheme.detailContent}>
                      {this.species.aliases}
                    </Text>
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
