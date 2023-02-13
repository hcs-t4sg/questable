import MuiAppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, styled, ThemeProvider } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import ClassroomPage from './routes/ClassroomPage'
import Home from './routes/Home'
import Settings from './routes/Settings'
import { auth, SignInScreen } from './utils/firebase'
// make alias for greater readability
import { User } from 'firebase/auth'
import { syncUsers } from './utils/mutations'

// MUI styling constants

const AppBar = styled(MuiAppBar)(({ theme }) => ({
	zIndex: theme.zIndex.drawer + 1,
}))

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

// App.js is the homepage and handles top-level functions like user auth.

export default function App() {
	// User authentication functionality.
	const [currentUser, setCurrentUser] = useState<User | null>(null)
	// Listen to the Firebase Auth state and set the local state.
	useEffect(() => {
		const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
			if (user) {
				setCurrentUser(user)
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
			<Box sx={{ display: 'flex' }}>
				<CssBaseline />
				<AppBar position='absolute'>
					<Toolbar
						sx={{
							pr: '24px', // keep right padding when drawer closed
						}}
					>
						<Typography
							component={Link}
							to='/'
							variant='h6'
							color='inherit'
							noWrap
							sx={{ flexGrow: 1 }}
						>
							Questable
						</Typography>
						<Typography
							component='h1'
							variant='body1'
							color='inherit'
							noWrap
							sx={{
								marginRight: '20px',
								display: currentUser ? 'inline' : 'none',
							}}
						>
							Signed in as {auth.currentUser?.displayName}
						</Typography>
						<Button
							variant='contained'
							size='small'
							sx={{
								marginTop: '5px',
								marginBottom: '5px',
								marginRight: '20px',
							}}
							component={Link}
							to={'/settings'}
						>
							Settings
						</Button>
						<Button
							variant='contained'
							size='small'
							sx={{
								marginTop: '5px',
								marginBottom: '5px',
								display: currentUser ? 'inline' : 'none',
							}}
							onClick={() => auth.signOut()}
						>
							Log out
						</Button>
					</Toolbar>
				</AppBar>
				{currentUser ? (
					/* Navigation routes set by react router. This is placed in
          app.js rather than index.js so we can pass relevant top-level
          props to the elements */
					<Routes>
						<Route path='/' element={<Home user={currentUser} />} />
						<Route path='settings' element={<Settings />} />
						<Route path='class'>
							<Route path=':classID/*' element={<ClassroomPage user={currentUser} />} />
						</Route>
						{/* Catch-all route for any URLs that don't match an existing route */}
						<Route
							path='*'
							element={
								<main style={{ padding: '1rem' }}>
									<p>There&apos;s nothing here!</p>
								</main>
							}
						/>
					</Routes>
				) : (
					<SignInScreen></SignInScreen>
				)}
			</Box>
		</ThemeProvider>
	)
}


				// test comment
