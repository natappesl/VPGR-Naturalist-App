import React, { Component } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Theme } from "../../constants/theme";
import { Redshift } from "aws-sdk";

export default class SpeciesScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { navigation } = this.props;
    const species = navigation.getParam("species", undefined);

    return (
      <View style={Theme.containerContainer}>
        {/* <View style={Theme.headerContainer}>
          <Text style={Theme.headerTitle}>{species.alias}</Text>
        </View> */}
        <View style={Theme.contentContainer}>
          <View style={LocalTheme.titleView}>
            <Image
              style={LocalTheme.mainImage}
              source={{
                uri:
                  "https://facebook.github.io/react-native/docs/assets/favicon.png"
              }}
            />
            <View style={LocalTheme.headerView}>
              <Text style={LocalTheme.headerTitle}>{species.alias}</Text>
            </View>
          </View>
          <View style={Theme.contentContainer}>
          <View style={LocalTheme.detailView}>
              <Text style={LocalTheme.labelTitle}>Scientific Name:</Text>
              <Text style={LocalTheme.labelText}>{species.sciname}</Text>
            </View>
            <View style={LocalTheme.detailView}>
              <Text style={LocalTheme.labelTitle}>Scientific Name:</Text>
              <Text style={LocalTheme.labelText}>{species.sciname}</Text>
            </View>
            <View style={LocalTheme.detailView}>
              <Text style={LocalTheme.labelTitle}>Scientific Name:</Text>
              <Text style={LocalTheme.labelText}>{species.sciname}</Text>
            </View>
            <View style={LocalTheme.detailView}>
              <Text style={LocalTheme.labelTitle}>Scientific Name:</Text>
              <Text style={LocalTheme.labelText}>{species.sciname}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const LocalTheme = StyleSheet.create({
  titleView: {
    backgroundColor: "green",
    flex: 1,
    flexDirection: "row"
  },
  mainImage: {
    flex: 1,
    padding: 5
  },
  headerView: {
    flex: 6,
  },
  headerTitle: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center",
  },
  headerSubtitle: {
    flex: 1,
    fontStyle: "italic",
    fontSize: 20
  },
  detailView: {
    flex: 1,
    flexDirection: 'row',
  },
  labelTitle: {
    flex:3,
    alignSelf: 'flex-end',
    fontSize: 18,
  },
  labelText: {
    flex: 5,
    fontStyle: 'italic',
    fontSize: 16,
    textAlign: 'left',
    alignSelf: 'flex-end',
  },
});
