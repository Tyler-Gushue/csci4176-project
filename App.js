import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';

import * as React from 'react';


import { HomeScreen } from './screens/Home.js'
import { ProfileScreen } from './screens/Profile.js';
import { MapScreen } from './screens/Map.js';

import { Navigation } from './Navigation.js'


export default function App() {


  return <Navigation />;
  // return (
  //   <>
  //     <View style={{width: '100%'}}>
  //       {/* <NavBar />*/}
  //       <Navigation />
  //     </View>
  //   </>
  // );
}


const styles = StyleSheet.create({
  navBar: {
    display: "flex",
    flexDirection: "row",
  },
  
});
