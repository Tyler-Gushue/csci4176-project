import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput, Button, FlatList, TouchableOpacity} from 'react-native';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { useNavigation } from "@react-navigation/native";

const TESTING_DO_NOT_VALIDATE = true;

export function Signup() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassowrd, setConfirmPassword] = useState("");
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[!@#$%^&*]).{12,}$/;

  const validateForm = () => {
    if (TESTING_DO_NOT_VALIDATE) {
      registerUser();
      return;
    }

    if (email == "" || username == "" || password == "" || confirmPassowrd == "") {

      console.log("error");
      return;

    }

    if (!passwordRegex.test(password)) {

      console.log("error");
      return;

    }

    if (password != confirmPassowrd) {

      console.log("error");
      return;

    }

    registerUser();


  }

  const registerUser = async () => {

    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;


      await setDoc(doc(db, "users", user.uid), {
        email: email,
        username: username,
        createdAt: new Date(),
      });

      console.log("User registered and added to Firestore with ID:", user.uid);
    }

    catch (error) {

      console.error("Error during registration:", error.code, error.message);

    }

    navigation.navigate("Home");

  }



  return (

    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.loginHeader}>Sign Up</Text>
        <TextInput
          style={styles.loginInput}
          placeholder="Email"
          placeholderTextColor='#67beff'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          style={styles.loginInput}
          placeholder="Username"
          placeholderTextColor='#67beff'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextInput
          style={styles.loginInput}
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor='#67beff'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextInput
          style={styles.loginInput}
          placeholder="Confirm Password"
          secureTextEntry={true}
          placeholderTextColor='#67beff'
          value={confirmPassowrd}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <TouchableOpacity
          style={styles.loginButton}
          onPress={validateForm}
        >
          <Text style={styles.loginText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>

  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cfe2f3',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#90caff'
  },

  loginContainer: {
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b4dafb',
    borderWidth: 1,
    borderColor: '#67beff',
    borderRadius: 10,
    padding: 30
  },

  loginHeader: {
    color: '#67beff',
    fontWeight: 'bold',
    fontSize: 40,
    marginBottom: 15
  },

  loginInput: {
    color: '#67beff',
    backgroundColor: '#cfe2f3',
    borderWidth: 1,
    borderColor: '#67beff',
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
