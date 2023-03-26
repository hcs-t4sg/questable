import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import ClassTeacherModal from '../../components/teacher/ClassTeacherModal'

import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { getUserData } from '../../utils/mutations'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '../../components/global/Avatar'
import { Classroom, Player, PlayerWithEmail } from '../../types'
import { currentAvatar } from '../../utils/items'
import { useEffect, useState } from 'react'
import Loading from '../../components/global/Loading'

export default function ClassTeacher({
	player,
	classroom,
}: {
	player: Player
	classroom: Classroom
}) {
	const [students, setStudents] = useState<PlayerWithEmail[] | null>(null)
	//   const [teacher, setTeacher] = React.useState();

	useEffect(() => {
		// If a ref is only used in the onSnapshot call then keep it inside useEffect for cleanliness
		const playersRef = collection(db, `classrooms/${classroom.id}/players`)
		const playerQuery = query(playersRef)

		// Attach a listener to the teacher document
		const unsub = onSnapshot(playerQuery, (snapshot) => {
			const mapTeacher = async () => {
				// * Rewritten from a forEach call. old code commented
				const players = await Promise.all(
					snapshot.docs.map(async (player) => {
						const playerData = await getUserData(player.id)
						if (!playerData) {
							throw new Error('Player not found')
						}
						const email = playerData.email
						return {
							...player.data(),
							id: player.id,
							email: email,
						} as PlayerWithEmail
					}),
				)

				// let players = [];
				// for (const player of snapshot.docs) {
				//   const playerData = await getUserData(player.id);
				//   if (playerData) {
				//     const email = playerData.email;
				//     players.push({
				//       ...player.data(),
				//       id: player.id,
				//       email: email,
				//     } as PlayerWithEmail);
				//   }
				// }

				if (players) {
					// Await the resolution of all promises in the returned array
					// and then store them in the `students` state variable
					// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

					// remove hte teacher from the playersList
					const playersWithoutTeacher = players.filter((player) => player.role !== 'teacher')

					setStudents(playersWithoutTeacher)
				}
			}
			// Call the async `mapTeacher` function
			mapTeacher().catch(console.error)
		})
		return unsub
	}, [classroom, player])

	return (
		<>
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
			{students ? (
				students.map((student) => (
					<Card sx={{ width: 0.22, m: 2 }} key={student.id}>
						<CardContent>
							<Box
								sx={{
									height: 300,
									width: 200,
								}}
							>
								<Avatar outfit={currentAvatar(student)} />
							</Box>
							<Typography variant='body1'>Name: {student.name}</Typography>
							<Typography variant='body1'>Account Balance: {student.money}</Typography>
							<Typography variant='body1'>{student.email}</Typography>
							<ClassTeacherModal student={student} />
						</CardContent>
					</Card>
				))
			) : (
				<Grid item xs={12}>
					<Loading>Loading students...</Loading>
				</Grid>
			)}
		</>
	)
}
