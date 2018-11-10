import React, { Component } from "react";
import {
  SearchBar
} from "react-native-elements"; 
import { Theme } from "../constants/theme";


export class Search extends Component {
  render() {
    return (
        <SearchBar
          containerStyle= {Theme.searchContainer}
          noIcon={true}
          inputStyle= {Theme.searchInput}
          onChangeText={(text) => {
            this.props.onTextInput(text);
          }}
        />
    );
  }
}