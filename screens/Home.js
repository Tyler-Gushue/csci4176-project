import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Button } from "react-native";
import React, {useState, useEffect} from "react"

import { fetchPosts } from '../DbUtil.js'
import { ScrollView, FlatList, Platform } from 'react-native';

import { fetchUserFromId } from "../DbUtil.js";

//card toi display post in feed
function PostCard({ post }) {
  const [username, setUsername] = useState("unknown");

  fetchUserFromId(post.ownerID).then((data) => {
    setUsername(data.username);
  });

  const date = new Date(post.createdAt);

  return (
    <View style={styles.cardView}>
      <Text style={styles.title}>{ post.title }</Text>
      <Text style={styles.username}>Posted by {username} on {  date.toDateString() }</Text>
      <Text style={styles.description}>{post.description}</Text>

      <Text style={{ fontSize: 20, color: 'gray', paddingTop: 20, fontWeight: 500, flex: 0.3 }}>Games</Text>

      <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderColor: 'black', borderWidth: 2, borderRadius: 10, borderColor: 'lightgray'} }>
        <Text style={styles.gameEntry}>{ post.game }</Text>
      </View>
    </View>
  );
}

//home screen that displays the post feed
export function HomeScreen() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts().then((data) => {
       setPosts(data.map((v) => v));
    })
  });

  let topPaddingStyle = {};
  if (Platform.OS != 'web') {
    topPaddingStyle = {
      paddingTop: '15%'
    };
  }

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostCard post={item} />}
      style={topPaddingStyle}
    />
    // <ScrollView>
    //   {posts}
    // </ScrollView>
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
  username: {
    paddingTop: 2,
    fontSize: 15,
    color: 'gray'
  },
  description: {
    paddingTop: 10,
    fontSize: 16,
    fontWeight: 500
  },
  gameEntry: {
    flex: 1,
    fontSize: 18,
    padding: 5,
    fontWeight: 600,
    textAlign: 'left',
    color: 'gray',
    textAlign: 'center'
  }
});
