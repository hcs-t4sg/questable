import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useEffect, useState } from 'react'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { Classroom, Player, Task } from '../types'

export default function CompletedTasks({
	player,
	classroom,
}: {
	player: Player
	classroom: Classroom
}) {
	const [completedTasks, setCompletedTasks] = useState<Task[]>([])
	const [confirmedTasks, setConfirmedTasks] = useState<Task[]>([])

	useEffect(() => {
		// fetch task information
		const q = query(collection(db, `classrooms/${classroom.id}/tasks`))
		const unsub = onSnapshot(q, (snapshot) => {
			const taskFetch = async () => {
				const completed: Task[] = []
				const confirmed: Task[] = []
				snapshot.forEach((doc) => {
					// Find completed and confirmed tasks using player's id.
					if (doc.data().completed?.includes(player.id)) {
						completed.push(Object.assign({ id: doc.id }, doc.data()) as Task)
					}
					if (doc.data().confirmed?.includes(player.id)) {
						confirmed.push(Object.assign({ id: doc.id }, doc.data()) as Task)
					}
				})
				setCompletedTasks(completed)
				setConfirmedTasks(confirmed)
			}
			taskFetch().catch(console.error)
		})
		return unsub
	}, [classroom.id, player.id])

	return (
		<Grid item xs={12}>
			<Typography variant='h4'>Completed Tasks</Typography>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label='simple table'>
					<TableHead>
						<TableRow>
							<TableCell align='center'>Task</TableCell>
							<TableCell align='center'>Description</TableCell>
							<TableCell align='center'>Reward</TableCell>
							<TableCell align='center'>Status</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{completedTasks.map((task) => (
							<TableRow key={task.id}>
								<TableCell align='center'>{task.name}</TableCell>
								<TableCell align='center'>{task.description}</TableCell>
								<TableCell align='center'>{task.reward ? `$${task.reward}` : '-'}</TableCell>
								<TableCell align='center'>Awaiting confirmation</TableCell>
							</TableRow>
						))}
						{confirmedTasks.map((task) => (
							<TableRow key={task.id}>
								<TableCell align='center'>{task.name}</TableCell>
								<TableCell align='center'>{task.description}</TableCell>
								<TableCell align='center'>{task.reward ? `$${task.reward}` : '-'}</TableCell>
								<TableCell align='center'>Confirmed</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Grid>
	)
}
