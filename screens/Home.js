import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Button } from "react-native";
import React, {useState, useEffect} from "react"
import { fetchPosts } from "../DbUtil";

function PostCard({ post }) {
  return (
    <View style={styles.cardView}>
      <Text style={styles.title}>{ post.title }</Text>
      <Text style={styles.description}>{ post.description }</Text>
    </View>
  );
}

export function HomeScreen() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts().then((data) => {
       setPosts(data.map((v, i) => <PostCard key={i} post={v} />));
    });
  }, []);

  return (
    <View>
    {posts}
    <Button title="Open Map" onPress={() => navigation.navigate("Map")}/>
    </View>
  );
};

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
    fontWeight: '600',
  },
  description: {
    paddingTop: 10,
    fontSize: 16,
    fontWeight: '500'
  }
});
