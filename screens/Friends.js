import { View, StyleSheet, Text, Platform } from 'react-native';

//placeholder for social features
export function FriendsScreen() {
  return (
    <View style={ styles.cardView }>
      <Text style={styles.title}>Friends</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardView: {
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    marginTop: (Platform.OS != 'web') ? '15%' : 0,
    borderRadius: 10
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
});
