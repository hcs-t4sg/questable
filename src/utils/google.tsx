import { GoogleOAuthProvider } from 'google-oauth-gsi'

// Store as env variables at some point
export const clientID = '104855113016-3noojc4bmbk66foqac9pjf44vm3lbnlr.apps.googleusercontent.com'
export const clientSecret = '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'
export const API_KEY = 'AIzaSyDzA5DkKC8gBEv9ImQ8QctoWSZXILTKYkw'
export const SCOPES =
	'https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.coursework.students.readonly https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.coursework.me'

export const googleProvider = new GoogleOAuthProvider({
	clientId: clientID,
	onScriptLoadError: () => console.log('onScriptLoadError'),
	onScriptLoadSuccess: () => console.log('onScriptLoadSuccess'),
})
