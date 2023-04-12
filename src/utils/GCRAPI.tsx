import { gapi } from 'gapi-script'

// Store as env variables at some point
export const clientID = '104855113016-3noojc4bmbk66foqac9pjf44vm3lbnlr.apps.googleusercontent.com'
export const API_KEY = 'AIzaSyDzA5DkKC8gBEv9ImQ8QctoWSZXILTKYkw'
export const SCOPES =
	// [
	// // View and manage announcements in Google Classroom
	// 'https://www.googleapis.com/auth/classroom.announcements',

	// // View announcements in Google Classroom
	// 'https://www.googleapis.com/auth/classroom.announcements.readonly',

	// See, edit, create, and permanently delete your Google Classroom classes
	'https://www.googleapis.com/auth/classroom.courses'

// // View your Google Classroom classes
// 'https://www.googleapis.com/auth/classroom.courses.readonly',

// // See, create and edit coursework items including assignments, questions, and grades
// 'https://www.googleapis.com/auth/classroom.coursework.me',

// // View your course work and grades in Google Classroom
// 'https://www.googleapis.com/auth/classroom.coursework.me.readonly',

// // Manage course work and grades for students in the Google Classroom classes you teach and view the course work and grades for classes you administer
// 'https://www.googleapis.com/auth/classroom.coursework.students',

// // View course work and grades for students in the Google Classroom classes you teach or administer
// 'https://www.googleapis.com/auth/classroom.coursework.students.readonly',

// // See, edit, and create classwork materials in Google Classroom
// 'https://www.googleapis.com/auth/classroom.courseworkmaterials',

// // See all classwork materials for your Google Classroom classes
// 'https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly',

// // View your Google Classroom guardians
// 'https://www.googleapis.com/auth/classroom.guardianlinks.me.readonly',

// // View and manage guardians for students in your Google Classroom classes
// 'https://www.googleapis.com/auth/classroom.guardianlinks.students',

// // View guardians for students in your Google Classroom classes
// 'https://www.googleapis.com/auth/classroom.guardianlinks.students.readonly',

// // View the email addresses of people in your classes
// 'https://www.googleapis.com/auth/classroom.profile.emails',

// // View the profile photos of people in your classes
// 'https://www.googleapis.com/auth/classroom.profile.photos',

// // Receive notifications about your Google Classroom data
// 'https://www.googleapis.com/auth/classroom.push-notifications',

// // Manage your Google Classroom class rosters
// 'https://www.googleapis.com/auth/classroom.rosters',

// // View your Google Classroom class rosters
// 'https://www.googleapis.com/auth/classroom.rosters.readonly',

// // View your course work and grades in Google Classroom
// 'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly',

// // View course work and grades for students in the Google Classroom classes you teach or administer
// 'https://www.googleapis.com/auth/classroom.student-submissions.students.readonly',

// // See, create, and edit topics in Google Classroom
// 'https://www.googleapis.com/auth/classroom.topics',

// // View topics in Google Classroom
// 'https://www.googleapis.com/auth/classroom.topics.readonly',
// ]

export function loadClient() {
	gapi.load('client:auth2', () => {
		console.log('loaded gapi client')

		gapi.client.init({
			apiKey: API_KEY,
			clientId: clientID,
			scope: SCOPES,
		})

		// gapi.auth2.authorize(
		// 	// eslint-disable-next-line camelcase
		// 	{ client_id: clientID, scope: SCOPES, immediate: true },
		// 	(authResult: any) => {
		// 		if (authResult && !authResult.error) {
		// 			/* handle successful authorization */
		// 			console.log('hello')
		// 		} else {
		// 			/* handle authorization error */
		// 			console.log('uhoh')
		// 		}
		// 	},
		// )

		gapi.client.load('classroom', 'v1', () => {
			// now we can use gapi.client.classroom
			console.log('gcr client loaded!')
		})
	})
}
