import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  ActivityIndicator
} from 'react-native';

import { ListTheme, BaseTheme } from "../constants/theme";
import MediaService from '../services/media';

class LoadingIndicator extends Component {
  render() {
    return (
      <View style={ListTheme.loader}>
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
        <View style={BaseTheme.content}>
          {!this.props.listLoaded && <LoadingIndicator />}
          <View style={ListTheme.container}>
            {this.props.listLoaded && (
                <FlatList
                  data={this.props.list}
                  keyExtractor={item => item.id.toString()}
                  renderItem={(species, index) => (
                    <TouchableOpacity
                      style={ListTheme.row}
                      onPress={() => {this.props.onRowPress(species.item)}}
                    >
                      <Image
                        style={ListTheme.image}
                        source={{ uri: MediaService.getImageURI(species.item.url)}}
                      />
                      <View style={ListTheme.content}>
                        <Text style={ListTheme.title}>{species.item.alias}</Text>
                        <Text style={ListTheme.subtitle}>{species.item.sciname}</Text>
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