import React, { Component } from "react";
import {
  Image,
  ActivityIndicator,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity
} from "react-native";
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

const minSearchTextLength = 5;

export class SearchBar extends Component {
  render() {
    return (
      <View style={Theme.searchContainer}>
        <TextInput
          onChangeText={text => {
            this.props.onTextInput(text);
          }}
        />
      </View>
    );
  }
}

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
      speciesList: [],
      speciesLoaded: false,
      searchInput: ""
    };
  }

  componentDidMount () {
    this.initCatalog();
  }

  async initCatalog() {
    if (!DatabaseService.dbLoaded()) {
      setTimeout(() => {this.initCatalog()}, 1000);
    }
    else {
      let allSpecies = await DatabaseService.getAllDistinctSpecies();
      if (allSpecies) {
        console.log(allSpecies);
        this.setState({ speciesList: allSpecies, speciesLoaded: true });
      }
    }
  }

  toggleSearch() {
    this.setState(state => ({ showSearch: !state.showSearch }));
  }

  async searchUpdated(text) {
    if (text.length >= minSearchTextLength) {
      let updatedList = await DatabaseService.search(text);
      this.setState({ speciesList: updatedList });
    }
  }

  navigateTo(species) {
    console.log(species);
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
        {this.state.speciesLoaded && (
          <View style={Theme.contentContainer}>
            {this.state.showSearch && (
              <SearchBar onTextInput={this.searchUpdated.bind(this)} />
            )}
            <View style={Theme.listContainer}>
              {this.state.speciesLoaded &&
                this.state.speciesList && (
                  <FlatList
                    data={this.state.speciesList}
                    keyExtractor={item => item.id.toString()}
                    renderItem={(species, index) => (
                      <TouchableOpacity
                        style={Theme.listContent}
                        onPress={this.navigateTo.bind(this, species)}
                      >
                        <Image
                          style={Theme.listContentImage}
                          source={{
                            uri:
                              "https://facebook.github.io/react-native/docs/assets/favicon.png"
                          }}
                        />
                        <View style={Theme.listContentView}>
                          <Text style={Theme.listContentTitle}>{species.item.alias}</Text>
                          <Text style={Theme.listContentSubtitle}>{species.item.sciname}</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                )}
            </View>
          </View>
        )}
      </View>
    );
  }
}
