import React, { Component } from "react";
import { View, Text, TextInput } from "react-native";
import { BaseTheme, FieldInputTheme, Colors } from "../constants/theme";
import { Icon } from 'react-native-elements';

export class FieldInput extends Component {
  render() {
    return (
      <View style={[FieldInputTheme.container, BaseTheme.row, BaseTheme.shadow]}>
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
          {this.props.children ? (this.props.children) : (
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
          )}
        </View>
      </View>
    );
  }
}

export class EntryInput extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    let renderedEntries = [];

    for (i = 0; i < this.props.entries.length; i++) {
      let index = i;
      renderedEntries.push (
        <View key={index} style={{flex:1,flexDirection: 'row',}}>
        <FieldInput
          fieldName={this.props.entryName + ' ' + (index + 1)}
          fieldValue={this.props.entries[index]}
          onChangeText={(fieldName, newFieldValue) => {
            this.props.onUpdate(index, newFieldValue);
          }}
        />
        </View>
      );
    }

    return (
      <View style={[FieldInputTheme.container, BaseTheme.shadow]}>
        <View style={[FieldInputTheme.label, BaseTheme.row]}>
          <Text style={[BaseTheme.headerTitle, BaseTheme.centerText, BaseTheme.bold, FieldInputTheme.labelText]}>{this.props.entryName}</Text>
          <Icon
          containerStyle={{padding:5,}}
          name='plus'
          type='font-awesome'
          color={Colors.positive}
          onPress={() => {this.props.onAdd()}}/>
          <Icon
          containerStyle={{padding:5,}}
          name='remove'
          type='font-awesome'
          color={Colors.negative}
          onPress={() => {this.props.onDelete()}}/>
        </View>
      {renderedEntries}
      </View>
    );
  }
}
