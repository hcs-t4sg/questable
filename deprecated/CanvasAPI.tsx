import Button from '@mui/material/Button'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { auth } from '../src/utils/firebase'
// make alias for greater readability
import { User } from 'firebase/auth'
import { syncUsers } from '../src/utils/mutations'
import Grid from '@mui/material/Grid'

const mdTheme = createTheme({
	palette: {
		primary: {
			main: '#5299f0',
		},
		secondary: {
			main: '#94a7ff',
		},
	},
})

export default function CanvasApiLogin() {
	// User authentication functionality.
	const [currentUser, setCurrentUser] = useState<User | null>(null)
	// Listen to the Firebase Auth state and set the local state.
	useEffect(() => {
		const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
			setCurrentUser(user)
			if (user) {
				syncUsers(user)
			}
		})
		return () => unregisterAuthObserver() // Make sure we un-register Firebase observers when the component unmounts.
	}, [])

	useEffect(() => {
		console.log(currentUser)
	}, [currentUser])

	return (
		<ThemeProvider theme={mdTheme}>
			<Grid>
				<Button
					variant='contained'
					size='small'
					alighn-items='center'
					sx={{
						marginTop: '5px',
						marginBottom: '5px',
						display: currentUser ? 'inline' : 'none',
					}}
					onClick={() =>
						(location.href =
							'https://canvas.instructure.com/api/v1/courses?access_token=6936~SDn7S0P1jfbmfwL7AINV7LxyI2RZ8ysDQBYTSnZYjIsAgndC2q9ReajcY3YJwhvF')
					}
				>
					Login to Canvas
				</Button>
			</Grid>
		</ThemeProvider>
	)
}
