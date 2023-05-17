import MuiAppBar from '@mui/material/AppBar'
import { Box, Button, CssBaseline, Typography, Toolbar } from '@mui/material'
import { createTheme, styled, ThemeProvider } from '@mui/material/styles'
import { useAuthUser } from '@react-query-firebase/auth'
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import ClassroomPage from './routes/ClassroomPage'
import Home from './routes/Home'
import Settings from './routes/Settings'
import { auth, SignInScreen } from './utils/firebase'
import Error from './components/global/Error'
import { SnackbarProvider } from 'notistack'
import { syncUsers } from './utils/mutations'
// make alias for greater readability
import { QueryClient, QueryClientProvider } from 'react-query'
import logo from './assets/logo.png'
import Avatar from '@mui/material/Avatar'
declare module '@mui/material/styles' {
	interface BreakpointOverrides {
		xs: true // removes the `xs` breakpoint
		sm: true
		md: true
		lg: true
		xl: true
		mobile: true // adds the `mobile` breakpoint
		tablet: true
		laptop: true
		desktop: true
	}
}

declare module '@mui/material/styles' {
	interface BreakpointOverrides {
		xs: true // removes the `xs` breakpoint
		sm: true
		md: true
		lg: true
		xl: true
		mobile: true // adds the `mobile` breakpoint
		tablet: true
		laptop: true
		desktop: true
	}
}

import 'virtual:fonts.css'

// MUI styling constants

const AppBar = styled(MuiAppBar)(({ theme }) => ({
	zIndex: theme.zIndex.drawer + 1,
}))

const mdTheme = createTheme({
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 900,
			lg: 1200,
			xl: 1536,
			mobile: 500,
			tablet: 950,
			laptop: 1024,
			desktop: 1200,
		},
	},
	palette: {
		primary: {
			main: '#4a2511',
		},
		secondary: {
			main: '#93a262',
		},
		success: {
			main: '#93a262',
		},
	},
	typography: {
		fontFamily: 'Andale Mono',
		h2: {
			fontFamily: 'Superscript',
		},
		h4: {
			paddingBottom: '10px',
			fontWeight: 'bold',
		},
	},
	components: {
		MuiTable: {
			styleOverrides: {
				root: {
					minWidth: 650,
					// backgroundColor: '#f3f8df',
				},
			},
		},
		MuiTableCell: {
			defaultProps: {
				align: 'left',
				// width: 0.01,
			},
		},
		MuiButton: {
			defaultProps: {
				variant: 'contained',
			},
		},
		MuiTypography: {
			styleOverrides: {
				root: {
					textDecoration: 1,
				},
			},
		},
		MuiListItemButton: {
			styleOverrides: {
				root: {
					'&$selected': {
						backgroundColor: 'red',
						'&:hover': {
							backgroundColor: 'orange',
						},
					},
				},
			},
		},
	},
})

// Initialize client
const queryClient = new QueryClient()

// App.js is the homepage and handles top-level functions like user auth.

export default function App() {
	const currentUser = useAuthUser(['user'], auth, {
		onSuccess(user) {
			if (user) {
				console.log('User is authenticated')
				syncUsers(user)
				console.log(currentUser)
			}
		},
	})
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={mdTheme}>
				<SnackbarProvider maxSnack={3}>
					<Box sx={{ display: 'flex' }}>
						<CssBaseline />
						<AppBar position='fixed' sx={{ height: 65 }}>
							<Toolbar
								sx={{
									pr: '24px', // keep right padding when drawer closed
								}}
							>
								<Link to='/'>
									<Avatar src={logo} />
								</Link>
								<Typography
									component={Link}
									to='/'
									variant='h6'
									color='inherit'
									noWrap
									sx={{ flexGrow: 1, fontFamily: 'Superscript', textDecoration: 'none' }}
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
										display: currentUser.data ? 'inline' : 'none',
									}}
								>
									Signed in as {currentUser.data?.displayName ?? ''}
								</Typography>
								<Button
									variant='contained'
									size='small'
									color='success'
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
									color='success'
									sx={{
										marginTop: '5px',
										marginBottom: '5px',
										display: currentUser.data ? 'inline' : 'none',
									}}
									onClick={() => {
										auth.signOut()
									}}
								>
									Log out
								</Button>
							</Toolbar>
						</AppBar>

						{currentUser.data ? (
							/* Navigation routes set by react router. This is placed in
          app.js rather than index.js so we can pass relevant top-level
          props to the elements */
							<Routes>
								<Route path='/' element={<Home user={currentUser.data} />} />
								<Route path='settings' element={<Settings user={currentUser.data} />} />
								<Route
									path='class/:classID/*'
									element={<ClassroomPage user={currentUser.data} />}
								/>
								{/* Catch-all route for any URLs that don't match an existing route */}
								<Route path='*' element={<Error message={'This page does not exist.'} />} />
							</Routes>
						) : (
							<SignInScreen></SignInScreen>
						)}
					</Box>
				</SnackbarProvider>
			</ThemeProvider>
		</QueryClientProvider>
	)
}
