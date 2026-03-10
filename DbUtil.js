
import { db } from './screens/firebaseConfig.js';

import { doc, setDoc, addDoc, getDoc, getDocs, query, collection } from "firebase/firestore";
import { ref, push } from "firebase/database";
import { auth } from './screens/firebaseConfig.js';

import AsyncStorage from '@react-native-async-storage/async-storage';
const DB_POSTS_NAME = "posts"
const DB_USERS_NAME = "users"

const DB_EVENTS_NAME = "events";

export async function fetchPosts() {
  const q = query(collection(db, DB_POSTS_NAME));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((v) => v.data());
}

/**
 * Creates a new post
 * @param {title of post} title 
 * @param {description of post} description 
 * @param {type of post competitive/casual} type 
 * @param {location of post online/in-person} location 
 * @param {game of the post} game 
 * @returns 
 */
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

/**
 * function for getting all events
 * @returns 
 */
export async function fetchEvents() {
  const q = query(collection(db, DB_EVENTS_NAME));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * function for adding an event
 * @param {event being added} event 
 * @returns 
 */
export async function addEvent(event){
  return addDoc(collection(db, DB_EVENTS_NAME), {
    ...event,
    createdAt: new Date(),
  });
}


/*
 * User helpers
 */

export async function fetchUserProfile(data) {
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
