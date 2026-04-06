
import { db, auth } from './screens/firebaseConfig.js';
import { doc, addDoc, getDoc, getDocs, query, collection, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const DB_POSTS_NAME = "posts"
const DB_USERS_NAME = "users"
const DB_EVENTS_NAME = "events";

export async function fetchPosts() {
  const q = query(collection(db, DB_POSTS_NAME));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
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

export async function applyToPost(postId, message){
  const userID = await AsyncStorage.getItem('userID');
  if(!userID){
    return;
  }

  const userSnap = await getDoc(doc(db, DB_USERS_NAME, userID));
  const userData = userSnap.data();
  const application = {
    userId: userID,
    username: userData?.username || "Unknown",
    profileImage: userData?.profileImage || null,
    message: message,
  };

  const postRef = doc(db, DB_POSTS_NAME, postId);
  await updateDoc(postRef, {
    pendingParticipants: arrayUnion(application),
  });

  return application;
}

export async function acceptParticipant(postId, application){
    const postRef = doc(db, DB_POSTS_NAME, postId);
    const postSnap = await getDoc(postRef);
    const postData = postSnap.data();
    const updatePending = (postData.pendingParticipants || []).filter((app) => app.userId !== application.userId);
    const updateAccepted = [...(postData.acceptedParticipants || []), application];

    await updateDoc(postRef, {
      pendingParticipants: updatePending,
      acceptedParticipants: updateAccepted,
    });
  }

export async function declineParticipant(postId, application){
    const postRef = doc(db, DB_POSTS_NAME, postId);
    const postSnap = await getDoc(postRef);
    const postData = postSnap.data();
    const updatePending = (postData.pendingParticipants || []).filter((app) => app.userId !== application.userId);

    await updateDoc(postRef, {
      pendingParticipants: updatePending,
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

export async function fetchPostById(postId){
  const postRef = doc(db, DB_POSTS_NAME, postId);
  const postSnap = await getDoc(postRef);

  if(!postSnap.exists()){
    return null;
  }

  return{
    id:postSnap.id,
    ...postSnap.data(),
  };
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
