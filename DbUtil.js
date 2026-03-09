
import { db } from './screens/firebaseConfig.js';

import { doc, setDoc, addDoc, getDoc, getDocs, query, collection } from "firebase/firestore";
import { ref, push } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';

const DB_POSTS_NAME = "posts"

export async function fetchPosts() {
  const q = query(collection(db, DB_POSTS_NAME));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((v) => v.data());
}

export async function addPost(title, description, type, location, game) {

  const userID = await AsyncStorage.getItem('userID');

  return addDoc(collection(db, DB_POSTS_NAME), {
    title: title,
    description: description,
    createdAt: new Date(),
    type: type,
    location: location,
    game: game,
    ownerID: userID,
    pendingParticipants: [],
    acceptedParticipants: []
  });
}
