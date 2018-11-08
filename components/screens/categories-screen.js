import React, { Component } from "react";
import { View, Text } from "react-native";
import {
  Icon,
  FormValidationMessage,
  ListItem,
} from "react-native-elements";
import { Theme } from "../../constants/theme";
import {
  COLOR_TRAITS,
  SIZE_TRAITS,
  SPECIES_TYPES
} from "../../constants/trait-categories";

export default class CategoriesScreen extends Component {
  constructor(props) {
    super(props);

    console.log(COLOR_TRAITS);
  }

  async searchCategories () {

  }

  render() {
    return (
      <View style={Theme.containerContainer}>
        <View style={Theme.headerContainer}>
          <Text style={Theme.headerTitle}>CATEGORIES</Text>
          <Icon
            iconStyle={Theme.headerButton}
            name="search"
            color="#fff"
            onPress={() => this.searchCategories()}
          />
        </View>
      </View>
    );
  }
}
