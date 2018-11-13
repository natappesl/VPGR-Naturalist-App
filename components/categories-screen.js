// Anti-switch reference: https://toddmotto.com/deprecating-the-switch-statement-for-object-literals/

import React, { Component } from "react";
import DatabaseService from '../services/database';
import Background from './background';
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Icon, ListItem, ButtonGroup } from "react-native-elements";
import { Catalog } from './catalog';
import { SideButton } from './buttons';
import { BaseTheme, Colors, FilterTheme } from "../constants/theme";
import { ColorTraits, SizeTraits, SpeciesTypes } from "../constants/trait-categories";

class FilterGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: -1,
      showFilters: false,
    };
  }

  toggleFilters() {
    this.setState(state => ({showFilters: !state.showFilters}));
  }

  render() {

    return (
      <View style={FilterTheme.container}>
        <TouchableOpacity
          onPress={() => this.toggleFilters()}
          delayPressIn={0}
          delayPressOut={0}>
          <View style={FilterTheme.labelContainer}>
            <Text style={FilterTheme.label}>{this.props.filterName}</Text>
            <Icon
              iconStyle={FilterTheme.icon}
              name={this.state.showFilters ? 'chevron-down' : 'chevron-right'}
              type='font-awesome'
              color={Colors.headingText}
            />
          </View>
        </TouchableOpacity>
        {this.state.showFilters && (
          <ButtonGroup
            style={{ margin: 0 }}
            selectedIndex={this.props.selectedIndex}
            buttons={this.props.filters}
            onPress= {this.props.onUpdateIndex}
            delayPressOut={0}
            containerStyle={FilterTheme.group}
            containerBorderRadius={1}
            innerBorderStyle={FilterTheme.innerBorder}
            buttonStyle={FilterTheme.button}
            textStyle={FilterTheme.text}
            selectedTextStyle={FilterTheme.selectedText}
            selectedButtonStyle={FilterTheme.selectedButton}
          />
        )}
      </View>
    );
  }
}

export default class CategoriesScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      listLoaded: false,
      indexes: {
        'colors': -1,
        'sizes': -1,
        'stypes': -1,
      },
    }
    this.initList();
  }

  async initList() {
    let allSpecies = await DatabaseService.getAliasedSpecies();
    if (allSpecies) {
      this.setState({ list: allSpecies, listLoaded: true});
    }
  }

  async updateList () {
    let newList = await DatabaseService.getSpeciesByCategory(this.state.indexes['colors'], this.state.indexes['sizes'], this.state.indexes['stypes']);
    this.setState({list: newList});
  }

  onIndexUpdated(group, selectedIndex) {
    this.setState ( (state) => {
      let newIndexes = state.indexes;
      if (selectedIndex == newIndexes[group]){
        newIndexes[group] = -1;
      }
      else {
        newIndexes[group] = selectedIndex;
      }
      this.updateList();
      return {indexes: newIndexes};
    });
  }

  onRowPressed (species) {
    this.props.navigation.navigate('Species', {species: species});
  }

  render() {

    return (
      <View style={BaseTheme.container}>
      <Background/>
        <View style={BaseTheme.header}>
          <SideButton left text={'CATEGORIES'} onPress={() => {this.props.navigation.navigate('Home')}}/>
        </View>
        <View style={BaseTheme.content}>
          <FilterGroup filterName="COLORS"
            filters={ColorTraits}
            selectedIndex={this.state.indexes['colors']}
            onUpdateIndex={(selectedIndex) => {this.onIndexUpdated('colors', selectedIndex)}} />

            <FilterGroup filterName="SIZES"
            filters={SizeTraits}
            selectedIndex={this.state.indexes['sizes']}
            onUpdateIndex={(selectedIndex) => {this.onIndexUpdated('sizes', selectedIndex)}}/>

            <FilterGroup filterName="TYPES"
            filters={SpeciesTypes}
            selectedIndex={this.state.indexes['stypes']}
            onUpdateIndex={(selectedIndex) => {this.onIndexUpdated('stypes', selectedIndex)}}/>

            <Catalog list={this.state.list} listLoaded={this.state.listLoaded} onRowPress={(species) => this.onRowPressed(species)}/>
        </View>
      </View>
    );
  }
}
