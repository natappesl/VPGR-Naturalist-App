import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  Icon,
  FormValidationMessage,
  ListItem,
  ButtonGroup
} from "react-native-elements";
import { Theme, headingTextColor, primaryColor } from "../../constants/theme";
import {
  COLOR_TRAITS,
  SIZE_TRAITS,
  SPECIES_TYPES
} from "../../constants/trait-categories";

class FilterGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: -1,
      showFilters: true,
    };

    this.updateIndex = this.updateIndex.bind(this);
  }
  updateIndex(selectedIndex) {
    if (selectedIndex == this.state.selectedIndex) {
      this.setState({ selectedIndex: -1 });
    } else {
      this.setState({ selectedIndex: selectedIndex });
    }
  }

  toggleFilters() {
    this.setState(state => ({showFilters: !state.showFilters}));
  }
  render() {
    const { selectedIndex } = this.state;
    const colors = COLOR_TRAITS;

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
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={this.props.filters}
            activeOpacity={255}
            containerStyle={LocalTheme.groupContainer}
            containerBorderRadius={1}
            innerBorderStyle={LocalTheme.innerBorder}
            buttonStyle={LocalTheme.filterButton}
            selectedTextStyle={LocalTheme.selectyedText}
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
  }

  async searchCategories() {
    console.log("object");
  }

  render() {
    return (
      <View style={Theme.containerContainer}>
        <View style={Theme.headerContainer}>
          <Text style={Theme.headerTitle}>CATEGORIES</Text>
          <Icon
            iconStyle={LocalTheme.filterLabel}
            name="search"
            color={headingTextColor}
            onPress={() => this.searchCategories()}
          />
        </View>
          <FilterGroup filterName="COLORS" filters={COLOR_TRAITS} />
          <FilterGroup filterName="SIZES" filters={SIZE_TRAITS} />
          <FilterGroup filterName="TYPES" filters={SPECIES_TYPES} />
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
  selectyedText: {
    color: headingTextColor
  },
  filterLabel: {
    color: headingTextColor,
    fontWeight: "bold",
    fontSize: 24
  }
});
