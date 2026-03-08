import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';

import * as React from 'react';


import { HomeScreen } from './screens/Home.js'
import { ProfileScreen } from './screens/Profile.js';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen}/>
        <Tab.Screen name="Profile" component={ProfileScreen}/>
      </Tab.Navigator>
    </NavigationContainer>
  );


}


export default function App() {
  return (
    <View style={{width: '100%'}}>
      <Navigation />
    </View>
  );
}


const styles = StyleSheet.create({
  navBar: {
    display: "flex",
    flexDirection: "row",
  },
});
