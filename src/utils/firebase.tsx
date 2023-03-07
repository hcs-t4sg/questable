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
	apiKey: 'AIzaSyAr_TVfp5az2Msf-hEruUAOJ-DJkuZkwzc',
	authDomain: 'questable-backup-two.firebaseapp.com',
	projectId: 'questable-backup-two',
	storageBucket: 'questable-backup-two.appspot.com',
	messagingSenderId: '1014342570095',
	appId: '1:1014342570095:web:10ffc692772ec15fc53d9a',
	measurementId: 'G-QC9L76ZHRY',
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
