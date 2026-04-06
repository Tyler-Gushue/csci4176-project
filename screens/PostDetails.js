import React, { useState, useEffect } from "react";
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Image} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { applyToPost, acceptParticipant, declineParticipant, fetchPostById } from "../DbUtil";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function PostDetailsScreen({route}){
    const navigation = useNavigation();
    const{post} = route.params;
    const [postData, setPostData] = useState(post);
    const [message, setMessage] = useState("");
    const [applications, setApplications] = useState(post.pendingParticipants || []);
    const [currentUserId, setCurrentUserId] = useState(null);
    const doApply = async () => {
        const newApplication = await applyToPost(post.id, message);

        if(newApplication){
            setApplications((prev) => [...prev, newApplication]);
        }
        setMessage("");
    };

    const doAccept = async (application) => {
        await acceptParticipant(post.id, application);
        setApplications((prev) => prev.filter((app) => app !== application));
    };

    const doDecline = async (application) => {
        await declineParticipant(post.id, application);
        setApplications((prev) => prev.filter((app) => app !== application));
    };

    useEffect(() => {
        const loadUserId = async () => {
            const userId = await AsyncStorage.getItem("userID");
            setCurrentUserId(userId);
        };
        loadUserId();
    }, []);

    useEffect(() => {
        const loadPost = async () => {
            const freshPost = await fetchPostById(post.id);
            if(freshPost){
                setPostData(freshPost);
                setApplications(freshPost.pendingParticipants || []);
            }
        };
        loadPost();
    }, [post.id]);



    const isOwner = currentUserId === postData.ownerID;

    return(
        <View style={styles.container}>
            <View style={styles.card}>
                <TouchableOpacity style={styles.button} 
                onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{postData.title}</Text>
                <Text style={styles.text}>Description: {postData.description}</Text>
                <Text style={styles.text}>Game: {postData.game}</Text>
                <Text style={styles.text}>Type: {postData.type}</Text>
                <Text style={styles.text}>Location: {postData.location}</Text>

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

                {applications.length > 0 && (
                    <>
                    <Text style={styles.title}>Applications</Text>
                    {applications.map((app, index) => (
                        <View key={index} style={styles.applicationCard}>
                            <Image style={styles.profileImage}
                                source={app.profileImage ? {uri: app.profileImage} : require("../Images/NoProfileImg.webp")}
                            />
                            <Text style={styles.text}>User: {app.username || app.userId}</Text>
                            <Text style={styles.text}>Message: {app.message || "No message written"}</Text>

                        {isOwner && (
                             <View style={styles.actionRow}>
                                <TouchableOpacity style={styles.smallButton}
                                    onPress={() => doAccept(app)}
                                >
                                <Text style={styles.buttonText}>Accept</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.smallButton}
                                    onPress={() => doDecline(app)}
                                >
                                <Text style={styles.buttonText}>Decline</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        </View>
                    ))}
                    </>
                )}
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

    applicationCard:{
        backgroundColor: "#f4faff",
        borderWidth: 1,
        borderColor: "#67beff",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },

    profileImage:{
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#67beff",
    },

    actionRow:{
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },

    smallButton: {
        backgroundColor: "#67beff",
        alignItems: "center",
        borderRadius: 10,
        padding: 8,
        flex: 1,
    },
});