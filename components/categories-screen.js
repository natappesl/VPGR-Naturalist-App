// Anti-switch reference: https://toddmotto.com/deprecating-the-switch-statement-for-object-literals/

import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  Icon,
  ListItem,
  ButtonGroup
} from "react-native-elements";
import {Catalog} from './catalog';
import { SideButton } from './buttons';
import { Theme, THEME_COLORS } from "../constants/theme";
import {
  COLOR_TRAITS,
  SIZE_TRAITS,
  SPECIES_TYPES
} from "../constants/trait-categories";
import DatabaseService from '../services/database';
import Background from './background';

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
      <View style={LocalTheme.filterContainer}>
        <TouchableOpacity
          onPress={() => this.toggleFilters()}
          delayPressIn={0}
          delayPressOut={0}>
          <View style={LocalTheme.filterLabelContainer}>
            <Text style={LocalTheme.filterLabel}>{this.props.filterName}</Text>
            <Icon
              iconStyle={LocalTheme.filterIcon}
              name={this.state.showFilters ? 'chevron-down' : 'chevron-right'}
              type='font-awesome'
              color={THEME_COLORS.HEADING_TEXT}
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
            containerStyle={LocalTheme.groupContainer}
            containerBorderRadius={1}
            innerBorderStyle={LocalTheme.innerBorder}
            buttonStyle={LocalTheme.filterButton}
            textStyle={LocalTheme.buttonText}
            selectedTextStyle={LocalTheme.selectedText}
            selectedButtonStyle={LocalTheme.selectedFilterButton}
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
      <View style={Theme.containerContainer}>
      <Background/>
        <View style={Theme.headerContainer}>
          <SideButton left text={'CATEGORIES'} onPress={() => {this.props.navigation.navigate('Home')}}/>
        </View>
        <View style={Theme.contentContainer}>
          <FilterGroup filterName="COLORS"
            filters={COLOR_TRAITS}
            selectedIndex={this.state.indexes['colors']}
            onUpdateIndex={(selectedIndex) => {this.onIndexUpdated('colors', selectedIndex)}} />

            <FilterGroup filterName="SIZES"
            filters={SIZE_TRAITS}
            selectedIndex={this.state.indexes['sizes']}
            onUpdateIndex={(selectedIndex) => {this.onIndexUpdated('sizes', selectedIndex)}}/>

            <FilterGroup filterName="TYPES"
            filters={SPECIES_TYPES}
            selectedIndex={this.state.indexes['stypes']}
            onUpdateIndex={(selectedIndex) => {this.onIndexUpdated('stypes', selectedIndex)}}/>

            <Catalog list={this.state.list} listLoaded={this.state.listLoaded} onRowPress={(species) => this.onRowPressed(species)}/>
        </View>
      </View>
    );
  }
}

const LocalTheme = StyleSheet.create({
  groupContainer: {
    borderColor: THEME_COLORS.TRANSPARENT,
    borderWidth: 0,
    backgroundColor: THEME_COLORS.TRANSPARENT,
  },
  filterContainer: {
    width: '100%',
    maxHeight: 100,
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.SECONDARY,
    backgroundColor: THEME_COLORS.TRANSPARENT,
  },
  filterLabelContainer: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: THEME_COLORS.SECONDARY,
    shadowColor: 'rgba(0,0,0, 0.5)', // IOS
    shadowOffset: { height: 10, width: 10 }, // IOS
    shadowOpacity: 0.5, // IOS
    shadowRadius: 5, //IOS
    elevation: 5, // Android
    zIndex: 10,
  },
  filterButton: {
    backgroundColor: THEME_COLORS.TRANSPARENT,
    borderColor: THEME_COLORS.TRANSPARENT
  },
  innerBorder: {
    color: THEME_COLORS.TRANSPARENT
  },
  selectedFilterButton: {
    backgroundColor: THEME_COLORS.TRANSPARENT,
    borderColor: THEME_COLORS.TRANSPARENT
  },
  selectedText: {
    color: THEME_COLORS.PRIMARY,
  },
  buttonText: {
    color: THEME_COLORS.SECONDARY,
  },
  filterLabel: {
    color: THEME_COLORS.HEADING_TEXT,
    fontWeight: "bold",
    fontSize: 18
  },
  filterIcon: {
    color: THEME_COLORS.HEADING_TEXT,
    fontWeight: "bold",
    fontSize: 18,
  },
});
