// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import "firebase/compat/firestore";
import { getFirestore } from "firebase/firestore";
import StyledFirebaseAuth from '../components/StyledFirebaseAuth.tsx';
import Layout from '../components/Layout.js';

// ! DO NOT CHANGE THIS FILE.

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
   apiKey: "AIzaSyD3v0oikzBtnyz7DHcDool2gtvRw48Z_kk",
   authDomain: "questable-34d85.firebaseapp.com",
   projectId: "questable-34d85",
   storageBucket: "questable-34d85.appspot.com",
   messagingSenderId: "904433822725",
   appId: "1:904433822725:web:fe9f5fd649a9f5d2bb806c",
   measurementId: "G-DRESZ3V18Q"
};

// Configure FirebaseUI.
const uiConfig = {
   // Popup signin flow rather than redirect flow.
   signInFlow: 'popup',
   signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
   ],
   callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false,
   },
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export Firestore database
export const db = getFirestore();

// Export FirebaseUI signin screen
export function SignInScreen() {
   return (
      <Layout>
         <h1>Sign in to Questable</h1>
         <p>Please sign-in with your email account:</p>
         <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </Layout>
   );
}