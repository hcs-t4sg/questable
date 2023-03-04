import DeleteIcon from '@mui/icons-material/Delete'
import { LinearProgress } from '@mui/material'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { format, fromUnixTime } from 'date-fns'
import { collection, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Classroom, Task } from '../../types'
import { db } from '../../utils/firebase'
import { deleteTask } from '../../utils/mutations'
import TaskModalTeacher from './TaskModalTeacher'
import { ThemeProvider } from '@mui/material/styles'

import { tableTheme, BlankTableCell, StyledTableRow } from '../global/TaskTableStyles'

function truncate(description: string) {
	if (description.length > 50) {
		return description.slice(0, 50) + '...'
	}
	return description
}

function percentDone(task: Task) {
	const numCompleted = task.completed?.length
	const numAssigned = task.assigned?.length
	const numConfirmed = task.confirmed?.length
	return (numConfirmed / (numCompleted + numConfirmed + numAssigned)) * 100
}

function LinearProgressWithLabel({ task }: { task: Task }) {
	console.log(task)
	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<Box sx={{ minWidth: 100 }}>
				<Typography variant='body2' color='text.secondary'>{`${task.confirmed?.length}/${
					task.completed?.length + task.assigned?.length + task.confirmed?.length
				} students`}</Typography>
			</Box>
			<Box sx={{ minWidth: '50%', mr: 1 }}>
				<LinearProgress variant='determinate' value={percentDone(task)} />
			</Box>
		</Box>
	)
}

export default function TasksTableTeacher({ classroom }: { classroom: Classroom }) {
	// Create a state variable to hold the tasks
	const [tasks, setTasks] = useState<Task[]>([])
	useEffect(() => {
		const taskCollectionRef = collection(db, `classrooms/${classroom.id}/tasks`)
		const unsub = onSnapshot(taskCollectionRef, (snapshot) => {
			// Store the tasks in the `tasks` state variable
			setTasks(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Task)))
		})
		return unsub
	}, [classroom])

	const handleDelete = (task: Task) => {
		// message box to confirm deletion
		if (window.confirm('Are you sure you want to delete this task?')) {
			deleteTask(classroom.id, task.id).catch(console.error)
		}
	}
	return (
		<Grid item xs={12}>
			<ThemeProvider theme={tableTheme}>
				<TableContainer component={Paper}>
					<Table aria-label='simple table'>
						<TableHead>
							<TableRow>
								<BlankTableCell />
								<TableCell>Task</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>Deadline</TableCell>
								<TableCell>Reward </TableCell>
								<TableCell>Students Confirmed</TableCell>
								<BlankTableCell />
							</TableRow>
						</TableHead>
						<TableBody>
							{tasks?.map((task) => (
								// <TableRow key={task.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
								<StyledTableRow key={task.id}>
									<TableCell>
										<TaskModalTeacher task={task} classroom={classroom} />
									</TableCell>

									<TableCell component='th' scope='row'>
										{task.name}
									</TableCell>
									<TableCell>{truncate(task.description)}</TableCell>
									<TableCell>{format(fromUnixTime(task.due), 'MM/dd/yyyy')}</TableCell>
									<TableCell>{task.reward}</TableCell>
									<TableCell>
										<LinearProgressWithLabel task={task} />
									</TableCell>

									<TableCell align='right'>
										<IconButton onClick={() => handleDelete(task)}>
											<DeleteIcon />
										</IconButton>
									</TableCell>
								</StyledTableRow>
								// </TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</ThemeProvider>
		</Grid>
	)
}
