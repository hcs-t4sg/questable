import { Card, CardActions, CardContent, Typography, useMediaQuery } from '@mui/material'
import { User } from 'firebase/auth'
import { Classroom, Player } from '../../types'
import PlayerModal from '../teacher/PlayerModal'

export default function PlayerCard({
	player,
	user,
	classroom,
}: {
	player: Player
	user: User
	classroom: Classroom
}) {
	const mobile = useMediaQuery('(max-width:400px)')

	return (
		<Card sx={{ width: 1 }}>
			<CardContent>
				<Typography sx={{ fontSize: !mobile ? '20px' : '12px' }} variant='h5' component='div'>
					{player.name}
				</Typography>
				<Typography sx={{ fontSize: !mobile ? '20px' : '12px' }} variant='h6' component='div'>
					Email: {user.email}
				</Typography>
				<Typography sx={{ fontSize: !mobile ? '20px' : '12px' }} variant='h6' component='div'>
					Gold: {player.money}g
				</Typography>
			</CardContent>
			<CardActions>
				<PlayerModal player={player} user={user} classroom={classroom} />
			</CardActions>
		</Card>
	)
}
