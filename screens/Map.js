import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, Button} from "react-native";
import MapView, {Marker} from "react-native-maps";
import * as Location from "expo-location";
import { fetchEvents } from "../DbUtil";

export function MapScreen(){
    const [region, setRegion] = useState({
        //somewhere Downtown Halifax
        latitude: 44.6488,
        longitude: -63.5752,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    const [userLocation, setUserLocation] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function loadMapData() {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if(status === "granted"){
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

            const eventData = await fetchEvents();
            setEvents(eventData);
        }

        loadMapData();
    }, []);

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Nearby Events</Text>

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

                {events.map((event) =>(
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
