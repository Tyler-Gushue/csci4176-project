
import { db, auth } from './firebaseConfig.js';
import { doc, addDoc, getDoc, getDocs, query, collection } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const DB_POSTS_NAME = "posts"
const DB_USERS_NAME = "users"
const DB_EVENTS_NAME = "events";

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
    createdAt: Date.now(),
    type: type,
    location: location,
    game: game,
    ownerID: userID,
    pendingParticipants: [],
    acceptedParticipants: []
  });
}

export async function fetchEvents() {
  const q = query(collection(db, DB_EVENTS_NAME));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function addEvent(event){
  return addDoc(collection(db, DB_EVENTS_NAME), {
    ...event,
    createdAt: new Date(),
  });
}


/*
 * User helpers
 */

export async function fetchUserProfile() {
  if (auth.currentUser == null) {
    return null;
  }

  const q = query(doc(db, DB_USERS_NAME, auth.currentUser.uid));
  return (await getDoc(q)).data();
}


export async function fetchUserFromId(userId) {
  const q = query(doc(db, DB_USERS_NAME, userId));
  return (await getDoc(q)).data();
}
