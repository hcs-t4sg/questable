import { GoogleOAuthProvider } from 'google-oauth-gsi'

// Google classroom-related constants

// Store these environment variables in a .env.local file in the root directory.
// https://vitejs.dev/guide/env-and-mode.html
export const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID
export const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET
export const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
export const SCOPES =
	'https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.coursework.students.readonly https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.profile.emails'

export const googleProvider = new GoogleOAuthProvider({
	clientId: clientID,
	onScriptLoadError: () => console.log('onScriptLoadError'),
	onScriptLoadSuccess: () => console.log('onScriptLoadSuccess'),
})
