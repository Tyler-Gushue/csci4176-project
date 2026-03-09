import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, Button} from "react-native";
import MapView, {Marker} from "react-native-maps";
import * as Location from "expo-location";

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
    const sampleEvents = [
        {
            id: "1",
            title: "LAN Party",
            description: "Casual Meetup",
            latitude: 44.6534,
            longitude: -63.5362,
        },

        {
            id: "2",
            title: "Raid Night",
            description: "Dungeon Event",
            latitude: 44.642,
            longitude: -63.5496,
        },
    ];

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
                        <Button title="close" onPress={() => setSelectedEvent(null)}/>
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
