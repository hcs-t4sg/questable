// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import { getFirestore } from 'firebase/firestore'
import Layout from '../components/global/Layout'
import StyledFirebaseAuth from '../components/global/StyledFirebaseAuth'
import { clientID } from './google'
import { Grid, Typography } from '@mui/material'

// ! DO NOT CHANGE THIS FILE.

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// export let accessToken: any

// ! TRY THIS: https://stackoverflow.com/questions/72209749/react-google-identity-services

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: 'questable-34d85.firebaseapp.com',
	projectId: 'questable-34d85',
	storageBucket: 'questable-34d85.appspot.com',
	messagingSenderId: '904433822725',
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: 'G-DRESZ3V18Q',
}

// Configure FirebaseUI.
const uiConfig = {
	// Popup signin flow rather than redirect flow.
	signInFlow: 'popup',
	signInOptions: [
		{
			provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
		},
		{
			provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			clientId: clientID,
			scopes: ['https://www.googleapis.com/auth/classroom.courses'],
		},
	],
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
			<Grid item xs={12}>
				<Typography variant='h3'>Sign in to Questable</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography variant='body1'>Please sign-in with your email account:</Typography>
			</Grid>
			<Grid item xs={12}>
				<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
			</Grid>
		</Layout>
	)
}
