import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyCchEw-N7rwXm9pD1nMdXS2zMWTbdDnPPA",
  authDomain: "chatapp-c0919.firebaseapp.com",
  databaseURL: "https://chatapp-c0919.firebaseio.com",
  projectId: "chatapp-c0919",
  storageBucket: "chatapp-c0919.appspot.com",
  messagingSenderId: "314468637622",
  appId: "1:314468637622:web:095d03973cd3e707"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;