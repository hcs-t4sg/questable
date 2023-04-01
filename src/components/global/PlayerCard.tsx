import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
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
	return (
		<Card sx={{ width: 1 }}>
			<CardContent>
				<Typography variant='h5' component='div'>
					{player.name}
				</Typography>
				<Typography variant='h6' component='div'>
					Email: {user.email}
				</Typography>
				<Typography variant='h6' component='div'>
					Gold: {player.money}g
				</Typography>
			</CardContent>
			<CardActions>
				<PlayerModal player={player} user={user} classroom={classroom} />
			</CardActions>
		</Card>
	)
}
