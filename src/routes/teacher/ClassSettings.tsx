import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import PlayerCard from '../../components/teacher/PlayerCard'

import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../utils/firebase'

import { User } from 'firebase/auth'
import { useState } from 'react'
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
	const [numStudents, setNumStudents] = useState<number | null>(null)

	const classroomRef = doc(db, `classrooms/${classroom.id}`)
	onSnapshot(classroomRef, (doc) => {
		if (doc.exists()) {
			setNumStudents(doc.data().playerList.length)
		}
	})

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
							{numStudents} Total Students
						</Typography>
					</CardContent>
				</Card>
			</Grid>
			<Grid item xs={12}>
				<Typography variant='h5'>Teacher Profile</Typography>
				<PlayerCard player={player} user={user} classroom={classroom} />
			</Grid>
		</Grid>
	)
}
