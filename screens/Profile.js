import React, {useState, useEffect, useRef} from 'react';
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Text, Button, Image, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert } from 'react-native';


export function ProfileScreen() {
  const [image, setImage] = useState(require('../Images/NoProfileImg.webp'));

  const navigation = useNavigation();
  let cameraRef = useRef();

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

  const takePhoto = async () => {

    const permission = await Camera.requestCameraPermissionsAsync();

    if (!permission.status === "granted") {

      Alert.alert(
        "Permission Denied",
        "Camera access is required."
      )
      return;

    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
    });

    setImage({ uri: result.assets[0].uri });

  }

  const uploadPhoto = () => {

  }

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
              source={image}
            />
            <View style={ styles.editIconContainer }>
              <MaterialCommunityIcons name="pencil" size={18} color="#67beff" />
            </View>
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
    backgroundColor: '#cfe2f3',
    padding: 20,
    margin: 10,
    marginTop: '12%',
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
  button: {
    backgroundColor: '#67beff',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#67beff',
    borderRadius: 10,
    marginTop: 5,
    padding: 5,
  },
  buttonText: {
    fontSize: 15,
    color: '#cfe2f3'
  },
});
