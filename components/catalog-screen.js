import React, { Component } from "react";
import {
  Image,
  ActivityIndicator,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity
} from "react-native";
import {
  Icon,
  FormValidationMessage,
  Card,
  ListItem,
  Button,
  SearchBar
} from "react-native-elements"; 
import { Authenticator } from "aws-amplify-react-native";
import Amplify, { Storage, Auth } from "aws-amplify";
import { Theme, THEME_COLORS } from "../constants/theme";
import DatabaseService from "../services/database";
import MediaService from '../services/media';

const minSearchTextLength = 2;

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

export class LoadingIndicator extends Component {
  render() {
    return (
      <View style={Theme.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
}

export default class CatalogScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSearch: false,
      list: [],
      listLoaded: false,
    };
  }

  componentDidMount () {
    this.initCatalog();
  }

  async initCatalog() {
    let allSpecies = await DatabaseService.getAliasedSpecies();
    if (allSpecies) {
      this.setState({ list: allSpecies, listLoaded: true});
    }
  }

  toggleSearch() {
    this.setState(state => ({ showSearch: !state.showSearch }));
  }

  async searchUpdated(text) {
    if (text.length >= minSearchTextLength) {
      let updatedList = await DatabaseService.search(text);
      this.setState({ list: updatedList, listLoaded: true});
    }
  }
  
  onRowPressed (species) {
    this.props.navigation.navigate('Species', {species: species});
  }

  render() {
    return (
      <View style={Theme.containerContainer}>
        <View style={Theme.headerContainer}>
          <Text style={Theme.headerTitle}>CATALOG</Text>
          <Icon
            iconStyle={Theme.headerButton}
            name="search"
            color={THEME_COLORS.HEADING_TEXT}
            onPress={() => this.toggleSearch()}
          />
        </View>
        {this.state.showSearch && (
          <Search onTextInput={this.searchUpdated.bind(this)} />
        )}
        <Catalog list={this.state.list} listLoaded={this.state.listLoaded} onRowPress={(species) => this.onRowPressed(species)}/>
      </View>
    );
  }
}

export class Catalog extends Component {
  constructor (props) {
    super(props);
  }



  render() {
    return (
        <View style={Theme.contentContainer}>
          {!this.props.listLoaded && <LoadingIndicator />}
          <View style={Theme.listContainer}>
            {this.props.listLoaded && (
                <FlatList
                  data={this.props.list}
                  keyExtractor={item => item.id.toString()}
                  renderItem={(species, index) => (
                    <TouchableOpacity
                      style={Theme.listContent}
                      onPress={() => {this.props.onRowPress(species.item)}}
                    >
                      <Image
                        style={Theme.listContentImage}
                        source={{ uri: MediaService.getImageURI(species.item.url)}}
                      />
                      <View style={Theme.listContentView}>
                        <Text style={Theme.listContentTitle}>{species.item.alias}</Text>
                        <Text style={Theme.listContentSubtitle}>{species.item.sciname}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              )}
          </View>
        </View>
    );
  }
}