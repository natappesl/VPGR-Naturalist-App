import React, { Component } from "react";
import { View, Text, TextInput } from "react-native";
import { BaseTheme, FieldInputTheme } from "../constants/theme";

export class FieldInput extends Component {
  render() {
    return (
      <View
        style={[FieldInputTheme.container, BaseTheme.row, BaseTheme.shadow]}
      >
        <View style={FieldInputTheme.label}>
          <Text
            style={[
              FieldInputTheme.labelText,
              BaseTheme.centerText,
              BaseTheme.bold
            ]}
          >
            {this.props.fieldName}
          </Text>
        </View>
        <View style={[FieldInputTheme.inputContainer]}>
          <TextInput
            style={[FieldInputTheme.input]}
            multiline={true}
            numberOfLines={1}
            returnKeyType={"done"}
            returnKeyLabel={"done"}
            blurOnSubmit={true}
            selectTextOnFocus={true}
            value={this.props.fieldValue}
            onChangeText={text => {
              this.props.onChangeText(this.props.fieldName, text);
            }}
          />
        </View>
      </View>
    );
  }
}
