import React, { Component } from "react";
import { createStackNavigator } from 'react-navigation';

import DatabaseService from './services/database';
import MediaService from './services/media';

import HomeScreen from './components/home-screen';
import SearchScreen from './components/search-screen';
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
  Search: {
    screen: SearchScreen,
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
  initialRouteName: 'Search',
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
