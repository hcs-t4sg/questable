import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { format } from 'date-fns'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Classroom, Repeatable, RepeatableCompletion } from '../../types'
import { db } from '../../utils/firebase'
import {
	confirmRepeatable,
	denyRepeatable,
	getPlayerData,
	getRepeatableCompletionTimes,
} from '../../utils/mutations'

function truncate(description: string) {
	if (description.length > 40) {
		return description.slice(0, 40) + '...'
	}
	return description
}

export default function ConfirmRepeatablesTable({ classroom }: { classroom: Classroom }) {
	const [completedRepeatables, setCompletedRepeatables] = useState<RepeatableCompletion[]>([])

	useEffect(() => {
		const repeatablesRef = collection(db, `classrooms/${classroom.id}/repeatables`)
		const repeatablesWithPendingRequestsQuery = query(repeatablesRef, where('requestCount', '>', 0))

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
	}, [classroom])

	// useEffect(() => {
	// 	// fetch player information
	// 	const q = query(collection(db, `classrooms/${classroom.id}/players`))
	// 	const unsubPlayers = onSnapshot(q, (snapshot) => {
	// 		const playerDataFetch = async () => {
	// 			const queryRes: Player[] = []
	// 			snapshot.forEach((doc) => {
	// 				// attach player ID to doc data for each player and push into array.
	// 				queryRes.push(Object.assign({ id: doc.id }, doc.data()) as Player)
	// 			})
	// 			setPlayerData(queryRes)
	// 		}
	// 		playerDataFetch().catch(console.error)
	// 	})

	// 	const qr = query(collection(db, `classrooms/${classroom.id}/repeatables`))
	// 	const unsubRepeatables = onSnapshot(qr, (snapshot) => {
	// 		const cRepeatablesFetch = async () => {
	// 			const queryRes: RepeatableWithPlayerCompletionsArray[] = []
	// 			snapshot.forEach(async (doc) => {
	// 				// Query the completions collection for each repeatable and store that data in an array.
	// 				const completions: RepeatablePlayerCompletionsArray[] = []
	// 				const completionsQuery = query(
	// 					collection(db, `classrooms/${classroom.id}/repeatables/${doc.id}/playerCompletions`),
	// 				)
	// 				// ! FIX THIS. YOU CANNOT SET ONSNAPSHOT LISTENERS IN A FOR LOOP WITHOUT UNSUBSCRIPTION
	// 				onSnapshot(completionsQuery, (completion) => {
	// 					completion.forEach(async (item) => {
	// 						completions.push({
	// 							id: item.id,
	// 							...item.data(),
	// 						} as RepeatablePlayerCompletionsArray)
	// 					})
	// 				})

	// 				queryRes.push(
	// 					Object.assign(
	// 						{ id: doc.id },
	// 						{ ...doc.data(), playerCompletions: completions },
	// 					) as RepeatableWithPlayerCompletionsArray,
	// 				)
	// 			})

	// 			setCompletedRepeatables(queryRes)
	// 		}
	// 		cRepeatablesFetch().catch(console.error)
	// 	})

	// 	return function cleanup() {
	// 		unsubPlayers()
	// 		unsubRepeatables()
	// 	}
	// }, [classroom])

	// const getPlayerNameFromID = (id: string) => {
	// 	const player = playerData.filter((player) => player.id === id)
	// 	if (player.length <= 0) {
	// 		return 'Player not found'
	// 	}
	// 	return player[0].name
	// }

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label='simple table'>
				<TableHead>
					<TableRow>
						<TableCell align='center'>Repeatable</TableCell>
						<TableCell align='center'>Completion Time</TableCell>
						<TableCell align='center'>Description</TableCell>
						<TableCell align='center'>Reward</TableCell>
						<TableCell align='center'>Student</TableCell>
						<TableCell align='center'>Confirm?</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{/* For each task, map over player IDs in completed array, then map over players with IDs in that array. */}
					{completedRepeatables.map((completion) => (
						<TableRow
							key={completion.id}
							sx={{
								'&:last-child td, &:last-child th': { border: 0 },
							}}
						>
							<TableCell align='center'>{completion.repeatable.name}</TableCell>
							<TableCell align='center'>
								{format(new Date(completion.time.seconds * 1000), 'MM/dd/yyyy h:mm aa')}
							</TableCell>
							<TableCell align='center'>{truncate(completion.repeatable.description)}</TableCell>
							<TableCell align='center'>{completion.repeatable.reward}</TableCell>
							<TableCell align='center' component='th' scope='row'>
								{completion.player.name}
							</TableCell>
							<TableCell align='center'>
								<Button
									onClick={() =>
										confirmRepeatable(
											classroom.id,
											completion.player.id,
											completion.repeatable.id,
											completion.id,
										)
									}
									variant='contained'
								>
									Confirm
								</Button>
								<Button
									onClick={() =>
										denyRepeatable(
											classroom.id,
											completion.player.id,
											completion.repeatable.id,
											completion.id,
										)
									}
									variant='contained'
									color='error'
								>
									Deny
								</Button>
							</TableCell>
						</TableRow>

						// return repeatable.playerCompletions.map((completion) => {
						// 	const playerName = getPlayerNameFromID(completion.id)
						// 	const rows = []
						// 	for (let i = 0; i < completion.completions; i++) {
						// 		rows.push(
						// 			<TableRow
						// 				key={'test'}
						// 				sx={{
						// 					'&:last-child td, &:last-child th': { border: 0 },
						// 				}}
						// 			>
						// 				<TableCell align='center'>{repeatable.name}</TableCell>
						// 				<TableCell align='center'>{truncate(repeatable.description)}</TableCell>
						// 				<TableCell align='center'>{repeatable.reward}</TableCell>
						// 				<TableCell align='center' component='th' scope='row'>
						// 					{playerName}
						// 				</TableCell>
						// 				<TableCell align='center'>
						// 					<Button
						// 						onClick={() =>
						// 							confirmRepeatable(classroom.id, completion.id, repeatable.id)
						// 						}
						// 						variant='contained'
						// 					>
						// 						Confirm
						// 					</Button>
						// 					<Button
						// 						onClick={() => denyRepeatable(classroom.id, completion.id, repeatable.id)}
						// 						variant='contained'
						// 						color='error'
						// 					>
						// 						Deny
						// 					</Button>
						// 				</TableCell>
						// 			</TableRow>,
						// 		)
						// 	}
						// 	return rows
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
