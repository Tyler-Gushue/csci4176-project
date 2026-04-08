import { useNavigation } from "@react-navigation/native";
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import MapView, {Marker} from "react-native-maps";
import { View, StyleSheet, Text, FlatList, TextInput, TouchableOpacity, ScrollView,  Platform } from 'react-native';
import { addPost } from '../DbUtil.js';
import { Dropdown } from 'react-native-element-dropdown';
import { steamSearch } from '../SteamAPI';

//screen to create new post
export function PostScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [game, setGame] = useState("");
  const [type, setType] = useState("");
  const [locationType, setLocationType] = useState("");
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState(null);

  let timeout = null;

  const [gameSuggestions, setGameSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);



  // Submits a new post to the database
  const submit = async () => {

    if (coords) {

      await addPost(name, description, type, locationType, game, coords.latitude, coords.longitude);

    } else {

      await addPost(name, description, type, locationType, game, null, null);

    }

  };

    /// Searches for game recommendations using the SteamAPI
  const searchForGame = async (value) => {
    if (value.length > 2) {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        steamSearch(value).then((games) => {
          setGameSuggestions(games);
          setShowSuggestions(true);
        });
      }, 400);
    }

    setGame(value);
  }

  //check for empty inputs
  const validateForm = () => {

    if(name.trim() === "" || description.trim() === ""){
      return;
    }



    submit().then(() => {
      navigation.navigate('Home');
      setName("");
      setDescription("")
      setGame("");
      setType("");
      setLocationType("");
    });
  };

  useEffect(() => {
      (async () => {
        // Request permissions for locations
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let locationResult = await Location.getCurrentPositionAsync({});
      setCoords(locationResult.coords);
    })();
  }, []);


  /// Container for a game suggestion (more general than that, but only used for game suggestions so far)
  function Suggestion({ name }) {
    return (
      <View style={{padding: 10, borderColor: '#67beff', borderWidth: 1, borderRadius: 5}}>
        <Text onPress={() => { setGame(name); setShowSuggestions(false) }}>
          {name}
        </Text>
      </View>
    );
  }

  return (
    <View style={ styles.container }>
      <ScrollView
        style={styles.scrollViewBase}
        contentContainerStyle={styles.cardView}
      >
        <Text style={styles.title}>Make a Post</Text>
        <View style={styles.form}>

          <TextInput
            style={styles.postInput}
            placeholder="Title"
            placeholderTextColor="#67beff"
            value={ name }
            onChangeText={ setName }
          />

          <TextInput
            style={styles.postInput}
            placeholder="Description"
            placeholderTextColor="#67beff"
            value={ description }
            onChangeText={ setDescription }
          />

          <View style={{marginBottom: 10}}>
            <TextInput
              style={styles.gameInput}
              placeholder="Game"
              placeholderTextColor="#67beff"
              value={game}
              onChangeText={searchForGame}
              onFocus={() => {
                if (game && game.length > 2) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => {
              }}
            />
            {showSuggestions && <FlatList
              data={gameSuggestions}
              style={{
                maxHeight: 200
              }}
              renderItem={({ item }) => <Suggestion name={ item } />}
            />}
          </View>

          <Dropdown
            style={styles.postInput}

            placeholderStyle={{ color: '#67beff', fontSize: 15 }}
            selectedTextStyle={{ color: '#67beff', fontSize: 15 }}

            data={[
              { label: 'Competitive', value: 'Competitive' },
              { label: 'Casual', value: 'Casual' }
            ]}

            labelField="label"
            valueField="value"
            placeholder="Select Type"
            value={type}
            onChange={item => {
              setType(item.value);
            }}
          />

          <Dropdown
            style={styles.postInput}

            placeholderStyle={{ color: '#67beff', fontSize: 15 }}
            selectedTextStyle={{ color: '#67beff', fontSize: 15 }}

            data={[
              { label: 'Online', value: 'Online' },
              { label: 'In-person', value: 'In-person' }
            ]}

            labelField="label"
            valueField="value"
            placeholder="Select Location"
            value={locationType}
            onChange={item => {
              setLocationType(item.value);
            }}
          />

          { locationType === "In-person" && coords ? (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                onPress={
                  (e) => {

                    const clickedCoords = e.nativeEvent.coordinate;
                    setCoords(clickedCoords);

                  }
                }
              >
                <Marker
                  coordinate={coords}
                  title="Meeting Spot"
                  description="Tap elsewhere to move"
                  pinColor='#67beff'
                />
              </MapView>
            </View>
          ) : null }

          <TouchableOpacity
            style={styles.button}
            onPress={validateForm}
          >
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cornerButton}
          onPress={() => navigation.navigate("MyPosts")}
          >
          <Text style={styles.buttonText}>My Posts</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b4dafb',
  },
  scrollViewBase: {
    flex: 1,
    margin: 10,
    marginTop: (Platform.OS != 'web') ? '15%' : 0,
  },
  cardView: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    margin: 10,
    marginTop: (Platform.OS != 'web') ? '15%' : 0,
    borderRadius: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 40,
    color: '#67beff',
    paddingBottom: 20,
    fontWeight: '600',
  },
  form: {
    flex: 1,
    width: '100%'
  },
  postInput: {
    borderWidth: 1,
    width: '100%',
    borderRadius: 10,
    borderColor: '#67beff',
    color: '#67beff',
    fontSize: 15,
    padding: 10,
    marginBottom: 10
  },
  gameInput: {
    borderWidth: 1,
    width: '100%',
    borderRadius: 10,
    borderColor: '#67beff',
    color: '#67beff',
    fontSize: 15,
    padding: 10
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

  cornerButton:{
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#67beff",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
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
