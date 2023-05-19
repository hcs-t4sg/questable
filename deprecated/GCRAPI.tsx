// ! NOT USING LOADCLIENT AT THE MOMENT BECAUSE GAPI AUTH2 IS OUTDATED
import { gapi } from 'gapi-script'

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
