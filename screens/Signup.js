import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput, Button, FlatList, TouchableOpacity} from 'react-native';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export function Signup() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassowrd, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[!@#$%^&*]).{6,}$/;

  const validateForm = () => {
    if (email == "" || username == "" || password == "" || confirmPassowrd == "") {

      setError("All fields must be set")
      return;

    }

    if (!passwordRegex.test(password)) {

      setError("Password must have ONE number , ONE uppercase & lower letter, and ONE special character.")
      return;

    }

    if (password != confirmPassowrd) {

      setError("Passwords must match")
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

      await AsyncStorage.setItem('userID', user.uid);

      navigation.navigate("Home");

    }

    catch (error) {

      if (error.code == "auth/email-already-in-use") {

        setError("Email already in use");

      }
      else if (error.code == "invalid-email") {

        setError("Invalid email");

      }
      else {
        setError("Error during sign up")
      }

    }

  }



  return (

    <View style={styles.container}>
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpHeader}>Sign Up</Text>
        <TextInput
          style={[styles.signUpInput, error ? { borderColor: '#ff5252'} : null]}
          placeholder="Email"
          placeholderTextColor='#67beff'
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[styles.signUpInput, error ? { borderColor: '#ff5252'} : null]}
          placeholder="Username"
          placeholderTextColor='#67beff'
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={[styles.signUpInput, error ? { borderColor: '#ff5252'} : null]}
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor='#67beff'
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={[styles.signUpInput, error ? { borderColor: '#ff5252'} : null]}
          placeholder="Confirm Password"
          secureTextEntry={true}
          placeholderTextColor='#67beff'
          value={confirmPassowrd}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={validateForm}
        >
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>Login?</Text>
        </TouchableOpacity>
        <Text style={styles.errorMsg}>{error}</Text>
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

  signUpContainer: {
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b4dafb',
    borderWidth: 1,
    borderColor: '#67beff',
    borderRadius: 10,
    padding: 30
  },

  signUpHeader: {
    color: '#67beff',
    fontWeight: 'bold',
    fontSize: 40,
    marginBottom: 15
  },

  signUpInput: {
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

  signUpButton: {
    backgroundColor: '#67beff',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#67beff',
    borderRadius: 10,
    marginTop: 15,
    padding: 5,
  },

  signUpText: {
    fontSize: 15,
    color: '#cfe2f3'
  },

  loginText: {
    fontSize: 15,
    color: '#67beff',
    marginTop: 10
  },

  errorMsg: {
    fontSize: 15,
    marginTop: 10,
    color: '#ff5252'
  }

});
