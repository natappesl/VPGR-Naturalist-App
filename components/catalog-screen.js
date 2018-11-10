import React, { Component } from "react";

import {
  Text,
  View
} from "react-native";

import {
  Icon
} from "react-native-elements"; 

import { Search } from './search';
import { Catalog } from './catalog';

import { Theme, THEME_COLORS } from "../constants/theme";

import DatabaseService from "../services/database";

const minSearchTextLength = 2;

export default class CatalogScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSearch: false,
      list: [],
      listLoaded: false,
    };

    this.initCatalog();
  }

  async initCatalog() {
    let allSpecies = await DatabaseService.getAliasedSpecies();
    if (allSpecies) {
      this.setState({ list: allSpecies, listLoaded: true});
    }
  }

  toggleSearch() {
    this.setState(state => ({ showSearch: !state.showSearch }));
  }

  async searchUpdated(text) {
    if (text.length >= minSearchTextLength) {
      let updatedList = await DatabaseService.search(text);
      this.setState({ list: updatedList, listLoaded: true});
    }
  }
  
  onRowPressed (species) {
    this.props.navigation.navigate('Species', {species: species});
  }

  render() {
    return (
      <View style={Theme.containerContainer}>
        <View style={Theme.headerContainer}>
          <Text style={Theme.headerTitle}>CATALOG</Text>
          <Icon
            iconStyle={Theme.headerButton}
            name="search"
            color={THEME_COLORS.HEADING_TEXT}
            underlayColor={THEME_COLORS.TRANSPARENT_HALF}
            onPress={() => this.toggleSearch()}
            delayPressIn={0}
            delayPressOut={0}
          />
        </View>
        {this.state.showSearch && (
          <Search onTextInput={this.searchUpdated.bind(this)} />
        )}
        <Catalog list={this.state.list} listLoaded={this.state.listLoaded} onRowPress={(species) => this.onRowPressed(species)}/>
      </View>
    );
  }
}