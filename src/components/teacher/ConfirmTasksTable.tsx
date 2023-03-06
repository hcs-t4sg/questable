import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { formatDistance } from 'date-fns'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Classroom, CompletedTask } from '../../types'
import { db } from '../../utils/firebase'
import {
	confirmTask,
	denyTask,
	getPlayerData,
	getPlayerTaskCompletion,
} from '../../utils/mutations'
import { StyledTableRow } from '../../styles/TaskTableStyles'

function truncate(description: string) {
	if (description.length > 40) {
		return description.slice(0, 40) + '...'
	}
	return description
}

const formatStatus = (task: CompletedTask) => {
	const playerCompletion = task.completionTime

	if (playerCompletion.seconds > task.due) {
		return (
			formatDistance(new Date(playerCompletion.seconds * 1000), new Date(task.due * 1000)) + ' late'
		)
	} else {
		return 'On time'
	}
}

export default function ConfirmTasksTable({ classroom }: { classroom: Classroom }) {
	const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([])

	useEffect(() => {
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
								const completionTime = await getPlayerTaskCompletion(classroom.id, doc.id, playerID)
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
	}, [classroom])

	return (
		<TableContainer component={Paper}>
			<Table aria-label='simple table'>
				<TableHead>
					<TableRow>
						<TableCell>Task</TableCell>
						<TableCell>Description</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Reward</TableCell>
						<TableCell>Student</TableCell>
						<TableCell>Confirm?</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{/* For each task, map over player IDs in completed array, then map over players with IDs in that array. */}
					{completedTasks.map((completedTask) => (
						<StyledTableRow
							key={'test'}
							// sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							<TableCell>{completedTask.name}</TableCell>
							<TableCell>{truncate(completedTask.description)}</TableCell>
							<TableCell>{formatStatus(completedTask)}</TableCell>
							<TableCell>{completedTask.reward}</TableCell>
							<TableCell component='th' scope='row'>
								{completedTask.player.name}
							</TableCell>
							<TableCell align='center'>
								<Button
									onClick={() =>
										confirmTask(classroom.id, completedTask.player.id, completedTask.id)
									}
									// variant='contained'
								>
									Confirm
								</Button>
								<Button
									onClick={() => denyTask(classroom.id, completedTask.player.id, completedTask.id)}
									// variant='contained'
									color='error'
								>
									Deny
								</Button>
							</TableCell>
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
