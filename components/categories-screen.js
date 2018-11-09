// Anti-switch reference: https://toddmotto.com/deprecating-the-switch-statement-for-object-literals/

import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  Icon,
  FormValidationMessage,
  ListItem,
  ButtonGroup
} from "react-native-elements";
import {Catalog} from './catalog-screen';
import { Theme, headingTextColor, primaryColor } from "../constants/theme";
import {
  COLOR_TRAITS,
  SIZE_TRAITS,
  SPECIES_TYPES
} from "../constants/trait-categories";
import DatabaseService from '../services/database';

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
        <View style= {LocalTheme.filterLabelContainer}>
          <Text style={LocalTheme.filterLabel}>{this.props.filterName}</Text>
          <Icon
            iconStyle={LocalTheme.filterLabel}
            name={this.state.showFilters ? 'chevron-down' : 'chevron-right'}
            type='font-awesome'
            color={headingTextColor}
            onPress={() => this.toggleFilters()}
          />
        </View>
        {this.state.showFilters && (
          <ButtonGroup
            style={{ margin: 0 }}
            selectedIndex={this.props.selectedIndex}
            buttons={this.props.filters}
            onPress= {this.props.onUpdateIndex}
            activeOpacity={255}
            containerStyle={LocalTheme.groupContainer}
            containerBorderRadius={1}
            innerBorderStyle={LocalTheme.innerBorder}
            buttonStyle={LocalTheme.filterButton}
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
    this.searchCategories();
  }

  async searchCategories() {
    let allSpecies = await DatabaseService.getSpeciesByAlias();
    if (allSpecies) {
      console.log(allSpecies);
      this.setState({ list: allSpecies, listLoaded: true});
    }
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
      return {indexes: newIndexes};
    });
  }

  onRowPressed (species) {
    this.props.navigation.navigate('Species', {species: species});
  }

  render() {

    return (
      <View style={Theme.containerContainer}>
        <View style={Theme.headerContainer}>
          <Text style={Theme.headerTitle}>CATEGORIES</Text>
        </View>

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
          onUpdateIndex={(selectedIndex) => {this.onSTypeUpdated('stypes', selectedIndex)}}/>

          <Catalog list={this.state.list} listLoaded={this.state.listLoaded} onRowPress={(species) => this.onRowPressed(species)}/>
      </View>
    );
  }
}

const LocalTheme = StyleSheet.create({
  groupContainer: {
    borderColor: primaryColor,
    borderWidth: 0
  },
  filterContainer: {
    maxHeight: 100,
    flexDirection: "column",
    backgroundColor: primaryColor
  },
  filterLabelContainer: {
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
  },
  filterButton: {
    backgroundColor: primaryColor,
    borderColor: primaryColor
  },
  innerBorder: {
    color: primaryColor
  },
  selectedFilterButton: {},
  selectedText: {
    color: headingTextColor
  },
  filterLabel: {
    color: headingTextColor,
    fontWeight: "bold",
    fontSize: 18
  }
});
