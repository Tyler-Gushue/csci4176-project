import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity, Platform} from "react-native";
import MapView, {Marker} from "react-native-maps";
import * as Location from "expo-location";
import { fetchEvents } from "../DbUtil";

// Screen to display events on a map
export function MapScreen(){
    const [region, setRegion] = useState({
        //somewhere Downtown Halifax
        latitude: 44.6488,
        longitude: -63.5752,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });


    const [userLocation, setUserLocation] = useState(null); // user location
    const [selectedEvent, setSelectedEvent] = useState(null); // event on marker
    const [events, setEvents] = useState([]); //events from firebase

    //load device location and event data when screen opens
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
            // fetch events from firebase
            const eventData = await fetchEvents();
            setEvents(eventData.filter((event) => event.latitude != null && event.longitude != null)
            .map((event) => ({
                ...event,
                latitude: Number(event.latitude),
                longitude: Number(event.longitude),
            }))
        );
        }

        loadMapData();
    }, []);

    return(
        <View style={styles.container}>
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
                            pinColor='#67beff'
                            title={event.title}
                            description={event.description}
                            onPress={() => setSelectedEvent(event)}
                        />
                ))}
            </MapView>
                //event details card when marker is clicked
                {selectedEvent && (
                    <View style={styles.eventCard}>
                        <Text style={styles.eventTitle}>{selectedEvent.title}</Text>
                        <Text style={styles.eventText}>{selectedEvent.description}</Text>
                        <Text style={styles.eventText}>Game: {selectedEvent.game}</Text>
                        <Text style={styles.eventText}>Date: {selectedEvent.date}</Text>
                        <Text style={styles.eventText}>Time: {selectedEvent.time}</Text>
                        <Text style={styles.eventText}>Location: {selectedEvent.locationName}</Text>
                        <Text style={styles.eventText}>Host: {selectedEvent.host}</Text>
                        <Text style={styles.eventText}>Skill Level: {selectedEvent.skillLevel}</Text>
                        <TouchableOpacity
                            style={ styles.button }
                            onPress={() => setSelectedEvent(null)}
                        >
                            <Text style={ styles.buttonText }>Close</Text>
                        </TouchableOpacity>
                    </View>
                )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#b4dafb',
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
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
    },

    eventTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
        color: '#67beff'
    },

    eventText: {
        color: '#67beff'
    },

    button: {
        backgroundColor: '#67beff',
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: '#67beff',
        borderRadius: 10,
        marginTop: 15,
        padding: 5,
    },
    buttonText: {
        fontSize: 15,
        color: '#fff'
    },
    cardView: {
        padding: 20,
        backgroundColor: 'white',
        margin: 10,
        marginTop: (Platform.OS != 'web') ? '15%' : 0,
        borderRadius: 10
    },
});
