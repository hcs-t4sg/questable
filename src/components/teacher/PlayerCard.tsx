import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { User } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Classroom, Player } from '../../types'
import { db } from '../../utils/firebase'
import PlayerModal from './PlayerModal'

export default function PlayerCard({
	player,
	user,
	classroom,
}: {
	player: Player
	user: User
	classroom: Classroom
}) {
	const [name, setName] = useState(player.name)
	// const [money, setMoney] = useState(player.money);
	// const [role, setRole] = useState(player.role);

	useEffect(() => {
		const playerRef = doc(db, `classrooms/${classroom.id}/players/${player.id}`)
		const unsub = onSnapshot(playerRef, (doc) => {
			if (doc.exists()) {
				setName(doc.data().name)
			}
		})
		return unsub
	}, [classroom, player])

	return (
		<Card sx={{ width: 1 }}>
			<CardContent>
				<Typography variant='h5' component='div'>
					{name}
				</Typography>
				<Typography variant='h6' component='div'>
					Email: {user.email}
				</Typography>
				<Typography variant='h6' component='div'>
					Money: {player.money}
				</Typography>
			</CardContent>
			<CardActions>
				<PlayerModal player={player} user={user} classroom={classroom} />
			</CardActions>
		</Card>
	)
}
