import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput, Button, FlatList, TouchableOpacity} from 'react-native';
import { useNavigation } from "@react-navigation/native";


export function Login() {
  const navigation = useNavigation();

    return (

        <View style={styles.container}>
            <View style={styles.loginContainer}>
                <Text style={styles.loginHeader}>Login</Text>
                <TextInput
                  style={styles.loginInput}
                  placeholder="Username"
                  placeholderTextColor='#67beff'
                />
                <TextInput
                  style={styles.loginInput}
                  placeholder="Password"
                  keyboardType="password"
                  placeholderTextColor='#67beff'
                />
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => console.log('Pressed!')}
                >
                    <Text style={styles.loginText}>Login</Text>
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
