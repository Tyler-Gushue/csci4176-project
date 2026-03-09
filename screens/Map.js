import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, Button} from "react-native";
import MapView, {Marker} from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

export function MapScreen(){
    const navigation = useNavigation();
    const [region, setRegion] = useState({
        //somewhere Downtown Halifax
        latitude: 44.6488,
        longitude: -63.5752,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    const [userLocation, setUserLocation] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const sampleEvents = [
        {
            id: "1",
            title: "Valorant Competitive Squad",
            description: "Looking for 2 Gold-Platinum players for ranked games tonight",
            game: "Valorant",
            date: "April 2, 2026",
            time: "7:00PM",
            locationName: "Halifax Central Library",
            host: "Gabriel",
            skillLevel: "Gold-Plat",
            latitude: 44.6488,
            longitude: -63.5752,
        },

        {
            id: "2",
            title: "Smash Ultimate Casuals",
            description: "Bring your own controller for some friendly matches",
            game: "Super Smash Bros. Ultimate",
            date: "March 20, 2026",
            time: "3:00PM",
            locationName: "Dal Student Union Building",
            host: "Jeff",
            skillLevel: "All skill levels",
            latitude: 44.6376,
            longitude: -63.5912,
        },

        {
            id: "3",
            title: "League of Legends Flex Ranked",
            description: "Looking for top and jungle player for 5 stack queue",
            game: "League of Legends",
            date: "March 30, 2026",
            time: "9:00PM",
            locationName: "Spring Garden Road",
            host: "Faker",
            skillLevel: "Silver-Gold",
            latitude: 44.6428,
            longitude: -63.5802,
        },

        {
            id: "4",
            title: "Minecraft Build Competition",
            description: "Small building competition for a survival base",
            game: "Minecraft",
            date: "March 15, 2026",
            time: "4:00PM",
            locationName: "Point Pleasant Park",
            host: "Jason",
            skillLevel: "Beginner Friendly",
            latitude: 44.6295,
            longitude: -63.5652,
        }
    ]

    useEffect(() => {
        async function getLocation(){
            const {status} = await Location.requestForegroundPermissionsAsync();
            if(status !== "granted"){
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const coords = location.coords;

            setUserLocation(coords);
            setRegion({
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        }

        getLocation();
    }, []);

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Nearby Events</Text>
            <Button title="Back" onPress={() => navigation.goBack()}/>

            <MapView style={styles.map} region={region}>
                {userLocation && (
                    <Marker
                        coordinate={{
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                        }}
                        title="You are here"
                    />
                )}

                {sampleEvents.map((event) =>(
                    <Marker
                            key={event.id}
                            coordinate={{
                                latitude: event.latitude,
                                longitude: event.longitude,
                            }}
                            title={event.title}
                            description={event.description}
                            onPress={() => setSelectedEvent(event)}
                        />
                ))}
            </MapView>

                {selectedEvent && (
                    <View style={styles.eventCard}>
                        <Text style={styles.eventTitle}>{selectedEvent.title}</Text>
                        <Text>{selectedEvent.description}</Text>
                        <Text>Game: {selectedEvent.game}</Text>
                        <Text>Date: {selectedEvent.date}</Text>
                        <Text>Time: {selectedEvent.time}</Text>
                        <Text>Location: {selectedEvent.locationName}</Text>
                        <Text>Host: {selectedEvent.host}</Text>
                        <Text>Skill Level: {selectedEvent.skillLevel}</Text>
                        <Button title="Close" onPress={() => setSelectedEvent(null)}/>
                    </View>
                )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    title: {
        fontSize: 20,
        fontWeight: "bold",
        padding: 12,
    },

    map: {
        flex: 1,
    },

    eventCard: {
        padding: 12,
        backgroundColor: "white",
        margin: 10,
        borderRadius: 10,
    },

    eventTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
    },
});
