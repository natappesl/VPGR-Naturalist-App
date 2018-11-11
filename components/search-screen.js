import React, { Component } from "react";
import { Text, View } from "react-native";
import { Icon } from "react-native-elements"; 
import { Search } from './search';
import { Catalog } from './catalog';
import { LeftButton, RightButton, RightIconButton } from './buttons';
import { Theme, THEME_COLORS } from "../constants/theme";
import DatabaseService from "../services/database";
import Background from "./background";

const minSearchTextLength = 2;

export default class SearchScreen extends Component {
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
    if (text.length >= minSearchTextLength || text.trim() == '') {
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
        <Background/>
        <View style={Theme.headerContainer}>
          <LeftButton text={'SEARCH'} onPress={() => {this.props.navigation.pop()}}/>
          <RightIconButton onPress={() => {this.toggleSearch()}}>
            <Icon style={{flex: 1, padding: 5,}} name='search' type='font-awesome' color={THEME_COLORS.BG}/>
          </RightIconButton>
        </View>
        <View style={Theme.contentContainer}>
        {this.state.showSearch && (
          <Search onTextInput={this.searchUpdated.bind(this)} />
        )}
        <Catalog list={this.state.list} listLoaded={this.state.listLoaded} onRowPress={(species) => this.onRowPressed(species)}/>
        </View>
      </View>
    );
  }
}