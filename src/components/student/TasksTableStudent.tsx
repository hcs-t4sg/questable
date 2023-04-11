import { Box, Tab, Tabs } from '@mui/material'
// import CheckBoxIcon from '@mui/icons-material/CheckBox'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { format } from 'date-fns'
import { useState } from 'react'
import { Classroom, Player, TaskWithStatus } from '../../types'
import { completeTask } from '../../utils/mutations'
// import TaskModalStudent from './TaskModalStudent'
import { useSnackbar } from 'notistack'
import Paper from '@mui/material/Paper'
import { truncate } from '../../utils/helperFunctions'
import TaskModalStudent from './TaskModalStudent'
import { rewardPotion } from './AssignmentContentStudent'
import Fuse from 'fuse.js'

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	}
}

export default function TasksTableStudent({
	assigned,
	completed,
	confirmed,
	overdue,
	classroom,
	player,
	searchInput,
}: {
	assigned: TaskWithStatus[]
	completed: TaskWithStatus[]
	confirmed: TaskWithStatus[]
	overdue: TaskWithStatus[]
	classroom: Classroom
	player: Player
	searchInput: string
}) {
	const { enqueueSnackbar } = useSnackbar()

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

	// Handle task completion
	const handleTaskComplete = (task: TaskWithStatus) => {
		// Call the `completeTask` mutation
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

	console.log(assigned)
	return (
		<Box>
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
										<TableCell align='left'>{rewardPotion(task.reward)}</TableCell>
										<TableCell align='left'>{task.name}</TableCell>
										<TableCell align='left'>
											{/* {task.description || 'None'} */}
											{truncate(task.description) || 'None'}
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
											{/* <TaskModalStudent task={task} classroom={classroom} player={player} /> */}
											<TaskModalStudent classroom={classroom} player={player} task={task} />
										</TableCell>
										{taskCategory === 0 ? (
											<TableCell align='center'>
												{/* <IconButton onClick={() => handleTaskComplete(task)}>
													<CheckBoxIcon />
												</IconButton> */}
												<Checkbox onChange={() => handleTaskComplete(task)} />
											</TableCell>
										) : null}
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
		</Box>
	)
}
