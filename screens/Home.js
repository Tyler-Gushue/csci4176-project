import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, FlatList, Platform, TouchableOpacity} from "react-native";
import React, {useState, useEffect} from "react"
import { fetchPosts, fetchUserFromId } from '../DbUtil.js'



//card to display post in feed
function PostCard({ post, navigation }) {
  const [username, setUsername] = useState("unknown");

  useEffect(() => {
    fetchUserFromId(post.ownerID).then((data) => {
      if(data && data.username){
        setUsername(data.username);
      }
    });
  }, [post.ownerID]);

  const date = new Date(post.createdAt);

  return (
    <TouchableOpacity style={styles.cardView} onPress={() => navigation.navigate("PostDetails", { post })}>
      <Text style={styles.title}>{ post.title }</Text>
      <Text style={styles.username}>Posted by {username} on {  date.toDateString() }</Text>
      <Text style={styles.description}>{post.description}</Text>

      <Text style={{ fontSize: 20, color: "#67beff", paddingTop: 20, fontWeight: "500", flex: 0.3 }}>Games</Text>

      <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderWidth: 2, borderRadius: 10, borderColor: "#67beff", marginTop: 10} }>
        <Text style={styles.gameEntry}>{ post.game }</Text>
      </View>
    </TouchableOpacity>

  );
}

//home screen that displays the post feed
export function HomeScreen() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts().then((data) => {
       setPosts(data.map((v) => v));
    });
  }, []);

  let topPaddingStyle = {};
  if (Platform.OS != 'web') {
    topPaddingStyle = {
      paddingTop: '15%'
    };
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={posts}
        renderItem={({item}) => <PostCard post={item} navigation={navigation}/>}
        style={topPaddingStyle}
      />

      <TouchableOpacity
        style={styles.cornerButton}
        onPress={() => navigation.navigate("ConfirmedPosts")}
      >
        <Text style={styles.buttonText}>Confirmed Posts</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardView: {
    padding: 20,
    backgroundColor: 'white',
    margin: 7,
    borderColor: "#67beff",
    borderWidth: 2,
    borderRadius: 10
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  username: {
    paddingTop: 2,
    fontSize: 15,
    color: 'gray'
  },
  description: {
    paddingTop: 15,
    fontSize: 16,
    fontWeight: "500"
  },
  gameEntry: {
    flex: 1,
    fontSize: 18,
    padding: 5,
    fontWeight: "600",
    textAlign: 'left',
    color: 'black',
    textAlign: 'center'
  },

  cornerButton:{
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#67beff",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 10,
  },

  buttonText:{
    fontSize: 15,
    color: "#fff",
  },
});
