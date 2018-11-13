import React, { Component } from "react";
import {
  SearchBar
} from "react-native-elements"; 
import { SearchTheme } from "../constants/theme";


export class Search extends Component {
  render() {
    return (
        <SearchBar
          containerStyle= {SearchTheme.container}
          noIcon={true}
          inputStyle= {SearchTheme.input}
          onChangeText={(text) => {
            this.props.onTextInput(text);
          }}
        />
    );
  }
}