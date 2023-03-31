import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import PlayerCard from '../../components/teacher/PlayerCard'

import { User } from 'firebase/auth'
import { Classroom, Player } from '../../types'

export default function ClassSettings({
	player,
	classroom,
	user,
}: {
	player: Player
	classroom: Classroom
	user: User
}) {
	return (
		<>
			<Grid item xs={12}>
				<Typography variant='h4'>Teacher Profile</Typography>
				<PlayerCard player={player} user={user} classroom={classroom} />
			</Grid>
		</>
	)
}
