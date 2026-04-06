import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import {signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';


export function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigation = useNavigation();

  // Check if the user is already logged in and redirect if true
  useEffect(() => {
    const check = auth.onAuthStateChanged((user) => {
      if(user != null){
        navigation.navigate('Home');
      }
    });
    return check;
  }, []);

  /**
   * Function that logs in a user
   * @returns - return only happens if an error occurs
   */
  const handleLogin = async () => {

    // checks to see if all form data is filled
    if (email == "" || password == "") {

      setError("Email/Password is Required");
      return;

    }

    try {

          const userCredential = await signInWithEmailAndPassword(auth, email, password); // attemps to log in user
          const user = userCredential.user; // gets user's credentials

          await AsyncStorage.setItem('userID', user.uid); // saves user ID for session persistance
          navigation.navigate('Home'); // navigates to the home page

      }
      catch (error) {

        setError("Incorrect Email/Password");

      }

  }

    return (

        <View style={styles.container}>
            <View style={styles.loginContainer}>
                <Text style={styles.loginHeader}>Login</Text>
                <TextInput
                  style={[styles.loginInput, error ? { borderColor: '#ff5252'} : null]}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor='#67beff'
                />
                <TextInput
                  style={[styles.loginInput, error ? { borderColor: '#ff5252'} : null]}
                  placeholder="Password"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor='#67beff'
                />
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Signup')}
                >
                  <Text style={styles.signUpText}>Sign Up?</Text>
                </TouchableOpacity>
                <Text style={styles.errorMsg}>{error}</Text>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b4dafb',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginContainer: {
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
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
    color: '#fff'
  },

  signUpText: {
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
