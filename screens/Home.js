import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Button } from "react-native";

function PostCard() {
  return (
    <View style={styles.cardView}>
      <Text style={styles.title}>{ props.post.title }</Text>
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
