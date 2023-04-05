import { Tab, Tabs } from '@mui/material'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Classroom } from '../../types'
import ConfirmRepeatablesTable from './ConfirmRepeatablesTable'
import ConfirmTasksTable from './ConfirmTasksTable'
// import { truncate } from '../../utils/helperFunctions'

export default function ConfirmationTables({ classroom }: { classroom: Classroom }) {
	const [page, setPage] = useState(0)

	const handleTabChange = (event: React.SyntheticEvent, newTabIndex: number) => {
		setPage(newTabIndex)
	}

	return (
		<Grid item xs={12}>
			<Typography variant='h4'>Tasks/Repeatables Awaiting Confirmation</Typography>

			<Tabs value={page} onChange={handleTabChange}>
				<Tab label='One Time' />
				<Tab label='Repeatable' />
			</Tabs>

			{page === 0 ? (
				<ConfirmTasksTable classroom={classroom} />
			) : (
				<ConfirmRepeatablesTable classroom={classroom} />
			)}
		</Grid>
	)
}

// // One Time Tasks
// 				<TableContainer component={Paper}>
// 					<Table sx={{ minWidth: 650 }} aria-label='simple table'>
// 						<TableHead>
// 							<TableRow>
// 								<TableCell align='center'>Task</TableCell>
// 								<TableCell align='center'>Description</TableCell>
// 								<TableCell align='center'>Status</TableCell>
// 								<TableCell align='center'>Reward</TableCell>
// 								<TableCell align='center'>Student</TableCell>
// 								<TableCell align='center'>Confirm?</TableCell>
// 							</TableRow>
// 						</TableHead>
// 						<TableBody>
// 							{/* For each task, map over player IDs in completed array, then map over players with IDs in that array. */}
// 							{completedTasks.map((task) => {
// 								return task.completed?.map((playerID) => {
// 									const playersCompleted = playerData.filter((player) => player.id === playerID)
// 									return playersCompleted.map((player) => (
// 										<TableRow
// 											key={'test'}
// 											sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
// 										>
// 											<TableCell align='center'>{task.name}</TableCell>
// 											<TableCell align='center'>{truncate(task.description)}</TableCell>
// 											<TableCell align='center'>{formatStatus(task, player.id)}</TableCell>
// 											<TableCell align='center'>{task.reward}</TableCell>
// 											<TableCell align='center' component='th' scope='row'>
// 												{player.name}
// 											</TableCell>
// 											<TableCell align='center'>
// 												<Button
// 													onClick={() => confirmTask(classroom.id, player.id, task.id)}
// 													variant='contained'
// 												>
// 													Confirm
// 												</Button>
// 												<Button
// 													onClick={() => denyTask(classroom.id, player.id, task.id)}
// 													variant='contained'
// 													color='error'
// 												>
// 													Deny
// 												</Button>
// 											</TableCell>
// 										</TableRow>
// 									))
// 								})
// 							})}
// 						</TableBody>
// 					</Table>
// 				</TableContainer>

// function truncate(description: string) {
// 	if (description.length > 40) {
// 		return description.slice(0, 40) + '...'
// 	}
// 	return description
// }

// export default function ConfirmRepeatablesTable({ classroom }: { classroom: Classroom }) {
// 	const [completedRepeatables, setCompletedRepeatables] = useState<
// 		RepeatableWithPlayerCompletionsArray[]
// 	>([])
// 	const [playerData, setPlayerData] = useState<Player[]>([])

// 	useEffect(() => {
// 		// fetch player information
// 		const q = query(collection(db, `classrooms/${classroom.id}/players`))
// 		const unsubPlayers = onSnapshot(q, (snapshot) => {
// 			const playerDataFetch = async () => {
// 				const queryRes: Player[] = []
// 				snapshot.forEach((doc) => {
// 					// attach player ID to doc data for each player and push into array.
// 					queryRes.push(Object.assign({ id: doc.id }, doc.data()) as Player)
// 				})
// 				setPlayerData(queryRes)
// 			}
// 			playerDataFetch().catch(console.error)
// 		})

