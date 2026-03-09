import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Button } from "react-native";

function PostCard() {
  return (
    <View style={styles.cardView}>
      <Text style={styles.title}>Some Text</Text>
      <Text style={styles.description}>Some info</Text>
    </View>


  );



}

export function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View>
    <PostCard/>
    <Button title="Open Map" onPress={() => navigation.navigate("Map")}/>
    </View>
  );
};

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
  description: {
    paddingTop: 10,
    fontSize: 16,
    fontWeight: 500
  }

});
