import { useNavigation } from "@react-navigation/native";


import { View, StyleSheet, Text, Button } from 'react-native';


export function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={ styles.cardView }>
      <Text style={styles.title}>Profile</Text>
      <View style={ {display: 'flex', flexDirection: 'row', gap: '20px'} }>
        <Button title={'Login'} onPress={() => navigation.navigate("Login")} />
        <Button title={'Signup'} onPress={ () => navigation.navigate("Signup") } />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardView: {
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 650,
  },
});
