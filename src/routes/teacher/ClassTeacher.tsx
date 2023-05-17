import { Grid, Typography, useMediaQuery, useTheme } from '@mui/material'

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
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { levelUp } from '../../utils/helperFunctions'

export default function ClassTeacher({
	player,
	classroom,
}: {
	player: Player
	classroom: Classroom
}) {
	const [students, setStudents] = useState<PlayerWithEmail[] | null>(null)
	const [leaders, setLeaders] = useState<PlayerWithEmail[] | null>(null)

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
					const leadersList = players
						.filter((player) => player.role !== 'teacher')
						.sort((player1, player2) => player2.xp - player1.xp)
						.splice(0, playersWithoutTeacher.length)

					setLeaders(leadersList)
				}
			}
			// Call the async `mapTeacher` function
			mapTeacher().catch(console.error)
		})
		return unsub
	}, [classroom, player])

	const theme = useTheme()
	const mobile = useMediaQuery(theme.breakpoints.down('mobile'))

	return (
		<>
			<Grid item xs={12}>
				<Typography sx={{ fontSize: !mobile ? '50px' : '32px' }} variant='h2' component='div'>
					Class Page
				</Typography>
			</Grid>
			{/* <Grid item xs={12}>
				<Typography variant='h2' component='div'>
					{classroom.name}
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Card sx={{ width: 1 }}>
					<CardContent>
						<Typography variant='h5' component='div'>
							{player.name}
						</Typography>{' '} */}
			{/* Do we want a separate user name?*/}
			{/* <Typography variant='h5' component='div'>
							{classroom.playerList.length} Total Students
						</Typography>
					</CardContent>
				</Card>
			</Grid> */}
			{classroom.doLeaderboard == true ? (
				<Grid item xs={12}>
					<TableContainer component={Paper}>
						<Table aria-label='simple table' sx={{ border: 'none' }}>
							<TableHead>
								<TableRow>
									{/* <TableCell sx={{ width: 60 }} /> */}
									<TableCell align='center'>Ranking</TableCell>
									<TableCell align='center'>Player</TableCell>
									<TableCell align='center'>Gold</TableCell>
									<TableCell align='center'>XP</TableCell>
									<TableCell align='center'>Level</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{leaders?.map((leader, i: number) => (
									<TableRow
										key={leader.id}
										sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
									>
										<TableCell align='center'>{i + 1}</TableCell>
										<TableCell align='center'>{leader.name}</TableCell>
										<TableCell align='center'>{leader.money}</TableCell>
										<TableCell align='center'>{leader.xp}</TableCell>
										<TableCell align='center'>{levelUp(leader.xp)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>
			) : null}
			{students ? (
				students.map((student) => (
					<Grid item xs={3} key={student.id}>
						<Card sx={{ width: !mobile ? '300px' : '300px' }}>
							<CardContent>
								<Box
									sx={{
										height: 300,
										width: 200,
									}}
								>
									<Avatar outfit={currentAvatar(student)} />
								</Box>
								<Typography variant='body1'>Player Name: {student.name}</Typography>
								<Typography variant='body1'>Gold: {student.money}g</Typography>
								<Typography variant='body1'>{student.email}</Typography>
								<ClassTeacherModal player={student} classroom={classroom} />
							</CardContent>
						</Card>
					</Grid>
				))
			) : (
				<Grid item xs={12}>
					<Loading>Loading students...</Loading>
				</Grid>
			)}
		</>
	)
}
