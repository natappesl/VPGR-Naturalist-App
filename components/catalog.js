import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  ActivityIndicator
} from 'react-native';

import { Theme } from "../constants/theme";
import MediaService from '../services/media';

class LoadingIndicator extends Component {
  render() {
    return (
      <View style={Theme.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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