import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Theme, THEME_COLORS } from "../constants/theme";
import {CONS_STATUS} from '../constants/trait-categories';
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

  conservationStatus() {
    console.log(CONS_STATUS[this.species.conservationstatus]);
  }
  render() {
    return (
      <View style={Theme.containerContainer}>
        <Background/>
        <View style={Theme.headerContainer}>
          <SideButton left text={this.species.alias} onPress={() => {
            this.props.navigation.pop()
          }}/>
        </View>
        <View style={Theme.contentContainer}>
          <ScrollView style={LocalTheme.contentScroll}>
          <View style={LocalTheme.infoContainer}>
            <View style={LocalTheme.imageContainer}>
              <Image
                style={[LocalTheme.mainImage, Theme.shadow]}
                source={{ uri: MediaService.getImageURI(this.species.url)}}
              />
              <View style={LocalTheme.namesContainer}>
                <View style={[LocalTheme.detailContainer]}>
                <Text style={LocalTheme.detailLabel}>Scientific Name</Text>
                <Text style={[LocalTheme.detailContent, LocalTheme.italicText]}>{this.species.sciname}</Text>
              </View>
              <View style={[LocalTheme.detailContainer,]}>
                <Text style={LocalTheme.detailLabel}>Aliases</Text>
                <Text style={LocalTheme.detailContent}>{this.species.aliases}</Text>
              </View>
              </View>
            </View>
            <View style={[LocalTheme.detailContainer]}>
              <Text style={[LocalTheme.detailLabel]}>Overview</Text>
              <Text style={LocalTheme.detailContent}>{this.species.overview}</Text>
            </View>
            <View style={[LocalTheme.detailContainer]}>
              <Text style={[LocalTheme.detailLabel]}>Size</Text>
              <Text style={LocalTheme.detailContent}>{this.species.size}</Text>
            </View>
            <View style={[LocalTheme.detailContainer]}>
              <Text style={[LocalTheme.detailLabel]}>Species Type</Text>
              <Text style={LocalTheme.detailContent}>{this.species.stype}</Text>
            </View>
            <View style={[LocalTheme.detailContainer]}>
              <Text style={[LocalTheme.detailLabel]}>Conservation Status</Text>
              <Text style={LocalTheme.detailContent}>{CONS_STATUS[this.species.conservationstatus]}</Text>
            </View>
          </View>
        
        </ScrollView>
        </View>
      </View>
    );
  }
}

const LocalTheme = StyleSheet.create({
  infoContainer: {
    flex: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  contentScroll: {
    flex:1,
  },
  imageContainer: {
    flex: 10,
    padding: 5,
    flexDirection: "row",
    backgroundColor: THEME_COLORS.TRANSPARENT,
  },
  namesContainer: {
    flex: 4,
    padding: 10,
    flexDirection: 'column',
  },
  detailContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
  },
  mainImage: {
    flex: 3,
    height: 200,
    width: 200,
    padding: 5,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  detailLabel: {
    flex: 9,
    fontSize: 22,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    paddingBottom: 0,
    color: THEME_COLORS.SECONDARY,
  },
  detailContent: {
    flex: 12,
    textAlign: 'justify',
    textAlignVertical: 'center',
    color: THEME_COLORS.SECONDARY,
    paddingLeft: 10,
    borderRadius: 10,
    backgroundColor: THEME_COLORS.TRANSPARENT_HALF,
  },
  italicText: {
    fontStyle: 'italic',
  },
});
