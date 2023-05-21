import { Grid, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'

import ClassTeacherModal from '../../components/teacher/ClassTeacherModal'

import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { getUserData } from '../../utils/mutations/users'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useEffect, useState } from 'react'
import Avatar from '../../components/global/Avatar'
import Loading from '../../components/global/Loading'
import { Classroom, Player, PlayerWithEmail } from '../../types'
import { levelUp } from '../../utils/helperFunctions'
import { currentAvatar } from '../../utils/items'

// Route displaying class view for teacher

export default function ClassTeacher({
	player,
	classroom,
}: {
	player: Player
	classroom: Classroom
}) {
	// TODO: For future refactoring the leaders state variable can be removed as the leaders can just be calculated from the students list. It is better to have a single source of state from which other parameters are calculated rather than maintaining multiple state variables in sync
	const [students, setStudents] = useState<PlayerWithEmail[] | null>(null)
	const [leaders, setLeaders] = useState<PlayerWithEmail[] | null>(null)

	// Listen for list of students in classroom
	useEffect(() => {
		const playersRef = collection(db, `classrooms/${classroom.id}/players`)
		const playerQuery = query(playersRef)

		const unsub = onSnapshot(playerQuery, (snapshot) => {
			const fetchAllPlayerData = async () => {
				const players = await Promise.all(
					// Fetch user data (notably email) from list of students obtained from snapshot
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

				if (players) {
					// Await the resolution of all promises in the returned array
					// and then store them in the `students` state variable
					// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

					const playersWithoutTeacher = players.filter((player) => player.role !== 'teacher')

					setStudents(playersWithoutTeacher)
					const leadersList = players
						.filter((player) => player.role !== 'teacher')
						.sort((player1, player2) => player2.xp - player1.xp)
						.splice(0, playersWithoutTeacher.length)

					setLeaders(leadersList)
				}
			}
			fetchAllPlayerData().catch(console.error)
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
			{classroom.doLeaderboard == true ? (
				<Grid item xs={12}>
					<TableContainer component={Paper}>
						<Table aria-label='simple table' sx={{ border: 'none' }}>
							<TableHead>
								<TableRow>
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
					<Grid item xs={12} sm={6} md={4} lg={3} key={student.id}>
						<Card>
							<CardContent>
								<Stack direction='column'>
									<Box
										sx={{
											height: 200,
											width: 200,
											alignSelf: 'center',
											mb: 2,
										}}
									>
										<Avatar outfit={currentAvatar(student)} />
									</Box>
									<Typography
										noWrap
										sx={{
											[theme.breakpoints.down('mobile')]: {
												fontSize: '13px',
											},
										}}
										variant='body1'
									>
										Name: {student.name}
									</Typography>
									<Typography
										noWrap
										sx={{
											[theme.breakpoints.down('mobile')]: {
												fontSize: '13px',
											},
										}}
										variant='body1'
									>
										Gold: {student.money}g
									</Typography>
									<Typography
										noWrap
										sx={{
											[theme.breakpoints.down('mobile')]: {
												fontSize: '13px',
											},
										}}
										variant='body1'
									>
										{student.email}
									</Typography>
									<ClassTeacherModal player={student} classroom={classroom} />
								</Stack>
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
