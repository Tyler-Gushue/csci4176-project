import { useNavigation } from "@react-navigation/native";
import React, {useState} from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { addPost } from '../DbUtil.js';
import { Dropdown } from 'react-native-element-dropdown';

//screen to create new post
export function PostScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [game, setGame] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");

  //send to firebase
  const submit = async () => {
    await addPost(name, description, type, location, game);
  };

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
      setLocation("");
    });
  };

  return (
    <View style={ styles.container }>
      <View style={ styles.cardView }>
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

          <TextInput
            style={styles.postInput}
            placeholder="Game"
            placeholderTextColor="#67beff"
            value={ game }
            onChangeText={ setGame }
          />

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
            value={location}
            onChange={item => {
              setLocation(item.value);
            }}
          />

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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b4dafb',
  },
  cardView: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    margin: 10,
    marginTop: (Platform.OS != 'web') ? '15%' : 0,
    borderRadius: 10,
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
});
