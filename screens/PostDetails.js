import React, { useState, useEffect } from "react";
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { applyToPost, deletePost, acceptParticipant, declineParticipant, fetchPostById, getAddressFromCoords } from "../DbUtil";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps";
import { Alert } from 'react-native';


export function PostDetailsScreen({route}){
    const navigation = useNavigation();
    const {post} = route.params;
    const [postData, setPostData] = useState(post);
    const [message, setMessage] = useState("");
    const [applications, setApplications] = useState(post.pendingParticipants || []);
    const [acceptedApplications, setAcceptedApplications] = useState(post.acceptedParticipants || []);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [addressName, setAddressName] = useState("");

    const isOwner = () => currentUserId === postData.ownerID;

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
        setAcceptedApplications((prev) => [...prev, application]);
    };

    const doDecline = async (application) => {
        await declineParticipant(post.id, application);
        setApplications((prev) => prev.filter((app) => app !== application));
    };

    const getLocationName = async () => {

        if (postData.location === "In-person" && postData.lat && postData.long) {

            const name = await getAddressFromCoords(postData.lat, postData.long);

            setAddressName(name);

        } else {

            return;

        }

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
                setAcceptedApplications(freshPost.acceptedParticipants || []);
            }
        };
        loadPost();
    }, [post.id]);

    useEffect(() => {

        getLocationName();

    }, [postData.location, postData.long, postData.lat])

    const removePost = async () => {
        console.log('deleting post')


        Alert.alert(
          "Delete post",
          "Are you sure you want to delete this post?",
          [
              {
                text: "Delete Post", onPress: () => {
                    try {
                        deletePost(post.id);
                        navigation.navigate("Home");
                    }
                    catch (err) {
                        console.error(err);
                    }
                }

              },
            { text: "Cancel", onPress: () => {}}
          ]
        )

    }

    return(
        <View style={styles.container}>
            <ScrollView style={styles.card}>
                <TouchableOpacity style={styles.button}
                onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{postData.title}</Text>
                <Text style={styles.text}>Description: {postData.description}</Text>
                <Text style={styles.text}>Game: {postData.game}</Text>
                <Text style={styles.text}>Type: {postData.type}</Text>
                <Text style={styles.text}>Location: {postData.location}</Text>

                { postData.location === "In-person" && postData.lat && postData.long && (
                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: postData.lat,
                                longitude: postData.long,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        >
                            <Marker
                            coordinate={{
                                latitude: postData.lat,
                                longitude: postData.long,
                            }}
                            title="Meeting Spot"
                            description={addressName}
                            pinColor='#67beff'
                            />
                        </MapView>
                    </View>
                )}


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

                {
                    isOwner() &&
                    <TouchableOpacity style={styles.deleteButton}
                        onPress={removePost}>
                        <Text style={styles.buttonText}>Delete Post</Text>

                    </TouchableOpacity>
                }

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

                        {isOwner() && (
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

                {acceptedApplications.length > 0 && (
                    <>
                        <Text style={styles.title}>Confirmed Players</Text>
                        {acceptedApplications.map((app, index) => (
                            <View key={index} style={styles.applicationCard}>
                                <Image
                                    style={styles.profileImage}
                                    source={
                                        app.profileImage ? {uri: app.profileImage} : require("../Images/NoProfileImg.webp")
                                    }
                                />
                                <Text style={styles.text}>User: {app.username || app.userId}</Text>
                                <Text style={styles.text}>Message: {app.message || "No message written"}</Text>
                            </View>
                        ))}
                    </>
                )}
            </ScrollView>
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
        margin: 10,
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
    deleteButton:{
        backgroundColor: "#a71717",
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
    mapContainer: {
        flex: 1,
    },
    map: {
        height: 250,
        width: '100%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#67beff',
        marginBottom: 15
    },
});
