import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';

import * as React from 'react';

import { HomeScreen } from './screens/Home.js'
import { ProfileScreen } from './screens/Profile.js';
import { MapScreen } from './screens/Map.js';

import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen
    },
    Profile: {
      screen: ProfileScreen
    }
  }
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <MapScreen />;
}


const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
  }

});
