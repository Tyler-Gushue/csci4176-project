
import { db, auth } from './screens/firebaseConfig.js';
import { doc, addDoc, getDoc, getDocs, query, collection, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const DB_POSTS_NAME = "posts"
const DB_USERS_NAME = "users"
const DB_EVENTS_NAME = "events";

/**
 * Fetch a feed from the database (all posts)
 */
export async function fetchPosts() {
    const q = query(collection(db, DB_POSTS_NAME));
    const snapshot = await getDocs(q);

    const posts = snapshot.docs.filter((post) => !post.data().isDeleted);

    return posts.map((docSnap) => ({
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
export async function addPost(title, description, type, location, game, lat, long) {

  const userID = await AsyncStorage.getItem('userID');

  return addDoc(collection(db, DB_POSTS_NAME), {
    title: title,
    description: description,
    createdAt: Date.now(),
    type: type,
    location: location,
    game: game,
    ownerID: userID,
    lat: lat,
    long: long,
    pendingParticipants: [],
    acceptedParticipants: []
  });
}

/**
 * Apply to join a new post
 * @param {*} postId
 * @param {*} message
 * @returns
 */
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

/**
 * Delete a post (sets it as deleted and will not be shown to the user)
 * @param {*} postId
 * @returns
 */
export async function deletePost(postId) {

    const userId = await AsyncStorage.getItem('userID');
    if (!userId) {
      return;
    }

    // Query a user to make sure that the user deleting is the owner
    const q = doc(db, DB_POSTS_NAME, postId);

    const post = (await getDoc(q)).data();

    // If there is no post that exists, return an error
    if (!post) {
        throw new Error("Invalid post id");
    }

    // If the owner does not match
    if (post['ownerID'] !== userId) {
        throw new Error("Insufficient permissions");
    }

    // Update the post
    return await updateDoc(q, {
        isDeleted: true
    });
}


/**
 * Accepts a participant to join a post
 */
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



/**
 * Declines a participant from a post
 */
export async function declineParticipant(postId, application){
    const postRef = doc(db, DB_POSTS_NAME, postId);
    const postSnap = await getDoc(postRef);
    const postData = postSnap.data();
    const updatePending = (postData.pendingParticipants || []).filter((app) => app.userId !== application.userId);

    await updateDoc(postRef, {
      pendingParticipants: updatePending,
    });
}

/**
 * Fetch all events from the database
 * (no longer used)
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
 * Fetches a post from the database given the id
 */
export async function fetchPostById(postId){
    const postRef = doc(db, DB_POSTS_NAME, postId);
    const postSnap = await getDoc(postRef);


    if (!postSnap.exists()) {
        return null;
    }

    if (!postSnap.isDeleted) {
        return null;
    }

    return{
        id:postSnap.id,
        ...postSnap.data(),
    };
}

/**
 * Add an event to the database
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


/**
 * Fetch the profile of the logged in user
 */
export async function fetchUserProfile() {
  if (auth.currentUser == null) {
    return null;
  }

  const q = query(doc(db, DB_USERS_NAME, auth.currentUser.uid));
  return (await getDoc(q)).data();
}


/**
 * Fetch the profile of a user given the id
 */
export async function fetchUserFromId(userId) {
  const q = query(doc(db, DB_USERS_NAME, userId));
  return (await getDoc(q)).data();
}

/*
 * Map functions
 */


/**
 * Get a geolocation address from latitude and longitude
 */
export const getAddressFromCoords = async (lat, long) => {

  try {
    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: long
    });

    if (reverseGeocode.length > 0) {
      const address = reverseGeocode[0];

      const name = address.name || address.street;

      return name;
    }
    return "Location found, but address unavailable";
  } catch (error) {
    console.error("Geocoding Error:", error);
    return "Error retrieving address";
  }

};
