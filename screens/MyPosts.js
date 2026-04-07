import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPosts } from "../DbUtil";
import { useNavigation } from "@react-navigation/native";

function MyPostCard({post, navigation}){
    return (
        <TouchableOpacity style={styles.cardView}
        onPress={() => navigation.navigate("PostDetails", { post })}
        >
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.description}>{post.description}</Text>
            <Text style={styles.meta}>Game: {post.game}</Text>
            <Text style={styles.meta}>Type: {post.type}</Text>
            <Text style={styles.meta}>Location: {post.location}</Text>
        </TouchableOpacity>
    );
}

export function MyPostsScreen() {
    const navigation = useNavigation();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const loadMyPosts = async () => {
            const userId = await AsyncStorage.getItem("userID");
            const allPosts = await fetchPosts();
            const myPosts = allPosts.filter((post) => post.ownerID === userId);
            setPosts(myPosts);
        };
        loadMyPosts();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.contentBox}>
                <TouchableOpacity style={styles.backButton}
                onPress={() => navigation.goBack()}
                >
                <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.header}>My Posts</Text>
                <FlatList data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <MyPostCard post={item} navigation={navigation}></MyPostCard>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>You have no posts</Text>
                }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#b4dafb",
        justifyContent: "center",
        padding: 10,
    },

    contentBox:{
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        maxHeight: "70%",
        marginTop: -80,
    },
    
    header: {
        fontSize: 28,
        color: "#67beff",
        fontWeight: "700",
        marginBottom: 10,
        textAlign: "center"
    },

    cardView: {
        padding: 20,
        backgroundColor: "white",
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#67beff",
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#67beff",
        marginBottom: 8,
    },

    description:{
        fontSize: 16,
        color: "#67beff",
        marginBottom: 8,
    },

    meta: {
        fontSize: 14,
        color: "gray",
    },  
    emptyText: {
        fontSize: 16,
        color: "#67beff",
        marginTop: 20,
        textAlign: "center",
    },

    backButton:{
        backgroundColor: "#67beff",
        alignSelf: "flex-start",
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 10,
    },

    buttonText:{
        fontSize: 15,
        color: "#fff",
    },
});