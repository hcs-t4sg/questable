import { Box } from '@mui/material'
// import { useSnackbar } from 'notistack'
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login'

export const clientID = '104855113016-3noojc4bmbk66foqac9pjf44vm3lbnlr.apps.googleusercontent.com'
export const API_KEY = 'AIzaSyDzA5DkKC8gBEv9ImQ8QctoWSZXILTKYkw'
export const SCOPES = [
	'https://www.googleapis.com/auth/classroom.coursework.me',
	'https://www.googleapis.com/auth/classroom.coursework.students',
	'https://www.googleapis.com/auth/classroom.courseworkmaterials	',
]

// need to fully understand https://www.youtube.com/watch?v=HtJKUQXmtok&ab_channel=CooperCodes

// or switch to newer https://www.npmjs.com/package/@react-oauth/google

export default function GCRLogin() {
	const onSuccess = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
		console.log('Login success! res: ', res)
		window.confirm('Logged in!')
	}

	const onFailure = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
		console.log('Login failure! res: ', res)
	}

	return (
		<Box>
			<GoogleLogin
				clientId={clientID}
				buttonText='Log in with Google'
				onSuccess={onSuccess}
				onFailure={onFailure}
				cookiePolicy={'single_host_origin'}
				isSignedIn={false}
			/>
		</Box>
	)
}
