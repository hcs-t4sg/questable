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
import { StyledTableRow } from '../../styles/TaskTableStyles'
import { Grid } from '@mui/material'
import Loading from '../global/Loading'
import { useSnackbar } from 'notistack'

function truncate(description: string) {
	if (description.length > 40) {
		return description.slice(0, 40) + '...'
	}
	return description
}

export default function ConfirmRepeatablesTable({ classroom }: { classroom: Classroom }) {
	const { enqueueSnackbar } = useSnackbar()

	const [completedRepeatables, setCompletedRepeatables] = useState<RepeatableCompletion[] | null>(
		null,
	)

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

	if (!completedRepeatables) {
		return <Loading>Loading repeatables...</Loading>
	}
	return (
		<TableContainer component={Paper}>
			<Table aria-label='simple table'>
				<TableHead>
					<TableRow>
						{/* align='center' before theme */}
						<TableCell>Repeatable</TableCell>
						<TableCell>Completion Time</TableCell>
						<TableCell>Description</TableCell>
						<TableCell>Reward</TableCell>
						<TableCell>Student</TableCell>
						<TableCell>Confirm?</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{/* For each task, map over player IDs in completed array, then map over players with IDs in that array. */}
					{completedRepeatables.map((completion) => (
						<StyledTableRow key={completion.id}>
							<TableCell align='center'>{completion.repeatable.name}</TableCell>
							<TableCell align='center'>
								{format(completion.time.toDate(), 'MM/dd/yyyy h:mm a')}
							</TableCell>
							<TableCell>{truncate(completion.repeatable.description)}</TableCell>
							<TableCell>{completion.repeatable.reward}</TableCell>
							<TableCell component='th' scope='row'>
								{completion.player.name}
							</TableCell>
							<TableCell align='center'>
								<Grid container columnSpacing={1}>
									<Grid item>
										<Button
											onClick={() =>
												confirmRepeatable(
													classroom.id,
													completion.player.id,
													completion.repeatable.id,
													completion.id,
												)
													.then(() => {
														enqueueSnackbar(
															`Confirmed task completion "${completion.repeatable.name}" from ${completion.player.name}!`,
															{ variant: 'success' },
														)
													})
													.catch((err) => {
														console.error(err)
														enqueueSnackbar(
															'There was an error confirming the repeatable completion.',
															{
																variant: 'error',
															},
														)
													})
											}
											color='success'
										>
											Confirm
										</Button>
									</Grid>
									<Grid item>
										<Button
											onClick={() =>
												denyRepeatable(
													classroom.id,
													completion.player.id,
													completion.repeatable.id,
													completion.id,
												)
													.then(() => {
														enqueueSnackbar(
															`Denied repeatable completion "${completion.repeatable.name}" from ${completion.player.name}!`,
															{ variant: 'default' },
														)
													})
													.catch((err) => {
														console.error(err)
														enqueueSnackbar(
															'There was an error denying the repeatable completion.',
															{
																variant: 'error',
															},
														)
													})
											}
											color='error'
										>
											Deny
										</Button>
									</Grid>
								</Grid>
							</TableCell>
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
