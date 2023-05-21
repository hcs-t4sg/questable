import { Grid, Typography, useMediaQuery, useTheme } from '@mui/material'
import PlayerCard from '../../components/global/PlayerCard'

import { User } from 'firebase/auth'
import { Classroom, Player } from '../../types'

// Route for displaying classroom-specific student settings

export default function StudentSettings({
	player,
	classroom,
	user,
}: {
	player: Player
	classroom: Classroom
	user: User
}) {
	const theme = useTheme()
	const mobile = useMediaQuery(theme.breakpoints.down('mobile'))
	return (
		<Grid item xs={12}>
			<Typography sx={{ fontSize: !mobile ? '32px' : '18px' }} variant='h4'>
				Student Profile
			</Typography>
			<PlayerCard player={player} user={user} classroom={classroom} />
		</Grid>
	)
}
