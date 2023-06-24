import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/storage';

/* 
Initialize Firebase
After changing thhe credentials change the filename firebase-example.js to firebase.js
*/
const firebaseConfig = {
    apiKey: "GET IS INFO FROM FIREBASE CONSOLE",
    authDomain: "GET IS INFO FROM FIREBASE CONSOLE",
    databaseURL: "GET IS INFO FROM FIREBASE CONSOLE",
    projectId: "GET IS INFO FROM FIREBASE CONSOLE",
    storageBucket: "GET IS INFO FROM FIREBASE CONSOLE",
    messagingSenderId: "GET IS INFO FROM FIREBASE CONSOLE",
    appId: "GET IS INFO FROM FIREBASE CONSOLE",
    measurementId: ""
};

const app = firebase.initializeApp(firebaseConfig);

const db = app.database();
const firestore = app.storage();
export { db, firestore }