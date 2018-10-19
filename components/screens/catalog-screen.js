const species = [
  {
    name: 'American Avocet',
    avatar: 'https://d1ia71hq4oe7pn.cloudfront.net/photo/64807071-480px.jpg'
  },
  {
    name: 'American Avocet',
    avatar: 'https://d1ia71hq4oe7pn.cloudfront.net/photo/64807071-480px.jpg'
  },
  
];

import React, { Component } from "react";
import { Text, View } from "react-native";
import { Icon, FormValidationMessage, Card, ListItem, Button} from "react-native-elements";
import { Authenticator } from "aws-amplify-react-native";
import Amplify, { Storage, Auth } from "aws-amplify";
import {Theme} from '../../constants/theme';

export class Search extends Component {
  render () {
    return (
      <View style={Theme.searchContainer}><Text>SEARCH</Text></View>
    );
  }
}

export default class CatalogScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSearch: false,
    };
  }
  render() {
    return (
      <View style={Theme.containerContainer}>
        <View style={Theme.headerContainer}>
          <Text style={Theme.headerTitle}>CATALOG</Text>
          <Icon
            iconStyle={Theme.headerButton}
            name="search"
            color="#fff"
            onPress={() => this.toggleSearch()}
          />
        </View>
        <View style={Theme.contentContainer}>
          {this.state.showSearch && <Search/>}
          <View style={Theme.listContainer}>
            <Card containerStyle={{padding: 0}} >
              {
                species.map((s, i) => {
                  return (
                    <ListItem
                      key={i}
                      title={s.name}
                      avatar={{uri:s.avatar}}
                      onPress={() => console.log("NAVIGATE TO " + s.name)}
                    />
                  );
                })
              }
            </Card>
          </View>
        </View>
      </View>
    );
  }

  toggleSearch() {
    this.setState({
      showSearch: !this.state.showSearch
    });
  }
}