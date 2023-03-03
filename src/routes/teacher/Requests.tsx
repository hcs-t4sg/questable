import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import ConfirmationTables from '../../components/teacher/ConfirmationTables'

import { Classroom, Player } from '../../types'

export default function Requests({ player, classroom }: { player: Player; classroom: Classroom }) {
	return (
		<Grid container spacing={3} sx={{ p: 5 }}>
			<Grid item xs={12}>
				<Typography variant='h2' component='div'>
					{classroom.name}
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Card sx={{ width: 1 }}>
					<CardContent>
						<Typography variant='h5' component='div'>
							{player.name}
						</Typography>{' '}
						{/* Do we want a separate user name?*/}
						<Typography variant='h5' component='div'>
							{classroom.playerList.length} Total Students
						</Typography>
					</CardContent>
				</Card>
			</Grid>

			<ConfirmationTables classroom={classroom} />
		</Grid>
	)
}
