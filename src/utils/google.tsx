import { GoogleOAuthProvider } from 'google-oauth-gsi'

// Store as env variables at some point
export const clientID = process.env.VITE_GOOGLE_CLIENT_ID as string
export const clientSecret = process.env.VITE_GOOGLE_CLIENT_SECRET
export const API_KEY = process.env.VITE_GOOGLE_API_KEY
export const SCOPES =
	'https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.coursework.students.readonly https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.profile.emails'

export const googleProvider = new GoogleOAuthProvider({
	clientId: clientID,
	onScriptLoadError: () => console.log('onScriptLoadError'),
	onScriptLoadSuccess: () => console.log('onScriptLoadSuccess'),
})
