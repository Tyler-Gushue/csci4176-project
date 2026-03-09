
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

export async function addPost(title, description) {
  return addDoc(collection(db, DB_POSTS_NAME), {
    title: title,
    description: description,
    // user: user.uid,
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
