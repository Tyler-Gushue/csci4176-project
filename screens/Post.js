import { useNavigation } from "@react-navigation/native";
import React, {useState, useRef} from 'react';
import { View, StyleSheet, Text, Button, TextInput, TouchableOpacity, Platform } from 'react-native';
import { addPost } from '../DbUtil.js';
import { Dropdown } from 'react-native-element-dropdown';

export function PostScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [game, setGame] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");


  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const gameRef = useRef(null);


  const submit = async () => {
    await addPost(name, description, type, location, game);
  }

  const validateForm = () => {
    const checkField = (ref) => {
      if (ref.current && ref.current.value != null &&  ref.current.value.length == 0) {
        ref.current.style.borderColor = '#ff0000';
        ref.current.style.color = '#ff0000';
        return false;
      }

      return true;
    }

    if (!checkField(titleRef)) {
      return;
    }

    if (!checkField(descriptionRef)) {
      return;
    }

    // if (!checkField(gameRef)) {
    //   return;
    // }

    submit().then(() => {
      navigation.navigate('Home');

      setName("");
      setDescription("");
    });
  }

  return (
    <View style={ styles.container }>
      <View style={ styles.cardView }>
        <Text style={styles.title}>Make a Post</Text>
        <View style={styles.form}>


          <TextInput
            style={styles.postInput}
            placeholder="Title"
            placeholderTextColor="#67beff"
            ref={ titleRef }
            value={ name }
            onChangeText={ setName }
          />

          <TextInput
            style={styles.postInput}
            placeholder="Description"
            placeholderTextColor="#67beff"
            ref={ descriptionRef }
            value={ description }
            onChangeText={ setDescription }
          />

          <TextInput
            style={styles.postInput}
            placeholder="Game"
            placeholderTextColor="#67beff"
            ref={ gameRef }
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
            onPress={() => { validateForm(); }}
          >
            <Text style={styles.buttonText}>Post</Text>
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
    marginTop: (Platform.OS != 'web') ? '15%' : '',
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
});
