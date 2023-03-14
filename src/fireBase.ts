// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdYSc52ClNoiH5zygAjhZb-N9VJ1P48Mo",
  authDomain: "crircktbookingapp.firebaseapp.com",
  projectId: "crircktbookingapp",
  storageBucket: "crircktbookingapp.appspot.com",
  messagingSenderId: "486780685822",
  appId: "1:486780685822:web:cdfd4c8bb3695565d2c4af"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const firestore = getFirestore(app);
 export default firestore;