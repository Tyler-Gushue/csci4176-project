import { useNavigation } from "@react-navigation/native";

import React, {useState, useRef} from 'react';



import { View, StyleSheet, Text, Button, TextInput, TouchableOpacity } from 'react-native';

import { addPost } from '../DbUtil.js';


export function PostScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");


  const titleRef = useRef(null);
  const descriptionRef = useRef(null);


  const submit = async () => {
    await addPost(name, description);
  }

  const validateForm = () => {
    const checkField = (ref) => {
      if (ref.current && ref.current.value.length == 0) {
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

    submit().then(() => {
      console.log("Post submitted!");

      setName("");
      setDescription("");
    });
  }

  return (
    <View style={ styles.cardView }>
      <Text style={styles.title}>Make a Post</Text>
      <View style={ {display: 'flex', flexDirection: 'column', gap: '20px'} }>


        <TextInput

          style={styles.postInput}
          placeholder="Title"
          ref={ titleRef }
          value={ name }
          onChange={(e) => setName(e.target.value)}
        />

        <TextInput
          style={styles.postInput}
          placeholder="Description"
          ref={ descriptionRef }
          value={ description }
          onChange={(e) => setDescription(e.target.value)}
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => { validateForm(); }}
        >
          <Text style={styles.loginText}>Post</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardView: {
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 650,
    paddingBottom: 20,
  },
  postInput: {
    borderWidth: 1,
    width: '100%',
    borderRadius: 10,
    fontSize: 15,
    padding: 10,
    marginBottom: 10
  },
  loginButton: {
    backgroundColor: '#67beff',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#67beff',
    borderRadius: 10,
    marginTop: 15,
    padding: 5,
  },
  loginText: {
    fontSize: 15,
    color: '#cfe2f3'
  }
});
