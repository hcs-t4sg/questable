import { Grid, Typography, Box, Card, CardContent, useMediaQuery, useTheme } from '@mui/material'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { getUserData } from '../../utils/mutations'
import { useEffect, useState } from 'react'
import Avatar from '../../components/global/Avatar'
import { Classroom, Player, PlayerWithEmail } from '../../types'
import { currentAvatar } from '../../utils/items'
import Loading from '../../components/global/Loading'
import ClassStudentModal from '../../components/student/ClassStudentModal'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { levelUp } from '../../utils/helperFunctions'

export default function ClassStudent({
	player,
	classroom,
}: {
	player: Player
	classroom: Classroom
}) {
	const [students, setStudents] = useState<PlayerWithEmail[] | null>(null)
	const [leaders, setLeaders] = useState<PlayerWithEmail[] | null>(null)

	const theme = useTheme()
	const mobile = useMediaQuery(theme.breakpoints.down('mobile'))

	useEffect(() => {
		// If a ref is only used in the onSnapshot call then keep it inside useEffect for cleanliness
		const playerRef = collection(db, `classrooms/${classroom.id}/players`)
		const playerQuery = query(playerRef)

		// Attach a listener to the teacher document
		// TODO: Rewrite the promise.all call to prune the rejected users from the output array, not reject everything

		const unsub = onSnapshot(playerQuery, (snapshot) => {
			const mapTeacher = async () => {
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

				// Await the resolution of all promises in the returned array
				// and then store them in the `students` state variable
				// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

				// remove hte teacher from the playersList
				// for (let i = 0; i < players.length; i++) {
				//   if (players[i].role == "teacher") {
				//     players.splice(i, 1);
				//   }
				// }
				const studentList = players.filter((player) => player.role !== 'teacher')
				setStudents(studentList)

				const leadersList = players
					.filter((player) => player.role !== 'teacher')
					.sort((player1, player2) => player2.xp - player1.xp)
					.splice(0, classroom.leaderboardSize)

				setLeaders(leadersList)
			}
			// Call the async `mapTeacher` function
			mapTeacher().catch(console.error)
		})
		return unsub
	}, [player, classroom])

	return (
		<>
			<Grid item xs={12}>
				<Typography sx={{ fontSize: !mobile ? '50px' : '32px' }} variant='h2' component='div'>
					Class Page
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Card sx={{ width: 1 }}>
					<CardContent>
						<Typography
							sx={{
								[theme.breakpoints.down('mobile')]: {
									fontSize: '16px',
								},
							}}
							variant='h5'
							component='div'
						>
							{player.name}
						</Typography>{' '}
						{/* Do we want a separate user name?*/}
						<Typography
							sx={{
								[theme.breakpoints.down('mobile')]: {
									fontSize: '16px',
								},
							}}
							variant='h5'
							component='div'
						>
							{classroom.playerList.length} Total Students
						</Typography>
					</CardContent>
				</Card>
			</Grid>
			{classroom.doLeaderboard == true ? (
				<Grid item xs={12}>
					<TableContainer component={Paper}>
						<Table aria-label='simple table' sx={{ border: 'none' }}>
							<TableHead>
								<TableRow>
									<TableCell align='center'>Ranking</TableCell>
									<TableCell align='center'>Player</TableCell>
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
										<TableCell align='center'>{levelUp(leader.xp)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>
			) : (
				<Loading>Loading class leaderboard...</Loading>
			)}
			{students ? (
				students.map((student) => (
					<Grid item xs={3} key={student.id}>
						<Card sx={{ width: !mobile ? '350px' : '300px' }}>
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
								<ClassStudentModal player={student}></ClassStudentModal>
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
