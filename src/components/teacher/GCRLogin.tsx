import { Typography } from '@mui/material'
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { useState } from 'react'
import jwt_decode from 'jwt-decode'
import { clientID } from '../../utils/google'

// need to fully understand https://www.youtube.com/watch?v=HtJKUQXmtok&ab_channel=CooperCodes

// or switch to newer https://www.npmjs.com/package/@react-oauth/google

interface JwtType {
	email: string
}

export default function GCRLogin() {
	const [isSignedIn, setIsSignedIn] = useState(false)
	const [email, setEmail] = useState('')

	const handleSuccess = (credentialResponse: CredentialResponse) => {
		console.log(credentialResponse)
		console.log('hello')
		setIsSignedIn(true)
		const cred = credentialResponse.credential
		if (cred) {
			const userObject = jwt_decode<JwtType>(cred)
			console.log(userObject)
			setEmail(userObject.email)
		}
	}

	return (
		<GoogleOAuthProvider clientId={clientID}>
			{isSignedIn ? <Typography variant='h5'>Signed in as {email}</Typography> : null}
			<GoogleLogin
				onSuccess={handleSuccess}
				onError={() => {
					console.log('Login Failed')
				}}
			/>
		</GoogleOAuthProvider>
	)
}
