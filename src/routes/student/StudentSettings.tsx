import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import PlayerCard from '../../components/global/PlayerCard'

import { User } from 'firebase/auth'
import { Classroom, Player } from '../../types'

export default function StudentSettings({
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
				<Typography variant='h4'>Student Profile</Typography>
				<PlayerCard player={player} user={user} classroom={classroom} />
			</Grid>
		</>
	)
}
