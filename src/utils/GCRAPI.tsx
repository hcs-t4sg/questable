// ! NOT USING AT THE MOMENT BECAUSE GAPI AUTH2 IS OUTDATED
import { gapi } from 'gapi-script'

// Store as env variables at some point
export const clientID = '104855113016-3noojc4bmbk66foqac9pjf44vm3lbnlr.apps.googleusercontent.com'
export const API_KEY = 'AIzaSyDzA5DkKC8gBEv9ImQ8QctoWSZXILTKYkw'
export const SCOPES =
	'https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.coursework.students.readonly https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.coursework.me'

export function loadClient() {
	gapi.load('client:auth2', () => {
		console.log('loaded gapi client')

		gapi.client.init({
			apiKey: API_KEY,
			clientId: clientID,
			discoveryDocs: ['https://classroom.googleapis.com/$discovery/rest?version=v1'],
			scope: SCOPES,
		})

		gapi.client.load('classroom', 'v1', () => {
			// now we can use gapi.client.classroom
			console.log('gcr client loaded!')
		})
	})

	gapi.auth2.getAuthInstance().signOut()
	if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
		gapi.auth2.getAuthInstance().signIn()
	}
}
