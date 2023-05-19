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
import { format } from 'date-fns'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Classroom, Task } from '../../types'
import { db } from '../../utils/firebase'
import { deleteTask } from '../../utils/mutations/tasks'
import TaskModalTeacher from './TaskModalTeacher'
import Fuse from 'fuse.js'

import { BlankTableCell, StyledTableRow } from '../../styles/TaskTableStyles'
import Loading from '../global/Loading'
import { enqueueSnackbar } from 'notistack'
import { truncate } from '../../utils/helperFunctions'

import createDOMPurify from 'dompurify'
const DOMPurify = createDOMPurify(window)

function percentDone(task: Task, players: number) {
	const numConfirmed = task.confirmed?.length
	return (numConfirmed / players) * 100
}

function LinearProgressWithLabel({ task, players }: { task: Task; players: number }) {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<Box sx={{ minWidth: 100 }}>
				<Typography
					variant='body2'
					color='text.secondary'
				>{`${task.confirmed?.length}/${players} students`}</Typography>
			</Box>
			<Box sx={{ minWidth: '50%', mr: 1, ml: 1 }}>
				<LinearProgress variant='determinate' value={percentDone(task, players)} />
			</Box>
		</Box>
	)
}

export default function TasksTableTeacher({
	classroom,
	searchInput,
}: {
	classroom: Classroom
	searchInput: string
}) {
	const [originaltasks, setOriginalTasks] = useState<Task[] | null>(null)
	const [tasks, setTasks] = useState<Task[] | null>(null)

	const [fuse, newFuse] = useState(new Fuse<Task>([]))

	const options = {
		keys: ['name', 'description'],
		includeScore: true,
		threshold: 0.4,
		minMatchCharLength: 3,
	}
	useEffect(() => {
		const taskCollectionRef = collection(db, `classrooms/${classroom.id}/tasks`)
		const taskCollectionQuery = query(taskCollectionRef, orderBy('created', 'desc'))
		const unsub = onSnapshot(taskCollectionQuery, (snapshot) => {
			const tasks = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Task))
			setOriginalTasks(tasks)
			setTasks(tasks)
			newFuse(new Fuse(tasks, options))
		})
		return unsub
	}, [classroom])

	useEffect(() => {
		if (searchInput != '') {
			setTasks(fuse.search(searchInput).map((elem) => elem.item))
		} else {
			setTasks(originaltasks)
		}
	}, [searchInput])

	const handleDelete = (task: Task) => {
		if (window.confirm('Are you sure you want to delete this task?')) {
			deleteTask(classroom.id, task.id)
				.then(() => {
					enqueueSnackbar('Deleted task!', { variant: 'success' })
				})
				.catch((err) => {
					console.error(err)
					enqueueSnackbar(err.message, { variant: 'error' })
				})
		}
	}

	return (
		<Grid item xs={12}>
			{tasks ? (
				<TableContainer component={Paper}>
					<Table aria-label='simple table'>
						<TableHead>
							<TableRow>
								<BlankTableCell />
								<TableCell>Task</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>Deadline</TableCell>
								<TableCell>Reward </TableCell>
								<TableCell>Confirmed</TableCell>
								<BlankTableCell />
								<BlankTableCell />
							</TableRow>
						</TableHead>
						<TableBody>
							{tasks.map((task) => (
								<StyledTableRow key={task.id}>
									<TableCell>
										<TaskModalTeacher task={task} classroom={classroom} />
									</TableCell>

									<TableCell component='th' scope='row'>
										{task.name}
									</TableCell>
									<TableCell>
										<div
											dangerouslySetInnerHTML={{
												__html: truncate(
													DOMPurify.sanitize(task.description).replace(/<[^>]+>/g, ''),
													40,
												),
											}}
										/>
									</TableCell>
									<TableCell align='left'>
										{format(task.due.toDate(), 'MM/dd/yyyy h:mm a')}
									</TableCell>
									<TableCell align='left'>{`${task.reward}g`}</TableCell>
									<TableCell align='left'>
										<LinearProgressWithLabel
											task={task}
											players={classroom.playerList.length - 1}
										/>
									</TableCell>

									<TableCell align='right'>
										<IconButton sx={{ ml: 2 }} onClick={() => handleDelete(task)}>
											<DeleteIcon />
										</IconButton>
									</TableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				<Loading>Loading tasks...</Loading>
			)}
		</Grid>
	)
}
