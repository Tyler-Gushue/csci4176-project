import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Button } from "react-native";
import React, {useState, useEffect} from "react"
import { fetchPosts } from "../DbUtil";

<<<<<<< HEAD
import React, { useState, useEffect } from 'react';

import { ScrollView, FlatList, Platform } from 'react-native';


import { fetchPosts } from '../DbUtil.js'

function PostCard(props) {
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
<<<<<<< HEAD
       setPosts(data.map((v) => v));
    })
  });
=======
       setPosts(data.map((v, i) => <PostCard key={i} post={v} />));
    });
  }, []);
>>>>>>> origin

  let topPaddingStyle = {};
  if (Platform.OS != 'web') {
    topPaddingStyle = {
      paddingTop: '15%'
    };
  }

  return (
<<<<<<< HEAD
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostCard post={item} />}
      style={topPaddingStyle}
    />
    // <ScrollView>
    //   {posts}
    // </ScrollView>
=======
    <View>
    {posts}
    <Button title="Open Map" onPress={() => navigation.navigate("Map")}/>
    </View>
>>>>>>> origin
  );
};

const styles = StyleSheet.create({
  cardView: {
    padding: 20,
    backgroundColor: 'white',
    margin: 7,
    borderRadius: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
  },
  description: {
    paddingTop: 10,
    fontSize: 16,
    fontWeight: 500
  }
});
