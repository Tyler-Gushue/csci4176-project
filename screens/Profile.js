import React, {useState, useEffect, useRef} from 'react';
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Text, Button, TextInput, Image, TouchableOpacity, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signOut } from "firebase/auth";

import { fetchUserProfile } from '../DbUtil';


export function ProfileScreen() {
  const [image, setImage] = useState(require('../Images/NoProfileImg.webp'));
  const [showButtons, setShowButtons] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeUsername, setShowChangeUsername] = useState(false);

  const navigation = useNavigation();
  let cameraRef = useRef();

  const [profileData, setProfileData] = useState(null);

  /**
   * Prompts user with options when changing profile photo
   */
  const handleEditProfileImg = () => {

    Alert.alert(
      "Profile Photo",
      "Would you like to change your profile photo?",
      [
        { text: "Take Photo", onPress: takePhoto},
        { text: "Upload Photo", onPress: uploadPhoto},
        { text: "Cancel", onPress: () => console.log("Canceled")}
      ]
    )

  }

  /**
   * function for taking a photo
   * @returns - return only occurs when an error happens
   */
  const takePhoto = async () => {

    const permission = await Camera.requestCameraPermissionsAsync(); // asks for camera permission

    // checks if permission was granted
    if (!permission.status === "granted") {

      Alert.alert(
        "Permission Denied",
        "Camera access is required."
      )
      return;

    }

    // launches camera
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
    });

    if (!result.canceled) {
        setImage({ uri: result.assets[0].uri });
    }

  }

  /**
   * Function that will be used for uploading a photo from library for pfp
   */
  const uploadPhoto = async () => {

      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {

        Alert.alert(
          "Permission Denied",
          "Library access is required."
        )
        return;

      }

      let result = await ImagePicker.launchImageLibraryAsync({

        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        allowsEditing: true, 
        aspect: [1, 1],
        quality: 1,

      });

      if (!result.canceled) {
        setImage({ uri: result.assets[0].uri });
      }
  };

  const uploadToCloudinary = async (uri) => {

    const cloudName = 'dliyhndog';
    const uploadPreset = 'csci4177-project';
    const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    try {

      const data = new FormData();
      data.append('file', {
        uri: uri,
        type: 'image/jpeg',
        name: 'profile_picture.jpg',
      });
      data.append('upload_preset', uploadPreset);

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      
      if (result.secure_url) {
        const imageUrl = result.secure_url;
        console.log("Cloudinary URL:", imageUrl);

        const userId = await AsyncStorage.getItem('userID');
        const db = getFirestore();
        const userDocRef = doc(db, "users", userId);
        
        await updateDoc(userDocRef, {
          pfp: imageUrl
        });

        Alert.alert(
          "Success", 
          "Profile picture updated!"
        );

      } else {

        throw new Error("Failed to get URL from Cloudinary");

      }

    } catch (error) {

      console.error("Cloudinary Upload Error:", error);
      Alert.alert("Upload Error", "Could not save image to cloud.");

    }
  };

  const logoutPrompt = () => {

    Alert.alert(
      "Log out",
      "Are you sure you want to logout?",
      [
        { text: "Confirm", onPress: logout},
        { text: "Cancel", onPress: () => console.log("Canceled")}
      ]
    )

  }

  const logout = async () => {

    try {

      const auth = getAuth();
      
      await signOut(auth);

      await AsyncStorage.clear();

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });

    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Logout Failed", "Something went wrong.");
    }

  };

  useEffect(() => {
    if (image.uri) {
      uploadToCloudinary(image.uri);
    }
  }, [image]);

  useEffect(() => {
    fetchUserProfile().then((data) => {
      setProfileData(data);
    });
  }, [image]);

  return (
    <View style={ styles.container }>
      <View style={ styles.cardView }>
        <Text style={ styles.title }>Profile</Text>
        <View>
          <TouchableOpacity
            onPress={handleEditProfileImg}
          >
            <Image
              style={ styles.profileImage }
              source={(profileData != null) ? { uri: profileData.pfp } : image}
            />
            <View style={ styles.editIconContainer }>
              <MaterialCommunityIcons name="pencil" size={18} color="#67beff" />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.settingsText}>{ (profileData != null) ? profileData.username : 'Username' }</Text>
        <Text style={ styles.settingsText }>{ (profileData != null) ? profileData.email : 'Email' }</Text>
          {showButtons && (
            <>
              <View style={ styles.settings}>
                <TouchableOpacity
                  style={ styles.button }
                  onPress={ () => {
                    setShowChangeUsername(true);
                    setShowButtons(false);
                  }}
                >
                  <Text style={ styles.buttonText }>Change Username</Text>
                  <Text style={ styles.buttonArrow }>&gt;</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={ styles.button }
                  onPress={ () => {
                    setShowChangePassword(true);
                    setShowButtons(false);
                  }}
                >
                  <Text style={ styles.buttonText }>Change Password</Text>
                  <Text style={ styles.buttonArrow }>&gt;</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={ styles.logoutButton }
                onPress={logoutPrompt}
              >
                  <Text style={ styles.buttonText }>Log Out</Text>
              </TouchableOpacity>
            </>
          )}
          {showChangePassword && (
            <View style={ styles.settings}>
                <Text style={styles.inputHeader }>Change Password</Text>
                <TextInput
                  style={[ styles.textInput, styles.inputText ]}
                  placeholder="Current Password"
                />
                <TextInput
                  style={[ styles.textInput, styles.inputText ]}
                  placeholder="New Password"
                />
                <TextInput
                  style={[ styles.textInput, styles.inputText ]}
                  placeholder="Confirm Password"
                />
                <TouchableOpacity
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonCancel}
                  onPress={ () => {
                    setShowChangePassword(false);
                    setShowButtons(true);
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
          )}
          {showChangeUsername && (
              <View style={ styles.settings}>
                <Text style={styles.inputHeader }>Change Username</Text>
                <TextInput
                  style={[ styles.textInput, styles.inputText ]}
                  placeholder="New Username"
                />
                <TextInput
                  style={[ styles.textInput, styles.inputText ]}
                  placeholder="Password"
                />
                <TouchableOpacity
                  style={styles.button}
                >
                <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonCancel}
                  onPress={ () => {
                    setShowChangeUsername(false);
                    setShowButtons(true);
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
          )}
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
    fontSize: 50,
    color: '#67beff',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#67beff',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'white',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#67beff',
  },
  settings: {
    width: '90%',
    gap: 10,
    margin: 20,
  },
  settingsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#67beff',
    borderBottomWidth: 2,
    padding: 5
  },
  settingsText: {
    color: '#67beff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#67beff',
    width: '100%',
    borderWidth: 1,
    borderColor: '#67beff',
    borderRadius: 10,
    padding: 12,
  },
  buttonText: {
    fontSize: 15,
    color: '#fff'
  },
  buttonArrow: {
    fontSize: 15,
    color: '#fff',
    marginLeft: 'auto'
  },
  logoutButton: {
    backgroundColor: '#67beff',
    alignItems: 'center',
    width: '90%',
    borderWidth: 1,
    borderColor: '#67beff',
    borderRadius: 10,
    margin: 20,
    marginTop: 'auto',
    padding: 12,
  },
  inputHeader: {
    fontSize: 20,
    marginTop: 15,
    marginBottom: 10,
    color: '#67beff'
  },
  textInput: {
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
  inputText: {
    fontSize: 15,
    color: '#67beff'
  },
  buttonCancel: {
    flexDirection: 'row',
    backgroundColor: '#989e99',
    width: '100%',
    borderWidth: 1,
    borderColor: '#989e99',
    borderRadius: 10,
    padding: 12,
  }
});
