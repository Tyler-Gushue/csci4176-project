import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';

import * as React from 'react';

import { HomeScreen } from './screens/Home.js'
import { ProfileScreen } from './screens/Profile.js';

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
  return (
    <div>

      <div style={ styles.navBar }>
        <Button>Home</Button>
      </div>

      <Navigation />
    </div>
  );
}


const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
  }

});
