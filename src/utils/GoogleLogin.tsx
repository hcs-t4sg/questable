/* eslint-disable camelcase */
import { Button } from '@mui/material'
import { SCOPES, clientID, clientSecret, googleProvider } from './google'
// import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import { User } from 'firebase/auth'
import { useSnackbar } from 'notistack'

export let accessToken: any

export default function GoogleLogin({ user }: { user: User }) {
	// const [isSignedIn, setIsSignedIn] = useState(false)
	// const [email, setEmail] = useState('')
	const { enqueueSnackbar } = useSnackbar()

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
		const userRef = doc(db, 'users', user.uid)
		updateDoc(userRef, {
			gcrToken: accessToken,
		})
		return
	}

	const login = googleProvider.useGoogleLogin({
		flow: 'auth-code',
		scope: SCOPES,
		onSuccess: (res) => {
			console.log('Logged in with google', res)
			// setIsSignedIn(true)
			fetchAccessTokens(res.code)
				.then(() => {
					enqueueSnackbar('Signed in!', { variant: 'success' })
				})
				.catch((err) => {
					console.error(err)
					enqueueSnackbar('There was an error signing in.', {
						variant: 'error',
					})
				})
			console.log(res.code)
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
			{/* This is confusing */}
			{/* <Typography variant='body1'>{isSignedIn ? 'Signed in!' : 'Not signed in'}</Typography> */}
		</>
	)
}
