import { Grid, Typography } from '@mui/material'
import Layout from './Layout'

export default function Error({ message }: { message: string }) {
	return (
		<Layout>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Typography variant='body1'>{message}</Typography>
				</Grid>
			</Grid>
		</Layout>
	)
}
