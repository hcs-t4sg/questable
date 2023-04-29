/* eslint-disable camelcase */
import { Button, Typography } from '@mui/material'
import { SCOPES, clientID, clientSecret, googleProvider } from './google'
import { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { User } from 'firebase/auth'

export let accessToken: any

export default function GoogleLogin({ user }: { user: User }) {
	const [isSignedIn, setIsSignedIn] = useState(false)
	// const [email, setEmail] = useState('')

	const fetchAccessTokens = async (authorizationCode: string) => {
		const response = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			body: JSON.stringify({
				client_id: clientID,
				client_secret: clientSecret,
				code: authorizationCode,
				grant_type: 'authorization_code',
				redirect_uri: 'http://localhost:5173',
			}),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})

		const data = await response.json()
		console.log(data)
		accessToken = data.access_token
		console.log(accessToken)
		return
	}

	const login = googleProvider.useGoogleLogin({
		flow: 'auth-code',
		scope: SCOPES,
		onSuccess: (res) => {
			console.log('Logged in with google', res)
			setIsSignedIn(true)
			fetchAccessTokens(res.code).catch(console.error)
			console.log(res.code)

			const userRef = doc(db, 'users', user.uid)
			const data = {
				gcrToken: accessToken,
			}
			setDoc(userRef, data, { merge: true })
		},
		onError: (err) => console.error('Failed to login with google', err),
	})

	return (
		<>
			<Button
				onClick={() => {
					login()
				}}
			>
				Log into Google
			</Button>
			<Typography variant='body1'>{isSignedIn ? 'Signed in!' : 'Not signed in'}</Typography>
		</>
	)
}
