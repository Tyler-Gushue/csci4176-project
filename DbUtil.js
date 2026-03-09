
import { db } from './screens/firebaseConfig.js';

import { doc, setDoc, addDoc, getDoc, getDocs, query, collection } from "firebase/firestore";
import { ref, push } from "firebase/database";
import { auth } from './screens/firebaseConfig.js';

const DB_POSTS_NAME = "posts"
const DB_USERS_NAME = "users"

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



export async function fetchUserProfile(data) {
  if (auth.currentUser == null) {
    return null;
  }

  const q = query(doc(db, DB_USERS_NAME, auth.currentUser.uid));
  return (await getDoc(q)).data();
}
