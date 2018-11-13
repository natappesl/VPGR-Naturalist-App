import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { BaseTheme, Colors, SpeciesTheme } from "../constants/theme";
import {ConservationStatus} from '../constants/trait-categories';
import {SideButton} from './buttons';
import Background from "./background";
import DatabaseService from '../services/database';
import MediaService from '../services/media';

export default class SpeciesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false
    };
    this.species = this.props.navigation.getParam('species');
    if (!this.species) {
      console.warn("Navigated to species page without passing a species object!");
    }
  }

  toggleDetails() {
    this.setState(state => ({ showDetails: !state.showDetails }));
  }
  render() {
    return (
      <View style={BaseTheme.container}>
        <Background/>
        <View style={BaseTheme.header}>
          <SideButton left text={this.species.alias} onPress={() => {
            this.props.navigation.pop()
          }}/>
        </View>
        <View style={BaseTheme.content}>
          <ScrollView style={SpeciesTheme.scroll}>
          <View style={SpeciesTheme.info}>
            <View style={SpeciesTheme.mainImageContainer}>
              <Image
                style={[SpeciesTheme.mainImage, BaseTheme.shadow]}
                source={{ uri: MediaService.getImageURI(this.species.url)}}
              />
              <View style={SpeciesTheme.namesContainer}>
                <View style={[SpeciesTheme.detailContainer]}>
                <Text style={SpeciesTheme.detailLabel}>Scientific Name</Text>
                <Text style={[SpeciesTheme.detailContent, BaseTheme.italic]}>{this.species.sciname}</Text>
              </View>
              <View style={[SpeciesTheme.detailContainer,]}>
                <Text style={SpeciesTheme.detailLabel}>Aliases</Text>
                <Text style={SpeciesTheme.detailContent}>{this.species.aliases}</Text>
              </View>
              </View>
            </View>
            <View style={[SpeciesTheme.detailContainer]}>
              <Text style={[SpeciesTheme.detailLabel]}>Overview</Text>
              <Text style={SpeciesTheme.detailContent}>{this.species.overview}</Text>
            </View>
            <View style={[SpeciesTheme.detailContainer]}>
              <Text style={[SpeciesTheme.detailLabel]}>Size</Text>
              <Text style={SpeciesTheme.detailContent}>{this.species.size}</Text>
            </View>
            <View style={[SpeciesTheme.detailContainer]}>
              <Text style={[SpeciesTheme.detailLabel]}>Species Type</Text>
              <Text style={SpeciesTheme.detailContent}>{this.species.stype}</Text>
            </View>
            <View style={[SpeciesTheme.detailContainer]}>
              <Text style={[SpeciesTheme.detailLabel]}>Conservation Status</Text>
              <Text style={SpeciesTheme.detailContent}>{ConservationStatus[this.species.conservationstatus]}</Text>
            </View>
          </View>
        
        </ScrollView>
        </View>
      </View>
    );
  }
}
