// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAhUobTV_vnl1qS3Y2WMR68N3JBAROnJw",
  authDomain: "pantry-chef-37zay.firebaseapp.com",
  projectId: "pantry-chef-37zay",
  storageBucket: "pantry-chef-37zay.appspot.com",
  messagingSenderId: "657462401350",
  appId: "1:657462401350:web:91fd6762c4435739baad47"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider };
