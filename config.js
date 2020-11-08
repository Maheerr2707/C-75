import * as firebase from 'firebase'
require("@firebase/firestore")

var firebaseConfig = {
    apiKey: "AIzaSyCJot0QBgm3zAFOEQ7SaBcv0tsGVjonNuA",
    authDomain: "willy-e7006.firebaseapp.com",
    databaseURL: "https://willy-e7006.firebaseio.com",
    projectId: "willy-e7006",
    storageBucket: "willy-e7006.appspot.com",
    messagingSenderId: "351051523836",
    appId: "1:351051523836:web:27481824d689a556c4d979"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()