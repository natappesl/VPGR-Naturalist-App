import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Theme, THEME_COLORS } from "../constants/theme";
import {LeftButton} from './buttons';
import Background from "./background";
import DatabaseService from '../services/database';
import MediaService from '../services/media';

export default class SpeciesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false
    };
  }

  toggleDetails() {
    this.setState(state => ({ showDetails: !state.showDetails }));
  }

  render() {
    const { navigation } = this.props;
    const species = navigation.getParam("species");
    if (!species) {
      console.warn("Navigated to species page without passing a species object!");
    }

    return (
      <View style={Theme.containerContainer}>
        <Background/>
        <View style={Theme.headerContainer}>
          <LeftButton text={species.alias} onPress={() => {
            this.props.navigation.pop()
          }}/>
        </View>
        <View style={Theme.contentContainer}>
          <View style={LocalTheme.titleView}>
            <Image
              style={LocalTheme.mainImage}
              source={{ uri: MediaService.getImageURI(species.url)}}
            />
            <View style={LocalTheme.headerView}>
              <Text style={LocalTheme.headerTitle}>{species.alias}</Text>
            </View>
          </View>
          <View style={Theme.contentContainer}>
            {!this.state.showDetails && (
              <TouchableOpacity
                style={LocalTheme.showDetailsBar}
                onPress={() => {
                  this.toggleDetails();
                }}
              >
                <Text>SHOW DEETS</Text>
              </TouchableOpacity>
            )}
            {this.state.showDetails && (
              <View style={Theme.contentContainer}>
                <View style={LocalTheme.detailView}>
                  <Text style={LocalTheme.labelTitle}>Scientific Name:</Text>
                  <Text style={LocalTheme.labelText}>{species.sciname}</Text>
                </View>
                <View style={LocalTheme.detailView}>
                  <Text style={LocalTheme.labelTitle}>Overview:</Text>
                  <Text style={LocalTheme.labelText}>{species.overview}</Text>
                </View>
                <View style={LocalTheme.detailView}>
                  <Text style={LocalTheme.labelTitle}>Size:</Text>
                  <Text style={LocalTheme.labelText}>{species.size}</Text>
                </View>
                <View style={LocalTheme.detailView}>
                  <Text style={LocalTheme.labelTitle}>Animal Type:</Text>
                  <Text style={LocalTheme.labelText}>{species.stype}</Text>
                </View>
                <View style={LocalTheme.detailView}>
                  <Text style={LocalTheme.labelTitle}>
                    Conservation Status:
                  </Text>
                  <Text style={LocalTheme.labelText}>
                    {species.conservationstatus}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  _render() {
    const { navigation } = this.props;
    const species = navigation.getParam("species");
    if (!species) {
      console.warn("Navigated to species page without passing a species object!");
    }

    return (
      <View style={Theme.containerContainer}>
        <Background/>
        <View style={Theme.contentContainer}>
          <View style={Theme.primaryBackground, LocalTheme.titleView}>
            <Image
              style={LocalTheme.mainImage}
              source={{ uri: MediaService.getImageURI(species.url)}}
            />
            <View style={LocalTheme.headerView}>
              <Text style={LocalTheme.headerTitle}>{species.alias}</Text>
            </View>
          </View>
          <View style={Theme.contentContainer}>
            {!this.state.showDetails && (
              <TouchableOpacity
                style={LocalTheme.showDetailsBar}
                onPress={() => {
                  this.toggleDetails();
                }}
              >
                <Text>SHOW DEETS</Text>
              </TouchableOpacity>
            )}
            {this.state.showDetails && (
              <View style={Theme.contentContainer}>
                <View style={LocalTheme.detailView}>
                  <Text style={LocalTheme.labelTitle}>Scientific Name:</Text>
                  <Text style={LocalTheme.labelText}>{species.sciname}</Text>
                </View>
                <View style={LocalTheme.detailView}>
                  <Text style={LocalTheme.labelTitle}>Overview:</Text>
                  <Text style={LocalTheme.labelText}>{species.overview}</Text>
                </View>
                <View style={LocalTheme.detailView}>
                  <Text style={LocalTheme.labelTitle}>Size:</Text>
                  <Text style={LocalTheme.labelText}>{species.size}</Text>
                </View>
                <View style={LocalTheme.detailView}>
                  <Text style={LocalTheme.labelTitle}>Animal Type:</Text>
                  <Text style={LocalTheme.labelText}>{species.stype}</Text>
                </View>
                <View style={LocalTheme.detailView}>
                  <Text style={LocalTheme.labelTitle}>
                    Conservation Status:
                  </Text>
                  <Text style={LocalTheme.labelText}>
                    {species.conservationstatus}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const LocalTheme = StyleSheet.create({
  detailContainer: {
    flex: 10
  },
  showDetailsBar: {
    flex: 1
  },
  titleView: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: THEME_COLORS.PRIMARY,
  },
  mainImage: {
    flex: 1,
    padding: 5
  },
  headerView: {
    flex: 6,
    justifyContent: 'center',
    alignContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center",
    color: 'white',
  },
  headerSubtitle: {
    flex: 1,
    fontStyle: "italic",
    fontSize: 20
  },
  detailView: {
    flex: 3,
    flexDirection: "row"
  },
  labelTitle: {
    flex: 3,
    alignSelf: "flex-end",
    fontSize: 18
  },
  labelText: {
    flex: 5,
    fontStyle: "italic",
    fontSize: 16,
    textAlign: "left",
    alignSelf: "flex-end"
  }
});
