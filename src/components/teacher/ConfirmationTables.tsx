import { Tab, Tabs } from '@mui/material'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState, useEffect } from 'react'
import ConfirmRepeatablesTable from './ConfirmRepeatablesTable'
import ConfirmTasksTable from './ConfirmTasksTable'
import { Classroom, CompletedTask, RepeatableCompletion, Repeatable } from '../../types'
import { useSnackbar } from 'notistack'
import {
	confirmAllTasks,
	confirmAllRepeatables,
	getPlayerData,
	getPlayerTaskCompletion,
	getRepeatableCompletionTimes,
} from '../../utils/mutations'
// import { truncate } from '../../utils/helperFunctions'

import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../utils/firebase'

export default function ConfirmationTables({ classroom }: { classroom: Classroom }) {
	const [page, setPage] = useState(0)
	const [completedTasks, setCompletedTasks] = useState<CompletedTask[] | null>(null)
	const [completedRepeatables, setCompletedRepeatables] = useState<RepeatableCompletion[] | null>(
		null,
	)

	const { enqueueSnackbar } = useSnackbar()

	const handleTabChange = (event: React.SyntheticEvent, newTabIndex: number) => {
		setPage(newTabIndex)
	}
	useEffect(() => {
		if (page == 0) {
			const completedTasksQuery = query(
				collection(db, `classrooms/${classroom.id}/tasks`),
				where('completed', '!=', []),
			)
			const unsub = onSnapshot(completedTasksQuery, (snapshot) => {
				const fetchCompletedTasks = async () => {
					const completedTasksList: CompletedTask[] = []

					await Promise.all(
						snapshot.docs.map(async (doc) => {
							const completedPlayerList = doc.data().completed as string[]
							await Promise.all(
								completedPlayerList.map(async (playerID) => {
									const completionTime = await getPlayerTaskCompletion(
										classroom.id,
										doc.id,
										playerID,
									)
									const player = await getPlayerData(classroom.id, playerID)

									if (completionTime && player) {
										const completedTask = {
											...doc.data(),
											id: doc.id,
											player,
											completionTime,
										}
										completedTasksList.push(completedTask as CompletedTask)
									}
								}),
							)
						}),
					)

					console.log(completedTasksList)
					setCompletedTasks(completedTasksList)
				}
				fetchCompletedTasks().catch(console.error)
			})

			return unsub
		} else {
			const repeatablesRef = collection(db, `classrooms/${classroom.id}/repeatables`)
			const repeatablesWithPendingRequestsQuery = query(
				repeatablesRef,
				where('requestCount', '>', 0),
			)

			const unsub = onSnapshot(repeatablesWithPendingRequestsQuery, (snapshot) => {
				const fetchCompletedRepeatables = async () => {
					const allCompletedRepeatables: RepeatableCompletion[] = []

					console.log(snapshot.docs)

					await Promise.all(
						snapshot.docs.map(async (doc) => {
							console.log(doc.data())
							const completionTimes = await getRepeatableCompletionTimes(classroom.id, doc.id)

							await Promise.all(
								completionTimes.map(async (completionTime) => {
									const player = await getPlayerData(classroom.id, completionTime.playerID)

									if (player) {
										const repeatableCompletion = {
											id: completionTime.id,
											repeatable: { ...doc.data(), id: doc.id } as Repeatable,
											player: player,
											time: completionTime.time,
										}

										allCompletedRepeatables.push(repeatableCompletion)
									}
								}),
							)
						}),
					)

					setCompletedRepeatables(allCompletedRepeatables)
				}
				fetchCompletedRepeatables().catch(console.error)
			})

			return unsub
		}
	}, [classroom, page])

	const handleConfirmAll = () => {
		if (completedTasks && page == 0) {
			confirmAllTasks(completedTasks, classroom.id)
				.then(() => {
					enqueueSnackbar('All tasks confirmed', { variant: 'success' })
				})
				.catch((err) => {
					console.error(err)
					enqueueSnackbar('There was an error confirming the task completion.', {
						variant: 'error',
					})
				})
		}

		if (completedRepeatables && page != 0) {
			confirmAllRepeatables(completedRepeatables, classroom.id)
				.then(() => {
					enqueueSnackbar('All tasks confirmed', { variant: 'success' })
				})
				.catch((err) => {
					console.error(err)
					enqueueSnackbar('There was an error confirming the repeatable completion.', {
						variant: 'error',
					})
				})
		}
	}

	return (
		<Grid item xs={12}>
			<Typography variant='h4'>Tasks/Repeatables Awaiting Confirmation</Typography>
			<Stack direction='row' sx={{ justifyContent: 'space-between', display: 'flex' }}>
				<Tabs value={page} onChange={handleTabChange}>
					<Tab label='One Time' />
					<Tab label='Repeatable' />
				</Tabs>
				<Button sx={{ mb: 2 }} color='primary' onClick={() => handleConfirmAll()}>
					Confirm All
				</Button>
			</Stack>

			{page === 0 ? (
				<ConfirmTasksTable classroom={classroom} completedTasks={completedTasks} />
			) : (
				<ConfirmRepeatablesTable
					classroom={classroom}
					completedRepeatables={completedRepeatables}
				/>
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
