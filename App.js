import React, { Component } from "react";
import Amplify from "aws-amplify";
import aws_exports from "./aws-exports";
import SQLite from "react-native-sqlite-storage";
import { createStackNavigator } from 'react-navigation';

import HomeScreen from './components/screens/home-screen';
import CatalogScreen from './components/screens/catalog-screen';
import LoginScreen from './components/screens/login-screen';

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
  Login: {
    screen: LoginScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    }),
  }
});

export default class App extends Component {
  render() {
    return <RootStack />;
  }
};

//export default withAuthenticator(App);
