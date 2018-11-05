import React, { Component } from "react";
import { ActivityIndicator, Text, View, ScrollView, TextInput } from "react-native";
import {
  Icon,
  FormValidationMessage,
  Card,
  ListItem,
  Button
} from "react-native-elements";
import { Authenticator } from "aws-amplify-react-native";
import Amplify, { Storage, Auth } from "aws-amplify";
import { Theme } from "../../constants/theme";
import DatabaseService from "../../services/database";

export class LoadingSpeciesIndicator extends Component {
  render() {
    return (
      <View style={Theme.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
}

export default class CatalogScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSearch: false,
      species: [],
      speciesLoaded: false,
      searchInput: "",
    };

    this.initCatalog();
  }

  async initCatalog() {
    let allSpecies = await DatabaseService.getAllDistinctSpecies();
    if (allSpecies) {
      this.setState({ species: allSpecies, speciesLoaded: true });
    }
  }

  toggleSearch() {
    this.setState({ showSearch: !this.state.showSearch });
  }

  render() {
    return (
      <View style={Theme.containerContainer}>
        <View style={Theme.headerContainer}>
          <Text style={Theme.headerTitle}>CATALOG</Text>
          <Icon
            iconStyle={Theme.headerButton}
            name="search"
            color="#fff"
            onPress={() => this.toggleSearch()}
          />
        </View>
        {!this.state.speciesLoaded && <LoadingSpeciesIndicator />}
        {this.state.speciesLoaded && 
          <View style={Theme.contentContainer}>
          {this.state.showSearch &&
            <View style={Theme.searchContainer}>
            <TextInput
              onChangeText={(text) => {
                  this.setState({searchInput: text});
                  console.log(this.state.searchInput);
                }
              }
            />
      </View>}
          <View style={Theme.listContainer}>
            {this.state.speciesLoaded && 
              <ScrollView>
                {this.state.species.map((s, i) => {
                  if (s.type = 'image') {
                    return (
                    <ListItem
                      key={i}
                      title={s.alias}
                      avatar={{ uri: s.url }}
                      onPress={() => console.log("NAVIGATE TO " + s.alias)}
                    />
                  );
                  }
                })}
              </ScrollView>
            }
          </View>
        </View>
        }
      </View>
    );
  }
}
