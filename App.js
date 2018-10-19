import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View
} from "react-native";
import { Icon } from 'react-native-elements';
import Amplify, { Storage, Auth } from "aws-amplify";
import aws_exports from "./aws-exports";
import { withAuthenticator } from "aws-amplify-react-native";
import SQLite from "react-native-sqlite-storage";
import { createStackNavigator } from 'react-navigation';

import HomeScreen from './components/screens/home-screen';
import CatalogScreen from './components/screens/catalog-screen';

SQLite.DEBUG(true);
SQLite.enablePromise(false);

Amplify.configure(aws_exports);


const RootStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    }),
  },
  Catalog: {
    screen: CatalogScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    }),
  },
});

class App extends Component {
  render() {
    return <RootStack />;
  }
};

export default withAuthenticator(App);
