
import { db, user } from './screens/firebaseConfig.js';

import { doc, setDoc, getDoc, getDocs, query, collection } from "firebase/firestore";

const DB_POSTS_NAME = "posts"

export async function fetchPosts() {
  const q = query(collection(db, DB_POSTS_NAME));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((v) => v.data());
}
