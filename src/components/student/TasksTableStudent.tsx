import {
	Box,
	IconButton,
	Tab,
	Tabs,
	Button,
	Chip,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { Classroom, Player, TaskWithStatus } from '../../types'
import { unsendTask, completeTask } from '../../utils/mutations/tasks'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import Paper from '@mui/material/Paper'
import Fuse from 'fuse.js'
import { useSnackbar } from 'notistack'
import { truncate } from '../../utils/helperFunctions'
import { assignmentPotion } from '../../utils/items'
import TaskModalStudent from './TaskModalStudent'
import { a11yProps } from '../global/Tabs'
import Loading from '../global/Loading'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../../utils/firebase'

// Table containing student's tasks

export default function TasksTableStudent({
	classroom,
	player,
	searchInput,
}: {
	classroom: Classroom
	player: Player
	searchInput: string
}) {
	const { enqueueSnackbar } = useSnackbar()

	// Listen to classroom tasks and partition into assigned, completed, confirmed, and overdue lists of tasks
	const [assigned, setAssigned] = useState<TaskWithStatus[] | null>(null)
	const [completed, setCompleted] = useState<TaskWithStatus[] | null>(null)
	const [confirmed, setConfirmed] = useState<TaskWithStatus[] | null>(null)
	const [overdue, setOverdue] = useState<TaskWithStatus[] | null>(null)
	useEffect(() => {
		const q = query(collection(db, `classrooms/${classroom.id}/tasks`))
		const unsub = onSnapshot(q, (snapshot) => {
			const assigned: TaskWithStatus[] = []
			const completed: TaskWithStatus[] = []
			const confirmed: TaskWithStatus[] = []
			const overdue: TaskWithStatus[] = []

			// TODO rewrite using Promise.all
			snapshot.forEach((doc) => {
				// if task is overdue, add to overdue list
				if (doc.data().due.toDate() < new Date()) {
					overdue.push(Object.assign({ id: doc.id, status: 3 }, doc.data()) as TaskWithStatus)
				}
				// Find assigned, completed, and confirmed tasks using player's id.
				else if (doc.data().assigned?.includes(player.id)) {
					assigned.push(Object.assign({ id: doc.id, status: 0 }, doc.data()) as TaskWithStatus)
				} else if (doc.data().completed?.includes(player.id)) {
					completed.push(Object.assign({ id: doc.id, status: 1 }, doc.data()) as TaskWithStatus)
				} else if (doc.data().confirmed?.includes(player.id)) {
					confirmed.push(Object.assign({ id: doc.id, status: 2 }, doc.data()) as TaskWithStatus)
				} else {
					// If player not in any arrays, treat task as assigned
					// ! At the moment, this allows players who join classroom after task creation to still see task.
					// TODO: Given this logic, the 'assigned' property of tasks and repeatables is unnecessary and should be removed in the future.
					assigned.push(Object.assign({ id: doc.id, status: 0 }, doc.data()) as TaskWithStatus)
				}
			})
			setAssigned(assigned)
			setCompleted(completed)
			setConfirmed(confirmed)
			setOverdue(overdue)
		})
		return unsub
	}, [classroom.id, player.id])

	const [taskCategory, setTaskCategory] = useState<0 | 1 | 2 | 3>(0)
	const handleChangeTaskRep = (event: React.SyntheticEvent, newValue: 0 | 1) => {
		setTaskCategory(newValue)
	}

	const options = {
		keys: ['name', 'description'],
		includeScore: true,
		threshold: 0.4,
		minMatchCharLength: 3,
	}

	if (!(assigned && completed && confirmed && overdue)) {
		return <Loading>Loading tasks...</Loading>
	}

	let selectedTasks: TaskWithStatus[]
	if (taskCategory === 0) {
		selectedTasks = assigned
	} else if (taskCategory === 1) {
		selectedTasks = completed
	} else if (taskCategory === 2) {
		selectedTasks = confirmed
	} else {
		selectedTasks = overdue
	}
	const fuse = new Fuse(selectedTasks, options)

	if (searchInput != '') {
		selectedTasks = fuse.search(searchInput).map((elem) => elem.item)
	}

	const handleTaskComplete = (task: TaskWithStatus) => {
		if (window.confirm('Are you sure you want to mark this task as complete?')) {
			completeTask(classroom.id, task.id, player.id)
				.then(() => {
					enqueueSnackbar(`Task "${task.name}" marked as complete!`, { variant: 'success' })
				})
				.catch((err) => {
					console.error(err)
					enqueueSnackbar('There was an issue completing the task.', { variant: 'error' })
				})
		}
	}

	const handleUnsendTask = (task: TaskWithStatus) => {
		if (!task.completed.includes(player.id)) {
			enqueueSnackbar('There was an issue unsending the task', { variant: 'error' })
			return
		}

		if (window.confirm('Are you sure you want to unsend this task?')) {
			unsendTask(classroom.id, task.id, player.id)
				.then(() => {
					enqueueSnackbar(`Task "${task.name}" was unsent!`, { variant: 'success' })
				})
				.catch((err) => {
					console.error(err)
					enqueueSnackbar('There was an issue completing the task.', { variant: 'error' })
				})
		}
	}

	return (
		<>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={taskCategory} onChange={handleChangeTaskRep} aria-label='Task/repeatable tabs'>
					<Tab label='Assigned' {...a11yProps(0)} />
					<Tab label='Requested' {...a11yProps(1)} />
					<Tab label='Completed' {...a11yProps(2)} />
					<Tab label='Overdue' {...a11yProps(3)} />
				</Tabs>
			</Box>
			<Grid item xs={12}>
				<TableContainer component={Paper}>
					<Table aria-label='simple table' sx={{ border: 'none' }}>
						<TableHead>
							<TableRow>
								<TableCell sx={{ width: 60 }} />
								<TableCell>Name</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>Deadline</TableCell>
								<TableCell align='center'>Reward Amount</TableCell>
								<TableCell align='center'>Status</TableCell>
								<TableCell align='center'>Open</TableCell>
								{taskCategory === 1 ? <TableCell align='center'>Unsend request</TableCell> : null}
								{taskCategory === 0 ? <TableCell align='center'>Mark as Complete</TableCell> : null}
							</TableRow>
						</TableHead>
						<TableBody>
							{selectedTasks
								.filter((task) => task.status === taskCategory)
								.map((task) => (
									<TableRow
										key={task.id}
										sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
									>
										<TableCell align='left'>{assignmentPotion(task.reward)}</TableCell>
										<TableCell align='left'>{task.name}</TableCell>
										<TableCell align='left'>
											<div
												dangerouslySetInnerHTML={{
													__html: truncate(task.description.replace(/<[^>]+>/g, ''), 40),
												}}
											/>
										</TableCell>
										<TableCell align='left'>
											{format(task.due.toDate(), 'MM/dd/yyyy h:mm a')}
										</TableCell>
										<TableCell align='center'>{`${task.reward}g`}</TableCell>
										<TableCell align='center'>
											<Chip
												label={
													task.status === 0
														? 'Assigned'
														: task.status === 1
														? 'Completed'
														: task.status === 2
														? 'Confirmed'
														: 'Overdue'
												}
											/>
										</TableCell>
										<TableCell align='center'>
											<TaskModalStudent classroom={classroom} player={player} task={task} />
										</TableCell>
										{taskCategory === 0 ? (
											<TableCell align='center'>
												<IconButton onClick={() => handleTaskComplete(task)}>
													<CheckBoxIcon />
												</IconButton>
											</TableCell>
										) : null}
										{taskCategory === 1 && task.due.toDate() >= new Date() ? (
											<TableCell align='center'>
												<Button onClick={() => handleUnsendTask(task)} color='error'>
													Unsend
												</Button>
											</TableCell>
										) : null}
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
		</>
	)
}
