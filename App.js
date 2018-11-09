import React, { Component } from "react";
import { createStackNavigator } from 'react-navigation';

import DatabaseService from './services/database';
import MediaService from './services/media';

import HomeScreen from './components/home-screen';
import CatalogScreen from './components/catalog-screen';
import LoginScreen from './components/login-screen';
import SpeciesScreen from './components/species-screen';
import CategoriesScreen from "./components/categories-screen";


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
  Categories: {
    screen: CategoriesScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    }),
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    }),
  },
  Species: {
    screen: SpeciesScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    }),
  }
},
{
  initialRouteName: 'Catalog',
});

export default class App extends Component {
  constructor () {
    super();
  }
  render() {
    return <RootStack />;
  }
};

//export default withAuthenticator(App);
