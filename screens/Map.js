import { useNavigation } from "@react-navigation/native";


import { View, StyleSheet, Text, Button } from 'react-native';


export function MapScreen() {
  const navigation = useNavigation();

  return (
    <View style={ styles.cardView }>
      <Text style={styles.title}>Map</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardView: {
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    marginTop: '15%',
    borderRadius: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 650,
  },
});