// 		const qr = query(collection(db, `classrooms/${classroom.id}/repeatables`))
// 		const unsubRepeatables = onSnapshot(qr, (snapshot) => {
// 			const cRepeatablesFetch = async () => {
// 				const queryRes: RepeatableWithPlayerCompletionsArray[] = []
// 				snapshot.forEach(async (doc) => {
// 					// Query the completions collection for each repeatable and store that data in an array.
// 					const completions: RepeatablePlayerCompletionsArray[] = []
// 					const completionsQuery = query(
// 						collection(db, `classrooms/${classroom.id}/repeatables/${doc.id}/playerCompletions`),
// 					)
// 					onSnapshot(completionsQuery, (completion) => {
// 						completion.forEach(async (item) => {
// 							completions.push({
// 								id: item.id,
// 								...item.data(),
// 							} as RepeatablePlayerCompletionsArray)
// 						})
// 					})

// 					queryRes.push(
// 						Object.assign(
// 							{ id: doc.id },
// 							{ ...doc.data(), playerCompletions: completions },
// 						) as RepeatableWithPlayerCompletionsArray,
// 					)
// 				})

// 				setCompletedRepeatables(queryRes)
// 			}
// 			cRepeatablesFetch().catch(console.error)
// 		})

// 		return function cleanup() {
// 			unsubPlayers()
// 			unsubRepeatables()
// 		}
// 	}, [classroom])

// 	const getPlayerNameFromID = (id: string) => {
// 		const player = playerData.filter((player) => player.id === id)
// 		if (player.length <= 0) {
// 			return 'Player not found'
// 		}
// 		return player[0].name
// 	}

// 	return (
// 		<TableContainer component={Paper}>
// 			<Table sx={{ minWidth: 650 }} aria-label='simple table'>
// 				<TableHead>
// 					<TableRow>
// 						<TableCell align='center'>Task</TableCell>
// 						<TableCell align='center'>Description</TableCell>
// 						<TableCell align='center'>Reward</TableCell>
// 						<TableCell align='center'>Student</TableCell>
// 						<TableCell align='center'>Confirm?</TableCell>
// 					</TableRow>
// 				</TableHead>
// 				<TableBody>
// 					{/* For each task, map over player IDs in completed array, then map over players with IDs in that array. */}
// 					{completedRepeatables.map((repeatable) => {
// 						return repeatable.playerCompletions.map((completion) => {
// 							const playerName = getPlayerNameFromID(completion.id)
// 							const rows = []
// 							for (let i = 0; i < completion.completions; i++) {
// 								rows.push(
// 									<TableRow
// 										key={'test'}
// 										sx={{
// 											'&:last-child td, &:last-child th': { border: 0 },
// 										}}
// 									>
// 										<TableCell align='center'>{repeatable.name}</TableCell>
// 										<TableCell align='center'>{truncate(repeatable.description)}</TableCell>
// 										<TableCell align='center'>{repeatable.reward}</TableCell>
// 										<TableCell align='center' component='th' scope='row'>
// 											{playerName}
// 										</TableCell>
// 										<TableCell align='center'>
// 											<Button
// 												onClick={() =>
// 													confirmRepeatable(classroom.id, completion.id, repeatable.id)
// 												}
// 												variant='contained'
// 											>
// 												Confirm
// 											</Button>
// 											<Button
// 												onClick={() => denyRepeatable(classroom.id, completion.id, repeatable.id)}
// 												variant='contained'
// 												color='error'
// 											>
// 												Deny
// 											</Button>
// 										</TableCell>
// 									</TableRow>,
// 								)
// 							}
// 							return rows
// 						})
// 					})}
// 				</TableBody>
// 			</Table>
// 		</TableContainer>
// 	)
// }
