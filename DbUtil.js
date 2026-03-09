
import { db } from './screens/firebaseConfig.js';

import { doc, setDoc, addDoc, getDoc, getDocs, query, collection } from "firebase/firestore";
import { ref, push } from "firebase/database";

const DB_POSTS_NAME = "posts"
const DB_EVENTS_NAME = "events";

export async function fetchPosts() {
  const q = query(collection(db, DB_POSTS_NAME));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((v) => v.data());
}

export async function addPost(title, description) {
  return addDoc(collection(db, DB_POSTS_NAME), {
    title: title,
    description: description,
    // user: user.uid,
    createdAt: new Date(),
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
