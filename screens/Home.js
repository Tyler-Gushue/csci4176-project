import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";

import React, {useState, useEffect} from 'react';


import { fetchPosts } from '../DbUtil.js'

function PostCard(props) {
  return (
    <View style={styles.cardView}>
      <Text style={styles.title}>{ props.post.name }</Text>
      <Text style={styles.description}>{ props.post.description }</Text>
    </View>
  );
}

export function HomeScreen() {
  const navigation = useNavigation();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts().then((data) => {
       setPosts(data.map((v) => <PostCard post={v} />));
    })
  });

  return (posts);
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
