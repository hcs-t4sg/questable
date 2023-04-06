import { Box, Button } from '@mui/material'
// import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../../utils/firebase'

export const clientID = '104855113016-3noojc4bmbk66foqac9pjf44vm3lbnlr.apps.googleusercontent.com'

// need to fully understand https://www.youtube.com/watch?v=HtJKUQXmtok&ab_channel=CooperCodes

// or switch to newer https://www.npmjs.com/package/@react-oauth/google

export default function GCRLogin() {
	const provider = new GoogleAuthProvider()

	const signInWithGoogle = () => {
		signInWithPopup(auth, provider)
			.then((result) => {
				console.log(result)
			})
			.catch((error) => console.log(error))
	}
	// const onSuccess = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
	// 	console.log('Login success! res: ', res)
	// }
	// const onFailure = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
	// 	console.log('Login failure! res: ', res)
	// }
	return (
		<Box>
			<Button variant='contained' onClick={signInWithGoogle}>
				Sign in with Google
			</Button>

			{/* <GoogleLogin
				clientId={clientID}
				buttonText='Login with Google'
				onSuccess={onSuccess}
				onFailure={onFailure}
				cookiePolicy={'single_host_origin'}
				isSignedIn={true}
			/> */}
		</Box>
	)
}
