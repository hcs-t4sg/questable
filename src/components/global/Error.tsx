import { Grid, Typography } from '@mui/material'
import Layout from './Layout'
import Loading from './Loading'

// Error page
// Note: We put all of the loading indicators on here for fun during demos, but it's probably best to remove them at some point for production LOL

export default function Error({ message }: { message: string }) {
	return (
		<Layout>
			<Grid item xs={12}>
				<Loading indicator='cow'>
					<Loading indicator='chicken'>
						<Loading indicator='ghost'>
							<Loading indicator='pig'>
								<Loading indicator='sheep'>
									<Loading indicator='bunny'>
										<Typography variant='body1'>{message}</Typography>
									</Loading>
								</Loading>
							</Loading>
						</Loading>
					</Loading>
				</Loading>
			</Grid>
		</Layout>
	)
}
