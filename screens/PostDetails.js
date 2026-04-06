import React, { useState } from "react";
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { applyToPost } from "../DbUtil";

export function PostDetailsScreen({route}){
    const navigation = useNavigation();
    const{post} = route.params;
    const [message, setMessage] = useState("");
    const doApply = async () => {
        await applyToPost(post.id, message);
        setMessage("");
    };

    return(
        <View style={styles.container}>
            <View style={styles.card}>
                <TouchableOpacity style={styles.button} 
                onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.text}>Description: {post.description}</Text>
                <Text style={styles.text}>Game: {post.game}</Text>
                <Text style={styles.text}>Type: {post.type}</Text>
                <Text style={styles.text}>Location: {post.location}</Text>

                <TextInput style={styles.input} 
                placeholder="Why do you want to apply?" 
                placeholderTextColor="#67beff"
                value={message}
                onChangeText={setMessage}
                ></TextInput>

                <TouchableOpacity style={styles.button}
                onPress={doApply}>
                    <Text style={styles.buttonText}>Apply</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#b4dafb",
        padding: 10,
        justifyContent: "center",
    },

    card:{
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
    },

    title:{
        fontSize: 24,
        color: "#67beff",
        fontWeight: "700",
        marginBottom: 10,
    },

    text:{
        fontSize: 16,
        color: "#67beff",
        marginBottom: 18,
    },

    button:{
        backgroundColor: "#67beff",
        alignItems: "center",
        borderRadius: 10,
        marginBottom: 15,
        padding: 8,
    },

    buttonText: {
        fontSize: 15,
        color: "#fff",
    },

    input:{
        borderWidth: 1,
        borderColor: "#67beff",
        borderRadius: 10,
        color: "#67b3ff",
        padding: 10,
        marginBottom: 15,
    },
});