import React, { Component } from "react";
import { createStackNavigator } from 'react-navigation';

import DatabaseService from './services/database';

import HomeScreen from './components/screens/home-screen';
import CatalogScreen from './components/screens/catalog-screen';
import LoginScreen from './components/screens/login-screen';



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
