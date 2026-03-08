import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';

import * as React from 'react';

import { HomeScreen } from './screens/Home.js'

import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen
    }
  }
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation/>;
}
