// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import { getFirestore } from 'firebase/firestore'
import StyledFirebaseAuth from '../components/global/StyledFirebaseAuth'
import Layout from '../components/global/Layout'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// ! DO NOT CHANGE THIS FILE.

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyCMI5wKG6UWHY_qEFajWzr7tQH9HGnIDiw',
	authDomain: 'questable-backup.firebaseapp.com',
	projectId: 'questable-backup',
	storageBucket: 'questable-backup.appspot.com',
	messagingSenderId: '497509530700',
	appId: '1:497509530700:web:983cff096893a83bc388e9',
	measurementId: 'G-3XF4R6ZXBE',
}

// Configure FirebaseUI.
const uiConfig = {
	// Popup signin flow rather than redirect flow.
	signInFlow: 'popup',
	signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
	callbacks: {
		// Avoid redirects after sign-in.
		signInSuccessWithAuthResult: () => false,
	},
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Export Firestore database
export const db = getFirestore(app)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Export FirebaseUI signin screen
export function SignInScreen() {
	return (
		<Layout>
			<h1>Sign in to Questable</h1>
			<p>Please sign-in with your email account:</p>
			<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
		</Layout>
	)
}
