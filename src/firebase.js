import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyA5xcAvrHfghqT8Cq66RL3FFM-UQe2icwQ",
    authDomain: "chat-app-012.firebaseapp.com",
    databaseURL: "https://chat-app-012.firebaseio.com",
    projectId: "chat-app-012",
    storageBucket: "chat-app-012.appspot.com",
    messagingSenderId: "459384007516"
 };

const initializeFirebase = () => firebase.initializeApp(config);

export default initializeFirebase;
