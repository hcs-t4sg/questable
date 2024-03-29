/* eslint-disable camelcase */
import { Button } from '@mui/material'
import { SCOPES, clientID, clientSecret, googleProvider } from '../../utils/google'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { User } from 'firebase/auth'
import { useSnackbar } from 'notistack'

export let accessToken: any

// Google login button

export default function GoogleLogin({ user }: { user: User }) {
	const { enqueueSnackbar } = useSnackbar()

	const fetchAccessTokens = async (authorizationCode: string) => {
		const response = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			body: JSON.stringify({
				client_id: clientID,
				client_secret: clientSecret,
				code: authorizationCode,
				grant_type: 'authorization_code',
				redirect_uri: import.meta.env.DEV
					? 'http://localhost:5173'
					: 'https://questable.vercel.app',
			}),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})

		const data = await response.json()
		accessToken = data.access_token
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
		</>
	)
}
