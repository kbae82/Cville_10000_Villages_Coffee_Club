import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

//Document ->  https://firebase.google.com/docs/web/setup
const firebaseApp = firebase.initializeApp({});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const root_auth = firebase.auth();
export { db, auth, root_auth };
