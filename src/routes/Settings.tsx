import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Layout from '../components/global/Layout'
import GoogleLogin from '../components/global/GoogleLogin'
import { User } from 'firebase/auth'

// Route displaying global user settings

export default function Settings({ user }: { user: User }) {
	return (
		<Layout>
			<Grid item xs={12}>
				<Typography variant='h2'>Settings</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography variant='h4'>Log into Google</Typography>
				<Typography variant='body1'>
					This allows you to import tasks from Google Classroom!
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<GoogleLogin user={user} />
			</Grid>
		</Layout>
	)
}
